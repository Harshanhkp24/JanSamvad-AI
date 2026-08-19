using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JanSamvadAI.Api.Data;
using JanSamvadAI.Api.DTOs;

namespace JanSamvadAI.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegionsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public RegionsController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("districts")]
        public async Task<IActionResult> GetDistricts()
        {
            var districts = await _db.Districts
                .OrderBy(d => d.Name)
                .Select(d => new DistrictDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    Code = d.Code,
                    State = d.State,
                    Description = d.Description,
                    DataSource = d.DataSource
                })
                .ToListAsync();

            return Ok(new { success = true, data = districts });
        }

        [HttpGet("districts/{id}")]
        public async Task<IActionResult> GetDistrict(int id)
        {
            var d = await _db.Districts.FindAsync(id);
            if (d == null) return NotFound(new { success = false });

            var dto = new DistrictDto { Id = d.Id, Name = d.Name, Code = d.Code, State = d.State, Description = d.Description, DataSource = d.DataSource };
            return Ok(new { success = true, data = dto });
        }

        [HttpGet("districts/{id}/constituencies")]
        public async Task<IActionResult> GetConstituencies(int id)
        {
            var exists = await _db.Districts.AnyAsync(x => x.Id == id);
            if (!exists) return NotFound(new { success = false });

            var list = await _db.Constituencies
                .Where(c => c.DistrictId == id)
                .OrderBy(c => c.Name)
                .Select(c => new ConstituencyDto { Id = c.Id, DistrictId = c.DistrictId, Name = c.Name, Code = c.Code, Description = c.Description, DataSource = c.DataSource })
                .ToListAsync();

            return Ok(new { success = true, data = list });
        }

        [HttpGet("constituencies/{id}/wards")]
        public async Task<IActionResult> GetWardsByConstituency(int id)
        {
            var exists = await _db.Constituencies.AnyAsync(x => x.Id == id);
            if (!exists) return NotFound(new { success = false });

            var list = await _db.Wards
                .Where(w => w.ConstituencyId == id)
                .OrderBy(w => w.Name)
                .Select(w => new WardDto { Id = w.Id, ConstituencyId = w.ConstituencyId, Name = w.Name, Code = w.Code, Locality = w.Locality, Latitude = w.Latitude, Longitude = w.Longitude, DataSource = w.DataSource })
                .ToListAsync();

            return Ok(new { success = true, data = list });
        }

        [HttpGet("wards/{id}")]
        public async Task<IActionResult> GetWard(int id)
        {
            var w = await _db.Wards.FindAsync(id);
            if (w == null) return NotFound(new { success = false });

            var dto = new WardDto { Id = w.Id, ConstituencyId = w.ConstituencyId, Name = w.Name, Code = w.Code, Locality = w.Locality, Latitude = w.Latitude, Longitude = w.Longitude, DataSource = w.DataSource };
            return Ok(new { success = true, data = dto });
        }

        [HttpGet("wards/{id}/projects")]
        public async Task<IActionResult> GetWardProjects(int id)
        {
            var exists = await _db.Wards.AnyAsync(x => x.Id == id);
            if (!exists) return NotFound(new { success = false });

            // Projects not yet implemented. Return empty array for now.
            return Ok(new { success = true, data = new object[0] });
        }
    }
}
