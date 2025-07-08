using Microsoft.AspNetCore.Mvc;

namespace WeddingOrganizerAPI.Controllers
{
    [ApiController]
    [Route("api/venues")]
    public class VenueController : ControllerBase
    {
        private readonly IVenueService _service;
        public VenueController(IVenueService service) => _service = service;

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Venue v)
        {
            var (created, err) = await _service.CreateAsync(v);
            if (err != null) return StatusCode(500, err.Message);
            return CreatedAtAction(nameof(Get), new { id = created!.Oid }, created);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var (res, err) = await _service.GetByIdAsync(id);
            if (err != null) return StatusCode(500, err.Message);
            if (res == null) return NotFound();
            return Ok(res);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Venue v)
        {
            var (updated, err) = await _service.UpdateAsync(id, v);
            if (err != null)
            {
                if (err is KeyNotFoundException) return NotFound();
                return StatusCode(500, err.Message);
            }
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var (success, err) = await _service.DeleteAsync(id);
            if (err != null) return StatusCode(500, err.Message);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}