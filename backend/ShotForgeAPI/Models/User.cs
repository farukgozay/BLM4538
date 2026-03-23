// ShotForge API - User Modeli
// Kullanıcı bilgilerini temsil eder.

namespace ShotForgeAPI.Models
{
    /// <summary>
    /// Uygulama kullanıcısı modeli.
    /// Kimlik doğrulama ve yetkilendirme için kullanılır.
    /// </summary>
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
