using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cems_api.Models
{
    public class MaintenanceAssignment
    {
        public int AssignmentId { get; set; }
        public int RequestId { get; set; }
        public int StaffUserId { get; set; }
        public int? AssignedByUserId { get; set; }
        public DateTime AssignedAt { get; set; } = DateTime.Now;
        public string AssignmentStatus { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }
}
