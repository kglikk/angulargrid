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

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace angulargrid.Controllers
{
    [Produces("application/json")]
    [Route("api/ExternalGridController")]
    public class ExternalGridController : Controller
    {
        private readonly DataContext _context;

        public ExternalGridController(DataContext context)
        {
            _context = context;
        }

        // GET: api/values
        [HttpGet]
        [Route("GetExternalGrids")]
        public IEnumerable<ExternalGrid> Get()
        {
            return _context.ExternalGrids;
        }

        // POST: api/StudentMastersAPI  
        [HttpPost]
        public async Task<IActionResult> PostExtGrid([FromBody] ExternalGrid extgrid)  
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
  
            return CreatedAtAction("GetExternalGrids", new { id = extgrid.ID }, extgrid);  
        }
        private bool ExtGridExists(int id)  
        {  
            return _context.ExternalGrids.Any(e => e.ID == id);  
        }

        // PUT: api/ExternalGridController/5  
        [HttpPut("{id}")]
        public async Task<IActionResult> PutExtGrid([FromRoute] int id, [FromBody] ExternalGrid extgrid)  
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
        public async Task<IActionResult> DeleteExtGrid([FromRoute] int id)  
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



        // POST: ExternalGrids/Create
      
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        /* [HttpPost]
         [ValidateAntiForgeryToken]
         [Route("ExternalGridCreate")]
         public void Create([Bind("ID,Name,NodeNo,NodeType,VoltageAngle,VoltageSetpoint,ActivePower,ReactivePower")] ExternalGrid externalGrid)
         {
             if (ModelState.IsValid)
             {
                 _context.Add(externalGrid);
                 _context.SaveChangesAsync();                
             }            

         } */
    }
}
