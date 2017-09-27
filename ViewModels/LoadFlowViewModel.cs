using System;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;


namespace angugrid.ViewModels
{
    public class LoadFlowViewModel
    {
        //public int ID { get; set; }
        [Display(Name = "Bus np.")]
        public int busNo { get; set; }

        [Display(Name = "Voltage")]
        public double resultU { get; set; }

        [Display(Name = "Angle")]
        public double resultSigma { get; set; }
        /*
        public LoadFlowViewModel(double[] U, double[] sigma)
        {
            resultU = U;
            resultSigma = sigma;
        }
             */
    }
       
    

}
