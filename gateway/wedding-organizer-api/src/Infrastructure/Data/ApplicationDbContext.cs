using Microsoft.EntityFrameworkCore;
using WeddingOrganizerAPI.Models;

namespace WeddingOrganizerAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }


        public DbSet<User> Users { get; set; } = null!;
        public DbSet<UserRole> UserRoles { get; set; } = null!;
        public DbSet<Client> Clients { get; set; } = null!;
        public DbSet<Wedding> Weddings { get; set; }
        public DbSet<Vendor> Vendors { get; set; }
        public DbSet<WeddingVendor> WeddingVendors { get; set; }
        public DbSet<Payment> Payments { get; set; }
        // public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<Venue> Venues { get; set; }
        // Tambah DbSet lainnya sesuai model
    }
}
