using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using JanSamvadAI.Api.Data;
using JanSamvadAI.Api.Models;

namespace JanSamvadAI.Api.Seed
{
    public class SeedDataService
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        // Targets
        private const int TARGET_CONTRACTORS = 20;
        private const int TARGET_PROJECTS = 50;
        private const int TARGET_CITIZENS = 1000;
        private const int TARGET_COMPLAINTS = 3000;
        private const int TARGET_FEEDBACK = 200;

        public SeedDataService(ApplicationDbContext db, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _db = db;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task SeedAsync()
        {
            // Roles
            var roles = new[] { "CITIZEN", "REPRESENTATIVE", "OPPOSITION_REPRESENTATIVE", "DEPARTMENT_OFFICER", "ADMIN" };
            foreach (var r in roles)
            {
                if (!await _roleManager.RoleExistsAsync(r)) await _roleManager.CreateAsync(new IdentityRole(r));
            }

            // Demo accounts
            await EnsureUserAsync("admin@jansamvad.demo", "Admin User", new[] { "ADMIN" });
            await EnsureUserAsync("representative@jansamvad.demo", "Demo Representative", new[] { "REPRESENTATIVE" }, isVerified: true);
            await EnsureUserAsync("opposition@jansamvad.demo", "Demo Opposition", new[] { "OPPOSITION_REPRESENTATIVE" }, isVerified: true);
            await EnsureUserAsync("officer@jansamvad.demo", "Demo Officer", new[] { "DEPARTMENT_OFFICER" });
            await EnsureUserAsync("citizen@jansamvad.demo", "Demo Citizen", new[] { "CITIZEN" });

            var repUser = await _userManager.FindByEmailAsync("representative@jansamvad.demo");
            var officerUser = await _userManager.FindByEmailAsync("officer@jansamvad.demo");
            var adminUser = await _userManager.FindByEmailAsync("admin@jansamvad.demo");

            string defaultAuthorId = repUser?.Id ?? adminUser?.Id ?? (await _userManager.Users.FirstAsync()).Id;
            string defaultOfficerId = officerUser?.Id ?? adminUser?.Id ?? defaultAuthorId;

            // Regions: district/constituencies/wards
            if (!await _db.Districts.AnyAsync())
            {
                var d = new District { Name = "Demo District", Code = "JS-D-001", State = "Demo State", Description = "Synthetic prototype district", DataSource = "SYNTHETIC", CreatedAt = DateTime.UtcNow };
                _db.Districts.Add(d);
                await _db.SaveChangesAsync();

                for (int c = 1; c <= 3; c++)
                {
                    var cons = new Constituency { DistrictId = d.Id, Name = $"Constituency {c}", Code = $"JS-C-00{c}", Description = "Synthetic", DataSource = "SYNTHETIC" };
                    _db.Constituencies.Add(cons);
                    await _db.SaveChangesAsync();
                    for (int w = 1; w <= 3; w++)
                    {
                        _db.Wards.Add(new Ward { ConstituencyId = cons.Id, Name = $"Ward {((c - 1) * 3) + w}", Code = $"JS-W-{c}-{w}", Locality = $"Locality {c}-{w}", Latitude = 28.0 + c * 0.01 + w * 0.001, Longitude = 77.0 + c * 0.01 + w * 0.001, DataSource = "SYNTHETIC" });
                    }
                    await _db.SaveChangesAsync();
                }
            }

            // Departments and categories
            if (!await _db.Departments.AnyAsync())
            {
                var deptNames = new[] { "Roads & Infrastructure", "Water Supply", "Electricity", "Sanitation", "Drainage", "Education", "Healthcare", "Public Works" };
                int i = 1;
                foreach (var name in deptNames)
                {
                    _db.Departments.Add(new Department { Name = name, Code = $"DPT-{i:00}", Responsibility = $"Synthetic prototype {name} department", DataSource = "SYNTHETIC", IsActive = true });
                    i++;
                }
                await _db.SaveChangesAsync();
            }

            if (!await _db.ComplaintCategories.AnyAsync())
            {
                var deptMap = await _db.Departments.ToListAsync();
                var cats = new[] { "ROAD_DAMAGE", "WATER_SUPPLY", "ELECTRICITY", "SANITATION", "DRAINAGE", "EDUCATION", "HEALTHCARE", "STREET_LIGHT", "WASTE_MANAGEMENT", "OTHER" };
                var rnd = new Random(123);
                foreach (var c in cats)
                {
                    var dep = deptMap[rnd.Next(deptMap.Count)];
                    _db.ComplaintCategories.Add(new ComplaintCategory { Name = c, Description = c + " issues", DefaultDepartmentId = dep.Id, IsActive = true });
                }
                await _db.SaveChangesAsync();
            }

            // Contractors
            var contractors = await _db.Contractors.ToListAsync();
            var rand = new Random(2024);
            for (int k = contractors.Count + 1; k <= TARGET_CONTRACTORS; k++)
            {
                _db.Contractors.Add(new Contractor { CompanyName = $"Demo Contractor {k}", RegistrationNumber = $"REG-{1000 + k}", Address = $"Address {k}", ContactInformation = $"+91-90000{1000 + k}", DataSource = "SYNTHETIC" });
            }
            await _db.SaveChangesAsync();

            // Citizens
            var citizens = await _userManager.GetUsersInRoleAsync("CITIZEN");
            int existingCitizens = citizens.Count;
            for (int idx = existingCitizens + 1; idx <= TARGET_CITIZENS; idx++)
            {
                var email = $"citizen{idx}@jansamvad.demo";
                if (await _userManager.FindByEmailAsync(email) != null) continue;
                var user = new ApplicationUser { UserName = email, Email = email, FullName = $"Citizen {idx}", EmailConfirmed = true, DataSource = "SYNTHETIC", CreatedAt = DateTime.UtcNow };
                var res = await _userManager.CreateAsync(user, "P@ssword1!");
                if (res.Succeeded) await _userManager.AddToRoleAsync(user, "CITIZEN");
            }

            // Projects
            var wards = await _db.Wards.ToListAsync();
            var depts = await _db.Departments.ToListAsync();
            var contractorsAll = await _db.Contractors.ToListAsync();
            int existingProjects = await _db.Projects.CountAsync();
            for (int p = existingProjects + 1; p <= TARGET_PROJECTS; p++)
            {
                var ward = wards[rand.Next(wards.Count)];
                var dept = depts[rand.Next(depts.Count)];
                var status = (p % 7 == 0) ? ProjectStatus.Completed : ((p % 5 == 0) ? ProjectStatus.OnHold : ProjectStatus.InProgress);
                var prog = (decimal)rand.Next(0, 100);
                var proj = new Project
                {
                    WardId = ward.Id,
                    DepartmentId = dept.Id,
                    Name = $"JS-P-{p:000}",
                    Description = "Synthetic prototype project",
                    ProjectType = "Infrastructure",
                    Location = ward.Locality,
                    Status = status,
                    ProgressPercentage = prog,
                    PlannedStartDate = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-rand.Next(1, 24))),
                    PlannedCompletionDate = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(rand.Next(1, 24))),
                    ActualStartDate = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-rand.Next(1, 20))),
                    DataSource = "SYNTHETIC",
                    CreatedAt = DateTime.UtcNow
                };
                _db.Projects.Add(proj);
                await _db.SaveChangesAsync();

                // Budget
                var est = (decimal)rand.Next(500000, 50000000);
                var sanctioned = est - (decimal)rand.Next((int)(est * 0.0m), (int)(est * 0.2m));
                _db.ProjectBudgets.Add(new ProjectBudget { ProjectId = proj.Id, EstimatedCost = est, SanctionedAmount = sanctioned, TenderAmount = sanctioned - (decimal)rand.Next(0, (int)(sanctioned * 0.05m)), ContractAmount = sanctioned - (decimal)rand.Next(0, (int)(sanctioned * 0.05m)), BudgetDate = DateOnly.FromDateTime(DateTime.UtcNow), DataSource = "SYNTHETIC" });

                // Milestones (5)
                var milestoneNames = new[] { "Site Preparation", "Foundation", "Main Construction", "Final Work", "Completion" };
                foreach (var m in milestoneNames)
                {
                    _db.ProjectMilestones.Add(new ProjectMilestone { ProjectId = proj.Id, Name = m, PlannedDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(rand.Next(-200, 200))), CompletionPercentage = (decimal)rand.Next(0, 100), Status = MilestoneStatus.Pending, Remarks = "Synthetic" });
                }

                // Transactions (~3-6)
                var txCount = rand.Next(3, 6);
                decimal total = 0;
                var sanctionedAmount = sanctioned;
                for (int t = 0; t < txCount; t++)
                {
                    var min = (int)(sanctionedAmount * 0.05m);
                    var max = (int)(sanctionedAmount * 0.3m);
                    if (min >= max) max = min + 1;
                    var amount = (decimal)rand.Next(min, max);
                    if (total + amount > sanctionedAmount)
                    {
                        amount = sanctionedAmount - total;
                        if (amount <= 0) break;
                    }
                    total += amount;
                    _db.FinancialTransactions.Add(new FinancialTransaction { ProjectId = proj.Id, TransactionDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-rand.Next(0, 365))), TransactionType = FinancialTransactionType.ProgressPayment, Amount = amount, ReferenceNumber = $"TX-{proj.Id}-{t}", Description = "Synthetic transaction", DataSource = "SYNTHETIC" });
                }

                // Updates (~2-6)
                var updatesCount = rand.Next(2, 6);
                for (int u = 0; u < updatesCount; u++)
                {
                    _db.ProjectUpdates.Add(new ProjectUpdate { ProjectId = proj.Id, AuthorId = defaultAuthorId, UpdateDate = DateTime.UtcNow.AddDays(-rand.Next(0, 365)), Description = "Progress update", ProgressPercentage = (decimal?)rand.Next(0, 100), Location = ward.Locality, DataSource = "SYNTHETIC", CreatedAt = DateTime.UtcNow });
                }

                await _db.SaveChangesAsync();
            }

            // Complaints
            var totalComplaints = await _db.Complaints.CountAsync();
            var citizensList = await _db.Users.Where(u => u.Email.EndsWith("@jansamvad.demo")).ToListAsync();
            var categories = await _db.ComplaintCategories.ToListAsync();
            var projectsList = await _db.Projects.ToListAsync();
            var wardsList = await _db.Wards.ToListAsync();
            int counter = totalComplaints + 1;
            while (await _db.Complaints.CountAsync() < TARGET_COMPLAINTS)
            {
                var citizen = citizensList[rand.Next(citizensList.Count)];
                var ward = wardsList[rand.Next(wardsList.Count)];
                var cat = categories[rand.Next(categories.Count)];
                var related = projectsList.Count > 0 && rand.NextDouble() < 0.3 ? projectsList[rand.Next(projectsList.Count)] : null;
                var priority = (ComplaintPriority)rand.Next(0, 4);
                var created = DateTime.UtcNow.AddDays(-rand.Next(0, 365));

                var comp = new Complaint { ComplaintNumber = $"JS-2026-{counter:000000}", CitizenId = citizen.Id, WardId = ward.Id, DepartmentId = cat.DefaultDepartmentId, ProjectId = related?.Id, CategoryId = cat.Id, Title = $"Sample complaint {counter}", Description = "Synthetic complaint for demo", Priority = priority, Status = ComplaintStatus.Open, Latitude = (decimal?)ward.Latitude, Longitude = (decimal?)ward.Longitude, CreatedAt = created, DataSource = "SYNTHETIC" };
                _db.Complaints.Add(comp);
                await _db.SaveChangesAsync();
                _db.ComplaintHistories.Add(new ComplaintHistory { ComplaintId = comp.Id, OldStatus = null, NewStatus = ComplaintStatus.Open, ChangedById = comp.CitizenId, ChangedAt = comp.CreatedAt, Remarks = "Created" });
                _db.AiClassifications.Add(new AiClassification { ComplaintId = comp.Id, PredictedCategoryId = cat.Id, RecommendedDepartmentId = cat.DefaultDepartmentId, RecommendedPriority = priority, ConfidenceScore = 0.8m, ModelVersion = "jansamvad-classifier-v1", CreatedAt = DateTime.UtcNow });
                if (rand.NextDouble() < 0.35)
                {
                    comp.Status = ComplaintStatus.Resolved;
                    comp.ResolvedAt = comp.CreatedAt.AddDays(rand.Next(1, 30));
                    _db.ComplaintHistories.Add(new ComplaintHistory { ComplaintId = comp.Id, OldStatus = ComplaintStatus.Open, NewStatus = ComplaintStatus.Resolved, ChangedById = defaultOfficerId, ChangedAt = comp.ResolvedAt.Value, Remarks = "Auto-resolved in seed" });
                }
                counter++;
                if (counter % 200 == 0) await _db.SaveChangesAsync();
            }
            await _db.SaveChangesAsync();

            // Feedback
            var existingFeedback = await _db.Feedback.CountAsync();
            var projList = await _db.Projects.ToListAsync();
            for (int i = existingFeedback + 1; i <= TARGET_FEEDBACK; i++)
            {
                var c = citizensList[rand.Next(citizensList.Count)];
                var p = projList[rand.Next(projList.Count)];
                _db.Feedback.Add(new Feedback { CitizenId = c.Id, ProjectId = p.Id, Rating = (byte)rand.Next(1, 6), Comment = "Demo feedback", CreatedAt = DateTime.UtcNow.AddDays(-rand.Next(0, 365)) });
            }
            await _db.SaveChangesAsync();
        }

        private async Task EnsureUserAsync(string email, string fullName, string[] roles, bool isVerified = false)
        {
            if (await _userManager.FindByEmailAsync(email) != null) return;
            var user = new ApplicationUser { UserName = email, Email = email, FullName = fullName, EmailConfirmed = true, IsVerified = isVerified, DataSource = "SYNTHETIC", CreatedAt = DateTime.UtcNow };
            var res = await _userManager.CreateAsync(user, "P@ssword1!");
            if (res.Succeeded)
            {
                foreach (var r in roles) await _userManager.AddToRoleAsync(user, r);
            }
        }
    }
}
