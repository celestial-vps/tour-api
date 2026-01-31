using System.ComponentModel.DataAnnotations;
namespace WeddingOrganizerAPI.Models
{
    public class ImageFile : AuditableEntity
    {
        [Key]
        public Guid Oid { get; set; } = Guid.NewGuid();

        public string? fileName { get; set; } = null!;
        public string? filePath { get; set; } = null!;
        public string? fileUrl { get; set; } = null!;
        public string? fileMime { get; set; } = null!;
        public int fileSize { get; set; }
        public int imageWidth { get; set; }
        public int imageHeight { get; set; }
        public string? storageType { get; set; }

    }
}