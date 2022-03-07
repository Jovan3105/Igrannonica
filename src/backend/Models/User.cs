using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class User
    {
        [Key]
        public int Id {  get; set; }
        public string Username { get; set; } 
        public string Email { get; set; }
        public string PasswordHashed {  get; set; }
        

    }
}
