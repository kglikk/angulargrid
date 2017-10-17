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
    public class TwoPhaseTransformerController : Controller
    {
        private readonly DataContext _context;

        public TwoPhaseTransformerController(DataContext context)
        {
            _context = context;
        }

        // GET: api/values
       [HttpGet("[action]")]
        public IEnumerable<TwoPhaseTransformer> Get()
        {
            return _context.TwoPhaseTransformers;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] TwoPhaseTransformer twophasetransformer)  
        {  
            if (!ModelState.IsValid)  
            {  
                return BadRequest(ModelState);  
            }  
  
            _context.TwoPhaseTransformers.Add(twophasetransformer);  
            try  
            {  
                await _context.SaveChangesAsync();  
            }  
            catch (DbUpdateException)  
            {  
                if (TwoPhTransfExists(twophasetransformer.ID))  
                {  
                    return new StatusCodeResult(StatusCodes.Status409Conflict);  
                }  
                else  
                {  
                    throw;  
                }  
            }  
            return CreatedAtAction("Get", new { id = twophasetransformer.ID }, twophasetransformer);  
        }

        private bool TwoPhTransfExists(int id)  
        {  
            return _context.TwoPhaseTransformers.Any(e => e.ID == id);  
        }

        // PUT: api/OverheadLineController/5  
        [HttpPut("{id}")]
        public async Task<IActionResult> Put([FromRoute] int id, [FromBody] TwoPhaseTransformer twophasetransformer)  
        {  
            if (!ModelState.IsValid)  
            {  
                return BadRequest(ModelState);  
            }  
  
            if (id != twophasetransformer.ID)  
            {  
                return BadRequest();  
            }  
  
            _context.Entry(twophasetransformer).State = EntityState.Modified;  
  
            try  
            {  
                await _context.SaveChangesAsync();  
            }  
            catch (DbUpdateConcurrencyException)  
            {  
                if (!TwoPhTransfExists(id))  
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
  
            TwoPhaseTransformer twophasetransformer = await _context.TwoPhaseTransformers.SingleOrDefaultAsync(m => m.ID == id);  
            if (twophasetransformer == null)  
            { 
                return NotFound();  
            }  
  
            _context.TwoPhaseTransformers.Remove(twophasetransformer);  
            await _context.SaveChangesAsync();
              
            return Ok(twophasetransformer);  
        }         
    }
}