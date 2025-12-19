// Mock users with credentials for login
// In production, passwords would be hashed and stored securely

import { getUserRole, getUserScope } from './mockUsersRoles';

export const mockUsersWithCredentials = [
  {
    user_id: 'admin-001',
    full_name: 'Federal Super Admin',
    username: 'superadmin',
    password: 'admin123', // In production, this would be hashed
    email: 'superadmin@vims.gov.et',
    phone: '+251911234567',
    role_assignments: [
      {
        role_assignment_id: 'RA-001',
        role_id: 'superAdmin',
        scope_type: 'National',
        scope_ids: [],
        status: 'Active',
      },
    ],
    status: 'Active',
    last_login_at: null,
    mfa_enabled: false,
  },
  {
    user_id: 'admin-002',
    full_name: 'Security Admin',
    username: 'security',
    password: 'admin123',
    email: 'security@vims.gov.et',
    phone: '+251912345678',
    role_assignments: [
      {
        role_assignment_id: 'RA-002',
        role_id: 'securityAdmin',
        scope_type: 'National',
        scope_ids: [],
        status: 'Active',
      },
    ],
    status: 'Active',
    last_login_at: null,
    mfa_enabled: false,
  },
  {
    user_id: 'admin-003',
    full_name: 'Audit Admin',
    username: 'audit',
    password: 'admin123',
    email: 'audit@vims.gov.et',
    phone: '+251923456789',
    role_assignments: [
      {
        role_assignment_id: 'RA-003',
        role_id: 'auditAdmin',
        scope_type: 'National',
        scope_ids: [],
        status: 'Active',
      },
    ],
    status: 'Active',
    last_login_at: null,
    mfa_enabled: false,
  },
  {
    user_id: 'U-003',
    full_name: 'Regional Admin Oromia',
    username: 'admin.oromia',
    password: 'admin123',
    email: 'admin.oromia@vims.gov.et',
    phone: '+251934567890',
    role_assignments: [
      {
        role_assignment_id: 'RA-004',
        role_id: 'regionalAdmin',
        scope_type: 'Region',
        scope_ids: ['AU-OROMIA'],
        status: 'Active',
      },
    ],
    status: 'Active',
    last_login_at: null,
    mfa_enabled: false,
  },
  {
    user_id: 'U-004',
    full_name: 'Zone Admin East Shewa',
    username: 'admin.zone',
    password: 'admin123',
    email: 'admin.zone@vims.gov.et',
    phone: '+251945678901',
    role_assignments: [
      {
        role_assignment_id: 'RA-005',
        role_id: 'zoneAdmin',
        scope_type: 'Zone',
        scope_ids: ['AU-OROMIA-EAST'],
        status: 'Active',
      },
    ],
    status: 'Active',
    last_login_at: null,
    mfa_enabled: false,
  },
  {
    user_id: 'U-005',
    full_name: 'Center Manager Bole',
    username: 'manager.bole',
    password: 'admin123',
    email: 'manager.bole@vims.gov.et',
    phone: '+251956789012',
    role_assignments: [
      {
        role_assignment_id: 'RA-006',
        role_id: 'centerManager',
        scope_type: 'Center',
        scope_ids: ['CTR-001'],
        status: 'Active',
      },
    ],
    status: 'Active',
    last_login_at: null,
    mfa_enabled: false,
  },
  {
    user_id: 'U-001',
    full_name: 'John Inspector',
    username: 'inspector',
    password: 'inspector123',
    email: 'inspector@vims.gov.et',
    phone: '+251967890123',
    role_assignments: [
      {
        role_assignment_id: 'RA-007',
        role_id: 'inspector',
        scope_type: 'Center',
        scope_ids: ['CTR-001'],
        status: 'Active',
      },
    ],
    status: 'Active',
    last_login_at: null,
    mfa_enabled: false,
  },
  {
    user_id: 'U-002',
    full_name: 'Mary Receptionist',
    username: 'receptionist',
    password: 'reception123',
    email: 'receptionist@vims.gov.et',
    phone: '+251978901234',
    role_assignments: [
      {
        role_assignment_id: 'RA-008',
        role_id: 'receptionist',
        scope_type: 'Center',
        scope_ids: ['CTR-001'],
        status: 'Active',
      },
    ],
    status: 'Active',
    last_login_at: null,
    mfa_enabled: false,
  },
  {
    user_id: 'U-006',
    full_name: 'Viewer User',
    username: 'viewer',
    password: 'viewer123',
    email: 'viewer@vims.gov.et',
    phone: '+251989012345',
    role_assignments: [
      {
        role_assignment_id: 'RA-009',
        role_id: 'viewer',
        scope_type: 'Region',
        scope_ids: ['AU-OROMIA'],
        status: 'Active',
      },
    ],
    status: 'Active',
    last_login_at: null,
    mfa_enabled: false,
  },
  {
    user_id: 'U-007',
    full_name: 'Enforcement Agent',
    username: 'enforcement',
    password: 'enforce123',
    email: 'enforcement@vims.gov.et',
    phone: '+251990123456',
    role_assignments: [
      {
        role_assignment_id: 'RA-010',
        role_id: 'enforcementAgent',
        scope_type: 'Region',
        scope_ids: ['AU-OROMIA'],
        status: 'Active',
      },
    ],
    status: 'Active',
    last_login_at: null,
    mfa_enabled: false,
  },
];

// Helper function to get user role from user object
export function getUserRoleFromUser(user) {
  if (!user || !user.role_assignments || user.role_assignments.length === 0) return null;
  const activeAssignment = user.role_assignments.find(ra => ra.status === 'Active');
  return activeAssignment ? activeAssignment.role_id : null;
}

// Helper function to get user scope from user object
export function getUserScopeFromUser(user) {
  if (!user || !user.role_assignments || user.role_assignments.length === 0) {
    return { type: 'National', value: null, ids: [] };
  }
  const activeAssignment = user.role_assignments.find(ra => ra.status === 'Active');
  if (!activeAssignment) {
    return { type: 'National', value: null, ids: [] };
  }
  
  const roleId = activeAssignment.role_id;
  const scopeType = activeAssignment.scope_type;
  const scopeIds = activeAssignment.scope_ids || [];
  
  // Map role IDs to display names
  const roleDisplayMap = {
    'superAdmin': 'Super Administrator',
    'securityAdmin': 'Security Administrator',
    'auditAdmin': 'Audit Administrator',
    'regionalAdmin': 'Regional Administrator',
    'zoneAdmin': 'Zone Administrator',
    'centerManager': 'Center Manager',
    'inspector': 'Inspector',
    'receptionist': 'Receptionist',
    'viewer': 'Viewer',
    'enforcementAgent': 'Enforcement Agent',
  };

  return {
    type: scopeType,
    value: scopeIds.length > 0 ? scopeIds[0] : null,
    ids: scopeIds,
    role: roleDisplayMap[roleId] || roleId,
    roleId: roleId,
  };
}

