using System.ComponentModel.DataAnnotations;

namespace WeddingOrganizerAPI.Models
{
    public class Client: AuditableEntity
    {
        [Key]
        public Guid Oid { get; set; } = Guid.NewGuid();

        public string BrideName { get; set; } = string.Empty;
        public string GroomName { get; set; } = string.Empty;
        public string Contact { get; set; } = string.Empty;       

    }
}
