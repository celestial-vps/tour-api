using System.ComponentModel.DataAnnotations;

namespace WeddingOrganizerAPI.DTOs
{
    public class UserParamsDto
    {
        [Required]
        public Guid Oid { get; set; }
    }
}
