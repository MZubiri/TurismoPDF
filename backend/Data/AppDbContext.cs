using Microsoft.EntityFrameworkCore;
using TurismoPDF.Backend.Models;

namespace TurismoPDF.Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Destination> Destinations { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<PdfSettings> PdfSettings { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Destination)
                .WithMany()
                .HasForeignKey(r => r.DestinationId);

            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Activity)
                .WithMany()
                .HasForeignKey(r => r.ActivityId);
        }
    }
}
