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
using Microsoft.AspNetCore.Authorization;

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
                    return Ok(new
                    {
                        success = true,
                        data = new
                        {
                            token = new JwtSecurityTokenHandler().WriteToken(token),
                            refreshToken = refreshToken

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
                        List<Claim> claims = new List<Claim>
                        {
                            new Claim(ClaimTypes.Name,user.Username),
                            new Claim(ClaimTypes.Email,user.Email),
                            new Claim(ClaimTypes.SerialNumber,user.Id.ToString()),
                            new Claim("message","Logging in...")
                        };

                        var refreshToken = GenerateRefreshToken();
                        JwtSecurityToken token = CreateToken(claims);
                        user.RefreshToken = refreshToken;
                        _ = int.TryParse(_configuration["JWT:RefreshTokenValidityInDays"], out int refreshTokenValidityInDays);
                        user.RefreshTokenExpires = DateTime.Now.AddDays(refreshTokenValidityInDays);

                        userContext.Entry(user).State = EntityState.Modified;
                        await userContext.SaveChangesAsync();
                        return Ok(new
                        {
                            success = true,
                            data = new
                            {
                                token = new JwtSecurityTokenHandler().WriteToken(token),
                                refreshToken= refreshToken
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
        
   
        private string CreateJWT(User user)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["AppSettings:Token"]));
            _ = int.TryParse(_configuration["JWT:TokenValidityInMinutes"], out int tokenValidityInMinutes);

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddMinutes(tokenValidityInMinutes),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

            return token;
        }
        [Authorize]
        [HttpPost]
        [Route("refresh-token")]
        public async Task<IActionResult> RefreshToken(TokenModel tokenModel)
        {
            if (tokenModel is null)
            {
                return BadRequest("Invalid client request");
            }

            string? accessToken = tokenModel.AccessToken;
            string? refreshToken = tokenModel.RefreshToken;

            var principal = GetPrincipalFromExpiredToken(accessToken);
            if (principal == null)
            {
                return BadRequest("Invalid access token or refresh token");
            }


            string username = principal.Identity.Name;
            


            var user = this.userContext.Users.FirstOrDefault(x=>x.Username==username);

            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpires <= DateTime.Now)
            {
                return BadRequest("Invalid access token or refresh token");
            }

            var newAccessToken = CreateToken(principal.Claims.ToList());
            var newRefreshToken = GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;



            userContext.Entry(user).State = EntityState.Modified;
            await userContext.SaveChangesAsync();


            return new ObjectResult(new
            {
                accessToken = new JwtSecurityTokenHandler().WriteToken(newAccessToken),
                refreshToken = newRefreshToken
            });
        }
        private ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token)
        {
            Console.WriteLine("\n\n\n\n\n pozvano");
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"])),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;

        }
        private static string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
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