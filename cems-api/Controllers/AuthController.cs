using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cems_api.Data;
using cems_api.DTOs;
using cems_api.Models;
using cems_api.Services;

namespace cems_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly CemsDbContext _db;
        private readonly TokenService _tokens;

        public AuthController(CemsDbContext db, TokenService tokens)
        {
            _db     = db;
            _tokens = tokens;
        }

        // ── POST /api/auth/login ─────────────────────────────
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.UsernameOrEmail) ||
                string.IsNullOrWhiteSpace(req.Password))
                return BadRequest(new { message = "Username/email and password are required." });

            var identifier = req.UsernameOrEmail.Trim().ToLower();

            // Find by username OR email, case-insensitive
            var user = await _db.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u =>
                    u.Username.ToLower() == identifier ||
                    u.Email.ToLower()    == identifier);

            if (user is null)
                return Unauthorized(new { message = "No account matches that username or email." });

            if (!BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
                return Unauthorized(new { message = "Incorrect password." });

            if (user.AccountStatus != "Active")
                return Unauthorized(new { message = "This account is deactivated. Contact an administrator." });

            // Update last login
            user.LastLogin = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            var roleName = user.Role?.RoleName ?? "Staff";
            var token    = _tokens.CreateToken(user, roleName);

            return Ok(new LoginResponse
            {
                Token    = token,
                UserId   = user.UserId,
                FullName = user.FullName,
                Username = user.Username,
                Email    = user.Email,
                Role     = roleName,
            });
        }

        // ── POST /api/auth/register ──────────────────────────
        // Used by admin to create new accounts (requires admin token later)
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.FullName)  ||
                string.IsNullOrWhiteSpace(req.Username)  ||
                string.IsNullOrWhiteSpace(req.Email)     ||
                string.IsNullOrWhiteSpace(req.Password))
                return BadRequest(new { message = "All fields are required." });

            // Normalise username — strip leading @
            var username = req.Username.Trim().TrimStart('@');

            var exists = await _db.Users.AnyAsync(u =>
                u.Username.ToLower() == username.ToLower() ||
                u.Email.ToLower()    == req.Email.Trim().ToLower());

            if (exists)
                return Conflict(new { message = "Username or email is already in use." });

            var roleExists = await _db.Roles.AnyAsync(r => r.RoleId == req.RoleId);
            if (!roleExists)
                return BadRequest(new { message = "Invalid role." });

            var user = new Users
            {
                FullName      = req.FullName.Trim(),
                Username      = "@" + username,
                Email         = req.Email.Trim().ToLower(),
                PasswordHash  = BCrypt.Net.BCrypt.HashPassword(req.Password),
                RoleId        = req.RoleId,
                AccountStatus = "Active",
                CreatedAt     = DateTime.UtcNow,
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(Login), new { message = "Account created.", userId = user.UserId });
        }

        // ── POST /api/auth/seed-admin ────────────────────────
        // One-time endpoint to create the first admin when the DB is empty.
        // Remove or protect this after first use.
        [HttpPost("seed-admin")]
        public async Task<IActionResult> SeedAdmin()
        {
            var alreadyExists = await _db.Users.AnyAsync(u => u.RoleId == 1);
            if (alreadyExists)
                return Conflict(new { message = "An administrator account already exists." });

            var admin = new Users
            {
                FullName      = "Administrator",
                Username      = "@admin",
                Email         = "admin@cems.edu",
                PasswordHash  = BCrypt.Net.BCrypt.HashPassword("Admin@1234"),
                RoleId        = 1,
                AccountStatus = "Active",
                CreatedAt     = DateTime.UtcNow,
            };

            _db.Users.Add(admin);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Admin account created.", username = "@admin", password = "Admin@1234" });
        }
    }
}
