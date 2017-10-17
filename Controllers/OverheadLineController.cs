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

namespace angulargrid.Controllers
{
    
    [Route("api/[controller]")]
    public class OverheadLineController : Controller
    {
        private readonly DataContext _context;

        public OverheadLineController(DataContext context)
        {
            _context = context;
        }

        // GET: api/values
        [HttpGet("[action]")]
        public IEnumerable<OverheadLine> Get()
        {
            return _context.OverheadLines;
        } 

       
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] OverheadLine overheadLine)  
        {  
            if (!ModelState.IsValid)  
            {  
                return BadRequest(ModelState);  
            }  
  
            _context.OverheadLines.Add(overheadLine);  
            try  
            {  
                await _context.SaveChangesAsync();  
            }  
            catch (DbUpdateException)  
            {  
                if (OvHeadExists(overheadLine.ID))  
                {  
                    return new StatusCodeResult(StatusCodes.Status409Conflict);  
                }  
                else  
                {  
                    throw;  
                }  
            }  
            return CreatedAtAction("Get", new { id = overheadLine.ID }, overheadLine);  
        }

        private bool OvHeadExists(int id)  
        {  
            return _context.OverheadLines.Any(e => e.ID == id);  
        }

        // PUT: api/OverheadLineController/5  
        [HttpPut("{id}")]
        public async Task<IActionResult> Put([FromRoute] int id, [FromBody] OverheadLine overheadLine)  
        {  
            if (!ModelState.IsValid)  
            {  
                return BadRequest(ModelState);  
            }  
  
            if (id != overheadLine.ID)  
            {  
                return BadRequest();  
            }  
  
            _context.Entry(overheadLine).State = EntityState.Modified;  
  
            try  
            {  
                await _context.SaveChangesAsync();  
            }  
            catch (DbUpdateConcurrencyException)  
            {  
                if (!OvHeadExists(id))  
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
  
            OverheadLine overheadLine = await _context.OverheadLines.SingleOrDefaultAsync(m => m.ID == id);  
            if (overheadLine == null)  
            { 
                return NotFound();  
            }  
  
            _context.OverheadLines.Remove(overheadLine);  
            await _context.SaveChangesAsync();
              
            return Ok(overheadLine);  
        }         






    }

}