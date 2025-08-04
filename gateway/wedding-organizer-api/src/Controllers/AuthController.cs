using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WeddingOrganizerAPI.Data;
using WeddingOrganizerAPI.DTOs;
using WeddingOrganizerAPI.Models;
using WeddingOrganizerAPI.Services.Interfaces;

namespace WeddingOrganizerAPI.Controllers
{
    [ApiController]
    // [Route("api/[controller]")]
    [Route("api/v1/auth")]
    public class AuthController : ControllerBase
    {
        // private readonly AppDbContext _context;
        // private readonly IConfiguration _config;
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var (user, err) = await _userService.RegisterAsync(dto);
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "insert");
            }

            return BuildResponse.CreateOk(this, user);

        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            try
            {

                var (user, err) = await _userService.LoginAsync(dto);
                if (err != null)
                {
                    return BuildResponse.SendQueryError(this, err.Message, "insert");
                }

                return BuildResponse.CreateOk(this, user);

                // var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

                // if (user == null || string.IsNullOrEmpty(user.Password) || string.IsNullOrEmpty(dto.Password) ||
                //     !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
                // {
                //     return Unauthorized("Invalid credentials.");
                // }

                // var token = GenerateJwtToken(user);
                // return Ok(new { token });
                return Ok(new { });
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

        // private string GenerateJwtToken(User user)
        // {
        //     var keyStr = _config["Jwt:Key"];
        //     if (string.IsNullOrEmpty(keyStr))
        //         throw new Exception("JWT secret key not configured.");

        //     var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyStr));
        //     var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        //     var claims = new[]
        //     {
        //         new Claim(ClaimTypes.NameIdentifier, user.Oid.ToString()),
        //         new Claim(ClaimTypes.Email, user.Email),
        //     };

        //     var token = new JwtSecurityToken(
        //         _config["Jwt:Issuer"],
        //         _config["Jwt:Audience"],
        //         claims,
        //         expires: DateTime.Now.AddHours(2),
        //         signingCredentials: creds
        //     );

        //     return new JwtSecurityTokenHandler().WriteToken(token);
        // }
    }
}
