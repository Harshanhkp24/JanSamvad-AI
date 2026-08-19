using System.ComponentModel.DataAnnotations;

namespace JanSamvadAI.Api.DTOs
{
    public class RegisterRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters.")]
        public string Password { get; set; }

        [Required]
        [StringLength(200)]
        public string FullName { get; set; }

        [Phone]
        public string PhoneNumber { get; set; }

        public int? WardId { get; set; }
    }
}
