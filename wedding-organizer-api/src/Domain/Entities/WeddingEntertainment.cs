using System.ComponentModel.DataAnnotations;

namespace WeddingOrganizerAPI.Models
{
    public class WeddingEntertainment : AuditableEntity
    {
        [Key]
        public Guid Oid { get; set; } = Guid.NewGuid(); public Guid WeddingOid { get; set; }
        public int EntertainmentPackageId { get; set; }

        public string? CustomNotes { get; set; }
        public decimal FinalPrice { get; set; }

        public Wedding Wedding { get; set; } = null!;
        public EntertainmentPackage EntertainmentPackage { get; set; } = null!;
    }
}