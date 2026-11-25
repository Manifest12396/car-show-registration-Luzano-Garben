using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Common;
using FluentValidation;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using System.Text.Json.Serialization;
using Api.Features.Registrations;
using Application.Features.Registrations.CreateRegistration;
using Application.Features.Registrations.GetRegistrations;
using Application.Features.Registrations.GetRegistrationById;
using Application.Features.Registrations.GetRegistrationSummary;
using Application.Features.Registrations;
using Application.Features.Registrations.UpdateRegistration;
using Application.Features.Registrations.DeleteRegistration;
using Api.Common;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<IAppDbContext, AppDbContext>(options =>
    options.UseSqlite("Data Source=carshow.db"));
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=carshow.db"));

// Validators
builder.Services.AddValidatorsFromAssembly(typeof(IAppDbContext).Assembly);
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

// Handlers
builder.Services.AddScoped<ICommandHandler<CreateRegistrationCommand, Result<RegistrationResponse>>, CreateRegistrationCommandHandler>();
builder.Services.AddScoped<IQueryHandler<GetRegistrationsQuery, Result<PagedRegistrationsResponse>>, GetRegistrationsQueryHandler>();
builder.Services.AddScoped<IQueryHandler<GetRegistrationByIdQuery, Result<RegistrationResponse>>, GetRegistrationByIdQueryHandler>();
builder.Services.AddScoped<IQueryHandler<GetRegistrationSummaryQuery, Result<RegistrationSummaryResponse>>, GetRegistrationSummaryQueryHandler>();
builder.Services.AddScoped<ICommandHandler<UpdateRegistrationCommand, Result<RegistrationResponse>>, UpdateRegistrationCommandHandler>();
builder.Services.AddScoped<ICommandHandler<DeleteRegistrationCommand, Result>, DeleteRegistrationCommandHandler>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

// API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, _, _) =>
    {
        document.Info.Title = "Vertical Slice API Template by Elvin Manuel R. Luces, MIT";
        document.Info.Description = "A simple API demonstrating Vertical Slice Architecture";
        return Task.CompletedTask;
    });
});

var app = builder.Build();

// Seed data
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
    await RegistrationSeeder.SeedAsync(dbContext);
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// Root endpoint
app.UseCors("Frontend");

app.MapGet("/", () => "Welcome to the Car Show 2027 API! Go to /scalar/v1 for API documentation.");

// Map endpoints
app.MapRegistrationEndpoints();

app.Run();
