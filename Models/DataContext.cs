using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;


namespace angulargrid.Models
{
    public class DataContext : DbContext
    {
        
        
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }
        
        

        
        public DbSet<ExternalGrid> ExternalGrids { get; set; }
        public DbSet<OverheadLine> OverheadLines { get; set; }
        public DbSet<TwoPhaseTransformer> TwoPhaseTransformers { get; set; }

        //zamiania z nazwy mnogiej na pojedynczą w bazie
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ExternalGrid>().ToTable("ExternalGrid");
            modelBuilder.Entity<OverheadLine>().ToTable("OverheadLine");
            modelBuilder.Entity<TwoPhaseTransformer>().ToTable("TwoPhaseTransformer");
        }
    }
}
