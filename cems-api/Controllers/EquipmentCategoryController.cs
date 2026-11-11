using Microsoft.AspNetCore.Mvc;
using cems_api.Models;

namespace cems_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EquipmentCategoryController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok(new List<EquipmentCategory>());

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok(new EquipmentCategory());

        [HttpPost]
        public IActionResult Create([FromBody] EquipmentCategory category) => CreatedAtAction(nameof(GetById), new { id = category.CategoryId }, category);

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] EquipmentCategory category) => NoContent();

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => NoContent();
    }
}
