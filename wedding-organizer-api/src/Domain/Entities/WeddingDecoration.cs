namespace WeddingOrganizerAPI.Models
{
    public class WeddingDecoration
    {
        public int Id { get; set; }
        public int WeddingId { get; set; }
        public int DecorationPackageId { get; set; }

        public string? CustomNotes { get; set; }
        public decimal FinalPrice { get; set; }

        public Wedding Wedding { get; set; } = null!;
        public DecorationPackage DecorationPackage { get; set; } = null!;
    }
}