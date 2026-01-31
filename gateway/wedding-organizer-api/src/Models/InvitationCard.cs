using System.ComponentModel.DataAnnotations;
namespace WeddingOrganizerAPI.Models
{
    public class InvitationCard : AuditableEntity
    {
        [Key]
        public Guid Oid { get; set; } = Guid.NewGuid();
 
        public string Name { get; set; } = null!;        
        public ICollection<Wedding> Weddings { get; set; } = new List<Wedding>();
    }
}