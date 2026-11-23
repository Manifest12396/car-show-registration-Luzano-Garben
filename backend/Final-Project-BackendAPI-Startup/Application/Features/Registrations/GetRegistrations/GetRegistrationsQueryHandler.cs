namespace Application.Features.Registrations.GetRegistrations;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.Features.Registrations;
using Domain.Common;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

public sealed class GetRegistrationsQueryHandler(IAppDbContext dbContext)
    : IQueryHandler<GetRegistrationsQuery, Result<PagedRegistrationsResponse>>
{
    public async Task<Result<PagedRegistrationsResponse>> HandleAsync(
        GetRegistrationsQuery query,
        CancellationToken cancellationToken = default)
    {
        var registrations = dbContext.Registrations.AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.ParticipantName))
        {
            var name = query.ParticipantName.Trim().ToLower();
            registrations = registrations.Where(r => r.ParticipantName.ToLower().Contains(name));
        }
        if (!string.IsNullOrWhiteSpace(query.Type))
        {
            var type = Enum.Parse<RegistrationType>(query.Type.Trim(), true);
            registrations = registrations.Where(r => r.RegistrationType == type);
        }
        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            var status = Enum.Parse<RegistrationStatus>(query.Status.Trim(), true);
            registrations = registrations.Where(r => r.Status == status);
        }

        var totalCount = await registrations.CountAsync(cancellationToken);
        var totalPages = (int)Math.Ceiling(totalCount / (double)query.PageSize);
        var items = await registrations
            .OrderByDescending(r => r.RegistrationDate)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        var response = new PagedRegistrationsResponse(
            items.Select(RegistrationResponseMapper.Map).ToList(),
            query.Page,
            query.PageSize,
            totalCount,
            totalPages);

        return Result<PagedRegistrationsResponse>.Success(response);
    }
}
