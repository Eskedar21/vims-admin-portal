/**
 * Navigation Configuration for Admin Portal
 * Single nav model filtered by role
 */

export const ROLES = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'superAdmin',
  SYSTEM_ADMIN: 'systemAdmin',
  SECURITY_ADMIN: 'securityAdmin',
  AUDIT_ADMIN: 'auditAdmin',
  REGIONAL_ADMIN: 'regionalAdmin',
  ZONE_ADMIN: 'zoneAdmin',
  CENTER_MANAGER: 'centerManager',
  INSPECTOR: 'inspector',
  RECEPTIONIST: 'receptionist',
  VIEWER: 'viewer',
  ENFORCEMENT_AGENT: 'enforcementAgent',
};

// Map role IDs to navigation roles
export function mapRoleIdToNavRole(roleId) {
  const roleMap = {
    'superAdmin': ROLES.SUPER_ADMIN,
    'securityAdmin': ROLES.SUPER_ADMIN, // Security admin has similar access
    'auditAdmin': ROLES.SUPER_ADMIN, // Audit admin has similar access
    'regionalAdmin': ROLES.REGIONAL_ADMIN,
    'zoneAdmin': ROLES.REGIONAL_ADMIN,
    'centerManager': ROLES.ADMIN,
    'inspector': ROLES.ADMIN,
    'receptionist': ROLES.ADMIN,
    'viewer': ROLES.VIEWER,
    'enforcementAgent': ROLES.ADMIN,
  };
  return roleMap[roleId] || ROLES.ADMIN;
}

// Define which roles can access which sections
const ALL_ROLES = Object.values(ROLES);
const ADMIN_ROLES = [ROLES.SUPER_ADMIN, ROLES.SECURITY_ADMIN, ROLES.AUDIT_ADMIN, ROLES.ADMIN];
const VIEWER_ROLES = [ROLES.VIEWER];
const OPERATIONAL_ROLES = [ROLES.REGIONAL_ADMIN, ROLES.ZONE_ADMIN, ROLES.CENTER_MANAGER, ROLES.INSPECTOR, ROLES.RECEPTIONIST];

export const PRIMARY_TOP_NAV = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'home',
    route: '/',
    roles: ALL_ROLES,
  },
  {
    id: 'operations',
    label: 'Operations Command Center',
    icon: 'activity',
    route: '/operations',
    roles: [...ADMIN_ROLES, ...OPERATIONAL_ROLES],
  },
  {
    id: 'inspection-operations',
    label: 'Inspections',
    icon: 'clipboard-list',
    route: '/inspection-operations',
    roles: ALL_ROLES,
  },
  {
    id: 'centers',
    label: 'Center Management',
    icon: 'building',
    route: '/center-management',
    roles: [...ADMIN_ROLES, ...OPERATIONAL_ROLES],
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    icon: 'chart-bar',
    route: '/reports',
    roles: ALL_ROLES,
    children: [
      { id: 'reports.scorecard', label: 'Executive Scorecard', route: '/reports/scorecard', roles: ALL_ROLES },
      { id: 'reports.trends', label: 'Trend Analysis', route: '/reports/trends', roles: ALL_ROLES },
      { id: 'reports.operational', label: 'Operational Reports', route: '/reports/operational', roles: ALL_ROLES },
      { id: 'reports.evidence', label: 'Evidence Completeness', route: '/reports/evidence', roles: ALL_ROLES },
      { id: 'reports.compliance', label: 'Compliance & Integrity', route: '/reports/compliance', roles: ALL_ROLES },
    ],
  },
  {
    id: 'configuration',
    label: 'Configuration',
    icon: 'settings',
    route: '/configuration',
    roles: ADMIN_ROLES, // Only admins can configure
    children: [
      { id: 'config.standards', label: 'Test Standards', route: '/configuration', roles: ADMIN_ROLES },
      { id: 'config.checklists', label: 'Visual Checklists', route: '/configuration/visual-checklists', roles: ADMIN_ROLES },
      { id: 'config.fees', label: 'Fee & Payment', route: '/configuration/fee-structure', roles: ADMIN_ROLES },
    ],
  },
  {
    id: 'governance',
    label: 'Governance',
    icon: 'building',
    route: '/governance',
    roles: ADMIN_ROLES, // Only admins can manage governance
    children: [
      { id: 'governance.units', label: 'Administration Units', route: '/governance/units', roles: ADMIN_ROLES },
      { id: 'governance.assignments', label: 'Assignments', route: '/governance/assignments', roles: ADMIN_ROLES },
      { id: 'governance.institutions', label: 'Institutions', route: '/governance/institutions', roles: ADMIN_ROLES },
      { id: 'governance.relationships', label: 'Relationships', route: '/governance/relationships', roles: ADMIN_ROLES },
    ],
  },
  {
    id: 'admin',
    label: 'Administration',
    icon: 'users',
    route: '/administration',
    roles: ADMIN_ROLES, // Only admins can manage users
  },
  {
    id: 'security',
    label: 'Security',
    icon: 'shield-check',
    route: '/security',
    roles: [...ADMIN_ROLES, ROLES.AUDIT_ADMIN], // Admins and audit admins
    children: [
      { id: 'security.all', label: 'All Logs', route: '/security/all', roles: [...ADMIN_ROLES, ROLES.AUDIT_ADMIN] },
      { id: 'security.desktop', label: 'Desktop App Actions', route: '/security/desktop-app', roles: [...ADMIN_ROLES, ROLES.AUDIT_ADMIN] },
      { id: 'security.admin', label: 'Admin Portal Actions', route: '/security/admin-portal', roles: [...ADMIN_ROLES, ROLES.AUDIT_ADMIN] },
    ],
  },
];

/**
 * Filter nav items by role
 */
export function getNavForRole(role) {
  return PRIMARY_TOP_NAV
    .filter((item) => item.roles.includes(role))
    .map((item) => ({
      ...item,
      children: item.children?.filter((child) => child.roles.includes(role)),
    }));
}

/**
 * Design tokens
 */
export const DESIGN_TOKENS = {
  colors: {
    primary: '#009639',
    primaryDark: '#007A2F',
    success: '#16A34A',
    error: '#DC2626',
    warning: '#F59E0B',
    bg: '#F4F6F5',
    bgDark: '#1F2937',
    text: '#111827',
    textMuted: '#6B7280',
    border: '#E5E7EB',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  fontSizes: {
    xs: '11px',
    sm: '12px',
    md: '14px',
    lg: '16px',
    xl: '20px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
};

/**
 * Keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS = {
  dashboard: { key: 'd', ctrl: true, label: 'Ctrl+D', action: 'Dashboard' },
  search: { key: 'f', ctrl: true, label: 'Ctrl+F', action: 'Search' },
  print: { key: 'p', ctrl: true, label: 'Ctrl+P', action: 'Print/Export' },
};

