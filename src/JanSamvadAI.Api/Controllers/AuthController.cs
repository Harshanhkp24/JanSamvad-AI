using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using JanSamvadAI.Api.Models;
using JanSamvadAI.Api.DTOs;
using JanSamvadAI.Api.Services;
using Microsoft.AspNetCore.Authorization;

namespace JanSamvadAI.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly JwtService _jwtService;

        public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, JwtService jwtService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });

            var existing = await _userManager.FindByEmailAsync(req.Email);
            if (existing != null)
                return BadRequest(new { success = false, message = "User with this email already exists." });

            var user = new ApplicationUser
            {
                UserName = req.Email,
                Email = req.Email,
                FullName = req.FullName,
                PhoneNumber = req.PhoneNumber,
                WardId = req.WardId,
                EmailConfirmed = true,
                DataSource = "USER_REGISTERED"
            };

            var result = await _userManager.CreateAsync(user, req.Password);
            if (!result.Succeeded)
            {
                // Provide clearer validation messages from Identity
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { success = false, errors });
            }

            await _userManager.AddToRoleAsync(user, "CITIZEN");

            var roles = await _userManager.GetRolesAsync(user);
            var token = _jwtService.CreateToken(user, roles);

            var response = new AuthResponse
            {
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                User = new UserDto { Id = user.Id, Email = user.Email, FullName = user.FullName, PhoneNumber = user.PhoneNumber, WardId = user.WardId }
            };

            return Ok(new { success = true, data = response });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });

            var user = await _userManager.FindByEmailAsync(req.Email);
            if (user == null)
                return Unauthorized(new { success = false, message = "Invalid credentials." });

            var valid = await _userManager.CheckPasswordAsync(user, req.Password);
            if (!valid)
                return Unauthorized(new { success = false, message = "Invalid credentials." });

            var roles = await _userManager.GetRolesAsync(user);
            var token = _jwtService.CreateToken(user, roles);

            var response = new AuthResponse
            {
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                User = new UserDto { Id = user.Id, Email = user.Email, FullName = user.FullName, PhoneNumber = user.PhoneNumber, WardId = user.WardId }
            };

            return Ok(new { success = true, data = response });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var userId = User.FindFirst("userId")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { success = false });

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return Unauthorized(new { success = false });

            var roles = await _userManager.GetRolesAsync(user);
            var dto = new UserDto { Id = user.Id, Email = user.Email, FullName = user.FullName, PhoneNumber = user.PhoneNumber, WardId = user.WardId };
            return Ok(new { success = true, data = new { user = dto, roles } });
        }
    }
}
