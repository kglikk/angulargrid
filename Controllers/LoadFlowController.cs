using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using angulargrid.Functions;

using angulargrid.Models;

using System.Numerics; //u�ywam �eby korzysta� z warto�ci zespolonych
//using angulargrid.ViewModels;
using System.Collections;

namespace proba1.Controllers
{
    [Produces("application/json")]
    [Route("api/LoadFlowController")]
    public class LoadFlowController : Controller
    {

        // GET: api/values
        [HttpGet("[action]")]
        [Route("LoadFlow")]
        public IEnumerable<LoadFlowResult> Get()
        {
           
            //-------------Load Flow Algorithm---------------
            List<int> buses = new List<int>();
            int N_bus; //liczba szyn/w�z��w
            int N_ser; //liczba element�w ga��ziowych

            //Je�li nie istniej� tego typu elementy to oznacza si� numer szyny r�wny 1 oraz warto�� zero w drugiej kolumnie.
            int[] shunts = new int[] { 1, 0 }; //elementy poprzeczne

            //int N_sh = 1; // liczba element�w poprzecznych 

            //pomocnicze tablice
            List<int> Is = new List<int>(); //numery szyn pocz�tkowych
            List<int> Js = new List<int>(); // numery szyn ko�cowych

            List<string> Itype = new List<string>();
            List<double> Pb = new List<double>();
            List<double> Qb = new List<double>();

            //Complex c1 = new Complex(1.2, 2.0);

            //ilo�� element�w pod�u�nych
            N_ser = _context.OverheadLines.Count() + _context.TwoPhaseTransformers.Count();

            //okre�l ilo�� szyn
            foreach (var row in _context.ExternalGrids)
            {
                if (!buses.Contains(row.NodeNo))
                {
                    buses.Add(row.NodeNo);
                }
                Itype.Add(row.NodeType);
                //normalSigma[n] = (sigma[n].HasValue) ? sigma[n].Value : 0;
                Pb.Add((row.ActivePower.HasValue) ? row.ActivePower.Value : 0);
                Qb.Add((row.ReactivePower.HasValue) ? row.ReactivePower.Value : 0);
            }
            foreach (var row in _context.OverheadLines)
            {
                if (!buses.Contains(row.StartNodeNo))
                {
                    buses.Add(row.StartNodeNo);
                }
                if (!buses.Contains(row.EndNodeNo))
                {
                    buses.Add(row.EndNodeNo);
                }

                Is.Add(row.StartNodeNo);
                Js.Add(row.EndNodeNo);
            }
            N_bus = buses.Count;

            System.Diagnostics.Debug.WriteLine("BUS.COUNT: " + buses.Count);

            System.Diagnostics.Debug.WriteLine("ExternalGrid.COUNT: " + _context.ExternalGrids.Count());
            
            //uformuj macierz z elementami pod�u�nymi - series
            Complex[,] Series = new Complex[N_ser, 5];
            foreach (var row in _context.OverheadLines)
            {
                Complex RX = new Complex(row.UnitaryResistance * row.Length, row.UnitaryReactance * row.Length);
                Complex B = new Complex(0, row.UnitaryCapacitance * row.Length);
                Series[(row.ID-1), 0] = row.StartNodeNo;
                Series[(row.ID - 1), 1] = row.EndNodeNo;
                Series[(row.ID - 1), 2] = RX;
                Series[(row.ID - 1), 3] = B;
                Series[(row.ID - 1), 4] = 1; //TUTAJ BED� PRZEK�ADNIE TRANSFORMATOROW
                
            }
                        
            double[] U = new double[N_bus];
            double?[] sigma = new double?[N_bus];

            //uformuj macierz - buses
            foreach (var row in _context.ExternalGrids)
            {
                // Buses[row.ID-1, 1] = row.NodeType;
                sigma[row.ID-1] = row.VoltageAngle;
            }
            double[] normalSigma = new double[N_bus];
            for (int n = 0; n <= (N_bus - 1); n++)
            {
                normalSigma[n] = (sigma[n].HasValue) ? sigma[n].Value : 0; //przekonwertowanie double? na double
            }
            //sztucznie dodane napi�cia
            U[0] = 60;
            U[1] = 60;
            U[2] = 60;

            //uformuj macierz admitancyjn�
            Complex[,] Ybus = new Complex[N_bus, N_bus];
            Ybus = formYmatrix(N_bus, N_ser, Is, Js, Series, shunts);

            //oblicz macierz Jacobiego
            double[,] Jac = new double[N_bus+1, N_bus+1];
            Jac = calcJacobiMatrix(N_bus, Ybus, U, normalSigma, Itype);

            
            
            //odwr�� macierz Jacobiego
            double[,] JacInv = new double[Jac.GetLength(0),Jac.GetLength(1)];
            JacInv = MatrixInverseFunc.Main(Jac);
            
            
            int maxIter = 12; //maksymalna liczba iteracji
            double lambda = 1; //acceleration coefficient. This coefficient takes values less than one and improves the convergence characteristics of the problem.  The user may change the value of l to see its effect on the mismatch at the end of the iterations.
            for(int i= 0; i <= (maxIter-1); i++)
            {
                for (int m = 1; m <= (N_bus - 1); m++)
                {                    
                    U[m] = U[m] + deltaV(m, N_bus, Itype, JacInv, Ybus, normalSigma, U, Pb, Qb) * lambda;
                   
                    normalSigma[m] = normalSigma[m] + deltaSigma(m, N_bus, Itype, JacInv, Ybus, normalSigma, U, Pb, Qb) * lambda;
                    //System.Diagnostics.Debug.WriteLine("m " + m + "normalSigma[m]" + normalSigma[m]);
                    //System.Diagnostics.Debug.WriteLine("m " + m + "deltaSigma" + deltaSigma(m, N_bus, Itype, JacInv, Ybus, normalSigma, U, Pb, Qb));
                }
            }

            //radian to degree
            for (int c = 0; c<=(normalSigma.Length-1); c++)
            {
                normalSigma[c] = normalSigma[c] * (180.0 / Math.PI); 
            }

            //  var viewModel = new LoadFlowViewModel(U, normalSigma);
            /*
              var viewModel = new List<LoadFlowViewModel>();
              for(int z = 0; z <= (N_bus-1); z++)
              {
                  var row = new LoadFlowViewModel();
                  row.busNo = z;
                  row.resultU = U[z];
                  row.resultSigma = normalSigma[z];
                  viewModel.Add(row);
              }
              return viewModel;
              */



            var list = new LoadFlows();

            list.Results = new List<LoadFlowResult>();

            for (int z = 0; z <= (N_bus - 1); z++)
            {
                var a = new LoadFlowResult() { busNo = z, resultU = U[z], resultSigma = normalSigma[z] };

                list.Results.Add(a);          
            }

            return list.Results;           
        }


        class LoadFlows : IEnumerable<LoadFlowResult>
        {
            public List<LoadFlowResult> Results { get; set; }

            public IEnumerator<LoadFlowResult> GetEnumerator()
            {
                return Results.GetEnumerator();
            }

            IEnumerator IEnumerable.GetEnumerator()
            {
                return Results.GetEnumerator();
            }
        }

        public class LoadFlowResult
        {           
            public int busNo { get; set; }
            public double resultU { get; set; }
            public double resultSigma { get; set; }          
        }


        private readonly DataContext _context;

        public LoadFlowController(DataContext context)
        {
            _context = context;
        }

        static Complex[,] formYmatrix(int N_bus, int N_ser, List<int> Is, List<int> Js, Complex[,] Series, int[] shunts)
        {
            //inicjalizuj macierz admitancyjn�
            Complex[,] Ybus = new Complex[N_bus, N_bus];
            Array.Clear(Ybus, 0, Ybus.Length);

            //uformuj macierz admitancyjn�
            for (int m = 0; m <= (N_bus - 1); m++)
            {
                Ybus[Is[m], Is[m]] = Ybus[Is[m], Is[m]] + Series[m, 3] + 1 / Series[m, 2];
                Ybus[Is[m], Js[m]] = Ybus[Is[m], Js[m]] - (1 / Series[m, 2]) * Series[m, 4];
                Ybus[Js[m], Is[m]] = Ybus[Js[m], Is[m]] - (1 / Series[m, 2]) * Series[m, 4];
                Ybus[Js[m], Js[m]] = Ybus[Js[m], Js[m]] + Series[m, 3] + (1 / Series[m, 2]) * Series[m, 4] * Series[m, 4];
            }

            //dodaj elementy poprzeczne TUTAJ TRZEBA COS POPRAWIC
            /*
            for (int m = 0; m <= (shunts.Length - 1); m++)
            {
                Ybus[Is[m], Is[m]] = Ybus[Is[m], Is[m]] + shunts[m];
                Ybus[Is[m], Is[m]] = Ybus[Js[m], Js[m]] + shunts[m];
            }*/
            return Ybus;
        }
        
        static double[,] calcJacobiMatrix(int N_bus, Complex[,] Ybus, double[] U, double[] normalSigma, List<string> Itype)
        {
            //uformuj macierz Jacobiego
            double[,] Jac = new double[N_bus+1, N_bus + 1];

            for (int k = 1; k <= (N_bus - 1); k++)
            {
                for (int n = 1; n <= (N_bus - 1); n++)
                {
                    // d(fp_k)/d(V_n)     
                    Jac[k - 1, n + N_bus - 2] = U[k] * Ybus[k, n].Magnitude * Math.Cos(Ybus[k, n].Phase + normalSigma[n] - normalSigma[k]);
                   // System.Diagnostics.Debug.WriteLine("Jac[k - 1,n + N_bus - 2] " + Jac[k - 1, n + N_bus - 2]);

                    // d(fq_k)/d(V_n)  
                    Jac[k + N_bus - 2, n + N_bus - 2] = (-U[k]) * Ybus[k, n].Magnitude * Math.Sin(Ybus[k, n].Phase + normalSigma[n] - normalSigma[k]);
                   // System.Diagnostics.Debug.WriteLine("Jac[k + N_bus - 2, n + N_bus - 2] " + Jac[k + N_bus - 2, n + N_bus - 2]);

                    // d(fp_k)/d(sigma_n)
                    Jac[k - 1, n - 1] = -(U[k] * U[n] * Ybus[k, n].Magnitude) * Math.Sin(Ybus[k, n].Phase + normalSigma[n] - normalSigma[k]);
                   // System.Diagnostics.Debug.WriteLine("Jac[k - 1, n - 1] " + Jac[k - 1, n - 1]);

                    // d(fq_k)/d(sigma_n)
                    Jac[k + N_bus - 2, n - 1] = (-U[k]) * U[n] * Ybus[k, n].Magnitude * Math.Cos(Ybus[k, n].Phase + normalSigma[n] - normalSigma[k]);
                   // System.Diagnostics.Debug.WriteLine("Jac[k + N_bus - 2, n - 1]" + Jac[k + N_bus - 2, n - 1]);
                   
                }
            }

            for (int k = 1; k <= (N_bus - 1); k++)
            {                
                    // d(fp_k)/d(V_k)  
                    Jac[k - 1, k + N_bus - 2] = summationJacobi_fpkVk(k, N_bus, Ybus, U, normalSigma) + U[k] * Ybus[k, k].Magnitude * Math.Cos(Ybus[k, k].Phase);
                    //System.Diagnostics.Debug.WriteLine("k: " + k + "i: " + i + "Ybus[k, i].Magnitude" + Ybus[k, i].Magnitude); 
                    
                    // d(fq_k)/d(V_k)                        
                    Jac[k + N_bus - 2,k + N_bus - 2] = summationJacobi_fqkVk(k, N_bus, Ybus, U, normalSigma) - (U[k] * Ybus[k, k].Magnitude * Math.Sin(Ybus[k, k].Phase));
                   // System.Diagnostics.Debug.WriteLine(" Jac[k + N_bus - 2,k + N_bus - 2] " + Jac[k + N_bus - 2, k + N_bus - 2]);


                    // d(fp_k)/d(sigma_k)
                    Jac[k - 1,k - 1] = summationJacobi_fpkSigmak(k, N_bus, Ybus, U, normalSigma) - U[k] * U[k] * Ybus[k, k].Magnitude * Math.Sin(Ybus[k, k].Phase);
                   // System.Diagnostics.Debug.WriteLine("Jac[k - 1,k - 1] " + Jac[k - 1, k - 1]);

                    // d(fq_k)/d(sigma_k)
                    Jac[k + N_bus - 2, k - 1] = summationJacobi_fqkSigmak(k, N_bus, Ybus, U, normalSigma) - U[k] * U[k] * Ybus[k, k].Magnitude * Math.Cos(Ybus[k, k].Phase);
                   // System.Diagnostics.Debug.WriteLine("Jac[k + N_bus - 2, k - 1] " + Jac[k + N_bus - 2, k - 1]);
                    // System.Diagnostics.Debug.WriteLine("Math.Cos(Ybus[k, n] " + Math.Cos(Ybus[k, n].Phase));
                    // System.Diagnostics.Debug.WriteLine("Math.Sin(Ybus[k, n] " + Math.Sin(Ybus[k, n].Phase));
            }

            for (int k = 1; k <= (N_bus - 1); k++)
            {
                for (int n = 1; n <= (N_bus - 1); n++)
                {

                    if (Itype[n] == "PV") //SL odpowiada 0, PV odpowiada 1, PQ odpowiada 2
                    {
                        Jac[k - 1, n + N_bus - 2] = 0;
                        Jac[k + N_bus - 2, n + N_bus - 2] = 0;
                    }

                    if (Itype[k] == "PV") //SL odpowiada 0, PV odpowiada 1, PQ odpowiada 2
                    {
                        Jac[k + N_bus - 2, n - 1] = 0;
                        Jac[k + N_bus - 2, n + N_bus - 2] = 0;
                        Jac[k + N_bus - 2, k + N_bus - 2] = 1;
                    }
                }
            }
                /*
                double[,] matrixReplacement = new double[,] { { 594.507, -395.122, 0, -0.732 }, { -395.122, 885.659, 0, 1.867 }, { 0, 0, 1, 0 }, { 43.902, -112.033, 0, 14.761 } };
                return matrixReplacement;
                */
                return Jac;
        }

        //sumowania w jakobianie
        static double summationJacobi_fpkVk(int k, int N_bus, Complex[,] Ybus, double[] U, double[] normalSigma)
        {
            double[] summation = new double[N_bus];
            double result = 0;
            for (int i = 0; i <= (N_bus - 1); i++)
                {
                   summation[i] = U[i] * Ybus[k, i].Magnitude * Math.Cos(Ybus[k, i].Phase + normalSigma[i] - normalSigma[k]);
                }
           result = summation.Sum();            
           return result;
        }                
        static double summationJacobi_fqkVk(int k, int N_bus, Complex[,] Ybus, double[] U, double[] normalSigma)
        {
            double[] summation = new double[N_bus];
            double result = 0;
            for (int i = 0; i <= (N_bus - 1); i++)
            {
                summation[i] = (-U[i]) * Ybus[k, i].Magnitude * Math.Sin(Ybus[k, i].Phase + normalSigma[i] - normalSigma[k]);
            }
            result = summation.Sum();
            return result;           
        }
        static double summationJacobi_fpkSigmak(int k, int N_bus, Complex[,] Ybus, double[] U, double[] normalSigma)
        {
            double[] summation = new double[N_bus];
            double result = 0;
            for (int i = 0; i <= (N_bus - 1); i++)
            {
                summation[i] = U[k] * U[i] * Ybus[k, i].Magnitude * Math.Sin(Ybus[k, i].Phase + normalSigma[i] - normalSigma[k]);
            }
            result = summation.Sum();
            return result;            
        }
        static double summationJacobi_fqkSigmak(int k, int N_bus, Complex[,] Ybus, double[] U, double[] normalSigma)
        {
            double[] summation = new double[N_bus];
            double result = 0;
            for (int i = 0; i <= (N_bus - 1); i++)
            {
                summation[i] = U[k] * U[i] * Ybus[k, i].Magnitude * Math.Cos(Ybus[k, i].Phase + normalSigma[i] - normalSigma[k]);
            }
            result = summation.Sum();
            return result;            
        }
         
        //funkcja mocy czynnej
        static double fp(int k, double[] x, double[] y, int N_bus, Complex[,] Ybus)
        {
            double[] summation = new double[N_bus];
            double result = 0;
            
                for (int i = 0; i <= (N_bus - 1); i++)
                {
                summation[i] = x[k] * x[i] * Ybus[k, i].Magnitude * Math.Cos(Ybus[k, i].Phase + y[i] - y[k]);
                System.Diagnostics.Debug.WriteLine("Math.Cos(Ybus[k, i].Phase) " + Math.Cos(Ybus[k, i].Phase)); 
            }

        result = summation.Sum();
            return result;
        }

        //funkcja mocy biernej
        static double fq(int k,  double[] x, double[] y, int N_bus, Complex[,] Ybus)
        {
            double[] summation = new double[N_bus];
            double result = 0;

            for (int i = 0; i <= (N_bus - 1); i++)
                {
                summation[i] = -(x[k] * x[i] * Ybus[k, i].Magnitude * Math.Sin(Ybus[k, i].Phase + y[i] - y[k]));                    
                }

            result = summation.Sum();
            return result;
        }

        //poprawki napi�cia
        static double deltaV(int m,  int N_bus, List<string> Itype, double[,] JacInv, Complex[,] Ybus, double[] normalSigma, double[] U, List<double> Pb, List<double> Qb)
        {
            double result = 0;
           // double[] summationDeltaV = new double[N_bus];
            List<double> summationDeltaV = new List<double>();

            for (int k = 1; k <= (N_bus-1); k++)
            {                               
                    if (Itype[k] == "PV")
                    {
                    summationDeltaV.Add(JacInv[m + N_bus - 2, k - 1] * (Pb[k] - fp(k, U, normalSigma, N_bus, Ybus)));
                    //   summationDeltaV[k] = JacInv[m + N_bus - 2,k - 1] * (Pb[k] - fp(k,U, normalSigma, N_bus, Ybus)) + JacInv[m + N_bus - 2,k + N_bus - 2] * 0;                       
                    }
                    else
                    {
                    summationDeltaV.Add(JacInv[m + N_bus - 2, k - 1] * (Pb[k] - fp(k, U, normalSigma, N_bus, Ybus)) + JacInv[m + N_bus - 2, k + N_bus - 2] * (Qb[k] - fq(k, U, normalSigma, N_bus, Ybus)));
                    //summationDeltaV[k] = JacInv[m + N_bus - 2,k - 1] * (Pb[k] - fp(k,U, normalSigma, N_bus, Ybus)) + JacInv[m + N_bus - 2,k + N_bus - 2] * (Qb[k] - fq(k,U, normalSigma, N_bus, Ybus));                       
                    }                                       
                
            }
            result = summationDeltaV.Sum();


            //System.Diagnostics.Debug.WriteLine("summationDeltaV.Count" + summationDeltaV.Count);
            return result;
        }

        //poprawki k�ta
        static double deltaSigma(int m, int N_bus, List<string> Itype, double[,] JacInv, Complex[,] Ybus, double[] normalSigma, double[] U, List<double> Pb, List<double> Qb)
        {
            double result = 0;
            List<double> summationDeltaSigma = new List<double>();

            for (int k = 1; k <= (N_bus - 1); k++)
            {
                    if (Itype[k] == "PV")
                    {
                    summationDeltaSigma.Add(JacInv[m - 1, k - 1] * (Pb[k] - fp(k, U, normalSigma, N_bus, Ybus)));
                    }
                    else
                    {
                    summationDeltaSigma.Add(JacInv[m - 1,k - 1] * (Pb[k] - fp(k,U, normalSigma, N_bus, Ybus) + JacInv[m - 1,k + N_bus - 2] * (Qb[k] - fq(k,U, normalSigma, N_bus, Ybus))));
                    }                                  
            }
            result = summationDeltaSigma.Sum();
           
            return result;           
        }
        
       
    }
}