using System.ComponentModel.DataAnnotations;

namespace WeddingOrganizerAPI.DTOs
{
    public class CreateUserDto
    {

        [Required]
        public string Email { get; set; } = null!;

        [Required]
        public string AndroidToken { get; set; } = null!;

        [Required]
        public string ExpiredTime { get; set; } = null!;

        [Required]
        public bool IsActive { get; set; }

        [Required]
        public DateTime? ActivatedAt { get; set; } = null!;

    }
}
