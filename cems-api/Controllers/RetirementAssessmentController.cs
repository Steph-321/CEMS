using Microsoft.AspNetCore.Mvc;
using cems_api.Models;

namespace cems_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RetirementAssessmentController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll() => Ok(new List<RetirementAssessment>());

        [HttpGet("{id}")]
        public IActionResult GetById(int id) => Ok(new RetirementAssessment());

        [HttpPost]
        public IActionResult Create([FromBody] RetirementAssessment assessment) => CreatedAtAction(nameof(GetById), new { id = assessment.AssessmentId }, assessment);

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] RetirementAssessment assessment) => NoContent();

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => NoContent();
    }
}
