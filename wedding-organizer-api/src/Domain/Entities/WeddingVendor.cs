namespace WeddingOrganizerAPI.Models
{
    public class WeddingVendor
    {
        public int Id { get; set; }
        public int WeddingId { get; set; }
        public int VendorId { get; set; }
        public decimal ServiceFee { get; set; }

        public Wedding Wedding { get; set; } = null!;
        public Vendor Vendor { get; set; } = null!;
    }
}