using System.ComponentModel.DataAnnotations;

namespace WeddingOrganizerAPI.Models
{
    public class WeddingDecoration : AuditableEntity
    {
        [Key]
        public Guid Oid { get; set; } = Guid.NewGuid();
        public Guid WeddingOid { get; set; }
        public Guid DecorationPackageOid { get; set; }

        public string? CustomNotes { get; set; }
        public decimal FinalPrice { get; set; }

        public Wedding Wedding { get; set; } = null!;
        public DecorationPackage DecorationPackage { get; set; } = null!;
    }
}