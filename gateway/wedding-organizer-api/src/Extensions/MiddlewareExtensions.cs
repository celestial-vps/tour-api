using Microsoft.AspNetCore.Builder;
using WeddingOrganizerAPI.Middleware;

namespace WeddingOrganizerAPI.Extensions
{
    public static class MiddlewareExtensions
    {
        public static IApplicationBuilder UseRoleAuthorization(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<RoleAuthorizationMiddleware>();
        }
    }
}
