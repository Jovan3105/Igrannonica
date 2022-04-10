using backend.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Web;
using Newtonsoft.Json;
using System.IO;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using System.Net;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatasetsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DatasetContext datasetContext;
        private static string _datasetFolderPath;
        private static string _microserviceBaseURL;
        private static readonly HttpClient _client = new HttpClient();

        public DatasetsController(DatasetContext datasetContext, IConfiguration configuration)
        {
            this.datasetContext = datasetContext;
            _configuration = configuration;
            _microserviceBaseURL = _configuration["Addresses:Microservice"];
            _datasetFolderPath = _configuration["FileSystemRelativePaths:Datasets"];
        }

        [HttpGet]
        [Route("")]
        public async Task<ActionResult<List<Dataset>>> fetchAllDatasets(string? p)
        {
            List<Dataset> lista = new List<Dataset>();
            if (p == "1")
            {
                lista = await this.datasetContext.Datasets.ToListAsync();
                lista.Where(x => x.Public == true);
            }
            else
            {
                lista = await this.datasetContext.Datasets.ToListAsync();
            }

            return Ok(lista);
        }
        
        [HttpDelete]
        [Route("")]
        public async Task<ActionResult<string>> deleteDataset(int id)
        {
            var dataset = await this.datasetContext.Datasets.FindAsync(id);
            if (dataset== null)
            {
                return BadRequest("not find");
            }
            else
            {
                this.datasetContext.Datasets.Remove(dataset);
                // TODO dodati brisanje sa fajl sistema
                await this.datasetContext.SaveChangesAsync();
                return Ok("Its okey");
            }
        }

        [HttpPut]
        [Route("")]
        public async Task<ActionResult<string>> updateDataset(int id, Dataset data)
        {
            //var dataset = await this.datasetContext.Datasets.FindAsync(id); // TODO proveriti
            data.Id = id;
            datasetContext.Entry(data).State = EntityState.Modified;
            await datasetContext.SaveChangesAsync();

            return Ok("da");
        }

        [HttpPost]
        [Route("uploadWithLink")]
        public async Task<ActionResult<string>> uploadWithLink(String url)
        { // TODO dodati user id u request
            var microserviceURL = _microserviceBaseURL + "/data-preparation/parse";
            var response = await _client.GetAsync(string.Format(microserviceURL + "?dataset_source={0}", url));
            var responseString = await response.Content.ReadAsStringAsync();

            Dataset dataset = new Dataset();
            dataset.UserID = 0; // TODO privremeno
            dataset.Path = "temp"; // TODO privremeno

            this.datasetContext.Datasets.Add(dataset);
            await this.datasetContext.SaveChangesAsync();

            if(url[url.Length-1] == '/')
                url = url.Remove(url.Length - 1, 1);

            string fileName = Path.ChangeExtension(Path.GetFileName(url), ".json");
            
            // Sacuvaj fajl
            string path = CreatePathToDataRoot(dataset.UserID, dataset.Id, fileName);
            using StreamWriter f = new(path);
            await f.WriteAsync(responseString);

            dataset.Path = path;
            dataset.FileName = fileName;
            this.datasetContext.Datasets.Update(dataset);
            await this.datasetContext.SaveChangesAsync();

            return Ok(dataset.Id);
        }

        [HttpPost]
        [Route("uploadFile")]
        public async Task<ActionResult<List<Dataset>>> uploadFile(IFormFile file)
        { // TODO dodati user id u request
            if (file.Length == 0)
            {
                return BadRequest("empty file");
            }

            // Formiranje i slanje zahteva za parsiranje //

            using var _x = file.OpenReadStream();

            var fileStreamContent = new StreamContent(_x);
            fileStreamContent.Headers.ContentType = new MediaTypeHeaderValue("text/csv");

            var multipartFormContent = new MultipartFormDataContent();
            multipartFormContent.Add(fileStreamContent, name: "dataset_source", fileName: file.FileName);

            var url = _microserviceBaseURL + "/data-preparation/parse-file";
            var response = await _client.PostAsync(url, multipartFormContent);

            var responseString = await response.Content.ReadAsStringAsync();

            // Sacuvaj parsirane podatke u bazu i na fs //

            Dataset dataset = new Dataset();
            dataset.UserID = 0;
            dataset.Path = "temp";

            this.datasetContext.Datasets.Add(dataset);
            await this.datasetContext.SaveChangesAsync();

            string fileName = Path.ChangeExtension(file.FileName, ".json");

            string path = CreatePathToDataRoot(dataset.UserID, dataset.Id, fileName);
            using StreamWriter f = new(path);
            await f.WriteAsync(responseString);

            dataset.Path = path;
            dataset.FileName = fileName;
            this.datasetContext.Datasets.Update(dataset);
            await this.datasetContext.SaveChangesAsync();

            return Ok(dataset.Id);
        }

        [HttpGet]
        [Route("{dataset_id}/stat_indicators")]
        public async Task<ActionResult<string>> fetchStatisticalIndicators(int dataset_id)
        {
            Dataset dataset = await this.datasetContext.Datasets.FindAsync(dataset_id);

            using var _x = System.IO.File.OpenRead(dataset.Path);

            var fileStreamContent = new StreamContent(_x);
            fileStreamContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            var multipartFormContent = new MultipartFormDataContent();
            multipartFormContent.Add(fileStreamContent, name: "stored_dataset", fileName: Path.GetFileName(dataset.Path));

            var url = _microserviceBaseURL + "/dataset/stat_indicators";
            var response = await _client.PostAsync(url, multipartFormContent);
            var responseString = await response.Content.ReadAsStringAsync();

            return Ok(responseString);
        }

        [HttpGet]
        [Route("{dataset_id}/corr_matrix")]
        public async Task<ActionResult<string>> getCorrMatrix(int dataset_id)
        {
            Dataset dataset = await this.datasetContext.Datasets.FindAsync(dataset_id);

            using var _x = System.IO.File.OpenRead(dataset.Path);

            var fileStreamContent = new StreamContent(_x);
            fileStreamContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            var multipartFormContent = new MultipartFormDataContent();
            multipartFormContent.Add(fileStreamContent, name: "stored_dataset", fileName: Path.GetFileName(dataset.Path));

            var url = _microserviceBaseURL + "/dataset/corr_matrix";
            var response = await _client.PostAsync(url, multipartFormContent);
            var responseString = await response.Content.ReadAsStringAsync();

            return Ok(responseString);
        }

        [HttpGet]
        [Route("{datasetId:int}/Data")]
        public async Task<ActionResult<string>> fetchDatasetFile(int datasetId, int userId = 0) // TODO razmotriti resenje sa userId-om u buducnosti
        { // TODO paginacija
            var dataset = datasetContext.Datasets.FirstOrDefault(x => x.Id == datasetId);

            if (dataset == null)
                return BadRequest(new { Message = "No dataset with this id found" });

            string datasetsVirtPath = _configuration["VirtualFolderPaths:Datasets"];
            string backendURL = _configuration["Addresses:Backend"];
            
            return LocalRedirect($"~/{datasetsVirtPath}/{userId}/{datasetId}/{dataset.FileName}");
        }

        [HttpPost]
        [Route("modifyData")]
        public async Task<ActionResult<Object>> modifyData([FromBody]ModifiedData data)
        {
            var dataset = await this.datasetContext.Datasets.FindAsync(data.Id);

            if (dataset == null)
            {
                return BadRequest(new { Message = "No dataset with this id" });
            }
            else
            {
                StreamReader r = new StreamReader(dataset.Path);
                string dataFromPath = r.ReadToEnd();
                r.Close();
             
                var microserviceURL = _microserviceBaseURL + "/data-preparation/modify";

                var response = await _client.PutAsJsonAsync(microserviceURL+ "?path=" + dataset.Path, data);

                var responseString = await response.Content.ReadAsStringAsync();

                if (responseString == "error")
                {
                    return BadRequest(new { Message = "Error on microservice" });
                }
                else 
                {
                    StreamWriter f = new(dataset.Path);
                    f.Write(responseString);
                    f.Close();
                }

                return Ok(new { Message = "OK" } );
            }

        }

        // TODO premestiti logiku za kreiranje root foldera dataset-ova prilikom pokretanja aplikacije
        private string CreatePathToDataRoot(int userID, int datasetID, string filename)
        {
            var rootDirPath = $"{_datasetFolderPath}/{userID}/{datasetID}";

            Directory.CreateDirectory(rootDirPath);

            rootDirPath = rootDirPath.Replace(@"\", "/");

            return $"{rootDirPath}/{filename}";
        }
    }
}
