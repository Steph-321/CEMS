using Microsoft.AspNetCore.Mvc;
using cems_api.Models;

namespace cems_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssetActivityLogController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok(new List<AssetActivityLog>());

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok(new AssetActivityLog());

        [HttpPost]
        public IActionResult Create([FromBody] AssetActivityLog log) => CreatedAtAction(nameof(GetById), new { id = log.ActivityId }, log);

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] AssetActivityLog log) => NoContent();

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => NoContent();
    }
}
