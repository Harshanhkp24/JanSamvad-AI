using JanSamvadAI.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace JanSamvadAI.Api.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
    public DbSet<District> Districts { get; set; }
    public DbSet<Constituency> Constituencies { get; set; }
    public DbSet<Ward> Wards { get; set; }
    public DbSet<Department> Departments { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<ProjectBudget> ProjectBudgets { get; set; }
    public DbSet<Contractor> Contractors { get; set; }
    public DbSet<ProjectContractor> ProjectContractors { get; set; }
    public DbSet<WorkOrder> WorkOrders { get; set; }
    public DbSet<ProjectMilestone> ProjectMilestones { get; set; }
    public DbSet<FinancialTransaction> FinancialTransactions { get; set; }
    public DbSet<ProjectUpdate> ProjectUpdates { get; set; }
    public DbSet<DelayRecord> DelayRecords { get; set; }
    public DbSet<ComplaintCategory> ComplaintCategories { get; set; }
    public DbSet<Complaint> Complaints { get; set; }
    public DbSet<ComplaintHistory> ComplaintHistories { get; set; }
    public DbSet<AiClassification> AiClassifications { get; set; }
    public DbSet<ComplaintRelationship> ComplaintRelationships { get; set; }
    public DbSet<Feedback> Feedback { get; set; }
    public DbSet<Attachment> Attachments { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<District>(b => { b.Property(x => x.Name).IsRequired().HasMaxLength(200); b.HasIndex(x => x.Code).IsUnique(); });
        builder.Entity<Constituency>(b => { b.Property(x => x.Name).IsRequired().HasMaxLength(200); b.HasIndex(x => new { x.DistrictId, x.Code }).IsUnique(); b.HasOne(x => x.District).WithMany(x => x.Constituencies).HasForeignKey(x => x.DistrictId).OnDelete(DeleteBehavior.Restrict); });
        builder.Entity<Ward>(b => { b.Property(x => x.Name).IsRequired().HasMaxLength(200); b.HasIndex(x => new { x.ConstituencyId, x.Code }).IsUnique(); b.HasOne(x => x.Constituency).WithMany(x => x.Wards).HasForeignKey(x => x.ConstituencyId).OnDelete(DeleteBehavior.Restrict); });
        builder.Entity<ApplicationUser>(b => b.HasOne(x => x.Ward).WithMany().HasForeignKey(x => x.WardId).OnDelete(DeleteBehavior.SetNull));
        builder.Entity<Department>(b => { b.Property(x => x.Name).IsRequired().HasMaxLength(150); b.HasIndex(x => x.Code).IsUnique(); });
        builder.Entity<Project>(b => { b.Property(x => x.Name).IsRequired().HasMaxLength(250); b.Property(x => x.ProgressPercentage).HasPrecision(5, 2); b.HasIndex(x => new { x.WardId, x.Status }); b.HasOne(x => x.Ward).WithMany().HasForeignKey(x => x.WardId).OnDelete(DeleteBehavior.Restrict); b.HasOne(x => x.Department).WithMany(x => x.Projects).HasForeignKey(x => x.DepartmentId).OnDelete(DeleteBehavior.Restrict); });
        builder.Entity<ProjectBudget>(b => { b.Property(x => x.EstimatedCost).HasPrecision(18, 2); b.Property(x => x.SanctionedAmount).HasPrecision(18, 2); b.Property(x => x.TenderAmount).HasPrecision(18, 2); b.Property(x => x.ContractAmount).HasPrecision(18, 2); b.HasOne(x => x.Project).WithMany(x => x.Budgets).HasForeignKey(x => x.ProjectId).OnDelete(DeleteBehavior.Cascade); });
        builder.Entity<Contractor>(b => { b.Property(x => x.CompanyName).IsRequired().HasMaxLength(250); b.HasIndex(x => x.RegistrationNumber).IsUnique(); });
        builder.Entity<ProjectContractor>(b => { b.HasKey(x => new { x.ProjectId, x.ContractorId }); b.HasOne(x => x.Project).WithMany(x => x.ProjectContractors).HasForeignKey(x => x.ProjectId).OnDelete(DeleteBehavior.Cascade); b.HasOne(x => x.Contractor).WithMany(x => x.ProjectContractors).HasForeignKey(x => x.ContractorId).OnDelete(DeleteBehavior.Restrict); });
        builder.Entity<WorkOrder>(b => { b.Property(x => x.ContractAmount).HasPrecision(18, 2); b.HasIndex(x => x.WorkOrderNumber).IsUnique(); b.HasOne(x => x.Project).WithMany(x => x.WorkOrders).HasForeignKey(x => x.ProjectId).OnDelete(DeleteBehavior.Cascade); });
        builder.Entity<ProjectMilestone>(b => { b.Property(x => x.CompletionPercentage).HasPrecision(5, 2); b.HasOne(x => x.Project).WithMany(x => x.Milestones).HasForeignKey(x => x.ProjectId).OnDelete(DeleteBehavior.Cascade); });
        builder.Entity<FinancialTransaction>(b => { b.Property(x => x.Amount).HasPrecision(18, 2); b.HasIndex(x => new { x.ProjectId, x.TransactionDate }); b.HasOne(x => x.Project).WithMany(x => x.FinancialTransactions).HasForeignKey(x => x.ProjectId).OnDelete(DeleteBehavior.Cascade); });
        builder.Entity<ProjectUpdate>(b => { b.Property(x => x.ProgressPercentage).HasPrecision(5, 2); b.HasOne(x => x.Project).WithMany(x => x.Updates).HasForeignKey(x => x.ProjectId).OnDelete(DeleteBehavior.Cascade); b.HasOne(x => x.Author).WithMany().HasForeignKey(x => x.AuthorId).OnDelete(DeleteBehavior.Restrict); });
        builder.Entity<DelayRecord>(b => { b.HasOne(x => x.Project).WithMany(x => x.DelayRecords).HasForeignKey(x => x.ProjectId).OnDelete(DeleteBehavior.Cascade); b.HasOne(x => x.ReportedBy).WithMany().HasForeignKey(x => x.ReportedById).OnDelete(DeleteBehavior.SetNull); });
        builder.Entity<ComplaintCategory>(b => { b.Property(x => x.Name).IsRequired().HasMaxLength(150); b.HasIndex(x => x.Code).IsUnique(); b.HasOne(x => x.DefaultDepartment).WithMany().HasForeignKey(x => x.DefaultDepartmentId).OnDelete(DeleteBehavior.SetNull); });
        builder.Entity<Complaint>(b => { b.Property(x => x.Title).IsRequired().HasMaxLength(250); b.Property(x => x.Description).IsRequired(); b.Property(x => x.Latitude).HasPrecision(9, 6); b.Property(x => x.Longitude).HasPrecision(9, 6); b.HasIndex(x => x.ComplaintNumber).IsUnique(); b.HasIndex(x => new { x.WardId, x.Status, x.CreatedAt }); b.HasOne(x => x.Citizen).WithMany().HasForeignKey(x => x.CitizenId).OnDelete(DeleteBehavior.Restrict); b.HasOne(x => x.Ward).WithMany().HasForeignKey(x => x.WardId).OnDelete(DeleteBehavior.Restrict); b.HasOne(x => x.Department).WithMany(x => x.Complaints).HasForeignKey(x => x.DepartmentId).OnDelete(DeleteBehavior.SetNull); b.HasOne(x => x.Project).WithMany(x => x.Complaints).HasForeignKey(x => x.ProjectId).OnDelete(DeleteBehavior.SetNull); b.HasOne(x => x.Category).WithMany(x => x.Complaints).HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.SetNull); });
        builder.Entity<ComplaintHistory>(b => { b.HasIndex(x => new { x.ComplaintId, x.ChangedAt }); b.HasOne(x => x.Complaint).WithMany(x => x.History).HasForeignKey(x => x.ComplaintId).OnDelete(DeleteBehavior.Cascade); b.HasOne(x => x.ChangedBy).WithMany().HasForeignKey(x => x.ChangedById).OnDelete(DeleteBehavior.Restrict); });
        builder.Entity<AiClassification>(b => { b.Property(x => x.ConfidenceScore).HasPrecision(5, 4); b.HasOne(x => x.Complaint).WithMany(x => x.AiClassifications).HasForeignKey(x => x.ComplaintId).OnDelete(DeleteBehavior.Cascade); b.HasOne(x => x.PredictedCategory).WithMany().HasForeignKey(x => x.PredictedCategoryId).OnDelete(DeleteBehavior.SetNull); b.HasOne(x => x.RecommendedDepartment).WithMany().HasForeignKey(x => x.RecommendedDepartmentId).OnDelete(DeleteBehavior.SetNull); });
        builder.Entity<ComplaintRelationship>(b => { b.Property(x => x.SimilarityScore).HasPrecision(5, 4); b.HasIndex(x => new { x.ComplaintId1, x.ComplaintId2, x.RelationshipType }).IsUnique(); b.HasCheckConstraint("CK_ComplaintRelationship_DifferentComplaints", "[ComplaintId1] <> [ComplaintId2]"); b.HasOne(x => x.Complaint1).WithMany(x => x.RelationshipsFrom).HasForeignKey(x => x.ComplaintId1).OnDelete(DeleteBehavior.Restrict); b.HasOne(x => x.Complaint2).WithMany(x => x.RelationshipsTo).HasForeignKey(x => x.ComplaintId2).OnDelete(DeleteBehavior.Restrict); b.HasOne(x => x.VerifiedBy).WithMany().HasForeignKey(x => x.VerifiedById).OnDelete(DeleteBehavior.SetNull); });
        builder.Entity<Feedback>(b => { b.HasCheckConstraint("CK_Feedback_Rating", "[Rating] BETWEEN 1 AND 5"); b.HasCheckConstraint("CK_Feedback_Target", "[ComplaintId] IS NOT NULL OR [ProjectId] IS NOT NULL"); b.HasOne(x => x.Complaint).WithMany(x => x.Feedback).HasForeignKey(x => x.ComplaintId).OnDelete(DeleteBehavior.SetNull); b.HasOne(x => x.Project).WithMany().HasForeignKey(x => x.ProjectId).OnDelete(DeleteBehavior.SetNull); b.HasOne(x => x.Citizen).WithMany().HasForeignKey(x => x.CitizenId).OnDelete(DeleteBehavior.Restrict); });
        builder.Entity<Attachment>(b => { b.HasIndex(x => new { x.OwnerType, x.OwnerId }); b.HasOne(x => x.UploadedBy).WithMany().HasForeignKey(x => x.UploadedById).OnDelete(DeleteBehavior.Restrict); });
        builder.Entity<AuditLog>(b => { b.HasIndex(x => new { x.EntityName, x.EntityId }); b.HasIndex(x => x.CreatedAt); b.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.SetNull); });
    }
}
