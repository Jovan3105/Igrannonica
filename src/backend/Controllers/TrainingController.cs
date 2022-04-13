
using System.IO;
using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrainingController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        
        private static readonly HttpClient client = new HttpClient();
        private static string _microserviceBaseURL;

        public TrainingController( IConfiguration configuration)
        {
          
            _configuration = configuration;
            _microserviceBaseURL = _configuration["Addresses:Microservice"];
        }

        [HttpPost]
        public async Task<ActionResult<string>> sendS(string algorithm, string epoha)
        {
            var url = _configuration["Addresses:Microservice"] + "/training/start";

            HttpClient client = new HttpClient();


            var multipartFormContent = new MultipartFormDataContent();


            StringContent alg = new StringContent(algorithm);
            multipartFormContent.Add(alg, name: "algorithm");

            StringContent epo = new StringContent(epoha);
            multipartFormContent.Add(epo, name: "epoha");




            var response = await client.PostAsync(url, multipartFormContent);

            var responseString = await response.Content.ReadAsStringAsync();
            return Ok(responseString);
        }
        

        [HttpPost]
        [Route("begin_training/")]
        public async Task<ActionResult<string>> beginTraining(TrainingDto trainDto)
        {
           

            // Kreiraj zahtev //

            /*var url = _microserviceBaseURL + "/training";
            var httpWebRequest = (HttpWebRequest) WebRequest.Create(url);

            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";

            using var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream());
            streamWriter.Write(trainDto);

            // Procitaj response //

            var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using var streamReader = new StreamReader(httpResponse.GetResponseStream());
            
            var result = streamReader.ReadToEnd();
            
            return Ok(result);*/
            Console.WriteLine("\n\n\n\n\n\n\n\n\n------------------------\n"+trainDto.connIdClient);
            return ("ok");

        }
    }
}
