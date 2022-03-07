using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Microsoft.AspNetCore.Http.Extensions;
using System.Security.Cryptography;
using Microsoft.Extensions.Configuration;
using System.Data;
using Npgsql;

namespace backend.Controllers
{
    

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

         static User u = new User();
        Response res = new Response();

        private readonly IConfiguration _cofiguraion;
        
        public AuthController(IConfiguration configuration)
        {
            _cofiguraion = configuration;
        }

        [HttpPost("register")]
        public async Task<ActionResult<Response>> Register(userReg register) {

            res.Success = true;
            //proveravanje maila
            
            if (!IsValidEmail(register.Email))
            {
                res.Success = false;
                res.errors.Add(new Error("incorrect_email", "Incorrect email address!"));
            }
            //proveravanje hasha
            if(register.HashedPassword.Length!=60)
            {
                res.Success = false;
                res.errors.Add(new Error("incorrect_hash_length", "Hash length doesn't match!"));
            }
            if(res.Success==false)
            {
                return BadRequest(res);
            }
            //proveravanje sql injectiona

            

            return Ok(register);
        }   

        [HttpGet]
        public JsonResult Get()
        {
            string query = @"select * from users";
            List<User> users = new List<User>();
            string SqlDataSource = _cofiguraion.GetConnectionString("DefaultConnection");
            NpgsqlDataReader reader;
            using (NpgsqlConnection conn = new NpgsqlConnection(SqlDataSource))
            {
                conn.Open();
                using(NpgsqlCommand command=new NpgsqlCommand(query, conn))
                {
                    reader = command.ExecuteReader();
                    while (reader.Read())
                    {
                        u.Id=reader.GetInt32("id");
                        u.Username=reader.GetString("username");
                        u.Email=reader.GetString("email");
                        u.PasswordHashed=reader.GetString("passwordhashed");
                        users.Add(u);
                    }
                    reader.Close();
                    conn.Close();
                }
            }
            return new JsonResult(users);
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