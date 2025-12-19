// Mock data for EPIC 8 - Security, Audit & Data Governance
// Audit Logs, Access Logs, Security Alerts, Sessions, Policies, Exports

// Audit Events
export const mockAuditEvents = [
  {
    audit_event_id: 'AUD-001',
    event_type: 'user_created',
    actor_user_id: 'admin-001',
    actor_role_id: 'superAdmin',
    actor_scope_type: 'National',
    actor_scope_ids: [],
    target_type: 'user',
    target_id: 'U-010',
    action: 'create',
    before_snapshot: null,
    after_snapshot: { user_id: 'U-010', role: 'Regional Admin', scope: 'Oromia' },
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    ip_address: '192.168.1.100',
    device_id: 'DEV-001',
    session_id: 'SESS-001',
    result: 'success',
    failure_reason: null,
    correlation_id: null,
    data_classification: 'Internal',
  },
  {
    audit_event_id: 'AUD-002',
    event_type: 'geofence_updated',
    actor_user_id: 'admin-001',
    actor_role_id: 'superAdmin',
    actor_scope_type: 'National',
    actor_scope_ids: [],
    target_type: 'geofence',
    target_id: 'GEOF-001',
    action: 'update',
    before_snapshot: { radius_m: 50 },
    after_snapshot: { radius_m: 75 },
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    ip_address: '192.168.1.100',
    device_id: 'DEV-001',
    session_id: 'SESS-002',
    result: 'success',
    failure_reason: null,
    correlation_id: 'INC-001',
    data_classification: 'Restricted',
  },
  {
    audit_event_id: 'AUD-003',
    event_type: 'export_downloaded',
    actor_user_id: 'admin-002',
    actor_role_id: 'auditAdmin',
    actor_scope_type: 'National',
    actor_scope_ids: [],
    target_type: 'report',
    target_id: 'EXP-001',
    action: 'download',
    before_snapshot: null,
    after_snapshot: { download_count: 1 },
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    ip_address: '192.168.1.105',
    device_id: 'DEV-002',
    session_id: 'SESS-003',
    result: 'success',
    failure_reason: null,
    correlation_id: null,
    data_classification: 'Restricted',
  },
  {
    audit_event_id: 'AUD-004',
    event_type: 'role_changed',
    actor_user_id: 'admin-001',
    actor_role_id: 'superAdmin',
    actor_scope_type: 'National',
    actor_scope_ids: [],
    target_type: 'user',
    target_id: 'U-005',
    action: 'update',
    before_snapshot: { role: 'Regional Admin' },
    after_snapshot: { role: 'Zone Admin' },
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    ip_address: '192.168.1.100',
    device_id: 'DEV-001',
    session_id: 'SESS-004',
    result: 'success',
    failure_reason: null,
    correlation_id: null,
    data_classification: 'Restricted',
  },
];

// Inspection Lifecycle Events
export const mockLifecycleEvents = [
  {
    lifecycle_event_id: 'LIFE-001',
    inspection_id: 'INS-001',
    event_type: 'registered',
    performed_by_user_id: 'U-002',
    performed_at: new Date(Date.now() - 3600000).toISOString(),
    device_id: 'KIOSK-001',
    source_system: 'ops_db',
    notes: 'Inspection registered at reception',
    hash_ref: 'sha256:abc123...',
  },
  {
    lifecycle_event_id: 'LIFE-002',
    inspection_id: 'INS-001',
    event_type: 'payment_confirmed',
    performed_by_user_id: 'U-002',
    performed_at: new Date(Date.now() - 3500000).toISOString(),
    device_id: 'KIOSK-001',
    source_system: 'payments_db',
    notes: 'Payment confirmed via TeleBirr',
    hash_ref: 'sha256:def456...',
  },
  {
    lifecycle_event_id: 'LIFE-003',
    inspection_id: 'INS-001',
    event_type: 'inspection_started',
    performed_by_user_id: 'U-001',
    performed_at: new Date(Date.now() - 3400000).toISOString(),
    device_id: 'TABLET-001',
    source_system: 'ops_db',
    notes: 'Inspector started inspection',
    hash_ref: null,
  },
  {
    lifecycle_event_id: 'LIFE-004',
    inspection_id: 'INS-001',
    event_type: 'certified',
    performed_by_user_id: 'system',
    performed_at: new Date(Date.now() - 3000000).toISOString(),
    device_id: null,
    source_system: 'ops_db',
    notes: 'Inspection completed and certified',
    hash_ref: 'sha256:ghi789...',
  },
];

// Access Logs
export const mockAccessLogs = [
  {
    access_log_id: 'ACC-001',
    user_id: 'admin-001',
    role_id: 'superAdmin',
    login_at: new Date(Date.now() - 7200000).toISOString(),
    logout_at: null,
    session_id: 'SESS-001',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    device_fingerprint: 'FP-001',
    geo_approx: { country: 'Ethiopia', city: 'Addis Ababa' },
    mfa_used: true,
    auth_method: 'password',
    scope_at_login: { type: 'National', ids: [] },
    policy_violations: [],
  },
  {
    access_log_id: 'ACC-002',
    user_id: 'U-005',
    role_id: 'regionalAdmin',
    login_at: new Date(Date.now() - 3600000).toISOString(),
    logout_at: null,
    session_id: 'SESS-002',
    ip_address: '192.168.1.105',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    device_fingerprint: 'FP-002',
    geo_approx: { country: 'Ethiopia', city: 'Addis Ababa' },
    mfa_used: false,
    auth_method: 'password',
    scope_at_login: { type: 'Region', ids: ['AU-OROMIA'] },
    policy_violations: [],
  },
  {
    access_log_id: 'ACC-003',
    user_id: 'U-006',
    role_id: 'enforcementAgent',
    login_at: new Date(Date.now() - 1800000).toISOString(),
    logout_at: null,
    session_id: 'SESS-003',
    ip_address: '192.168.1.110',
    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)',
    device_fingerprint: 'FP-003',
    geo_approx: { country: 'Ethiopia', city: 'Addis Ababa' },
    mfa_used: true,
    auth_method: 'SSO',
    scope_at_login: { type: 'Region', ids: ['AU-OROMIA'] },
    policy_violations: [
      { type: 'out_of_scope_query', target: '/inspections', timestamp: new Date(Date.now() - 900000).toISOString() },
    ],
  },
];

// Security Alerts
export const mockSecurityAlerts = [
  {
    security_alert_id: 'SEC-ALERT-001',
    severity: 'High',
    type: 'multiple_failed_logins',
    user_id: 'U-007',
    ip_address: '192.168.1.200',
    first_detected_at: new Date(Date.now() - 1800000).toISOString(),
    last_seen_at: new Date(Date.now() - 300000).toISOString(),
    count: 5,
    status: 'Open',
    linked_audit_event_ids: ['AUD-005', 'AUD-006'],
    recommended_action: 'lock account, require MFA',
  },
  {
    security_alert_id: 'SEC-ALERT-002',
    severity: 'Medium',
    type: 'login_from_new_device',
    user_id: 'admin-001',
    ip_address: '192.168.1.150',
    first_detected_at: new Date(Date.now() - 3600000).toISOString(),
    last_seen_at: new Date(Date.now() - 3600000).toISOString(),
    count: 1,
    status: 'Acknowledged',
    linked_audit_event_ids: ['AUD-007'],
    recommended_action: 'verify device, notify user',
  },
  {
    security_alert_id: 'SEC-ALERT-003',
    severity: 'Critical',
    type: 'abnormal_export_activity',
    user_id: 'U-008',
    ip_address: '192.168.1.120',
    first_detected_at: new Date(Date.now() - 7200000).toISOString(),
    last_seen_at: new Date(Date.now() - 1800000).toISOString(),
    count: 12,
    status: 'Open',
    linked_audit_event_ids: ['AUD-008', 'AUD-009'],
    recommended_action: 'review exports, notify supervisor',
  },
];

// Security Policies
export const mockSecurityPolicies = {
  password: {
    min_length: 12,
    complexity_rules: ['uppercase', 'lowercase', 'numbers', 'special'],
    password_history_count: 5,
    max_age_days: 90,
  },
  mfa: {
    mfa_required_for_roles: ['superAdmin', 'securityAdmin'],
    mfa_methods_allowed: ['TOTP', 'SMS', 'Email'],
  },
  session: {
    session_timeout_minutes: 480,
    max_concurrent_sessions: 3,
    idle_timeout_minutes: 30,
    force_logout_on_password_change: true,
  },
};

// IP Policies
export const mockIPPolicies = [
  {
    ip_policy_id: 'IP-POL-001',
    mode: 'AllowlistOnly',
    allowed_ranges: ['192.168.0.0/16', '10.0.0.0/8'],
    denied_ranges: [],
    applies_to_roles: ['superAdmin', 'securityAdmin'],
    enforcement_level: 'Block',
    effective_from: '2024-01-01T00:00:00Z',
    enabled: true,
  },
  {
    ip_policy_id: 'IP-POL-002',
    mode: 'DenylistOnly',
    allowed_ranges: [],
    denied_ranges: ['203.0.113.0/24'],
    applies_to_roles: [],
    enforcement_level: 'Block',
    effective_from: '2024-01-01T00:00:00Z',
    enabled: true,
  },
];

// Active Sessions
export const mockActiveSessions = [
  {
    session_id: 'SESS-001',
    user_id: 'admin-001',
    role_id: 'superAdmin',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    last_activity_at: new Date(Date.now() - 60000).toISOString(),
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    mfa_used: true,
    status: 'Active',
  },
  {
    session_id: 'SESS-002',
    user_id: 'U-005',
    role_id: 'regionalAdmin',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    last_activity_at: new Date(Date.now() - 120000).toISOString(),
    ip_address: '192.168.1.105',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    mfa_used: false,
    status: 'Active',
  },
];

// Export Requests (from EPIC 7, extended)
export const mockExportRequestsExtended = [
  {
    export_id: 'EXP-001',
    requested_by_user_id: 'admin-002',
    requested_at: new Date(Date.now() - 1800000).toISOString(),
    report_definition_id: 'RPT-EXEC-001',
    scope_applied: 'National',
    filters_payload: { time_window: 'Last 7 days' },
    row_count_estimate: 8700,
    row_count_actual: 8700,
    format: 'CSV',
    purpose_reason: 'Monthly executive review',
    approval_required: false,
    approval_status: 'Approved',
    approved_by_user_id: null,
    approved_at: null,
    generated_at: new Date(Date.now() - 1700000).toISOString(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    download_count: 1,
    delivery_target: 'download',
  },
];

// Data Classification Rules
export const mockDataClassificationRules = [
  {
    data_object: 'inspection',
    classification: 'Internal',
    restricted_fields: [],
    allowed_roles: ['Super Admin', 'Regional Admin', 'Enforcement Agent'],
    masking_policy: 'show',
  },
  {
    data_object: 'evidence',
    classification: 'Restricted',
    restricted_fields: ['storage_ref', 'hash_checksum'],
    allowed_roles: ['Super Admin', 'Security Admin'],
    masking_policy: 'mask',
  },
  {
    data_object: 'payment',
    classification: 'Restricted',
    restricted_fields: ['merchant_id', 'provider_txn_id'],
    allowed_roles: ['Super Admin', 'Finance Admin'],
    masking_policy: 'partial',
  },
];

// Helper functions
export function getEventTypeLabel(eventType) {
  const labels = {
    user_created: 'User Created',
    role_changed: 'Role Changed',
    center_created: 'Center Created',
    geofence_updated: 'Geofence Updated',
    threshold_updated: 'Threshold Updated',
    export_requested: 'Export Requested',
    export_downloaded: 'Export Downloaded',
    incident_ack: 'Incident Acknowledged',
    case_shared: 'Case Shared',
  };
  return labels[eventType] || eventType;
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

export function isSessionExpired(session, timeoutMinutes = 480) {
  const lastActivity = new Date(session.last_activity_at);
  const now = new Date();
  const diffMinutes = (now - lastActivity) / (1000 * 60);
  return diffMinutes > timeoutMinutes;
}






