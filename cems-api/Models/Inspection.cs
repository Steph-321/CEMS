using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cems_api.Models
{
    public class Inspection
    {
        public int InspectionId { get; set; }
        public int EquipmentId { get; set; }
        public int InspectorUserId { get; set; }
        public string InspectionType { get; set; } = string.Empty;
        public DateOnly? ScheduledDate { get; set; }
        public DateTime? InspectedAt { get; set; }
        public string? ChecklistResults { get; set; }
        public string? InspectionNotes { get; set; }
        public string? Outcome { get; set; }
        public DateOnly? NextInspectionDate { get; set; }
        public string? PhotoUrl { get; set; }
    }
}
