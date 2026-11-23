namespace Application.Features.Registrations.DeleteRegistration;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Common;
using Microsoft.EntityFrameworkCore;

public sealed class DeleteRegistrationCommandHandler(IAppDbContext dbContext)
    : ICommandHandler<DeleteRegistrationCommand, Result>
{
    public async Task<Result> HandleAsync(
        DeleteRegistrationCommand command,
        CancellationToken cancellationToken = default)
    {
        var registration = await dbContext.Registrations
            .FirstOrDefaultAsync(r => r.Id == command.Id, cancellationToken);

        if (registration is null)
        {
            return Result.Failure(
                Error.NotFound("RegistrationNotFound", $"Registration {command.Id} was not found."));
        }

        dbContext.Registrations.Remove(registration);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
