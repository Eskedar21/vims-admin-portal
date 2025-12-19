// Mock inspections data for Inspection Detail View
// Based on User Story Admin-010 (Single Source of Truth)

// Helper function to generate dates relative to today
const getDateRelativeToToday = (daysAgo = 0, hoursAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
};

// Helper function to get relevant inspection photo based on item type
const getInspectionPhoto = (item) => {
  const itemPhotoMap = {
    "Tires": "/vec1.jpg",
    "Windshield": "/vec2.jpg",
    "Mirrors": "/vec3.jpg",
    "Lights": "/vec4.jpg",
    "Body Damage": "/vec5.jpeg",
  };
  // Use mapped photo or fallback to random image
  const images = ["/vec1.jpg", "/vec2.jpg", "/vec3.jpg", "/vec4.jpg", "/vec5.jpeg", "/vec6.webp", "/vec8.jpg", "/vec9.avif", "/vec10.jpeg"];
  return itemPhotoMap[item] || images[Math.floor(Math.random() * images.length)];
};

// Helper function to generate random date within a range
const getRandomDate = (daysAgoMin, daysAgoMax) => {
  const daysAgo = Math.floor(Math.random() * (daysAgoMax - daysAgoMin + 1)) + daysAgoMin;
  const hoursAgo = Math.floor(Math.random() * 24);
  return getDateRelativeToToday(daysAgo, hoursAgo);
};

// Generate realistic inspection data
const generateInspection = (id, daysAgo, options = {}) => {
  const makes = ["Toyota", "Isuzu", "Mercedes", "Honda", "Nissan", "Hyundai", "Mitsubishi", "Ford", "Volkswagen", "Mazda"];
  const models = {
    "Toyota": ["Hiace", "Corolla", "Camry", "Land Cruiser", "Rav4", "Yaris"],
    "Isuzu": ["NPR", "NQR", "D-Max", "Trooper"],
    "Mercedes": ["Actros", "Sprinter", "Atego", "Axor"],
    "Honda": ["Civic", "Accord", "CR-V", "CBR"],
    "Nissan": ["Patrol", "Navara", "Urvan", "Almera"],
    "Hyundai": ["Tucson", "Santa Fe", "H100", "i10"],
    "Mitsubishi": ["L200", "Pajero", "Canter"],
    "Ford": ["Ranger", "Transit", "Everest"],
    "Volkswagen": ["Amarok", "Transporter"],
    "Mazda": ["BT-50", "CX-5", "Demio"]
  };
  const vehicleTypes = ["Passenger Car", "Mini Bus", "Cargo Truck", "Motorcycle", "SUV", "Pickup"];
  const inspectionTypes = ["Initial Inspection", "Retest", "Re-inspection"];
  const statuses = ["Passed", "Failed", "Pending"];
  const centers = ["Bole Center 01", "Adama Center", "Hawassa Center", "Bahir Dar Center", "Mekelle Center", "Dire Dawa Center"];
  const inspectors = ["Abebe Kebede", "Sara Tesfaye", "Dawit Haile", "Meron Tadesse", "Kebede Haile", "Tigist Worku", "Yonas Alemayehu", "Betty Assefa"];
  
  const make = options.make || makes[Math.floor(Math.random() * makes.length)];
  const model = options.model || models[make][Math.floor(Math.random() * models[make].length)];
  const vehicleType = options.vehicleType || vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
  const status = options.status || statuses[Math.floor(Math.random() * statuses.length)];
  const inspectionType = options.type || inspectionTypes[Math.floor(Math.random() * inspectionTypes.length)];
  const center = options.center || centers[Math.floor(Math.random() * centers.length)];
  const inspector = options.inspector || inspectors[Math.floor(Math.random() * inspectors.length)];
  
  const platePrefix = ["ET", "1", "2", "3", "4", "5"];
  const plate = `${platePrefix[Math.floor(Math.random() * platePrefix.length)]} ${Math.floor(Math.random() * 90000) + 10000}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
  const vin = `${Math.floor(Math.random() * 10)}HGBH41JXMN${Math.floor(Math.random() * 900000) + 100000}`;
  
  const ownerNames = [
    "Alemayehu Bekele", "Sara Tesfaye", "Dawit Haile", "Meron Tadesse", "Kebede Haile",
    "Tigist Worku", "Yonas Alemayehu", "Betty Assefa", "Getachew Mekonnen", "Hirut Assefa",
    "Solomon Gebre", "Marta Tadesse", "Daniel Yohannes", "Eden Tesfaye", "Bereket Haile"
  ];
  const ownerName = ownerNames[Math.floor(Math.random() * ownerNames.length)];
  const phone = `+2519${Math.floor(Math.random() * 90000000) + 10000000}`;
  const idNumber = `ET-${Math.floor(Math.random() * 9000000000) + 1000000000}`;
  
  const inspectionDate = getRandomDate(daysAgo, daysAgo);
  const cycleTime = Math.floor(Math.random() * 20) + 35; // 35-55 minutes
  
  // Generate machine results based on status
  const brakeVal = status === "Passed" ? Math.floor(Math.random() * 20) + 65 : Math.floor(Math.random() * 20) + 40;
  const emissionVal = status === "Passed" ? (Math.random() * 2 + 1).toFixed(1) : (Math.random() * 2 + 4).toFixed(1);
  const suspensionVal = status === "Passed" ? Math.floor(Math.random() * 20) + 65 : Math.floor(Math.random() * 20) + 45;
  
  const machineResults = [
    {
      test: "Brakes",
      val: `${brakeVal}%`,
      status: brakeVal >= 60 ? "Pass" : "Fail",
      timestamp: inspectionDate,
    },
    {
      test: "Emissions",
      val: `${emissionVal}%`,
      status: parseFloat(emissionVal) <= 3.5 ? "Pass" : "Fail",
      timestamp: inspectionDate,
    },
    {
      test: "Suspension",
      val: `${suspensionVal}%`,
      status: suspensionVal >= 60 ? "Pass" : "Fail",
      timestamp: inspectionDate,
    },
  ];
  
  if (vehicleType !== "Motorcycle") {
    machineResults.push({
      test: "Headlights",
      val: "Pass",
      status: status === "Passed" ? "Pass" : (Math.random() > 0.7 ? "Pass" : "Fail"),
      timestamp: inspectionDate,
    });
  }
  
  const visualResults = [
    { item: "Tires", status: status === "Passed" ? "Pass" : (Math.random() > 0.6 ? "Pass" : "Fail"), photoUrl: getInspectionPhoto("Tires") },
    { item: "Windshield", status: status === "Passed" ? "Pass" : (Math.random() > 0.7 ? "Pass" : "Fail"), photoUrl: getInspectionPhoto("Windshield") },
    { item: "Mirrors", status: status === "Passed" ? "Pass" : (Math.random() > 0.8 ? "Pass" : "Fail"), photoUrl: getInspectionPhoto("Mirrors") },
    { item: "Lights", status: status === "Passed" ? "Pass" : (Math.random() > 0.7 ? "Pass" : "Fail"), photoUrl: getInspectionPhoto("Lights") },
    { item: "Body Damage", status: status === "Passed" ? "Pass" : (Math.random() > 0.6 ? "Pass" : "Fail"), photoUrl: getInspectionPhoto("Body Damage") },
  ];
  
  const centerLocations = {
    "Bole Center 01": { lat: 8.9806, lng: 38.7578 },
    "Adama Center": { lat: 8.5400, lng: 39.2700 },
    "Hawassa Center": { lat: 7.0621, lng: 38.4764 },
    "Bahir Dar Center": { lat: 11.6000, lng: 37.3833 },
    "Mekelle Center": { lat: 13.4969, lng: 39.4769 },
    "Dire Dawa Center": { lat: 9.6000, lng: 41.8667 }
  };
  
  const amount = vehicleType === "Motorcycle" ? 150 : vehicleType === "Cargo Truck" ? 500 : 350;
  const paymentStatus = Math.random() > 0.2 ? "Paid" : "Pending";
  const syncStatus = paymentStatus === "Paid" ? "Synced" : "Pending";
  
  // Add video evidence for inspection center (50% chance)
  const hasVideoEvidence = Math.random() > 0.5;
  const videoEvidence = hasVideoEvidence ? {
    url: "/Download.mp4",
    type: "inspection_video",
    timestamp: inspectionDate,
    duration: Math.floor(Math.random() * 120) + 60, // 60-180 seconds
    description: "Vehicle inspection process at center",
  } : null;
  
  // Add evidence data with photos and videos
  const evidence = {
    evidence_completeness_status: "Complete",
    entry_video: {
      url: "/Download.mp4",
      thumbnail: getInspectionPhoto("Tires"),
      description: "Vehicle entering inspection center",
      timestamp: inspectionDate,
      duration: Math.floor(Math.random() * 30) + 30, // 30-60 seconds
    },
    inspection_photos: visualResults.map((result, idx) => ({
      url: result.photoUrl,
      item: result.item,
      category: idx < 2 ? "visual_inspection" : idx < 4 ? "machine_test" : "inspection",
      timestamp: inspectionDate,
      description: `${result.item} inspection check`,
    })),
    evidence_items: [
      { type: "Photo", item_id: "TIRES_001", required: true, provided: true },
      { type: "Photo", item_id: "WINDSHIELD_001", required: true, provided: true },
      { type: "Photo", item_id: "LIGHTS_001", required: true, provided: true },
      { type: "Video", item_id: "ENTRY_VIDEO_001", required: true, provided: true },
      { type: "Video", item_id: "INSPECTION_VIDEO_001", required: false, provided: hasVideoEvidence },
    ],
  };
  
  return {
    id,
    vehicle: {
      plate,
      vin,
      make,
      model,
      type: vehicleType,
      owner: {
        name: ownerName,
        phone,
        idNumber,
      },
    },
    status,
    paymentStatus,
    syncStatus,
    type: inspectionType,
    amount,
    inspectionDate,
    cycleTimeSeconds: cycleTime * 60,
    machineResults,
    visualResults,
    videoEvidence,
    evidence,
    meta: {
      inspectorName: inspector,
      center,
      geoFenceStatus: "Valid",
      location: centerLocations[center] || { lat: 8.9806, lng: 38.7578 },
    },
  };
};

// Generate extensive inspection data distributed across time ranges
const generateExtensiveInspections = () => {
  const inspections = [];
  let idCounter = 2025;
  
  // Today: ~15 inspections
  for (let i = 0; i < 15; i++) {
    inspections.push(generateInspection(`VIS-2025-${String(idCounter++).padStart(4, '0')}`, 0));
  }
  
  // Last 7 days: ~60 inspections (distributed across days)
  for (let day = 1; day <= 7; day++) {
    const count = day <= 3 ? 10 : 8; // More recent days have more inspections
    for (let i = 0; i < count; i++) {
      inspections.push(generateInspection(`VIS-2025-${String(idCounter++).padStart(4, '0')}`, day));
    }
  }
  
  // Last 30 days (days 8-30): ~180 inspections
  for (let day = 8; day <= 30; day++) {
    const count = day <= 15 ? 8 : 6; // Gradually decreasing
    for (let i = 0; i < count; i++) {
      inspections.push(generateInspection(`VIS-2025-${String(idCounter++).padStart(4, '0')}`, day));
    }
  }
  
  // Older than 30 days: ~300 inspections (distributed across months)
  for (let day = 31; day <= 180; day += Math.floor(Math.random() * 3) + 1) {
    inspections.push(generateInspection(`VIS-2025-${String(idCounter++).padStart(4, '0')}`, day));
  }
  
  // Even older: ~200 inspections (6-12 months ago)
  for (let day = 181; day <= 365; day += Math.floor(Math.random() * 2) + 1) {
    inspections.push(generateInspection(`VIS-2025-${String(idCounter++).padStart(4, '0')}`, day));
  }
  
  return inspections;
};

// Generate extensive inspections
const generatedInspections = generateExtensiveInspections();

// Extended mock data for dashboard - combine existing with generated
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
    inspectionDate: getDateRelativeToToday(0, 2), // Today, 2 hours ago
    cycleTimeSeconds: 42 * 60, // 42 minutes
    machineResults: [
      {
        test: "Brakes",
        val: "78%",
        status: "Pass",
        timestamp: getDateRelativeToToday(0, 2),
      },
      {
        test: "Emissions",
        val: "2.1%",
        status: "Pass",
        timestamp: getDateRelativeToToday(0, 2),
      },
      {
        test: "Suspension",
        val: "82%",
        status: "Pass",
        timestamp: getDateRelativeToToday(0, 2),
      },
      {
        test: "Headlights",
        val: "Pass",
        status: "Pass",
        timestamp: getDateRelativeToToday(0, 2),
      },
    ],
    visualResults: [
      {
        item: "Tires",
        status: "Pass",
        photoUrl: getInspectionPhoto("Tires"),
      },
      {
        item: "Windshield",
        status: "Pass",
        photoUrl: getInspectionPhoto("Windshield"),
      },
      {
        item: "Mirrors",
        status: "Pass",
        photoUrl: getInspectionPhoto("Mirrors"),
      },
      {
        item: "Lights",
        status: "Pass",
        photoUrl: getInspectionPhoto("Lights"),
      },
      {
        item: "Body Damage",
        status: "Pass",
        photoUrl: getInspectionPhoto("Body Damage"),
      },
    ],
    videoEvidence: {
      url: "/Download.mp4",
      type: "inspection_video",
      timestamp: getDateRelativeToToday(0, 2),
      duration: 120,
      description: "Vehicle inspection process at inspection center",
    },
    evidence: {
      evidence_completeness_status: "Complete",
      entry_video: {
        url: "/Download.mp4",
        thumbnail: "/vec1.jpg",
        timestamp: getDateRelativeToToday(0, 2),
        duration: 45,
        description: "Vehicle entering inspection center",
      },
      inspection_photos: [
        {
          item: "Front View",
          url: "/vec1.jpg",
          category: "inspection",
          timestamp: getDateRelativeToToday(0, 2),
          description: "Front view of vehicle at inspection center",
        },
        {
          item: "Side View",
          url: "/vec2.jpg",
          category: "inspection",
          timestamp: getDateRelativeToToday(0, 2),
          description: "Side view of vehicle",
        },
        {
          item: "Brake Test",
          url: "/vec3.jpg",
          category: "machine_test",
          timestamp: getDateRelativeToToday(0, 2),
          description: "Brake test machine reading",
        },
        {
          item: "Emission Test",
          url: "/vec4.jpg",
          category: "machine_test",
          timestamp: getDateRelativeToToday(0, 2),
          description: "Emission test in progress",
        },
      ],
      evidence_items: [
        {
          type: "Photo",
          item_id: "FRONT_VIEW",
          required: true,
          provided: true,
        },
        {
          type: "Photo",
          item_id: "SIDE_VIEW",
          required: true,
          provided: true,
        },
        {
          type: "Video",
          item_id: "ENTRY_VIDEO",
          required: true,
          provided: true,
        },
        {
          type: "Document",
          item_id: "OWNERSHIP",
          required: true,
          provided: true,
        },
      ],
    },
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
    inspectionDate: getDateRelativeToToday(0, 4), // Today, 4 hours ago
    cycleTimeSeconds: 38 * 60, // 38 minutes
    machineResults: [
      {
        test: "Brakes",
        val: "45%",
        status: "Fail",
        timestamp: getDateRelativeToToday(0, 4),
      },
      {
        test: "Emissions",
        val: "4.8%",
        status: "Fail",
        timestamp: getDateRelativeToToday(0, 4),
      },
      {
        test: "Suspension",
        val: "52%",
        status: "Pass",
        timestamp: getDateRelativeToToday(0, 4),
      },
    ],
    visualResults: [
      {
        item: "Tires",
        status: "Fail",
        photoUrl: getInspectionPhoto("Tires"),
      },
      {
        item: "Windshield",
        status: "Fail",
        photoUrl: getInspectionPhoto("Windshield"),
      },
      {
        item: "Mirrors",
        status: "Pass",
        photoUrl: getInspectionPhoto("Mirrors"),
      },
      {
        item: "Lights",
        status: "Pass",
        photoUrl: getInspectionPhoto("Lights"),
      },
      {
        item: "Body Damage",
        status: "Fail",
        photoUrl: getInspectionPhoto("Body Damage"),
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
    inspectionDate: getDateRelativeToToday(0, 5), // Today, 5 hours ago
    cycleTimeSeconds: 50 * 60, // 50 minutes
    machineResults: [
      {
        test: "Brakes",
        val: "68%",
        status: "Pass",
        timestamp: getDateRelativeToToday(0, 5),
      },
      {
        test: "Emissions",
        val: "3.5%",
        status: "Pass",
        timestamp: getDateRelativeToToday(0, 5),
      },
      {
        test: "Suspension",
        val: "75%",
        status: "Pass",
        timestamp: getDateRelativeToToday(0, 5),
      },
    ],
    visualResults: [
      {
        item: "Tires",
        status: "Pass",
        photoUrl: getInspectionPhoto("Tires"),
      },
      {
        item: "Windshield",
        status: "Pass",
        photoUrl: getInspectionPhoto("Windshield"),
      },
      {
        item: "Mirrors",
        status: "Pass",
        photoUrl: getInspectionPhoto("Mirrors"),
      },
      {
        item: "Lights",
        status: "Pass",
        photoUrl: getInspectionPhoto("Lights"),
      },
      {
        item: "Body Damage",
        status: "Pass",
        photoUrl: getInspectionPhoto("Body Damage"),
      },
    ],
    evidence: {
      evidence_completeness_status: "Complete",
      entry_video: {
        url: "/Download.mp4",
        thumbnail: "/vec3.jpg",
        timestamp: getDateRelativeToToday(0, 5),
        duration: 52,
        description: "Vehicle entering inspection center",
      },
      inspection_photos: [
        {
          item: "Front View",
          url: "/vec3.jpg",
          category: "inspection",
          timestamp: getDateRelativeToToday(0, 5),
          description: "Front view of vehicle",
        },
        {
          item: "Rear View",
          url: "/vec4.jpg",
          category: "inspection",
          timestamp: getDateRelativeToToday(0, 5),
          description: "Rear view of vehicle",
        },
        {
          item: "Suspension Test",
          url: "/vec5.jpeg",
          category: "machine_test",
          timestamp: getDateRelativeToToday(0, 5),
          description: "Suspension test machine",
        },
      ],
      evidence_items: [
        {
          type: "Photo",
          item_id: "FRONT_VIEW",
          required: true,
          provided: true,
        },
        {
          type: "Photo",
          item_id: "REAR_VIEW",
          required: true,
          provided: true,
        },
        {
          type: "Video",
          item_id: "ENTRY_VIDEO",
          required: true,
          provided: true,
        },
      ],
    },
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
    inspectionDate: getDateRelativeToToday(1, 0), // Yesterday
    cycleTimeSeconds: 45 * 60, // 45 minutes
    machineResults: [
      {
        test: "Brakes",
        val: "72%",
        status: "Pass",
        timestamp: getDateRelativeToToday(1, 0),
      },
      {
        test: "Emissions",
        val: "2.8%",
        status: "Pass",
        timestamp: getDateRelativeToToday(1, 0),
      },
      {
        test: "Suspension",
        val: "80%",
        status: "Pass",
        timestamp: getDateRelativeToToday(1, 0),
      },
    ],
    visualResults: [
      {
        item: "Tires",
        status: "Pass",
        photoUrl: getInspectionPhoto("Tires"),
      },
      {
        item: "Windshield",
        status: "Pass",
        photoUrl: getInspectionPhoto("Windshield"),
      },
      {
        item: "Mirrors",
        status: "Pass",
        photoUrl: getInspectionPhoto("Mirrors"),
      },
      {
        item: "Lights",
        status: "Pass",
        photoUrl: getInspectionPhoto("Lights"),
      },
      {
        item: "Body Damage",
        status: "Pass",
        photoUrl: getInspectionPhoto("Body Damage"),
      },
    ],
    evidence: {
      evidence_completeness_status: "Complete",
      entry_video: {
        url: "/Download.mp4",
        thumbnail: "/vec6.webp",
        timestamp: getDateRelativeToToday(1, 0),
        duration: 48,
        description: "Vehicle entering inspection center",
      },
      inspection_photos: [
        {
          item: "Front View",
          url: "/vec6.webp",
          category: "inspection",
          timestamp: getDateRelativeToToday(1, 0),
          description: "Front view of vehicle",
        },
        {
          item: "Headlight Test",
          url: "/vec8.jpg",
          category: "machine_test",
          timestamp: getDateRelativeToToday(1, 0),
          description: "Headlight alignment test",
        },
      ],
      evidence_items: [
        {
          type: "Photo",
          item_id: "FRONT_VIEW",
          required: true,
          provided: true,
        },
        {
          type: "Video",
          item_id: "ENTRY_VIDEO",
          required: true,
          provided: true,
        },
      ],
    },
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
    inspectionDate: getDateRelativeToToday(2, 0), // 2 days ago
    cycleTimeSeconds: 48 * 60, // 48 minutes
    machineResults: [
      {
        test: "Brakes",
        val: "65%",
        status: "Pass",
        timestamp: getDateRelativeToToday(2, 0),
      },
      {
        test: "Emissions",
        val: "1.8%",
        status: "Pass",
        timestamp: getDateRelativeToToday(2, 0),
      },
    ],
    visualResults: [
      {
        item: "Tires",
        status: "Pass",
        photoUrl: getInspectionPhoto("Tires"),
      },
      {
        item: "Windshield",
        status: "Pass",
        photoUrl: getInspectionPhoto("Windshield"),
      },
      {
        item: "Mirrors",
        status: "Pass",
        photoUrl: getInspectionPhoto("Mirrors"),
      },
      {
        item: "Lights",
        status: "Pass",
        photoUrl: getInspectionPhoto("Lights"),
      },
      {
        item: "Body Damage",
        status: "Pass",
        photoUrl: getInspectionPhoto("Body Damage"),
      },
    ],
    meta: {
      inspectorName: "Sara Tesfaye",
      center: "Adama Center",
      geoFenceStatus: "Valid",
      location: { lat: 8.5400, lng: 39.2700 },
    },
  },
  // Add all generated inspections
  ...generatedInspections,
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
        photoUrl: getInspectionPhoto("Tires"),
      },
      {
        item: "Windshield",
        status: "Fail",
        photoUrl: getInspectionPhoto("Windshield"),
      },
      {
        item: "Mirrors",
        status: "Pass",
        photoUrl: getInspectionPhoto("Mirrors"),
      },
      {
        item: "Lights",
        status: "Pass",
        photoUrl: getInspectionPhoto("Lights"),
      },
      {
        item: "Body Damage",
        status: "Fail",
        photoUrl: getInspectionPhoto("Body Damage"),
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
        photoUrl: getInspectionPhoto("Tires"),
      },
      {
        item: "Windshield",
        status: "Pass",
        photoUrl: getInspectionPhoto("Windshield"),
      },
      {
        item: "Mirrors",
        status: "Pass",
        photoUrl: getInspectionPhoto("Mirrors"),
      },
      {
        item: "Lights",
        status: "Pass",
        photoUrl: getInspectionPhoto("Lights"),
      },
      {
        item: "Body Damage",
        status: "Pass",
        photoUrl: getInspectionPhoto("Body Damage"),
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
        photoUrl: getInspectionPhoto("Tires"),
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
