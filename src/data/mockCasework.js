// Mock data for EPIC 6 - Inspection Records & Casework
// Inspections, Cases, Violations, Evidence Bundles, Sharing

import { mockInspectionRecord } from './mockInspectionProgram';
import { mockCentersFull } from './mockCentersInfrastructure';
import { mockAdminUnits } from './mockGovernance';

// Inspection Records (extended for search)
export const mockInspectionRecords = [
  {
    ...mockInspectionRecord,
    inspection_id: 'INS-001',
    plate_number: '3-12345-AA',
    vin: '1HGBH41JXMN109186',
    inspection_date: new Date(Date.now() - 3600000).toISOString(),
    center_name: 'Bole Center 01',
    jurisdiction_path: 'National > Addis Ababa > Bole',
    overall_result: 'Pass',
    certificate_status: 'Issued',
    certificate_number: 'CERT-2024-001234',
    certificate_expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 - 3600000).toISOString(),
    geofence_band: 'GREEN',
    evidence_completeness_status: 'Complete',
    flags_count: 0,
  },
  {
    ...mockInspectionRecord,
    inspection_id: 'INS-002',
    plate_number: '3-12346-AB',
    vin: '1HGBH41JXMN109187',
    inspection_date: new Date(Date.now() - 86400000).toISOString(),
    center_name: 'Bole Center 01',
    jurisdiction_path: 'National > Addis Ababa > Bole',
    overall_result: 'Fail',
    certificate_status: 'Voided',
    certificate_number: 'CERT-2024-001235',
    certificate_expiry_date: null,
    geofence_band: 'RED',
    evidence_completeness_status: 'Incomplete',
    flags_count: 2,
  },
  {
    ...mockInspectionRecord,
    inspection_id: 'INS-003',
    plate_number: '3-12347-AC',
    vin: '1HGBH41JXMN109188',
    inspection_date: new Date(Date.now() - 172800000).toISOString(),
    center_name: 'Mercato Center 02',
    jurisdiction_path: 'National > Addis Ababa > Mercato',
    overall_result: 'Retest Required',
    certificate_status: 'Expired',
    certificate_number: 'CERT-2023-001200',
    certificate_expiry_date: new Date(Date.now() - 86400000).toISOString(),
    geofence_band: 'YELLOW',
    evidence_completeness_status: 'Complete',
    flags_count: 1,
  },
];

// Enforcement Cases
export const mockEnforcementCases = [
  {
    case_id: 'CASE-001',
    case_number: 'CASE-2024-001',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    created_by_user_id: 'U-005',
    scope: 'Region',
    plate_number: '3-12346-AB',
    vin: '1HGBH41JXMN109187',
    inspection_ids: ['INS-002'],
    case_type: 'Integrity',
    priority: 'High',
    status: 'In Progress',
    assigned_to_user_id: 'U-006',
    assigned_team_id: null,
    sla_due_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    summary: 'Geofence breach and missing evidence detected during inspection',
    notes: [
      {
        note_id: 'NOTE-001',
        note_text: 'Initial case opened due to red zone geofence breach',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        created_by: 'U-005',
      },
      {
        note_id: 'NOTE-002',
        note_text: 'Assigned to enforcement team for investigation',
        created_at: new Date(Date.now() - 82800000).toISOString(),
        created_by: 'admin-001',
      },
    ],
  },
  {
    case_id: 'CASE-002',
    case_number: 'CASE-2024-002',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    created_by_user_id: 'U-005',
    scope: 'Center',
    plate_number: '3-12347-AC',
    vin: '1HGBH41JXMN109188',
    inspection_ids: ['INS-003'],
    case_type: 'Compliance',
    priority: 'Medium',
    status: 'Open',
    assigned_to_user_id: null,
    assigned_team_id: null,
    sla_due_at: null,
    summary: 'Yellow zone geofence violation - requires review',
    notes: [
      {
        note_id: 'NOTE-003',
        note_text: 'Case opened for yellow zone violation',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        created_by: 'U-005',
      },
    ],
  },
];

// Violation Types
export const VIOLATION_TYPES = {
  GEOFENCE: {
    geofence_red_breach: { label: 'Geofence Red Breach (>100m)', severity: 'Critical' },
    geofence_repeated_yellow: { label: 'Repeated Yellow Zone Violations', severity: 'High' },
  },
  CAMERA_EVIDENCE: {
    camera_offline_during_inspection: { label: 'Camera Offline During Inspection', severity: 'High' },
    last_frame_stale_during_inspection: { label: 'Last Frame Stale During Inspection', severity: 'High' },
    required_photo_missing: { label: 'Required Photo Missing', severity: 'Major' },
  },
  FRAUD_ANOMALY: {
    unusually_short_inspection_duration: { label: 'Unusually Short Inspection Duration', severity: 'Medium' },
    pass_rate_spike_center: { label: 'Pass Rate Spike at Center', severity: 'High' },
    retest_abuse_pattern: { label: 'Retest Abuse Pattern', severity: 'High' },
    gps_spoof_suspected: { label: 'GPS Spoof Suspected', severity: 'Critical' },
  },
  OPERATIONS: {
    machine_fault_repeated: { label: 'Repeated Machine Faults', severity: 'Medium' },
    telemetry_gap: { label: 'Telemetry Gap', severity: 'Medium' },
  },
};

// Violations
export const mockViolations = [
  {
    violation_id: 'VIOL-001',
    case_id: 'CASE-001',
    violation_type: 'geofence_red_breach',
    detected_at: new Date(Date.now() - 86400000).toISOString(),
    severity: 'Critical',
    linked_incident_id: 'INC-001',
    linked_inspection_id: 'INS-002',
    evidence_refs: ['EVID-001', 'EVID-002'],
    resolution_action: null,
    resolution_status: 'Open',
  },
  {
    violation_id: 'VIOL-002',
    case_id: 'CASE-001',
    violation_type: 'required_photo_missing',
    detected_at: new Date(Date.now() - 86400000).toISOString(),
    severity: 'Major',
    linked_incident_id: 'INC-002',
    linked_inspection_id: 'INS-002',
    evidence_refs: [],
    resolution_action: null,
    resolution_status: 'Open',
  },
  {
    violation_id: 'VIOL-003',
    case_id: 'CASE-002',
    violation_type: 'geofence_repeated_yellow',
    detected_at: new Date(Date.now() - 172800000).toISOString(),
    severity: 'High',
    linked_incident_id: null,
    linked_inspection_id: 'INS-003',
    evidence_refs: ['EVID-003'],
    resolution_action: null,
    resolution_status: 'Open',
  },
];

// Evidence Items (Metadata)
export const mockEvidenceItems = [
  {
    evidence_item_id: 'EVID-001',
    evidence_type: 'photo',
    event_type: 'fail_event',
    captured_at: new Date(Date.now() - 86400000).toISOString(),
    captured_by_device_id: 'CAM-001',
    hash_checksum: 'sha256:abc123...',
    storage_ref: 'secure://storage/evidence/EVID-001.jpg',
    required: true,
    status: 'present',
    access_level: 'admin_only',
  },
  {
    evidence_item_id: 'EVID-002',
    evidence_type: 'snapshot',
    event_type: 'inspection_start',
    captured_at: new Date(Date.now() - 86400000).toISOString(),
    captured_by_device_id: 'CAM-001',
    hash_checksum: 'sha256:def456...',
    storage_ref: 'secure://storage/evidence/EVID-002.jpg',
    required: true,
    status: 'present',
    access_level: 'enforcement_limited',
  },
  {
    evidence_item_id: 'EVID-003',
    evidence_type: 'photo',
    event_type: 'fail_event',
    captured_at: new Date(Date.now() - 172800000).toISOString(),
    captured_by_device_id: 'CAM-002',
    hash_checksum: null,
    storage_ref: null,
    required: true,
    status: 'missing',
    access_level: 'admin_only',
  },
];

// Evidence Bundles
export const mockEvidenceBundles = [
  {
    bundle_id: 'BUNDLE-001',
    case_id: 'CASE-001',
    bundle_type: 'MediaIncluded',
    included_items: ['EVID-001', 'EVID-002'],
    generated_by_user_id: 'U-006',
    generated_at: new Date(Date.now() - 43200000).toISOString(),
    purpose_reason: 'Sharing with RSIFS for enforcement action',
    approval_required: true,
    approval_status: 'Approved',
    approved_by: 'admin-001',
    approved_at: new Date(Date.now() - 36000000).toISOString(),
    download_expiry_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    watermarking_enabled: true,
    access_log_ref: 'LOG-001',
  },
];

// Sharing Records
export const mockSharingRecords = [
  {
    share_id: 'SHARE-001',
    bundle_id: 'BUNDLE-001',
    target_institution_id: 'INST-RSIFS',
    target_contact: 'rsifs@example.gov.et',
    share_method: 'SecureLink',
    shared_at: new Date(Date.now() - 36000000).toISOString(),
    shared_by_user_id: 'admin-001',
    access_scope: 'read-only',
    expiry_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    acknowledged_at: new Date(Date.now() - 30000000).toISOString(),
    purpose_reason: 'Enforcement action required - geofence breach case',
  },
];

// Helper functions
export function calculateCertificateExpiry(inspectionDate, validityDays = 365) {
  const date = new Date(inspectionDate);
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString();
}

export function isCertificateExpired(certificateExpiryDate) {
  if (!certificateExpiryDate) return false;
  return new Date(certificateExpiryDate) < new Date();
}

export function getViolationLabel(violationType) {
  for (const category of Object.values(VIOLATION_TYPES)) {
    if (category[violationType]) {
      return category[violationType].label;
    }
  }
  return violationType;
}

export function getViolationSeverity(violationType) {
  for (const category of Object.values(VIOLATION_TYPES)) {
    if (category[violationType]) {
      return category[violationType].severity;
    }
  }
  return 'Medium';
}

export function filterInspectionsByScope(inspections, userScope) {
  // In real app, would filter by user's scope
  return inspections;
}

export function canAccessEvidence(evidenceItem, userRole) {
  if (evidenceItem.access_level === 'admin_only') {
    return userRole === 'Super Admin' || userRole === 'Regional Admin';
  }
  return true;
}












