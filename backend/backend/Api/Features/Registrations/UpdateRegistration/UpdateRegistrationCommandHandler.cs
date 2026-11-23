namespace Application.Features.Registrations.UpdateRegistration;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.Features.Registrations;
using Domain.Common;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

public sealed class UpdateRegistrationCommandHandler(IAppDbContext dbContext)
    : ICommandHandler<UpdateRegistrationCommand, Result<RegistrationResponse>>
{
    public async Task<Result<RegistrationResponse>> HandleAsync(
        UpdateRegistrationCommand command,
        CancellationToken cancellationToken = default)
    {
        var registration = await dbContext.Registrations
            .FirstOrDefaultAsync(r => r.Id == command.Id, cancellationToken);

        if (registration is null)
        {
            return Result<RegistrationResponse>.Failure(
                Error.NotFound("RegistrationNotFound", $"Registration {command.Id} was not found."));
        }

        var normalizedPlate = command.PlateNumber.Trim().ToUpperInvariant();
        var duplicate = await dbContext.Registrations.AnyAsync(
            r => r.Id != command.Id && r.PlateNumber.ToUpper() == normalizedPlate,
            cancellationToken);

        if (duplicate)
        {
            return Result<RegistrationResponse>.Failure(
                new Error("RegistrationConflict", "A registration with this plate number already exists."));
        }

        registration.ParticipantName = command.ParticipantName.Trim();
        registration.ContactNumber = command.ContactNumber.Trim();
        registration.Email = command.Email.Trim();
        registration.Address = command.Address.Trim();
        registration.CarMakeModel = command.CarMakeModel.Trim();
        registration.PlateNumber = normalizedPlate;
        registration.RegistrationType = command.RegistrationType;
        registration.Status = command.Status;
        registration.RegistrationFee = Registration.GetFee(command.RegistrationType);
        registration.AmountPaid = command.AmountPaid;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Result<RegistrationResponse>.Success(RegistrationResponseMapper.Map(registration));
    }
}
