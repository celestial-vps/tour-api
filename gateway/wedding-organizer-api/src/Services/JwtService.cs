using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using WeddingOrganizerAPI.Models; // ganti sesuai lokasi class User

namespace WeddingOrganizerAPI.Services
{
    public interface IJwtService
    {
        string GenerateJwtToken(User user);
    }

    public class JwtService : IJwtService
    {
        private readonly IConfiguration _configuration;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // public string GenerateJwtToken(User user)
        // {
        //     var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);

        //     var tokenDescriptor = new SecurityTokenDescriptor
        //     {
        //         Subject = new ClaimsIdentity(new[]
        //         {
        //             new Claim(ClaimTypes.NameIdentifier, user.Oid.ToString()),
        //             new Claim(ClaimTypes.Email, user.Email),
        //            new Claim(ClaimTypes.Role, user.UserRole?.RoleName ?? "Unknown")
        //         }),
        //         Expires = DateTime.UtcNow.AddHours(2),
        //         SigningCredentials = new SigningCredentials(
        //             new SymmetricSecurityKey(key),
        //             SecurityAlgorithms.HmacSha256Signature)
        //     };

        //     var tokenHandler = new JwtSecurityTokenHandler();
        //     var token = tokenHandler.CreateToken(tokenDescriptor);
        //     return tokenHandler.WriteToken(token);
        // }
        public string GenerateJwtToken(User user)
        {
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);

            var claims = new List<Claim>
            {
                new Claim("userOid", user.Oid.ToString()),
                new Claim("username", user.Email),
                new Claim("level", "application")
            };

            if (!string.IsNullOrEmpty(user.UserRole?.RoleName))
            {
                claims.Add(new Claim(ClaimTypes.Role, user.UserRole.RoleName));  // ✅ Now works!
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(72),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
