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
    [Route("api/v1/souvenir")]
    // [Authorize(Roles = "Base,Admin")]
    // [Authorize(Roles = "Base")]
    // [Authorize] // [AllowAnonymous] //  // jika pakai authentication
     [RoleAuthorize("Admin")]
    // [Authorize(Roles = "Admin")] // pakai ini role jika mau query ulang ke db
    public class SouvenirController : ControllerBase
    {
        private readonly ISouvenirService _souvenirService;

        public SouvenirController(ISouvenirService souvenirService)
        {
            _souvenirService = souvenirService;
        }

        // GET: api/souvenir
        [HttpGet()]
        public async Task<IActionResult> GetAll()
        {
            var (souvenirs, err) = await _souvenirService.FindAllAsync();
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "get all");
            }

            return BuildResponse.FindOk(this, souvenirs, souvenirs.Count);
        }

        // GET: api/souvenir/{oid}
        [HttpGet("{oid}")]
        public async Task<IActionResult> GetById(Guid oid)
        {
            var (souvenir, err) = await _souvenirService.FindByIdAsync(oid);
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "get By Oid");
            }

            return BuildResponse.FindOk(this, souvenir);
        }

        [HttpPost("q")]
        public async Task<IActionResult> FindPage([FromBody] SouvenirFilterDto dto, [FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 10)
        {
            // var userOid = GetUserOid();
            // if (userOid == Guid.Empty)
            //     return Unauthorized();

            var (souvenir, err) = await _souvenirService.FindPageAsync(dto, pageIndex, pageSize);
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "insert");
            }

            return BuildResponse.CreateOk(this, souvenir);
        }


        // POST: api/souvenir
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateSouvenirDto dto)
        {
            // var userOid = GetUserOid();
            // if (userOid == Guid.Empty)
            //     return Unauthorized();

            var (souvenir, err) = await _souvenirService.CreateAsync(dto, Guid.NewGuid());
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "insert");
            }

            return BuildResponse.CreateOk(this, souvenir);
        }

        // PUT: api/souvenir/{oid}
        [HttpPut("{oid}")]
        public async Task<IActionResult> Update(Guid oid, [FromBody] UpdateSouvenirDto dto)
        {
            // var userOid = GetUserOid();
            // if (userOid == Guid.Empty)
            //     return Unauthorized();

            var (souvenir, err) = await _souvenirService.UpdateAsync(oid, dto, Guid.NewGuid());
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "insert");
            }

            return BuildResponse.CreateOk(this, souvenir);
        }

        // DELETE: api/souvenir/{oid}
        [HttpDelete("delete/{oid}")]
        public async Task<IActionResult> Delete(Guid oid)
        {
            var (souvenir, err) = await _souvenirService.DeleteAsync(oid);
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "insert");
            }

            return BuildResponse.CreateOk(this, souvenir);
        }

        // Helper: Ambil userOid dari JWT Claim
        private Guid GetUserOid()
        {
            var claim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            return claim != null && Guid.TryParse(claim.Value, out var oid) ? oid : Guid.Empty;
        }
    }
}
