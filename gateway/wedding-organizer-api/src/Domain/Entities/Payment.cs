using System.ComponentModel.DataAnnotations;
namespace WeddingOrganizerAPI.Models
{
    public class Payment
    {
        [Key]
        public Guid Oid { get; set; } = Guid.NewGuid(); 
        public Guid WeddingOid { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string PaymentMethod { get; set; } = null!;
        public string? Notes { get; set; }
        public Wedding Wedding { get; set; } = null!;
    }
}