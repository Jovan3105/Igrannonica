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
        private static readonly HttpClient client = new HttpClient();

        public DatasetsController(DatasetContext datasetContext, IConfiguration configuration)
        {
            this.datasetContext = datasetContext;
            _configuration = configuration;
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

            foreach (var item in lista)
            {
               // item.Path = "";
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
                return BadRequest("bad");
            }
            string fileName = file.FileName;

            await using var stream = file.OpenReadStream();

             
            var reader = new StreamReader(stream);
            var text = await reader.ReadToEndAsync();

            Console.WriteLine(text);
            Console.WriteLine(fileName);

            //var filePath = "C:\\Users\\Pivan\\Documents\\";
            var filePath = string.Format(@"../../files/");
            if (!Directory.Exists(filePath))
            {
                Directory.CreateDirectory(filePath);
            }
            filePath += dto.dataSet.UserID;
            if (!Directory.Exists(filePath))
            {
                Directory.CreateDirectory(filePath);
            }

            filePath=filePath +"/"+dto.dataSet.Id+"/";
            if (!Directory.Exists(filePath))
            {
                Directory.CreateDirectory(filePath);
            }



            string path = Path.Combine(filePath, fileName);
            using StreamWriter f = new(path);
            await f.WriteAsync(text);

            dataset.Path=path;
            dataset.FileName=fileName;
            this.datasetContext.Datasets.Add(dataset);
            await this.datasetContext.SaveChangesAsync();

            return Ok(dataset.Id);
        }

        [HttpGet]
        [Route("{id:int}/data")]
        public async Task<ActionResult<string>> fetchData(int id, int page)
        {
            if (page == 0)
            {
                var dataset = datasetContext.Datasets.FirstOrDefault(x => x.Id == id);
                string path = dataset.Path;
                var csv = new List<string[]>();
                var lines = System.IO.File.ReadAllLines(path);
                foreach (string line in lines)
                    csv.Add(line.Split(','));
                var header = lines[0].Split(',');

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
                var dataset = datasetContext.Datasets.FirstOrDefault(x => x.Id == id);
                string path = dataset.Path;
                var csv = new List<string[]>();
                var lines = System.IO.File.ReadAllLines(path);
                foreach (string line in lines)
                    csv.Add(line.Split(','));
                var header = lines[0].Split(',');
                if ((page - 1) * 20 > lines.Length)
                {
                    return BadRequest(page+"dasdas"+lines.Length);
                }
                int upper = 0;
                if((page - 1) * 20> lines.Length)
                {
                    upper = lines.Length;
                }
                else
                {
                    upper = (page ) * 20;
                }
               
                // Console.WriteLine(page+"\n\n\n\n\n\n\n"+upper);
                var listaRecnika = new List<Dictionary<string, string>>();
                for (int i = (page - 1) * 20; i < upper; i++)
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
                await this.datasetContext.SaveChangesAsync();
                return Ok("Its okey");
            }
        }

        [HttpPut]
        [Route("")]
        public async Task<ActionResult<string>> updateDataset(int id, Dataset data)
        {
            //var dataset = await this.datasetContext.Datasets.FindAsync(id);
            data.Id = id;
            datasetContext.Entry(data).State = EntityState.Modified;
            await datasetContext.SaveChangesAsync();

            return Ok("da");
        }

        [HttpPost]
        [Route("uploadLink")]
        public async Task<ActionResult<string>> uploadLink(String url)
        {
            var microserviceURL = _configuration["Addresses:Microservice"] + "/data-preparation/parse";
           
            var client = new HttpClient();

            var res = await client.GetAsync(string.Format(microserviceURL + "?dataset_source={0}", url));

            var responseString = await res.Content.ReadAsStringAsync();

            Dataset dataset = new Dataset();
            dataset.UserID = 0;
            dataset.Path = "a";

            this.datasetContext.Datasets.Add(dataset);
            await this.datasetContext.SaveChangesAsync();

            string[] splitted = url.Split("/");

            string fileName = splitted[splitted.Length - 1].Substring(0,splitted[splitted.Length-1].Length-4)+".json";


            //var filePath = "C:\\Users\\Pivan\\Documents\\";
            var filePath = string.Format(@"../../files/");
            if (!Directory.Exists(filePath))
            {
                Directory.CreateDirectory(filePath);
            }
            filePath += dataset.UserID;
            if (!Directory.Exists(filePath))
            {
                Directory.CreateDirectory(filePath);
            }

            filePath = filePath + "/" + dataset.Id + "/";
            if (!Directory.Exists(filePath))
            {
                Directory.CreateDirectory(filePath);
            }



            string path = Path.Combine(filePath, fileName);
            using StreamWriter f = new(path);
            await f.WriteAsync(responseString);

            dataset.Path = path;
            dataset.FileName = fileName;
            this.datasetContext.Datasets.Update(dataset);
            await this.datasetContext.SaveChangesAsync();

            return Ok(dataset.Id);


            //res.Result.EnsureSuccessStatusCode();
            //return Ok(responseString);

            //var response = await client.PostAsync(microserviceURL, content);

            //var responseString = await response.Content.ReadAsStringAsync();
        }

        [HttpPost]
        [Route("uploadFile")]
        public async Task<ActionResult<List<Dataset>>> uploadFile(IFormFile file)
        {

            


            if (file.Length == 0)
            {
                return BadRequest("bad");
            }

            var url = _configuration["Addresses:Microservice"] + "/data-preparation/parse-file";

            HttpClient client = new HttpClient();

            var fileStreamContent = new StreamContent(file.OpenReadStream());
            fileStreamContent.Headers.ContentType = new MediaTypeHeaderValue("text/csv");

            var multipartFormContent = new MultipartFormDataContent();
            multipartFormContent.Add(fileStreamContent, name: "dataset_source", fileName: file.FileName);

            var response = await client.PostAsync(url, multipartFormContent);

            var responseString = await response.Content.ReadAsStringAsync();

            Dataset dataset = new Dataset();
            dataset.UserID = 0;
            dataset.Path = "a";

            this.datasetContext.Datasets.Add(dataset);
            await this.datasetContext.SaveChangesAsync();

            string fileName = Path.GetFileName(file.FileName).Substring(0, Path.GetFileName(file.FileName).Length-4)+".json";


            //var filePath = "C:\\Users\\Pivan\\Documents\\";
            var filePath = string.Format(@"../../files/");
            if (!Directory.Exists(filePath))
            {
                Directory.CreateDirectory(filePath);
            }
            filePath += dataset.UserID;
            if (!Directory.Exists(filePath))
            {
                Directory.CreateDirectory(filePath);
            }

            filePath = filePath + "/" + dataset.Id + "/";
            if (!Directory.Exists(filePath))
            {
                Directory.CreateDirectory(filePath);
            }



            string path = Path.Combine(filePath, fileName);
            using StreamWriter f = new(path);
            await f.WriteAsync(responseString);

            dataset.Path = path;
            dataset.FileName = fileName;
            this.datasetContext.Datasets.Update(dataset);
            await this.datasetContext.SaveChangesAsync();

            return Ok(dataset.Id);
        }

        [HttpPost]
        [Route("{id}/stat_indicators")]
        public async Task<ActionResult<string>> statIndicators(int id)
        {

            Dataset dataset = await this.datasetContext.Datasets.FindAsync(id);


            var url = _configuration["Addresses:Microservice"] + "/dataset/stat_indicators";

            HttpClient client = new HttpClient();

            var fileStreamContent = new StreamContent(System.IO.File.OpenRead(dataset.Path));
            fileStreamContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            var multipartFormContent = new MultipartFormDataContent();
            multipartFormContent.Add(fileStreamContent, name: "dataset_source", fileName: Path.GetFileName(dataset.Path));

            var response = await client.PostAsync(url, multipartFormContent);

            var responseString = await response.Content.ReadAsStringAsync();

            return Ok(responseString);

        }

        [HttpGet]
        [Route("getData")]
        public async Task<ActionResult<string>> getJsonData(int id)
        {
            var dataset = await this.datasetContext.Datasets.FindAsync(id);
            StreamReader r = new StreamReader(dataset.Path);
            string data = r.ReadToEnd();
            return Ok(data);
        }

        [HttpGet]
        [Route("getCsv")]
        public async Task<ActionResult<string>> getCsv(string fileName)
        {
            var dataset = datasetContext.Datasets.FirstOrDefault(x => x.FileName == fileName);
            string path = dataset.Path;
            var csv = new List<string[]>();
            string response = string.Empty;
            var lines = System.IO.File.ReadAllLines(path);
            foreach(string line in lines)
            {
                response += line+"\n\r";
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("upload")]
        public async Task<ActionResult<string>> sendToMl(IFormFile file)
        {
            // Dataset dataset = await this.datasetContext.Datasets.FindAsync(id);

            var url = _configuration["Addresses:Microservice"] + "/data-preparation/parse-file";

            HttpClient client = new HttpClient();

            var fileStreamContent = new StreamContent(file.OpenReadStream());
            fileStreamContent.Headers.ContentType = new MediaTypeHeaderValue("text/csv");

            var multipartFormContent = new MultipartFormDataContent();
            multipartFormContent.Add(fileStreamContent, name: "dataset_source", fileName: Path.GetFileName(file.FileName));

            var response = await client.PostAsync(url, multipartFormContent);

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

            Dataset data = datasetContext.Datasets.FirstOrDefault(x => x.Id == dataset_id);
            string[] lines = System.IO.File.ReadAllLines(data.Path);

            foreach (Cell value in values)
            {
                var line = lines[value.Row].Split(",");
                line[value.Col] = value.Value;
                lines[value.Row] = string.Join(",", line);
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
            var url = _configuration["Addresses:Microservice"] + "/training";
            var httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";
            var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream());
            streamWriter.Write(data);
            var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            var streamReader = new StreamReader(httpResponse.GetResponseStream());
            
            var result = streamReader.ReadToEnd();
            
            return Ok(result);

        }
    }
}
