using System;
using System.Collections.Generic;
using System.Linq;
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

    public class DuplicateMatchDto
    {
        [JsonPropertyName("index")]
        public int Index { get; set; }

        [JsonPropertyName("text")]
        public string Text { get; set; } = string.Empty;

        [JsonPropertyName("similarity")]
        public decimal Similarity { get; set; }
    }

    public class DuplicateCheckResponse
    {
        [JsonPropertyName("is_potential_duplicate")]
        public bool IsPotentialDuplicate { get; set; }

        [JsonPropertyName("matches")]
        public List<DuplicateMatchDto> Matches { get; set; } = new();
    }

    public class ComplaintTextDto
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
    }

    public class ComplaintTrendInputDto
    {
        public int Id { get; set; }
        public string Region { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string CreatedAt { get; set; } = string.Empty;
    }

    public class ProjectContextDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
        [JsonPropertyName("status")]
        public string Status { get; set; } = string.Empty;
        [JsonPropertyName("budget_cr")]
        public decimal BudgetCr { get; set; }
        [JsonPropertyName("department")]
        public string Department { get; set; } = string.Empty;
        [JsonPropertyName("location")]
        public string Location { get; set; } = string.Empty;
    }

    public class ComplaintContextDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }
        [JsonPropertyName("complaint_number")]
        public string ComplaintNumber { get; set; } = string.Empty;
        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;
        [JsonPropertyName("status")]
        public string Status { get; set; } = string.Empty;
        [JsonPropertyName("priority")]
        public string Priority { get; set; } = string.Empty;
        [JsonPropertyName("category")]
        public string Category { get; set; } = string.Empty;
    }

    public class AssistantReplyResponse
    {
        [JsonPropertyName("reply")]
        public string Reply { get; set; } = string.Empty;
        [JsonPropertyName("service")]
        public string Service { get; set; } = string.Empty;
    }

    public class RegionalInsightsResponse
    {
        [JsonPropertyName("total_complaints_analyzed")]
        public int TotalComplaintsAnalyzed { get; set; }

        [JsonPropertyName("top_regions")]
        public List<TopRegionDto> TopRegions { get; set; } = new();

        [JsonPropertyName("trends")]
        public List<TrendPeriodDto> Trends { get; set; } = new();

        [JsonPropertyName("insights")]
        public List<InsightDto> Insights { get; set; } = new();
    }

    public class TopRegionDto
    {
        [JsonPropertyName("region")]
        public string Region { get; set; } = string.Empty;
        [JsonPropertyName("count")]
        public int Count { get; set; }
        [JsonPropertyName("primary_category")]
        public string PrimaryCategory { get; set; } = string.Empty;
    }

    public class TrendPeriodDto
    {
        [JsonPropertyName("period")]
        public string Period { get; set; } = string.Empty;
        [JsonPropertyName("count")]
        public int Count { get; set; }
    }

    public class InsightDto
    {
        [JsonPropertyName("region")]
        public string Region { get; set; } = string.Empty;
        [JsonPropertyName("category")]
        public string Category { get; set; } = string.Empty;
        [JsonPropertyName("type")]
        public string Type { get; set; } = string.Empty;
        [JsonPropertyName("description")]
        public string Description { get; set; } = string.Empty;
    }

    public interface IAiClassificationService
    {
        Task<AiClassificationResult> ClassifyComplaintAsync(string title, string description);
        Task<List<DuplicateMatchDto>> DetectDuplicatesAsync(string newText, List<string> existingTexts, decimal threshold = 0.65m);
        Task<RegionalInsightsResponse?> GetRegionalInsightsAsync(List<ComplaintTrendInputDto> complaints);
        Task<string> GetAssistantReplyAsync(string message, List<ProjectContextDto> projects, List<ComplaintContextDto> complaints);
        Task<JsonElement?> ClusterSimilarAsync(IEnumerable<object> items, decimal threshold = 0.70m);
        Task<JsonElement?> EvaluateClassifierAsync();
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
                using var cts = new System.Threading.CancellationTokenSource(TimeSpan.FromSeconds(12));
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

        public async Task<List<DuplicateMatchDto>> DetectDuplicatesAsync(string newText, List<string> existingTexts, decimal threshold = 0.65m)
        {
            try
            {
                var requestUri = $"{_aiServiceUrl}/ai/detect-duplicates";
                using var cts = new System.Threading.CancellationTokenSource(TimeSpan.FromSeconds(20));
                var payload = new
                {
                    new_text = newText,
                    existing_texts = existingTexts,
                    threshold = threshold
                };
                var response = await _httpClient.PostAsJsonAsync(requestUri, payload, cts.Token);
                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<DuplicateCheckResponse>();
                    return result?.Matches ?? new List<DuplicateMatchDto>();
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("AI duplicate detection failed: {Message}", ex.Message);
            }
            return new List<DuplicateMatchDto>();
        }

        public async Task<RegionalInsightsResponse?> GetRegionalInsightsAsync(List<ComplaintTrendInputDto> complaints)
        {
            try
            {
                var requestUri = $"{_aiServiceUrl}/ai/regional-insights";
                using var cts = new System.Threading.CancellationTokenSource(TimeSpan.FromSeconds(20));
                var payload = new
                {
                    complaints = complaints.Select(c => new {
                        id = c.Id,
                        region = c.Region,
                        category = c.Category,
                        created_at = c.CreatedAt
                    })
                };
                var response = await _httpClient.PostAsJsonAsync(requestUri, payload, cts.Token);
                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadFromJsonAsync<RegionalInsightsResponse>();
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("AI regional insights failed: {Message}", ex.Message);
            }
            return null;
        }

        public async Task<string> GetAssistantReplyAsync(string message, List<ProjectContextDto> projects, List<ComplaintContextDto> complaints)
        {
            try
            {
                var requestUri = $"{_aiServiceUrl}/ai/assistant/chat";
                using var cts = new System.Threading.CancellationTokenSource(TimeSpan.FromSeconds(20));
                var payload = new
                {
                    message = message,
                    projects_context = projects,
                    complaints_context = complaints
                };
                var response = await _httpClient.PostAsJsonAsync(requestUri, payload, cts.Token);
                if (response.IsSuccessStatusCode)
                {
                    var res = await response.Content.ReadFromJsonAsync<AssistantReplyResponse>();
                    return res?.Reply ?? "I'm sorry, I encountered an error retrieving that information.";
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("AI assistant call failed: {Message}", ex.Message);
            }
            return "The AI assistant service is currently offline. Please try again later.";
        }

        public async Task<JsonElement?> ClusterSimilarAsync(IEnumerable<object> items, decimal threshold = 0.70m)
        {
            try
            {
                var requestUri = $"{_aiServiceUrl}/ai/cluster-similar";
                using var cts = new System.Threading.CancellationTokenSource(TimeSpan.FromSeconds(30));
                var response = await _httpClient.PostAsJsonAsync(requestUri, new { items, threshold }, cts.Token);
                if (response.IsSuccessStatusCode)
                {
                    using var stream = await response.Content.ReadAsStreamAsync();
                    using var doc = await JsonDocument.ParseAsync(stream);
                    return doc.RootElement.Clone();
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("AI clustering failed: {Message}", ex.Message);
            }
            return null;
        }

        public async Task<JsonElement?> EvaluateClassifierAsync()
        {
            try
            {
                var requestUri = $"{_aiServiceUrl}/ai/evaluate";
                using var cts = new System.Threading.CancellationTokenSource(TimeSpan.FromSeconds(60));
                var response = await _httpClient.GetAsync(requestUri, cts.Token);
                if (response.IsSuccessStatusCode)
                {
                    using var stream = await response.Content.ReadAsStreamAsync();
                    using var doc = await JsonDocument.ParseAsync(stream);
                    return doc.RootElement.Clone();
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("AI evaluation failed: {Message}", ex.Message);
            }
            return null;
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
