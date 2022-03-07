namespace backend.Models
{
    public class User
    {
        public int Id {  get; set; }
        public string Username { get; set; } = String.Empty;
        public string PasswordHashed {  get; set; }   

    }
}
