using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using angulargrid.Models;

namespace angulargrid.Controllers
{
    [Produces("application/json")]
    [Route("api/OverheadLineController")]
    public class OverheadLineController : Controller
    {
        private readonly DataContext _context;

        public OverheadLineController(DataContext context)
        {
            _context = context;
        }

        // GET: api/values
        [HttpGet]
        [Route("OverheadLine")]
        public IEnumerable<OverheadLine> Get()
        {
            return _context.OverheadLines;
        }

        
    }
}