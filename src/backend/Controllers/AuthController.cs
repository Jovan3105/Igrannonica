using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Microsoft.AspNetCore.Http.Extensions;
using System.Security.Cryptography;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace backend.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        static User u = new User();
        private readonly UserContext userContext;
        private readonly IConfiguration _configuration;
        public AuthController(UserContext userContext,IConfiguration configuration)
        {
            this.userContext = userContext;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(User user) {

            user.PasswordHashed = BCrypt.Net.BCrypt.HashPassword(user.PasswordHashed);
            this.userContext.Users.Add(user);
            await this.userContext.SaveChangesAsync();
            return Ok(user);
        }



        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(userDto request)
        {
            //proveravanje da li postoji username
            User user = this.userContext.Users.FirstOrDefault(user => user.Username == request.Username);
            if (user == null)
            {
                string token = CreateJWT(user, "username");
                return BadRequest(token);
            }
            else
            {
                if (BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHashed))
                {
                    string token = CreateJWT(user,"login");
                    return Ok(token);
                }
                else
                {   string token = CreateJWT(user,"password");
                    return BadRequest(token);
                }
               
            }


           
        }
        [HttpGet("users")]
        public async Task<ActionResult<List<User>>> getUsers()
        {
            return Ok(await this.userContext.Users.ToListAsync());
        }
                

        private void CreatePasswordHash(string password,out byte[] passwordHash,out byte[] passwordSalt)
        {
            using(var hmac =  new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash= hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

            }
        }     
        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);  

            }
        }
        private string CreateJWT(User user,string type)
        {
            List<Claim> claims;
            switch (type)
            {
                case "login":
                    claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name,user.Username),
                new Claim("message","Logging in..."),
                new Claim("error","none")

            }; 
                    break;
                case "password":
                    claims = new List<Claim>
            {
             
                new Claim("message","Wrong password,please try again"),
                new Claim("error","password")

            };
                    break;
                case "username":
                    claims = new List<Claim>
            {

                new Claim("message","Username not found"),
                new Claim("error","username")

            };
                    break;
                default:
                    claims = new List<Claim>
            {
                
                new Claim("error","none")

            };
                    break;
            }
            
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var token = new JwtSecurityToken(
                claims: claims,
                expires:DateTime.Now.AddDays(1),
                signingCredentials: creds
                
                );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);


            return jwt;
        }


        
    }
}