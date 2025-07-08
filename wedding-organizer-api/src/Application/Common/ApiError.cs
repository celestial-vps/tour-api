namespace WeddingOrganizerAPI.Common
{
    public class ApiError
    {
        public int Status { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? Details { get; set; }

        public static ApiError InternalServerError(Exception? ex = null)
        {
            return new ApiError
            {
                Status = 500,
                Message = "Internal Server Error",
                Details = ex?.Message
            };
        }

        public static ApiError NotFound(string? message = "Resource not found")
        {
            return new ApiError
            {
                Status = 404,
                Message = message ?? "Not found"
            };
        }

        public static ApiError BadRequest(string? message = "Bad request")
        {
            return new ApiError
            {
                Status = 400,
                Message = message ?? "Invalid request"
            };
        }

        public static ApiError Unauthorized(string? message = "Unauthorized")
        {
            return new ApiError
            {
                Status = 401,
                Message = message ?? "Unauthorized access"
            };
        }

        public static ApiError Forbidden(string? message = "Forbidden")
        {
            return new ApiError
            {
                Status = 403,
                Message = message ?? "Access denied"
            };
        }
    }
}
