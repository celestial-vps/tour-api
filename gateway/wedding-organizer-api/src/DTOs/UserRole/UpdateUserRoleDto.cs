using System.ComponentModel.DataAnnotations;

namespace WeddingOrganizerAPI.DTOs
{
    public class UpdateUserRoleDto
    {

        [Required]
        public string RoleName { get; set; } = null!;

        [Required]
        public string TargetType { get; set; } = null!;

        [Required]
        public bool? IsAdministrative { get; set; }

        [Required]
        public bool? ReadState { get; set; }

        [Required]
        public bool? WriteState { get; set; }

        [Required]
        public bool? CreateState { get; set; }

        [Required]
        public bool? DeleteState { get; set; }

        [Required]
        public bool? NavigateState { get; set; }

    }
}
