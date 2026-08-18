using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace TurismoPDF.Backend.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
        {
            var emailMessage = new MimeMessage();
            
            var fromAddress = _config["Smtp:From"] ?? "no-reply@toursgotravel.com";
            emailMessage.From.Add(new MailboxAddress("GoTravel", fromAddress));
            emailMessage.To.Add(new MailboxAddress("", toEmail));
            emailMessage.Subject = subject;

            emailMessage.Body = new TextPart("html") { Text = htmlMessage };

            using var client = new SmtpClient();
            var server = _config["Smtp:Server"] ?? "smtp.example.com";
            var port = int.Parse(_config["Smtp:Port"] ?? "587");
            var user = _config["Smtp:User"] ?? "";
            var pass = _config["Smtp:Pass"] ?? "";

            await client.ConnectAsync(server, port, false);
            
            if (!string.IsNullOrEmpty(user))
            {
                await client.AuthenticateAsync(user, pass);
            }

            await client.SendAsync(emailMessage);
            await client.DisconnectAsync(true);
        }
    }
}
