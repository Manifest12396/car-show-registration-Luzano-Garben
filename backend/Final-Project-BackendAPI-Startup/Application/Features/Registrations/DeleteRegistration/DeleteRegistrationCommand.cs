namespace Application.Features.Registrations.DeleteRegistration;

using Application.Abstractions.Messaging;
using Domain.Common;

public sealed record DeleteRegistrationCommand(Guid Id) : ICommand<Result>;
