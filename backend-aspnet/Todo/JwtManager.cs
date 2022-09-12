using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Todo.Entity;

namespace Todo
{
    public class JwtManager
    {
        public const string SECRET_KEY = "9y$B&E)H@McQfTjWdsfdsfdsfsfsdfewr3sdfsd";
        public const string ISSUER = "todo api";
        private const string CLAIM_ID = "id";
        private const int ExpireSeconds = 600;

        public string Generate(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(SECRET_KEY);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] {
                    new Claim(CLAIM_ID, user.Id.ToString()),
                }),
                Issuer = ISSUER,
                Audience = ISSUER,
                Expires = DateTime.UtcNow.AddSeconds(ExpireSeconds),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };
            var secToken = tokenHandler.CreateToken(tokenDescriptor);
            var token = tokenHandler.WriteToken(secToken);

            return token;
        }
    }
}