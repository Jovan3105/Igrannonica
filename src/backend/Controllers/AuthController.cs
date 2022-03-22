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
            this.userContext.Users.Add(user);
            await this.userContext.SaveChangesAsync();



            string token = CreateJWT(user);

            //slanje verifikacionog mejla

            await resendEmail(user);

            return Ok(new
            {
                success = true,
            });
        }

        [HttpGet("checkMail")]
        public async Task<ActionResult<string>> checkMail(string email,string hash)
        {
            User user = this.userContext.Users.FirstOrDefault(user => user.Email == email && user.PasswordHashed==hash);
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
                // za sad se menja user dok ivan ne napravi skroz bazu
                user.Username = "prosaoCheck";
                this.userContext.Update(user);
                await this.userContext.SaveChangesAsync();
                string token = CreateJWT(user);
                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        token = token,
                    }
                }) ;
            }    
        }

        [HttpPost("resendEmail")]
        public async Task<ActionResult<string>> resendEmail(User user)
        {


            // treba naci bolje resenje umesto password hasha ali nek je ovako za sad

            string poruka = @"Hello, <b>" + user.Username + @"</b>.<br>
                                Please confirm your email <a href='https://localhost:7220/api/Auth/checkMail?email=" + user.Email + "&hash=" + user.PasswordHashed + @"'>here</a>.";

            await emailSender.SendEmailAsync(user.Email, "Confirm Account", poruka);

            return Ok(new
            {
                success = true,
            });
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
        
   
        private string CreateJWT(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name,user.Username),
                new Claim(ClaimTypes.Email,user.Email),
                new Claim(ClaimTypes.SerialNumber,user.Id.ToString()),
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
                return false; // suggested by @TK-421
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

    }
}