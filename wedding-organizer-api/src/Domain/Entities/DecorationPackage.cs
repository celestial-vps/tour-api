using System.ComponentModel.DataAnnotations;
namespace WeddingOrganizerAPI.Models
{
    public class DecorationPackage
    {
        [Key]
        public Guid Oid { get; set; } = Guid.NewGuid();

        public int DecorationPackageId { get; set; }
        public int VendorId { get; set; }

        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? Theme { get; set; }
        public decimal Price { get; set; }

        public Vendor Vendor { get; set; } = null!;
        public ICollection<WeddingDecoration> WeddingDecorations { get; set; } = new List<WeddingDecoration>();
    }
}