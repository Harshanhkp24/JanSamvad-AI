namespace JanSamvadAI.Api.Models;

public enum ProjectStatus { Planned, Approved, InProgress, OnHold, Completed, Cancelled }
public enum MilestoneStatus { Pending, InProgress, Completed, Delayed }
public enum WorkOrderStatus { Draft, Issued, Active, Completed, Cancelled }
public enum FinancialTransactionType { AdvancePayment, ProgressPayment, FinalPayment, Refund, Adjustment }
public enum ComplaintStatus { Open, Assigned, InProgress, Resolved, Closed, Reopened, Rejected }
public enum ComplaintPriority { Low, Medium, High, Critical }
public enum ComplaintRelationshipType { PotentialDuplicate, Related, SameProject, SameLocation }
public enum AttachmentOwnerType { Project, ProjectUpdate, Complaint, ComplaintHistory, Feedback }
