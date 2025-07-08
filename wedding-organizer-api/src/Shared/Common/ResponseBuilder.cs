public static class ResponseBuilder
{
    public static DefaultResponse Ok(object? data, int total = 1) =>
        new("200", 200, "Success", total, data);

    public static DefaultResponse Created(object? data, int total = 1) =>
        new("201", 201, "Created successfully", total, data);

    public static DefaultResponse Deleted(object? data) =>
        new("200", 200, "Deleted successfully", 1, data);

    public static DefaultResponse NotFound() =>
        new("200", 200, "Data not found", 0, null);

    public static DefaultResponse BadRequest(object error) =>
        new("400", 400, "Bad Request", 0, new { error });

    public static DefaultResponse Unauthorized(object error) =>
        new("401", 401, "Unauthorized", 0, new { error });

    public static DefaultResponse Forbidden(object error) =>
        new("403", 403, "Forbidden", 0, new { error });

    public static DefaultResponse ValidationError(object error) =>
        new("422", 422, "Validation Error", 0, new { error });

    public static DefaultResponse InternalServerError(Exception error) =>
        new("500", 500, "Internal Server Error", 0, new { error = error.Message });

    public static DefaultResponse QueryError(Exception error, string action = "query") =>
        new("500", 500, $"Error during {action}", 0, new { error = error.Message });

    public static PaginatedResponse Pagination(object? data, int total, int pageIndex, int pageSize) =>
        new("200", 200, "Success", total, data, pageIndex, pageSize);
}
