// Calculate attention score for centers based on various signals
// Used for "Centers Requiring Attention" ranked list

/**
 * Calculate attention score for a center (0-100)
 * Higher score = more attention needed
 */
export function calculateAttentionScore(center, incidents = []) {
  let score = 0;
  const reasons = [];

  // Center offline/degraded (40 points)
  if (center.status === "Offline") {
    score += 40;
    const offlineDuration = getOfflineDuration(center.lastHeartbeat);
    reasons.push(`Center offline ${offlineDuration}`);
  } else if (center.status === "Syncing" || center.status === "Degraded") {
    score += 20;
    reasons.push("Center degraded");
  }

  // Machine downtime (20 points) - removed from display but still contributes to score
  const machineDowntime = calculateMachineDowntime(center.machineStatus);
  if (machineDowntime > 0) {
    score += Math.min(20, machineDowntime * 5);
    // Machine status removed from reasons display
  }

  // Geofence breaches (15 points per breach)
  const geofenceBreaches = incidents.filter(
    (inc) => inc.type === "geofence_breach" && inc.scope?.centerId === center.id
  ).length;
  if (geofenceBreaches > 0) {
    score += Math.min(15, geofenceBreaches * 3);
    reasons.push(`${geofenceBreaches} geofence breach(es) today`);
  }

  // Evidence gaps (10 points per gap)
  const evidenceGaps = incidents.filter(
    (inc) => inc.type === "evidence_gap" && inc.scope?.centerId === center.id
  ).length;
  if (evidenceGaps > 0) {
    score += Math.min(10, evidenceGaps * 2);
    reasons.push(`${evidenceGaps} evidence gap(s) detected`);
  }

  // Camera downtime (10 points)
  const cameraIssues = incidents.filter(
    (inc) => inc.type === "camera_offline" && inc.scope?.centerId === center.id
  ).length;
  if (cameraIssues > 0) {
    score += Math.min(10, cameraIssues * 5);
    reasons.push("Camera offline");
  }

  // Fraud flags (5 points per flag)
  const fraudFlags = incidents.filter(
    (inc) => (inc.type === "geofence_breach" || inc.type === "evidence_gap") && inc.scope?.centerId === center.id
  ).length;
  if (fraudFlags > 0) {
    score += Math.min(5, fraudFlags);
    reasons.push(`${fraudFlags} fraud flag(s)`);
  }

  return {
    score: Math.min(100, score),
    reasons: reasons.slice(0, 3), // Top 3 reasons
  };
}

/**
 * Get offline duration in human-readable format
 */
function getOfflineDuration(lastHeartbeat) {
  if (!lastHeartbeat) return "unknown";
  
  const now = new Date();
  const last = new Date(lastHeartbeat);
  const diffMs = now - last;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffHours > 0) {
    return `${diffHours}h`;
  }
  return `${diffMins}m`;
}

/**
 * Calculate number of offline machines
 */
function calculateMachineDowntime(machineStatus) {
  if (!machineStatus || !Array.isArray(machineStatus)) return 0;
  
  return machineStatus.filter(
    (m) => m.status === "Offline" || m.status === "Syncing"
  ).length;
}

/**
 * Get jurisdiction path for a center
 */
export function getJurisdictionPath(center) {
  const parts = [];
  if (center.region) parts.push(center.region);
  if (center.zone) parts.push(center.zone);
  if (center.subCity) parts.push(center.subCity);
  if (center.woreda) parts.push(center.woreda);
  return parts.join(" > ") || center.region || "Unknown";
}

