using Microsoft.AspNetCore.Mvc;
using cems_api.Models;

namespace cems_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok(new List<Users>());

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok(new Users());

        [HttpPost]
        public IActionResult Create([FromBody] Users user) => CreatedAtAction(nameof(GetById), new { id = user.UserId }, user);

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Users user) => NoContent();

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => NoContent();
    }
}
