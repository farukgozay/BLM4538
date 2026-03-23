// ShotForge API - Player Servis
// Oyuncu verilerini veritabanından sorgulama.

using Microsoft.EntityFrameworkCore;
using ShotForgeAPI.Data;
using ShotForgeAPI.Models.DTOs;

namespace ShotForgeAPI.Services
{
    public interface IPlayerService
    {
        Task<List<PlayerListDto>> GetAllPlayers();
        Task<PlayerDetailDto?> GetPlayerById(int id);
        Task<object> ComparePlayers(int id1, int id2);
    }

    /// <summary>
    /// Oyuncu servis katmanı.
    /// Listeleme, detay ve karşılaştırma işlemlerini yönetir.
    /// </summary>
    public class PlayerService : IPlayerService
    {
        private readonly ShotForgeContext _context;

        public PlayerService(ShotForgeContext context)
        {
            _context = context;
        }

        /// <summary>Tüm oyuncuları listele</summary>
        public async Task<List<PlayerListDto>> GetAllPlayers()
        {
            return await _context.Players
                .Select(p => new PlayerListDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Team = p.Team,
                    Position = p.Position,
                    JerseyNumber = p.JerseyNumber,
                    ImageUrl = p.ImageUrl
                })
                .ToListAsync();
        }

        /// <summary>Oyuncu detayını getir (istatistik + şutlar)</summary>
        public async Task<PlayerDetailDto?> GetPlayerById(int id)
        {
            var player = await _context.Players
                .Include(p => p.Stats)
                .Include(p => p.Shots)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (player == null) return null;

            return new PlayerDetailDto
            {
                Id = player.Id,
                Name = player.Name,
                Team = player.Team,
                Position = player.Position,
                JerseyNumber = player.JerseyNumber,
                ImageUrl = player.ImageUrl,
                Stats = player.Stats != null ? new StatDto
                {
                    GamesPlayed = player.Stats.GamesPlayed,
                    PointsPerGame = player.Stats.PointsPerGame,
                    AssistsPerGame = player.Stats.AssistsPerGame,
                    ReboundsPerGame = player.Stats.ReboundsPerGame,
                    FieldGoalPercentage = player.Stats.FieldGoalPercentage
                } : null,
                Shots = player.Shots.Select(s => new ShotDto
                {
                    Id = s.Id,
                    X = s.X,
                    Y = s.Y,
                    Made = s.Made,
                    ShotType = s.ShotType
                }).ToList()
            };
        }

        /// <summary>İki oyuncuyu karşılaştır</summary>
        public async Task<object> ComparePlayers(int id1, int id2)
        {
            var player1 = await GetPlayerById(id1);
            var player2 = await GetPlayerById(id2);

            if (player1 == null || player2 == null)
                throw new KeyNotFoundException("Oyuncu bulunamadı.");

            return new { Player1 = player1, Player2 = player2 };
        }
    }
}
