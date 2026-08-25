using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using QuestPDF.Infrastructure;
using System.Text;
using TurismoPDF.Backend.Data;
using TurismoPDF.Backend.Middleware;
using TurismoPDF.Backend.Services;
using TurismoPDF.Backend.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configure Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var provider = builder.Configuration["DatabaseProvider"] ?? "Sqlite";

if (provider.Equals("MySql", StringComparison.OrdinalIgnoreCase) && !string.IsNullOrEmpty(connectionString))
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseMySql(connectionString, ServerVersion.Parse("8.0.36-mysql")));
}
else
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlite("Data Source=gotravel.db"));
}

// Configure JWT Authentication
var key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Secret"] ?? "this_is_a_super_secret_key_that_needs_to_be_long_enough");
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<PdfService>();
builder.Services.AddScoped<EmailService>();

var app = builder.Build();

// Set QuestPDF license
QuestPDF.Settings.License = LicenseType.Community;

// Seed Database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var authService = scope.ServiceProvider.GetRequiredService<AuthService>();
    
    try
    {
        if (!provider.Equals("MySql", StringComparison.OrdinalIgnoreCase))
        {
            context.Database.EnsureCreated();
            try
            {
                context.Database.ExecuteSqlRaw("ALTER TABLE Reservations ADD COLUMN AdultPrice NUMERIC;");
            }
            catch { /* Column already exists */ }
            try
            {
                context.Database.ExecuteSqlRaw("ALTER TABLE Reservations ADD COLUMN ChildPrice NUMERIC;");
            }
            catch { /* Column already exists */ }
        }
        else
        {
            context.Database.Migrate();
        }
    }
    catch
    {
        context.Database.EnsureCreated();
        try
        {
            context.Database.ExecuteSqlRaw("ALTER TABLE Reservations ADD COLUMN AdultPrice NUMERIC;");
        }
        catch { }
        try
        {
            context.Database.ExecuteSqlRaw("ALTER TABLE Reservations ADD COLUMN ChildPrice NUMERIC;");
        }
        catch { }
    }

    if (!context.Users.Any())
    {
        var adminEmail = Environment.GetEnvironmentVariable("ADMIN_EMAIL") ?? "admin@toursgotravel.com";
        var adminPass = Environment.GetEnvironmentVariable("ADMIN_PASSWORD") ?? "Admin123!";
        
        context.Users.Add(new User
        {
            Email = adminEmail,
            PasswordHash = authService.HashPassword(adminPass)
        });
        context.SaveChanges();
    }

    if (!context.PdfSettings.Any())
    {
        context.PdfSettings.Add(new PdfSettings
        {
            PhoneNumber = "+52 624 123 4567",
            Email = "info@toursgotravel.com",
            Website = "https://reservas.toursgotravel.com"
        });
        context.SaveChanges();
    }

    if (!context.Destinations.Any())
    {
        var cabos = new Destination { Name = "Los Cabos", Description = "Baja California Sur", IsActive = true };
        var cancun = new Destination { Name = "Cancún", Description = "Quintana Roo", IsActive = true };
        var vallarta = new Destination { Name = "Puerto Vallarta", Description = "Jalisco", IsActive = true };
        
        context.Destinations.AddRange(cabos, cancun, vallarta);
        context.SaveChanges();

        context.Activities.AddRange(
            new Activity { DestinationId = cabos.Id, Name = "Tour de Camellos - Cabo Adventures", Description = "Paseo en camello por el desierto y playa", Duration = "3 horas", IsActive = true },
            new Activity { DestinationId = cabos.Id, Name = "Snorkel en Cabo Pulmo", Description = "Buceo y snorkel en el parque nacional", Duration = "4 horas", IsActive = true },
            new Activity { DestinationId = cabos.Id, Name = "Paseo en Catamarán al Arco", Description = "Recorrido en barco sunset con bebidas", Duration = "2.5 horas", IsActive = true },
            new Activity { DestinationId = cancun.Id, Name = "Excursión a Chichén Itzá", Description = "Visita a las ruinas mayas y cenote", Duration = "8 horas", IsActive = true },
            new Activity { DestinationId = cancun.Id, Name = "Nado con Delfines en Isla Mujeres", Description = "Experiencia interactiva en catamarán", Duration = "5 horas", IsActive = true },
            new Activity { DestinationId = vallarta.Id, Name = "Tour a las Islas Marietas", Description = "Visita a la playa escondida", Duration = "6 horas", IsActive = true }
        );
        context.SaveChanges();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
