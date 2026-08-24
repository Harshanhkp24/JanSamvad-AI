using System;
using System.Collections.Generic;

namespace JanSamvadAI.Api.DTOs
{
    public class ProjectFinancialSummaryDto
    {
        public int ProjectId { get; set; }
        public string ProjectName { get; set; } = string.Empty;
        public decimal EstimatedCost { get; set; }
        public decimal SanctionedAmount { get; set; }
        public decimal TenderAmount { get; set; }
        public decimal ContractAmount { get; set; }
        public decimal TotalDisbursedAmount { get; set; }
        public decimal RemainingAmount { get; set; }
        public decimal UtilizationPercentage { get; set; }
        public DateOnly? BudgetDate { get; set; }
        public int TransactionCount { get; set; }
    }

    public class ProjectContractorDto
    {
        public int ContractorId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string RegistrationNumber { get; set; } = string.Empty;
        public string ContractorRole { get; set; } = "PRIMARY";
        public DateOnly AssignedDate { get; set; }
        public string? ContactInformation { get; set; }
        public string? Address { get; set; }
    }

    public class ProjectMilestoneDto
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateOnly? PlannedDate { get; set; }
        public DateOnly? ActualDate { get; set; }
        public decimal CompletionPercentage { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Remarks { get; set; }
    }

    public class FinancialTransactionDto
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public DateOnly TransactionDate { get; set; }
        public string TransactionType { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string? ReferenceNumber { get; set; }
        public string? Description { get; set; }
        public string DataSource { get; set; } = "SYNTHETIC";
    }

    public class DelayRecordDto
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string Reason { get; set; } = string.Empty;
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public int DelayDays { get; set; }
        public string? Description { get; set; }
        public string? ReportedByName { get; set; }
    }

    public class ProjectUpdateDto
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string AuthorId { get; set; } = string.Empty;
        public string AuthorName { get; set; } = string.Empty;
        public DateTime UpdateDate { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal? ProgressPercentage { get; set; }
        public string? Location { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateProjectUpdateDto
    {
        public string Description { get; set; } = string.Empty;
        public decimal? ProgressPercentage { get; set; }
        public string? Location { get; set; }
    }
}
