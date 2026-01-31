using System.ComponentModel.DataAnnotations;
namespace WeddingOrganizerAPI.Models
{
    public class FoodPackage : AuditableEntity
    {
        [Key]
        public Guid Oid { get; set; } = Guid.NewGuid();

        public Guid VendorOid { get; set; } // 🔗 Foreign Key ke Vendor

        public string Name { get; set; } = null!;
        public decimal PricePerPerson { get; set; }
        public int MinimumOrder { get; set; }
        // Relasi
        public Vendor Vendor { get; set; } = null!;

        // public ICollection<WeddingFoodPackage> WeddingFoodPackages { get; set; } = new List<WeddingFoodPackage>();
    }
}