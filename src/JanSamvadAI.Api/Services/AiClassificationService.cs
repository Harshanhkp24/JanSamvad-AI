using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using JanSamvadAI.Api.Data;
using JanSamvadAI.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace JanSamvadAI.Api.Services
{
    public class AiClassifyResponse
    {
        [JsonPropertyName("category")]
        public string? Category { get; set; }

        [JsonPropertyName("department")]
        public string? Department { get; set; }

        [JsonPropertyName("priority")]
        public string? Priority { get; set; }

        [JsonPropertyName("confidence")]
        public decimal Confidence { get; set; } = 0.5m;

        [JsonPropertyName("model_version")]
        public string? ModelVersion { get; set; } = "rule-v1";
    }

    public class AiClassificationResult
    {
        public int? CategoryId { get; set; }
        public int? DepartmentId { get; set; }
        public ComplaintPriority RecommendedPriority { get; set; } = ComplaintPriority.Medium;
        public decimal ConfidenceScore { get; set; } = 0.5m;
        public string ModelVersion { get; set; } = "heuristic-internal";
    }

    public interface IAiClassificationService
    {
        Task<AiClassificationResult> ClassifyComplaintAsync(string title, string description);
    }

    public class AiClassificationService : IAiClassificationService
    {
        private readonly HttpClient _httpClient;
        private readonly ApplicationDbContext _db;
        private readonly ILogger<AiClassificationService> _logger;
        private readonly string _aiServiceUrl;

        public AiClassificationService(HttpClient httpClient, ApplicationDbContext db, IConfiguration config, ILogger<AiClassificationService> logger)
        {
            _httpClient = httpClient;
            _db = db;
            _logger = logger;
            _aiServiceUrl = config["AiService:Url"] ?? "http://localhost:8001";
        }

        public async Task<AiClassificationResult> ClassifyComplaintAsync(string title, string description)
        {
            var combinedText = $"{title} {description}".Trim();
            AiClassifyResponse? aiResponse = null;

            try
            {
                var requestUri = $"{_aiServiceUrl}/ai/classify";
                using var cts = new System.Threading.CancellationTokenSource(TimeSpan.FromSeconds(2));
                var response = await _httpClient.PostAsJsonAsync(requestUri, new { text = combinedText }, cts.Token);
                if (response.IsSuccessStatusCode)
                {
                    aiResponse = await response.Content.ReadFromJsonAsync<AiClassifyResponse>();
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("AI microservice call failed ({Message}). Falling back to internal heuristic classifier.", ex.Message);
            }

            if (aiResponse == null)
            {
                aiResponse = FallbackHeuristic(combinedText);
            }

            // Map Category string to CategoryId in Database
            int? matchedCategoryId = null;
            int? matchedDeptId = null;

            if (!string.IsNullOrEmpty(aiResponse.Category))
            {
                var cat = await _db.ComplaintCategories
                    .FirstOrDefaultAsync(c => c.Name.ToLower() == aiResponse.Category.ToLower() || c.Code.ToLower() == aiResponse.Category.ToLower());
                if (cat != null)
                {
                    matchedCategoryId = cat.Id;
                    matchedDeptId = cat.DefaultDepartmentId;
                }
            }

            if (matchedDeptId == null && !string.IsNullOrEmpty(aiResponse.Department))
            {
                var dept = await _db.Departments
                    .FirstOrDefaultAsync(d => d.Name.ToLower().Contains(aiResponse.Department.ToLower()));
                if (dept != null)
                {
                    matchedDeptId = dept.Id;
                }
            }

            ComplaintPriority parsedPriority = ComplaintPriority.Medium;
            if (!string.IsNullOrEmpty(aiResponse.Priority))
            {
                Enum.TryParse(aiResponse.Priority, true, out parsedPriority);
            }

            return new AiClassificationResult
            {
                CategoryId = matchedCategoryId,
                DepartmentId = matchedDeptId,
                RecommendedPriority = parsedPriority,
                ConfidenceScore = aiResponse.Confidence,
                ModelVersion = aiResponse.ModelVersion ?? "heuristic-internal"
            };
        }

        private AiClassifyResponse FallbackHeuristic(string text)
        {
            var lower = text.ToLowerInvariant();
            if (lower.Contains("pothole") || lower.Contains("road") || lower.Contains("bridge") || lower.Contains("pavement") || lower.Contains("traffic"))
            {
                return new AiClassifyResponse { Category = "ROAD_DAMAGE", Department = "Roads & Infrastructure", Priority = "High", Confidence = 0.88m, ModelVersion = "internal-heuristic-v1" };
            }
            if (lower.Contains("water") || lower.Contains("pipe") || lower.Contains("leak") || lower.Contains("supply") || lower.Contains("drinking water"))
            {
                return new AiClassifyResponse { Category = "WATER_SUPPLY", Department = "Water Supply", Priority = "High", Confidence = 0.90m, ModelVersion = "internal-heuristic-v1" };
            }
            if (lower.Contains("light") || lower.Contains("street light") || lower.Contains("power") || lower.Contains("electricity") || lower.Contains("transformer") || lower.Contains("wire"))
            {
                return new AiClassifyResponse { Category = "STREET_LIGHT", Department = "Electricity", Priority = "Medium", Confidence = 0.85m, ModelVersion = "internal-heuristic-v1" };
            }
            if (lower.Contains("drain") || lower.Contains("sewer") || lower.Contains("overflow") || lower.Contains("flood") || lower.Contains("gutter"))
            {
                return new AiClassifyResponse { Category = "DRAINAGE", Department = "Drainage", Priority = "High", Confidence = 0.87m, ModelVersion = "internal-heuristic-v1" };
            }
            if (lower.Contains("garbage") || lower.Contains("waste") || lower.Contains("clean") || lower.Contains("trash") || lower.Contains("sanitation"))
            {
                return new AiClassifyResponse { Category = "SANITATION", Department = "Sanitation", Priority = "Medium", Confidence = 0.84m, ModelVersion = "internal-heuristic-v1" };
            }
            if (lower.Contains("hospital") || lower.Contains("doctor") || lower.Contains("health") || lower.Contains("medicine") || lower.Contains("clinic"))
            {
                return new AiClassifyResponse { Category = "HEALTHCARE", Department = "Healthcare", Priority = "High", Confidence = 0.86m, ModelVersion = "internal-heuristic-v1" };
            }
            if (lower.Contains("school") || lower.Contains("education") || lower.Contains("teacher") || lower.Contains("student") || lower.Contains("classroom"))
            {
                return new AiClassifyResponse { Category = "EDUCATION", Department = "Education", Priority = "Medium", Confidence = 0.82m, ModelVersion = "internal-heuristic-v1" };
            }

            return new AiClassifyResponse { Category = "OTHER", Department = "Public Works", Priority = "Low", Confidence = 0.50m, ModelVersion = "internal-heuristic-v1" };
        }
    }
}
