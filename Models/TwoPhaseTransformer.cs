using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace angulargrid.Models
{
    public class TwoPhaseTransformer
    {
        public int ID { get; set; }
        [Required]
        [Display(Name = "Name")]
        public string Name { get; set; }

        [Required]
        [Display(Name = "No. of HV node")]
        public int HVNodeNo { get; set; }

        [Required]
        [Display(Name = "No. of LV node")]
        public int LVNodeNo { get; set; }

        [Required]
        [Display(Name = "Rated voltage - HV side [kV]")]
        public double HVVoltageRated { get; set; }

        [Required]
        [Display(Name = "Rated voltage - LV side [kV]")]
        public double LVVoltageRated { get; set; }

        [Required]
        [Display(Name = "Rated apparent power [MVA]")]
        public double ApparentPowerRated { get; set; }

        [Required]
        [Display(Name = "Load Losses [kW]")]
        public double LoadLossesRated { get; set; }

        [Required]
        [Display(Name = "Short Circuit Voltage [%]")]
        public double ShortCircuitVoltage { get; set; }
    }
}
