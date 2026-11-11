using Microsoft.AspNetCore.Mvc;
using cems_api.Models;

namespace cems_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InspectionController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok(new List<Inspection>());

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok(new Inspection());

        [HttpPost]
        public IActionResult Create([FromBody] Inspection inspection) => CreatedAtAction(nameof(GetById), new { id = inspection.InspectionId }, inspection);

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Inspection inspection) => NoContent();

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => NoContent();
    }
}
