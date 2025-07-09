using System.ComponentModel.DataAnnotations;
namespace WeddingOrganizerAPI.Models
{
    public class FoodItem : AuditableEntity
    {
        [Key]
        public Guid Oid { get; set; } = Guid.NewGuid();

        public Guid FoodPackageOid { get; set; }

        public string Name { get; set; } = null!;
        public string? Category { get; set; } // e.g. appetizer, dessert, etc.
        public bool? IsVegetarian { get; set; }
        public string? Notes { get; set; }
        public FoodPackage FoodPackage { get; set; } = null!;
    }
}