// ShotForge API - Stat Modeli
// Oyuncu sezon istatistiklerini temsil eder.

namespace ShotForgeAPI.Models
{
    /// <summary>
    /// Oyuncu istatistikleri modeli.
    /// Maç başına sayı, asist, ribaund gibi veriler içerir.
    /// </summary>
    public class Stat
    {
        public int Id { get; set; }
        public int PlayerId { get; set; }
        public int GamesPlayed { get; set; }
        public double PointsPerGame { get; set; }
        public double AssistsPerGame { get; set; }
        public double ReboundsPerGame { get; set; }
        public double FieldGoalPercentage { get; set; }

        // Navigation Property
        public Player? Player { get; set; }
    }
}
