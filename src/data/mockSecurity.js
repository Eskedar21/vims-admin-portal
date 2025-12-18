// Mock data for Security module

export const mockAuditLogs = [
  {
    id: "log-001",
    timestamp: "2024-01-15T10:30:00Z",
    user: "admin@rsifs.gov.et",
    action: "User Created",
    resource: "User Management",
    details: "Created user: abebe.tesfaye@rsifs.gov.et",
    ipAddress: "192.168.1.100",
    status: "Success",
  },
  {
    id: "log-002",
    timestamp: "2024-01-15T09:15:00Z",
    user: "regional.admin@rsifs.gov.et",
    action: "Configuration Updated",
    resource: "Test Standards",
    details: "Updated threshold for Heavy Truck - Brake Efficiency",
    ipAddress: "192.168.1.105",
    status: "Success",
  },
  {
    id: "log-003",
    timestamp: "2024-01-15T08:45:00Z",
    user: "unknown",
    action: "Failed Login",
    resource: "Authentication",
    details: "Invalid credentials attempted",
    ipAddress: "192.168.1.200",
    status: "Failed",
  },
  {
    id: "log-004",
    timestamp: "2024-01-14T16:20:00Z",
    user: "admin@rsifs.gov.et",
    action: "Center Deleted",
    resource: "Center Management",
    details: "Deleted center: Test Center 01",
    ipAddress: "192.168.1.100",
    status: "Success",
  },
  {
    id: "log-005",
    timestamp: "2024-01-14T14:10:00Z",
    user: "inspector@rsifs.gov.et",
    action: "Data Export",
    resource: "Reports",
    details: "Exported inspection report (PDF)",
    ipAddress: "192.168.1.150",
    status: "Success",
  },
];

export const mockAccessLogs = [
  {
    id: "access-001",
    timestamp: "2024-01-15T10:30:00Z",
    user: "admin@rsifs.gov.et",
    ipAddress: "192.168.1.100",
    location: "Addis Ababa, Ethiopia",
    device: "Chrome on Windows",
    sessionDuration: "2h 15m",
    status: "Active",
  },
  {
    id: "access-002",
    timestamp: "2024-01-15T09:00:00Z",
    user: "regional.admin@rsifs.gov.et",
    ipAddress: "192.168.1.105",
    location: "Adama, Ethiopia",
    device: "Firefox on Windows",
    sessionDuration: "1h 30m",
    status: "Active",
  },
  {
    id: "access-003",
    timestamp: "2024-01-15T08:00:00Z",
    user: "inspector@rsifs.gov.et",
    ipAddress: "192.168.1.150",
    location: "Hawassa, Ethiopia",
    device: "Chrome on Android",
    sessionDuration: "45m",
    status: "Ended",
  },
];

export const mockSecuritySettings = {
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expirationDays: 90,
  },
  sessionSettings: {
    timeoutMinutes: 30,
    maxConcurrentSessions: 3,
    requireMFA: false,
  },
  ipWhitelist: [
    { id: "ip-001", ip: "192.168.1.0/24", description: "Office Network" },
    { id: "ip-002", ip: "10.0.0.0/8", description: "Internal Network" },
  ],
};

export const mockSecurityAlerts = [
  {
    id: "alert-001",
    type: "Suspicious Login",
    severity: "High",
    description: "Multiple failed login attempts from IP 192.168.1.200",
    timestamp: "2024-01-15T08:45:00Z",
    status: "Open",
  },
  {
    id: "alert-002",
    type: "Unusual Activity",
    severity: "Medium",
    description: "User accessed data outside assigned scope",
    timestamp: "2024-01-14T15:30:00Z",
    status: "Resolved",
  },
  {
    id: "alert-003",
    type: "Session Anomaly",
    severity: "Low",
    description: "Multiple concurrent sessions from different locations",
    timestamp: "2024-01-13T12:00:00Z",
    status: "Open",
  },
];



