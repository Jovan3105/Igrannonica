
using System.IO;
using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using backend.Controllers;
using backend.Data;
using Newtonsoft.Json;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrainingController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DatasetContext datasetContext;
        private readonly IHttpContextAccessor _httpContext;

        private static readonly HttpClient client = new HttpClient();
        private static string _microserviceBaseURL;

        public TrainingController(DatasetContext datasetContext, IConfiguration configuration, IHttpContextAccessor httpContext)
        {
            this.datasetContext = datasetContext;
            _configuration = configuration;
            _microserviceBaseURL = _configuration["Addresses:Microservice"];
            _httpContext = httpContext;
        }


        [HttpPost]
        public async Task<ActionResult<string>> sendS(string algorithm, string epoha)
        {
            var url = _configuration["Addresses:Microservice"] + "/training/start";

            var multipartFormContent = new MultipartFormDataContent();

            StringContent alg = new StringContent(algorithm);
            multipartFormContent.Add(alg, name: "algorithm");

            StringContent epo = new StringContent(epoha);
            multipartFormContent.Add(epo, name: "epoha");

            var response = await client.PostAsync(url, multipartFormContent);

            var responseString = await response.Content.ReadAsStringAsync();
            return Ok(responseString);
        }

        [Authorize]
        [HttpPost]
        [Route("begin_training")]
        public async Task<ActionResult<string>> beginTraining(TrainingDto trainingDto)
        {
           // var userID = 0;  // TODO user id je harcoded dok se ne sredi problem sa njim
            var userID = Convert.ToInt32( _httpContext.HttpContext.User.Claims.First(i => i.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/serialnumber").Value);

            var dataset = await this.datasetContext.Datasets.FindAsync(trainingDto.DatasetID);

            if (dataset == null)
                return BadRequest(new { Message = "No dataset with this id" });

            string datasetURL = DatasetsController.CreateDatasetURL(_configuration, userID, trainingDto.DatasetID, dataset.FileName);
        
           // Kreiraj zahtev //

            var url = _microserviceBaseURL + "/training";

            var requestData = new {
                client_conn_id  = trainingDto.ClientConnID,
                stored_dataset  = datasetURL,
                problem_type    = trainingDto.ProblemType,
                layers          = trainingDto.Layers,
                features        = trainingDto.Features,
                labels          = trainingDto.Labels,
                metrics         = trainingDto.Metrics,
                loss_function   = trainingDto.LossFunction,
                test_size       = trainingDto.TestDatasetSize,
                validation_size = trainingDto.ValidationDatasetSize,
                epochs          = trainingDto.Epochs,
                optimizer       = trainingDto.Optimizer,
                learning_rate   = trainingDto.LearningRate
            };

            // Procitaj response //

            if (client.Timeout == TimeSpan.FromSeconds(100))
            {
                Console.WriteLine("HTTP client: changed timeout from 100s to infinite");
                client.Timeout = Timeout.InfiniteTimeSpan;
            }

            var response = await client.PostAsJsonAsync(url, requestData);

            var responseString = await response.Content.ReadAsStringAsync();
            return Ok(responseString);

        }
    }
}
