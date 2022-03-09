namespace backend
{
    public class Response
    {
        public bool Success { get; set; } = true;

        public List<Error> Errors { get => errors; }

        public List<Error> errors = new List<Error>();

    }
}
