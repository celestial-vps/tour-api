public class DefaultResponse
{
    public string ResultCode { get; set; }
    public int HttpStatus { get; set; }
    public string Message { get; set; }
    public int Total { get; set; }
    public object? Data { get; set; }

    public DefaultResponse(string code, int status, string message, int total = 0, object? data = null)
    {
        ResultCode = code;
        HttpStatus = status;
        Message = message;
        Total = total;
        Data = data;
    }
}
