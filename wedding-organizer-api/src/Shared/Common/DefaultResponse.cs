namespace WeddingOrganizerAPI.Common
{
    public class DefaultResponse<T>
    {
        public string ResultCode { get; set; }
        public int HttpStatus { get; set; }
        public string Message { get; set; }
        public int Total { get; set; }
        public object? Data { get; set; }
 
 
    }
}