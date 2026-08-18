using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TurismoPDF.Backend.Data;
using TurismoPDF.Backend.DTOs;
using TurismoPDF.Backend.Models;

namespace TurismoPDF.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PdfSettingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PdfSettingsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<PdfSettingsDto>> Get()
        {
            var settings = await _context.PdfSettings.FirstOrDefaultAsync();
            if (settings == null) return NotFound();

            return new PdfSettingsDto
            {
                Id = settings.Id,
                PhoneNumber = settings.PhoneNumber,
                Email = settings.Email,
                Website = settings.Website
            };
        }

        [HttpPut]
        public async Task<IActionResult> Update(UpdatePdfSettingsDto dto)
        {
            var settings = await _context.PdfSettings.FirstOrDefaultAsync();
            if (settings == null)
            {
                settings = new PdfSettings();
                _context.PdfSettings.Add(settings);
            }

            settings.PhoneNumber = dto.PhoneNumber;
            settings.Email = dto.Email;
            settings.Website = dto.Website;
            settings.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
