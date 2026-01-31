using System.ComponentModel.DataAnnotations;
namespace WeddingOrganizerAPI.Models
{
    public class VendorInvitationCard : AuditableEntity
    {
        [Key]
        public Guid Oid { get; set; } = Guid.NewGuid();

        public Guid VendorOid { get; set; }
        public Vendor Vendor { get; set; } = null!;
        public string Name { get; set; } = null!;
        public decimal Price { get; set; }


    }
}