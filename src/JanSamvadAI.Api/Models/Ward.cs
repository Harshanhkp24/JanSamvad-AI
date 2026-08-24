using System.ComponentModel.DataAnnotations;

namespace JanSamvadAI.Api.Models
{
    public class Ward
    {
        [Key]
        public int Id { get; set; }
        public int ConstituencyId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Locality { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string DataSource { get; set; }

        public Constituency Constituency { get; set; }
    }
}
