using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cems_api.Models
{
    public class AssetActivityLog
    {
        public int ActivityId { get; set; }
        public int EquipmentId { get; set; }
        public int? PerformedByUserId { get; set; }
        public int? FromLocationId { get; set; }
        public int? ToLocationId { get; set; }
        public string ActivityType { get; set; } = string.Empty;
        public string? ActivityDescription { get; set; }
        public DateTime ActivityAt { get; set; } = DateTime.Now;
    }
}
