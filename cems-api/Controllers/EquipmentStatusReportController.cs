using Microsoft.AspNetCore.Mvc;
using cems_api.Models;

namespace cems_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EquipmentStatusReportController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok(new List<EquipmentStatusReport>());

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok(new EquipmentStatusReport());

        [HttpPost]
        public IActionResult Create([FromBody] EquipmentStatusReport report) => CreatedAtAction(nameof(GetById), new { id = report.StatusHistoryId }, report);

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] EquipmentStatusReport report) => NoContent();

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => NoContent();
    }
}
