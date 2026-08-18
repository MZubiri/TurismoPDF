using System;
using System.ComponentModel.DataAnnotations;

namespace TurismoPDF.Backend.Models
{
    public class PasswordResetToken
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }
        public User? User { get; set; }

        [Required]
        public string Token { get; set; } = string.Empty;

        [Required]
        public DateTime ExpirationDate { get; set; }
        
        public bool IsUsed { get; set; } = false;
    }
}
