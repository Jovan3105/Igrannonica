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
using System.Text;

namespace backend.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly UserContext userContext;
        private readonly IConfiguration _configuration;
        public AuthController(UserContext userContext,IConfiguration configuration)
        {
            this.userContext = userContext;
            _configuration = configuration;
        }

        Services.EmailSender emailSender = new Services.EmailSender();

        [HttpPost("register")]
        public async Task<ActionResult<string>> Register(User user)
        {
            //proveravanje maila

            if (!IsValidEmail(user.Email))
            {
                return BadRequest(new
                {
                    success = false,
                    data = new
                    {
                        token = "",
                        errors = new[] {
                            new {
                                message = "bad request",
                                code = "email_notValid"
                            }
                            }



                    }
                });
            }
            user.PasswordHashed = BCrypt.Net.BCrypt.HashPassword(user.PasswordHashed);
            user.VerifiedEmail = false;
            try
            {
                this.userContext.Users.Add(user);

                await this.userContext.SaveChangesAsync();

                //slanje verifikacionog mejla

                await sendVerificationEmail(user.Email);

                return Ok(new
                {
                    success = true
                });
            }
            catch(Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    data = new
                    {
                        token = "",
                        errors = new[] {
                            new {
                                message = "bad request",
                                code = "userOrEmail_AlreadyExists"
                            }
                            }



                    }
                });
            }
        }

        [HttpGet("verifyEmail")]
        public async Task<ActionResult<string>> verifyEmail(string email,string token)
        {
            User user = this.userContext.Users.FirstOrDefault(user => user.Email == email);
            if(user == null)
            {
                return BadRequest(new
                {
                    success = false,
                    data = new
                    {
                        token = "",
                        errors = new[] {
                            new {
                                message = "bad request",
                                code = "user_notFound"
                            }
                            }



                    }
                });
            }
            else
            {
                if (IsTokenValid(token, user))
                {
                    user.VerifiedEmail = true;
                    this.userContext.Update(user);
                    await this.userContext.SaveChangesAsync();
                    string JWtoken = CreateJWT(user);
                    return Ok(new
                    {
                        success = true,
                        data = new
                        {
                            token = JWtoken,
                        }
                    });
                }
                else
                {
                    return BadRequest(new
                    {
                        success = false,
                        data = new
                        {
                            token = "",
                            errors = new[] {
                            new {
                                message = "bad request",
                                code = "token_notValid"
                            }
                            }



                        }
                    });
                }
            }    
        }

        [HttpPost("sendVerificationEmail")]
        public async Task<ActionResult<string>> sendVerificationEmail(string email)
        {


            // treba naci bolje resenje umesto password hasha ali nek je ovako za sad

            User user = this.userContext.Users.FirstOrDefault(x => x.Email == email);
            if (user == null)
            {
                return BadRequest(new
                {
                    success = false,
                    data = new
                    {
                        token = "",
                        errors = new[] {
                            new {
                                message = "bad request",
                                code = "email_notExists"
                            }
                            }

                    }
                });
            }
            else
            {
                string token = GenerateEmailToken(user.Email, DateTime.UtcNow.Ticks);

                string message = @"Hello, <b>" + user.Username + @"</b>.<br>
                                Please confirm your email <a href='https://localhost:7220/api/Auth/verifyEmail?email=" + user.Email + "&token=" + token + @"'>here</a>.<br>
                                    <b>This link will be valid for 5 minutes!</b>";

                await emailSender.SendEmailAsync(user.Email, "Confirm Account", message);

                return Ok(new
                {
                    success = true,
                });
            }
        }


        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(userDto request)
        {
            //proveravanje da li postoji username
            User user = this.userContext.Users.FirstOrDefault(user => user.Username == request.Username || user.Email == request.Username);
            if (user == null)
            {
                
                 return BadRequest(new
                {
                    success = false,
                    data = new
                    {
                        token = "",
                        errors = new[] {
                            new {
                                message = "bad request",
                                code = "username_notFound"
                            }
                            }



                    }
                });
            }
            else
            {
                if (BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHashed))
                {
                    if (user.VerifiedEmail == false)
                    {
                        return BadRequest(new
                        {
                            success = false,
                            data = new
                            {
                                token = "",
                                errors = new[] {
                            new {
                                message = "bad request",
                                code = "email_notVerified"
                            }
                            }



                            }
                        });
                    }
                    else
                    {
                        string token = CreateJWT(user);
                        return Ok(new
                        {
                            success = true,
                            data = new
                            {
                                token = token,




                            }
                        });
                    }
                }
                else
                {   
                    return BadRequest(new
                    {   
                        success=false,
                        data = new
                        {   
                            token="",
                            errors= new[] {
                            new {
                                message = "bad request",
                                code = "incorrect_password"
                            } 
                            }
                            
                            

                        }
                    });
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
        private string CreateJWT(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name,user.Username),
                new Claim(ClaimTypes.Email,user.Email),
                new Claim("message","Logging in..."),
                new Claim("access_token", CreateAccessJWT())



            };
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
        private string CreateAccessJWT()
        {
            var key= new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value));

            var token = new JwtSecurityToken(
                expires: DateTime.Now.AddDays(1),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha512)



                ) ;
            
            
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

        private bool IsValidEmail(string email)
        {
            var trimmedEmail = email.Trim();

            if (trimmedEmail.EndsWith("."))
            {
                return false;
            }
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == trimmedEmail;
            }
            catch
            {
                return false;
            }
        }

        private string GenerateEmailToken(string email, long ticks)
        {
            string hash = string.Join(":", new string[] { email, ticks.ToString() });
            string hashLeft = "";
            string hashRight = "";

            using (HMAC hmac = new HMACSHA512())
            {
                hmac.Key = Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:EmailToken").Value);
                hmac.ComputeHash(Encoding.UTF8.GetBytes(hash));

                hashLeft = Convert.ToBase64String(hmac.Hash);
                hashRight = string.Join(":", new string[] { email, ticks.ToString() });
            }

            return Convert.ToBase64String(Encoding.UTF8.GetBytes(string.Join(":", hashLeft, hashRight)));
        }
        private const int _expirationMinutes = 5;

        private bool IsTokenValid(string token,User user)
        {
            bool result = false;

            try
            {
                string key = Encoding.UTF8.GetString(Convert.FromBase64String(token));

                string[] parts = key.Split(new char[] { ':' });
                if (parts.Length == 3)
                {
                    string hash = parts[0];
                    string email = parts[1];
                    long ticks = long.Parse(parts[2]);
                    DateTime timeStamp = new DateTime(ticks);

                    bool expired = Math.Abs((DateTime.UtcNow - timeStamp).TotalMinutes) > _expirationMinutes;
                    if (expired == false)
                    {
                        if(user.Email==email)
                        {

                            string computedToken = GenerateEmailToken(email, ticks);

                            result = (token == computedToken);
                        }
                    }
                }
            }
            catch
            {
                result = false;
            }

            return result;
        }

        [HttpDelete]
        public void Delete(User user)
        {
            this.userContext.Remove(user);
            this.userContext.SaveChanges();
        }
    }
}