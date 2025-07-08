using System.ComponentModel.DataAnnotations;

public class FoodItem
{
    [Key]
    public Guid Oid { get; set; } = Guid.NewGuid();

    public int FoodItemId { get; set; }
    public int FoodPackageId { get; set; }

    public string Name { get; set; } = null!;
    public string? Category { get; set; } // e.g. appetizer, dessert, etc.
    public bool? IsVegetarian { get; set; }
    public string? Notes { get; set; }

    public FoodPackage FoodPackage { get; set; } = null!;
}
