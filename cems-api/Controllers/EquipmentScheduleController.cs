using Microsoft.AspNetCore.Mvc;
using cems_api.Models;

namespace cems_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EquipmentScheduleController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok(new List<EquipmentSchedule>());

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok(new EquipmentSchedule());

        [HttpPost]
        public IActionResult Create([FromBody] EquipmentSchedule schedule) => CreatedAtAction(nameof(GetById), new { id = schedule.ScheduleId }, schedule);

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] EquipmentSchedule schedule) => NoContent();

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => NoContent();
    }
}
