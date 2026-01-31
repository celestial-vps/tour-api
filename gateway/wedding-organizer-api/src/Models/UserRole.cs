using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WeddingOrganizerAPI.Models
{
    [Table("UserRoles")]
    public class UserRole: AuditableEntity
    {
        [Key]
        public Guid Oid { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(50)]
        [Column("roleName")]
        public string RoleName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        [Column("targetType")]
        public string TargetType { get; set; } = string.Empty;

        [Required]
        [Column("isAdministrative")]
        public bool IsAdministrative { get; set; }

        [Column("readState")]
        public bool ReadState { get; set; }

        [Column("writeState")]
        public bool WriteState { get; set; }

        [Column("createState")]
        public bool CreateState { get; set; }

        [Column("deleteState")]
        public bool DeleteState { get; set; }

        [Column("navigateState")]
        public bool NavigateState { get; set; }
 


        // RELASI
        public ICollection<User>? Users { get; set; }
    }
}
