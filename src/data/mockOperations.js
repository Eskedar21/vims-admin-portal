// Mock data for EPIC 1 - Operations Command Center
// Includes centers, cameras, geofence compliance, alerts, and incidents

import { mockCenters } from './mockCenters';
import { mockIncidents } from './mockIncidents';

// Extended center data with operational metrics
export const mockOperationsCenters = mockCenters.map((center, idx) => {
  const now = Date.now();
  const heartbeatAgo = idx === 0 ? 30000 : idx === 1 ? 120000 : idx === 2 ? 600000 : idx === 3 ? 15000 : 900000;
  
  return {
    ...center,
    center_id: center.id,
    center_name: center.name,
    geo_lat: center.lat || center.latitude,
    geo_lon: center.lng || center.longitude,
    jurisdiction_path: `${center.region}${center.zone ? ` > ${center.zone}` : ''}${center.subCity ? ` > ${center.subCity}` : ''}${center.woreda ? ` > ${center.woreda}` : ''}`,
    status: center.status === 'Syncing' ? 'Degraded' : center.status,
    last_heartbeat_at: new Date(now - heartbeatAgo).toISOString(),
    active_lanes_count: idx === 0 ? 4 : idx === 1 ? 3 : idx === 2 ? 0 : idx === 3 ? 4 : 0,
    open_incidents_count: {
      critical: idx === 2 ? 1 : idx === 4 ? 1 : 0,
      high: idx === 1 ? 2 : idx === 0 ? 1 : 0,
      total: idx === 0 ? 2 : idx === 1 ? 3 : idx === 2 ? 1 : idx === 4 ? 1 : 0,
    },
    attention_score: 0, // Will be calculated
    uptime_24h_percent: idx === 0 ? 98.5 : idx === 1 ? 87.2 : idx === 2 ? 0 : idx === 3 ? 99.1 : 0,
    inspections_today: idx === 0 ? 45 : idx === 1 ? 32 : idx === 2 ? 0 : idx === 3 ? 52 : 0,
    avg_cycle_time_today: idx === 0 ? 12.5 : idx === 1 ? 15.2 : idx === 3 ? 11.8 : 0,
  };
});

// Camera data
export const mockCameras = [
  {
    camera_id: 'CAM-001',
    center_id: 'CTR-001',
    lane_id: 'LANE-001',
    camera_label: 'Front Camera - Lane 1',
    gps_supported: true,
    last_frame_at: new Date(Date.now() - 5000).toISOString(),
    frame_staleness_seconds: 5,
    stream_health: 'OK',
    storage_total_gb: 500,
    storage_used_gb: 320,
    storage_free_gb: 180,
    retention_days_policy: 30,
    snapshot_events_supported: ['Start', 'End', 'Fail', 'Retest'],
  },
  {
    camera_id: 'CAM-002',
    center_id: 'CTR-001',
    lane_id: 'LANE-001',
    camera_label: 'Side Camera - Lane 1',
    gps_supported: true,
    last_frame_at: new Date(Date.now() - 15000).toISOString(),
    frame_staleness_seconds: 15,
    stream_health: 'OK',
    storage_total_gb: 500,
    storage_used_gb: 310,
    storage_free_gb: 190,
    retention_days_policy: 30,
    snapshot_events_supported: ['Start', 'End'],
  },
  {
    camera_id: 'CAM-003',
    center_id: 'CTR-002',
    lane_id: 'LANE-002',
    camera_label: 'Front Camera - Lane 2',
    gps_supported: false, // Missing GPS
    last_frame_at: new Date(Date.now() - 180000).toISOString(),
    frame_staleness_seconds: 180,
    stream_health: 'Degraded',
    storage_total_gb: 500,
    storage_used_gb: 450,
    storage_free_gb: 50,
    retention_days_policy: 30,
    snapshot_events_supported: ['Start', 'End', 'Fail'],
  },
  {
    camera_id: 'CAM-004',
    center_id: 'CTR-004',
    lane_id: 'LANE-003',
    camera_label: 'Front Camera - Lane 3',
    gps_supported: true,
    last_frame_at: new Date(Date.now() - 300000).toISOString(),
    frame_staleness_seconds: 300,
    stream_health: 'Down',
    storage_total_gb: 500,
    storage_used_gb: 480,
    storage_free_gb: 20,
    retention_days_policy: 30,
    snapshot_events_supported: ['Start', 'End', 'Fail', 'Retest'],
  },
];

// Geofence compliance data
export const mockGeofenceCompliance = [
  {
    inspection_id: 'INS-001',
    center_id: 'CTR-001',
    captured_at: new Date(Date.now() - 3600000).toISOString(),
    lat: 8.9806,
    lon: 38.7578,
    location_source: 'camera_gps',
    distance_m: 25,
    band: 'GREEN',
    location_confidence: 'High',
  },
  {
    inspection_id: 'INS-002',
    center_id: 'CTR-001',
    captured_at: new Date(Date.now() - 7200000).toISOString(),
    lat: 8.9815,
    lon: 38.7585,
    location_source: 'tablet_gps',
    distance_m: 75,
    band: 'YELLOW',
    location_confidence: 'High',
  },
  {
    inspection_id: 'INS-003',
    center_id: 'CTR-001',
    captured_at: new Date(Date.now() - 10800000).toISOString(),
    lat: 8.9850,
    lon: 38.7620,
    location_source: 'camera_gps',
    distance_m: 150,
    band: 'RED',
    location_confidence: 'Med',
    reason_low_confidence: 'GPS reading may be stale',
  },
  {
    inspection_id: 'INS-004',
    center_id: 'CTR-002',
    captured_at: new Date(Date.now() - 14400000).toISOString(),
    lat: 8.5410,
    lon: 39.2710,
    location_source: 'kiosk_gps',
    distance_m: 85,
    band: 'YELLOW',
    location_confidence: 'High',
  },
  {
    inspection_id: 'INS-005',
    center_id: 'CTR-002',
    captured_at: new Date(Date.now() - 18000000).toISOString(),
    lat: 8.5450,
    lon: 39.2750,
    location_source: 'tablet_gps',
    distance_m: 200,
    band: 'RED',
    location_confidence: 'Low',
    reason_low_confidence: 'GPS unavailable, using derived location',
  },
];

// Alerts (pre-incident or incident)
export const mockAlerts = [
  {
    alert_id: 'ALT-001',
    alert_type: 'camera_offline',
    severity: 'High',
    scope: { region: 'SNNPR', centerId: 'CTR-004', centerName: 'Hawassa Center' },
    center_id: 'CTR-004',
    lane_id: 'LANE-003',
    asset_id: 'CAM-004',
    detected_at: new Date(Date.now() - 21600000).toISOString(),
    status: 'New',
    correlation_key: 'camera_offline_CTR-004_CAM-004',
    evidence_links: ['log-001', 'snapshot-001'],
  },
  {
    alert_id: 'ALT-002',
    alert_type: 'geofence_breach',
    severity: 'High',
    scope: { region: 'Addis Ababa', centerId: 'CTR-001', centerName: 'Bole Center 01' },
    center_id: 'CTR-001',
    detected_at: new Date(Date.now() - 1800000).toISOString(),
    status: 'Acknowledged',
    correlation_key: 'geofence_breach_CTR-001_2024-01-15',
    evidence_links: ['inspection-003'],
  },
  {
    alert_id: 'ALT-003',
    alert_type: 'machine_fault',
    severity: 'Medium',
    scope: { region: 'Oromia', centerId: 'CTR-002', centerName: 'Adama Center' },
    center_id: 'CTR-002',
    asset_id: 'MACH-002',
    detected_at: new Date(Date.now() - 3600000).toISOString(),
    status: 'ConvertedToIncident',
    correlation_key: 'machine_fault_CTR-002_MACH-002',
    evidence_links: ['telemetry-001'],
  },
  {
    alert_id: 'ALT-004',
    alert_type: 'storage_critical',
    severity: 'Medium',
    scope: { region: 'SNNPR', centerId: 'CTR-004', centerName: 'Hawassa Center' },
    center_id: 'CTR-004',
    asset_id: 'CAM-004',
    detected_at: new Date(Date.now() - 7200000).toISOString(),
    status: 'New',
    correlation_key: 'storage_critical_CTR-004_CAM-004',
    evidence_links: [],
  },
];

// Extended incidents with timeline and assignments
export const mockOperationsIncidents = mockIncidents.map((inc, idx) => ({
  ...inc,
  incident_id: inc.id,
  affected_assets: [
    { type: 'center', id: inc.scope?.centerId, name: inc.scope?.centerName },
    ...(inc.scope?.machineId ? [{ type: 'machine', id: inc.scope.machineId, name: inc.scope.machineName }] : []),
    ...(inc.scope?.cameraId ? [{ type: 'camera', id: inc.scope.cameraId }] : []),
  ],
  timeline_events: [
    {
      at: inc.firstDetectedAt,
      actor: 'system',
      event_type: 'detected',
      details: 'Incident automatically detected by monitoring system',
    },
    ...(inc.status === 'Acknowledged' || inc.status === 'In Progress' ? [{
      at: new Date(new Date(inc.firstDetectedAt).getTime() + 300000).toISOString(),
      actor: inc.assignedToUserId || 'system',
      event_type: 'acknowledged',
      details: 'Incident acknowledged',
    }] : []),
    ...(inc.status === 'In Progress' ? [{
      at: new Date(new Date(inc.firstDetectedAt).getTime() + 600000).toISOString(),
      actor: inc.assignedToUserId || 'system',
      event_type: 'assigned',
      details: `Assigned to user ${inc.assignedToUserId}`,
    }] : []),
  ],
  sla_due_at: new Date(new Date(inc.firstDetectedAt).getTime() + (inc.severity === 'Critical' ? 1800000 : inc.severity === 'High' ? 3600000 : 7200000)).toISOString(),
  resolution_notes: inc.status === 'Resolved' ? 'Issue resolved by maintenance team' : null,
  root_cause_tag_id: null,
  linked_inspections_count: inc.impactMetrics?.inspectionsAffectedCount || 0,
}));

// Root cause tags taxonomy
export const rootCauseTags = {
  geofence_location: [
    { id: 'gf_within_green', label: 'Within Green Zone', category: 'Geofence / Location' },
    { id: 'gf_yellow_zone', label: 'Yellow Zone Exceeded (50-100m)', category: 'Geofence / Location' },
    { id: 'gf_red_zone_breach', label: 'Red Zone Breach (>100m)', category: 'Geofence / Location' },
    { id: 'gf_gps_unavailable', label: 'GPS Unavailable', category: 'Geofence / Location' },
    { id: 'gf_gps_spoof', label: 'GPS Spoof Suspected', category: 'Geofence / Location' },
  ],
  camera_evidence: [
    { id: 'cam_offline', label: 'Camera Offline', category: 'Camera / Evidence' },
    { id: 'cam_frame_stale', label: 'Last Frame Stale', category: 'Camera / Evidence' },
    { id: 'cam_storage_full', label: 'Storage Full', category: 'Camera / Evidence' },
    { id: 'cam_snapshot_missing', label: 'Snapshot Event Missing', category: 'Camera / Evidence' },
    { id: 'cam_evidence_gap', label: 'Evidence Gap - Required Photo Missing', category: 'Camera / Evidence' },
  ],
  machine_telemetry: [
    { id: 'mach_offline', label: 'Machine Offline', category: 'Machine / Telemetry' },
    { id: 'mach_repeated_faults', label: 'Repeated Faults', category: 'Machine / Telemetry' },
    { id: 'mach_packet_loss', label: 'Telemetry Packet Loss', category: 'Machine / Telemetry' },
    { id: 'mach_time_drift', label: 'Time Sync Drift', category: 'Machine / Telemetry' },
  ],
  security: [
    { id: 'sec_suspicious_login', label: 'Suspicious Login', category: 'Security' },
    { id: 'sec_failed_logins', label: 'Multiple Failed Logins', category: 'Security' },
    { id: 'sec_unusual_session', label: 'Unusual Session', category: 'Security' },
  ],
  operations: [
    { id: 'ops_operator_error', label: 'Operator Error', category: 'Operations' },
    { id: 'ops_power_outage', label: 'Power Outage', category: 'Operations' },
    { id: 'ops_network_outage', label: 'Network Outage', category: 'Operations' },
    { id: 'ops_maintenance_overdue', label: 'Maintenance Overdue', category: 'Operations' },
  ],
};

// SLA rules
export const mockSLARules = [
  {
    incident_type: 'center_offline',
    severity: 'Critical',
    ack_due_minutes: 15,
    resolve_due_minutes: 60,
    escalation_steps: [
      { after_minutes: 20, target_role: 'Regional Admin', channel: 'in-system' },
      { after_minutes: 45, target_role: 'Super Admin', channel: 'email' },
    ],
    working_hours_policy: '24/7',
  },
  {
    incident_type: 'geofence_breach',
    severity: 'High',
    ack_due_minutes: 30,
    resolve_due_minutes: 120,
    escalation_steps: [
      { after_minutes: 45, target_role: 'Regional Admin', channel: 'in-system' },
    ],
    working_hours_policy: '24/7',
  },
  {
    incident_type: 'camera_offline',
    severity: 'High',
    ack_due_minutes: 30,
    resolve_due_minutes: 180,
    escalation_steps: [
      { after_minutes: 60, target_role: 'Regional Admin', channel: 'in-system' },
    ],
    working_hours_policy: '24/7',
  },
  {
    incident_type: 'machine_fault',
    severity: 'Medium',
    ack_due_minutes: 60,
    resolve_due_minutes: 240,
    escalation_steps: [],
    working_hours_policy: 'business_hours',
  },
];

// Helper functions
export function getCenterStatus(center) {
  const ONLINE_THRESHOLD_MIN = 2;
  const OFFLINE_THRESHOLD_MIN = 10;
  
  if (!center.last_heartbeat_at) return 'Offline';
  
  const now = new Date();
  const lastHeartbeat = new Date(center.last_heartbeat_at);
  const diffMinutes = (now - lastHeartbeat) / (1000 * 60);
  
  if (diffMinutes <= ONLINE_THRESHOLD_MIN) {
    return 'Online';
  } else if (diffMinutes <= OFFLINE_THRESHOLD_MIN) {
    return 'Degraded';
  } else {
    return 'Offline';
  }
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
  // Haversine formula for distance in meters
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function getGeofenceBand(distanceM) {
  if (distanceM <= 50) return 'GREEN';
  if (distanceM <= 100) return 'YELLOW';
  return 'RED';
}

