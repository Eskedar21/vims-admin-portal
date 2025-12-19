// Mock data for EPIC 2 - Governance Structure
// Administration Units, Institutions, Assignments, Relationships

// Administration Unit Types
export const ADMIN_UNIT_TYPES = {
  NATIONAL: 'National',
  REGION: 'Region',
  ZONE: 'Zone',
  SUB_CITY: 'Sub-city',
  WOREDA: 'Woreda',
  CENTER_CLUSTER: 'Center-Cluster',
};

// Administration Units (Hierarchical)
export const mockAdminUnits = [
  {
    admin_unit_id: 'AU-NATIONAL',
    admin_unit_type: ADMIN_UNIT_TYPES.NATIONAL,
    admin_unit_name_en: 'Federal Democratic Republic of Ethiopia',
    admin_unit_name_am: 'የኢትዮጵያ ፌዴራላዊ ዲሞክራሲያዊ ሪፐብሊክ',
    admin_unit_code: 'ET',
    parent_admin_unit_id: null,
    jurisdiction_path: 'National',
    status: 'Active',
    effective_from: '2020-01-01',
    effective_to: null,
    created_by: 'admin-001',
    created_at: '2020-01-01T00:00:00Z',
    updated_by: 'admin-001',
    updated_at: '2020-01-01T00:00:00Z',
  },
  {
    admin_unit_id: 'AU-OROMIA',
    admin_unit_type: ADMIN_UNIT_TYPES.REGION,
    admin_unit_name_en: 'Oromia',
    admin_unit_name_am: 'ኦሮሚያ',
    admin_unit_code: 'OR',
    parent_admin_unit_id: 'AU-NATIONAL',
    jurisdiction_path: 'National > Oromia',
    status: 'Active',
    effective_from: '2020-01-01',
    effective_to: null,
    created_by: 'admin-001',
    created_at: '2020-01-01T00:00:00Z',
    updated_by: 'admin-001',
    updated_at: '2020-01-01T00:00:00Z',
  },
  {
    admin_unit_id: 'AU-ADDIS',
    admin_unit_type: ADMIN_UNIT_TYPES.REGION,
    admin_unit_name_en: 'Addis Ababa',
    admin_unit_name_am: 'አዲስ አበባ',
    admin_unit_code: 'AA',
    parent_admin_unit_id: 'AU-NATIONAL',
    jurisdiction_path: 'National > Addis Ababa',
    status: 'Active',
    effective_from: '2020-01-01',
    effective_to: null,
    created_by: 'admin-001',
    created_at: '2020-01-01T00:00:00Z',
    updated_by: 'admin-001',
    updated_at: '2020-01-01T00:00:00Z',
  },
  {
    admin_unit_id: 'AU-AMHARA',
    admin_unit_type: ADMIN_UNIT_TYPES.REGION,
    admin_unit_name_en: 'Amhara',
    admin_unit_name_am: 'አማራ',
    admin_unit_code: 'AM',
    parent_admin_unit_id: 'AU-NATIONAL',
    jurisdiction_path: 'National > Amhara',
    status: 'Active',
    effective_from: '2020-01-01',
    effective_to: null,
    created_by: 'admin-001',
    created_at: '2020-01-01T00:00:00Z',
    updated_by: 'admin-001',
    updated_at: '2020-01-01T00:00:00Z',
  },
  {
    admin_unit_id: 'AU-OROMIA-EAST',
    admin_unit_type: ADMIN_UNIT_TYPES.ZONE,
    admin_unit_name_en: 'East Shewa Zone',
    admin_unit_name_am: 'ምስራቅ ሸዋ ዞን',
    admin_unit_code: 'OR-ES',
    parent_admin_unit_id: 'AU-OROMIA',
    jurisdiction_path: 'National > Oromia > East Shewa Zone',
    status: 'Active',
    effective_from: '2020-01-01',
    effective_to: null,
    created_by: 'admin-001',
    created_at: '2020-01-01T00:00:00Z',
    updated_by: 'admin-001',
    updated_at: '2020-01-01T00:00:00Z',
  },
  {
    admin_unit_id: 'AU-ADDIS-BOLE',
    admin_unit_type: ADMIN_UNIT_TYPES.SUB_CITY,
    admin_unit_name_en: 'Bole Sub-city',
    admin_unit_name_am: 'ቦሌ ክፍለ ከተማ',
    admin_unit_code: 'AA-BOLE',
    parent_admin_unit_id: 'AU-ADDIS',
    jurisdiction_path: 'National > Addis Ababa > Bole Sub-city',
    status: 'Active',
    effective_from: '2020-01-01',
    effective_to: null,
    created_by: 'admin-001',
    created_at: '2020-01-01T00:00:00Z',
    updated_by: 'admin-001',
    updated_at: '2020-01-01T00:00:00Z',
  },
  {
    admin_unit_id: 'AU-OROMIA-ADAMA',
    admin_unit_type: ADMIN_UNIT_TYPES.WOREDA,
    admin_unit_name_en: 'Adama Woreda',
    admin_unit_name_am: 'አዳማ ወረዳ',
    admin_unit_code: 'OR-ES-ADAMA',
    parent_admin_unit_id: 'AU-OROMIA-EAST',
    jurisdiction_path: 'National > Oromia > East Shewa Zone > Adama Woreda',
    status: 'Active',
    effective_from: '2020-01-01',
    effective_to: null,
    created_by: 'admin-001',
    created_at: '2020-01-01T00:00:00Z',
    updated_by: 'admin-001',
    updated_at: '2020-01-01T00:00:00Z',
  },
];

// Institutions
export const mockInstitutions = [
  {
    institution_id: 'INST-001',
    institution_type: 'Government',
    institution_name_en: 'Road Safety and Inspection Federal Service',
    institution_name_am: 'የመንገድ ደህንነት እና ኢንስፔክሽን ፌዴራል አገልግሎት',
    institution_short_name: 'RSIFS',
    registration_number: 'RSIFS-2020-001',
    contact_person_name: 'Ato Alemayehu Bekele',
    contact_phone: '+251-11-123-4567',
    contact_email: 'info@rsifs.gov.et',
    address_text: 'Addis Ababa, Ethiopia',
    region_id: 'AU-ADDIS',
    status: 'Active',
    notes: 'Primary enforcement and inspection authority',
  },
  {
    institution_id: 'INST-002',
    institution_type: 'Government',
    institution_name_en: 'Ethiopian Transport Authority',
    institution_name_am: 'የኢትዮጵያ ትራንስፖርት ባለሥልጣን',
    institution_short_name: 'ETA',
    registration_number: 'ETA-2020-001',
    contact_person_name: 'Dr. Mesfin Haile',
    contact_phone: '+251-11-234-5678',
    contact_email: 'contact@eta.gov.et',
    address_text: 'Addis Ababa, Ethiopia',
    region_id: 'AU-ADDIS',
    status: 'Active',
    notes: null,
  },
  {
    institution_id: 'INST-003',
    institution_type: 'Partner',
    institution_name_en: 'TeleBirr',
    institution_name_am: 'ቴሌቢር',
    institution_short_name: 'TeleBirr',
    registration_number: null,
    contact_person_name: 'Ms. Tigist Mekonnen',
    contact_phone: '+251-11-345-6789',
    contact_email: 'partnership@telebirr.et',
    address_text: 'Addis Ababa, Ethiopia',
    region_id: 'AU-ADDIS',
    status: 'Active',
    notes: 'Payment provider partner',
  },
  {
    institution_id: 'INST-004',
    institution_type: 'Partner',
    institution_name_en: 'Ethio Telecom',
    institution_name_am: 'ኢትዮ ቴሌኮም',
    institution_short_name: 'EthioTelecom',
    registration_number: null,
    contact_person_name: 'Eng. Yonas Tadesse',
    contact_phone: '+251-11-456-7890',
    contact_email: 'enterprise@ethiotelecom.et',
    address_text: 'Addis Ababa, Ethiopia',
    region_id: 'AU-ADDIS',
    status: 'Active',
    notes: 'Connectivity provider',
  },
];

// Assignments (Offices/Admins to Admin Units)
export const mockAssignments = [
  {
    assignment_id: 'ASG-001',
    admin_unit_id: 'AU-OROMIA',
    office_id: 'INST-001',
    primary_admin_user_id: 'U-001',
    secondary_admin_user_ids: ['U-002', 'U-003'],
    assignment_type: 'Owner',
    responsibilities: ['incident response', 'center onboarding', 'approvals'],
    effective_from: '2020-01-01',
    effective_to: null,
    status: 'Active',
    created_by: 'admin-001',
    created_at: '2020-01-01T00:00:00Z',
  },
  {
    assignment_id: 'ASG-002',
    admin_unit_id: 'AU-ADDIS',
    office_id: 'INST-001',
    primary_admin_user_id: 'U-004',
    secondary_admin_user_ids: [],
    assignment_type: 'Owner',
    responsibilities: ['incident response', 'center onboarding'],
    effective_from: '2020-01-01',
    effective_to: null,
    status: 'Active',
    created_by: 'admin-001',
    created_at: '2020-01-01T00:00:00Z',
  },
  {
    assignment_id: 'ASG-003',
    admin_unit_id: 'AU-OROMIA-ADAMA',
    office_id: 'INST-001',
    primary_admin_user_id: null,
    secondary_admin_user_ids: [],
    assignment_type: 'Enforcement Liaison',
    responsibilities: ['enforcement coordination'],
    effective_from: '2020-01-01',
    effective_to: null,
    status: 'Active',
    created_by: 'admin-001',
    created_at: '2020-01-01T00:00:00Z',
  },
];

// Relationships (Institutions to Admin Units)
export const mockRelationships = [
  {
    relationship_id: 'REL-001',
    institution_id: 'INST-003',
    admin_unit_id: 'AU-OROMIA',
    relationship_type: 'Payment Partner',
    scope_level: 'Region',
    permissions_profile_id: 'PAYMENT-PROFILE-001',
    effective_from: '2020-01-01',
    effective_to: null,
    status: 'Active',
    created_by: 'admin-001',
    created_at: '2020-01-01T00:00:00Z',
  },
  {
    relationship_id: 'REL-002',
    institution_id: 'INST-004',
    admin_unit_id: 'AU-ADDIS',
    relationship_type: 'Connectivity Provider',
    scope_level: 'Region',
    permissions_profile_id: null,
    effective_from: '2020-01-01',
    effective_to: null,
    status: 'Active',
    created_by: 'admin-001',
    created_at: '2020-01-01T00:00:00Z',
  },
  {
    relationship_id: 'REL-003',
    institution_id: 'INST-001',
    admin_unit_id: 'AU-OROMIA-EAST',
    relationship_type: 'Enforcement Partner',
    scope_level: 'Zone',
    permissions_profile_id: 'ENFORCEMENT-PROFILE-001',
    effective_from: '2020-01-01',
    effective_to: null,
    status: 'Active',
    created_by: 'admin-001',
    created_at: '2020-01-01T00:00:00Z',
  },
];

// Change Requests
export const mockChangeRequests = [
  {
    change_request_id: 'CHG-001',
    change_domain: 'AdminUnit',
    requested_by: 'admin-002',
    requested_at: new Date(Date.now() - 86400000).toISOString(),
    change_summary: 'Create new Zone: West Shewa Zone',
    diff_before_after: {
      before: null,
      after: {
        admin_unit_type: 'Zone',
        admin_unit_name_en: 'West Shewa Zone',
        parent_admin_unit_id: 'AU-OROMIA',
      },
    },
    risk_level: 'Med',
    approval_required: true,
    approval_status: 'Pending',
    approved_by: null,
    approved_at: null,
    rejection_reason: null,
  },
  {
    change_request_id: 'CHG-002',
    change_domain: 'Assignment',
    requested_by: 'admin-001',
    requested_at: new Date(Date.now() - 172800000).toISOString(),
    change_summary: 'Change primary admin for Oromia region',
    diff_before_after: {
      before: { primary_admin_user_id: 'U-001' },
      after: { primary_admin_user_id: 'U-005' },
    },
    risk_level: 'High',
    approval_required: true,
    approval_status: 'Approved',
    approved_by: 'admin-003',
    approved_at: new Date(Date.now() - 86400000).toISOString(),
    rejection_reason: null,
  },
];

// Helper functions
export function getAdminUnitTree(units) {
  const unitMap = new Map();
  const roots = [];

  // Create map
  units.forEach(unit => {
    unitMap.set(unit.admin_unit_id, { ...unit, children: [] });
  });

  // Build tree
  units.forEach(unit => {
    const node = unitMap.get(unit.admin_unit_id);
    if (unit.parent_admin_unit_id) {
      const parent = unitMap.get(unit.parent_admin_unit_id);
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export function getAdminUnitPath(unitId, units) {
  const unit = units.find(u => u.admin_unit_id === unitId);
  if (!unit) return '';
  if (!unit.parent_admin_unit_id) return unit.admin_unit_name_en;
  return `${getAdminUnitPath(unit.parent_admin_unit_id, units)} > ${unit.admin_unit_name_en}`;
}

export function validateHierarchy(unit, units) {
  // Check for cycles
  let current = unit;
  const visited = new Set();
  while (current && current.parent_admin_unit_id) {
    if (visited.has(current.parent_admin_unit_id)) {
      return { valid: false, error: 'Cycle detected in hierarchy' };
    }
    visited.add(current.parent_admin_unit_id);
    current = units.find(u => u.admin_unit_id === current.parent_admin_unit_id);
  }
  return { valid: true };
}

export function getUnitsWithoutOwner(units, assignments) {
  return units.filter(unit => {
    const hasOwner = assignments.some(
      a => a.admin_unit_id === unit.admin_unit_id && 
           a.assignment_type === 'Owner' && 
           a.status === 'Active'
    );
    return !hasOwner;
  });
}

