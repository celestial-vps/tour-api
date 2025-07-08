using System.ComponentModel.DataAnnotations;

public class Venue
{
    [Key]
    public Guid Oid { get; set; } = Guid.NewGuid();

    public int VenueId { get; set; }
    public string Name { get; set; } = null!;
    public string Location { get; set; } = null!;
    public int Capacity { get; set; }
    public decimal Price { get; set; }
    public string? Contact { get; set; }
    public string? Description { get; set; }

    public ICollection<Wedding> Weddings { get; set; } = new List<Wedding>();
}
