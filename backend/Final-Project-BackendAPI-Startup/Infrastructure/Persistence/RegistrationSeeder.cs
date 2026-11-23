namespace Infrastructure.Persistence;

using Domain.Entities;
using Microsoft.EntityFrameworkCore;

public static class RegistrationSeeder
{
    public static async Task SeedAsync(AppDbContext dbContext, CancellationToken cancellationToken = default)
    {
        if (await dbContext.Registrations.AnyAsync(cancellationToken))
        {
            return;
        }

        var names = new[]
        {
            "Marco Reyes", "Ana Santos", "Luis Mendoza", "Carlo Dela Cruz", "Mia Garcia",
            "Paolo Ramos", "Jasmine Torres", "Enzo Castillo", "Rhea Navarro", "Gabriel Flores",
            "Nicole Bautista", "Mark Aquino", "Ella Lim", "Joshua Perez", "Bianca Fernandez",
            "Adrian Gutierrez", "Sofia Morales", "Miguel Rivera", "Camille Ramos", "Daniel Cruz",
            "Kevin Lopez", "Trisha Gonzales", "Rafael Diaz", "Angelica Tan", "Bryan Chavez"
        };
        var makes = new[] { "Toyota Supra", "Honda Civic", "Mazda MX-5", "Nissan GT-R", "Ford Mustang", "Mitsubishi Lancer" };
        var types = new[] { RegistrationType.Exhibitor, RegistrationType.Competitor, RegistrationType.VIP };
        var statuses = new[] { RegistrationStatus.Pending, RegistrationStatus.Confirmed, RegistrationStatus.CheckedIn, RegistrationStatus.Cancelled };
        var registrations = new List<Registration>();

        for (var i = 0; i < names.Length; i++)
        {
            var type = types[i % types.Length];
            var fee = Registration.GetFee(type);
            decimal amountPaid;
            if (i % 3 == 0)
            {
                amountPaid = 0m;
            }
            else if (i % 3 == 1)
            {
                amountPaid = fee / 2;
            }
            else
            {
                amountPaid = fee;
            }

            registrations.Add(new Registration
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = $"CS27-{i + 1:0000}",
                RegistrationDate = DateTime.UtcNow.AddDays(-(names.Length - i)),
                ParticipantName = names[i],
                ContactNumber = $"0917{i + 1:0000000}",
                Email = $"participant{i + 1}@carshow2027.test",
                Address = $"{100 + i} Main Street, Manila",
                CarMakeModel = makes[i % makes.Length],
                PlateNumber = $"CS27{i + 1:000}",
                RegistrationType = type,
                Status = statuses[i % statuses.Length],
                RegistrationFee = fee,
                AmountPaid = amountPaid
            });
        }

        dbContext.Registrations.AddRange(registrations);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
