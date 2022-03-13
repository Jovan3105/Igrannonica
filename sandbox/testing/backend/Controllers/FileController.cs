using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        [HttpPost]
        public IActionResult fileUpload(IFormFile file)
        {
            if(file.FileName.EndsWith(".csv"))
            {
                StreamReader sr = new StreamReader(file.OpenReadStream());
                string[] headers = sr.ReadLine().Split(",");
                foreach(string header in headers)
                {
                    Console.Write(header + "\t");
                }
                Console.Write("\n\r");
                while(!sr.EndOfStream)
                {
                    string[] rows = sr.ReadLine().Split(",");
                    foreach(var row in rows)
                    {
                        Console.Write(row + "\t");
                    }
                    Console.Write("\n\r");
                }
                return Ok(headers);
            }
            return Ok(file);
        }
    }
}
