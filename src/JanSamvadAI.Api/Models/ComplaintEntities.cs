namespace JanSamvadAI.Api.Models;

public class ComplaintCategory
{
    public int Id { get; set; }
    public int? DefaultDepartmentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public Department? DefaultDepartment { get; set; }
    public ICollection<Complaint> Complaints { get; set; } = new List<Complaint>();
}

public class Complaint
{
    public int Id { get; set; }
    public string ComplaintNumber { get; set; } = string.Empty;
    public string CitizenId { get; set; } = string.Empty;
    public int WardId { get; set; }
    public int? DepartmentId { get; set; }
    public int? ProjectId { get; set; }
    public int? CategoryId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public ComplaintPriority Priority { get; set; } = ComplaintPriority.Medium;
    public ComplaintStatus Status { get; set; } = ComplaintStatus.Open;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ResolvedAt { get; set; }
    public string DataSource { get; set; } = "USER_GENERATED";
    public ApplicationUser Citizen { get; set; } = null!;
    public Ward Ward { get; set; } = null!;
    public Department? Department { get; set; }
    public Project? Project { get; set; }
    public ComplaintCategory? Category { get; set; }
    public ICollection<ComplaintHistory> History { get; set; } = new List<ComplaintHistory>();
    public ICollection<AiClassification> AiClassifications { get; set; } = new List<AiClassification>();
    public ICollection<ComplaintRelationship> RelationshipsFrom { get; set; } = new List<ComplaintRelationship>();
    public ICollection<ComplaintRelationship> RelationshipsTo { get; set; } = new List<ComplaintRelationship>();
    public ICollection<Feedback> Feedback { get; set; } = new List<Feedback>();
}

public class ComplaintHistory
{
    public int Id { get; set; }
    public int ComplaintId { get; set; }
    public ComplaintStatus? OldStatus { get; set; }
    public ComplaintStatus NewStatus { get; set; }
    public string ChangedById { get; set; } = string.Empty;
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
    public string? Remarks { get; set; }
    public Complaint Complaint { get; set; } = null!;
    public ApplicationUser ChangedBy { get; set; } = null!;
}

public class AiClassification
{
    public int Id { get; set; }
    public int ComplaintId { get; set; }
    public int? PredictedCategoryId { get; set; }
    public int? RecommendedDepartmentId { get; set; }
    public ComplaintPriority? RecommendedPriority { get; set; }
    public decimal ConfidenceScore { get; set; }
    public string ModelVersion { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsApplied { get; set; }
    public Complaint Complaint { get; set; } = null!;
    public ComplaintCategory? PredictedCategory { get; set; }
    public Department? RecommendedDepartment { get; set; }
}

public class ComplaintRelationship
{
    public int Id { get; set; }
    public int ComplaintId1 { get; set; }
    public int ComplaintId2 { get; set; }
    public ComplaintRelationshipType RelationshipType { get; set; }
    public decimal SimilarityScore { get; set; }
    public string? VerifiedById { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Complaint Complaint1 { get; set; } = null!;
    public Complaint Complaint2 { get; set; } = null!;
    public ApplicationUser? VerifiedBy { get; set; }
}

public class Feedback
{
    public int Id { get; set; }
    public int? ComplaintId { get; set; }
    public int? ProjectId { get; set; }
    public string CitizenId { get; set; } = string.Empty;
    public byte Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Complaint? Complaint { get; set; }
    public Project? Project { get; set; }
    public ApplicationUser Citizen { get; set; } = null!;
}

public class Attachment
{
    public int Id { get; set; }
    public AttachmentOwnerType OwnerType { get; set; }
    public int OwnerId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public string UploadedById { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    public ApplicationUser UploadedBy { get; set; } = null!;
}

public class AuditLog
{
    public long Id { get; set; }
    public string? UserId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string EntityName { get; set; } = string.Empty;
    public string EntityId { get; set; } = string.Empty;
    public string? OldValues { get; set; }
    public string? NewValues { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ApplicationUser? User { get; set; }
}
