// Mock incidents data for EPIC 0 - Home Dashboard
// Based on User Story 0.3 - Live Incident Summary

export const mockIncidents = [
  {
    id: "inc-001",
    severity: "Critical",
    type: "center_offline",
    scope: { region: "Amhara", centerId: "CTR-003", centerName: "Bahir Dar Center" },
    firstDetectedAt: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
    lastSeenAt: new Date(Date.now() - 30000).toISOString(), // 30 seconds ago
    status: "Open",
    assignedToUserId: null,
    impactMetrics: { inspectionsAffectedCount: 12 },
    description: "Center has been offline for 10 minutes. All machines disconnected.",
  },
  {
    id: "inc-002",
    severity: "High",
    type: "geofence_breach",
    scope: { region: "Addis Ababa", centerId: "CTR-001", centerName: "Bole Center 01" },
    firstDetectedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    lastSeenAt: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
    status: "Open",
    assignedToUserId: null,
    impactMetrics: { inspectionsAffectedCount: 3 },
    description: "3 inspections performed outside geofence boundary (1.2km, 850m, 650m)",
  },
  {
    id: "inc-003",
    severity: "High",
    type: "machine_fault",
    scope: { region: "Oromia", centerId: "CTR-002", centerName: "Adama Center", machineId: "MACH-002", machineName: "Emissions Analyzer" },
    firstDetectedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    lastSeenAt: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
    status: "Acknowledged",
    assignedToUserId: "U-001",
    impactMetrics: { inspectionsAffectedCount: 8 },
    description: "Emissions Analyzer showing repeated connection failures. Status: Syncing",
  },
  {
    id: "inc-004",
    severity: "Medium",
    type: "camera_offline",
    scope: { region: "SNNPR", centerId: "CTR-004", centerName: "Hawassa Center", cameraId: "CAM-004" },
    firstDetectedAt: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
    lastSeenAt: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    status: "Open",
    assignedToUserId: null,
    impactMetrics: { inspectionsAffectedCount: 15 },
    description: "Camera offline for 6 hours. Last frame captured 5 minutes ago.",
  },
  {
    id: "inc-005",
    severity: "High",
    type: "evidence_gap",
    scope: { region: "Oromia", centerId: "CTR-002", centerName: "Adama Center" },
    firstDetectedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    lastSeenAt: new Date(Date.now() - 180000).toISOString(), // 3 minutes ago
    status: "Open",
    assignedToUserId: null,
    impactMetrics: { inspectionsAffectedCount: 2 },
    description: "2 inspections completed without required photos (< 3 photos captured)",
  },
  {
    id: "inc-006",
    severity: "Medium",
    type: "suspicious_activity",
    scope: { region: "Addis Ababa", centerId: "CTR-001", centerName: "Bole Center 01" },
    firstDetectedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    lastSeenAt: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
    status: "Open",
    assignedToUserId: null,
    impactMetrics: { failedLoginAttempts: 5 },
    description: "Multiple failed login attempts from IP 192.168.1.200 (5 attempts in last hour)",
  },
  {
    id: "inc-007",
    severity: "Low",
    type: "outlier_signal",
    scope: { region: "SNNPR", centerId: "CTR-004", centerName: "Hawassa Center" },
    firstDetectedAt: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
    lastSeenAt: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
    status: "Open",
    assignedToUserId: null,
    impactMetrics: { passRateSpike: 95, baselinePassRate: 72 },
    description: "Unusual pass rate spike: 95% (baseline 72%). 8 inspections in last 4 hours all passed.",
  },
  {
    id: "inc-008",
    severity: "Medium",
    type: "machine_fault",
    scope: { region: "Addis Ababa", centerId: "CTR-001", centerName: "Bole Center 01", machineId: "MACH-001", machineName: "Headlight Tester" },
    firstDetectedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    lastSeenAt: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
    status: "In Progress",
    assignedToUserId: "U-002",
    impactMetrics: { inspectionsAffectedCount: 5 },
    description: "Headlight Tester offline. Repeated calibration failures detected.",
  },
];

// Incident type labels
export const incidentTypeLabels = {
  center_offline: "Center Offline",
  geofence_breach: "Geofence Breach",
  machine_fault: "Machine Fault",
  camera_offline: "Camera Offline",
  evidence_gap: "Evidence Gap",
  suspicious_activity: "Suspicious Activity",
  outlier_signal: "Outlier Signal",
};

// Severity colors
export const severityColors = {
  Critical: "bg-red-100 text-red-800 border-red-300",
  High: "bg-orange-100 text-orange-800 border-orange-300",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Low: "bg-blue-100 text-blue-800 border-blue-300",
};

