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
    [Route("api/v1/shoes")]
    // [Authorize(Roles = "Base,Admin")]
    // [Authorize(Roles = "Base")]
    // [Authorize] // [AllowAnonymous] //  // jika pakai authentication
     [RoleAuthorize("Admin")]
    // [Authorize(Roles = "Admin")] // pakai ini role jika mau query ulang ke db
    public class ShoesController : ControllerBase
    {
        private readonly IShoesService _shoesService;

        public ShoesController(IShoesService shoesService)
        {
            _shoesService = shoesService;
        }

        // GET: api/shoes
        [HttpGet()]
        public async Task<IActionResult> GetAll()
        {
            var (shoess, err) = await _shoesService.FindAllAsync();
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "get all");
            }

            return BuildResponse.FindOk(this, shoess, shoess.Count);
        }

        // GET: api/shoes/{oid}
        [HttpGet("{oid}")]
        public async Task<IActionResult> GetById(Guid oid)
        {
            var (shoes, err) = await _shoesService.FindByIdAsync(oid);
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "get By Oid");
            }

            return BuildResponse.FindOk(this, shoes);
        }

        [HttpPost("q")]
        public async Task<IActionResult> FindPage([FromBody] ShoesFilterDto dto, [FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 10)
        {
            // var userOid = GetUserOid();
            // if (userOid == Guid.Empty)
            //     return Unauthorized();

            var (shoes, err) = await _shoesService.FindPageAsync(dto, pageIndex, pageSize);
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "insert");
            }

            return BuildResponse.CreateOk(this, shoes);
        }


        // POST: api/shoes
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateShoesDto dto)
        {
            // var userOid = GetUserOid();
            // if (userOid == Guid.Empty)
            //     return Unauthorized();

            var (shoes, err) = await _shoesService.CreateAsync(dto, Guid.NewGuid());
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "insert");
            }

            return BuildResponse.CreateOk(this, shoes);
        }

        // PUT: api/shoes/{oid}
        [HttpPut("{oid}")]
        public async Task<IActionResult> Update(Guid oid, [FromBody] UpdateShoesDto dto)
        {
            // var userOid = GetUserOid();
            // if (userOid == Guid.Empty)
            //     return Unauthorized();

            var (shoes, err) = await _shoesService.UpdateAsync(oid, dto, Guid.NewGuid());
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "insert");
            }

            return BuildResponse.CreateOk(this, shoes);
        }

        // DELETE: api/shoes/{oid}
        [HttpDelete("delete/{oid}")]
        public async Task<IActionResult> Delete(Guid oid)
        {
            var (shoes, err) = await _shoesService.DeleteAsync(oid);
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "insert");
            }

            return BuildResponse.CreateOk(this, shoes);
        }

        // Helper: Ambil userOid dari JWT Claim
        private Guid GetUserOid()
        {
            var claim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            return claim != null && Guid.TryParse(claim.Value, out var oid) ? oid : Guid.Empty;
        }
    }
}
