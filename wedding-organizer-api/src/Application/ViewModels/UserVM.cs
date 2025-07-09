namespace Mappings
{
    public class UserVM
    {
        public Guid Oid { get; set; } 
        public string Email { get; set; } = null!;
        public string AndroidToken { get; set; } = null!;
        public string? ExpiredTime { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? ActivatedAt { get; set; }
         
    }
}
