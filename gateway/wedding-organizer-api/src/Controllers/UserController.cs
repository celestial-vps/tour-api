using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WeddingOrganizerAPI.DTOs;
using WeddingOrganizerAPI.Services.Interfaces;
using WeddingOrganizerAPI.Common;

namespace WeddingOrganizerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous] // [Authorize] // jika pakai authentication
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/user
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var (users, err) = await _userService.FindAllAsync();
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "get all");
            }

            return BuildResponse.FindOk(this, users, users.Count);
        }

        // GET: api/user/{oid}
        [HttpGet("{oid}")]
        public async Task<IActionResult> GetById(Guid oid)
        {
            var (user, err) = await _userService.FindByIdAsync(oid);
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "get By Oid");
            }

            return BuildResponse.FindOk(this, user);
        }

        // POST: api/user
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
        {
            // var userOid = GetUserOid();
            // if (userOid == Guid.Empty)
            //     return Unauthorized();

            var (user, err) = await _userService.CreateAsync(dto, Guid.NewGuid());
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "insert");
            }

            return BuildResponse.CreateOk(this, user);
        }

        // PUT: api/user/{oid}
        [HttpPut("{oid}")]
        public async Task<IActionResult> Update(Guid oid, [FromBody] UpdateUserDto dto)
        {
            // var userOid = GetUserOid();
            // if (userOid == Guid.Empty)
            //     return Unauthorized();

            var (user, err) = await _userService.UpdateAsync(oid, dto, Guid.NewGuid());
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "insert");
            }

            return BuildResponse.CreateOk(this, user);
        }

        // DELETE: api/user/{oid}
        [HttpDelete("{oid}")]
        public async Task<IActionResult> Delete(Guid oid)
        {
            var (user, err) = await _userService.DeleteAsync(oid);
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "insert");
            }

            return BuildResponse.CreateOk(this, user);
        }

        // Helper: Ambil userOid dari JWT Claim
        private Guid GetUserOid()
        {
            var claim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            return claim != null && Guid.TryParse(claim.Value, out var oid) ? oid : Guid.Empty;
        }
    }
}
