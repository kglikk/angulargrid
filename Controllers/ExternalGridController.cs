using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using angulargrid.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace angulargrid.Controllers
{
    //[Produces("application/json")]
    [Route("api/[controller]")]
    
    public class ExternalGridController : Controller
    {
        private readonly DataContext _context;

        public ExternalGridController(DataContext context)
        {
            _context = context;
        }

        // GET: api/values
        [HttpGet("[action]")]
        //[Authorize]
              
        public IEnumerable<ExternalGrid> Get()
        {
            return _context.ExternalGrids;
        }

        // POST: api/StudentMastersAPI  
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ExternalGrid extgrid)  
        {  
            if (!ModelState.IsValid)  
            {  
                return BadRequest(ModelState);  
            }  
  
            _context.ExternalGrids.Add(extgrid);  
            try  
            {  
                await _context.SaveChangesAsync();  
            }  
            catch (DbUpdateException)  
            {  
                if (ExtGridExists(extgrid.ID))  
                {  
                    return new StatusCodeResult(StatusCodes.Status409Conflict);  
                }  
                else  
                {  
                    throw;  
                }  
            }  
            return CreatedAtAction("Get", new { id = extgrid.ID }, extgrid);  
        }

        private bool ExtGridExists(int id)  
        {  
            return _context.ExternalGrids.Any(e => e.ID == id);  
        }

        // PUT: api/ExternalGridController/5  
        [HttpPut("{id}")]
        public async Task<IActionResult> Put([FromRoute] int id, [FromBody] ExternalGrid extgrid)  
        {  
            if (!ModelState.IsValid)  
            {  
                return BadRequest(ModelState);  
            }  
  
            if (id != extgrid.ID)  
            {  
                return BadRequest();  
            }  
  
            _context.Entry(extgrid).State = EntityState.Modified;  
  
            try  
            {  
                await _context.SaveChangesAsync();  
            }  
            catch (DbUpdateConcurrencyException)  
            {  
                if (!ExtGridExists(id))  
                {  
                    return NotFound();  
                }  
                else  
                {  
                    throw;  
                }  
            }  
  
            return NoContent();  
        }

        // DELETE: api/ExternalGridController/5  
        [HttpDelete("{id}")]  
        public async Task<IActionResult> Delete([FromRoute] int id)  
        {  
            if (!ModelState.IsValid)  
            {  
                return BadRequest(ModelState);  
            }  
  
            ExternalGrid extgrid = await _context.ExternalGrids.SingleOrDefaultAsync(m => m.ID == id);  
            if (extgrid == null)  
            {  
                return NotFound();  
            }  
  
            _context.ExternalGrids.Remove(extgrid);  
            await _context.SaveChangesAsync();
              
            return Ok(extgrid);  
        } 
    }
}
