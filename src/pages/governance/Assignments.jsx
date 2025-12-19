import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { mockAssignments, mockAdminUnits, mockInstitutions } from '../../data/mockGovernance';
import { useAuth } from '../../context/AuthContext';

function Assignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState(mockAssignments);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    admin_unit_id: '',
    office_id: '',
    primary_admin_user_id: '',
    secondary_admin_user_ids: [],
    assignment_type: 'Owner',
    responsibilities: [],
    effective_from: new Date().toISOString().split('T')[0],
    effective_to: null,
    status: 'Active',
  });

  const activeAdminUnits = useMemo(() => 
    mockAdminUnits.filter(u => u.status === 'Active'),
    []
  );

  const activeInstitutions = useMemo(() => 
    mockInstitutions.filter(i => i.status === 'Active'),
    []
  );

  const unitsWithoutOwner = useMemo(() => {
    const unitsWithOwner = new Set(
      assignments
        .filter(a => a.assignment_type === 'Owner' && a.status === 'Active')
        .map(a => a.admin_unit_id)
    );
    return activeAdminUnits.filter(u => !unitsWithOwner.has(u.admin_unit_id));
  }, [assignments, activeAdminUnits]);

  const handleCreate = () => {
    const newAssignment = {
      assignment_id: `ASG-${Date.now()}`,
      ...formData,
      created_by: user?.id || 'admin-001',
      created_at: new Date().toISOString(),
    };
    setAssignments([...assignments, newAssignment]);
    setShowCreateModal(false);
    resetForm();
    console.log('Assignment created (would trigger change request)', newAssignment);
  };

  const handleUpdate = () => {
    const updated = assignments.map(a =>
      a.assignment_id === editingAssignment.assignment_id
        ? { ...a, ...formData }
        : a
    );
    setAssignments(updated);
    setEditingAssignment(null);
    resetForm();
    console.log('Assignment updated (would trigger change request)');
  };

  const handleDeactivate = (assignment) => {
    if (window.confirm(`Deactivate assignment for ${assignment.admin_unit_id}?`)) {
      const updated = assignments.map(a =>
        a.assignment_id === assignment.assignment_id
          ? { ...a, status: 'Inactive' }
          : a
      );
      setAssignments(updated);
      console.log('Assignment deactivated (would trigger change request)');
    }
  };

  const resetForm = () => {
    setFormData({
      admin_unit_id: '',
      office_id: '',
      primary_admin_user_id: '',
      secondary_admin_user_ids: [],
      assignment_type: 'Owner',
      responsibilities: [],
      effective_from: new Date().toISOString().split('T')[0],
      effective_to: null,
      status: 'Active',
    });
  };

  const getAdminUnitName = (unitId) => {
    const unit = mockAdminUnits.find(u => u.admin_unit_id === unitId);
    return unit ? unit.admin_unit_name_en : unitId;
  };

  const getInstitutionName = (instId) => {
    const inst = mockInstitutions.find(i => i.institution_id === instId);
    return inst ? inst.institution_name_en : instId;
  };

  const responsibilityOptions = [
    'incident response',
    'center onboarding',
    'approvals',
    'enforcement coordination',
    'audit liaison',
    'reporting',
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Office & Administrator Assignments
          </h1>
          <p className="text-gray-600">
            Assign government offices and administrators to administration units
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create Assignment
        </button>
      </div>

      {/* Warning for Units Without Owner */}
      {unitsWithoutOwner.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-800">
              {unitsWithoutOwner.length} Administration Unit{unitsWithoutOwner.length !== 1 ? 's' : ''} Without Owner
            </span>
          </div>
          <p className="text-sm text-yellow-700">
            These units will show "unassigned" warnings on dashboards. Incident routing will fall back to parent admin unit.
          </p>
          <div className="mt-2 space-y-1">
            {unitsWithoutOwner.slice(0, 5).map(unit => (
              <div key={unit.admin_unit_id} className="text-xs text-yellow-700">
                • {unit.jurisdiction_path}
              </div>
            ))}
            {unitsWithoutOwner.length > 5 && (
              <div className="text-xs text-yellow-600">
                ... and {unitsWithoutOwner.length - 5} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assignments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Assignments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Admin Unit</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Office</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Primary Admin</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Responsibilities</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No assignments found
                  </td>
                </tr>
              ) : (
                assignments.map(assignment => (
                  <tr key={assignment.assignment_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getAdminUnitName(assignment.admin_unit_id)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {assignment.admin_unit_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getInstitutionName(assignment.office_id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {assignment.assignment_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {assignment.primary_admin_user_id || (
                          <span className="text-gray-400 italic">Unassigned</span>
                        )}
                      </div>
                      {assignment.secondary_admin_user_ids.length > 0 && (
                        <div className="text-xs text-gray-500">
                          +{assignment.secondary_admin_user_ids.length} secondary
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {assignment.responsibilities.map((resp, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                          >
                            {resp}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {assignment.status === 'Active' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingAssignment(assignment);
                            setFormData({
                              admin_unit_id: assignment.admin_unit_id,
                              office_id: assignment.office_id,
                              primary_admin_user_id: assignment.primary_admin_user_id || '',
                              secondary_admin_user_ids: assignment.secondary_admin_user_ids || [],
                              assignment_type: assignment.assignment_type,
                              responsibilities: assignment.responsibilities || [],
                              effective_from: assignment.effective_from?.split('T')[0] || '',
                              effective_to: assignment.effective_to?.split('T')[0] || '',
                              status: assignment.status,
                            });
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {assignment.status === 'Active' && (
                          <button
                            onClick={() => handleDeactivate(assignment)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingAssignment) && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingAssignment ? 'Edit Assignment' : 'Create Assignment'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Administration Unit <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.admin_unit_id}
                  onChange={(e) => setFormData({ ...formData, admin_unit_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                >
                  <option value="">Select admin unit...</option>
                  {activeAdminUnits.map(unit => (
                    <option key={unit.admin_unit_id} value={unit.admin_unit_id}>
                      {unit.jurisdiction_path}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Office <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.office_id}
                  onChange={(e) => setFormData({ ...formData, office_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                >
                  <option value="">Select office...</option>
                  {activeInstitutions.map(inst => (
                    <option key={inst.institution_id} value={inst.institution_id}>
                      {inst.institution_name_en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.assignment_type}
                  onChange={(e) => setFormData({ ...formData, assignment_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                >
                  <option value="Owner">Owner</option>
                  <option value="Oversight">Oversight</option>
                  <option value="Enforcement Liaison">Enforcement Liaison</option>
                  <option value="Audit Liaison">Audit Liaison</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Administrator (User ID)
                </label>
                <input
                  type="text"
                  value={formData.primary_admin_user_id}
                  onChange={(e) => setFormData({ ...formData, primary_admin_user_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  placeholder="Enter user ID"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Changing primary administrator requires audit logging and approval
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsibilities
                </label>
                <div className="space-y-2">
                  {responsibilityOptions.map(resp => (
                    <label key={resp} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.responsibilities.includes(resp)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              responsibilities: [...formData.responsibilities, resp],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              responsibilities: formData.responsibilities.filter(r => r !== resp),
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-[#009639] focus:ring-[#009639]"
                      />
                      <span className="text-sm text-gray-700">{resp}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Effective From
                  </label>
                  <input
                    type="date"
                    value={formData.effective_from}
                    onChange={(e) => setFormData({ ...formData, effective_from: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingAssignment(null);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={editingAssignment ? handleUpdate : handleCreate}
                className="px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition"
              >
                {editingAssignment ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Assignments;

