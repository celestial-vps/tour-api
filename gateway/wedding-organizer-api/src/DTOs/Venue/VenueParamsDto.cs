using System.ComponentModel.DataAnnotations;

namespace WeddingOrganizerAPI.DTOs
{
    public class VenueParamsDto
    {
        [Required]
        public Guid Oid { get; set; }
    }
}
