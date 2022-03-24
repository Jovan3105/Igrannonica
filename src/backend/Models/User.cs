using Microsoft.AspNet.Identity.EntityFramework;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class User { 
        [Key]
        public int Id {  get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string PasswordHashed {  get; set; }
        public string RefreshToken { get; set; }  = string.Empty;
        public DateTime RefreshTokenExpires { get; set; }
        public bool VerifiedEmail { get; set; }

    }
}
