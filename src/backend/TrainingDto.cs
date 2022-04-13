using backend.Models;

namespace backend
{
    public class TrainingDto
    {
        public int epochs { get; set; }
      
        public string activationFunction { get; set; }
        public string[] features { get; set; }
        public string[] labels { get; set; }
        public string optimizer { get; set; }
        public string lossFunction { get; set; }
        public float testDataRatio { get; set; }
        public float learningRate { get; set; }
        public string[] metrics { get; set; }
        public string problemType { get; set; }
        public string connIdClient { get; set; }=string.Empty;
        public Layer[] layers { get; set; } = Array.Empty<Layer>();
    }
}
