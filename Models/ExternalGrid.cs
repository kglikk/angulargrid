using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;


namespace angulargrid.Models
{
    public class ExternalGrid
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [Display(Name = "Name")]
        public string Name { get; set; }

        [Required]
        [Display(Name = "No. of node")]
        public int NodeNo { get; set; }

        [Required]
        [Display(Name = "Type of node")]
        //[CannotBeRed(ErrorMessage = "PQ is not allowed!")]
        public string NodeType { get; set; }


        [Display(Name = "Voltage angle [deg]")]
        public double? VoltageAngle { get; set; }


        [Display(Name = "Voltage setpoint [p.u.]")]
        public double? VoltageSetpoint { get; set; }



        [Display(Name = "Active power [MW]")]
        public double? ActivePower { get; set; }


        [Display(Name = "Reactive power [MVAr]")]
        public double? ReactivePower { get; set; }
    }
}
