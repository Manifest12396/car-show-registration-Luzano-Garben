namespace Application.Features.Registrations.GetRegistrationById;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.Features.Registrations;
using Domain.Common;
using Microsoft.EntityFrameworkCore;

public sealed class GetRegistrationByIdQueryHandler(IAppDbContext dbContext)
    : IQueryHandler<GetRegistrationByIdQuery, Result<RegistrationResponse>>
{
    public async Task<Result<RegistrationResponse>> HandleAsync(
        GetRegistrationByIdQuery query,
        CancellationToken cancellationToken = default)
    {
        var registration = await dbContext.Registrations
            .FirstOrDefaultAsync(r => r.Id == query.Id, cancellationToken);
        return registration is null
            ? Result<RegistrationResponse>.Failure(
                Error.NotFound("RegistrationNotFound", $"Registration {query.Id} was not found."))
            : Result<RegistrationResponse>.Success(RegistrationResponseMapper.Map(registration));
    }
}
