using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JanSamvadAI.Api.Models
{
    public class District
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Code { get; set; }
        public string State { get; set; }
        public string Description { get; set; }
        public string DataSource { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<Constituency> Constituencies { get; set; } = new List<Constituency>();
    }
}
