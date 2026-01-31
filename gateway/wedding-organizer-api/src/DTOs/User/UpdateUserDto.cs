using System.ComponentModel.DataAnnotations;

namespace WeddingOrganizerAPI.DTOs
{
    public class UpdateUserDto
    {

        [Required]
        public string Email { get; set; } = null!;

        [Required]
        public string AndroidToken { get; set; } = null!;

        [Required]
        public string ExpiredTime { get; set; } = null!;

        [Required]
        public bool? IsActive { get; set; } = null!;

        public DateTime? Contact { get; set; }
        public string? Description { get; set; }
    }
}
