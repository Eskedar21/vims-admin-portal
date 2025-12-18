// Service to generate notifications for fraud violations
// This should be called when inspections are processed or reviewed

import { detectFraud } from "./fraudDetection";

// Track which inspections have already generated notifications to prevent duplicates
const notifiedInspections = new Set();

/**
 * Generate notifications for fraud violations in an inspection
 * @param {Object} inspection - Inspection object
 * @param {Object} center - Center object
 * @param {Function} addNotification - Function from NotificationContext
 * @param {Array} existingNotifications - Existing notifications to check for duplicates
 */
export function generateFraudNotifications(inspection, center, addNotification, existingNotifications = []) {
  // Check if we've already notified for this inspection
  const notificationKey = `${inspection.id}-fraud-check`;
  if (notifiedInspections.has(notificationKey)) {
    // Also check if notification already exists in the system
    const alreadyNotified = existingNotifications.some(
      (n) => n.inspectionId === inspection.id && (n.type === "geofence" || n.type === "vehicle_presence")
    );
    if (alreadyNotified) {
      return; // Skip if already notified
    }
  }

  const fraudCheck = detectFraud(inspection, center);

  // Generate notification for geofence violation
  if (fraudCheck.geofenceViolation.violation) {
    addNotification({
      type: "geofence",
      title: "Geofence Violation Detected",
      message: `Inspection ${inspection.id} for vehicle ${inspection.vehicle?.plate || "Unknown"} was performed outside the defined center geofence. ${fraudCheck.geofenceViolation.reason}`,
      severity: "high",
      inspectionId: inspection.id,
      centerId: center?.id,
      vehiclePlate: inspection.vehicle?.plate,
    });
    notifiedInspections.add(`${notificationKey}-geofence`);
  }

  // Generate notification for vehicle presence violation
  if (fraudCheck.vehiclePresenceViolation.violation) {
    addNotification({
      type: "vehicle_presence",
      title: "Vehicle Presence Violation Detected",
      message: `Inspection ${inspection.id} for vehicle ${inspection.vehicle?.plate || "Unknown"} may have been performed without the vehicle being present. ${fraudCheck.vehiclePresenceViolation.reason}`,
      severity: "high",
      inspectionId: inspection.id,
      centerId: center?.id,
      vehiclePlate: inspection.vehicle?.plate,
    });
    notifiedInspections.add(`${notificationKey}-vehicle`);
  }

  if (fraudCheck.hasViolations) {
    notifiedInspections.add(notificationKey);
  }
}

/**
 * Batch check multiple inspections and generate notifications
 * @param {Array} inspections - Array of inspection objects
 * @param {Array} centers - Array of center objects
 * @param {Function} addNotification - Function from NotificationContext
 * @param {Array} existingNotifications - Existing notifications to check for duplicates
 */
export function batchCheckInspections(inspections, centers, addNotification, existingNotifications = []) {
  inspections.forEach((inspection) => {
    const center = centers.find(
      (c) => c.name === inspection.meta?.center || c.id === inspection.centerId
    );
    if (center) {
      generateFraudNotifications(inspection, center, addNotification, existingNotifications);
    }
  });
}

