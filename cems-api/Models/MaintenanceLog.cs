using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cems_api.Models
{
    public class MaintenanceLog
    {
        public string MaintenanceLogId { get; set; } = string.Empty;
        public int RequestId { get; set; }
        public int TechnicianId { get; set; }
        public string ActionPerformed { get; set; } = string.Empty;
        public string? RepairSteps { get; set; }
        public string? PartsReplaced { get; set; }
        public decimal? RepairCost { get; set; }
        public string? MaintenanceStatus { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string? EvidenceUrl { get; set; }
    }
}
