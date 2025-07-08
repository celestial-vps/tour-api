using System.ComponentModel.DataAnnotations;

public class EntertainmentPackage
{
    [Key]
    public Guid Oid { get; set; } = Guid.NewGuid();

    public int EntertainmentPackageId { get; set; }
    public int VendorId { get; set; }

    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public decimal Price { get; set; }

    public Vendor Vendor { get; set; } = null!;
    public ICollection<WeddingEntertainment> WeddingEntertainments { get; set; } = new List<WeddingEntertainment>();
}