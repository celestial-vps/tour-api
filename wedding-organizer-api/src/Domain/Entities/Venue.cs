using System.ComponentModel.DataAnnotations;
namespace WeddingOrganizerAPI.Models
{
    public class Venue : AuditableEntity
    {
        [Key]
        public Guid Oid { get; set; } = Guid.NewGuid();
 
        public string Name { get; set; } = null!;
        public string Location { get; set; } = null!;
        public int Capacity { get; set; }
        public decimal Price { get; set; }
        public string? Contact { get; set; }
        public ICollection<Wedding> Weddings { get; set; } = new List<Wedding>();
    }
}