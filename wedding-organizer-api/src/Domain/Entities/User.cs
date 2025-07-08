using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WeddingOrganizerAPI.Models
{
    [Table("Users")]
    public class User
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

        [Column("expiredTime")]
        [StringLength(50)]
        public string? ExpiredTime { get; set; }

        [Column("isActive")]
        public bool? IsActive { get; set; }

        [Column("activatedAt")]
        public DateTime? ActivatedAt { get; set; }

        public Guid? RoleOid { get; set; }

        [Column("description")]
        public string? Description { get; set; }


        public Guid CreatedBy { get; set; }

        public DateTime? CreatedAt { get; set; }

        public Guid? LastModifiedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public Guid? DeletedBy { get; set; }

        public DateTime? DeletedAt { get; set; }

        // RELASI
        [ForeignKey("RoleOid")]
        public UserRole? UserRole { get; set; }
    }
}
