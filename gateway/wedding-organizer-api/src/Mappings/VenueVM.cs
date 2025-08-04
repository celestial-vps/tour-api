namespace Mappings
{
    public class VenueVM
    {
        public Guid Oid { get; set; }
        public int VenueId { get; set; }
        public string Name { get; set; } = null!;
        public string Location { get; set; } = null!;
        public int Capacity { get; set; }
        public decimal Price { get; set; }
        public string? Contact { get; set; }
        public string? Description { get; set; }

        // Jika ingin tampilkan jumlah wedding yang terkait
        public int WeddingCount { get; set; }
    }
}
