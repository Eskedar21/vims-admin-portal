// Mock fee structure data for Fee & Partial Payment Configuration

export const mockFeeStructure = {
  baseFees: [
    {
      id: "fee-001",
      inspectionType: "Initial",
      vehicleClass: "Private Car",
      amount: 350,
    },
    {
      id: "fee-002",
      inspectionType: "Initial",
      vehicleClass: "Heavy Truck",
      amount: 500,
    },
    {
      id: "fee-003",
      inspectionType: "Initial",
      vehicleClass: "Motorcycle",
      amount: 150,
    },
    {
      id: "fee-004",
      inspectionType: "Initial",
      vehicleClass: "Bus",
      amount: 600,
    },
    {
      id: "fee-005",
      inspectionType: "Retest",
      vehicleClass: "Private Car",
      amount: 200,
    },
    {
      id: "fee-006",
      inspectionType: "Retest",
      vehicleClass: "Heavy Truck",
      amount: 300,
    },
    {
      id: "fee-007",
      inspectionType: "Retest",
      vehicleClass: "Motorcycle",
      amount: 100,
    },
    {
      id: "fee-008",
      inspectionType: "Retest",
      vehicleClass: "Bus",
      amount: 350,
    },
  ],
  partialPaymentRules: [
    {
      id: "rule-001",
      component: "Brakes",
      fee: 200,
    },
    {
      id: "rule-002",
      component: "Emissions",
      fee: 150,
    },
    {
      id: "rule-003",
      component: "Suspension",
      fee: 180,
    },
    {
      id: "rule-004",
      component: "Headlights",
      fee: 100,
    },
  ],
  taxSettings: {
    vatPercent: 15,
  },
};

export const VEHICLE_CLASSES = [
  "Private Car",
  "Heavy Truck",
  "Motorcycle",
  "Bus",
  "Light Vehicle",
];

export const INSPECTION_TYPES = ["Initial", "Retest"];

export const COMPONENTS = [
  "Brakes",
  "Emissions",
  "Suspension",
  "Headlights",
  "Tires",
  "Windshield",
  "Mirrors",
  "Body Damage",
];



