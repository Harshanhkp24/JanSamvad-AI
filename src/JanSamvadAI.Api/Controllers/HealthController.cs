using Microsoft.AspNetCore.Mvc;

namespace JanSamvadAI.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get() => Ok(new { success = true, status = "api running" });
    }
}
