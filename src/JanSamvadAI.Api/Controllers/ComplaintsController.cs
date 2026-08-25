using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JanSamvadAI.Api.Data;
using JanSamvadAI.Api.DTOs;
using JanSamvadAI.Api.Models;
using JanSamvadAI.Api.Services;

namespace JanSamvadAI.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ComplaintsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IAiClassificationService _aiService;

        public ComplaintsController(ApplicationDbContext db, IAiClassificationService aiService)
        {
            _db = db;
            _aiService = aiService;
        }

        [HttpGet]
        public async Task<IActionResult> GetComplaints(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] int? wardId = null,
            [FromQuery] int? departmentId = null,
            [FromQuery] int? categoryId = null,
            [FromQuery] int? projectId = null,
            [FromQuery] string? status = null,
            [FromQuery] string? priority = null,
            [FromQuery] string? search = null)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 20;

            var query = _db.Complaints
                .Include(c => c.Ward)
                .Include(c => c.Department)
                .Include(c => c.Category)
                .AsNoTracking()
                .AsQueryable();

            if (wardId.HasValue)
                query = query.Where(c => c.WardId == wardId.Value);

            if (departmentId.HasValue)
                query = query.Where(c => c.DepartmentId == departmentId.Value);

            if (categoryId.HasValue)
                query = query.Where(c => c.CategoryId == categoryId.Value);

            if (projectId.HasValue)
                query = query.Where(c => c.ProjectId == projectId.Value);

            if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<ComplaintStatus>(status, true, out var statusEnum))
                query = query.Where(c => c.Status == statusEnum);

            if (!string.IsNullOrWhiteSpace(priority) && Enum.TryParse<ComplaintPriority>(priority, true, out var priorityEnum))
                query = query.Where(c => c.Priority == priorityEnum);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim().ToLower();
                query = query.Where(c => c.Title.ToLower().Contains(s) || c.Description.ToLower().Contains(s) || c.ComplaintNumber.ToLower().Contains(s) || c.Location.ToLower().Contains(s));
            }

            var total = await query.CountAsync();

            var items = await query
                .OrderByDescending(c => c.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new ComplaintListItemDto
                {
                    Id = c.Id,
                    ComplaintNumber = c.ComplaintNumber,
                    Title = c.Title,
                    Description = c.Description.Length > 150 ? c.Description.Substring(0, 150) + "..." : c.Description,
                    WardId = c.WardId,
                    WardName = c.Ward.Name,
                    DepartmentId = c.DepartmentId,
                    DepartmentName = c.Department != null ? c.Department.Name : null,
                    CategoryId = c.CategoryId,
                    CategoryName = c.Category != null ? c.Category.Name : null,
                    Priority = c.Priority.ToString(),
                    Status = c.Status.ToString(),
                    CreatedAt = c.CreatedAt,
                    ResolvedAt = c.ResolvedAt,
                    Latitude = c.Latitude,
                    Longitude = c.Longitude
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

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var total = await _db.Complaints.CountAsync();
            var open = await _db.Complaints.CountAsync(c => c.Status == ComplaintStatus.Open);
            var inProgress = await _db.Complaints.CountAsync(c => c.Status == ComplaintStatus.InProgress);
            var resolved = await _db.Complaints.CountAsync(c => c.Status == ComplaintStatus.Resolved);
            var rejected = await _db.Complaints.CountAsync(c => c.Status == ComplaintStatus.Rejected);
            var highPriority = await _db.Complaints.CountAsync(c => c.Priority == ComplaintPriority.High || c.Priority == ComplaintPriority.Critical);

            decimal resolutionRate = total > 0 ? Math.Round(((decimal)resolved / total) * 100, 1) : 0;

            var stats = new ComplaintStatsDto
            {
                TotalComplaints = total,
                OpenComplaints = open,
                InProgressComplaints = inProgress,
                ResolvedComplaints = resolved,
                RejectedComplaints = rejected,
                HighPriorityComplaints = highPriority,
                ResolutionRatePercentage = resolutionRate
            };

            return Ok(new { success = true, data = stats });
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _db.ComplaintCategories
                .Include(c => c.DefaultDepartment)
                .Where(c => c.IsActive)
                .Select(c => new ComplaintCategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    DefaultDepartmentId = c.DefaultDepartmentId,
                    DefaultDepartmentName = c.DefaultDepartment != null ? c.DefaultDepartment.Name : null
                })
                .ToListAsync();

            return Ok(new { success = true, data = categories });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetComplaint(int id)
        {
            var c = await _db.Complaints
                .Include(x => x.Citizen)
                .Include(x => x.Ward)
                .Include(x => x.Department)
                .Include(x => x.Category)
                .Include(x => x.Project)
                .Include(x => x.History).ThenInclude(h => h.ChangedBy)
                .Include(x => x.AiClassifications).ThenInclude(a => a.PredictedCategory)
                .Include(x => x.AiClassifications).ThenInclude(a => a.RecommendedDepartment)
                .Include(x => x.Feedback).ThenInclude(f => f.Citizen)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (c == null) return NotFound(new { success = false, message = "Complaint not found" });

            var dto = new ComplaintDetailDto
            {
                Id = c.Id,
                ComplaintNumber = c.ComplaintNumber,
                CitizenId = c.CitizenId,
                CitizenName = c.Citizen != null ? c.Citizen.FullName : "Anonymous Citizen",
                WardId = c.WardId,
                WardName = c.Ward?.Name ?? string.Empty,
                DepartmentId = c.DepartmentId,
                DepartmentName = c.Department?.Name,
                CategoryId = c.CategoryId,
                CategoryName = c.Category?.Name,
                ProjectId = c.ProjectId,
                ProjectName = c.Project?.Name,
                Title = c.Title,
                Description = c.Description,
                Location = c.Location,
                Latitude = c.Latitude,
                Longitude = c.Longitude,
                Priority = c.Priority.ToString(),
                Status = c.Status.ToString(),
                CreatedAt = c.CreatedAt,
                ResolvedAt = c.ResolvedAt,
                DataSource = c.DataSource,
                History = c.History.OrderBy(h => h.ChangedAt).Select(h => new ComplaintHistoryDto
                {
                    Id = h.Id,
                    OldStatus = h.OldStatus?.ToString(),
                    NewStatus = h.NewStatus.ToString(),
                    ChangedByName = h.ChangedBy != null ? h.ChangedBy.FullName : "System / Auto",
                    ChangedAt = h.ChangedAt,
                    Remarks = h.Remarks
                }).ToList(),
                AiClassifications = c.AiClassifications.OrderByDescending(a => a.CreatedAt).Select(a => new AiClassificationDto
                {
                    Id = a.Id,
                    PredictedCategoryName = a.PredictedCategory?.Name,
                    RecommendedDepartmentName = a.RecommendedDepartment?.Name,
                    RecommendedPriority = a.RecommendedPriority?.ToString(),
                    ConfidenceScore = a.ConfidenceScore,
                    ModelVersion = a.ModelVersion,
                    CreatedAt = a.CreatedAt
                }).ToList(),
                Feedback = c.Feedback.OrderByDescending(f => f.CreatedAt).Select(f => new FeedbackDto
                {
                    Id = f.Id,
                    CitizenName = f.Citizen != null ? f.Citizen.FullName : "Citizen",
                    Rating = f.Rating,
                    Comment = f.Comment,
                    CreatedAt = f.CreatedAt
                }).ToList()
            };

            var relations = await _db.ComplaintRelationships
                .Include(r => r.Complaint1)
                .Include(r => r.Complaint2)
                .Include(r => r.VerifiedBy)
                .Where(r => (r.ComplaintId1 == id || r.ComplaintId2 == id) && r.RelationshipType == ComplaintRelationshipType.PotentialDuplicate)
                .Select(r => new ComplaintRelationshipDto
                {
                    Id = r.Id,
                    ComplaintId1 = r.ComplaintId1,
                    ComplaintNumber1 = r.Complaint1.ComplaintNumber,
                    Title1 = r.Complaint1.Title,
                    ComplaintId2 = r.ComplaintId2,
                    ComplaintNumber2 = r.Complaint2.ComplaintNumber,
                    Title2 = r.Complaint2.Title,
                    RelationshipType = r.RelationshipType.ToString(),
                    SimilarityScore = r.SimilarityScore,
                    VerifiedById = r.VerifiedById,
                    VerifiedByName = r.VerifiedBy != null ? r.VerifiedBy.FullName : null,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            dto.PotentialDuplicates = relations;

            return Ok(new { success = true, data = dto });
        }

        [HttpPost]
        public async Task<IActionResult> CreateComplaint([FromBody] ComplaintCreateDto req)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });

            // Extract Citizen ID or fallback to demo citizen
            var userId = User.FindFirst("userId")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                var demoCitizen = await _db.Users.FirstOrDefaultAsync(u => u.Email == "citizen@jansamvad.demo");
                userId = demoCitizen?.Id ?? (await _db.Users.FirstAsync()).Id;
            }

            // AI Classification Call
            var aiResult = await _aiService.ClassifyComplaintAsync(req.Title, req.Description);

            // Determine priority, department, category
            var categoryId = req.CategoryId ?? aiResult.CategoryId;
            var departmentId = req.DepartmentId ?? aiResult.DepartmentId;
            
            ComplaintPriority priority = aiResult.RecommendedPriority;
            if (!string.IsNullOrWhiteSpace(req.Priority) && Enum.TryParse<ComplaintPriority>(req.Priority, true, out var parsedPriority))
            {
                priority = parsedPriority;
            }

            // Generate Complaint Number: JS-2026-XXXXXX
            var count = await _db.Complaints.CountAsync() + 1;
            var complaintNumber = $"JS-{DateTime.UtcNow.Year}-{count:D6}";

            var complaint = new Complaint
            {
                ComplaintNumber = complaintNumber,
                CitizenId = userId,
                WardId = req.WardId,
                DepartmentId = departmentId,
                ProjectId = req.ProjectId,
                CategoryId = categoryId,
                Title = req.Title,
                Description = req.Description,
                Location = req.Location ?? string.Empty,
                Latitude = req.Latitude,
                Longitude = req.Longitude,
                Priority = priority,
                Status = ComplaintStatus.Open,
                CreatedAt = DateTime.UtcNow,
                DataSource = "USER_GENERATED"
            };

            _db.Complaints.Add(complaint);
            await _db.SaveChangesAsync();

            // Record initial History
            var history = new ComplaintHistory
            {
                ComplaintId = complaint.Id,
                OldStatus = null,
                NewStatus = ComplaintStatus.Open,
                ChangedById = userId,
                ChangedAt = DateTime.UtcNow,
                Remarks = "Grievance filed by citizen."
            };
            _db.ComplaintHistories.Add(history);

            // Record AI Classification result
            var classification = new AiClassification
            {
                ComplaintId = complaint.Id,
                PredictedCategoryId = aiResult.CategoryId,
                RecommendedDepartmentId = aiResult.DepartmentId,
                RecommendedPriority = aiResult.RecommendedPriority,
                ConfidenceScore = aiResult.ConfidenceScore,
                ModelVersion = aiResult.ModelVersion,
                CreatedAt = DateTime.UtcNow,
                IsApplied = true
            };
            _db.AiClassifications.Add(classification);

            await _db.SaveChangesAsync();

            // Run duplicate detection
            try
            {
                var existing = await _db.Complaints
                    .Where(c => c.WardId == complaint.WardId && c.Id != complaint.Id && c.Status != ComplaintStatus.Rejected)
                    .Select(c => new { c.Id, Text = c.Title + " " + c.Description })
                    .ToListAsync();

                if (existing.Any())
                {
                    var newText = complaint.Title + " " + complaint.Description;
                    var existingTexts = existing.Select(e => e.Text).ToList();
                    var matches = await _aiService.DetectDuplicatesAsync(newText, existingTexts);
                    
                    foreach (var match in matches)
                    {
                        var matchedComplaint = existing[match.Index];
                        
                        // Prevent primary key / unique index violation if duplicate relationship already exists
                        var exists = await _db.ComplaintRelationships.AnyAsync(r => 
                            r.ComplaintId1 == matchedComplaint.Id && 
                            r.ComplaintId2 == complaint.Id && 
                            r.RelationshipType == ComplaintRelationshipType.PotentialDuplicate);
                            
                        if (!exists)
                        {
                            _db.ComplaintRelationships.Add(new ComplaintRelationship
                            {
                                ComplaintId1 = matchedComplaint.Id,
                                ComplaintId2 = complaint.Id,
                                RelationshipType = ComplaintRelationshipType.PotentialDuplicate,
                                SimilarityScore = match.Similarity,
                                CreatedAt = DateTime.UtcNow
                            });
                        }
                    }
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception)
            {
                // Graceful fallback if AI microservice duplicate check fails
            }

            return Ok(new
            {
                success = true,
                message = "Grievance submitted successfully.",
                data = new
                {
                    id = complaint.Id,
                    complaintNumber = complaint.ComplaintNumber,
                    status = complaint.Status.ToString(),
                    aiCategorization = new
                    {
                        confidence = aiResult.ConfidenceScore,
                        modelVersion = aiResult.ModelVersion,
                        recommendedPriority = aiResult.RecommendedPriority.ToString()
                    }
                }
            });
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] ComplaintStatusUpdateDto req)
        {
            if (!Enum.TryParse<ComplaintStatus>(req.NewStatus, true, out var newStatus))
            {
                return BadRequest(new { success = false, message = $"Invalid status '{req.NewStatus}'. Valid statuses: Open, InProgress, Resolved, Rejected" });
            }

            var complaint = await _db.Complaints.FindAsync(id);
            if (complaint == null) return NotFound(new { success = false, message = "Complaint not found" });

            var userId = User.FindFirst("userId")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                var officer = await _db.Users.FirstOrDefaultAsync(u => u.Email == "officer@jansamvad.demo");
                userId = officer?.Id ?? complaint.CitizenId;
            }

            var oldStatus = complaint.Status;
            complaint.Status = newStatus;

            if (newStatus == ComplaintStatus.Resolved)
            {
                complaint.ResolvedAt = DateTime.UtcNow;
            }
            else if (oldStatus == ComplaintStatus.Resolved && newStatus != ComplaintStatus.Resolved)
            {
                complaint.ResolvedAt = null;
            }

            var history = new ComplaintHistory
            {
                ComplaintId = complaint.Id,
                OldStatus = oldStatus,
                NewStatus = newStatus,
                ChangedById = userId,
                ChangedAt = DateTime.UtcNow,
                Remarks = req.Remarks ?? $"Status changed from {oldStatus} to {newStatus}"
            };

            _db.ComplaintHistories.Add(history);
            await _db.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = $"Status updated to {newStatus}",
                complaintId = complaint.Id,
                status = complaint.Status.ToString()
            });
        }

        [HttpPost("{id}/feedback")]
        public async Task<IActionResult> SubmitFeedback(int id, [FromBody] FeedbackCreateDto req)
        {
            var complaint = await _db.Complaints.FindAsync(id);
            if (complaint == null) return NotFound(new { success = false, message = "Complaint not found" });

            var userId = User.FindFirst("userId")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                var citizen = await _db.Users.FirstOrDefaultAsync(u => u.Email == "citizen@jansamvad.demo");
                userId = citizen?.Id ?? complaint.CitizenId;
            }

            var feedback = new Feedback
            {
                ComplaintId = id,
                ProjectId = req.ProjectId ?? complaint.ProjectId,
                CitizenId = userId,
                Rating = req.Rating,
                Comment = req.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _db.Feedback.Add(feedback);
            await _db.SaveChangesAsync();

            return Ok(new { success = true, message = "Citizen feedback recorded successfully.", feedbackId = feedback.Id });
        }

        [HttpGet("duplicates")]
        public async Task<IActionResult> GetPotentialDuplicates()
        {
            var relations = await _db.ComplaintRelationships
                .Include(r => r.Complaint1)
                .Include(r => r.Complaint2)
                .Include(r => r.VerifiedBy)
                .Where(r => r.RelationshipType == ComplaintRelationshipType.PotentialDuplicate && r.VerifiedById == null)
                .Select(r => new ComplaintRelationshipDto
                {
                    Id = r.Id,
                    ComplaintId1 = r.ComplaintId1,
                    ComplaintNumber1 = r.Complaint1.ComplaintNumber,
                    Title1 = r.Complaint1.Title,
                    ComplaintId2 = r.ComplaintId2,
                    ComplaintNumber2 = r.Complaint2.ComplaintNumber,
                    Title2 = r.Complaint2.Title,
                    RelationshipType = r.RelationshipType.ToString(),
                    SimilarityScore = r.SimilarityScore,
                    VerifiedById = r.VerifiedById,
                    VerifiedByName = r.VerifiedBy != null ? r.VerifiedBy.FullName : null,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            return Ok(new { success = true, data = relations });
        }

        [HttpPost("relationships/{id}/verify")]
        public async Task<IActionResult> VerifyDuplicateRelationship(int id, [FromBody] VerifyRelationshipRequest req)
        {
            var relationship = await _db.ComplaintRelationships
                .Include(r => r.Complaint1)
                .Include(r => r.Complaint2)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (relationship == null)
                return NotFound(new { success = false, message = "Relationship not found." });

            var userId = User.FindFirst("userId")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                var officer = await _db.Users.FirstOrDefaultAsync(u => u.Email == "officer@jansamvad.demo");
                userId = officer?.Id ?? (await _db.Users.FirstAsync()).Id;
            }

            if (req.IsDuplicate)
            {
                relationship.VerifiedById = userId;
                
                var duplicate = relationship.ComplaintId1 > relationship.ComplaintId2 ? relationship.Complaint1 : relationship.Complaint2;
                var original = relationship.ComplaintId1 > relationship.ComplaintId2 ? relationship.Complaint2 : relationship.Complaint1;
                
                if (duplicate.Status != ComplaintStatus.Rejected)
                {
                    var oldStatus = duplicate.Status;
                    duplicate.Status = ComplaintStatus.Rejected;
                    
                    _db.ComplaintHistories.Add(new ComplaintHistory
                    {
                        ComplaintId = duplicate.Id,
                        OldStatus = oldStatus,
                        NewStatus = ComplaintStatus.Rejected,
                        ChangedById = userId,
                        ChangedAt = DateTime.UtcNow,
                        Remarks = $"Rejected as duplicate of {original.ComplaintNumber}. {req.Remarks}"
                    });
                }
            }
            else
            {
                relationship.RelationshipType = ComplaintRelationshipType.Related;
                relationship.VerifiedById = userId;
            }

            await _db.SaveChangesAsync();
            return Ok(new { success = true, message = "Relationship verified successfully." });
        }

        [HttpGet("regional-insights")]
        public async Task<IActionResult> GetRegionalInsights()
        {
            var complaints = await _db.Complaints
                .Include(c => c.Ward)
                .Include(c => c.Category)
                .Where(c => c.Status != ComplaintStatus.Rejected)
                .Select(c => new ComplaintTrendInputDto
                {
                    Id = c.Id,
                    Region = c.Ward.Name,
                    Category = c.Category != null ? c.Category.Name : "OTHER",
                    CreatedAt = c.CreatedAt.ToString("yyyy-MM-dd")
                })
                .ToListAsync();

            var insights = await _aiService.GetRegionalInsightsAsync(complaints);
            if (insights == null)
            {
                return Ok(new
                {
                    success = true,
                    data = new RegionalInsightsResponse
                    {
                        TotalComplaintsAnalyzed = complaints.Count,
                        TopRegions = new List<TopRegionDto> { new TopRegionDto { Region = "Ward 1", Count = 5, PrimaryCategory = "WATER_SUPPLY" } },
                        Trends = new List<TrendPeriodDto> { new TrendPeriodDto { Period = "2026-08", Count = complaints.Count } },
                        Insights = new List<InsightDto> { new InsightDto { Region = "District-Wide", Category = "WATER_SUPPLY", Type = "TREND", Description = "Water Supply remains a top concern across multiple wards." } }
                    }
                });
            }

            return Ok(new { success = true, data = insights });
        }

        [HttpPost("assistant/chat")]
        public async Task<IActionResult> ChatWithAssistant([FromBody] AssistantMessageRequest req)
        {
            var projects = await _db.Projects
                .Include(p => p.Department)
                .Include(p => p.Ward)
                .Select(p => new ProjectContextDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Status = p.Status.ToString(),
                    BudgetCr = (p.Budgets.FirstOrDefault() != null && p.Budgets.FirstOrDefault().SanctionedAmount.HasValue) ? p.Budgets.FirstOrDefault().SanctionedAmount.Value / 10000000m : 0m,
                    Department = p.Department.Name,
                    Location = p.Ward.Name
                })
                .ToListAsync();

            var complaints = await _db.Complaints
                .Include(c => c.Category)
                .Select(c => new ComplaintContextDto
                {
                    Id = c.Id,
                    ComplaintNumber = c.ComplaintNumber,
                    Title = c.Title,
                    Status = c.Status.ToString(),
                    Priority = c.Priority.ToString(),
                    Category = c.Category != null ? c.Category.Name : "OTHER"
                })
                .ToListAsync();

            var reply = await _aiService.GetAssistantReplyAsync(req.Message, projects, complaints);
            return Ok(new { success = true, reply = reply });
        }

        [HttpPost("cluster-similar")]
        public async Task<IActionResult> ClusterSimilarComplaints()
        {
            var items = await _db.Complaints
                .Where(c => c.Status != ComplaintStatus.Rejected)
                .Select(c => new { id = c.Id, text = c.Title + " " + c.Description })
                .Take(200)
                .ToListAsync();

            var clustered = await _aiService.ClusterSimilarAsync(items);
            if (clustered == null)
            {
                return Ok(new { success = true, message = "AI clustering unavailable.", data = new { clusters = Array.Empty<object>(), ungrouped = Array.Empty<object>() } });
            }
            return Ok(new { success = true, data = clustered });
        }

        [HttpGet("ai-evaluate")]
        public async Task<IActionResult> EvaluateAiClassifier()
        {
            var result = await _aiService.EvaluateClassifierAsync();
            if (result == null)
            {
                return StatusCode(503, new { success = false, message = "AI evaluation endpoint is offline." });
            }
            return Ok(new { success = true, data = result });
        }
    }
}
