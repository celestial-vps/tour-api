namespace WeddingOrganizerAPI.Mappings
{
    public class MessageVM
    {
        public Guid Oid { get; set; }
        public string? Value { get; set; }
        public string? Name { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
