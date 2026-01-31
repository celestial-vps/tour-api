using System.ComponentModel.DataAnnotations;
namespace WeddingOrganizerAPI.Models
{
    public class Vendor : AuditableEntity
    {
        [Key]
        public Guid Oid { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = null!;

    }
}