// Mock data for EPIC 10 - System Administration & Maintenance
// Integrations, Credentials, Webhooks, Backups, Logs, Configuration, Tickets, Knowledge Base

import { mockInstitutions } from './mockGovernance';

// Integration Registry
export const mockIntegrations = [
  {
    integration_id: 'INT-001',
    integration_name: 'TeleBirr Payment Gateway',
    integration_type: 'Bidirectional',
    owner_institution_id: 'INST-TELEBIRR',
    scope_supported: 'National',
    status: 'Active',
    health_check_url_ref: 'secure://health/telebirr',
    last_success_at: new Date(Date.now() - 60000).toISOString(),
    last_failure_at: null,
    failure_rate_percent: 0.5,
    data_contract_version: 'v2.1',
    change_control_required: true,
    created_by: 'admin-001',
    created_at: '2020-01-01T00:00:00Z',
    updated_by: 'admin-001',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    integration_id: 'INT-002',
    integration_name: 'RSIFS/Police API',
    integration_type: 'Bidirectional',
    owner_institution_id: 'INST-RSIFS',
    scope_supported: 'National',
    status: 'Active',
    health_check_url_ref: 'secure://health/rsifs',
    last_success_at: new Date(Date.now() - 120000).toISOString(),
    last_failure_at: null,
    failure_rate_percent: 1.2,
    data_contract_version: 'v1.5',
    change_control_required: true,
    created_by: 'admin-001',
    created_at: '2020-01-01T00:00:00Z',
    updated_by: 'admin-001',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    integration_id: 'INT-003',
    integration_name: 'SMS Gateway',
    integration_type: 'Outbound',
    owner_institution_id: 'INST-ETHIOTELECOM',
    scope_supported: 'National',
    status: 'Degraded',
    health_check_url_ref: 'secure://health/sms',
    last_success_at: new Date(Date.now() - 300000).toISOString(),
    last_failure_at: new Date(Date.now() - 180000).toISOString(),
    failure_rate_percent: 15.5,
    data_contract_version: 'v1.0',
    change_control_required: false,
    created_by: 'admin-001',
    created_at: '2020-01-01T00:00:00Z',
    updated_by: 'admin-001',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    integration_id: 'INT-004',
    integration_name: 'Email Service',
    integration_type: 'Outbound',
    owner_institution_id: 'INST-ETHIOTELECOM',
    scope_supported: 'National',
    status: 'Active',
    health_check_url_ref: 'secure://health/email',
    last_success_at: new Date(Date.now() - 30000).toISOString(),
    last_failure_at: null,
    failure_rate_percent: 0.1,
    data_contract_version: 'v1.0',
    change_control_required: false,
    created_by: 'admin-001',
    created_at: '2020-01-01T00:00:00Z',
    updated_by: 'admin-001',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    integration_id: 'INT-005',
    integration_name: 'QR Verification Service',
    integration_type: 'Inbound',
    owner_institution_id: 'INST-GOVT-001',
    scope_supported: 'National',
    status: 'Active',
    health_check_url_ref: 'secure://health/qr',
    last_success_at: new Date(Date.now() - 45000).toISOString(),
    last_failure_at: null,
    failure_rate_percent: 0.0,
    data_contract_version: 'v1.0',
    change_control_required: false,
    created_by: 'admin-001',
    created_at: '2020-01-01T00:00:00Z',
    updated_by: 'admin-001',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Credentials
export const mockCredentials = [
  {
    credential_id: 'CRED-001',
    integration_id: 'INT-001',
    credential_type: 'API Key',
    secret_ref: 'vault://secrets/telebirr-api-key',
    masked_hint: '****-****-****-a1b2',
    created_at: '2020-01-01T00:00:00Z',
    created_by: 'admin-001',
    rotated_at: '2024-01-01T00:00:00Z',
    rotated_by: 'admin-001',
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    rotation_policy_days: 365,
    status: 'Active',
  },
  {
    credential_id: 'CRED-002',
    integration_id: 'INT-002',
    credential_type: 'OAuth',
    secret_ref: 'vault://secrets/rsifs-oauth',
    masked_hint: '****-****-****-c3d4',
    created_at: '2020-01-01T00:00:00Z',
    created_by: 'admin-001',
    rotated_at: null,
    rotated_by: null,
    expires_at: null,
    rotation_policy_days: null,
    status: 'Active',
  },
];

// Webhooks
export const mockWebhooks = [
  {
    webhook_id: 'WEB-001',
    integration_id: 'INT-002',
    event_types: ['inspection_certified', 'certificate_voided', 'case_shared'],
    target_url_ref: 'secure://webhooks/rsifs',
    auth_method: 'HMAC',
    retry_policy: { max_retries: 3, backoff: 'exponential' },
    enabled: true,
    last_delivery_at: new Date(Date.now() - 1800000).toISOString(),
    last_delivery_status: 'Success',
    failure_count_24h: 0,
    created_by: 'admin-001',
    created_at: '2024-01-01T00:00:00Z',
  },
];

// System Logs
export const mockSystemLogs = [
  {
    log_id: 'LOG-001',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    severity: 'ERROR',
    source: 'payments_adapter',
    correlation_id: 'CORR-001',
    user_id: null,
    center_id: 'CTR-001',
    integration_id: 'INT-001',
    message: 'Payment gateway timeout after 30s',
    stack_trace_ref: 'secure://logs/stack/LOG-001',
    event_payload_ref: 'secure://logs/payload/LOG-001',
  },
  {
    log_id: 'LOG-002',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    severity: 'WARN',
    source: 'camera_gateway',
    correlation_id: 'CORR-002',
    user_id: null,
    center_id: 'CTR-002',
    integration_id: 'INT-006',
    message: 'Camera feed latency increased to 5.2s',
    stack_trace_ref: null,
    event_payload_ref: null,
  },
  {
    log_id: 'LOG-003',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    severity: 'INFO',
    source: 'api',
    correlation_id: 'CORR-003',
    user_id: 'admin-001',
    center_id: null,
    integration_id: null,
    message: 'User login successful',
    stack_trace_ref: null,
    event_payload_ref: null,
  },
];

// Backup Policies
export const mockBackupPolicies = [
  {
    backup_policy_id: 'BACKUP-001',
    backup_scope: 'database',
    frequency: 'daily',
    retention_days: 90,
    storage_location_ref: 'secure://backups/db',
    encryption_enabled: true,
    last_backup_at: new Date(Date.now() - 3600000).toISOString(),
    last_backup_status: 'Success',
    last_backup_size_mb: 1250,
    created_by: 'admin-001',
    created_at: '2020-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    backup_policy_id: 'BACKUP-002',
    backup_scope: 'evidence metadata',
    frequency: 'hourly',
    retention_days: 30,
    storage_location_ref: 'secure://backups/evidence',
    encryption_enabled: true,
    last_backup_at: new Date(Date.now() - 1800000).toISOString(),
    last_backup_status: 'Success',
    last_backup_size_mb: 450,
    created_by: 'admin-001',
    created_at: '2020-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Restore Runs
export const mockRestoreRuns = [
  {
    restore_run_id: 'RESTORE-001',
    backup_id: 'BACKUP-001',
    restore_type: 'Full',
    requested_by: 'admin-001',
    requested_at: new Date(Date.now() - 2592000000).toISOString(),
    approved_by: 'admin-002',
    executed_by: 'admin-001',
    executed_at: new Date(Date.now() - 2592000000 + 3600000).toISOString(),
    environment: 'Test',
    result: 'Success',
    duration_seconds: 1800,
    verification_steps: [
      { step: 'Database integrity check', result: 'Pass' },
      { step: 'Sample data verification', result: 'Pass' },
      { step: 'Application connectivity', result: 'Pass' },
    ],
    verification_result: 'Pass',
    notes: 'Monthly restore test - all checks passed',
    audit_ref: 'AUD-RESTORE-001',
  },
];

// System Configuration
export const mockSystemConfig = [
  {
    config_key: 'payments.enabled',
    config_value_ref: 'true',
    config_category: 'payments',
    scope: 'global',
    enabled: true,
    effective_from: '2020-01-01T00:00:00Z',
    updated_by: 'admin-001',
    updated_at: '2020-01-01T00:00:00Z',
    requires_approval: true,
  },
  {
    config_key: 'evidence.strict_mode',
    config_value_ref: 'true',
    config_category: 'evidence',
    scope: 'global',
    enabled: true,
    effective_from: '2024-01-01T00:00:00Z',
    updated_by: 'admin-001',
    updated_at: '2024-01-01T00:00:00Z',
    requires_approval: true,
  },
  {
    config_key: 'export.approval_required',
    config_value_ref: 'true',
    config_category: 'security',
    scope: 'global',
    enabled: true,
    effective_from: '2020-01-01T00:00:00Z',
    updated_by: 'admin-001',
    updated_at: '2020-01-01T00:00:00Z',
    requires_approval: true,
  },
];

// Releases
export const mockReleases = [
  {
    release_id: 'REL-001',
    version: '2.1.0',
    release_date: new Date(Date.now() - 86400000).toISOString(),
    change_summary: 'Enhanced reporting, new inspection types, security improvements',
    modules_affected: ['Reports', 'Inspections', 'Security'],
    risk_level: 'Med',
    rollback_plan_ref: 'secure://releases/rollback/REL-001',
    approved_by: 'admin-001',
    deployment_status: 'Completed',
    post_deploy_checks: [
      { check: 'Database migrations', result: 'Pass' },
      { check: 'API endpoints', result: 'Pass' },
      { check: 'Integration health', result: 'Pass' },
    ],
  },
];

// Maintenance Windows
export const mockMaintenanceWindows = [
  {
    maintenance_id: 'MAINT-001',
    start_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    end_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    affected_modules: ['Payments', 'Reports'],
    affected_scopes: [],
    message_en: 'Scheduled maintenance for payment gateway upgrade',
    message_am: 'የክፍያ መግቢያ ማሻሻያ የታቀደ ጥገና',
    created_by: 'admin-001',
    status: 'Scheduled',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Helpdesk Tickets
export const mockHelpdeskTickets = [
  {
    ticket_id: 'TICKET-001',
    created_by_user_id: 'U-001',
    scope: 'center',
    category: 'Device Issue',
    severity: 'High',
    title: 'Camera offline at Bole Center 01',
    description: 'Camera CAM-001 has been offline for 2 hours. Inspections cannot proceed.',
    attachments_refs: ['secure://attachments/ticket-001-1.jpg'],
    linked_center_id: 'CTR-001',
    linked_device_id: 'CAM-001',
    linked_incident_id: 'INC-001',
    assigned_to_user_id: 'U-003',
    status: 'In Progress',
    resolution_notes: null,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    ticket_id: 'TICKET-002',
    created_by_user_id: 'U-002',
    scope: 'center',
    category: 'Payments',
    severity: 'Medium',
    title: 'TeleBirr payment failing intermittently',
    description: 'Some payments are failing with timeout errors. Happening about 10% of the time.',
    attachments_refs: [],
    linked_center_id: 'CTR-001',
    linked_device_id: null,
    linked_incident_id: null,
    assigned_to_user_id: null,
    status: 'Open',
    resolution_notes: null,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

// Knowledge Base Articles
export const mockKnowledgeBase = [
  {
    kb_article_id: 'KB-001',
    title_en: 'Camera Setup and GPS Configuration',
    title_am: 'የካሜራ ማቀናበር እና GPS ውቅር',
    category: 'Camera Setup',
    content_ref: 'secure://kb/camera-setup-v1',
    attachments_refs: ['secure://kb/attachments/camera-diagram.pdf'],
    visibility_roles: ['Super Admin', 'System Admin', 'Technician', 'Center Manager'],
    version: '1.0',
    last_updated_at: '2024-01-01T00:00:00Z',
    updated_by: 'admin-001',
  },
  {
    kb_article_id: 'KB-002',
    title_en: 'Device Calibration Procedures',
    title_am: 'የመሣሪያ ማስተካከያ ሂደቶች',
    category: 'Device Calibration',
    content_ref: 'secure://kb/calibration-v1',
    attachments_refs: [],
    visibility_roles: ['Super Admin', 'System Admin', 'Technician'],
    version: '1.0',
    last_updated_at: '2024-01-01T00:00:00Z',
    updated_by: 'admin-001',
  },
];

// Helper functions
export function getIntegrationStatusColor(status) {
  const colors = {
    Active: 'bg-green-100 text-green-800',
    Degraded: 'bg-yellow-100 text-yellow-800',
    Down: 'bg-red-100 text-red-800',
    Disabled: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || colors.Disabled;
}

export function getSeverityColor(severity) {
  const colors = {
    Critical: 'bg-red-100 text-red-800',
    High: 'bg-orange-100 text-orange-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-blue-100 text-blue-800',
  };
  return colors[severity] || colors.Low;
}

export function getLogSeverityColor(severity) {
  const colors = {
    CRITICAL: 'bg-red-100 text-red-800',
    ERROR: 'bg-red-100 text-red-800',
    WARN: 'bg-yellow-100 text-yellow-800',
    INFO: 'bg-blue-100 text-blue-800',
  };
  return colors[severity] || colors.INFO;
}

export function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString('en-ET', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Addis_Ababa',
  });
}

export function getInstitutionName(institutionId) {
  const inst = mockInstitutions.find(i => i.institution_id === institutionId);
  return inst ? inst.institution_name_en : institutionId;
}






