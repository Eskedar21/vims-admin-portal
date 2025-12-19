// Mock data for EPIC 4 - Inspection Program Management
// Inspection Types, Vehicle Classes, Test Standards, Checklists, Evidence Rules

// Inspection Types
export const mockInspectionTypes = [
  {
    inspection_type_id: 'TYPE-001',
    name_en: 'Initial Inspection',
    name_am: 'የመጀመሪያ ኢንስፔክሽን',
    category: 'Initial',
    requires_payment: true,
    requires_visual_check: true,
    requires_machine_tests: ['brake', 'suspension', 'emissions', 'headlight'],
    requires_certificate: true,
    validity_period_days: 365,
    enabled: true,
    effective_from: '2020-01-01T00:00:00Z',
    effective_to: null,
    version: '1.0',
    approval_status: 'Approved',
    created_by: 'admin-001',
    created_at: '2020-01-01T00:00:00Z',
  },
  {
    inspection_type_id: 'TYPE-002',
    name_en: 'Retest Inspection',
    name_am: 'ዳግም ሙከራ',
    category: 'Retest',
    requires_payment: true,
    requires_visual_check: true,
    requires_machine_tests: ['brake', 'suspension', 'emissions'],
    requires_certificate: true,
    validity_period_days: 365,
    enabled: true,
    effective_from: '2020-01-01T00:00:00Z',
    effective_to: null,
    version: '1.0',
    approval_status: 'Approved',
    created_by: 'admin-001',
    created_at: '2020-01-01T00:00:00Z',
  },
  {
    inspection_type_id: 'TYPE-003',
    name_en: 'Specialized Inspection',
    name_am: 'ልዩ ኢንስፔክሽን',
    category: 'Specialized',
    requires_payment: true,
    requires_visual_check: true,
    requires_machine_tests: ['brake', 'suspension'],
    requires_certificate: true,
    validity_period_days: 180,
    enabled: true,
    effective_from: '2020-01-01T00:00:00Z',
    effective_to: null,
    version: '1.0',
    approval_status: 'Approved',
    created_by: 'admin-001',
    created_at: '2020-01-01T00:00:00Z',
  },
];

// Vehicle Classes
export const mockVehicleClasses = [
  { vehicle_class_id: 'VC-001', name_en: 'Private Car', name_am: 'ግላዊ መኪና', code: 'PC' },
  { vehicle_class_id: 'VC-002', name_en: 'Truck', name_am: 'ጭነት መኪና', code: 'TR' },
  { vehicle_class_id: 'VC-003', name_en: 'Bus', name_am: 'አውቶብስ', code: 'BU' },
  { vehicle_class_id: 'VC-004', name_en: 'Motorcycle', name_am: 'ሞተርሳይክል', code: 'MC' },
  { vehicle_class_id: 'VC-005', name_en: 'Taxi', name_am: 'ታክሲ', code: 'TX' },
];

// Vehicle Class to Inspection Type Mapping
export const mockVehicleClassMappings = [
  {
    mapping_id: 'MAP-001',
    inspection_type_id: 'TYPE-001',
    vehicle_class_id: 'VC-001',
    enabled: true,
    rules: { weight_range: null, axle_count: null, fuel_type: null },
    effective_from: '2020-01-01T00:00:00Z',
    effective_to: null,
  },
  {
    mapping_id: 'MAP-002',
    inspection_type_id: 'TYPE-001',
    vehicle_class_id: 'VC-002',
    enabled: true,
    rules: { weight_range: { min: 0, max: 10000 }, axle_count: { min: 2, max: 4 } },
    effective_from: '2020-01-01T00:00:00Z',
    effective_to: null,
  },
  {
    mapping_id: 'MAP-003',
    inspection_type_id: 'TYPE-002',
    vehicle_class_id: 'VC-001',
    enabled: true,
    rules: null,
    effective_from: '2020-01-01T00:00:00Z',
    effective_to: null,
  },
];

// Test Standards
export const mockTestStandards = [
  {
    standard_id: 'STD-001',
    vehicle_class_id: 'VC-001',
    test_type: 'Brake',
    parameter_name: 'brake_efficiency',
    parameter_name_en: 'Brake Efficiency',
    parameter_name_am: 'የብሬክ ውጤታማነት',
    unit: '%',
    min_value: 50,
    max_value: 100,
    pass_logic: 'range',
    tolerance: 5,
    effective_from: '2020-01-01T00:00:00Z',
    effective_to: null,
    version: '1.0',
    approval_status: 'Approved',
    created_by: 'admin-001',
    approved_by: 'admin-002',
    created_at: '2020-01-01T00:00:00Z',
    approved_at: '2020-01-05T00:00:00Z',
  },
  {
    standard_id: 'STD-002',
    vehicle_class_id: 'VC-001',
    test_type: 'Emissions',
    parameter_name: 'co_emission',
    parameter_name_en: 'CO Emission',
    parameter_name_am: 'CO መልቀቅ',
    unit: 'ppm',
    min_value: null,
    max_value: 3.5,
    pass_logic: 'less_than',
    tolerance: 0.1,
    effective_from: '2020-01-01T00:00:00Z',
    effective_to: null,
    version: '1.0',
    approval_status: 'Approved',
    created_by: 'admin-001',
    approved_by: 'admin-002',
    created_at: '2020-01-01T00:00:00Z',
    approved_at: '2020-01-05T00:00:00Z',
  },
  {
    standard_id: 'STD-003',
    vehicle_class_id: 'VC-001',
    test_type: 'Suspension',
    parameter_name: 'suspension_balance',
    parameter_name_en: 'Suspension Balance',
    parameter_name_am: 'የሰስፔንሽን ሚዛን',
    unit: '%',
    min_value: 80,
    max_value: 100,
    pass_logic: 'range',
    tolerance: 5,
    effective_from: '2020-01-01T00:00:00Z',
    effective_to: null,
    version: '1.0',
    approval_status: 'Approved',
    created_by: 'admin-001',
    approved_by: 'admin-002',
    created_at: '2020-01-01T00:00:00Z',
    approved_at: '2020-01-05T00:00:00Z',
  },
];

// Visual Checklist Items
export const mockChecklistItems = [
  {
    checklist_item_id: 'CHK-001',
    vehicle_class_id: 'VC-001',
    category: 'Exterior',
    item_label_en: 'Windshield Condition',
    item_label_am: 'የመሸጋገሪያ መስታወት ሁኔታ',
    severity_on_fail: 'Major',
    fail_code: 'EXT-WS-FAIL',
    photo_required_on_fail: true,
    enabled: true,
    sort_order: 1,
    effective_from: '2020-01-01T00:00:00Z',
    effective_to: null,
    version: '1.0',
    approval_status: 'Approved',
  },
  {
    checklist_item_id: 'CHK-002',
    vehicle_class_id: 'VC-001',
    category: 'Lights',
    item_label_en: 'Headlight Function',
    item_label_am: 'የፊት መብራት ሥራ',
    severity_on_fail: 'Critical',
    fail_code: 'LGT-HL-FAIL',
    photo_required_on_fail: true,
    enabled: true,
    sort_order: 2,
    effective_from: '2020-01-01T00:00:00Z',
    effective_to: null,
    version: '1.0',
    approval_status: 'Approved',
  },
  {
    checklist_item_id: 'CHK-003',
    vehicle_class_id: 'VC-001',
    category: 'Tires',
    item_label_en: 'Tire Tread Depth',
    item_label_am: 'የጎማ ጥልቀት',
    severity_on_fail: 'Major',
    fail_code: 'TIR-TD-FAIL',
    photo_required_on_fail: true,
    enabled: true,
    sort_order: 3,
    effective_from: '2020-01-01T00:00:00Z',
    effective_to: null,
    version: '1.0',
    approval_status: 'Approved',
  },
  {
    checklist_item_id: 'CHK-004',
    vehicle_class_id: 'VC-001',
    category: 'Documents',
    item_label_en: 'Registration Certificate',
    item_label_am: 'የታዘዘ የምዝግብ ወረቀት',
    severity_on_fail: 'Critical',
    fail_code: 'DOC-REG-FAIL',
    photo_required_on_fail: false,
    enabled: true,
    sort_order: 4,
    effective_from: '2020-01-01T00:00:00Z',
    effective_to: null,
    version: '1.0',
    approval_status: 'Approved',
  },
];

// Evidence Rules
export const mockEvidenceRules = [
  {
    rule_id: 'EVR-001',
    rule_name: 'Failed Checklist Item Photo',
    description: 'Any checklist item with photo_required_on_fail=true must have photo evidence if failed',
    evidence_type: 'photo',
    trigger_condition: 'checklist_item_failed',
    mandatory: true,
    severity_on_missing: 'High',
    enabled: true,
  },
  {
    rule_id: 'EVR-002',
    rule_name: 'Geofence Breach Evidence',
    description: 'Red zone geofence breaches require location evidence',
    evidence_type: 'location',
    trigger_condition: 'geofence_red_breach',
    mandatory: true,
    severity_on_missing: 'Critical',
    enabled: true,
  },
];

// Sample Inspection Record (for viewing)
export const mockInspectionRecord = {
  inspection_id: 'INS-001',
  inspection_type: 'Initial',
  inspection_type_id: 'TYPE-001',
  inspection_status: 'Certified',
  inspection_date_time_start: new Date(Date.now() - 3600000).toISOString(),
  inspection_date_time_end: new Date(Date.now() - 3000000).toISOString(),
  cycle_time_seconds: 600,
  vehicle: {
    plate_number: '3-12345-AA',
    vin: '1HGBH41JXMN109186',
    vehicle_class: 'Private Car',
    vehicle_class_id: 'VC-001',
    make: 'Toyota',
    model: 'Corolla',
    year: 2020,
  },
  center: {
    center_id: 'CTR-001',
    center_name: 'Bole Center 01',
    lane_id: 'LANE-001',
  },
  staff: {
    inspector_user_id: 'U-001',
    reception_user_id: 'U-002',
  },
  results: {
    overall_result: 'Pass',
    fail_reasons_summary: [],
    retest_due_by: null,
  },
  evidence: {
    evidence_required: true,
    evidence_items: [
      { type: 'photo', item_id: 'CHK-001', required: true, provided: true, url: '/evidence/photo-001.jpg' },
      { type: 'photo', item_id: 'CHK-002', required: true, provided: true, url: '/evidence/photo-002.jpg' },
    ],
    evidence_completeness_status: 'Complete',
    // Entry video - captured when vehicle enters inspection center
    entry_video: {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      duration: 45,
      description: 'Vehicle entering inspection center - Front gate camera',
    },
    // Inspection photos - captured while vehicle is at inspection center during inspection process
    inspection_photos: [
      {
        url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
        dataUrl: null,
        timestamp: new Date(Date.now() - 3500000).toISOString(),
        item: 'Vehicle at inspection bay - Initial positioning',
        category: 'inspection',
        description: 'Vehicle positioned at inspection bay for machine tests',
      },
      {
        url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
        dataUrl: null,
        timestamp: new Date(Date.now() - 3450000).toISOString(),
        item: 'Front view - License plate verification',
        category: 'inspection',
        description: 'Front view showing license plate and headlights',
      },
      {
        url: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80',
        dataUrl: null,
        timestamp: new Date(Date.now() - 3400000).toISOString(),
        item: 'Left side view - Body condition',
        category: 'inspection',
        description: 'Left side view showing body condition and mirrors',
      },
      {
        url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
        dataUrl: null,
        timestamp: new Date(Date.now() - 3350000).toISOString(),
        item: 'Right side view - Body condition',
        category: 'inspection',
        description: 'Right side view showing body condition and mirrors',
      },
      {
        url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
        dataUrl: null,
        timestamp: new Date(Date.now() - 3300000).toISOString(),
        item: 'Rear view - Tail lights and license plate',
        category: 'inspection',
        description: 'Rear view showing tail lights, brake lights, and rear license plate',
      },
      {
        url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
        dataUrl: null,
        timestamp: new Date(Date.now() - 3250000).toISOString(),
        item: 'Vehicle on brake tester',
        category: 'machine_test',
        description: 'Vehicle positioned on brake testing equipment',
      },
      {
        url: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80',
        dataUrl: null,
        timestamp: new Date(Date.now() - 3200000).toISOString(),
        item: 'Vehicle on suspension tester',
        category: 'machine_test',
        description: 'Vehicle on suspension/alignment testing equipment',
      },
      {
        url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
        dataUrl: null,
        timestamp: new Date(Date.now() - 3150000).toISOString(),
        item: 'Gas analyzer test in progress',
        category: 'machine_test',
        description: 'Emission testing with gas analyzer probe connected',
      },
      {
        url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
        dataUrl: null,
        timestamp: new Date(Date.now() - 3100000).toISOString(),
        item: 'Headlight test in progress',
        category: 'machine_test',
        description: 'Headlight intensity testing with photometer',
      },
      {
        url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
        dataUrl: null,
        timestamp: new Date(Date.now() - 3050000).toISOString(),
        item: 'Visual inspection - Tires and wheels',
        category: 'visual_inspection',
        description: 'Close-up of tires showing tread depth and condition',
      },
      {
        url: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80',
        dataUrl: null,
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        item: 'Visual inspection - Windshield and wipers',
        category: 'visual_inspection',
        description: 'Windshield condition and wiper functionality check',
      },
      {
        url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
        dataUrl: null,
        timestamp: new Date(Date.now() - 2950000).toISOString(),
        item: 'Final inspection - Vehicle ready for certificate',
        category: 'inspection',
        description: 'Final positioning after all tests completed',
      },
    ],
  },
  geofence_compliance: {
    inspection_location_lat: 8.9806,
    inspection_location_lon: 38.7578,
    distance_m: 25,
    band: 'GREEN',
    location_source: 'camera_gps',
    location_confidence: 'High',
  },
  certificate: {
    certificate_id: 'CERT-001',
    certificate_number: 'CERT-2024-001234',
    certificate_issue_date: new Date(Date.now() - 3000000).toISOString(),
    certificate_expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 - 3000000).toISOString(),
    certificate_status: 'Issued',
    qr_verification_payload: 'CERT-2024-001234-VERIFY-TOKEN-ABC123',
  },
  report: {
    report_id: 'RPT-001',
    report_status: 'Final',
    report_print_count: 2,
  },
  standards_used: [
    { standard_id: 'STD-001', version: '1.0', test_type: 'Brake' },
    { standard_id: 'STD-002', version: '1.0', test_type: 'Emissions' },
  ],
  checklist_version: '1.0',
};

// Helper functions
export function calculateCertificateExpiry(issueDate, validityDays = 365) {
  const issue = new Date(issueDate);
  const expiry = new Date(issue);
  expiry.setDate(expiry.getDate() + validityDays);
  return expiry.toISOString();
}

export function getLocalizedLabel(item, language = 'en') {
  if (language === 'am' && item.name_am) {
    return item.name_am;
  }
  if (language === 'am' && item.item_label_am) {
    return item.item_label_am;
  }
  if (language === 'am' && item.parameter_name_am) {
    return item.parameter_name_am;
  }
  return item.name_en || item.item_label_en || item.parameter_name_en || item.name || 'Translation missing';
}

export function checkEvidenceCompliance(inspection) {
  const required = inspection.evidence.evidence_items.filter(e => e.required);
  const provided = required.filter(e => e.provided);
  const gaps = required.filter(e => !e.provided);
  
  return {
    required_count: required.length,
    provided_count: provided.length,
    gap_count: gaps.length,
    completeness_status: gaps.length === 0 ? 'Complete' : 'Incomplete',
    gaps: gaps,
  };
}



