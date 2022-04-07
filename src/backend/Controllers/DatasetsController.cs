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
            _datasetFolderPath = @"../../files/"; // TODO proveriti da li postoji bolji nacin, npr. koriscenjem klase Path
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

        [HttpPost]
        [Route("")]
        public async Task<ActionResult<List<Dataset>>> addDataset([FromForm]datasetDto dto) {
            Dataset dataset = dto.dataSet;
            IFormFile file = dto.fajl;

            if (file.Length == 0)
            {
                return BadRequest("empty file");
            }

            string fileName = file.FileName;
            await using var stream = file.OpenReadStream();
             
            using var reader = new StreamReader(stream);
            var text = await reader.ReadToEndAsync();

            Console.WriteLine(text);
            Console.WriteLine(fileName);

            // Sacuvaj fajl //

            string path = CreatePathToDataRoot(dataset.UserID, dataset.Id, fileName);
            using StreamWriter f = new(path);
            await f.WriteAsync(text);

            dataset.Path = path;
            dataset.FileName = fileName;
            this.datasetContext.Datasets.Add(dataset);
            await this.datasetContext.SaveChangesAsync();

            return Ok(dataset.Id);
        }

        [HttpGet]
        [Route("{id:int}/data")]
        public async Task<ActionResult<string>> fetchData(int id, int page)
        {
            int rowsPerPage = 20;
            string delimiter = ",";
            var dataset = datasetContext.Datasets.FirstOrDefault(x => x.Id == id);
            string path = dataset.Path;
            var csv = new List<string[]>();
            var lines = System.IO.File.ReadAllLines(path);

            foreach (string line in lines)
                csv.Add(line.Split(delimiter));

            var header = lines[0].Split(delimiter);
            
            if (page == 0)
            {
                var listaRecnika = new List<Dictionary<string, string>>();
                for (int i = 1; i < lines.Length; i++)
                {
                    var objResult = new Dictionary<string, string>();

                    for (int j = 0; j < header.Length; j++)
                        objResult.Add(header[j], csv[i][j]);

                    listaRecnika.Add(objResult);
                }

                return Ok(JsonConvert.SerializeObject(listaRecnika));
            }
            else
            {
                if ((page - 1) * rowsPerPage > lines.Length)
                {
                    return BadRequest(page + " " + lines.Length);
                }

                int upper = 0;
                if((page - 1) * rowsPerPage > lines.Length)
                    upper = lines.Length;
                else
                    upper = (page) * rowsPerPage;
               
                var listaRecnika = new List<Dictionary<string, string>>();
                for (int i = (page - 1) * rowsPerPage; i < upper; i++)
                {
                    // Console.WriteLine(i);
                    var objResult = new Dictionary<string, string>();

                    for (int j = 0; j < header.Length; j++)
                        objResult.Add(header[j], csv[i][j]);

                    listaRecnika.Add(objResult);
                }

                return Ok(JsonConvert.SerializeObject(listaRecnika));
            }
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

            string path = CreatePathToDataRoot(dataset.UserID, dataset.Id, file.FileName);
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
            multipartFormContent.Add(fileStreamContent, name: "dataset_source", fileName: Path.GetFileName(dataset.Path));

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
            multipartFormContent.Add(fileStreamContent, name: "dataset_source", fileName: Path.GetFileName(dataset.Path));

            var url = _microserviceBaseURL + "/dataset/corr_matrix";
            var response = await _client.PostAsync(url, multipartFormContent);
            var responseString = await response.Content.ReadAsStringAsync();

            return Ok(responseString);
            // Dataset dataset = await this.datasetContext.Datasets.FindAsync(id);

            // var microserviceURL = _microserviceBaseURL + "/dataset/corr_matrix";

            // var dataSource = "http://localhost:7220/api/Datasets/getCsv/?filename=";
            // dataSource += dataset.FileName;

            // // TODO promeniti hardcoded adresu; hardcode-ovano je jer rezultat getCsv API-a ne moze da se parsira ispravno na ML
            // var response = await _client.GetAsync(string.Format(microserviceURL + "?dataset_source={0}", "https://people.sc.fsu.edu/~jburkardt/data/csv/hurricanes.csv"));
            // var responseString = await response.Content.ReadAsStringAsync();

            // return Ok(responseString);
        }

        [HttpGet]
        [Route("{dataset_id}/getData")]
        public async Task<ActionResult<string>> fetchJsonData(int dataset_id)
        {
            var dataset = await this.datasetContext.Datasets.FindAsync(dataset_id);
            using StreamReader r = new StreamReader(dataset.Path);
            string data = r.ReadToEnd();

            return Ok(data);
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

        [HttpGet]
        [Route("getCsv")]
        public async Task<ActionResult<string>> fetchCsv(string fileName)
        {
            var dataset = datasetContext.Datasets.FirstOrDefault(x => x.FileName == fileName);
            string response = string.Empty;

            string path = dataset.Path;
            var lines = System.IO.File.ReadAllLines(path);

            foreach(string line in lines)
            {
                response += line + "\n\r";
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("upload")]
        public async Task<ActionResult<string>> sendToMl(IFormFile file)
        {
            // Dataset dataset = await this.datasetContext.Datasets.FindAsync(id);

            var fileStreamContent = new StreamContent(file.OpenReadStream());
            fileStreamContent.Headers.ContentType = new MediaTypeHeaderValue("text/csv");

            var multipartFormContent = new MultipartFormDataContent();
            multipartFormContent.Add(fileStreamContent, name: "dataset_source", fileName: Path.GetFileName(file.FileName));

            var url =_microserviceBaseURL + "/data-preparation/parse-file";
            var response = await _client.PostAsync(url, multipartFormContent);
            var responseString = await response.Content.ReadAsStringAsync();

            return Ok(responseString);
        }

        /*[HttpPatch]
        [Route("")]
        public async Task<ActionResult<string>> patch(List<int> rows, List<int> cols, Dataset data)
        {
            HandleRowsAndCols(rows, cols, data);
            return Ok("ok");
        }

        public async void  HandleRowsAndCols(List<int> rows, List<int> cols, Dataset data)
        {
            //brisanje redova
            string[] lines = System.IO.File.ReadAllLines(data.Path);


            using StreamWriter file = new(data.Path);

            int num = 0;
            foreach (string line in lines)
            {
                if (!rows.Contains(num))
                {
                    await file.WriteLineAsync(line);
                }
                else
                {
                    rows.Remove(num);
                }
                num++;
            }

            //brisanje kolona

        }*/


        [HttpPatch]
        [Route("{dataset_id}/data/cell")]
        public async Task<ActionResult<string>> patchModifyCell(int dataset_id, List<Cell> values)
        {
            string delimiter = ",";
            Dataset data = datasetContext.Datasets.FirstOrDefault(x => x.Id == dataset_id);
            string[] lines = System.IO.File.ReadAllLines(data.Path);

            foreach (Cell value in values)
            {
                var line = lines[value.Row].Split(delimiter);
                line[value.Col] = value.Value;
                lines[value.Row] = string.Join(delimiter, line);
            }

            using (StreamWriter file = new(data.Path))
            {
                foreach (string line in lines)
                {
                    await file.WriteLineAsync(line);
                }
            }

            return Ok("ok");
        }

        [HttpPost]
        [Route("/begin_training")]
        public async Task<ActionResult<string>> beginTraining(int epoches, string algorithm)
        {
            var data = new
            {
                epoches = epoches,
                algorithm = algorithm
            };

            var url = _microserviceBaseURL + "/training";
            var httpWebRequest = (HttpWebRequest)WebRequest.Create(url);

            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";

            using var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream());
            streamWriter.Write(data);
            var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using var streamReader = new StreamReader(httpResponse.GetResponseStream());
            
            var result = streamReader.ReadToEnd();
            
            return Ok(result);

        }

        private string CreatePathToDataRoot(int userID, int datasetID, string filename)
        {
            var filePath = string.Format(_datasetFolderPath);

            // Proveri da li postoji folder u kome se cuvaju podaci
            if (!Directory.Exists(filePath))
            {
                Directory.CreateDirectory(filePath);
            }

            filePath += userID.ToString();

            // Proveri da li postoji folder korisnika (naziv foldera njegov id)
            if (!Directory.Exists(filePath))
            {
                Directory.CreateDirectory(filePath);
            }

            filePath = filePath + "/" + datasetID + "/";//Path.Combine(filePath, datasetID.ToString()); 

            // Proveri da li postoji folder za dati dataset (id)
            if (!Directory.Exists(filePath))
            {
                Directory.CreateDirectory(filePath);
            }

            return Path.Combine(filePath, filename);
        }
    }
}
