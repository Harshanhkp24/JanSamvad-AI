using Microsoft.AspNetCore.Identity;

namespace JanSamvadAI.Api.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public int? WardId { get; set; }
        public Ward? Ward { get; set; }
        public bool IsVerified { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string DataSource { get; set; } = "USER_GENERATED";
    }
}
