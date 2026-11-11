using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cems_api.Models
{
    public class EquipmentSchedule
    {
        public int ScheduleId { get; set; }
        public int EquipmentId { get; set; }
        public int LocationId { get; set; }
        public int CoordinatorUserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ScheduleType { get; set; } = string.Empty;
        public DateOnly ScheduleDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public string? Description { get; set; }
        public string ScheduleStatus { get; set; } = string.Empty;
    }
}
