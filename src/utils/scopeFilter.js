// Scope-based filtering utilities for EPIC 0
// Ensures all data is filtered by user's jurisdiction scope

/**
 * Get user's scope information
 * @param {Object} user - User object with role and scope
 * @returns {Object} Scope configuration
 */
export function getUserScope(user) {
  if (!user) {
    return { type: "National", value: null, ids: [] };
  }

  const role = user.role?.toLowerCase() || "";
  const scopeType = user.scopeType || "National";
  const scopeValue = user.scopeValue || null;

  // Super Admin has national scope
  if (role.includes("super admin")) {
    return { type: "National", value: null, ids: [] };
  }

  // Regional Admin has regional scope
  if (role.includes("regional admin")) {
    return { type: "Regional", value: scopeValue, ids: [scopeValue] };
  }

  // Inspector has center scope
  if (role.includes("inspector")) {
    return { type: "Center", value: scopeValue, ids: [scopeValue] };
  }

  // Viewer has read-only access based on scope
  if (role.includes("viewer")) {
    return { type: scopeType, value: scopeValue, ids: scopeValue ? [scopeValue] : [] };
  }

  return { type: "National", value: null, ids: [] };
}

/**
 * Filter centers by user scope
 * @param {Array} centers - Array of center objects
 * @param {Object} scope - User scope configuration
 * @returns {Array} Filtered centers
 */
export function filterCentersByScope(centers, scope) {
  if (!centers || centers.length === 0) return [];
  if (scope.type === "National") return centers;

  if (scope.type === "Regional") {
    return centers.filter((c) => c.region === scope.value);
  }

  if (scope.type === "Center") {
    return centers.filter((c) => c.id === scope.value || c.name === scope.value);
  }

  return centers;
}

/**
 * Filter inspections by user scope
 * @param {Array} inspections - Array of inspection objects
 * @param {Object} scope - User scope configuration
 * @param {Array} centers - Array of center objects (for center ID mapping)
 * @returns {Array} Filtered inspections
 */
export function filterInspectionsByScope(inspections, scope, centers) {
  if (!inspections || inspections.length === 0) return [];
  if (scope.type === "National") return inspections;

  // Get center IDs in scope
  const scopedCenters = filterCentersByScope(centers, scope);
  const scopedCenterIds = scopedCenters.map((c) => c.id);
  const scopedCenterNames = scopedCenters.map((c) => c.name);

  return inspections.filter((inspection) => {
    const centerId = inspection.meta?.centerId || inspection.centerId;
    const centerName = inspection.meta?.center || inspection.meta?.centerName;

    return (
      scopedCenterIds.includes(centerId) ||
      scopedCenterNames.includes(centerName)
    );
  });
}

/**
 * Filter incidents by user scope
 * @param {Array} incidents - Array of incident objects
 * @param {Object} scope - User scope configuration
 * @returns {Array} Filtered incidents
 */
export function filterIncidentsByScope(incidents, scope) {
  if (!incidents || incidents.length === 0) return [];
  if (scope.type === "National") return incidents;

  if (scope.type === "Regional") {
    return incidents.filter(
      (inc) => inc.scope?.region === scope.value
    );
  }

  if (scope.type === "Center") {
    return incidents.filter(
      (inc) => inc.scope?.centerId === scope.value || inc.scope?.centerName === scope.value
    );
  }

  return incidents;
}

/**
 * Check if user has permission to view resource
 * @param {Object} user - User object
 * @param {string} permission - Permission required
 * @returns {boolean} Has permission
 */
export function hasPermission(user, permission) {
  if (!user) return false;

  const role = user.role?.toLowerCase() || "";

  // Super Admin has all permissions
  if (role.includes("super admin")) return true;

  // Viewer has read-only permissions
  if (role.includes("viewer")) {
    return permission.includes("view") || permission.includes("read");
  }

  // Regional Admin has regional permissions
  if (role.includes("regional admin")) {
    return !permission.includes("national") || permission.includes("regional");
  }

  // Inspector has center-level permissions
  if (role.includes("inspector")) {
    return permission.includes("center") || permission.includes("inspection");
  }

  return false;
}

