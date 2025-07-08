using System.ComponentModel.DataAnnotations;

public class FoodPackage
{
    [Key]
    public Guid Oid { get; set; } = Guid.NewGuid();

    public int FoodPackageId { get; set; }

    public int VendorId { get; set; } // 🔗 Foreign Key ke Vendor

    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public decimal PricePerPerson { get; set; }
    public int MinimumOrder { get; set; }

    // Relasi
    public Vendor Vendor { get; set; } = null!;

    // public ICollection<WeddingFoodPackage> WeddingFoodPackages { get; set; } = new List<WeddingFoodPackage>();
}
