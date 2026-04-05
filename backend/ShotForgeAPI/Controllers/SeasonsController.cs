using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShotForgeAPI.Data;
using ShotForgeAPI.Models;

namespace ShotForgeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeasonsController : ControllerBase
    {
        private readonly ShotForgeContext _context;

        public SeasonsController(ShotForgeContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Season>>> GetSeasons()
        {
            return await _context.Seasons.ToListAsync();
        }
    }
}
