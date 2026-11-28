using Microsoft.EntityFrameworkCore;
using cems_api.Models;

namespace cems_api.Data
{
    public class CemsDbContext : DbContext
    {
        public CemsDbContext(DbContextOptions<CemsDbContext> options) : base(options) { }

        // ── Tables ──────────────────────────────────────────────
        public DbSet<Role> Roles { get; set; }
        public DbSet<Users> Users { get; set; }
        public DbSet<CampusLocation> CampusLocations { get; set; }
        public DbSet<EquipmentCategory> EquipmentCategories { get; set; }
        public DbSet<Equipment> Equipment { get; set; }
        public DbSet<EquipmentStatusReport> EquipmentStatusReports { get; set; }
        public DbSet<EquipmentSchedule> EquipmentSchedules { get; set; }
        public DbSet<MaintenanceRequest> MaintenanceRequests { get; set; }
        public DbSet<MaintenanceAssignment> MaintenanceAssignments { get; set; }
        public DbSet<MaintenanceLog> MaintenanceLogs { get; set; }
        public DbSet<Inspection> Inspections { get; set; }
        public DbSet<AssetActivityLog> AssetActivityLogs { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<DepreciationRecord> DepreciationRecords { get; set; }
        public DbSet<RetirementAssessment> RetirementAssessments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ── ROLE ────────────────────────────────────────────
            modelBuilder.Entity<Role>(e =>
            {
                e.ToTable("Role");
                e.HasKey(r => r.RoleId);
                e.Property(r => r.RoleName).IsRequired().HasMaxLength(30);
                e.Property(r => r.Description).HasMaxLength(255);
            });

            // ── USER ────────────────────────────────────────────
            modelBuilder.Entity<Users>(e =>
            {
                e.ToTable("User");
                e.HasKey(u => u.UserId);
                e.Property(u => u.FullName).IsRequired().HasMaxLength(120);
                e.Property(u => u.Username).IsRequired().HasMaxLength(60);
                e.Property(u => u.Email).IsRequired().HasMaxLength(150);
                e.Property(u => u.PasswordHash).IsRequired().HasMaxLength(255);
                e.Property(u => u.AccountStatus).IsRequired().HasMaxLength(20);
                e.Property(u => u.CreatedAt).IsRequired();

                e.HasIndex(u => u.Username).IsUnique();
                e.HasIndex(u => u.Email).IsUnique();

                e.HasOne<Role>()
                 .WithMany()
                 .HasForeignKey(u => u.RoleId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            // ── CAMPUS LOCATION ──────────────────────────────────
            modelBuilder.Entity<CampusLocation>(e =>
            {
                e.ToTable("CampusLocation");
                e.HasKey(c => c.LocationId);
                e.Property(c => c.BuildingName).IsRequired().HasMaxLength(100);
                e.Property(c => c.RoomNumber).IsRequired().HasMaxLength(30);
                e.Property(c => c.Description).HasMaxLength(255);
            });

            // ── EQUIPMENT CATEGORY ───────────────────────────────
            modelBuilder.Entity<EquipmentCategory>(e =>
            {
                e.ToTable("EquipmentCategory");
                e.HasKey(c => c.CategoryId);
                e.Property(c => c.CategoryName).IsRequired().HasMaxLength(100);
                e.Property(c => c.Description).HasMaxLength(255);
            });

            // ── EQUIPMENT ────────────────────────────────────────
            modelBuilder.Entity<Equipment>(e =>
            {
                e.ToTable("Equipment");
                e.HasKey(eq => eq.EquipmentId);
                e.Property(eq => eq.AssetCode).IsRequired().HasMaxLength(40);
                e.Property(eq => eq.StaffAssetTag).HasMaxLength(60);
                e.Property(eq => eq.EquipmentName).IsRequired().HasMaxLength(120);
                e.Property(eq => eq.Model).HasMaxLength(100);
                e.Property(eq => eq.SerialNumber).HasMaxLength(100);
                e.Property(eq => eq.AcquisitionCost).IsRequired().HasColumnType("decimal(12,2)");
                e.Property(eq => eq.Condition).HasMaxLength(40);
                e.Property(eq => eq.AvailabilityStatus).IsRequired().HasMaxLength(40);
                e.Property(eq => eq.WarrantyCoverage).HasMaxLength(60);
                e.Property(eq => eq.WarrantyStatus).HasMaxLength(40);
                e.Property(eq => eq.CreatedAt).IsRequired();

                e.HasIndex(eq => eq.AssetCode).IsUnique();

                e.HasOne<EquipmentCategory>()
                 .WithMany()
                 .HasForeignKey(eq => eq.CategoryId)
                 .OnDelete(DeleteBehavior.Restrict);

                e.HasOne<CampusLocation>()
                 .WithMany()
                 .HasForeignKey(eq => eq.LocationId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            // ── EQUIPMENT STATUS HISTORY ─────────────────────────
            modelBuilder.Entity<EquipmentStatusReport>(e =>
            {
                e.ToTable("EquipmentStatusHistory");
                e.HasKey(s => s.StatusHistoryId);
                e.Property(s => s.NewStatus).IsRequired().HasMaxLength(40);
                e.Property(s => s.PreviousStatus).HasMaxLength(40);
                e.Property(s => s.PreviousCondition).HasMaxLength(40);
                e.Property(s => s.NewCondition).HasMaxLength(40);
                e.Property(s => s.ChangedAt).IsRequired();

                e.HasOne<Equipment>()
                 .WithMany()
                 .HasForeignKey(s => s.EquipmentId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasOne<Users>()
                 .WithMany()
                 .HasForeignKey(s => s.ChangedByUserId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            // ── EQUIPMENT SCHEDULE ───────────────────────────────
            modelBuilder.Entity<EquipmentSchedule>(e =>
            {
                e.ToTable("EquipmentSchedule");
                e.HasKey(s => s.ScheduleId);
                e.Property(s => s.Title).IsRequired().HasMaxLength(150);
                e.Property(s => s.ScheduleType).IsRequired().HasMaxLength(40);
                e.Property(s => s.ScheduleDate).IsRequired();
                e.Property(s => s.StartTime).IsRequired();
                e.Property(s => s.EndTime).IsRequired();
                e.Property(s => s.ScheduleStatus).IsRequired().HasMaxLength(30);

                e.HasOne<Equipment>()
                 .WithMany()
                 .HasForeignKey(s => s.EquipmentId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasOne<CampusLocation>()
                 .WithMany()
                 .HasForeignKey(s => s.LocationId)
                 .OnDelete(DeleteBehavior.Restrict);

                e.HasOne<Users>()
                 .WithMany()
                 .HasForeignKey(s => s.CoordinatorUserId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            // ── MAINTENANCE REQUEST ───────────────────────────────
            modelBuilder.Entity<MaintenanceRequest>(e =>
            {
                e.ToTable("MaintenanceRequest");
                e.HasKey(r => r.RequestId);
                e.Property(r => r.IssueCategory).HasMaxLength(60);
                e.Property(r => r.Severity).HasMaxLength(30);
                e.Property(r => r.Description).IsRequired();
                e.Property(r => r.AttachmentUrl).HasMaxLength(500);
                e.Property(r => r.SubmittedAt).IsRequired();
                e.Property(r => r.RequestStatus).IsRequired().HasMaxLength(30);

                e.HasOne<Equipment>()
                 .WithMany()
                 .HasForeignKey(r => r.EquipmentId)
                 .OnDelete(DeleteBehavior.Restrict);

                e.HasOne<Users>()
                 .WithMany()
                 .HasForeignKey(r => r.ReporterUserId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            // ── MAINTENANCE ASSIGNMENT ────────────────────────────
            modelBuilder.Entity<MaintenanceAssignment>(e =>
            {
                e.ToTable("MaintenanceAssignment");
                e.HasKey(a => a.AssignmentId);
                e.Property(a => a.AssignedAt).IsRequired();
                e.Property(a => a.AssignmentStatus).IsRequired().HasMaxLength(30);

                e.HasOne<MaintenanceRequest>()
                 .WithMany()
                 .HasForeignKey(a => a.RequestId)
                 .OnDelete(DeleteBehavior.Cascade);

                // Staff assigned to the task
                e.HasOne<Users>()
                 .WithMany()
                 .HasForeignKey(a => a.StaffUserId)
                 .OnDelete(DeleteBehavior.Restrict);

                // Admin who made the assignment — no cascade to avoid multiple paths
                e.HasOne<Users>()
                 .WithMany()
                 .HasForeignKey(a => a.AssignedByUserId)
                 .OnDelete(DeleteBehavior.NoAction);
            });

            // ── MAINTENANCE LOG ───────────────────────────────────
            modelBuilder.Entity<MaintenanceLog>(e =>
            {
                e.ToTable("MaintenanceLog");
                e.HasKey(l => l.MaintenanceLogId);
                e.Property(l => l.ActionPerformed).IsRequired().HasMaxLength(150);
                e.Property(l => l.RepairCost).HasColumnType("decimal(10,2)");
                e.Property(l => l.MaintenanceStatus).HasMaxLength(30);
                e.Property(l => l.EvidenceUrl).HasMaxLength(500);

                e.HasOne<MaintenanceRequest>()
                 .WithMany()
                 .HasForeignKey(l => l.RequestId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasOne<Users>()
                 .WithMany()
                 .HasForeignKey(l => l.TechnicianId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            // ── INSPECTION ────────────────────────────────────────
            modelBuilder.Entity<Inspection>(e =>
            {
                e.ToTable("Inspection");
                e.HasKey(i => i.InspectionId);
                e.Property(i => i.InspectionType).IsRequired().HasMaxLength(50);
                e.Property(i => i.Outcome).HasMaxLength(40);
                e.Property(i => i.PhotoUrl).HasMaxLength(500);

                e.HasOne<Equipment>()
                 .WithMany()
                 .HasForeignKey(i => i.EquipmentId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasOne<Users>()
                 .WithMany()
                 .HasForeignKey(i => i.InspectorUserId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            // ── ASSET ACTIVITY LOG ────────────────────────────────
            modelBuilder.Entity<AssetActivityLog>(e =>
            {
                e.ToTable("AssetActivityLog");
                e.HasKey(a => a.ActivityId);
                e.Property(a => a.ActivityType).IsRequired().HasMaxLength(30);
                e.Property(a => a.ActivityAt).IsRequired();

                e.HasOne<Equipment>()
                 .WithMany()
                 .HasForeignKey(a => a.EquipmentId)
                 .OnDelete(DeleteBehavior.Cascade);

                // PerformedByUserId, FromLocationId, ToLocationId are nullable — no cascade
                e.HasOne<Users>()
                 .WithMany()
                 .HasForeignKey(a => a.PerformedByUserId)
                 .OnDelete(DeleteBehavior.SetNull);

                e.HasOne<CampusLocation>()
                 .WithMany()
                 .HasForeignKey(a => a.FromLocationId)
                 .OnDelete(DeleteBehavior.SetNull);

                e.HasOne<CampusLocation>()
                 .WithMany()
                 .HasForeignKey(a => a.ToLocationId)
                 .OnDelete(DeleteBehavior.NoAction);
            });

            // ── NOTIFICATION ──────────────────────────────────────
            modelBuilder.Entity<Notification>(e =>
            {
                e.ToTable("Notification");
                e.HasKey(n => n.NotificationId);
                e.Property(n => n.NotificationType).IsRequired().HasMaxLength(50);
                e.Property(n => n.Title).IsRequired().HasMaxLength(150);
                e.Property(n => n.Message).IsRequired();
                e.Property(n => n.IsRead).IsRequired();
                e.Property(n => n.CreatedAt).IsRequired();

                e.HasOne<Users>()
                 .WithMany()
                 .HasForeignKey(n => n.RecipientUserId)
                 .OnDelete(DeleteBehavior.SetNull);

                e.HasOne<Equipment>()
                 .WithMany()
                 .HasForeignKey(n => n.EquipmentId)
                 .OnDelete(DeleteBehavior.SetNull);

                e.HasOne<MaintenanceRequest>()
                 .WithMany()
                 .HasForeignKey(n => n.RequestId)
                 .OnDelete(DeleteBehavior.SetNull);
            });

            // ── DEPRECIATION RECORD ───────────────────────────────
            modelBuilder.Entity<DepreciationRecord>(e =>
            {
                e.ToTable("DepreciationRecord");
                e.HasKey(d => d.DepreciationId);
                e.Property(d => d.FiscalYear).IsRequired();
                e.Property(d => d.DepreciationMethod).HasMaxLength(40);
                e.Property(d => d.OpeningBookValue).HasColumnType("decimal(12,2)");
                e.Property(d => d.DepreciationAmount).HasColumnType("decimal(12,2)");
                e.Property(d => d.AccumulatedDepreciation).HasColumnType("decimal(12,2)");
                e.Property(d => d.ClosingBookValue).HasColumnType("decimal(12,2)");

                e.HasOne<Equipment>()
                 .WithMany()
                 .HasForeignKey(d => d.EquipmentId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            // ── RETIREMENT ASSESSMENT ─────────────────────────────
            modelBuilder.Entity<RetirementAssessment>(e =>
            {
                e.ToTable("RetirementAssessment");
                e.HasKey(r => r.AssessmentId);
                e.Property(r => r.ReportingPeriod).IsRequired().HasMaxLength(40);
                e.Property(r => r.PurchaseCost).IsRequired().HasColumnType("decimal(12,2)");
                e.Property(r => r.CumulativeRepairCost).IsRequired().HasColumnType("decimal(12,2)");
                e.Property(r => r.RepairRatio).IsRequired().HasColumnType("decimal(6,2)");
                e.Property(r => r.Recommendation).HasMaxLength(60);
                e.Property(r => r.DecisionStatus).HasMaxLength(30);
                e.Property(r => r.AssessedAt).IsRequired();

                e.HasOne<Equipment>()
                 .WithMany()
                 .HasForeignKey(r => r.EquipmentId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            // ── SEED: Roles ───────────────────────────────────────
            modelBuilder.Entity<Role>().HasData(
                new Role { RoleId = 1, RoleName = "Administrator", Description = "Full system access" },
                new Role { RoleId = 2, RoleName = "Staff", Description = "Equipment and maintenance operations" }
            );
        }
    }
}
