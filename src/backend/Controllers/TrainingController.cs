using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Net.Http.Headers;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrainingController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        
        private static readonly HttpClient client = new HttpClient();

        public TrainingController( IConfiguration configuration)
        {
          
            _configuration = configuration;
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
    }
}
