// Mock data for EPIC 7 - Reports & Analytics
// Scorecards, Benchmarks, Trends, Operational Reports, Scheduled Reports

// Executive Scorecard Data
export const mockScorecardData = {
  scope_applied: 'National',
  time_window: 'Today',
  last_updated_at: new Date().toISOString(),
  data_latency: 'Live',
  widgets: [
    {
      widget_id: 'total_inspections',
      definition: 'Total inspections completed',
      value: 1245,
      comparison_value: 1180,
      trend: 'up',
      trend_percent: 5.5,
    },
    {
      widget_id: 'pass_rate',
      definition: 'Percentage of inspections that passed',
      value: 87.3,
      comparison_value: 85.2,
      trend: 'up',
      trend_percent: 2.1,
    },
    {
      widget_id: 'fail_count',
      definition: 'Total inspections that failed',
      value: 142,
      comparison_value: 158,
      trend: 'down',
      trend_percent: -10.1,
    },
    {
      widget_id: 'retest_due',
      definition: 'Inspections requiring retest',
      value: 23,
      comparison_value: 28,
      trend: 'down',
      trend_percent: -17.9,
    },
    {
      widget_id: 'avg_cycle_time',
      definition: 'Average inspection cycle time in minutes',
      value: 12.5,
      comparison_value: 13.2,
      trend: 'down',
      trend_percent: -5.3,
    },
    {
      widget_id: 'revenue',
      definition: 'Total revenue collected',
      value: 625000,
      comparison_value: 590000,
      trend: 'up',
      trend_percent: 5.9,
      currency: 'ETB',
    },
    {
      widget_id: 'active_centers',
      definition: 'Centers currently online',
      value: 48,
      comparison_value: 50,
      trend: 'down',
      trend_percent: -4.0,
    },
    {
      widget_id: 'degraded_centers',
      definition: 'Centers in degraded state',
      value: 2,
      comparison_value: 1,
      trend: 'up',
      trend_percent: 100.0,
    },
    {
      widget_id: 'red_geofence_breaches',
      definition: 'Red zone geofence breaches detected',
      value: 8,
      comparison_value: 12,
      trend: 'down',
      trend_percent: -33.3,
    },
    {
      widget_id: 'evidence_gaps',
      definition: 'Inspections with missing mandatory evidence',
      value: 15,
      comparison_value: 22,
      trend: 'down',
      trend_percent: -31.8,
    },
    {
      widget_id: 'camera_offline_events',
      definition: 'Camera offline events during inspections',
      value: 5,
      comparison_value: 8,
      trend: 'down',
      trend_percent: -37.5,
    },
    {
      widget_id: 'fraud_flags',
      definition: 'Fraud/anomaly flags detected',
      value: 3,
      comparison_value: 4,
      trend: 'down',
      trend_percent: -25.0,
    },
  ],
};

// Center Benchmarking Data
export const mockBenchmarkData = [
  {
    center_id: 'CTR-001',
    center_name: 'Bole Center 01',
    jurisdiction_path: 'National > Addis Ababa > Bole',
    inspections_volume: 1250,
    pass_rate: 89.2,
    fail_rate: 8.5,
    retest_rate: 2.3,
    avg_cycle_time: 11.5,
    evidence_completeness_rate: 98.5,
    camera_uptime_percent: 99.2,
    machine_uptime_percent: 97.8,
    geofence_red_rate_per_1k: 2.4,
    geofence_yellow_rate_per_1k: 15.6,
    incident_rate: 0.8,
    attention_score: 12,
    rank_pass_rate: 3,
    rank_cycle_time: 5,
    rank_evidence: 2,
    percentile_pass_rate: 95,
    percentile_cycle_time: 88,
    data_quality_flags: [],
  },
  {
    center_id: 'CTR-002',
    center_name: 'Mercato Center 02',
    jurisdiction_path: 'National > Addis Ababa > Mercato',
    inspections_volume: 980,
    pass_rate: 82.1,
    fail_rate: 14.2,
    retest_rate: 3.7,
    avg_cycle_time: 15.2,
    evidence_completeness_rate: 94.3,
    camera_uptime_percent: 96.5,
    machine_uptime_percent: 92.1,
    geofence_red_rate_per_1k: 8.2,
    geofence_yellow_rate_per_1k: 28.5,
    incident_rate: 2.1,
    attention_score: 35,
    rank_pass_rate: 12,
    rank_cycle_time: 18,
    rank_evidence: 15,
    percentile_pass_rate: 45,
    percentile_cycle_time: 25,
    data_quality_flags: ['telemetry_delayed'],
  },
];

// Trend Data
export const mockTrendData = {
  inspections_over_time: {
    metric_id: 'inspections_count',
    granularity: 'daily',
    points: Array.from({ length: 30 }, (_, i) => ({
      period_start: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(Math.random() * 200) + 1000,
    })),
  },
  pass_rate_trend: {
    metric_id: 'pass_rate',
    granularity: 'weekly',
    points: Array.from({ length: 12 }, (_, i) => ({
      period_start: new Date(Date.now() - (11 - i) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.random() * 5 + 85,
    })),
  },
  geofence_breaches_trend: {
    metric_id: 'red_geofence_breaches',
    granularity: 'daily',
    points: Array.from({ length: 30 }, (_, i) => ({
      period_start: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(Math.random() * 15),
    })),
  },
};

// Operational Reports Data
export const mockOperationalData = {
  throughput: [
    {
      center_id: 'CTR-001',
      center_name: 'Bole Center 01',
      date: new Date().toISOString().split('T')[0],
      inspections_per_hour: 52,
      inspections_per_day: 1250,
      lanes: [
        { lane_id: 'LANE-001', inspections: 312, avg_cycle_time: 11.2 },
        { lane_id: 'LANE-002', inspections: 298, avg_cycle_time: 11.8 },
        { lane_id: 'LANE-003', inspections: 315, avg_cycle_time: 10.9 },
        { lane_id: 'LANE-004', inspections: 325, avg_cycle_time: 11.1 },
      ],
    },
  ],
  cycle_time_distribution: {
    p50: 12.5,
    p90: 18.2,
    p95: 22.1,
    avg: 13.1,
  },
};

// Machine Uptime Data
export const mockMachineUptimeData = [
  {
    center_id: 'CTR-001',
    lane_id: 'LANE-001',
    machine_id: 'MACH-001',
    machine_type: 'Brake Tester',
    uptime_percent_24h: 99.5,
    uptime_percent_7d: 98.2,
    uptime_percent_30d: 97.8,
    downtime_minutes_24h: 7,
    downtime_minutes_7d: 180,
    fault_count: 2,
    top_fault_codes: ['FAULT-001', 'FAULT-002'],
    last_seen_at: new Date(Date.now() - 30000).toISOString(),
    calibration_due_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Evidence Completeness Data
export const mockEvidenceCompletenessData = [
  {
    center_id: 'CTR-001',
    date: new Date().toISOString().split('T')[0],
    inspections_completed: 1250,
    evidence_complete_count: 1235,
    evidence_gap_count: 15,
    evidence_completeness_rate: 98.8,
    top_missing_evidence_reasons: [
      { reason: 'photo-required item missing', count: 10 },
      { reason: 'camera offline during inspection', count: 5 },
    ],
    linked_incidents_count: 3,
  },
];

// Fraud/Anomaly Signals
export const mockFraudSignals = [
  {
    signal_id: 'SIG-001',
    signal_type: 'unusually_short_inspection_duration',
    severity: 'Medium',
    center_id: 'CTR-002',
    lane_id: 'LANE-001',
    time_window: '2024-01-15 to 2024-01-20',
    metric_value: 3.2,
    baseline_value: 12.5,
    explanation_text: 'Average inspection duration of 3.2 minutes is significantly below baseline of 12.5 minutes',
    recommended_action: 'Audit center and verify equipment calibration',
  },
  {
    signal_id: 'SIG-002',
    signal_type: 'pass_rate_spike',
    severity: 'High',
    center_id: 'CTR-003',
    lane_id: null,
    time_window: '2024-01-10 to 2024-01-15',
    metric_value: 98.5,
    baseline_value: 85.2,
    explanation_text: 'Pass rate of 98.5% is significantly above baseline of 85.2%',
    recommended_action: 'Open incident and verify inspection integrity',
  },
];

// Report Catalog
export const mockReportCatalog = [
  {
    report_definition_id: 'RPT-EXEC-001',
    title_en: 'Executive Scorecard',
    title_am: 'የፈጻሚ የውጤት ሰንጠረዥ',
    category: 'Executive',
    description: 'High-level metrics for leadership visibility',
    data_sources: ['inspections_db', 'payments_db', 'monitoring_service'],
    supported_scopes: ['national', 'region', 'zone', 'sub-city', 'woreda', 'center'],
    supported_filters: ['date_range', 'jurisdiction', 'inspection_type'],
    default_time_window: 'Today',
    latency_type: 'Live',
    export_policy_id: 'POL-EXPORT-001',
    owner_role: 'Super Admin',
    enabled: true,
    version: '1.0',
  },
  {
    report_definition_id: 'RPT-OP-001',
    title_en: 'Operational Throughput Report',
    title_am: 'የክወና ውጤት ሪፖርት',
    category: 'Operational',
    description: 'Throughput, cycle time, and lane utilization metrics',
    data_sources: ['inspections_db', 'monitoring_service'],
    supported_scopes: ['national', 'region', 'center'],
    supported_filters: ['date_range', 'center', 'lane', 'inspection_type'],
    default_time_window: 'Last 7 days',
    latency_type: 'Near-real-time',
    export_policy_id: 'POL-EXPORT-002',
    owner_role: 'Super Admin',
    enabled: true,
    version: '1.0',
  },
];

// Scheduled Reports
export const mockScheduledReports = [
  {
    schedule_id: 'SCHED-001',
    report_definition_id: 'RPT-EXEC-001',
    schedule_name: 'Daily Executive Scorecard',
    rrule: 'FREQ=DAILY;BYHOUR=8',
    schedule_pattern: 'Daily at 8:00 AM',
    scope_applied: 'National',
    filters_payload: { time_window: 'Yesterday' },
    output_format: 'PDF',
    recipients: ['admin-001', 'admin-002'],
    delivery_channel: 'In-portal inbox',
    approval_required: false,
    enabled: true,
    created_by: 'admin-001',
    created_at: '2024-01-01T00:00:00Z',
  },
];

// Report Runs & Delivery Logs
export const mockReportRuns = [
  {
    report_run_id: 'RUN-001',
    schedule_id: 'SCHED-001',
    run_at: new Date(Date.now() - 3600000).toISOString(),
    status: 'Succeeded',
    row_count: 1245,
    file_ref: 'secure://reports/RUN-001.pdf',
    delivered_to: ['admin-001', 'admin-002'],
    delivery_status: [
      { recipient: 'admin-001', status: 'Delivered', delivered_at: new Date(Date.now() - 3300000).toISOString() },
      { recipient: 'admin-002', status: 'Delivered', delivered_at: new Date(Date.now() - 3300000).toISOString() },
    ],
    error_message: null,
    audit_ref: 'AUD-001',
  },
];

// Export Requests
export const mockExportRequests = [
  {
    export_id: 'EXP-001',
    report_definition_id: 'RPT-EXEC-001',
    report_run_id: null,
    requested_by_user_id: 'admin-001',
    requested_at: new Date(Date.now() - 1800000).toISOString(),
    scope_applied: 'National',
    filters_payload: { time_window: 'Last 7 days' },
    format: 'CSV',
    purpose_reason: 'Monthly executive review',
    approval_required: false,
    approval_status: 'Approved',
    row_count_estimate: 8700,
    generated_at: new Date(Date.now() - 1700000).toISOString(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    download_count: 1,
  },
];

// Helper functions
export function getTrendIcon(trend) {
  return trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
}

export function getTrendColor(trend) {
  return trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
}

export function formatCurrency(amount, currency = 'ETB') {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getPercentileColor(percentile) {
  if (percentile >= 90) return 'text-green-600';
  if (percentile >= 75) return 'text-blue-600';
  if (percentile >= 50) return 'text-yellow-600';
  return 'text-red-600';
}

// Legacy exports for ReportsAnalytics.jsx
export const mockRevenueData = [
  { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), count: 1200, amount: 600000 },
  { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), count: 1250, amount: 625000 },
  { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), count: 1180, amount: 590000 },
  { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), count: 1320, amount: 660000 },
  { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), count: 1280, amount: 640000 },
  { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), count: 1300, amount: 650000 },
  { date: new Date().toISOString(), count: 1245, amount: 622500 },
];

export const mockInspectionStats = {
  totalInspections: 8775,
  passed: 7650,
  failed: 875,
  pending: 250,
  passRate: 87.2,
  averageInspectionTime: 12.5,
};

export const mockRegionalStats = [
  { region: 'Addis Ababa', inspections: 3200, revenue: 1600000, passRate: 89.2 },
  { region: 'Oromia', inspections: 2800, revenue: 1400000, passRate: 85.5 },
  { region: 'Amhara', inspections: 1500, revenue: 750000, passRate: 86.8 },
  { region: 'SNNPR', inspections: 1275, revenue: 637500, passRate: 84.3 },
];

export const mockFraudAlerts = [
  {
    id: 'FA-001',
    type: 'Geofence Breach',
    severity: 'High',
    center: 'Bole Center 01',
    description: 'Vehicle inspection completed outside center geofence (>100m)',
    status: 'Open',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'FA-002',
    type: 'Vehicle Presence Violation',
    severity: 'Medium',
    center: 'Mercato Center 02',
    description: 'Inspection completed without vehicle presence detection',
    status: 'Open',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'FA-003',
    type: 'Unusually Short Duration',
    severity: 'High',
    center: 'Bole Center 01',
    description: 'Inspection completed in 3.2 minutes (baseline: 12.5 minutes)',
    status: 'Resolved',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockReportTemplates = [
  {
    id: 'template-001',
    name: 'Daily Revenue Summary',
    type: 'Revenue',
    frequency: 'Daily',
    recipients: ['admin@example.com', 'finance@example.com'],
    lastGenerated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'template-002',
    name: 'Weekly Fraud Report',
    type: 'Fraud',
    frequency: 'Weekly',
    recipients: ['security@example.com'],
    lastGenerated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockFraudTrendData = [
  { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), geofenceViolations: 12, vehiclePresenceViolations: 8, total: 20 },
  { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), geofenceViolations: 10, vehiclePresenceViolations: 6, total: 16 },
  { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), geofenceViolations: 15, vehiclePresenceViolations: 9, total: 24 },
  { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), geofenceViolations: 8, vehiclePresenceViolations: 5, total: 13 },
  { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), geofenceViolations: 11, vehiclePresenceViolations: 7, total: 18 },
  { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), geofenceViolations: 9, vehiclePresenceViolations: 4, total: 13 },
  { date: new Date().toISOString(), geofenceViolations: 8, vehiclePresenceViolations: 5, total: 13 },
];
