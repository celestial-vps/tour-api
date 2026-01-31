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
    [Route("api/v1/music")]
    // [Authorize(Roles = "Base,Admin")]
    // [Authorize(Roles = "Base")]
    // [Authorize] // [AllowAnonymous] //  // jika pakai authentication
     [RoleAuthorize("Admin")]
    // [Authorize(Roles = "Admin")] // pakai ini role jika mau query ulang ke db
    public class MusicController : ControllerBase
    {
        private readonly IMusicService _musicService;

        public MusicController(IMusicService musicService)
        {
            _musicService = musicService;
        }

        // GET: api/music
        [HttpGet()]
        public async Task<IActionResult> GetAll()
        {
            var (musics, err) = await _musicService.FindAllAsync();
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "get all");
            }

            return BuildResponse.FindOk(this, musics, musics.Count);
        }

        // GET: api/music/{oid}
        [HttpGet("{oid}")]
        public async Task<IActionResult> GetById(Guid oid)
        {
            var (music, err) = await _musicService.FindByIdAsync(oid);
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "get By Oid");
            }

            return BuildResponse.FindOk(this, music);
        }

        [HttpPost("q")]
        public async Task<IActionResult> FindPage([FromBody] MusicFilterDto dto, [FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 10)
        {
            // var userOid = GetUserOid();
            // if (userOid == Guid.Empty)
            //     return Unauthorized();

            var (music, err) = await _musicService.FindPageAsync(dto, pageIndex, pageSize);
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "insert");
            }

            return BuildResponse.CreateOk(this, music);
        }


        // POST: api/music
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateMusicDto dto)
        {
            // var userOid = GetUserOid();
            // if (userOid == Guid.Empty)
            //     return Unauthorized();

            var (music, err) = await _musicService.CreateAsync(dto, Guid.NewGuid());
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "insert");
            }

            return BuildResponse.CreateOk(this, music);
        }

        // PUT: api/music/{oid}
        [HttpPut("{oid}")]
        public async Task<IActionResult> Update(Guid oid, [FromBody] UpdateMusicDto dto)
        {
            // var userOid = GetUserOid();
            // if (userOid == Guid.Empty)
            //     return Unauthorized();

            var (music, err) = await _musicService.UpdateAsync(oid, dto, Guid.NewGuid());
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "insert");
            }

            return BuildResponse.CreateOk(this, music);
        }

        // DELETE: api/music/{oid}
        [HttpDelete("delete/{oid}")]
        public async Task<IActionResult> Delete(Guid oid)
        {
            var (music, err) = await _musicService.DeleteAsync(oid);
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "insert");
            }

            return BuildResponse.CreateOk(this, music);
        }

        // Helper: Ambil userOid dari JWT Claim
        private Guid GetUserOid()
        {
            var claim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            return claim != null && Guid.TryParse(claim.Value, out var oid) ? oid : Guid.Empty;
        }
    }
}
