namespace Application.Features.Registrations.GetRegistrations;

using FluentValidation;

public sealed class GetRegistrationsValidator : AbstractValidator<GetRegistrationsQuery>
{
    private static readonly HashSet<string> Types = new(StringComparer.OrdinalIgnoreCase)
        { "Exhibitor", "Competitor", "VIP" };
    private static readonly HashSet<string> Statuses = new(StringComparer.OrdinalIgnoreCase)
        { "Pending", "Confirmed", "CheckedIn", "Cancelled" };

    public GetRegistrationsValidator()
    {
        RuleFor(x => x.Page).GreaterThanOrEqualTo(1);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 50);
        RuleFor(x => x.Type)
            .Must(value => string.IsNullOrWhiteSpace(value) || Types.Contains(value.Trim()))
            .WithMessage("Type must be Exhibitor, Competitor, or VIP.");
        RuleFor(x => x.Status)
            .Must(value => string.IsNullOrWhiteSpace(value) || Statuses.Contains(value.Trim()))
            .WithMessage("Status must be Pending, Confirmed, CheckedIn, or Cancelled.");
    }
}
