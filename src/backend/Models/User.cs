using Microsoft.AspNet.Identity.EntityFramework;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class User { 
        [Key]
        public int Id {  get; set; }
        public string Username { get; set; } 
        public string Email { get; set; }
        public string PasswordHashed {  get; set; }
        public string RefreshToken { get; set; }  = string.Empty;
        public DateTime RefreshTokenExpires { get; set; }


    }
}
