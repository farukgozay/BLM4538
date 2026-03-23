// ShotForge API - DTOs (Data Transfer Objects)
// API request ve response için kullanılan veri modelleri.

namespace ShotForgeAPI.Models.DTOs
{
    // === Auth DTOs ===

    /// <summary>Giriş isteği</summary>
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    /// <summary>Kayıt isteği</summary>
    public class RegisterRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    /// <summary>Auth yanıtı (token + kullanıcı bilgisi)</summary>
    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public UserDto User { get; set; } = new();
    }

    /// <summary>Kullanıcı bilgisi (şifre hariç)</summary>
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    // === Player DTOs ===

    /// <summary>Oyuncu listesi için özet bilgi</summary>
    public class PlayerListDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Team { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public int JerseyNumber { get; set; }
        public string? ImageUrl { get; set; }
    }

    /// <summary>Oyuncu detay (istatistik + şutlar dahil)</summary>
    public class PlayerDetailDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Team { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public int JerseyNumber { get; set; }
        public string? ImageUrl { get; set; }
        public StatDto? Stats { get; set; }
        public List<ShotDto> Shots { get; set; } = new();
    }

    /// <summary>İstatistik bilgisi</summary>
    public class StatDto
    {
        public int GamesPlayed { get; set; }
        public double PointsPerGame { get; set; }
        public double AssistsPerGame { get; set; }
        public double ReboundsPerGame { get; set; }
        public double FieldGoalPercentage { get; set; }
    }

    /// <summary>Şut verisi</summary>
    public class ShotDto
    {
        public int Id { get; set; }
        public double X { get; set; }
        public double Y { get; set; }
        public bool Made { get; set; }
        public string ShotType { get; set; } = string.Empty;
    }
}
