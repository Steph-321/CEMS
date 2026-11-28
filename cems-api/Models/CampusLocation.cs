using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cems_api.Models
{
    public class CampusLocation
    {
        public int LocationId { get; set; }
        public string BuildingName { get; set; } = string.Empty;
        public string RoomNumber { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
