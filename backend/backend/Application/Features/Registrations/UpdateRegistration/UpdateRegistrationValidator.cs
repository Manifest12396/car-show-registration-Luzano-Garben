namespace Application.Features.Registrations.UpdateRegistration;

using Domain.Entities;
using FluentValidation;

public sealed class UpdateRegistrationValidator : AbstractValidator<UpdateRegistrationCommand>
{
    public UpdateRegistrationValidator()
    {
        RuleFor(x => x.ParticipantName).NotEmpty().MaximumLength(150);
        RuleFor(x => x.ContactNumber).NotEmpty().Matches(@"^09\d{9}$");
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(200);
        RuleFor(x => x.Address).NotEmpty().MaximumLength(300);
        RuleFor(x => x.CarMakeModel).NotEmpty().MaximumLength(100);
        RuleFor(x => x.PlateNumber).NotEmpty().MaximumLength(15);
        RuleFor(x => x.RegistrationType).Must(value => Enum.IsDefined(value));
        RuleFor(x => x.Status).Must(value => Enum.IsDefined(value));
        RuleFor(x => x.AmountPaid)
            .GreaterThanOrEqualTo(0)
            .Must((command, amountPaid) =>
                !Enum.IsDefined(command.RegistrationType) ||
                amountPaid <= Registration.GetFee(command.RegistrationType))
            .WithMessage("AmountPaid must be less than or equal to the registration fee.");
    }
}
