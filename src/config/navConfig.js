/**
 * Navigation Configuration for Admin Portal
 * Single nav model filtered by role
 */

export const ROLES = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'superAdmin',
  SYSTEM_ADMIN: 'systemAdmin',
};

const ALL_ROLES = Object.values(ROLES);

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
    roles: ALL_ROLES,
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
    roles: ALL_ROLES,
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    icon: 'chart-bar',
    route: '/reports',
    roles: ALL_ROLES,
  },
  {
    id: 'configuration',
    label: 'Configuration',
    icon: 'settings',
    route: '/configuration',
    roles: ALL_ROLES,
    children: [
      { id: 'config.standards', label: 'Test Standards', route: '/configuration', roles: ALL_ROLES },
      { id: 'config.checklists', label: 'Visual Checklists', route: '/configuration/visual-checklists', roles: ALL_ROLES },
      { id: 'config.fees', label: 'Fee & Payment', route: '/configuration/fee-structure', roles: ALL_ROLES },
    ],
  },
  {
    id: 'inspection-program',
    label: 'Inspection Program',
    icon: 'clipboard-list',
    route: '/inspection-program',
    roles: ALL_ROLES,
  },
  {
    id: 'governance',
    label: 'Governance',
    icon: 'building',
    route: '/governance',
    roles: ALL_ROLES,
  },
  {
    id: 'casework',
    label: 'Inspection Records & Casework',
    icon: 'file-text',
    route: '/casework',
    roles: ALL_ROLES,
  },
  {
    id: 'admin',
    label: 'Administration',
    icon: 'users',
    route: '/administration',
    roles: ALL_ROLES,
  },
  {
    id: 'security',
    label: 'Security',
    icon: 'shield-check',
    route: '/security',
    roles: ALL_ROLES,
  },
  {
    id: 'system-admin',
    label: 'System Administration',
    icon: 'settings',
    route: '/system-admin',
    roles: ALL_ROLES,
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

