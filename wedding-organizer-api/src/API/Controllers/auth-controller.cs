using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WeddingOrganizerAPI.Data;
using WeddingOrganizerAPI.DTOs;
using WeddingOrganizerAPI.Models;

namespace WeddingOrganizerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email already registered.");

            var user = new User
            {
                Email = dto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("User registered successfully.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

                if (user == null || string.IsNullOrEmpty(user.Password) || string.IsNullOrEmpty(dto.Password) ||
                    !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
                {
                    return Unauthorized("Invalid credentials.");
                }

                var token = GenerateJwtToken(user);
                return Ok(new { token });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Internal server error",
                    detail = ex.Message
                });
            }
        }

        private string GenerateJwtToken(User user)
        {
            var keyStr = _config["Jwt:Key"];
            if (string.IsNullOrEmpty(keyStr))
                throw new Exception("JWT secret key not configured.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyStr));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Oid.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
            };

            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
