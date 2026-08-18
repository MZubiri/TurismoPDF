using System;

namespace TurismoPDF.Backend.DTOs
{
    public class ActivityNestedDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public class ReservationDto
    {
        public int Id { get; set; }
        public string Folio => $"FOL-{Id:D4}";
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Hotel { get; set; }
        public int DestinationId { get; set; }
        public DestinationNestedDto? Destination { get; set; }
        public int ActivityId { get; set; }
        public ActivityNestedDto? Activity { get; set; }
        public DateOnly ReservationDate { get; set; }
        public string? Notes { get; set; }
        public int Adults { get; set; }
        public int Children { get; set; }
        public string? PdfFileNameEs { get; set; }
        public string? PdfFileNameEn { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateReservationDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Hotel { get; set; }
        public int DestinationId { get; set; }
        public int ActivityId { get; set; }
        public DateOnly ReservationDate { get; set; }
        public string? Notes { get; set; }
        public int Adults { get; set; }
        public int Children { get; set; }
    }

    public class UpdateReservationDto : CreateReservationDto { }
}
