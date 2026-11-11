using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cems_api.Models
{
    public class MaintenanceRequest
    {
        public int RequestId { get; set; }
        public int EquipmentId { get; set; }
        public int ReporterUserId { get; set; }
        public string? IssueCategory { get; set; }
        public string? Severity { get; set; }
        public string Description { get; set; } = string.Empty;
        public string? AttachmentUrl { get; set; }
        public DateTime SubmittedAt { get; set; } = DateTime.Now;
        public string RequestStatus { get; set; } = string.Empty;
    }
}
