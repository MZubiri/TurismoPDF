using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TurismoPDF.Backend.Data;
using TurismoPDF.Backend.DTOs;
using TurismoPDF.Backend.Models;
using TurismoPDF.Backend.Services;
using System.IO;

namespace TurismoPDF.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly PdfService _pdfService;
        private readonly IWebHostEnvironment _env;

        public ReservationsController(AppDbContext context, PdfService pdfService, IWebHostEnvironment env)
        {
            _context = context;
            _pdfService = pdfService;
            _env = env;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReservationDto>>> Get()
        {
            return await _context.Reservations
                .Include(r => r.Destination)
                .Include(r => r.Activity)
                .Select(r => new ReservationDto
                {
                    Id = r.Id,
                    FirstName = r.FirstName,
                    LastName = r.LastName,
                    Phone = r.Phone,
                    Hotel = r.Hotel,
                    DestinationId = r.DestinationId,
                    Destination = r.Destination != null ? new DestinationNestedDto { Id = r.Destination.Id, Name = r.Destination.Name } : null,
                    ActivityId = r.ActivityId,
                    Activity = r.Activity != null ? new ActivityNestedDto { Id = r.Activity.Id, Name = r.Activity.Name } : null,
                    ReservationDate = r.ReservationDate,
                    Notes = r.Notes,
                    Adults = r.Adults,
                    AdultPrice = r.AdultPrice,
                    Children = r.Children,
                    ChildPrice = r.ChildPrice,
                    PdfFileNameEs = r.PdfFileNameEs,
                    PdfFileNameEn = r.PdfFileNameEn,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                }).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReservationDto>> Get(int id)
        {
            var r = await _context.Reservations
                .Include(x => x.Destination)
                .Include(x => x.Activity)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (r == null) return NotFound();

            return new ReservationDto
            {
                Id = r.Id,
                FirstName = r.FirstName,
                LastName = r.LastName,
                Phone = r.Phone,
                Hotel = r.Hotel,
                DestinationId = r.DestinationId,
                Destination = r.Destination != null ? new DestinationNestedDto { Id = r.Destination.Id, Name = r.Destination.Name } : null,
                ActivityId = r.ActivityId,
                Activity = r.Activity != null ? new ActivityNestedDto { Id = r.Activity.Id, Name = r.Activity.Name } : null,
                ReservationDate = r.ReservationDate,
                Notes = r.Notes,
                Adults = r.Adults,
                AdultPrice = r.AdultPrice,
                Children = r.Children,
                ChildPrice = r.ChildPrice,
                PdfFileNameEs = r.PdfFileNameEs,
                PdfFileNameEn = r.PdfFileNameEn,
                CreatedAt = r.CreatedAt,
                UpdatedAt = r.UpdatedAt
            };
        }

        [HttpPost]
        public async Task<ActionResult<ReservationDto>> Post(CreateReservationDto dto)
        {
            var reservation = new Reservation
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Phone = dto.Phone,
                Hotel = dto.Hotel,
                DestinationId = dto.DestinationId,
                ActivityId = dto.ActivityId,
                ReservationDate = dto.ReservationDate,
                Notes = dto.Notes,
                Adults = dto.Adults,
                AdultPrice = dto.AdultPrice,
                Children = dto.Children,
                ChildPrice = dto.ChildPrice
            };

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            var createdRes = await _context.Reservations
                .Include(r => r.Destination)
                .Include(r => r.Activity)
                .FirstOrDefaultAsync(r => r.Id == reservation.Id);

            if (createdRes != null)
            {
                var settings = await _context.PdfSettings.FirstOrDefaultAsync() ?? new PdfSettings();
                var pdfsFolder = Path.Combine(_env.ContentRootPath, "pdfs");
                if (!Directory.Exists(pdfsFolder)) Directory.CreateDirectory(pdfsFolder);

                createdRes.PdfFileNameEs = _pdfService.GenerateVoucherPdf(createdRes, settings, "es", pdfsFolder);
                createdRes.PdfFileNameEn = _pdfService.GenerateVoucherPdf(createdRes, settings, "en", pdfsFolder);
                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(Get), new { id = reservation.Id }, new ReservationDto
            {
                Id = reservation.Id,
                FirstName = reservation.FirstName,
                LastName = reservation.LastName,
                Phone = reservation.Phone,
                Hotel = reservation.Hotel,
                DestinationId = reservation.DestinationId,
                Destination = createdRes?.Destination != null ? new DestinationNestedDto { Id = createdRes.Destination.Id, Name = createdRes.Destination.Name } : null,
                ActivityId = reservation.ActivityId,
                Activity = createdRes?.Activity != null ? new ActivityNestedDto { Id = createdRes.Activity.Id, Name = createdRes.Activity.Name } : null,
                ReservationDate = reservation.ReservationDate,
                Notes = reservation.Notes,
                Adults = reservation.Adults,
                AdultPrice = reservation.AdultPrice,
                Children = reservation.Children,
                ChildPrice = reservation.ChildPrice,
                PdfFileNameEs = createdRes?.PdfFileNameEs,
                PdfFileNameEn = createdRes?.PdfFileNameEn,
                CreatedAt = reservation.CreatedAt,
                UpdatedAt = reservation.UpdatedAt
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, UpdateReservationDto dto)
        {
            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null) return NotFound();

            reservation.FirstName = dto.FirstName;
            reservation.LastName = dto.LastName;
            reservation.Phone = dto.Phone;
            reservation.Hotel = dto.Hotel;
            reservation.DestinationId = dto.DestinationId;
            reservation.ActivityId = dto.ActivityId;
            reservation.ReservationDate = dto.ReservationDate;
            reservation.Notes = dto.Notes;
            reservation.Adults = dto.Adults;
            reservation.AdultPrice = dto.AdultPrice;
            reservation.Children = dto.Children;
            reservation.ChildPrice = dto.ChildPrice;
            reservation.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null) return NotFound();

            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{id}/pdf")]
        public async Task<IActionResult> GeneratePdf(int id, [FromQuery] string lang = "es")
        {
            var reservation = await _context.Reservations
                .Include(r => r.Destination)
                .Include(r => r.Activity)
                .FirstOrDefaultAsync(r => r.Id == id);
            
            if (reservation == null) return NotFound();

            var settings = await _context.PdfSettings.FirstOrDefaultAsync() ?? new PdfSettings();
            
            var pdfsFolder = Path.Combine(_env.ContentRootPath, "pdfs");
            if (!Directory.Exists(pdfsFolder))
                Directory.CreateDirectory(pdfsFolder);

            var fileName = _pdfService.GenerateVoucherPdf(reservation, settings, lang, pdfsFolder);

            if (lang.ToLower() == "es")
                reservation.PdfFileNameEs = fileName;
            else
                reservation.PdfFileNameEn = fileName;

            await _context.SaveChangesAsync();

            return Ok(new { FileName = fileName });
        }

        [HttpGet("{id}/pdf")]
        public async Task<IActionResult> DownloadPdf(int id, [FromQuery] string lang = "es")
        {
            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null) return NotFound();

            var fileName = lang.ToLower() == "es" ? reservation.PdfFileNameEs : reservation.PdfFileNameEn;
            if (string.IsNullOrEmpty(fileName)) return NotFound("PDF not generated yet.");

            var pdfsFolder = Path.Combine(_env.ContentRootPath, "pdfs");
            var filePath = Path.Combine(pdfsFolder, fileName);

            if (!System.IO.File.Exists(filePath)) return NotFound("File not found.");

            var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            return new FileStreamResult(stream, "application/pdf") { FileDownloadName = fileName };
        }
    }
}
