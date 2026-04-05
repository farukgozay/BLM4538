using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShotForgeAPI.Data;
using ShotForgeAPI.Models;

namespace ShotForgeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArenasController : ControllerBase
    {
        private readonly ShotForgeContext _context;

        public ArenasController(ShotForgeContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Arena>>> GetArenas()
        {
            return await _context.Arenas.ToListAsync();
        }
    }
}
