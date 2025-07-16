using System.ComponentModel.DataAnnotations;
namespace WeddingOrganizerAPI.Models
{
    public class DecorationPackage: AuditableEntity
    {
        [Key]
        public Guid Oid { get; set; } = Guid.NewGuid();

        public int DecorationPackageId { get; set; } 
        public string Name { get; set; } = null!; 
        public string? Theme { get; set; }
        public decimal Price { get; set; }
        public Vendor Vendor { get; set; } = null!;
        public ICollection<WeddingDecoration> WeddingDecorations { get; set; } = new List<WeddingDecoration>();
    }
}