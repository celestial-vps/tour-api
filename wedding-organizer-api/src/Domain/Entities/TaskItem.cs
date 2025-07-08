using System.ComponentModel.DataAnnotations;
namespace WeddingOrganizerAPI.Models
{
    public class TaskItem
    {
        [Key]
        public Guid Oid { get; set; } = Guid.NewGuid();

        public int TaskId { get; set; }
        public int WeddingId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string Status { get; set; } = null!;
        public DateTime DueDate { get; set; }

        public Wedding Wedding { get; set; } = null!;
    }
}