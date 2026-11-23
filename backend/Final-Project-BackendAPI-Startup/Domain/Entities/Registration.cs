namespace Domain.Entities;

using Domain.Common;

public sealed class Registration : BaseEntity
{
    public string RegistrationNumber { get; set; } = default!;
    public DateTime RegistrationDate { get; set; }
    public string ParticipantName { get; set; } = default!;
    public string ContactNumber { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string Address { get; set; } = default!;
    public string CarMakeModel { get; set; } = default!;
    public string PlateNumber { get; set; } = default!;
    public RegistrationType RegistrationType { get; set; }
    public RegistrationStatus Status { get; set; } = RegistrationStatus.Pending;
    public decimal RegistrationFee { get; set; }
    public decimal AmountPaid { get; set; }

    public string PaymentStatus =>
        AmountPaid == 0
            ? "Unpaid"
            : AmountPaid == RegistrationFee
                ? "Paid"
                : "Partial";

    public static decimal GetFee(RegistrationType registrationType) => registrationType switch
    {
        RegistrationType.Exhibitor => 1500m,
        RegistrationType.Competitor => 2500m,
        RegistrationType.VIP => 5000m,
        _ => throw new ArgumentOutOfRangeException(nameof(registrationType))
    };
}
