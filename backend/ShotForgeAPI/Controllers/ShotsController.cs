using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShotForgeAPI.Data;
using ShotForgeAPI.Models;

namespace ShotForgeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShotsController : ControllerBase
    {
        private readonly ShotForgeContext _context;

        public ShotsController(ShotForgeContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Shot>>> GetShots()
        {
            return await _context.Shots.ToListAsync();
        }
    }
}
