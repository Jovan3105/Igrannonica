namespace backend
{
    public class Error
    {
        public Error(string code, string message)
        {
            Code = code;
            Message = message;
        }

        private String Code { get; set; }
        private String Message { get; set; }
    }
}
