using Microsoft.AspNetCore.Mvc;
using cems_api.Models;

namespace cems_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaintenanceLogController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok(new List<MaintenanceLog>());

        [HttpGet("{id}")]
        public IActionResult GetById(string id) => Ok(new MaintenanceLog());

        [HttpPost]
        public IActionResult Create([FromBody] MaintenanceLog log) => CreatedAtAction(nameof(GetById), new { id = log.MaintenanceLogId }, log);

        [HttpPut("{id}")]
        public IActionResult Update(string id, [FromBody] MaintenanceLog log) => NoContent();

        [HttpDelete("{id}")]
        public IActionResult Delete(string id) => NoContent();
    }
}
