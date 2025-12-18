// Mock centers data for Center Management Module
// Based on User Story Admin-003 (Center Geo-Fencing) and Admin-009 (System Monitoring)

export const mockCenters = [
  {
    id: "CTR-001",
    name: "Bole Center 01",
    region: "Addis Ababa",
    status: "Online",
    lat: 8.9806,
    lng: 38.7578,
    radius: 500, // meters
    lastHeartbeat: new Date(Date.now() - 30000).toISOString(), // 30 seconds ago
    machineStatus: [
      { name: "Brake Tester", status: "Online" },
      { name: "Emissions Analyzer", status: "Online" },
      { name: "Suspension Tester", status: "Online" },
      { name: "Headlight Tester", status: "Online" },
    ],
  },
  {
    id: "CTR-002",
    name: "Adama Center",
    region: "Oromia",
    status: "Syncing",
    lat: 8.5400,
    lng: 39.2700,
    radius: 750, // meters
    lastHeartbeat: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
    machineStatus: [
      { name: "Brake Tester", status: "Online" },
      { name: "Emissions Analyzer", status: "Syncing" },
      { name: "Suspension Tester", status: "Online" },
      { name: "Headlight Tester", status: "Offline" },
    ],
  },
  {
    id: "CTR-003",
    name: "Bahir Dar Center",
    region: "Amhara",
    status: "Offline",
    lat: 11.5742,
    lng: 37.3614,
    radius: 600, // meters
    lastHeartbeat: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
    machineStatus: [
      { name: "Brake Tester", status: "Offline" },
      { name: "Emissions Analyzer", status: "Offline" },
      { name: "Suspension Tester", status: "Offline" },
      { name: "Headlight Tester", status: "Offline" },
    ],
  },
  {
    id: "CTR-004",
    name: "Hawassa Center",
    region: "SNNPR",
    status: "Online",
    lat: 7.0621,
    lng: 38.4764,
    radius: 800, // meters
    lastHeartbeat: new Date(Date.now() - 15000).toISOString(), // 15 seconds ago
    machineStatus: [
      { name: "Brake Tester", status: "Online" },
      { name: "Emissions Analyzer", status: "Online" },
      { name: "Suspension Tester", status: "Online" },
      { name: "Headlight Tester", status: "Online" },
    ],
  },
  {
    id: "CTR-005",
    name: "Mekelle Center",
    region: "Tigray",
    status: "Offline",
    lat: 13.4969,
    lng: 39.4753,
    radius: 550, // meters
    lastHeartbeat: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
    machineStatus: [
      { name: "Brake Tester", status: "Offline" },
      { name: "Emissions Analyzer", status: "Offline" },
      { name: "Suspension Tester", status: "Offline" },
      { name: "Headlight Tester", status: "Offline" },
    ],
  },
];

