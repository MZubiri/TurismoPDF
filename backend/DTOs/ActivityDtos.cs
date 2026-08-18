using System;

namespace TurismoPDF.Backend.DTOs
{
    public class DestinationNestedDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public class ActivityDto
    {
        public int Id { get; set; }
        public int DestinationId { get; set; }
        public DestinationNestedDto? Destination { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Duration { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateActivityDto
    {
        public int DestinationId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Duration { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class UpdateActivityDto : CreateActivityDto { }
}
