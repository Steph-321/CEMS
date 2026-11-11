using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cems_api.Models
{
    public class RetirementAssessment
    {
        public int AssessmentId { get; set; }
        public int EquipmentId { get; set; }
        public string ReportingPeriod { get; set; } = string.Empty;
        public decimal PurchaseCost { get; set; }
        public decimal CumulativeRepairCost { get; set; }
        public decimal RepairRatio { get; set; }
        public string? Recommendation { get; set; }
        public string? DecisionStatus { get; set; }
        public DateTime AssessedAt { get; set; } = DateTime.Now;
        public string? Notes { get; set; }
    }
}
