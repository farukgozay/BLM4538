// ShotForge API - Player Modeli
// Basketbol oyuncusu bilgilerini temsil eder.

namespace ShotForgeAPI.Models
{
    /// <summary>
    /// Basketbol oyuncusu modeli.
    /// Oyuncu profil bilgileri ve ilişkili veriler.
    /// </summary>
    public class Player
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Team { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public int JerseyNumber { get; set; }
        public string? ImageUrl { get; set; }

        // Navigation Properties
        public List<Shot> Shots { get; set; } = new();
        public Stat? Stats { get; set; }
    }
}
