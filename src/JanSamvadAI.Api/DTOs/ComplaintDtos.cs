using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace JanSamvadAI.Api.DTOs
{
    public class ComplaintListItemDto
    {
        public int Id { get; set; }
        public string ComplaintNumber { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int WardId { get; set; }
        public string WardName { get; set; } = string.Empty;
        public int? DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public int? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public string Priority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
    }

    public class ComplaintHistoryDto
    {
        public int Id { get; set; }
        public string? OldStatus { get; set; }
        public string NewStatus { get; set; } = string.Empty;
        public string ChangedByName { get; set; } = string.Empty;
        public DateTime ChangedAt { get; set; }
        public string? Remarks { get; set; }
    }

    public class AiClassificationDto
    {
        public int Id { get; set; }
        public string? PredictedCategoryName { get; set; }
        public string? RecommendedDepartmentName { get; set; }
        public string? RecommendedPriority { get; set; }
        public decimal ConfidenceScore { get; set; }
        public string ModelVersion { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class FeedbackDto
    {
        public int Id { get; set; }
        public string CitizenName { get; set; } = string.Empty;
        public byte Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class ComplaintDetailDto
    {
        public int Id { get; set; }
        public string ComplaintNumber { get; set; } = string.Empty;
        public string CitizenId { get; set; } = string.Empty;
        public string CitizenName { get; set; } = string.Empty;
        public int WardId { get; set; }
        public string WardName { get; set; } = string.Empty;
        public int? DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public int? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public int? ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string Priority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public string DataSource { get; set; } = "USER_GENERATED";
        public List<ComplaintHistoryDto> History { get; set; } = new();
        public List<AiClassificationDto> AiClassifications { get; set; } = new();
        public List<FeedbackDto> Feedback { get; set; } = new();
    }

    public class ComplaintCreateDto
    {
        [Required]
        public int WardId { get; set; }
        public int? DepartmentId { get; set; }
        public int? ProjectId { get; set; }
        public int? CategoryId { get; set; }
        [Required]
        [MaxLength(250)]
        public string Title { get; set; } = string.Empty;
        [Required]
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string? Priority { get; set; }
    }

    public class ComplaintStatusUpdateDto
    {
        [Required]
        public string NewStatus { get; set; } = string.Empty;
        public string? Remarks { get; set; }
    }

    public class FeedbackCreateDto
    {
        [Range(1, 5)]
        public byte Rating { get; set; }
        public string? Comment { get; set; }
        public int? ProjectId { get; set; }
    }

    public class ComplaintStatsDto
    {
        public int TotalComplaints { get; set; }
        public int OpenComplaints { get; set; }
        public int InProgressComplaints { get; set; }
        public int ResolvedComplaints { get; set; }
        public int RejectedComplaints { get; set; }
        public int HighPriorityComplaints { get; set; }
        public decimal ResolutionRatePercentage { get; set; }
    }

    public class ComplaintCategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? DefaultDepartmentId { get; set; }
        public string? DefaultDepartmentName { get; set; }
    }
}
