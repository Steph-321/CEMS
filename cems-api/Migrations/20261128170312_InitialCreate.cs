using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace cems_api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CampusLocation",
                columns: table => new
                {
                    LocationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BuildingName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    RoomNumber = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CampusLocation", x => x.LocationId);
                });

            migrationBuilder.CreateTable(
                name: "EquipmentCategory",
                columns: table => new
                {
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EquipmentCategory", x => x.CategoryId);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    RoleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleName = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.RoleId);
                });

            migrationBuilder.CreateTable(
                name: "Equipment",
                columns: table => new
                {
                    EquipmentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AssetCode = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    StaffAssetTag = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    EquipmentName = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    LocationId = table.Column<int>(type: "int", nullable: false),
                    Model = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    SerialNumber = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    AssetDate = table.Column<DateOnly>(type: "date", nullable: false),
                    AcquisitionCost = table.Column<decimal>(type: "decimal(12,2)", nullable: false),
                    Condition = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: true),
                    AvailabilityStatus = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    WarrantyCoverage = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    WarrantyExpiry = table.Column<DateOnly>(type: "date", nullable: true),
                    WarrantyStatus = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Equipment", x => x.EquipmentId);
                    table.ForeignKey(
                        name: "FK_Equipment_CampusLocation_LocationId",
                        column: x => x.LocationId,
                        principalTable: "CampusLocation",
                        principalColumn: "LocationId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Equipment_EquipmentCategory_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "EquipmentCategory",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    Username = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    AccountStatus = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    LastLogin = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_User_Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Role",
                        principalColumn: "RoleId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DepreciationRecord",
                columns: table => new
                {
                    DepreciationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EquipmentId = table.Column<int>(type: "int", nullable: false),
                    FiscalYear = table.Column<int>(type: "int", nullable: false),
                    DepreciationMethod = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: true),
                    OpeningBookValue = table.Column<decimal>(type: "decimal(12,2)", nullable: true),
                    DepreciationAmount = table.Column<decimal>(type: "decimal(12,2)", nullable: true),
                    AccumulatedDepreciation = table.Column<decimal>(type: "decimal(12,2)", nullable: true),
                    ClosingBookValue = table.Column<decimal>(type: "decimal(12,2)", nullable: true),
                    CalculatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DepreciationRecord", x => x.DepreciationId);
                    table.ForeignKey(
                        name: "FK_DepreciationRecord_Equipment_EquipmentId",
                        column: x => x.EquipmentId,
                        principalTable: "Equipment",
                        principalColumn: "EquipmentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RetirementAssessment",
                columns: table => new
                {
                    AssessmentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EquipmentId = table.Column<int>(type: "int", nullable: false),
                    ReportingPeriod = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    PurchaseCost = table.Column<decimal>(type: "decimal(12,2)", nullable: false),
                    CumulativeRepairCost = table.Column<decimal>(type: "decimal(12,2)", nullable: false),
                    RepairRatio = table.Column<decimal>(type: "decimal(6,2)", nullable: false),
                    Recommendation = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    DecisionStatus = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    AssessedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RetirementAssessment", x => x.AssessmentId);
                    table.ForeignKey(
                        name: "FK_RetirementAssessment_Equipment_EquipmentId",
                        column: x => x.EquipmentId,
                        principalTable: "Equipment",
                        principalColumn: "EquipmentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AssetActivityLog",
                columns: table => new
                {
                    ActivityId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EquipmentId = table.Column<int>(type: "int", nullable: false),
                    PerformedByUserId = table.Column<int>(type: "int", nullable: true),
                    FromLocationId = table.Column<int>(type: "int", nullable: true),
                    ToLocationId = table.Column<int>(type: "int", nullable: true),
                    ActivityType = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    ActivityDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ActivityAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AssetActivityLog", x => x.ActivityId);
                    table.ForeignKey(
                        name: "FK_AssetActivityLog_CampusLocation_FromLocationId",
                        column: x => x.FromLocationId,
                        principalTable: "CampusLocation",
                        principalColumn: "LocationId",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_AssetActivityLog_CampusLocation_ToLocationId",
                        column: x => x.ToLocationId,
                        principalTable: "CampusLocation",
                        principalColumn: "LocationId");
                    table.ForeignKey(
                        name: "FK_AssetActivityLog_Equipment_EquipmentId",
                        column: x => x.EquipmentId,
                        principalTable: "Equipment",
                        principalColumn: "EquipmentId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AssetActivityLog_User_PerformedByUserId",
                        column: x => x.PerformedByUserId,
                        principalTable: "User",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "EquipmentSchedule",
                columns: table => new
                {
                    ScheduleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EquipmentId = table.Column<int>(type: "int", nullable: false),
                    LocationId = table.Column<int>(type: "int", nullable: false),
                    CoordinatorUserId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    ScheduleType = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    ScheduleDate = table.Column<DateOnly>(type: "date", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ScheduleStatus = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EquipmentSchedule", x => x.ScheduleId);
                    table.ForeignKey(
                        name: "FK_EquipmentSchedule_CampusLocation_LocationId",
                        column: x => x.LocationId,
                        principalTable: "CampusLocation",
                        principalColumn: "LocationId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EquipmentSchedule_Equipment_EquipmentId",
                        column: x => x.EquipmentId,
                        principalTable: "Equipment",
                        principalColumn: "EquipmentId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EquipmentSchedule_User_CoordinatorUserId",
                        column: x => x.CoordinatorUserId,
                        principalTable: "User",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "EquipmentStatusHistory",
                columns: table => new
                {
                    StatusHistoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EquipmentId = table.Column<int>(type: "int", nullable: false),
                    ChangedByUserId = table.Column<int>(type: "int", nullable: false),
                    PreviousStatus = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: true),
                    NewStatus = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    PreviousCondition = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: true),
                    NewCondition = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: true),
                    ChangeNotes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ChangedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EquipmentStatusHistory", x => x.StatusHistoryId);
                    table.ForeignKey(
                        name: "FK_EquipmentStatusHistory_Equipment_EquipmentId",
                        column: x => x.EquipmentId,
                        principalTable: "Equipment",
                        principalColumn: "EquipmentId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EquipmentStatusHistory_User_ChangedByUserId",
                        column: x => x.ChangedByUserId,
                        principalTable: "User",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Inspection",
                columns: table => new
                {
                    InspectionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EquipmentId = table.Column<int>(type: "int", nullable: false),
                    InspectorUserId = table.Column<int>(type: "int", nullable: false),
                    InspectionType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ScheduledDate = table.Column<DateOnly>(type: "date", nullable: true),
                    InspectedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ChecklistResults = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InspectionNotes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Outcome = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: true),
                    NextInspectionDate = table.Column<DateOnly>(type: "date", nullable: true),
                    PhotoUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inspection", x => x.InspectionId);
                    table.ForeignKey(
                        name: "FK_Inspection_Equipment_EquipmentId",
                        column: x => x.EquipmentId,
                        principalTable: "Equipment",
                        principalColumn: "EquipmentId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Inspection_User_InspectorUserId",
                        column: x => x.InspectorUserId,
                        principalTable: "User",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MaintenanceRequest",
                columns: table => new
                {
                    RequestId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EquipmentId = table.Column<int>(type: "int", nullable: false),
                    ReporterUserId = table.Column<int>(type: "int", nullable: false),
                    IssueCategory = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    Severity = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AttachmentUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    SubmittedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RequestStatus = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaintenanceRequest", x => x.RequestId);
                    table.ForeignKey(
                        name: "FK_MaintenanceRequest_Equipment_EquipmentId",
                        column: x => x.EquipmentId,
                        principalTable: "Equipment",
                        principalColumn: "EquipmentId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MaintenanceRequest_User_ReporterUserId",
                        column: x => x.ReporterUserId,
                        principalTable: "User",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MaintenanceAssignment",
                columns: table => new
                {
                    AssignmentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RequestId = table.Column<int>(type: "int", nullable: false),
                    StaffUserId = table.Column<int>(type: "int", nullable: false),
                    AssignedByUserId = table.Column<int>(type: "int", nullable: true),
                    AssignedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AssignmentStatus = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaintenanceAssignment", x => x.AssignmentId);
                    table.ForeignKey(
                        name: "FK_MaintenanceAssignment_MaintenanceRequest_RequestId",
                        column: x => x.RequestId,
                        principalTable: "MaintenanceRequest",
                        principalColumn: "RequestId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MaintenanceAssignment_User_AssignedByUserId",
                        column: x => x.AssignedByUserId,
                        principalTable: "User",
                        principalColumn: "UserId");
                    table.ForeignKey(
                        name: "FK_MaintenanceAssignment_User_StaffUserId",
                        column: x => x.StaffUserId,
                        principalTable: "User",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MaintenanceLog",
                columns: table => new
                {
                    MaintenanceLogId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RequestId = table.Column<int>(type: "int", nullable: false),
                    TechnicianId = table.Column<int>(type: "int", nullable: false),
                    ActionPerformed = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    RepairSteps = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PartsReplaced = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RepairCost = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    MaintenanceStatus = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    StartedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EvidenceUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaintenanceLog", x => x.MaintenanceLogId);
                    table.ForeignKey(
                        name: "FK_MaintenanceLog_MaintenanceRequest_RequestId",
                        column: x => x.RequestId,
                        principalTable: "MaintenanceRequest",
                        principalColumn: "RequestId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MaintenanceLog_User_TechnicianId",
                        column: x => x.TechnicianId,
                        principalTable: "User",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Notification",
                columns: table => new
                {
                    NotificationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RecipientUserId = table.Column<int>(type: "int", nullable: true),
                    EquipmentId = table.Column<int>(type: "int", nullable: true),
                    RequestId = table.Column<int>(type: "int", nullable: true),
                    NotificationType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsRead = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notification", x => x.NotificationId);
                    table.ForeignKey(
                        name: "FK_Notification_Equipment_EquipmentId",
                        column: x => x.EquipmentId,
                        principalTable: "Equipment",
                        principalColumn: "EquipmentId",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Notification_MaintenanceRequest_RequestId",
                        column: x => x.RequestId,
                        principalTable: "MaintenanceRequest",
                        principalColumn: "RequestId",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Notification_User_RecipientUserId",
                        column: x => x.RecipientUserId,
                        principalTable: "User",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "RoleId", "Description", "RoleName" },
                values: new object[,]
                {
                    { 1, "Full system access", "Administrator" },
                    { 2, "Equipment and maintenance operations", "Staff" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AssetActivityLog_EquipmentId",
                table: "AssetActivityLog",
                column: "EquipmentId");

            migrationBuilder.CreateIndex(
                name: "IX_AssetActivityLog_FromLocationId",
                table: "AssetActivityLog",
                column: "FromLocationId");

            migrationBuilder.CreateIndex(
                name: "IX_AssetActivityLog_PerformedByUserId",
                table: "AssetActivityLog",
                column: "PerformedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AssetActivityLog_ToLocationId",
                table: "AssetActivityLog",
                column: "ToLocationId");

            migrationBuilder.CreateIndex(
                name: "IX_DepreciationRecord_EquipmentId",
                table: "DepreciationRecord",
                column: "EquipmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Equipment_AssetCode",
                table: "Equipment",
                column: "AssetCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Equipment_CategoryId",
                table: "Equipment",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Equipment_LocationId",
                table: "Equipment",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_EquipmentSchedule_CoordinatorUserId",
                table: "EquipmentSchedule",
                column: "CoordinatorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_EquipmentSchedule_EquipmentId",
                table: "EquipmentSchedule",
                column: "EquipmentId");

            migrationBuilder.CreateIndex(
                name: "IX_EquipmentSchedule_LocationId",
                table: "EquipmentSchedule",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_EquipmentStatusHistory_ChangedByUserId",
                table: "EquipmentStatusHistory",
                column: "ChangedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_EquipmentStatusHistory_EquipmentId",
                table: "EquipmentStatusHistory",
                column: "EquipmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Inspection_EquipmentId",
                table: "Inspection",
                column: "EquipmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Inspection_InspectorUserId",
                table: "Inspection",
                column: "InspectorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MaintenanceAssignment_AssignedByUserId",
                table: "MaintenanceAssignment",
                column: "AssignedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MaintenanceAssignment_RequestId",
                table: "MaintenanceAssignment",
                column: "RequestId");

            migrationBuilder.CreateIndex(
                name: "IX_MaintenanceAssignment_StaffUserId",
                table: "MaintenanceAssignment",
                column: "StaffUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MaintenanceLog_RequestId",
                table: "MaintenanceLog",
                column: "RequestId");

            migrationBuilder.CreateIndex(
                name: "IX_MaintenanceLog_TechnicianId",
                table: "MaintenanceLog",
                column: "TechnicianId");

            migrationBuilder.CreateIndex(
                name: "IX_MaintenanceRequest_EquipmentId",
                table: "MaintenanceRequest",
                column: "EquipmentId");

            migrationBuilder.CreateIndex(
                name: "IX_MaintenanceRequest_ReporterUserId",
                table: "MaintenanceRequest",
                column: "ReporterUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_EquipmentId",
                table: "Notification",
                column: "EquipmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_RecipientUserId",
                table: "Notification",
                column: "RecipientUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_RequestId",
                table: "Notification",
                column: "RequestId");

            migrationBuilder.CreateIndex(
                name: "IX_RetirementAssessment_EquipmentId",
                table: "RetirementAssessment",
                column: "EquipmentId");

            migrationBuilder.CreateIndex(
                name: "IX_User_Email",
                table: "User",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_User_RoleId",
                table: "User",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_User_Username",
                table: "User",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AssetActivityLog");

            migrationBuilder.DropTable(
                name: "DepreciationRecord");

            migrationBuilder.DropTable(
                name: "EquipmentSchedule");

            migrationBuilder.DropTable(
                name: "EquipmentStatusHistory");

            migrationBuilder.DropTable(
                name: "Inspection");

            migrationBuilder.DropTable(
                name: "MaintenanceAssignment");

            migrationBuilder.DropTable(
                name: "MaintenanceLog");

            migrationBuilder.DropTable(
                name: "Notification");

            migrationBuilder.DropTable(
                name: "RetirementAssessment");

            migrationBuilder.DropTable(
                name: "MaintenanceRequest");

            migrationBuilder.DropTable(
                name: "Equipment");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "CampusLocation");

            migrationBuilder.DropTable(
                name: "EquipmentCategory");

            migrationBuilder.DropTable(
                name: "Role");
        }
    }
}
