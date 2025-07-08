using System.ComponentModel.DataAnnotations;

namespace WeddingOrganizerAPI.Models
{
    public class Client
    {
        [Key]
        public Guid Oid { get; set; } = Guid.NewGuid();

        public string BrideName { get; set; } = string.Empty;
        public string GroomName { get; set; } = string.Empty;
        public string Contact { get; set; } = string.Empty;
        public Guid CreatedBy { get; set; }

        public DateTime? CreatedAt { get; set; }

        public Guid? LastModifiedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public Guid? DeletedBy { get; set; }

        public DateTime? DeletedAt { get; set; }

    }
}
