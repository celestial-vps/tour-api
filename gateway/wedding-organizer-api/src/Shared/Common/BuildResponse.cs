using Microsoft.AspNetCore.Mvc;
using WeddingOrganizerAPI.Common;

public static class BuildResponse
{
    public static IActionResult CreateOk<T>(ControllerBase controller, T data, int total = 1)
    {
        var response = new DefaultResponse<T>
        {
            ResultCode = "200",
            HttpStatus = 200,
            Message = "Success",
            Total = total,
            Data = data
        };

        return controller.StatusCode(StatusCodes.Status201Created, response); // sesuai JS kamu: `res.status(201)`
    }

  public static IActionResult FindOk<T>(ControllerBase controller, T data, int total = 1)
    {
        var response = new DefaultResponse<T>
        {
            ResultCode = "200",
            HttpStatus = 200,
            Message = "Success",
            Total = total,
            Data = data
        };

        return controller.StatusCode(StatusCodes.Status201Created, response); // sesuai JS kamu: `res.status(201)`
    }

    public static object ResponseQueryError(string error, string action = "query")
    {
        return new
        {
            success = false,
            message = $"Failed to {action}: {error}"
        };
    }

    public static IActionResult SendQueryError(ControllerBase controller, string error, string action = "query")
    {
        var response = ResponseQueryError(error, action);
        return controller.StatusCode(500, response);
    }


}
