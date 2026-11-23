namespace Application.Features.Registrations.UpdateRegistration;

using Application.Abstractions.Messaging;
using Application.Features.Registrations;
using Domain.Common;
using Domain.Entities;
using System.Text.Json.Serialization;

public sealed record UpdateRegistrationCommand(
    string ParticipantName,
    string ContactNumber,
    string Email,
    string Address,
    string CarMakeModel,
    string PlateNumber,
    RegistrationType RegistrationType,
    RegistrationStatus Status,
    decimal AmountPaid,
    [property: JsonIgnore] Guid Id = default) : ICommand<Result<RegistrationResponse>>;
