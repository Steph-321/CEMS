using Microsoft.AspNetCore.Mvc;
using cems_api.Models;

namespace cems_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaintenanceRequestController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok(new List<MaintenanceRequest>());

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok(new MaintenanceRequest());

        [HttpPost]
        public IActionResult Create([FromBody] MaintenanceRequest request) => CreatedAtAction(nameof(GetById), new { id = request.RequestId }, request);

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] MaintenanceRequest request) => NoContent();

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => NoContent();
    }
}
