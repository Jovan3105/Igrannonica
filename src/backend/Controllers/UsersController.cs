using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{   
  
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserContext userContext;
        private readonly IConfiguration _configuration;
        private readonly IHubContext<SocketHub> _hubContext;

        public UsersController(UserContext userContext, IConfiguration configuration,IHubContext<SocketHub> hubContext)
        {
            this.userContext = userContext;
            _configuration = configuration;
            _hubContext = hubContext;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Object>> getUserByID(int id)
        {
            var user = await userContext.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }
            //Byte[] b = System.IO.File.ReadAllBytes("F:\\Desktop\\regresis\\sandbox\\resource\\"+user.Username+".png");

            var p = new
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                image = "assets\\resources\\" + user.Username + ".png" /* = File(b, "image/png")*/
            };
            return p;
        }
        [HttpGet]
        public async Task<ActionResult<List<User>>> getUsers()
        {
            return Ok(await this.userContext.Users.ToListAsync());
        }
     

    }
}
