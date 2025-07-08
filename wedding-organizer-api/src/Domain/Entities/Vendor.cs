using System.ComponentModel.DataAnnotations;
namespace WeddingOrganizerAPI.Models
{
    public class Vendor
    {
        [Key]
        public Guid Oid { get; set; } = Guid.NewGuid();

        public int VendorId { get; set; }
        public string Name { get; set; } = null!;
        public string Category { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string? Email { get; set; }
        public string? Address { get; set; }

        public ICollection<WeddingVendor> WeddingVendors { get; set; } = new List<WeddingVendor>();

        public ICollection<EntertainmentPackage> EntertainmentPackages { get; set; } = new List<EntertainmentPackage>();
        public ICollection<WeddingEntertainment> WeddingEntertainments { get; set; } = new List<WeddingEntertainment>();

    }
}