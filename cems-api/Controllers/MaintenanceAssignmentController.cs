using Microsoft.AspNetCore.Mvc;
using cems_api.Models;

namespace cems_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaintenanceAssignmentController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok(new List<MaintenanceAssignment>());

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok(new MaintenanceAssignment());

        [HttpPost]
        public IActionResult Create([FromBody] MaintenanceAssignment assignment) => CreatedAtAction(nameof(GetById), new { id = assignment.AssignmentId }, assignment);

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] MaintenanceAssignment assignment) => NoContent();

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => NoContent();
    }
}
