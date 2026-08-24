using System.ComponentModel.DataAnnotations;

namespace JanSamvadAI.Api.Models
{
    public class Constituency
    {
        [Key]
        public int Id { get; set; }
        public int DistrictId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string DataSource { get; set; }

        public District District { get; set; }
        public ICollection<Ward> Wards { get; set; } = new List<Ward>();
    }
}
