using Microsoft.AspNetCore.Mvc;
using cems_api.Models;

namespace cems_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoleController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok(new List<Role>());

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok(new Role());

        [HttpPost]
        public IActionResult Create([FromBody] Role role) => CreatedAtAction(nameof(GetById), new { id = role.RoleId }, role);

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Role role) => NoContent();

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => NoContent();
    }
}
