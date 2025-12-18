// Mock users for the Administration (User Management) module
// Based on ADMIN_SPECS Admin-001 (User scopes)

export const mockUsers = [
  {
    id: "U-001",
    fullName: "Super Admin",
    role: "Super Admin",
    scopeType: "National",
    scopeValue: "National",
    status: "Active",
  },
  {
    id: "U-002",
    fullName: "Oromia Regional Admin",
    role: "Regional Admin",
    scopeType: "Regional",
    scopeValue: "Oromia",
    status: "Active",
  },
  {
    id: "U-003",
    fullName: "Addis Ababa Center Inspector",
    role: "Inspector",
    scopeType: "Center",
    scopeValue: "Bole Center 01",
    status: "Active",
  },
  {
    id: "U-004",
    fullName: "Suspended Inspector",
    role: "Inspector",
    scopeType: "Center",
    scopeValue: "Bahir Dar Center",
    status: "Suspended",
  },
];

export const ROLES = ["Super Admin", "Regional Admin", "Inspector"];

export const REGIONS = ["Addis Ababa", "Oromia", "Amhara", "Tigray"];

export const CENTERS = [
  "Bole Center 01",
  "Adama Center",
  "Bahir Dar Center",
  "Hawassa Center",
];



