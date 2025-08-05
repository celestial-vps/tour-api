using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using WeddingOrganizerAPI.Data;
using Microsoft.EntityFrameworkCore;
using WeddingOrganizerAPI.Attributes;

namespace WeddingOrganizerAPI.Middleware
{
    public class RoleAuthorizationMiddleware
    {
        private readonly RequestDelegate _next;

        public RoleAuthorizationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, AppDbContext dbContext)
        {
            var endpoint = context.GetEndpoint();
            var roleAttr = endpoint?.Metadata.GetMetadata<RoleAuthorizeAttribute>();

            if (roleAttr != null)
            {
                var token = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

                if (string.IsNullOrWhiteSpace(token))
                {
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Unauthorized: No token");
                    return;
                }

                var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);
                var userOid = jwt.Claims.FirstOrDefault(c => c.Type == "userOid")?.Value;

                if (userOid == null)
                {
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Unauthorized: Invalid token");
                    return;
                }

                // var user = await dbContext.Users
                //     .Include(u => u.UserRole)
                //     .ThenInclude(ur => ur.RoleName)
                //     .FirstOrDefaultAsync(u => u.Oid == Guid.Parse(userOid));

                var user = await dbContext.Users
    .Include(u => u.UserRole)
    .FirstOrDefaultAsync(u => u.Oid == Guid.Parse(userOid));

                if (user == null)
                {
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Unauthorized: User not found");
                    return;
                }

                // var userRoles = user.UserRole.Select(ur => ur.Role.Name).ToList();
                var userRoleName = user.UserRole?.RoleName;
                // var hasRole = roleAttr.Roles.Any(r => userRoles.Contains(r));
                var hasRole = userRoleName != null && roleAttr.Roles.Contains(userRoleName);


                if (!hasRole)
                {
                    context.Response.StatusCode = 403;
                    await context.Response.WriteAsync("Forbidden: Access denied");
                    return;
                }
            }

            await _next(context);
        }
    }
}
