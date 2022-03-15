using backend.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Web;
using Newtonsoft.Json;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatasetController : ControllerBase
    {


        private readonly IConfiguration _configuration;
        private readonly DatasetContext datasetContext;
        public DatasetController(DatasetContext datasetContext, IConfiguration configuration)
        {
            this.datasetContext = datasetContext;
            _configuration = configuration;
        }

        [HttpGet]
        [Route("getAll")]
        public async Task<ActionResult<List<Dataset>>> getAll(){

            return Ok(await this.datasetContext.Datasets.ToListAsync());
        }
        [HttpGet]
        [Route("getPublic")]
        public async Task<ActionResult<List<Dataset>>> getPublic()
        {
            var lista = await this.datasetContext.Datasets.ToListAsync();

            return Ok(lista.Where(x=>x.Public==true));
        }
        [HttpPost]
        [Route("insert")]
        public async Task<ActionResult<List<Dataset>>> insert(Dataset dataset){

            this.datasetContext.Datasets.Add(dataset);
            await this.datasetContext.SaveChangesAsync();

            return Ok(await this.datasetContext.Datasets.ToListAsync());
        
        
        
        }
        [HttpGet]
        [Route("getData")]
        public async Task<ActionResult<string>> getData(int id)
        {
            var dataset= datasetContext.Datasets.FirstOrDefault(x=>x.Id==id);
            string path = dataset.Path;
            var csv = new List<string[]>(); 
            var lines = System.IO.File.ReadAllLines(@"C:\Users\Pivan\Desktop\ljudi.csv");
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
        [HttpGet]
        [Route("getData")]
        public async Task<ActionResult<string>> getDataPage(int id,int page)
        {
            
            var dataset = datasetContext.Datasets.FirstOrDefault(x => x.Id == id);
            string path = dataset.Path;
            var csv = new List<string[]>();
            var lines = System.IO.File.ReadAllLines(@"C:\Users\Pivan\Desktop\ljudi.csv");
            foreach (string line in lines)
                csv.Add(line.Split(','));
            var header = lines[0].Split(',');
            if ((page-1) * 20 < lines.Length)
            {
                return BadRequest("not that many pages");
            }

            var listaRecnika = new List<Dictionary<string, string>>();
            for (int i = (page-1)*20; i < lines.Length; i++)
            {
                var objResult = new Dictionary<string, string>();
                for (int j = 0; j < header.Length; j++)
                    objResult.Add(header[j], csv[i][j]);

                listaRecnika.Add(objResult);
            }

            return Ok(JsonConvert.SerializeObject(listaRecnika));




        }



    }
}
