using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JanSamvadAI.Api.Data;
using JanSamvadAI.Api.DTOs;
using JanSamvadAI.Api.Models;

namespace JanSamvadAI.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public ProjectsController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetProjects(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 20, 
            [FromQuery] int? wardId = null, 
            [FromQuery] int? departmentId = null,
            [FromQuery] string? status = null,
            [FromQuery] string? search = null)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 20;

            var query = _db.Projects.Include(p => p.Department).Include(p => p.Ward).AsNoTracking().AsQueryable();

            if (wardId.HasValue)
                query = query.Where(p => p.WardId == wardId.Value);

            if (departmentId.HasValue)
                query = query.Where(p => p.DepartmentId == departmentId.Value);

            if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<ProjectStatus>(status, true, out var statusEnum))
                query = query.Where(p => p.Status == statusEnum);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim().ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(s) || p.Description.ToLower().Contains(s) || p.Location.ToLower().Contains(s));
            }

            var total = await query.CountAsync();

            var items = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProjectListItemDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Status = p.Status.ToString(),
                    ProgressPercentage = p.ProgressPercentage,
                    WardId = p.WardId,
                    DepartmentId = p.DepartmentId,
                    DepartmentName = p.Department != null ? p.Department.Name : string.Empty,
                    DataSource = p.DataSource
                })
                .ToListAsync();

            var result = new
            {
                items,
                page,
                pageSize,
                totalItems = total,
                totalPages = (int)Math.Ceiling(total / (double)pageSize)
            };

            return Ok(new { success = true, data = result });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProject(int id)
        {
            var p = await _db.Projects
                .Include(x => x.Department)
                .Include(x => x.Ward)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (p == null) return NotFound(new { success = false, message = "Project not found" });

            var dto = new ProjectDetailDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Status = p.Status.ToString(),
                ProgressPercentage = p.ProgressPercentage,
                WardId = p.WardId,
                DepartmentId = p.DepartmentId,
                DepartmentName = p.Department?.Name ?? string.Empty,
                CreatedAt = p.CreatedAt,
                DataSource = p.DataSource
            };

            return Ok(new { success = true, data = dto });
        }

        [HttpGet("{id}/financial-summary")]
        public async Task<IActionResult> GetFinancialSummary(int id)
        {
            var p = await _db.Projects
                .Include(x => x.Budgets)
                .Include(x => x.FinancialTransactions)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (p == null) return NotFound(new { success = false, message = "Project not found" });

            var latestBudget = p.Budgets.OrderByDescending(b => b.BudgetDate).FirstOrDefault();
            var totalDisbursed = p.FinancialTransactions.Sum(t => t.Amount);

            var estimated = latestBudget?.EstimatedCost ?? 0;
            var sanctioned = latestBudget?.SanctionedAmount ?? 0;
            var tender = latestBudget?.TenderAmount ?? 0;
            var contract = latestBudget?.ContractAmount ?? 0;

            var baseAmount = sanctioned > 0 ? sanctioned : estimated;
            var remaining = Math.Max(0, baseAmount - totalDisbursed);
            var utilization = baseAmount > 0 ? Math.Round((totalDisbursed / baseAmount) * 100, 2) : 0;

            var summary = new ProjectFinancialSummaryDto
            {
                ProjectId = p.Id,
                ProjectName = p.Name,
                EstimatedCost = estimated,
                SanctionedAmount = sanctioned,
                TenderAmount = tender,
                ContractAmount = contract,
                TotalDisbursedAmount = totalDisbursed,
                RemainingAmount = remaining,
                UtilizationPercentage = utilization,
                BudgetDate = latestBudget?.BudgetDate,
                TransactionCount = p.FinancialTransactions.Count
            };

            return Ok(new { success = true, data = summary });
        }

        [HttpGet("{id}/contractors")]
        public async Task<IActionResult> GetProjectContractors(int id)
        {
            var exists = await _db.Projects.AnyAsync(p => p.Id == id);
            if (!exists) return NotFound(new { success = false, message = "Project not found" });

            var contractors = await _db.ProjectContractors
                .Where(pc => pc.ProjectId == id)
                .Include(pc => pc.Contractor)
                .Select(pc => new ProjectContractorDto
                {
                    ContractorId = pc.ContractorId,
                    CompanyName = pc.Contractor.CompanyName,
                    RegistrationNumber = pc.Contractor.RegistrationNumber,
                    ContractorRole = pc.ContractorRole,
                    AssignedDate = pc.AssignedDate,
                    ContactInformation = pc.Contractor.ContactInformation,
                    Address = pc.Contractor.Address
                })
                .ToListAsync();

            return Ok(new { success = true, data = contractors });
        }

        [HttpGet("{id}/milestones")]
        public async Task<IActionResult> GetProjectMilestones(int id)
        {
            var exists = await _db.Projects.AnyAsync(p => p.Id == id);
            if (!exists) return NotFound(new { success = false, message = "Project not found" });

            var milestones = await _db.ProjectMilestones
                .Where(m => m.ProjectId == id)
                .OrderBy(m => m.PlannedDate)
                .Select(m => new ProjectMilestoneDto
                {
                    Id = m.Id,
                    ProjectId = m.ProjectId,
                    Name = m.Name,
                    PlannedDate = m.PlannedDate,
                    ActualDate = m.ActualDate,
                    CompletionPercentage = m.CompletionPercentage,
                    Status = m.Status.ToString(),
                    Remarks = m.Remarks
                })
                .ToListAsync();

            return Ok(new { success = true, data = milestones });
        }

        [HttpGet("{id}/transactions")]
        public async Task<IActionResult> GetProjectTransactions(int id)
        {
            var exists = await _db.Projects.AnyAsync(p => p.Id == id);
            if (!exists) return NotFound(new { success = false, message = "Project not found" });

            var transactions = await _db.FinancialTransactions
                .Where(t => t.ProjectId == id)
                .OrderByDescending(t => t.TransactionDate)
                .Select(t => new FinancialTransactionDto
                {
                    Id = t.Id,
                    ProjectId = t.ProjectId,
                    TransactionDate = t.TransactionDate,
                    TransactionType = t.TransactionType.ToString(),
                    Amount = t.Amount,
                    ReferenceNumber = t.ReferenceNumber,
                    Description = t.Description,
                    DataSource = t.DataSource
                })
                .ToListAsync();

            return Ok(new { success = true, data = transactions });
        }

        [HttpGet("{id}/delays")]
        public async Task<IActionResult> GetProjectDelays(int id)
        {
            var exists = await _db.Projects.AnyAsync(p => p.Id == id);
            if (!exists) return NotFound(new { success = false, message = "Project not found" });

            var delays = await _db.DelayRecords
                .Where(d => d.ProjectId == id)
                .Include(d => d.ReportedBy)
                .OrderByDescending(d => d.StartDate)
                .Select(d => new DelayRecordDto
                {
                    Id = d.Id,
                    ProjectId = d.ProjectId,
                    Reason = d.Reason,
                    StartDate = d.StartDate,
                    EndDate = d.EndDate,
                    DelayDays = d.DelayDays,
                    Description = d.Description,
                    ReportedByName = d.ReportedBy != null ? d.ReportedBy.FullName : "System"
                })
                .ToListAsync();

            return Ok(new { success = true, data = delays });
        }

        [HttpGet("{id}/updates")]
        public async Task<IActionResult> GetProjectUpdates(int id)
        {
            var exists = await _db.Projects.AnyAsync(p => p.Id == id);
            if (!exists) return NotFound(new { success = false, message = "Project not found" });

            var updates = await _db.ProjectUpdates
                .Where(u => u.ProjectId == id)
                .Include(u => u.Author)
                .OrderByDescending(u => u.UpdateDate)
                .Select(u => new ProjectUpdateDto
                {
                    Id = u.Id,
                    ProjectId = u.ProjectId,
                    AuthorId = u.AuthorId ?? string.Empty,
                    AuthorName = u.Author != null ? u.Author.FullName : "Official Representative",
                    UpdateDate = u.UpdateDate,
                    Description = u.Description,
                    ProgressPercentage = u.ProgressPercentage,
                    Location = u.Location,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();

            return Ok(new { success = true, data = updates });
        }

        [Authorize]
        [HttpPost("{id}/updates")]
        public async Task<IActionResult> CreateProjectUpdate(int id, [FromBody] CreateProjectUpdateDto req)
        {
            var project = await _db.Projects.FindAsync(id);
            if (project == null) return NotFound(new { success = false, message = "Project not found" });

            var userId = User.FindFirst("userId")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized(new { success = false });

            var update = new ProjectUpdate
            {
                ProjectId = id,
                AuthorId = userId,
                UpdateDate = DateTime.UtcNow,
                Description = req.Description,
                ProgressPercentage = req.ProgressPercentage ?? project.ProgressPercentage,
                Location = req.Location ?? project.Location,
                CreatedAt = DateTime.UtcNow,
                DataSource = "USER_GENERATED"
            };

            if (req.ProgressPercentage.HasValue)
            {
                project.ProgressPercentage = Math.Clamp(req.ProgressPercentage.Value, 0, 100);
                if (project.ProgressPercentage >= 100) project.Status = ProjectStatus.Completed;
            }

            _db.ProjectUpdates.Add(update);
            await _db.SaveChangesAsync();

            return Ok(new { success = true, message = "Project update posted successfully.", updateId = update.Id });
        }
    }
}
