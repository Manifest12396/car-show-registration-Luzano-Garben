namespace Application.Features.Registrations.CreateRegistration;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.Features.Registrations;
using Domain.Common;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

public sealed class CreateRegistrationCommandHandler(IAppDbContext dbContext)
    : ICommandHandler<CreateRegistrationCommand, Result<RegistrationResponse>>
{
    public async Task<Result<RegistrationResponse>> HandleAsync(
        CreateRegistrationCommand command,
        CancellationToken cancellationToken = default)
    {
        var normalizedPlate = command.PlateNumber.Trim().ToUpperInvariant();
        if (await dbContext.Registrations.AnyAsync(
                r => r.PlateNumber.ToUpper() == normalizedPlate,
                cancellationToken))
        {
            return Result<RegistrationResponse>.Failure(
                new Error("RegistrationConflict", "A registration with this plate number already exists."));
        }

        var lastNumber = await dbContext.Registrations
            .OrderByDescending(r => r.RegistrationNumber)
            .Select(r => r.RegistrationNumber)
            .FirstOrDefaultAsync(cancellationToken);
        var nextNumber = 1;
        if (lastNumber is not null &&
            int.TryParse(lastNumber.Replace("CS27-", "", StringComparison.Ordinal), out var parsed))
        {
            nextNumber = parsed + 1;
        }

        var fee = Registration.GetFee(command.RegistrationType);
        var registration = new Registration
        {
            Id = Guid.NewGuid(),
            RegistrationNumber = $"CS27-{nextNumber:0000}",
            RegistrationDate = DateTime.UtcNow,
            ParticipantName = command.ParticipantName.Trim(),
            ContactNumber = command.ContactNumber.Trim(),
            Email = command.Email.Trim(),
            Address = command.Address.Trim(),
            CarMakeModel = command.CarMakeModel.Trim(),
            PlateNumber = normalizedPlate,
            RegistrationType = command.RegistrationType,
            Status = RegistrationStatus.Pending,
            RegistrationFee = fee,
            AmountPaid = command.AmountPaid
        };

        dbContext.Registrations.Add(registration);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Result<RegistrationResponse>.Success(RegistrationResponseMapper.Map(registration));
    }
}
