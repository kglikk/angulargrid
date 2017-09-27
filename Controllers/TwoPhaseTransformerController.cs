using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using angulargrid.Models;

namespace angulargrid.Controllers
{
    [Produces("application/json")]
    [Route("api/TwoPhaseTransformerController")]
    public class TwoPhaseTransformerController : Controller
    {
        private readonly DataContext _context;

        public TwoPhaseTransformerController(DataContext context)
        {
            _context = context;
        }

        // GET: api/values
        [HttpGet]
        [Route("TwoPhaseTransformer")]
        public IEnumerable<TwoPhaseTransformer> Get()
        {
            return _context.TwoPhaseTransformers;
        }
    }
}