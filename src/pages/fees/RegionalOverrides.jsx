import { useState } from 'react';
import { Plus, Edit, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { mockRegionalOverrides, mockOverridePolicy, mockFeeSchedules } from '../../data/mockFeesPayments';
import { mockAdminUnits } from '../../data/mockGovernance';
import { useAuth } from '../../context/AuthContext';

function RegionalOverrides() {
  const { user } = useAuth();
  const [overrides, setOverrides] = useState(mockRegionalOverrides);
  const [policy, setPolicy] = useState(mockOverridePolicy);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [formData, setFormData] = useState({
    admin_unit_id: '',
    fee_schedule_id: '',
    override_fee_amount: 0,
    effective_from: new Date().toISOString().split('T')[0],
    effective_to: null,
    approval_status: 'Draft',
  });

  const handleCreateOverride = () => {
    // Check if overrides are allowed
    if (!policy.allowed) {
      alert('Regional overrides are not allowed. Update policy first.');
      return;
    }

    // Check variance
    const baseSchedule = mockFeeSchedules.find(s => s.fee_schedule_id === formData.fee_schedule_id);
    if (baseSchedule && policy.max_variance_percent) {
      const variance = ((formData.override_fee_amount - baseSchedule.base_fee_amount) / baseSchedule.base_fee_amount) * 100;
      if (Math.abs(variance) > policy.max_variance_percent) {
        alert(`Override exceeds maximum variance of ${policy.max_variance_percent}%`);
        return;
      }
    }

    const newOverride = {
      override_id: `OVR-${Date.now()}`,
      ...formData,
      requested_by: user?.id || 'admin-003',
      approved_by: formData.approval_status === 'Approved' ? user?.id : null,
      created_at: new Date().toISOString(),
      approved_at: formData.approval_status === 'Approved' ? new Date().toISOString() : null,
    };
    setOverrides([...overrides, newOverride]);
    setShowCreateModal(false);
    resetForm();
    console.log('Regional override created (audit logged)', newOverride);
  };

  const handleUpdatePolicy = () => {
    setPolicy({ ...policy, ...formData });
    setShowPolicyModal(false);
    console.log('Override policy updated (audit logged)');
  };

  const resetForm = () => {
    setFormData({
      admin_unit_id: '',
      fee_schedule_id: '',
      override_fee_amount: 0,
      effective_from: new Date().toISOString().split('T')[0],
      effective_to: null,
      approval_status: 'Draft',
    });
  };

  const regions = mockAdminUnits.filter(u => u.admin_unit_type === 'Region' && u.status === 'Active');
  const activeFeeSchedules = mockFeeSchedules.filter(s => s.enabled && s.approval_status === 'Approved');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Regional Fee Overrides</h1>
          <p className="text-gray-600">
            Allow or disallow regional fee overrides with policy controls
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPolicyModal(true)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Configure Policy
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={!policy.allowed}
            className="px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create Override
          </button>
        </div>
      </div>

      {/* Policy Status */}
      <div className={`rounded-lg p-4 ${
        policy.allowed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {policy.allowed ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <span className={`text-sm font-semibold ${
                policy.allowed ? 'text-green-800' : 'text-red-800'
              }`}>
                Regional Overrides: {policy.allowed ? 'Allowed' : 'Not Allowed'}
              </span>
            </div>
            {policy.allowed && (
              <div className="text-sm text-green-700 space-y-1">
                <p>• Allowed levels: {policy.allowed_levels.join(', ')}</p>
                {policy.max_variance_percent && (
                  <p>• Max variance: {policy.max_variance_percent}%</p>
                )}
                <p>• Requires federal approval: {policy.requires_federal_approval ? 'Yes' : 'No'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overrides Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Regional Overrides</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Region</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Base Fee Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Override Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Variance</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {overrides.map(override => {
                const baseSchedule = mockFeeSchedules.find(s => s.fee_schedule_id === override.fee_schedule_id);
                const region = mockAdminUnits.find(u => u.admin_unit_id === override.admin_unit_id);
                const variance = baseSchedule 
                  ? ((override.override_fee_amount - baseSchedule.base_fee_amount) / baseSchedule.base_fee_amount * 100).toFixed(1)
                  : 0;
                
                return (
                  <tr key={override.override_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {region ? region.admin_unit_name_en : override.admin_unit_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {baseSchedule ? `${baseSchedule.base_fee_amount} ETB` : override.fee_schedule_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {override.override_fee_amount.toLocaleString()} ETB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        parseFloat(variance) > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {variance > 0 ? '+' : ''}{variance}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        override.approval_status === 'Approved' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {override.approval_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setFormData({
                            admin_unit_id: override.admin_unit_id,
                            fee_schedule_id: override.fee_schedule_id,
                            override_fee_amount: override.override_fee_amount,
                            effective_from: override.effective_from?.split('T')[0] || '',
                            effective_to: override.effective_to?.split('T')[0] || '',
                            approval_status: override.approval_status,
                          });
                          setShowCreateModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Override Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Create Regional Override</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.admin_unit_id}
                  onChange={(e) => setFormData({ ...formData, admin_unit_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                >
                  <option value="">Select region...</option>
                  {regions.map(region => (
                    <option key={region.admin_unit_id} value={region.admin_unit_id}>
                      {region.admin_unit_name_en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Fee Schedule <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.fee_schedule_id}
                  onChange={(e) => {
                    const schedule = activeFeeSchedules.find(s => s.fee_schedule_id === e.target.value);
                    setFormData({ 
                      ...formData, 
                      fee_schedule_id: e.target.value,
                      override_fee_amount: schedule ? schedule.base_fee_amount : 0,
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                >
                  <option value="">Select fee schedule...</option>
                  {activeFeeSchedules.map(schedule => (
                    <option key={schedule.fee_schedule_id} value={schedule.fee_schedule_id}>
                      {schedule.base_fee_amount} ETB - {schedule.inspection_type_id} / {schedule.vehicle_class_id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Override Fee Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.override_fee_amount}
                  onChange={(e) => setFormData({ ...formData, override_fee_amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                />
                {formData.fee_schedule_id && (
                  <p className="text-xs text-gray-500 mt-1">
                    Base: {activeFeeSchedules.find(s => s.fee_schedule_id === formData.fee_schedule_id)?.base_fee_amount || 0} ETB
                    {policy.max_variance_percent && ` | Max variance: ±${policy.max_variance_percent}%`}
                  </p>
                )}
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
                  <option value="Draft">Draft</option>
                  <option value="Approved">Approved</option>
                </select>
                {policy.requires_federal_approval && (
                  <p className="text-xs text-yellow-600 mt-1">
                    ⚠️ Federal approval required
                  </p>
                )}
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
                onClick={handleCreateOverride}
                className="px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition"
              >
                Create Override
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Policy Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Override Policy Configuration</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={policy.allowed}
                    onChange={(e) => setPolicy({ ...policy, allowed: e.target.checked })}
                    className="rounded border-gray-300 text-[#009639] focus:ring-[#009639]"
                  />
                  <span className="text-sm font-medium text-gray-700">Allow Regional Overrides</span>
                </label>
              </div>

              {policy.allowed && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Variance Percent (optional)
                    </label>
                    <input
                      type="number"
                      value={policy.max_variance_percent || ''}
                      onChange={(e) => setPolicy({ ...policy, max_variance_percent: parseFloat(e.target.value) || null })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                      placeholder="e.g., 20"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={policy.requires_federal_approval}
                        onChange={(e) => setPolicy({ ...policy, requires_federal_approval: e.target.checked })}
                        className="rounded border-gray-300 text-[#009639] focus:ring-[#009639]"
                      />
                      <span className="text-sm text-gray-700">Requires Federal Approval</span>
                    </label>
                  </div>
                </>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowPolicyModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePolicy}
                className="px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition"
              >
                Save Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegionalOverrides;

