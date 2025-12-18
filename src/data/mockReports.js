// Mock data for Reports & Analytics module

export const mockRevenueData = [
  { date: "2024-01-01", amount: 125000, count: 250 },
  { date: "2024-01-02", amount: 142000, count: 284 },
  { date: "2024-01-03", amount: 138000, count: 276 },
  { date: "2024-01-04", amount: 155000, count: 310 },
  { date: "2024-01-05", amount: 148000, count: 296 },
  { date: "2024-01-06", amount: 132000, count: 264 },
  { date: "2024-01-07", amount: 145000, count: 290 },
];

export const mockInspectionStats = {
  totalInspections: 12500,
  passed: 8750,
  failed: 3000,
  pending: 750,
  passRate: 70,
  averageInspectionTime: 45, // minutes
};

export const mockRegionalStats = [
  { region: "Addis Ababa", inspections: 4500, revenue: 2250000, passRate: 72 },
  { region: "Oromia", inspections: 3200, revenue: 1600000, passRate: 68 },
  { region: "Amhara", inspections: 2800, revenue: 1400000, passRate: 71 },
  { region: "SNNPR", inspections: 2000, revenue: 1000000, passRate: 69 },
];

export const mockFraudAlerts = [
  {
    id: "alert-001",
    type: "Geofence Violation",
    severity: "High",
    center: "Bole Center 01",
    description: "Inspection performed outside authorized geo-fence",
    timestamp: "2024-01-15T10:30:00Z",
    status: "Open",
  },
  {
    id: "alert-002",
    type: "Machine Mismatch",
    severity: "Medium",
    center: "Adama Center",
    description: "Serial number not in whitelist",
    timestamp: "2024-01-15T09:15:00Z",
    status: "Resolved",
  },
  {
    id: "alert-003",
    type: "Duplicate Inspection",
    severity: "High",
    center: "Hawassa Center",
    description: "Same vehicle inspected twice in 24 hours",
    timestamp: "2024-01-14T16:45:00Z",
    status: "Open",
  },
];

export const mockReportTemplates = [
  {
    id: "template-001",
    name: "Daily Revenue Report",
    type: "Revenue",
    frequency: "Daily",
    recipients: ["finance@rsifs.gov.et", "admin@rsifs.gov.et"],
    lastGenerated: "2024-01-15T08:00:00Z",
  },
  {
    id: "template-002",
    name: "Weekly Inspection Summary",
    type: "Inspection",
    frequency: "Weekly",
    recipients: ["operations@rsifs.gov.et"],
    lastGenerated: "2024-01-14T08:00:00Z",
  },
  {
    id: "template-003",
    name: "Monthly Regional Report",
    type: "Regional",
    frequency: "Monthly",
    recipients: ["regional@rsifs.gov.et"],
    lastGenerated: "2024-01-01T08:00:00Z",
  },
];

// Fraud trend data - showing vehicle presence violations over last 7 days
export const mockFraudTrendData = [
  { date: "2024-01-01", geofenceViolations: 2, vehiclePresenceViolations: 1, total: 3 },
  { date: "2024-01-02", geofenceViolations: 1, vehiclePresenceViolations: 3, total: 4 },
  { date: "2024-01-03", geofenceViolations: 3, vehiclePresenceViolations: 2, total: 5 },
  { date: "2024-01-04", geofenceViolations: 2, vehiclePresenceViolations: 1, total: 3 },
  { date: "2024-01-05", geofenceViolations: 4, vehiclePresenceViolations: 2, total: 6 },
  { date: "2024-01-06", geofenceViolations: 1, vehiclePresenceViolations: 4, total: 5 },
  { date: "2024-01-07", geofenceViolations: 3, vehiclePresenceViolations: 1, total: 4 },
];



