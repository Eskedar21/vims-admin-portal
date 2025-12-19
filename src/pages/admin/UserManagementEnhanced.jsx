import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, UserPlus, Shield, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { mockUsers, mockRoles, getUserRole, getUserScope, canAssignRole, requiresApproval, getRoleDisplayName, getInstitutionName, getScopeDisplayName } from '../../data/mockUsersRoles';
import { mockAdminUnits, mockInstitutions } from '../../data/mockGovernance';
import { useAuth } from '../../context/AuthContext';

const USER_STATUSES = ['Active', 'Suspended', 'Disabled', 'PendingActivation'];
const SCOPE_TYPES = ['National', 'Region', 'Zone', 'Sub-city', 'Woreda', 'Center'];

function UserManagementEnhanced() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState(mockUsers);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    phone: '',
    email: '',
    institution_id: '',
    job_title: '',
    status: 'PendingActivation',
  });
  const [assignmentData, setAssignmentData] = useState({
    role_id: '',
    scope_type: 'Center',
    scope_ids: [],
  });

  const filteredUsers = useMemo(() => {
    let filtered = [...users];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(u =>
        u.full_name.toLowerCase().includes(query) ||
        u.username.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(u => u.status === statusFilter);
    }
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => {
        const role = getUserRole(u);
        return role === roleFilter;
      });
    }
    
    return filtered;
  }, [users, searchQuery, statusFilter, roleFilter]);

  const handleCreateUser = () => {
    // Validate
    if (!formData.full_name || !formData.username) {
      alert('Full name and username are required');
      return;
    }
    
    // Check if username exists
    if (users.some(u => u.username === formData.username)) {
      alert('Username already exists');
      return;
    }
    
    const newUser = {
      user_id: `U-${Date.now()}`,
      ...formData,
      role_assignments: [],
      last_login_at: null,
      mfa_enrolled: false,
      created_by: currentUser?.id || 'admin-001',
      created_at: new Date().toISOString(),
      updated_by: currentUser?.id || 'admin-001',
      updated_at: new Date().toISOString(),
    };
    
    setUsers([...users, newUser]);
    setShowCreateModal(false);
    resetForm();
    console.log('User created (audit logged)', newUser);
  };

  const handleSuspendUser = (userId) => {
    if (window.confirm('Suspend this user? This will immediately block logins and active sessions.')) {
      const updated = users.map(u =>
        u.user_id === userId
          ? { ...u, status: 'Suspended', updated_at: new Date().toISOString() }
          : u
      );
      setUsers(updated);
      console.log('User suspended (audit logged)', { user_id: userId });
    }
  };

  const handleAssignRole = () => {
    if (!selectedUser) return;
    
    if (!assignmentData.role_id) {
      alert('Please select a role');
      return;
    }
    
    if (assignmentData.scope_type !== 'National' && assignmentData.scope_ids.length === 0) {
      alert('Please select at least one scope ID');
      return;
    }
    
    // Validate assignment
    const validation = canAssignRole(currentUser, assignmentData.role_id, {
      type: assignmentData.scope_type,
      ids: assignmentData.scope_ids,
    });
    
    if (!validation.allowed) {
      alert(`Assignment blocked: ${validation.reason}`);
      return;
    }
    
    // Check if approval required
    const needsApproval = requiresApproval(assignmentData.role_id, assignmentData.scope_type);
    
    const newAssignment = {
      role_assignment_id: `RA-${Date.now()}`,
      role_id: assignmentData.role_id,
      scope_type: assignmentData.scope_type,
      scope_ids: assignmentData.scope_ids,
      effective_from: new Date().toISOString(),
      effective_to: null,
      status: needsApproval ? 'Pending' : 'Active',
      assigned_by_user_id: currentUser?.id || 'admin-001',
      assigned_at: new Date().toISOString(),
      approval_required: needsApproval,
      approval_status: needsApproval ? 'Pending' : 'Approved',
      approved_by_user_id: null,
      approved_at: null,
    };
    
    const updated = users.map(u =>
      u.user_id === selectedUser.user_id
        ? {
            ...u,
            role_assignments: [...(u.role_assignments || []), newAssignment],
            updated_at: new Date().toISOString(),
          }
        : u
    );
    
    setUsers(updated);
    setShowAssignModal(false);
    setSelectedUser(null);
    resetAssignmentForm();
    
    if (needsApproval) {
      alert('Role assignment requires approval. Request submitted.');
    }
    
    console.log('Role assigned (audit logged)', { user_id: selectedUser.user_id, assignment: newAssignment });
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      username: '',
      phone: '',
      email: '',
      institution_id: '',
      job_title: '',
      status: 'PendingActivation',
    });
  };

  const resetAssignmentForm = () => {
    setAssignmentData({
      role_id: '',
      scope_type: 'Center',
      scope_ids: [],
    });
  };

  const getStatusBadge = (status) => {
    const config = {
      Active: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      Suspended: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
      Disabled: { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle },
      PendingActivation: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
    };
    const c = config[status] || config.Active;
    const Icon = c.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${c.bg} ${c.text}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const availableScopes = useMemo(() => {
    if (assignmentData.scope_type === 'National') return [];
    if (assignmentData.scope_type === 'Region') {
      return mockAdminUnits.filter(u => u.admin_unit_type === 'Region' && u.status === 'Active');
    }
    if (assignmentData.scope_type === 'Zone') {
      return mockAdminUnits.filter(u => u.admin_unit_type === 'Zone' && u.status === 'Active');
    }
    if (assignmentData.scope_type === 'Center') {
      // In real app, would fetch from centers
      return [{ center_id: 'CTR-001', center_name: 'Bole Center 01' }];
    }
    return [];
  }, [assignmentData.scope_type]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">
            Create, edit, and manage users with role and scope assignments
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create User
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-semibold text-blue-800">
            RBAC & Scope Enforcement
          </span>
        </div>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• (Role × Scope) = Access. A role alone is never enough.</li>
          <li>• No privilege escalation. Scoped admins cannot grant permissions above their own.</li>
          <li>• Sensitive role assignments require two-person approval.</li>
        </ul>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, username, or email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
            >
              <option value="all">All Status</option>
              {USER_STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
            >
              <option value="all">All Roles</option>
              {mockRoles.filter(r => r.enabled).map(role => (
                <option key={role.role_id} value={role.role_id}>{role.role_name_en}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Users ({filteredUsers.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Scope</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Last Login</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => {
                const role = getUserRole(user);
                const scope = getUserScope(user);
                return (
                  <tr key={user.user_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                      <div className="text-xs text-gray-500">{user.username}</div>
                      {user.email && (
                        <div className="text-xs text-gray-500">{user.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {role ? (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {getRoleDisplayName(role)}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">No role assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {scope ? getScopeDisplayName(scope.type, scope.ids) : 'No scope'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString('en-ET') : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowAssignModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Assign Role"
                        >
                          <UserPlus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            // In real app, would open edit modal
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {user.status === 'Active' && (
                          <button
                            onClick={() => handleSuspendUser(user.user_id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Suspend User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Create User</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                <select
                  value={formData.institution_id}
                  onChange={(e) => setFormData({ ...formData, institution_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                >
                  <option value="">Select institution...</option>
                  {mockInstitutions.filter(i => i.status === 'Active').map(inst => (
                    <option key={inst.institution_id} value={inst.institution_id}>
                      {inst.institution_name_en}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input
                  type="text"
                  value={formData.job_title}
                  onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                >
                  {USER_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                className="px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Role Modal */}
      {showAssignModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Assign Role & Scope</h2>
              <p className="text-sm text-gray-600 mt-1">User: {selectedUser.full_name}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={assignmentData.role_id}
                  onChange={(e) => {
                    const role = mockRoles.find(r => r.role_id === e.target.value);
                    setAssignmentData({
                      ...assignmentData,
                      role_id: e.target.value,
                      scope_type: role ? role.default_scope_type : assignmentData.scope_type,
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                >
                  <option value="">Select role...</option>
                  {mockRoles.filter(r => r.enabled).map(role => (
                    <option key={role.role_id} value={role.role_id}>
                      {role.role_name_en} {role.is_sensitive_role && '(Sensitive)'}
                    </option>
                  ))}
                </select>
                {assignmentData.role_id && mockRoles.find(r => r.role_id === assignmentData.role_id)?.is_sensitive_role && (
                  <p className="text-xs text-yellow-600 mt-1">
                    ⚠️ This role requires two-person approval
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scope Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={assignmentData.scope_type}
                  onChange={(e) => {
                    setAssignmentData({
                      ...assignmentData,
                      scope_type: e.target.value,
                      scope_ids: [],
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                >
                  {SCOPE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {assignmentData.scope_type !== 'National' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scope IDs <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-2">
                    {availableScopes.map(scope => (
                      <label key={scope.admin_unit_id || scope.center_id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={assignmentData.scope_ids.includes(scope.admin_unit_id || scope.center_id)}
                          onChange={(e) => {
                            const id = scope.admin_unit_id || scope.center_id;
                            if (e.target.checked) {
                              setAssignmentData({
                                ...assignmentData,
                                scope_ids: [...assignmentData.scope_ids, id],
                              });
                            } else {
                              setAssignmentData({
                                ...assignmentData,
                                scope_ids: assignmentData.scope_ids.filter(sid => sid !== id),
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-[#009639] focus:ring-[#009639]"
                        />
                        <span className="text-sm text-gray-700">
                          {scope.admin_unit_name_en || scope.center_name}
                        </span>
                      </label>
                    ))}
                  </div>
                  {availableScopes.length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">No scopes available for this type</p>
                  )}
                </div>
              )}

              {/* Validation Preview */}
              {assignmentData.role_id && assignmentData.scope_type && (
                <div className="bg-gray-50 rounded-lg p-3">
                  {(() => {
                    const validation = canAssignRole(currentUser, assignmentData.role_id, {
                      type: assignmentData.scope_type,
                      ids: assignmentData.scope_ids,
                    });
                    if (!validation.allowed) {
                      return (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">{validation.reason}</span>
                        </div>
                      );
                    }
                    const needsApproval = requiresApproval(assignmentData.role_id, assignmentData.scope_type);
                    if (needsApproval) {
                      return (
                        <div className="flex items-center gap-2 text-yellow-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">This assignment requires approval</span>
                        </div>
                      );
                    }
                    return (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Assignment allowed</span>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedUser(null);
                  resetAssignmentForm();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignRole}
                disabled={!assignmentData.role_id || (assignmentData.scope_type !== 'National' && assignmentData.scope_ids.length === 0)}
                className="px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagementEnhanced;

