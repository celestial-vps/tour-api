using System.ComponentModel.DataAnnotations;

namespace WeddingOrganizerAPI.Models
{
    public class Client: AuditableEntity
    {
        [Key]
        public Guid Oid { get; set; } = Guid.NewGuid();

        public string ShoesName { get; set; } = string.Empty;
        public string Size { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;       

    }
}
