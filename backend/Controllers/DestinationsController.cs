using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TurismoPDF.Backend.Data;
using TurismoPDF.Backend.DTOs;
using TurismoPDF.Backend.Models;

namespace TurismoPDF.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DestinationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DestinationsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DestinationDto>>> Get()
        {
            return await _context.Destinations
                .Select(d => new DestinationDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    Description = d.Description,
                    ImageUrl = d.ImageUrl,
                    IsActive = d.IsActive,
                    CreatedAt = d.CreatedAt,
                    UpdatedAt = d.UpdatedAt
                }).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DestinationDto>> Get(int id)
        {
            var d = await _context.Destinations.FindAsync(id);
            if (d == null) return NotFound();

            return new DestinationDto
            {
                Id = d.Id,
                Name = d.Name,
                Description = d.Description,
                ImageUrl = d.ImageUrl,
                IsActive = d.IsActive,
                CreatedAt = d.CreatedAt,
                UpdatedAt = d.UpdatedAt
            };
        }

        [HttpPost]
        public async Task<ActionResult<DestinationDto>> Post(CreateDestinationDto dto)
        {
            var destination = new Destination
            {
                Name = dto.Name,
                Description = dto.Description,
                ImageUrl = dto.ImageUrl,
                IsActive = dto.IsActive
            };
            _context.Destinations.Add(destination);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = destination.Id }, new DestinationDto
            {
                Id = destination.Id,
                Name = destination.Name,
                Description = destination.Description,
                ImageUrl = destination.ImageUrl,
                IsActive = destination.IsActive,
                CreatedAt = destination.CreatedAt,
                UpdatedAt = destination.UpdatedAt
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, UpdateDestinationDto dto)
        {
            var destination = await _context.Destinations.FindAsync(id);
            if (destination == null) return NotFound();

            destination.Name = dto.Name;
            destination.Description = dto.Description;
            destination.ImageUrl = dto.ImageUrl;
            destination.IsActive = dto.IsActive;
            destination.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var destination = await _context.Destinations.FindAsync(id);
            if (destination == null) return NotFound();

            _context.Destinations.Remove(destination);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
