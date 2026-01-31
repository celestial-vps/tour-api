using System.ComponentModel.DataAnnotations;

namespace WeddingOrganizerAPI.Models
{
    public class Color: AuditableEntity
    {
        [Key]
        public Guid Oid { get; set; } = Guid.NewGuid();

        public string ColorName { get; set; } = string.Empty;        

    }
}
