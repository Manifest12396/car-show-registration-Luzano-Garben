namespace Application.Features.Registrations.GetRegistrations;

using Application.Abstractions.Messaging;
using Application.Features.Registrations;
using Domain.Common;

public sealed record GetRegistrationsQuery(
    string? ParticipantName,
    string? Type,
    string? Status,
    int Page = 1,
    int PageSize = 10) : IQuery<Result<PagedRegistrationsResponse>>;

public sealed record PagedRegistrationsResponse(
    IReadOnlyList<RegistrationResponse> Items,
    int Page,
    int PageSize,
    int TotalCount,
    int TotalPages);
