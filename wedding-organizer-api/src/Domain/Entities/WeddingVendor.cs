using System.ComponentModel.DataAnnotations;

namespace WeddingOrganizerAPI.Models
{
    public class WeddingVendor : AuditableEntity
    {
        [Key]
        public Guid Oid { get; set; } = Guid.NewGuid();
        public Guid WeddingOid { get; set; }
        public Guid VendorOid { get; set; }
        public decimal ServiceFee { get; set; }

        public Wedding Wedding { get; set; } = null!;
        public Vendor Vendor { get; set; } = null!;
    }
}