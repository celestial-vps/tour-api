using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WeddingOrganizerAPI.Data;
using WeddingOrganizerAPI.Models;

public static class UserRoleSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // Migrate database jika perlu
        await context.Database.MigrateAsync();

        // Cek apakah sudah ada data user roles
        if (!context.UserRoles.Any())
        {
            var roles = new[]
            {
                new UserRole
                {
                    Oid = Guid.NewGuid(),
                    RoleName = "Base",
                    TargetType = "Venue", // misal targetnya Venue
                    IsAdministrative = false,
                    ReadState = true,
                    WriteState = false,
                    CreateState = false,
                    DeleteState = false,
                    NavigateState = true
                },
                new UserRole
                {
                    Oid = Guid.NewGuid(),
                    RoleName = "Admin",
                    TargetType = "Venue",
                    IsAdministrative = true,
                    ReadState = true,
                    WriteState = true,
                    CreateState = true,
                    DeleteState = true,
                    NavigateState = true
                },
                new UserRole
                {
                    Oid = Guid.NewGuid(),
                    RoleName = "User",
                    TargetType = "Venue",
                    IsAdministrative = false,
                    ReadState = true,
                    WriteState = true,
                    CreateState = true,
                    DeleteState = false,
                    NavigateState = true
                }
            };

            context.UserRoles.AddRange(roles);
            await context.SaveChangesAsync();
        }
    }
}
