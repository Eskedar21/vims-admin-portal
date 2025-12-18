// Utility functions for fraud detection
// Checks for geofence violations and vehicle presence violations

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in meters
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Check if inspection location is within center's geofence
 * @param {Object} inspection - Inspection object with location
 * @param {Object} center - Center object with lat, lng, radius
 * @returns {Object} { isValid: boolean, distance: number, violation: boolean }
 */
export function checkGeofenceViolation(inspection, center) {
  if (!inspection.meta?.location || !center?.lat || !center?.lng) {
    return {
      isValid: false,
      distance: null,
      violation: true,
      reason: "Missing location data",
    };
  }

  const inspectionLat = inspection.meta.location.lat;
  const inspectionLng = inspection.meta.location.lng;
  const distance = calculateDistance(
    center.lat,
    center.lng,
    inspectionLat,
    inspectionLng
  );

  const radius = center.radius || 500; // Default 500 meters
  const violation = distance > radius;

  return {
    isValid: !violation,
    distance: Math.round(distance),
    violation,
    reason: violation
      ? `Inspection performed ${Math.round(distance)}m from center (radius: ${radius}m)`
      : null,
  };
}

/**
 * Check if inspection was performed without vehicle presence
 * This checks various indicators that suggest vehicle was not present
 * @param {Object} inspection - Inspection object
 * @returns {Object} { violation: boolean, reason: string }
 */
export function checkVehiclePresenceViolation(inspection) {
  const violations = [];

  // Check if visual inspection photos are missing or suspicious
  if (!inspection.visualResults || inspection.visualResults.length === 0) {
    violations.push("No visual inspection photos recorded");
  } else {
    const photoCount = inspection.visualResults.filter(
      (r) => r.photoUrl
    ).length;
    if (photoCount < 3) {
      violations.push(`Only ${photoCount} visual inspection photos recorded`);
    }
  }

  // Check if machine test results are missing (suspicious if vehicle was present)
  if (!inspection.machineResults || inspection.machineResults.length === 0) {
    violations.push("No machine test results recorded");
  }

  // Check if inspection was completed too quickly (suspicious)
  // This would require start/end timestamps - placeholder for now
  if (inspection.meta?.inspectionDuration && inspection.meta.inspectionDuration < 5) {
    violations.push("Inspection completed too quickly (< 5 minutes)");
  }

  // Check if geoFenceStatus indicates issues
  if (inspection.meta?.geoFenceStatus === "Invalid" || inspection.meta?.geoFenceStatus === "Unknown") {
    violations.push("Geofence validation failed");
  }

  return {
    violation: violations.length > 0,
    reasons: violations,
    reason: violations.join("; "),
  };
}

/**
 * Detect fraud in an inspection and return violations
 * @param {Object} inspection - Inspection object
 * @param {Object} center - Center object
 * @returns {Object} { geofenceViolation: Object, vehiclePresenceViolation: Object, hasViolations: boolean }
 */
export function detectFraud(inspection, center) {
  const geofenceCheck = checkGeofenceViolation(inspection, center);
  const vehiclePresenceCheck = checkVehiclePresenceViolation(inspection);

  return {
    geofenceViolation: geofenceCheck,
    vehiclePresenceViolation: vehiclePresenceCheck,
    hasViolations: geofenceCheck.violation || vehiclePresenceCheck.violation,
  };
}

