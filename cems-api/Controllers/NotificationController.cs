using Microsoft.AspNetCore.Mvc;
using cems_api.Models;

namespace cems_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok(new List<Notification>());

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok(new Notification());

        [HttpPost]
        public IActionResult Create([FromBody] Notification notification) => CreatedAtAction(nameof(GetById), new { id = notification.NotificationId }, notification);

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Notification notification) => NoContent();

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => NoContent();
    }
}
