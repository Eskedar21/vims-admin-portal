// Mock data for EPIC 9 - Users, Roles & Scope Administration
// Users, Roles, Permissions, Delegations, Approvals

import { mockAdminUnits } from './mockGovernance';
import { mockInstitutions } from './mockGovernance';

// Role Library
export const mockRoles = [
  {
    role_id: 'superAdmin',
    role_name_en: 'Super Admin',
    role_name_am: 'ሱፐር አስተዳዳሪ',
    role_category: 'Admin',
    default_scope_type: 'National',
    permission_set_id: 'PERM-SET-001',
    is_sensitive_role: true,
    two_person_approval_required: true,
    enabled: true,
    version: '1.0',
  },
  {
    role_id: 'securityAdmin',
    role_name_en: 'Security Admin',
    role_name_am: 'ደህንነት አስተዳዳሪ',
    role_category: 'Admin',
    default_scope_type: 'National',
    permission_set_id: 'PERM-SET-002',
    is_sensitive_role: true,
    two_person_approval_required: true,
    enabled: true,
    version: '1.0',
  },
  {
    role_id: 'auditAdmin',
    role_name_en: 'Audit/Compliance Admin',
    role_name_am: 'ኦዲት/የመጣራት አስተዳዳሪ',
    role_category: 'Audit',
    default_scope_type: 'National',
    permission_set_id: 'PERM-SET-003',
    is_sensitive_role: true,
    two_person_approval_required: true,
    enabled: true,
    version: '1.0',
  },
  {
    role_id: 'regionalAdmin',
    role_name_en: 'Regional Admin',
    role_name_am: 'ክልላዊ አስተዳዳሪ',
    role_category: 'Admin',
    default_scope_type: 'Region',
    permission_set_id: 'PERM-SET-004',
    is_sensitive_role: false,
    two_person_approval_required: false,
    enabled: true,
    version: '1.0',
  },
  {
    role_id: 'zoneAdmin',
    role_name_en: 'Zone Admin',
    role_name_am: 'ዞን አስተዳዳሪ',
    role_category: 'Admin',
    default_scope_type: 'Zone',
    permission_set_id: 'PERM-SET-005',
    is_sensitive_role: false,
    two_person_approval_required: false,
    enabled: true,
    version: '1.0',
  },
  {
    role_id: 'centerManager',
    role_name_en: 'Center Manager',
    role_name_am: 'ማዕከል አስተዳዳሪ',
    role_category: 'Operations',
    default_scope_type: 'Center',
    permission_set_id: 'PERM-SET-006',
    is_sensitive_role: false,
    two_person_approval_required: false,
    enabled: true,
    version: '1.0',
  },
  {
    role_id: 'inspector',
    role_name_en: 'Inspector',
    role_name_am: 'መመርመሪያ',
    role_category: 'Operations',
    default_scope_type: 'Center',
    permission_set_id: 'PERM-SET-007',
    is_sensitive_role: false,
    two_person_approval_required: false,
    enabled: true,
    version: '1.0',
  },
  {
    role_id: 'receptionist',
    role_name_en: 'Receptionist/Cashier',
    role_name_am: 'ተቀባይ/ገንዘብ አስተናጋጅ',
    role_category: 'Operations',
    default_scope_type: 'Center',
    permission_set_id: 'PERM-SET-008',
    is_sensitive_role: false,
    two_person_approval_required: false,
    enabled: true,
    version: '1.0',
  },
  {
    role_id: 'enforcementAgent',
    role_name_en: 'Enforcement Agent',
    role_name_am: 'የፍጻሜ አገልጋይ',
    role_category: 'Enforcement',
    default_scope_type: 'Region',
    permission_set_id: 'PERM-SET-009',
    is_sensitive_role: false,
    two_person_approval_required: false,
    enabled: true,
    version: '1.0',
  },
  {
    role_id: 'viewer',
    role_name_en: 'Viewer',
    role_name_am: 'አንባቢ',
    role_category: 'ReadOnly',
    default_scope_type: 'Region',
    permission_set_id: 'PERM-SET-010',
    is_sensitive_role: false,
    two_person_approval_required: false,
    enabled: true,
    version: '1.0',
  },
  {
    role_id: 'boloIssuer',
    role_name_en: 'Bolo Issuer',
    role_name_am: 'ቦሎ አሳሳች',
    role_category: 'ReadOnly',
    default_scope_type: 'Region',
    permission_set_id: 'PERM-SET-011',
    is_sensitive_role: false,
    two_person_approval_required: false,
    enabled: true,
    version: '1.0',
  },
];

// Permission Sets
export const mockPermissionSets = {
  'PERM-SET-001': { // Super Admin
    permissions: [
      'CENTER.CREATE', 'CENTER.UPDATE', 'CENTER.DELETE',
      'USER.CREATE', 'USER.UPDATE', 'USER.DELETE',
      'ROLE.ASSIGN', 'ROLE.CREATE', 'ROLE.UPDATE',
      'EXPORT.GENERATE', 'EXPORT.APPROVE',
      'GOVERNANCE.CREATE', 'GOVERNANCE.UPDATE',
      'FEE.CREATE', 'FEE.UPDATE',
      'INCIDENT.ASSIGN', 'INCIDENT.RESOLVE',
    ],
  },
  'PERM-SET-011': { // Bolo Issuer
    permissions: [
      'INSPECTION.VIEW', 'CERTIFICATE.VIEW', 'REPORT.VIEW',
    ],
  },
};

// Users
export const mockUsers = [
  {
    user_id: 'admin-001',
    full_name: 'Federal Super Admin',
    username: 'superadmin',
    phone: '+251911234567',
    email: 'superadmin@vims.gov.et',
    institution_id: 'INST-GOVT-001',
    job_title: 'Federal Administrator',
    role_assignments: [
      {
        role_assignment_id: 'RA-001',
        role_id: 'superAdmin',
        scope_type: 'National',
        scope_ids: [],
        effective_from: '2020-01-01T00:00:00Z',
        effective_to: null,
        status: 'Active',
        assigned_by_user_id: 'system',
        assigned_at: '2020-01-01T00:00:00Z',
        approval_required: false,
        approval_status: 'Approved',
      },
    ],
    status: 'Active',
    last_login_at: new Date(Date.now() - 3600000).toISOString(),
    mfa_enrolled: true,
    created_by: 'system',
    created_at: '2020-01-01T00:00:00Z',
    updated_by: 'admin-001',
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    user_id: 'U-001',
    full_name: 'John Inspector',
    username: 'j.inspector',
    phone: '+251912345678',
    email: 'j.inspector@vims.gov.et',
    institution_id: 'INST-GOVT-001',
    job_title: 'Vehicle Inspector',
    role_assignments: [
      {
        role_assignment_id: 'RA-002',
        role_id: 'inspector',
        scope_type: 'Center',
        scope_ids: ['CTR-001'],
        effective_from: '2024-01-01T00:00:00Z',
        effective_to: null,
        status: 'Active',
        assigned_by_user_id: 'admin-001',
        assigned_at: '2024-01-01T00:00:00Z',
        approval_required: false,
        approval_status: 'Approved',
      },
    ],
    status: 'Active',
    last_login_at: new Date(Date.now() - 7200000).toISOString(),
    mfa_enrolled: false,
    created_by: 'admin-001',
    created_at: '2024-01-01T00:00:00Z',
    updated_by: 'admin-001',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    user_id: 'U-002',
    full_name: 'Mary Receptionist',
    username: 'm.receptionist',
    phone: '+251923456789',
    email: 'm.receptionist@vims.gov.et',
    institution_id: 'INST-GOVT-001',
    job_title: 'Receptionist',
    role_assignments: [
      {
        role_assignment_id: 'RA-003',
        role_id: 'receptionist',
        scope_type: 'Center',
        scope_ids: ['CTR-001'],
        effective_from: '2024-01-01T00:00:00Z',
        effective_to: null,
        status: 'Active',
        assigned_by_user_id: 'admin-001',
        assigned_at: '2024-01-01T00:00:00Z',
        approval_required: false,
        approval_status: 'Approved',
      },
    ],
    status: 'Active',
    last_login_at: new Date(Date.now() - 1800000).toISOString(),
    mfa_enrolled: false,
    created_by: 'admin-001',
    created_at: '2024-01-01T00:00:00Z',
    updated_by: 'admin-001',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    user_id: 'U-003',
    full_name: 'Regional Admin Oromia',
    username: 'admin.oromia',
    phone: '+251934567890',
    email: 'admin.oromia@vims.gov.et',
    institution_id: 'INST-GOVT-001',
    job_title: 'Regional Administrator',
    role_assignments: [
      {
        role_assignment_id: 'RA-004',
        role_id: 'regionalAdmin',
        scope_type: 'Region',
        scope_ids: ['AU-OROMIA'],
        effective_from: '2024-01-01T00:00:00Z',
        effective_to: null,
        status: 'Active',
        assigned_by_user_id: 'admin-001',
        assigned_at: '2024-01-01T00:00:00Z',
        approval_required: false,
        approval_status: 'Approved',
      },
    ],
    status: 'Active',
    last_login_at: new Date(Date.now() - 3600000).toISOString(),
    mfa_enrolled: true,
    created_by: 'admin-001',
    created_at: '2024-01-01T00:00:00Z',
    updated_by: 'admin-001',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Delegation Policies
export const mockDelegationPolicies = [
  {
    delegation_policy_id: 'DEL-POL-001',
    delegator_role_id: 'regionalAdmin',
    allowed_roles_to_assign: ['zoneAdmin', 'woredaAdmin', 'centerManager', 'inspector', 'receptionist', 'technician', 'viewer'],
    max_scope_level_assignable: 'within region subtree',
    requires_approval_for_sensitive_assignments: true,
    enabled: true,
    created_by: 'admin-001',
    created_at: '2024-01-01T00:00:00Z',
  },
];

// Approval Requests
export const mockApprovalRequests = [
  {
    approval_request_id: 'APR-001',
    request_type: 'RoleAssignment',
    requested_by_user_id: 'admin-001',
    target_user_id: 'U-010',
    requested_change_summary: 'Assign Security Admin role to new user',
    diff_before_after: {
      before: { role_assignments: [] },
      after: { role_assignments: [{ role_id: 'securityAdmin', scope_type: 'National' }] },
    },
    risk_level: 'High',
    status: 'Pending',
    approved_by_user_id: null,
    approved_at: null,
    rejection_reason: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Helper functions
export function getUserRole(user) {
  if (!user || !user.role_assignments || user.role_assignments.length === 0) return null;
  const activeAssignment = user.role_assignments.find(ra => ra.status === 'Active');
  return activeAssignment ? activeAssignment.role_id : null;
}

export function getUserScope(user) {
  if (!user || !user.role_assignments || user.role_assignments.length === 0) return null;
  const activeAssignment = user.role_assignments.find(ra => ra.status === 'Active');
  if (!activeAssignment) return null;
  return {
    type: activeAssignment.scope_type,
    ids: activeAssignment.scope_ids || [],
  };
}

export function canAssignRole(assigner, targetRole, targetScope) {
  // Super Admin can assign anything
  if (getUserRole(assigner) === 'superAdmin') return { allowed: true };
  
  // Check delegation policy
  const assignerRole = getUserRole(assigner);
  const assignerScope = getUserScope(assigner);
  const policy = mockDelegationPolicies.find(p => p.delegator_role_id === assignerRole && p.enabled);
  
  if (!policy) {
    return { allowed: false, reason: 'No delegation policy for your role' };
  }
  
  // Check if role is allowed
  if (!policy.allowed_roles_to_assign.includes(targetRole)) {
    return { allowed: false, reason: 'You cannot assign this role' };
  }
  
  // Check scope
  if (targetScope.type === 'National') {
    return { allowed: false, reason: 'Cannot assign National scope' };
  }
  
  if (assignerScope.type === 'Region' && targetScope.type !== 'Region' && !targetScope.ids.some(id => id.startsWith('AU-'))) {
    return { allowed: false, reason: 'Scope outside your jurisdiction' };
  }
  
  return { allowed: true };
}

export function requiresApproval(roleId, scopeType) {
  const role = mockRoles.find(r => r.role_id === roleId);
  if (!role) return false;
  
  if (role.is_sensitive_role) return true;
  if (scopeType === 'National') return true;
  return false;
}

export function getRoleDisplayName(roleId) {
  const role = mockRoles.find(r => r.role_id === roleId);
  return role ? role.role_name_en : roleId;
}

export function getInstitutionName(institutionId) {
  const inst = mockInstitutions.find(i => i.institution_id === institutionId);
  return inst ? inst.institution_name_en : institutionId;
}

export function getScopeDisplayName(scopeType, scopeIds) {
  if (scopeType === 'National') return 'National';
  if (scopeIds.length === 0) return scopeType;
  
  const units = scopeIds.map(id => {
    const unit = mockAdminUnits.find(u => u.admin_unit_id === id);
    return unit ? unit.admin_unit_name_en : id;
  });
  
  return `${scopeType}: ${units.join(', ')}`;
}






