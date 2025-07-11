using System.ComponentModel.DataAnnotations;
namespace WeddingOrganizerAPI.Models
{
    public class Wedding: AuditableEntity
    {
        [Key]
        public Guid Oid { get; set; } = Guid.NewGuid(); 
        public Guid ClientOid { get; set; }
        public DateTime Date { get; set; }
        public string? Theme { get; set; }
        public string? Notes { get; set; }

        public Guid VenueOid { get; set; }

        // public Client Client { get; set; } = null!;
        public Venue Venue { get; set; } = null!;
        public ICollection<WeddingVendor> WeddingVendors { get; set; } = new List<WeddingVendor>();
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
        // public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}