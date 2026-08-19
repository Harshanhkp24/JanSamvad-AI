using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JanSamvadAI.Api.Data;

namespace JanSamvadAI.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public DepartmentsController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetDepartments()
        {
            var depts = await _db.Departments
                .Where(d => d.IsActive)
                .OrderBy(d => d.Name)
                .Select(d => new
                {
                    d.Id,
                    d.Name,
                    d.Code,
                    d.Responsibility,
                    ProjectCount = d.Projects.Count,
                    ComplaintCount = d.Complaints.Count,
                    TotalBudget = d.Projects.SelectMany(p => p.Budgets).Sum(b => b.SanctionedAmount ?? b.EstimatedCost ?? 0)
                })
                .ToListAsync();

            return Ok(new { success = true, data = depts });
        }
    }
}
