using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers
{


    [Route("api/[controller]")]
    public class CardController:ControllerBase
    {
        private readonly DataContext dataContext;

        public CardController(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }


        [HttpGet]
        [Route("getCards")]
        public async Task<ActionResult<List<Card>>> getCards(){

            return Ok(await this.dataContext.kartice.ToListAsync());
        }


        [HttpDelete]
        [Route("deleteCard")]
        public async Task<ActionResult<List<Card>>> deleteCard(int id){

            var kartica=await this.dataContext.kartice.FindAsync(id);
            if(kartica==null){
                return BadRequest("not find");
            }
            else{
                this.dataContext.kartice.Remove(kartica);
                await this.dataContext.SaveChangesAsync();
                    return Ok("Its okey");
            }



            
        }

        [HttpPost]
        [Route("insertCard")]
        public async Task<ActionResult<List<Card>>> insertCard(Card c){
                this.dataContext.kartice.Add(c);
                await this.dataContext.SaveChangesAsync();

            return Ok(await this.dataContext.kartice.ToListAsync());
        }

    }
}