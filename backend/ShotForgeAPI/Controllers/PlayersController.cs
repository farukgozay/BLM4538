// ShotForge API - Players Controller
// Oyuncu listeleme, detay ve karşılaştırma endpoint'leri.

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShotForgeAPI.Services;

namespace ShotForgeAPI.Controllers
{
    /// <summary>
    /// Oyuncu controller'ı.
    /// GET /api/players, GET /api/players/{id}, GET /api/players/compare
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PlayersController : ControllerBase
    {
        private readonly IPlayerService _playerService;

        public PlayersController(IPlayerService playerService)
        {
            _playerService = playerService;
        }

        /// <summary>
        /// Tüm oyuncuları listele
        /// GET /api/players
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var players = await _playerService.GetAllPlayers();
            return Ok(players);
        }

        /// <summary>
        /// Belirli bir oyuncunun detaylarını getir
        /// GET /api/players/{id}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var player = await _playerService.GetPlayerById(id);
            if (player == null)
                return NotFound(new { message = "Oyuncu bulunamadı." });
            return Ok(player);
        }

        /// <summary>
        /// İki oyuncuyu karşılaştır
        /// GET /api/players/compare?id1=1&id2=2
        /// </summary>
        [HttpGet("compare")]
        public async Task<IActionResult> Compare([FromQuery] int id1, [FromQuery] int id2)
        {
            try
            {
                var result = await _playerService.ComparePlayers(id1, id2);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
