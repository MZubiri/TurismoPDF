using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TurismoPDF.Backend.Data;
using TurismoPDF.Backend.DTOs;
using TurismoPDF.Backend.Models;
using TurismoPDF.Backend.Services;

namespace TurismoPDF.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly AuthService _authService;
        private readonly EmailService _emailService;

        public AuthController(AppDbContext context, AuthService authService, EmailService emailService)
        {
            _context = context;
            _authService = authService;
            _emailService = emailService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
            if (user == null || !_authService.VerifyPassword(req.Password, user.PasswordHash))
                return Unauthorized(new { Message = "Invalid credentials" });

            var token = _authService.GenerateJwtToken(user);
            return Ok(new AuthResponse { Token = token });
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest req)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
                return Unauthorized();

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            if (!_authService.VerifyPassword(req.CurrentPassword, user.PasswordHash))
                return BadRequest(new { Message = "Current password is incorrect" });

            user.PasswordHash = _authService.HashPassword(req.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Password updated" });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest req)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
            if (user == null) 
                return Ok(new { Message = "If the email is registered, a password reset link has been sent." }); // Prevent email enumeration

            var token = Guid.NewGuid().ToString();
            var resetToken = new PasswordResetToken
            {
                UserId = user.Id,
                Token = token,
                ExpirationDate = DateTime.UtcNow.AddHours(1)
            };

            _context.PasswordResetTokens.Add(resetToken);
            await _context.SaveChangesAsync();

            var resetLink = $"http://localhost:5173/reset-password?token={token}";
            var htmlMessage = $"<p>Click <a href='{resetLink}'>here</a> to reset your password. The link will expire in 1 hour.</p>";
            await _emailService.SendEmailAsync(user.Email, "Reset your password", htmlMessage);

            return Ok(new { Message = "If the email is registered, a password reset link has been sent." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest req)
        {
            var resetToken = await _context.PasswordResetTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Token == req.Token && !t.IsUsed && t.ExpirationDate > DateTime.UtcNow);

            if (resetToken == null)
                return BadRequest(new { Message = "Invalid or expired token." });

            var user = resetToken.User;
            if (user == null)
                return BadRequest(new { Message = "User not found." });

            user.PasswordHash = _authService.HashPassword(req.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;
            
            resetToken.IsUsed = true;

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Password reset successful." });
        }
    }
}
