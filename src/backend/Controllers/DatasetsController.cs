﻿using backend.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Web;
using Newtonsoft.Json;
using System.IO;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatasetsController : ControllerBase
    {


        private readonly IConfiguration _configuration;
        private readonly DatasetContext datasetContext;
        public DatasetsController(DatasetContext datasetContext, IConfiguration configuration)
        {
            this.datasetContext = datasetContext;
            _configuration = configuration;
        }

       
        [HttpGet]
        [Route("{p}")]
        public async Task<ActionResult<List<Dataset>>> ges(string p)
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
                item.Path = "";
            }
            return Ok(lista);
        }
        [HttpPost]
        [Route("insert")]
        public async Task<ActionResult<List<Dataset>>> insert(Dataset dataset) {

            this.datasetContext.Datasets.Add(dataset);
            await this.datasetContext.SaveChangesAsync();

            return Ok(await this.datasetContext.Datasets.ToListAsync());



        }
        [HttpGet]
        [Route("data/{id}")]
        public async Task<ActionResult<string>> getData(int id,int page)
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
     
        [HttpPost]
        [Route("upload")]
        public async Task<ActionResult<string>> uploadData(IFormFile file)
        {
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

            var filePath = @"C:\Users\Pivan\Documents\";



            try
            {
                string path = Path.Combine(filePath, fileName);
                using StreamWriter f = new(path);
                await f.WriteAsync(text);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }

            return Ok("");
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
        public async Task<ActionResult<string>> putDataset(int id,Dataset data)
        {
            //var dataset = await this.datasetContext.Datasets.FindAsync(id);
            data.Id = id;
            datasetContext.Entry(data).State = EntityState.Modified;
             await  datasetContext.SaveChangesAsync();



            return Ok("da");
        }



    }
}