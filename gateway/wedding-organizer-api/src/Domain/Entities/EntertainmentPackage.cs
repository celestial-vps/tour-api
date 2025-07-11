using System.ComponentModel.DataAnnotations;
namespace WeddingOrganizerAPI.Models
{
    public class EntertainmentPackage : AuditableEntity
    {
        [Key]
        public Guid Oid { get; set; } = Guid.NewGuid();

        public Guid VendorOid { get; set; }

        public string Name { get; set; } = null!;
        public decimal Price { get; set; }

        public Vendor Vendor { get; set; } = null!;
        public ICollection<WeddingEntertainment> WeddingEntertainments { get; set; } = new List<WeddingEntertainment>();
    }
}