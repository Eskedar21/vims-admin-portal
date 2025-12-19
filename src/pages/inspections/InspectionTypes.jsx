import { useState } from 'react';
import { Plus, Edit, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { mockInspectionTypes } from '../../data/mockInspectionProgram';
import { useAuth } from '../../context/AuthContext';

const INSPECTION_CATEGORIES = ['Initial', 'Retest', 'Specialized'];
const APPROVAL_STATUSES = ['Draft', 'Approved', 'Retired'];
const MACHINE_TESTS = ['brake', 'suspension', 'emissions', 'headlight', 'horn'];

function InspectionTypes() {
  const { user } = useAuth();
  const [types, setTypes] = useState(mockInspectionTypes);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [formData, setFormData] = useState({
    name_en: '',
    name_am: '',
    category: 'Initial',
    requires_payment: true,
    requires_visual_check: true,
    requires_machine_tests: [],
    requires_certificate: true,
    validity_period_days: 365,
    enabled: true,
    effective_from: new Date().toISOString().split('T')[0],
    effective_to: null,
    approval_status: 'Draft',
  });

  const handleCreate = () => {
    const newType = {
      inspection_type_id: `TYPE-${Date.now()}`,
      ...formData,
      version: '1.0',
      created_by: user?.id || 'admin-001',
      created_at: new Date().toISOString(),
    };
    setTypes([...types, newType]);
    setShowCreateModal(false);
    resetForm();
    console.log('Inspection type created (versioned and audit logged)', newType);
  };

  const handleUpdate = () => {
    const updated = types.map(t =>
      t.inspection_type_id === editingType.inspection_type_id
        ? {
            ...t,
            ...formData,
            version: (parseFloat(t.version) + 0.1).toFixed(1),
            updated_at: new Date().toISOString(),
          }
        : t
    );
    setTypes(updated);
    setEditingType(null);
    resetForm();
    console.log('Inspection type updated (versioned and audit logged)');
  };

  const handleDeactivate = (type) => {
    if (window.confirm(`Deactivate ${type.name_en}? This will not break historical records.`)) {
      const updated = types.map(t =>
        t.inspection_type_id === type.inspection_type_id
          ? { ...t, enabled: false, approval_status: 'Retired' }
          : t
      );
      setTypes(updated);
      console.log('Inspection type deactivated (audit logged)');
    }
  };

  const resetForm = () => {
    setFormData({
      name_en: '',
      name_am: '',
      category: 'Initial',
      requires_payment: true,
      requires_visual_check: true,
      requires_machine_tests: [],
      requires_certificate: true,
      validity_period_days: 365,
      enabled: true,
      effective_from: new Date().toISOString().split('T')[0],
      effective_to: null,
      approval_status: 'Draft',
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inspection Types</h1>
          <p className="text-gray-600">
            Define and manage inspection types and their workflows
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create Type
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <span className="text-sm font-semibold text-yellow-800">
            Approval Required
          </span>
        </div>
        <p className="text-sm text-yellow-700">
          New inspection types require approval before becoming active. All changes are versioned and audit-logged.
        </p>
      </div>

      {/* Types Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Inspection Types</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Requirements</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Validity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Version</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {types.map(type => (
                <tr key={type.inspection_type_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{type.name_en}</div>
                    {type.name_am && (
                      <div className="text-xs text-gray-500">{type.name_am}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {type.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-600 space-y-1">
                      {type.requires_payment && <div>• Payment</div>}
                      {type.requires_visual_check && <div>• Visual Check</div>}
                      {type.requires_certificate && <div>• Certificate</div>}
                      <div>• {type.requires_machine_tests.length} Machine Tests</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {type.validity_period_days} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {type.enabled ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        type.approval_status === 'Approved' ? 'bg-green-100 text-green-800' :
                        type.approval_status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {type.approval_status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    v{type.version}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingType(type);
                          setFormData({
                            name_en: type.name_en,
                            name_am: type.name_am || '',
                            category: type.category,
                            requires_payment: type.requires_payment,
                            requires_visual_check: type.requires_visual_check,
                            requires_machine_tests: type.requires_machine_tests || [],
                            requires_certificate: type.requires_certificate,
                            validity_period_days: type.validity_period_days,
                            enabled: type.enabled,
                            effective_from: type.effective_from?.split('T')[0] || '',
                            effective_to: type.effective_to?.split('T')[0] || '',
                            approval_status: type.approval_status,
                          });
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {type.enabled && (
                        <button
                          onClick={() => handleDeactivate(type)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingType) && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingType ? 'Edit Inspection Type' : 'Create Inspection Type'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name (Amharic)
                  </label>
                  <input
                    type="text"
                    value={formData.name_am}
                    onChange={(e) => setFormData({ ...formData, name_am: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                >
                  {INSPECTION_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Machine Tests Required
                </label>
                <div className="space-y-2">
                  {MACHINE_TESTS.map(test => (
                    <label key={test} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.requires_machine_tests.includes(test)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              requires_machine_tests: [...formData.requires_machine_tests, test],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              requires_machine_tests: formData.requires_machine_tests.filter(t => t !== test),
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-[#009639] focus:ring-[#009639]"
                      />
                      <span className="text-sm text-gray-700 capitalize">{test}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Validity Period (days)
                  </label>
                  <input
                    type="number"
                    value={formData.validity_period_days}
                    onChange={(e) => setFormData({ ...formData, validity_period_days: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approval Status
                  </label>
                  <select
                    value={formData.approval_status}
                    onChange={(e) => setFormData({ ...formData, approval_status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  >
                    {APPROVAL_STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.requires_payment}
                    onChange={(e) => setFormData({ ...formData, requires_payment: e.target.checked })}
                    className="rounded border-gray-300 text-[#009639] focus:ring-[#009639]"
                  />
                  <span className="text-sm text-gray-700">Requires Payment</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.requires_visual_check}
                    onChange={(e) => setFormData({ ...formData, requires_visual_check: e.target.checked })}
                    className="rounded border-gray-300 text-[#009639] focus:ring-[#009639]"
                  />
                  <span className="text-sm text-gray-700">Requires Visual Check</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.requires_certificate}
                    onChange={(e) => setFormData({ ...formData, requires_certificate: e.target.checked })}
                    className="rounded border-gray-300 text-[#009639] focus:ring-[#009639]"
                  />
                  <span className="text-sm text-gray-700">Requires Certificate</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                    className="rounded border-gray-300 text-[#009639] focus:ring-[#009639]"
                  />
                  <span className="text-sm text-gray-700">Enabled</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingType(null);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={editingType ? handleUpdate : handleCreate}
                className="px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition"
              >
                {editingType ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InspectionTypes;






