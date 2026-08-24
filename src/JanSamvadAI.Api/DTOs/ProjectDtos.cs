using System;

namespace JanSamvadAI.Api.DTOs
{
    public class ProjectListItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public decimal ProgressPercentage { get; set; }
        public int WardId { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public string DataSource { get; set; }
    }

    public class ProjectDetailDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public decimal ProgressPercentage { get; set; }
        public int WardId { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public DateTime CreatedAt { get; set; }
        public string DataSource { get; set; }
    }
}
