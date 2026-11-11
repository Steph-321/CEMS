using Microsoft.AspNetCore.Mvc;
using cems_api.Models;

namespace cems_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepreciationRecordController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok(new List<DepreciationRecord>());

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok(new DepreciationRecord());

        [HttpPost]
        public IActionResult Create([FromBody] DepreciationRecord record) => CreatedAtAction(nameof(GetById), new { id = record.DepreciationId }, record);

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] DepreciationRecord record) => NoContent();

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => NoContent();
    }
}
