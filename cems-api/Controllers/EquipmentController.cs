using Microsoft.AspNetCore.Mvc;
using cems_api.Models;

namespace cems_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EquipmentController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok(new List<Equipment>());

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok(new Equipment());

        [HttpPost]
        public IActionResult Create([FromBody] Equipment equipment) => CreatedAtAction(nameof(GetById), new { id = equipment.EquipmentId }, equipment);

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Equipment equipment) => NoContent();

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => NoContent();
    }
}
