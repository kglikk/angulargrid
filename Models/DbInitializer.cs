using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace angulargrid.Models
{
    public class DbInitializer
    {
        public static void Initialize(DataContext context)
        {
            context.Database.EnsureCreated();

            // Look for any students.
            if (context.ExternalGrids.Any() || context.OverheadLines.Any() || context.TwoPhaseTransformers.Any())
            {
                return;   // DB has been seeded
            }

            var twophasetransformers = new TwoPhaseTransformer[]
            {
            };
            foreach (TwoPhaseTransformer s in twophasetransformers)
            {
                context.TwoPhaseTransformers.Add(s);
            }
            context.SaveChanges();


            var externalgrids = new ExternalGrid[]
            {
                 new ExternalGrid{Name="ExtGrid1", NodeNo=0, NodeType="SL", VoltageAngle=0, VoltageSetpoint=1 },
                 new ExternalGrid{Name="ExtGrid2", NodeNo=1, NodeType="PV", VoltageAngle=0, VoltageSetpoint=1, ActivePower=60 },
                 new ExternalGrid{Name="ExtGrid2", NodeNo=2, NodeType="PQ", VoltageAngle=0, ActivePower=-80, ReactivePower = -60 }
            };

            foreach (ExternalGrid s in externalgrids)
            {
                context.ExternalGrids.Add(s);
            }
            context.SaveChanges();

            var overheadlines = new OverheadLine[]
            {
                 new OverheadLine{Name="OHL1", StartNodeNo=0, EndNodeNo=1, Length=1, UnitaryResistance=0, UnitaryReactance =18, UnitaryCapacitance=0 },
                 new OverheadLine{Name="OHL2", StartNodeNo=0, EndNodeNo=2, Length=1, UnitaryResistance=0, UnitaryReactance =7.2, UnitaryCapacitance=0 },
                 new OverheadLine{Name="OHL3", StartNodeNo=1, EndNodeNo=2, Length=1, UnitaryResistance=0, UnitaryReactance =9, UnitaryCapacitance=0 }
            };

            foreach (OverheadLine s in overheadlines)
            {
                context.OverheadLines.Add(s);
            }
            context.SaveChanges();
        }
    }
}
