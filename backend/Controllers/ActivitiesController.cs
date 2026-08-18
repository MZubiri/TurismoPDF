using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TurismoPDF.Backend.Data;
using TurismoPDF.Backend.DTOs;
using TurismoPDF.Backend.Models;

namespace TurismoPDF.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivitiesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ActivitiesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ActivityDto>>> Get([FromQuery] int? destinationId)
        {
            var query = _context.Activities.Include(a => a.Destination).AsQueryable();
            if (destinationId.HasValue)
            {
                query = query.Where(a => a.DestinationId == destinationId.Value);
            }

            return await query.Select(a => new ActivityDto
            {
                Id = a.Id,
                DestinationId = a.DestinationId,
                Destination = a.Destination != null ? new DestinationNestedDto
                {
                    Id = a.Destination.Id,
                    Name = a.Destination.Name
                } : null,
                Name = a.Name,
                Description = a.Description,
                Duration = a.Duration,
                IsActive = a.IsActive,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt
            }).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ActivityDto>> Get(int id)
        {
            var a = await _context.Activities.Include(x => x.Destination).FirstOrDefaultAsync(x => x.Id == id);
            if (a == null) return NotFound();

            return new ActivityDto
            {
                Id = a.Id,
                DestinationId = a.DestinationId,
                Destination = a.Destination != null ? new DestinationNestedDto
                {
                    Id = a.Destination.Id,
                    Name = a.Destination.Name
                } : null,
                Name = a.Name,
                Description = a.Description,
                Duration = a.Duration,
                IsActive = a.IsActive,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt
            };
        }

        [HttpPost]
        public async Task<ActionResult<ActivityDto>> Post(CreateActivityDto dto)
        {
            var activity = new Activity
            {
                DestinationId = dto.DestinationId,
                Name = dto.Name,
                Description = dto.Description,
                Duration = dto.Duration,
                IsActive = dto.IsActive
            };
            _context.Activities.Add(activity);
            await _context.SaveChangesAsync();

            var dest = await _context.Destinations.FindAsync(activity.DestinationId);

            return CreatedAtAction(nameof(Get), new { id = activity.Id }, new ActivityDto
            {
                Id = activity.Id,
                DestinationId = activity.DestinationId,
                Destination = dest != null ? new DestinationNestedDto { Id = dest.Id, Name = dest.Name } : null,
                Name = activity.Name,
                Description = activity.Description,
                Duration = activity.Duration,
                IsActive = activity.IsActive,
                CreatedAt = activity.CreatedAt,
                UpdatedAt = activity.UpdatedAt
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, UpdateActivityDto dto)
        {
            var activity = await _context.Activities.FindAsync(id);
            if (activity == null) return NotFound();

            activity.DestinationId = dto.DestinationId;
            activity.Name = dto.Name;
            activity.Description = dto.Description;
            activity.Duration = dto.Duration;
            activity.IsActive = dto.IsActive;
            activity.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var activity = await _context.Activities.FindAsync(id);
            if (activity == null) return NotFound();

            _context.Activities.Remove(activity);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
