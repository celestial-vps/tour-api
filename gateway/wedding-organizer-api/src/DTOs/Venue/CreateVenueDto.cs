using System.ComponentModel.DataAnnotations;

namespace WeddingOrganizerAPI.DTOs
{
    public class CreateVenueDto
    { 

        [Required]
        public string Name { get; set; } = null!;

        [Required]
        public string Location { get; set; } = null!;

        [Required]
        public int Capacity { get; set; }

        [Required]
        public decimal Price { get; set; }

        public string? Contact { get; set; } 
    }
}
