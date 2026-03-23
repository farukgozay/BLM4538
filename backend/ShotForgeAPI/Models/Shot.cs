// ShotForge API - Shot Modeli
// Oyuncunun attığı şut verilerini temsil eder.

namespace ShotForgeAPI.Models
{
    /// <summary>
    /// Şut verisi modeli.
    /// Saha üzerinde X,Y koordinatları ve isabetlilik bilgisi içerir.
    /// </summary>
    public class Shot
    {
        public int Id { get; set; }
        public int PlayerId { get; set; }
        public double X { get; set; }       // Saha üzerinde X koordinatı (0-100)
        public double Y { get; set; }       // Saha üzerinde Y koordinatı (0-100)
        public bool Made { get; set; }      // İsabetli mi?
        public string ShotType { get; set; } = string.Empty; // TWO_POINT, THREE_POINT, FREE_THROW
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property
        public Player? Player { get; set; }
    }
}
