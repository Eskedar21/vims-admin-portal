import { useState } from 'react';
import { Plus, Edit, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { mockRelationships, mockInstitutions, mockAdminUnits } from '../../data/mockGovernance';
import { useAuth } from '../../context/AuthContext';

const RELATIONSHIP_TYPES = [
  'Oversight',
  'Enforcement Partner',
  'Payment Partner',
  'Hosting Provider',
  'Connectivity Provider',
];

const SCOPE_LEVELS = ['National', 'Region', 'Zone', 'Sub-city', 'Woreda'];

function Relationships() {
  const { user } = useAuth();
  const [relationships, setRelationships] = useState(mockRelationships);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState(null);
  const [formData, setFormData] = useState({
    institution_id: '',
    admin_unit_id: '',
    relationship_type: 'Payment Partner',
    scope_level: 'Region',
    permissions_profile_id: '',
    effective_from: new Date().toISOString().split('T')[0],
    effective_to: null,
    status: 'Active',
  });

  const activeInstitutions = mockInstitutions.filter(i => i.status === 'Active');
  const activeAdminUnits = mockAdminUnits.filter(u => u.status === 'Active');

  const handleCreate = () => {
    const newRelationship = {
      relationship_id: `REL-${Date.now()}`,
      ...formData,
      created_by: user?.id || 'admin-001',
      created_at: new Date().toISOString(),
    };
    setRelationships([...relationships, newRelationship]);
    setShowCreateModal(false);
    resetForm();
    console.log('Relationship created (would trigger change request)', newRelationship);
  };

  const handleUpdate = () => {
    const updated = relationships.map(r =>
      r.relationship_id === editingRelationship.relationship_id
        ? { ...r, ...formData }
        : r
    );
    setRelationships(updated);
    setEditingRelationship(null);
    resetForm();
    console.log('Relationship updated (would trigger change request)');
  };

  const handleDeactivate = (relationship) => {
    if (window.confirm('Deactivate this relationship?')) {
      const updated = relationships.map(r =>
        r.relationship_id === relationship.relationship_id
          ? { ...r, status: 'Inactive' }
          : r
      );
      setRelationships(updated);
      console.log('Relationship deactivated (would trigger change request)');
    }
  };

  const resetForm = () => {
    setFormData({
      institution_id: '',
      admin_unit_id: '',
      relationship_type: 'Payment Partner',
      scope_level: 'Region',
      permissions_profile_id: '',
      effective_from: new Date().toISOString().split('T')[0],
      effective_to: null,
      status: 'Active',
    });
  };

  const getInstitutionName = (instId) => {
    const inst = mockInstitutions.find(i => i.institution_id === instId);
    return inst ? inst.institution_name_en : instId;
  };

  const getAdminUnitName = (unitId) => {
    const unit = mockAdminUnits.find(u => u.admin_unit_id === unitId);
    return unit ? unit.jurisdiction_path : unitId;
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Institutional Relationships
          </h1>
          <p className="text-gray-600">
            Define relationships between institutions and administration units for operational workflows
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create Relationship
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-semibold text-blue-800">
            Relationship Impact
          </span>
        </div>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Payment Partners enable merchant setup flows for centers in their scope</li>
          <li>• Enforcement Partners grant access to case bundles according to policy</li>
          <li>• Relationship changes require audit logging and approval workflow</li>
        </ul>
      </div>

      {/* Relationships Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Relationships</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Institution</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Admin Unit</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Scope Level</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Permissions Profile</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {relationships.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No relationships found
                  </td>
                </tr>
              ) : (
                relationships.map(relationship => (
                  <tr key={relationship.relationship_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getInstitutionName(relationship.institution_id)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {getAdminUnitName(relationship.admin_unit_id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {relationship.relationship_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {relationship.scope_level}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {relationship.permissions_profile_id || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {relationship.status === 'Active' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingRelationship(relationship);
                            setFormData({
                              institution_id: relationship.institution_id,
                              admin_unit_id: relationship.admin_unit_id,
                              relationship_type: relationship.relationship_type,
                              scope_level: relationship.scope_level,
                              permissions_profile_id: relationship.permissions_profile_id || '',
                              effective_from: relationship.effective_from?.split('T')[0] || '',
                              effective_to: relationship.effective_to?.split('T')[0] || '',
                              status: relationship.status,
                            });
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {relationship.status === 'Active' && (
                          <button
                            onClick={() => handleDeactivate(relationship)}
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
      {(showCreateModal || editingRelationship) && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingRelationship ? 'Edit Relationship' : 'Create Relationship'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.institution_id}
                  onChange={(e) => setFormData({ ...formData, institution_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                >
                  <option value="">Select institution...</option>
                  {activeInstitutions.map(inst => (
                    <option key={inst.institution_id} value={inst.institution_id}>
                      {inst.institution_name_en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Administration Unit <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.admin_unit_id}
                  onChange={(e) => setFormData({ ...formData, admin_unit_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
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
                  Relationship Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.relationship_type}
                  onChange={(e) => setFormData({ ...formData, relationship_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                >
                  {RELATIONSHIP_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scope Level <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.scope_level}
                  onChange={(e) => setFormData({ ...formData, scope_level: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                >
                  {SCOPE_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions Profile ID (optional)
                </label>
                <input
                  type="text"
                  value={formData.permissions_profile_id}
                  onChange={(e) => setFormData({ ...formData, permissions_profile_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  placeholder="e.g., PAYMENT-PROFILE-001"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Defines what this institution can view/do
                </p>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
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
                  setEditingRelationship(null);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={editingRelationship ? handleUpdate : handleCreate}
                className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition"
              >
                {editingRelationship ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Relationships;

