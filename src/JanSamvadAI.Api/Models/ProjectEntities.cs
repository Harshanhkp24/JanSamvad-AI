namespace JanSamvadAI.Api.Models;

public class Department
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Responsibility { get; set; } = string.Empty;
    public string DataSource { get; set; } = "SYNTHETIC";
    public bool IsActive { get; set; } = true;
    public ICollection<Project> Projects { get; set; } = new List<Project>();
    public ICollection<Complaint> Complaints { get; set; } = new List<Complaint>();
}

public class Project
{
    public int Id { get; set; }
    public int WardId { get; set; }
    public int DepartmentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ProjectType { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public ProjectStatus Status { get; set; } = ProjectStatus.Planned;
    public decimal ProgressPercentage { get; set; }
    public DateOnly? PlannedStartDate { get; set; }
    public DateOnly? PlannedCompletionDate { get; set; }
    public DateOnly? ActualStartDate { get; set; }
    public DateOnly? ActualCompletionDate { get; set; }
    public string DataSource { get; set; } = "SYNTHETIC";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public Ward Ward { get; set; } = null!;
    public Department Department { get; set; } = null!;
    public ICollection<ProjectBudget> Budgets { get; set; } = new List<ProjectBudget>();
    public ICollection<ProjectContractor> ProjectContractors { get; set; } = new List<ProjectContractor>();
    public ICollection<WorkOrder> WorkOrders { get; set; } = new List<WorkOrder>();
    public ICollection<ProjectMilestone> Milestones { get; set; } = new List<ProjectMilestone>();
    public ICollection<FinancialTransaction> FinancialTransactions { get; set; } = new List<FinancialTransaction>();
    public ICollection<ProjectUpdate> Updates { get; set; } = new List<ProjectUpdate>();
    public ICollection<DelayRecord> DelayRecords { get; set; } = new List<DelayRecord>();
    public ICollection<Complaint> Complaints { get; set; } = new List<Complaint>();
}

public class ProjectBudget
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public decimal? EstimatedCost { get; set; }
    public decimal? SanctionedAmount { get; set; }
    public decimal? TenderAmount { get; set; }
    public decimal? ContractAmount { get; set; }
    public DateOnly BudgetDate { get; set; }
    public string DataSource { get; set; } = "SYNTHETIC";
    public Project Project { get; set; } = null!;
}

public class Contractor
{
    public int Id { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string RegistrationNumber { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? ContactInformation { get; set; }
    public string DataSource { get; set; } = "SYNTHETIC";
    public ICollection<ProjectContractor> ProjectContractors { get; set; } = new List<ProjectContractor>();
}

public class ProjectContractor
{
    public int ProjectId { get; set; }
    public int ContractorId { get; set; }
    public string ContractorRole { get; set; } = "PRIMARY";
    public DateOnly AssignedDate { get; set; }
    public Project Project { get; set; } = null!;
    public Contractor Contractor { get; set; } = null!;
}

public class WorkOrder
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string WorkOrderNumber { get; set; } = string.Empty;
    public DateOnly IssueDate { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? PlannedCompletionDate { get; set; }
    public decimal? ContractAmount { get; set; }
    public WorkOrderStatus Status { get; set; }
    public Project Project { get; set; } = null!;
}

public class ProjectMilestone
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateOnly? PlannedDate { get; set; }
    public DateOnly? ActualDate { get; set; }
    public decimal CompletionPercentage { get; set; }
    public MilestoneStatus Status { get; set; }
    public string? Remarks { get; set; }
    public Project Project { get; set; } = null!;
}

public class FinancialTransaction
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public DateOnly TransactionDate { get; set; }
    public FinancialTransactionType TransactionType { get; set; }
    public decimal Amount { get; set; }
    public string? ReferenceNumber { get; set; }
    public string? Description { get; set; }
    public string DataSource { get; set; } = "SYNTHETIC";
    public Project Project { get; set; } = null!;
}

public class ProjectUpdate
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string AuthorId { get; set; } = string.Empty;
    public DateTime UpdateDate { get; set; } = DateTime.UtcNow;
    public string Description { get; set; } = string.Empty;
    public decimal? ProgressPercentage { get; set; }
    public string? Location { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string DataSource { get; set; } = "USER_GENERATED";
    public Project Project { get; set; } = null!;
    public ApplicationUser Author { get; set; } = null!;
}

public class DelayRecord
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string Reason { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public int DelayDays { get; set; }
    public string? Description { get; set; }
    public string? ReportedById { get; set; }
    public Project Project { get; set; } = null!;
    public ApplicationUser? ReportedBy { get; set; }
}
