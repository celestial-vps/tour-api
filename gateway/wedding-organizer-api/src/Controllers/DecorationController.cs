using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WeddingOrganizerAPI.DTOs;
using WeddingOrganizerAPI.Services.Interfaces;
using WeddingOrganizerAPI.Common;
using WeddingOrganizerAPI.Attributes;

namespace WeddingOrganizerAPI.Controllers
{
    [ApiController]
    // [Route("api/[controller]")]
    [Route("api/v1/decoration")]
    // [Authorize(Roles = "Base,Admin")]
    // [Authorize(Roles = "Base")]
    // [Authorize] // [AllowAnonymous] //  // jika pakai authentication
     [RoleAuthorize("Admin")]
    // [Authorize(Roles = "Admin")] // pakai ini role jika mau query ulang ke db
    public class DecorationController : ControllerBase
    {
        private readonly IDecorationService _decorationService;

        public DecorationController(IDecorationService decorationService)
        {
            _decorationService = decorationService;
        }

        // GET: api/decoration
        [HttpGet()]
        public async Task<IActionResult> GetAll()
        {
            var (decorations, err) = await _decorationService.FindAllAsync();
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "get all");
            }

            return BuildResponse.FindOk(this, decorations, decorations.Count);
        }

        // GET: api/decoration/{oid}
        [HttpGet("{oid}")]
        public async Task<IActionResult> GetById(Guid oid)
        {
            var (decoration, err) = await _decorationService.FindByIdAsync(oid);
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "get By Oid");
            }

            return BuildResponse.FindOk(this, decoration);
        }

        [HttpPost("q")]
        public async Task<IActionResult> FindPage([FromBody] DecorationFilterDto dto, [FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 10)
        {
            // var userOid = GetUserOid();
            // if (userOid == Guid.Empty)
            //     return Unauthorized();

            var (decoration, err) = await _decorationService.FindPageAsync(dto, pageIndex, pageSize);
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "insert");
            }

            return BuildResponse.CreateOk(this, decoration);
        }


        // POST: api/decoration
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateDecorationDto dto)
        {
            // var userOid = GetUserOid();
            // if (userOid == Guid.Empty)
            //     return Unauthorized();

            var (decoration, err) = await _decorationService.CreateAsync(dto, Guid.NewGuid());
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "insert");
            }

            return BuildResponse.CreateOk(this, decoration);
        }

        // PUT: api/decoration/{oid}
        [HttpPut("{oid}")]
        public async Task<IActionResult> Update(Guid oid, [FromBody] UpdateDecorationDto dto)
        {
            // var userOid = GetUserOid();
            // if (userOid == Guid.Empty)
            //     return Unauthorized();

            var (decoration, err) = await _decorationService.UpdateAsync(oid, dto, Guid.NewGuid());
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "insert");
            }

            return BuildResponse.CreateOk(this, decoration);
        }

        // DELETE: api/decoration/{oid}
        [HttpDelete("delete/{oid}")]
        public async Task<IActionResult> Delete(Guid oid)
        {
            var (decoration, err) = await _decorationService.DeleteAsync(oid);
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "insert");
            }

            return BuildResponse.CreateOk(this, decoration);
        }

        // Helper: Ambil userOid dari JWT Claim
        private Guid GetUserOid()
        {
            var claim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            return claim != null && Guid.TryParse(claim.Value, out var oid) ? oid : Guid.Empty;
        }
    }
}
