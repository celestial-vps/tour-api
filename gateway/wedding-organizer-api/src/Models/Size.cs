using System.ComponentModel.DataAnnotations;

namespace WeddingOrganizerAPI.Models
{
    public class Size: AuditableEntity
    {
        [Key]
        public Guid Oid { get; set; } = Guid.NewGuid();

        public string SizeName { get; set; } = string.Empty;        

    }
}
