// Mock inspections data for Inspection Detail View
// Based on User Story Admin-010 (Single Source of Truth)

// Extended mock data for dashboard
export const mockInspectionsExtended = [
  {
    id: "VIS-2025-0023",
    vehicle: {
      plate: "ET 12345A",
      vin: "1HGBH41JXMN109186",
      make: "Toyota",
      model: "Hiace",
      type: "Passenger Car",
      owner: {
        name: "Alemayehu Bekele",
        phone: "+251911234567",
        idNumber: "ET-1234567890",
      },
    },
    status: "Passed",
    paymentStatus: "Paid",
    syncStatus: "Synced",
    type: "Initial Inspection",
    amount: 350,
    inspectionDate: "2025-11-26T09:45:00Z",
    machineResults: [
      {
        test: "Brakes",
        val: "78%",
        status: "Pass",
        timestamp: "2025-11-26T09:45:00Z",
      },
      {
        test: "Emissions",
        val: "2.1%",
        status: "Pass",
        timestamp: "2025-11-26T09:47:00Z",
      },
      {
        test: "Suspension",
        val: "82%",
        status: "Pass",
        timestamp: "2025-11-26T09:49:00Z",
      },
      {
        test: "Headlights",
        val: "Pass",
        status: "Pass",
        timestamp: "2025-11-26T09:51:00Z",
      },
    ],
    visualResults: [
      {
        item: "Tires",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      },
      {
        item: "Windshield",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
      },
      {
        item: "Mirrors",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
      },
      {
        item: "Lights",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80",
      },
      {
        item: "Body Damage",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
      },
    ],
    meta: {
      inspectorName: "Abebe Kebede",
      center: "Bole Center 01",
      geoFenceStatus: "Valid",
      location: { lat: 8.9806, lng: 38.7578 },
    },
  },
  {
    id: "VIS-2025-0022",
    vehicle: {
      plate: "ET 87923B",
      vin: "2HGBH41JXMN109187",
      make: "Isuzu",
      model: "NPR",
      type: "Mini Bus",
      owner: {
        name: "Sara Tesfaye",
        phone: "+251922345678",
        idNumber: "ET-2345678901",
      },
    },
    status: "Failed",
    paymentStatus: "Paid",
    syncStatus: "Synced",
    type: "Re-inspection",
    amount: 350,
    inspectionDate: "2025-11-26T09:12:00Z",
    machineResults: [
      {
        test: "Brakes",
        val: "45%",
        status: "Fail",
        timestamp: "2025-11-26T09:12:00Z",
      },
      {
        test: "Emissions",
        val: "4.8%",
        status: "Fail",
        timestamp: "2025-11-26T09:14:00Z",
      },
      {
        test: "Suspension",
        val: "52%",
        status: "Pass",
        timestamp: "2025-11-26T09:16:00Z",
      },
    ],
    visualResults: [
      {
        item: "Tires",
        status: "Fail",
        photoUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      },
      {
        item: "Windshield",
        status: "Fail",
        photoUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
      },
      {
        item: "Mirrors",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
      },
      {
        item: "Lights",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80",
      },
      {
        item: "Body Damage",
        status: "Fail",
        photoUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
      },
    ],
    meta: {
      inspectorName: "Sara Tesfaye",
      center: "Adama Center",
      geoFenceStatus: "Valid",
      location: { lat: 8.5400, lng: 39.2700 },
    },
  },
  {
    id: "VIS-2025-0021",
    vehicle: {
      plate: "ET 29487C",
      vin: "3HGBH41JXMN109188",
      make: "Mercedes",
      model: "Actros",
      type: "Cargo Truck",
      owner: {
        name: "Dawit Haile",
        phone: "+251933456789",
        idNumber: "ET-3456789012",
      },
    },
    status: "Passed",
    paymentStatus: "Pending",
    syncStatus: "Pending",
    type: "Initial Inspection",
    amount: 500,
    inspectionDate: "2025-11-26T08:55:00Z",
    machineResults: [
      {
        test: "Brakes",
        val: "68%",
        status: "Pass",
        timestamp: "2025-11-26T08:55:00Z",
      },
      {
        test: "Emissions",
        val: "3.5%",
        status: "Pass",
        timestamp: "2025-11-26T08:57:00Z",
      },
      {
        test: "Suspension",
        val: "75%",
        status: "Pass",
        timestamp: "2025-11-26T08:59:00Z",
      },
    ],
    visualResults: [
      {
        item: "Tires",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      },
      {
        item: "Windshield",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
      },
      {
        item: "Mirrors",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
      },
      {
        item: "Lights",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80",
      },
      {
        item: "Body Damage",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
      },
    ],
    meta: {
      inspectorName: "Abebe Kebede",
      center: "Bole Center 01",
      geoFenceStatus: "Valid",
      location: { lat: 8.9806, lng: 38.7578 },
    },
  },
  {
    id: "VIS-2025-0020",
    vehicle: {
      plate: "ET 85216Z",
      vin: "4HGBH41JXMN109189",
      make: "Toyota",
      model: "Corolla",
      type: "Passenger Car",
      owner: {
        name: "Meron Tadesse",
        phone: "+251944567890",
        idNumber: "ET-4567890123",
      },
    },
    status: "Passed",
    paymentStatus: "Paid",
    syncStatus: "Synced",
    type: "Initial Inspection",
    amount: 350,
    inspectionDate: "2025-11-25T16:30:00Z",
    machineResults: [
      {
        test: "Brakes",
        val: "72%",
        status: "Pass",
        timestamp: "2025-11-25T16:30:00Z",
      },
      {
        test: "Emissions",
        val: "2.8%",
        status: "Pass",
        timestamp: "2025-11-25T16:32:00Z",
      },
      {
        test: "Suspension",
        val: "80%",
        status: "Pass",
        timestamp: "2025-11-25T16:34:00Z",
      },
    ],
    visualResults: [
      {
        item: "Tires",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      },
      {
        item: "Windshield",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
      },
      {
        item: "Mirrors",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
      },
      {
        item: "Lights",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80",
      },
      {
        item: "Body Damage",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
      },
    ],
    meta: {
      inspectorName: "Dawit Haile",
      center: "Hawassa Center",
      geoFenceStatus: "Valid",
      location: { lat: 7.0621, lng: 38.4764 },
    },
  },
  {
    id: "VIS-2025-0019",
    vehicle: {
      plate: "ET 44821D",
      vin: "5HGBH41JXMN109190",
      make: "Honda",
      model: "CBR",
      type: "Motorcycle",
      owner: {
        name: "Kebede Haile",
        phone: "+251955678901",
        idNumber: "ET-5678901234",
      },
    },
    status: "Passed",
    paymentStatus: "Paid",
    syncStatus: "Synced",
    type: "Initial Inspection",
    amount: 150,
    inspectionDate: "2025-11-25T15:20:00Z",
    machineResults: [
      {
        test: "Brakes",
        val: "65%",
        status: "Pass",
        timestamp: "2025-11-25T15:20:00Z",
      },
      {
        test: "Emissions",
        val: "1.8%",
        status: "Pass",
        timestamp: "2025-11-25T15:22:00Z",
      },
    ],
    visualResults: [
      {
        item: "Tires",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      },
      {
        item: "Windshield",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
      },
      {
        item: "Mirrors",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
      },
      {
        item: "Lights",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80",
      },
      {
        item: "Body Damage",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
      },
    ],
    meta: {
      inspectorName: "Sara Tesfaye",
      center: "Adama Center",
      geoFenceStatus: "Valid",
      location: { lat: 8.5400, lng: 39.2700 },
    },
  },
];

export const mockInspections = [
  {
    id: "INS-001",
    vehicle: {
      plate: "3-12345",
      vin: "1HGBH41JXMN109186",
      make: "Toyota",
      model: "Hiace",
      owner: {
        name: "Alemayehu Bekele",
        phone: "+251911234567",
        idNumber: "ET-1234567890",
      },
    },
    status: "Failed",
    paymentStatus: "Paid",
    type: "Re-inspection",
    machineResults: [
      {
        test: "Brakes",
        val: "45%",
        status: "Fail",
        timestamp: "2024-01-15T10:30:00Z",
      },
      {
        test: "Emissions",
        val: "3.2%",
        status: "Pass",
        timestamp: "2024-01-15T10:35:00Z",
      },
      {
        test: "Suspension",
        val: "52%",
        status: "Pass",
        timestamp: "2024-01-15T10:40:00Z",
      },
      {
        test: "Headlights",
        val: "Pass",
        status: "Pass",
        timestamp: "2024-01-15T10:45:00Z",
      },
    ],
    visualResults: [
      {
        item: "Tires",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      },
      {
        item: "Windshield",
        status: "Fail",
        photoUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
      },
      {
        item: "Mirrors",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
      },
      {
        item: "Lights",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80",
      },
      {
        item: "Body Damage",
        status: "Fail",
        photoUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
      },
    ],
    meta: {
      inspectorName: "Abebe Tesfaye",
      center: "Bole Center 01",
      geoFenceStatus: "Valid",
      inspectionDate: "2024-01-15T10:25:00Z",
      location: {
        lat: 8.9806,
        lng: 38.7578,
      },
    },
  },
  {
    id: "INS-002",
    vehicle: {
      plate: "1-ABCDE",
      vin: "5YJSA1E11HF123456",
      make: "Tesla",
      model: "Model 3",
      owner: {
        name: "Meron Tadesse",
        phone: "+251922345678",
        idNumber: "ET-0987654321",
      },
    },
    status: "Passed",
    paymentStatus: "Paid",
    type: "Initial Inspection",
    machineResults: [
      {
        test: "Brakes",
        val: "78%",
        status: "Pass",
        timestamp: "2024-01-16T14:20:00Z",
      },
      {
        test: "Emissions",
        val: "0.5%",
        status: "Pass",
        timestamp: "2024-01-16T14:25:00Z",
      },
      {
        test: "Suspension",
        val: "85%",
        status: "Pass",
        timestamp: "2024-01-16T14:30:00Z",
      },
    ],
    visualResults: [
      {
        item: "Tires",
        status: "Pass",
        photoUrl: null,
      },
      {
        item: "Windshield",
        status: "Pass",
        photoUrl: null,
      },
      {
        item: "Mirrors",
        status: "Pass",
        photoUrl: null,
      },
      {
        item: "Lights",
        status: "Pass",
        photoUrl: null,
      },
      {
        item: "Body Damage",
        status: "Pass",
        photoUrl: null,
      },
    ],
    meta: {
      inspectorName: "Kebede Haile",
      center: "Adama Center",
      geoFenceStatus: "Valid",
      inspectionDate: "2024-01-16T14:15:00Z",
      location: {
        lat: 8.5400,
        lng: 39.2700,
      },
    },
  },
  // Fraud violation examples for testing
  {
    id: "VIS-2025-0025",
    vehicle: {
      plate: "ET 99999X",
      vin: "9HGBH41JXMN109999",
      make: "Toyota",
      model: "Corolla",
      type: "Passenger Car",
      owner: {
        name: "Test Owner",
        phone: "+251911111111",
        idNumber: "ET-9999999999",
      },
    },
    status: "Passed",
    paymentStatus: "Paid",
    syncStatus: "Synced",
    type: "Initial Inspection",
    amount: 350,
    inspectionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    machineResults: [
      {
        test: "Brakes",
        val: "75%",
        status: "Pass",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    visualResults: [
      // Only 1 photo - vehicle presence violation
      {
        item: "Tires",
        status: "Pass",
        photoUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      },
    ],
    meta: {
      inspectorName: "Test Inspector",
      center: "Bole Center 01",
      geoFenceStatus: "Invalid",
      location: { lat: 9.0806, lng: 38.8578 }, // Outside geofence (far from center)
      inspectionDuration: 3, // Too quick - suspicious
    },
  },
  {
    id: "VIS-2025-0026",
    vehicle: {
      plate: "ET 88888Y",
      vin: "8HGBH41JXMN109888",
      make: "Honda",
      model: "Civic",
      type: "Passenger Car",
      owner: {
        name: "Test Owner 2",
        phone: "+251922222222",
        idNumber: "ET-8888888888",
      },
    },
    status: "Passed",
    paymentStatus: "Paid",
    syncStatus: "Synced",
    type: "Initial Inspection",
    amount: 350,
    inspectionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    machineResults: [], // No machine results - vehicle presence violation
    visualResults: [], // No visual results - vehicle presence violation
    meta: {
      inspectorName: "Test Inspector 2",
      center: "Adama Center",
      geoFenceStatus: "Unknown",
      location: { lat: 8.8400, lng: 39.4700 }, // Outside geofence
    },
  },
];
