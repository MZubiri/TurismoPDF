using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TurismoPDF.Backend.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        
        [Required]
        public string FirstName { get; set; } = string.Empty;
        [Required]
        public string LastName { get; set; } = string.Empty;
        
        public string? Phone { get; set; }
        public string? Hotel { get; set; }
        
        [Required]
        public int DestinationId { get; set; }
        [ForeignKey("DestinationId")]
        public Destination? Destination { get; set; }
        
        [Required]
        public int ActivityId { get; set; }
        [ForeignKey("ActivityId")]
        public Activity? Activity { get; set; }
        
        public DateOnly ReservationDate { get; set; }
        public string? Notes { get; set; }
        
        public int Adults { get; set; }
        public int Children { get; set; }
        
        public string? PdfFileNameEs { get; set; }
        public string? PdfFileNameEn { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
