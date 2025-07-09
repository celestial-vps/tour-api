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
    public class VenueController : ControllerBase
    {
        private readonly IVenueService _venueService;

        public VenueController(IVenueService venueService)
        {
            _venueService = venueService;
        }

        // GET: api/venue
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var (venues, err) = await _venueService.FindAllAsync();
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "get all");
            }

            return BuildResponse.FindOk(this, venues, venues.Count);
        }

        // GET: api/venue/{oid}
        [HttpGet("{oid}")]
        public async Task<IActionResult> GetById(Guid oid)
        {
            var (venue, err) = await _venueService.FindByIdAsync(oid);
            if (err != null) return StatusCode(err.Status, err);

            if (venue == null) return NotFound();

            return Ok(venue);
        }

        // POST: api/venue
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateVenueDto dto)
        {
            // var userOid = GetUserOid();
            // if (userOid == Guid.Empty)
            //     return Unauthorized();

            var (venue, err) = await _venueService.CreateAsync(dto, Guid.NewGuid());
            if (err != null)
            {
                return BuildResponse.SendQueryError(this, err.Message, "insert");
            }

            return BuildResponse.CreateOk(this, venue);
        }

        // PUT: api/venue/{oid}
        [HttpPut("{oid}")]
        public async Task<IActionResult> Update(Guid oid, [FromBody] UpdateVenueDto dto)
        {
            var userOid = GetUserOid();
            if (userOid == Guid.Empty)
                return Unauthorized();

            var (venue, err) = await _venueService.UpdateAsync(oid, dto, userOid);
            if (err != null) return StatusCode(err.Status, err);

            return Ok(venue);
        }

        // DELETE: api/venue/{oid}
        [HttpDelete("{oid}")]
        public async Task<IActionResult> Delete(Guid oid)
        {
            var (venue, err) = await _venueService.DeleteAsync(oid);
            if (err != null) return StatusCode(err.Status, err);

            return Ok(venue);
        }

        // Helper: Ambil userOid dari JWT Claim
        private Guid GetUserOid()
        {
            var claim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            return claim != null && Guid.TryParse(claim.Value, out var oid) ? oid : Guid.Empty;
        }
    }
}
