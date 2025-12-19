// Mock data for VIMS Admin Portal (Centers, Users, etc.)

export const mockCenters = [
  {
    id: "CTR-001",
    name: "Bole Center 01",
    region: "Addis Ababa",
    city: "Bole",
    status: "Active",
    latitude: 8.9806,
    longitude: 38.7578,
  },
  {
    id: "CTR-002",
    name: "Adama Center",
    region: "Oromia",
    city: "Adama",
    status: "Active",
    latitude: 8.5400,
    longitude: 39.2700,
  },
  {
    id: "CTR-003",
    name: "Bahir Dar Center",
    region: "Amhara",
    city: "Bahir Dar",
    status: "Suspended",
    latitude: 11.5742,
    longitude: 37.3614,
  },
];

export const mockUser = {
  id: "admin-001",
  name: "Super Admin",
  email: "admin@rsifs.gov.et",
  role: "Super Administrator", // Can be "Super Administrator", "Regional Admin", "Inspector", or "Viewer"
  scopeType: "National", // National, Regional, Center
  scopeValue: null, // Region name or Center ID/name
  lastLoginAt: new Date().toISOString(),
  timezone: "Africa/Addis_Ababa",
  language: "EN", // EN or AM
};



