// ShotForge API - DbContext
// Entity Framework Core veritabanı bağlam sınıfı ve seed data.

using Microsoft.EntityFrameworkCore;
using ShotForgeAPI.Models;

namespace ShotForgeAPI.Data
{
    /// <summary>
    /// ShotForge veritabanı bağlam sınıfı.
    /// SQLite ile çalışır, tüm tabloları yönetir.
    /// </summary>
    public class ShotForgeContext : DbContext
    {
        public ShotForgeContext(DbContextOptions<ShotForgeContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<Shot> Shots { get; set; }
        public DbSet<Stat> Stats { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // User - benzersiz email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Player - Shots ilişkisi
            modelBuilder.Entity<Shot>()
                .HasOne(s => s.Player)
                .WithMany(p => p.Shots)
                .HasForeignKey(s => s.PlayerId);

            // Player - Stats ilişkisi (1:1)
            modelBuilder.Entity<Stat>()
                .HasOne(s => s.Player)
                .WithOne(p => p.Stats)
                .HasForeignKey<Stat>(s => s.PlayerId);
        }

        /// <summary>
        /// Veritabanına başlangıç verilerini ekler.
        /// Sadece boş veritabanında çalışır.
        /// </summary>
        public static void SeedData(ShotForgeContext context)
        {
            if (context.Players.Any()) return; // Zaten veri varsa çık

            // Demo oyuncular
            var players = new List<Player>
            {
                new Player { Name = "LeBron James", Team = "LA Lakers", Position = "SF", JerseyNumber = 23, ImageUrl = "" },
                new Player { Name = "Stephen Curry", Team = "Golden State Warriors", Position = "PG", JerseyNumber = 30, ImageUrl = "" },
                new Player { Name = "Kevin Durant", Team = "Phoenix Suns", Position = "SF", JerseyNumber = 35, ImageUrl = "" },
                new Player { Name = "Giannis Antetokounmpo", Team = "Milwaukee Bucks", Position = "PF", JerseyNumber = 34, ImageUrl = "" },
                new Player { Name = "Luka Doncic", Team = "Dallas Mavericks", Position = "PG", JerseyNumber = 77, ImageUrl = "" },
            };
            context.Players.AddRange(players);
            context.SaveChanges();

            // Demo istatistikler
            var stats = new List<Stat>
            {
                new Stat { PlayerId = 1, GamesPlayed = 72, PointsPerGame = 27.4, AssistsPerGame = 8.3, ReboundsPerGame = 7.1, FieldGoalPercentage = 51.2 },
                new Stat { PlayerId = 2, GamesPlayed = 68, PointsPerGame = 29.6, AssistsPerGame = 6.3, ReboundsPerGame = 5.2, FieldGoalPercentage = 48.7 },
                new Stat { PlayerId = 3, GamesPlayed = 60, PointsPerGame = 28.3, AssistsPerGame = 5.4, ReboundsPerGame = 6.7, FieldGoalPercentage = 53.1 },
                new Stat { PlayerId = 4, GamesPlayed = 70, PointsPerGame = 31.1, AssistsPerGame = 5.8, ReboundsPerGame = 11.8, FieldGoalPercentage = 55.3 },
                new Stat { PlayerId = 5, GamesPlayed = 66, PointsPerGame = 33.9, AssistsPerGame = 9.8, ReboundsPerGame = 9.2, FieldGoalPercentage = 48.7 },
            };
            context.Stats.AddRange(stats);
            context.SaveChanges();

            // Demo şut verileri (her oyuncuya 10 şut)
            var random = new Random(42);
            var shotTypes = new[] { "TWO_POINT", "THREE_POINT", "FREE_THROW" };
            foreach (var player in players)
            {
                for (int i = 0; i < 10; i++)
                {
                    context.Shots.Add(new Shot
                    {
                        PlayerId = player.Id,
                        X = Math.Round(random.NextDouble() * 100, 1),
                        Y = Math.Round(random.NextDouble() * 80, 1),
                        Made = random.Next(2) == 1,
                        ShotType = shotTypes[random.Next(shotTypes.Length)],
                        CreatedAt = DateTime.UtcNow.AddDays(-random.Next(30))
                    });
                }
            }
            context.SaveChanges();
        }
    }
}
