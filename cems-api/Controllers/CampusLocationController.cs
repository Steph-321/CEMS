using Microsoft.AspNetCore.Mvc;
using cems_api.Models;

namespace cems_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CampusLocationController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok(new List<CampusLocation>());

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok(new CampusLocation());

        [HttpPost]
        public IActionResult Create([FromBody] CampusLocation location) => CreatedAtAction(nameof(GetById), new { id = location.LocationId }, location);

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] CampusLocation location) => NoContent();

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => NoContent();
    }
}
