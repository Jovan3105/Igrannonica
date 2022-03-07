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
        public AuthController()
        {
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register() {

            return Ok("poruke okej je");
        }
        private void CreatePasswordHash(string password,out byte[] passwordHash,out byte[] passwordSalt)
        {
            using(var hmac =  new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash= hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

            }
        }                   

        
    }
}