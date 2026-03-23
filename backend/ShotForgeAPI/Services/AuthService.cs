// ShotForge API - Auth Servis
// Kullanıcı kimlik doğrulama ve JWT token üretimi.

using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ShotForgeAPI.Data;
using ShotForgeAPI.Models;
using ShotForgeAPI.Models.DTOs;

namespace ShotForgeAPI.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> Login(LoginRequest request);
        Task<AuthResponse> Register(RegisterRequest request);
    }

    /// <summary>
    /// Kimlik doğrulama servisi.
    /// BCrypt ile şifre hashleme ve JWT token üretimi yapar.
    /// </summary>
    public class AuthService : IAuthService
    {
        private readonly ShotForgeContext _context;
        private readonly IConfiguration _config;

        public AuthService(ShotForgeContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        /// <summary>Kullanıcı girişi yap, JWT token döndür</summary>
        public async Task<AuthResponse> Login(LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                throw new UnauthorizedAccessException("E-posta veya şifre hatalı.");

            return new AuthResponse
            {
                Token = GenerateToken(user),
                User = new UserDto { Id = user.Id, Username = user.Username, Email = user.Email }
            };
        }

        /// <summary>Yeni kullanıcı kaydı oluştur</summary>
        public async Task<AuthResponse> Register(RegisterRequest request)
        {
            // E-posta kontrolü
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                throw new InvalidOperationException("Bu e-posta adresi zaten kayıtlı.");

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new AuthResponse
            {
                Token = GenerateToken(user),
                User = new UserDto { Id = user.Id, Username = user.Username, Email = user.Email }
            };
        }

        /// <summary>JWT token oluştur</summary>
        private string GenerateToken(User user)
        {
            var key = _config["Jwt:Key"] ?? "ShotForge_SuperSecretKey_2026_BLM4538!";
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var token = new JwtSecurityToken(
                issuer: "ShotForgeAPI",
                audience: "ShotForgeApp",
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
