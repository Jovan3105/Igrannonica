namespace backend
{
    public class Error
    {
        public Error(string code, string message)
        {
            Code = code;
            Message = message;
        }

        public String Code { get; set; }
        public String Message { get; set; }
    }
}
