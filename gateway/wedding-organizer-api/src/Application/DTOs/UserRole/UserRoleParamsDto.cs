using System.ComponentModel.DataAnnotations;

namespace WeddingOrganizerAPI.DTOs
{
    public class UserRoleParamsDto
    {
        [Required]
        public Guid Oid { get; set; }
    }
}
