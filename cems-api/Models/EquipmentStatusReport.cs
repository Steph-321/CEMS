using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cems_api.Models
{
    public class EquipmentStatusReport
    {
        public int StatusHistoryId { get; set; }
        public int EquipmentId { get; set; }
        public int ChangedByUserId { get; set; }
        public string? PreviousStatus { get; set; }
        public string NewStatus { get; set; } = string.Empty;
        public string? PreviousCondition { get; set; }
        public string? NewCondition { get; set; }
        public string? ChangeNotes { get; set; }
        public DateTime ChangedAt { get; set; } = DateTime.Now;
    }
}
