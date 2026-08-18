using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TurismoPDF.Backend.Models
{
    public class Activity
    {
        public int Id { get; set; }
        
        [Required]
        public int DestinationId { get; set; }
        [ForeignKey("DestinationId")]
        public Destination? Destination { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Duration { get; set; }
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
