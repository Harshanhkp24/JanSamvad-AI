using Microsoft.AspNetCore.Mvc;
using JanSamvadAI.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using JanSamvadAI.Api.Models;

namespace JanSamvadAI.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DebugController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;

        public DebugController(ApplicationDbContext db, UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        [HttpGet("seed-status")]
        public async Task<IActionResult> SeedStatus()
        {
            var users = await _db.Users.CountAsync();
            var projects = await _db.Projects.CountAsync();
            var complaints = await _db.Complaints.CountAsync();
            var districts = await _db.Districts.CountAsync();

            var admin = await _userManager.FindByEmailAsync("admin@jansamvad.demo");

            return Ok(new
            {
                success = true,
                data = new
                {
                    users,
                    projects,
                    complaints,
                    districts,
                    adminExists = admin != null
                }
            });
        }
    }
}
