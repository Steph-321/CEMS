using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cems_api.Models
{
    public class Equipment
    {
        public int EquipmentId { get; set; }
        public string AssetCode { get; set; } = string.Empty;
        public string StaffAssetTag { get; set; } = string.Empty;
        public string EquipmentName { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public int LocationId { get; set; }
        public string? Model { get; set; }
        public string? SerialNumber { get; set; }
        public DateOnly AssetDate { get; set; }
        public decimal AcquisitionCost { get; set; }
        public string? Condition { get; set; }
        public string AvailabilityStatus { get; set; } = string.Empty;
        public string? WarrantyCoverage { get; set; }
        public DateOnly? WarrantyExpiry { get; set; }
        public string? WarrantyStatus { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
    }
}
