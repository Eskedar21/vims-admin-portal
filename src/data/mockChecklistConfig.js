// Mock visual checklist configuration data
// Based on Visual Checklist Configuration module

export const mockChecklistConfig = [
  {
    class: "Heavy Truck",
    categories: [
      {
        name: "Exterior",
        items: [
          { name: "Mirrors", photoRequiredOnFail: true },
          { name: "Mudguards", photoRequiredOnFail: true },
          { name: "Windshield", photoRequiredOnFail: true },
          { name: "Side Windows", photoRequiredOnFail: false },
          { name: "Body Damage", photoRequiredOnFail: true },
        ],
      },
      {
        name: "Lights",
        items: [
          { name: "Headlights", photoRequiredOnFail: true },
          { name: "Taillights", photoRequiredOnFail: true },
          { name: "Brake Lights", photoRequiredOnFail: true },
          { name: "Turn Signals", photoRequiredOnFail: false },
          { name: "Hazard Lights", photoRequiredOnFail: false },
        ],
      },
      {
        name: "Tires & Wheels",
        items: [
          { name: "Front Tires", photoRequiredOnFail: true },
          { name: "Rear Tires", photoRequiredOnFail: true },
          { name: "Spare Tire", photoRequiredOnFail: false },
          { name: "Wheel Condition", photoRequiredOnFail: true },
        ],
      },
      {
        name: "Safety Equipment",
        items: [
          { name: "Fire Extinguisher", photoRequiredOnFail: false },
          { name: "First Aid Kit", photoRequiredOnFail: false },
          { name: "Warning Triangle", photoRequiredOnFail: false },
        ],
      },
    ],
  },
  {
    class: "Private Car",
    categories: [
      {
        name: "Exterior",
        items: [
          { name: "Mirrors", photoRequiredOnFail: true },
          { name: "Windshield", photoRequiredOnFail: true },
          { name: "Side Windows", photoRequiredOnFail: false },
          { name: "Body Damage", photoRequiredOnFail: true },
          { name: "Bumpers", photoRequiredOnFail: true },
        ],
      },
      {
        name: "Lights",
        items: [
          { name: "Headlights", photoRequiredOnFail: true },
          { name: "Taillights", photoRequiredOnFail: true },
          { name: "Brake Lights", photoRequiredOnFail: true },
          { name: "Turn Signals", photoRequiredOnFail: false },
        ],
      },
      {
        name: "Tires & Wheels",
        items: [
          { name: "Front Tires", photoRequiredOnFail: true },
          { name: "Rear Tires", photoRequiredOnFail: true },
          { name: "Spare Tire", photoRequiredOnFail: false },
        ],
      },
    ],
  },
  {
    class: "Motorcycle",
    categories: [
      {
        name: "Exterior",
        items: [
          { name: "Mirrors", photoRequiredOnFail: true },
          { name: "Body Condition", photoRequiredOnFail: true },
        ],
      },
      {
        name: "Lights",
        items: [
          { name: "Headlight", photoRequiredOnFail: true },
          { name: "Taillight", photoRequiredOnFail: true },
          { name: "Turn Signals", photoRequiredOnFail: false },
        ],
      },
      {
        name: "Tires & Wheels",
        items: [
          { name: "Front Tire", photoRequiredOnFail: true },
          { name: "Rear Tire", photoRequiredOnFail: true },
        ],
      },
    ],
  },
  {
    class: "Bus",
    categories: [
      {
        name: "Exterior",
        items: [
          { name: "Mirrors", photoRequiredOnFail: true },
          { name: "Windshield", photoRequiredOnFail: true },
          { name: "Side Windows", photoRequiredOnFail: true },
          { name: "Body Damage", photoRequiredOnFail: true },
          { name: "Emergency Exits", photoRequiredOnFail: true },
        ],
      },
      {
        name: "Lights",
        items: [
          { name: "Headlights", photoRequiredOnFail: true },
          { name: "Taillights", photoRequiredOnFail: true },
          { name: "Brake Lights", photoRequiredOnFail: true },
          { name: "Turn Signals", photoRequiredOnFail: true },
        ],
      },
      {
        name: "Tires & Wheels",
        items: [
          { name: "Front Tires", photoRequiredOnFail: true },
          { name: "Rear Tires", photoRequiredOnFail: true },
          { name: "Spare Tire", photoRequiredOnFail: false },
        ],
      },
      {
        name: "Safety Equipment",
        items: [
          { name: "Fire Extinguisher", photoRequiredOnFail: true },
          { name: "First Aid Kit", photoRequiredOnFail: true },
          { name: "Emergency Hammer", photoRequiredOnFail: true },
        ],
      },
    ],
  },
];

