/**
 * ShotForge API - Program.cs
 * 
 * ASP.NET Core Web API ana giriş noktası.
 * Servisleri, veritabanı bağlantısını, JWT kimlik doğrulamayı
 * ve Swagger'ı yapılandırır.
 */

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ShotForgeAPI.Data;
using ShotForgeAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// === Veritabanı Yapılandırması (SQLite) ===
builder.Services.AddDbContext<ShotForgeContext>(options =>
    options.UseSqlite("Data Source=ShotForge.db"));

// === JWT Kimlik Doğrulama ===
var jwtKey = builder.Configuration["Jwt:Key"] ?? "ShotForge_SuperSecretKey_2026_BLM4538!";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "ShotForgeAPI",
            ValidAudience = "ShotForgeApp",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

// === Servis Kayıtları ===
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPlayerService, PlayerService>();

// === Controller ve Swagger ===
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// === CORS (React Native'den erişim için) ===
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// === Veritabanını Oluştur ve Seed Data Ekle ===
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ShotForgeContext>();
    context.Database.EnsureCreated();
    ShotForgeContext.SeedData(context);
}

// === Middleware Pipeline ===
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
