public class PaginationMeta
{
    public int Page { get; set; }
    public int Size { get; set; }
    public int Total { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)Total / Size);
}

public class PaginatedResponse
{
    public string ResultCode { get; set; }
    public int HttpStatus { get; set; }
    public string Message { get; set; }
    public PaginationMeta Pagination { get; set; }
    public object? Data { get; set; }

    public PaginatedResponse(string code, int status, string message, int total, object? data, int page, int size)
    {
        ResultCode = code;
        HttpStatus = status;
        Message = message;
        Pagination = new PaginationMeta
        {
            Page = page,
            Size = size,
            Total = total
        };
        Data = data;
    }
}
