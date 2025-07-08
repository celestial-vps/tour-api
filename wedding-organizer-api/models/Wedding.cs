using System.ComponentModel.DataAnnotations;

public class Wedding
{
    [Key]
    public Guid Oid { get; set; } = Guid.NewGuid();

    public int WeddingId { get; set; }
    public int ClientId { get; set; }
    public DateTime Date { get; set; }
    public string? Theme { get; set; }
    public string? Notes { get; set; }

    public int VenueId { get; set; }

    // public Client Client { get; set; } = null!;
    public Venue Venue { get; set; } = null!;
    public ICollection<WeddingVendor> WeddingVendors { get; set; } = new List<WeddingVendor>();
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    // public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}
