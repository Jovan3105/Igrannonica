using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Microsoft.AspNetCore.Http.Extensions;
using System.Security.Cryptography;

namespace backend.Controllers
{
    

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

         static User u = new User();
        
        public AuthController()
        {
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register() {

            return Ok("poruke okej je");
        }   



        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(userDto request)
        {
            //proveravanje da li postoji username



            //uporedjivanje sifre

            return Ok("ok");
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

        
    }
}