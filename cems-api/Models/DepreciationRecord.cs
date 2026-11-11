using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cems_api.Models
{
    public class DepreciationRecord
    {
        public int DepreciationId { get; set; }
        public int EquipmentId { get; set; }
        public int FiscalYear { get; set; }
        public string? DepreciationMethod { get; set; }
        public decimal? OpeningBookValue { get; set; }
        public decimal? DepreciationAmount { get; set; }
        public decimal? AccumulatedDepreciation { get; set; }
        public decimal? ClosingBookValue { get; set; }
        public DateTime? CalculatedAt { get; set; }
    }
}
