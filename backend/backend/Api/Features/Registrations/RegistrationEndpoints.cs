namespace Api.Features.Registrations;

using Api.Common;
using Api.Common.Extensions;
using Application.Abstractions.Messaging;
using Application.Features.Registrations;
using Application.Features.Registrations.CreateRegistration;
using Application.Features.Registrations.GetRegistrations;
using Application.Features.Registrations.GetRegistrationById;
using Application.Features.Registrations.GetRegistrationSummary;
using Application.Features.Registrations.UpdateRegistration;
using Application.Features.Registrations.DeleteRegistration;
using Domain.Common;
using Microsoft.AspNetCore.Mvc;

public static class RegistrationEndpoints
{
    public static void MapRegistrationEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/registrations").WithTags("Registrations");

        group.MapPost("/", Create)
            .WithName("CreateRegistration")
            .WithSummary("Create a car show registration")
            .AddEndpointFilter<ValidationFilter<CreateRegistrationCommand>>();

        group.MapGet("/", GetAll)
            .WithName("GetRegistrations")
            .WithSummary("Get paged and filtered registrations")
            .AddEndpointFilter<ValidationFilter<GetRegistrationsQuery>>();

        group.MapGet("/summary", GetSummary)
            .WithName("GetRegistrationSummary")
            .WithSummary("Get registration KPIs");

        group.MapGet("/{id:guid}", GetById)
            .WithName("GetRegistrationById")
            .WithSummary("Get a registration by ID");

        group.MapPut("/{id:guid}", Update)
            .WithName("UpdateRegistration")
            .WithSummary("Update a car show registration")
            .AddEndpointFilter<ValidationFilter<UpdateRegistrationCommand>>();

        group.MapDelete("/{id:guid}", Delete)
            .WithName("DeleteRegistration")
            .WithSummary("Delete a car show registration");
    }

    private static async Task<IResult> Create(
        CreateRegistrationCommand command,
        ICommandHandler<CreateRegistrationCommand, Result<RegistrationResponse>> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.HandleAsync(command, cancellationToken);
        return result.IsSuccess
            ? Results.Created($"/api/registrations/{result.Value!.Id}", result.Value)
            : result.ToProblemDetails();
    }

    private static async Task<IResult> GetAll(
        [AsParameters] GetRegistrationsQuery query,
        IQueryHandler<GetRegistrationsQuery, Result<PagedRegistrationsResponse>> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.HandleAsync(query, cancellationToken);
        return result.IsSuccess
            ? Results.Ok(result.Value)
            : result.ToProblemDetails();
    }

    private static async Task<IResult> GetById(
        Guid id,
        IQueryHandler<GetRegistrationByIdQuery, Result<RegistrationResponse>> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.HandleAsync(new GetRegistrationByIdQuery(id), cancellationToken);
        return result.IsSuccess
            ? Results.Ok(result.Value)
            : result.ToProblemDetails();
    }

    private static async Task<IResult> GetSummary(
        IQueryHandler<GetRegistrationSummaryQuery, Result<RegistrationSummaryResponse>> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.HandleAsync(new GetRegistrationSummaryQuery(), cancellationToken);
        return result.IsSuccess
            ? Results.Ok(result.Value)
            : result.ToProblemDetails();
    }

    private static async Task<IResult> Update(
        Guid id,
        UpdateRegistrationCommand command,
        ICommandHandler<UpdateRegistrationCommand, Result<RegistrationResponse>> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.HandleAsync(
            command with { Id = id },
            cancellationToken);
        return result.IsSuccess
            ? Results.Ok(result.Value)
            : result.ToProblemDetails();
    }

    private static async Task<IResult> Delete(
        Guid id,
        ICommandHandler<DeleteRegistrationCommand, Result> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.HandleAsync(
            new DeleteRegistrationCommand(id),
            cancellationToken);
        return result.IsSuccess
            ? Results.NoContent()
            : result.ToProblemDetails();
    }
}
