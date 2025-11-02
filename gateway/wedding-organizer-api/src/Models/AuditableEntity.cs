namespace WeddingOrganizerAPI.Models
{
    public abstract class AuditableEntity
    {
        public Guid CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public Guid? LastModifiedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public Guid? DeletedBy { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}