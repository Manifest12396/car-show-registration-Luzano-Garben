namespace Application.Features.Registrations;

using Domain.Entities;

public static class RegistrationResponseMapper
{
    public static RegistrationResponse Map(Registration registration) =>
        new(
            registration.Id,
            registration.RegistrationNumber,
            registration.RegistrationDate,
            registration.ParticipantName,
            registration.ContactNumber,
            registration.Email,
            registration.Address,
            registration.CarMakeModel,
            registration.PlateNumber,
            registration.RegistrationType,
            registration.Status,
            registration.RegistrationFee,
            registration.AmountPaid,
            registration.PaymentStatus);
}
