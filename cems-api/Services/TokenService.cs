using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using cems_api.Models;

namespace cems_api.Services
{
    public class TokenService
    {
        private readonly IConfiguration _config;

        public TokenService(IConfiguration config)
        {
            _config = config;
        }

        public string CreateToken(Users user, string roleName)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub,  user.UserId.ToString()),
                new Claim(JwtRegisteredClaimNames.Name, user.FullName),
                new Claim("username",                   user.Username),
                new Claim(JwtRegisteredClaimNames.Email,user.Email),
                new Claim(ClaimTypes.Role,              roleName),
                new Claim(JwtRegisteredClaimNames.Jti,  Guid.NewGuid().ToString()),
            };

            var key   = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(_config["Jwt:SecretKey"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer:             _config["Jwt:Issuer"],
                audience:           _config["Jwt:Audience"],
                claims:             claims,
                expires:            DateTime.UtcNow.AddHours(8),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
