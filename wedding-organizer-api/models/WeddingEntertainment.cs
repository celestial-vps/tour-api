public class WeddingEntertainment
{
    public int Id { get; set; }
    public int WeddingId { get; set; }
    public int EntertainmentPackageId { get; set; }

    public string? CustomNotes { get; set; }
    public decimal FinalPrice { get; set; }

    public Wedding Wedding { get; set; } = null!;
    public EntertainmentPackage EntertainmentPackage { get; set; } = null!;
}