namespace WeddingOrganizerAPI.DTOs
{
    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string AndroidToken { get; set; } = string.Empty;
        public string Platform { get; set; } = string.Empty;
        public string TokenIos { get; set; } = string.Empty;
        public string TokenWeb { get; set; } = string.Empty;
        public string DesktopToken { get; set; } = string.Empty;
    }
}