namespace JanSamvadAI.Api.DTOs
{
    public class DistrictDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string State { get; set; }
        public string Description { get; set; }
        public string DataSource { get; set; }
    }

    public class ConstituencyDto
    {
        public int Id { get; set; }
        public int DistrictId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string DataSource { get; set; }
    }

    public class WardDto
    {
        public int Id { get; set; }
        public int ConstituencyId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Locality { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string DataSource { get; set; }
    }
}
