namespace Application.Features.Registrations.GetRegistrationSummary;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Common;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

public sealed class GetRegistrationSummaryQueryHandler(IAppDbContext dbContext)
    : IQueryHandler<GetRegistrationSummaryQuery, Result<RegistrationSummaryResponse>>
{
    public async Task<Result<RegistrationSummaryResponse>> HandleAsync(
        GetRegistrationSummaryQuery query,
        CancellationToken cancellationToken = default)
    {
        var registrations = await dbContext.Registrations.ToListAsync(cancellationToken);
        var active = registrations.Where(r => r.Status != RegistrationStatus.Cancelled).ToList();
        var totalFees = active.Sum(r => r.RegistrationFee);
        var totalPayments = active.Sum(r => r.AmountPaid);

        return Result<RegistrationSummaryResponse>.Success(new RegistrationSummaryResponse(
            registrations.Count,
            registrations.Count(r => r.Status == RegistrationStatus.Confirmed),
            registrations.Count(r => r.Status == RegistrationStatus.CheckedIn),
            registrations.Count(r => r.Status == RegistrationStatus.Pending),
            registrations.Count(r => r.Status == RegistrationStatus.Cancelled),
            totalFees,
            totalPayments,
            totalFees - totalPayments));
    }
}
