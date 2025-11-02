using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WeddingOrganizerAPI.Models
{
    [Table("Users")]
    public class User: AuditableEntity
    {
        [Key]
        public Guid Oid { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(100)]
        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        [Column("password")]
        public string Password { get; set; } = string.Empty;

        [Column("androidToken")]
        [StringLength(255)]
        public string? AndroidToken { get; set; }

        [Column("tokenIos")]
        [StringLength(255)]
        public string? TokenIos { get; set; }

        [Column("tokenWeb")]
        [StringLength(255)]
        public string? TokenWeb { get; set; }

        [Column("desktopToken")]
        [StringLength(255)]
        public string? DesktopToken { get; set; }


        [Column("expiredTime")]
        [StringLength(50)]
        public string? ExpiredTime { get; set; }

        [Column("isActive")]
        public bool? IsActive { get; set; }

        [Column("activatedAt")]
        public DateTime? ActivatedAt { get; set; }

        public Guid? RoleOid { get; set; }

        
        // RELASI
        [ForeignKey("RoleOid")]
        public UserRole? UserRole { get; set; }
    }
}
