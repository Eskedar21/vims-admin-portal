import { useState } from 'react';
import { Plus, Edit, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { mockFeeSchedules } from '../../data/mockFeesPayments';
import { mockInspectionTypes, mockVehicleClasses } from '../../data/mockInspectionProgram';
import { useAuth } from '../../context/AuthContext';

const APPROVAL_STATUSES = ['Draft', 'Approved', 'Retired'];

function FeeStructure() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState(mockFeeSchedules);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    inspection_type_id: '',
    vehicle_class_id: '',
    base_fee_amount: 0,
    currency: 'ETB',
    enabled: true,
    effective_from: new Date().toISOString().split('T')[0],
    effective_to: null,
    approval_status: 'Draft',
    notes: '',
  });

  const handleCreate = () => {
    const newSchedule = {
      fee_schedule_id: `FEE-${Date.now()}`,
      ...formData,
      version: '1.0',
      created_by: user?.id || 'admin-001',
      approved_by: formData.approval_status === 'Approved' ? user?.id : null,
      created_at: new Date().toISOString(),
      approved_at: formData.approval_status === 'Approved' ? new Date().toISOString() : null,
    };
    setSchedules([...schedules, newSchedule]);
    setShowCreateModal(false);
    resetForm();
    console.log('Fee schedule created (versioned and audit logged)', newSchedule);
  };

  const handleUpdate = () => {
    const updated = schedules.map(s =>
      s.fee_schedule_id === editingSchedule.fee_schedule_id
        ? {
            ...s,
            ...formData,
            version: (parseFloat(s.version) + 0.1).toFixed(1),
            approved_by: formData.approval_status === 'Approved' && s.approval_status !== 'Approved'
              ? user?.id
              : s.approved_by,
            approved_at: formData.approval_status === 'Approved' && s.approval_status !== 'Approved'
              ? new Date().toISOString()
              : s.approved_at,
          }
        : s
    );
    setSchedules(updated);
    setEditingSchedule(null);
    resetForm();
    console.log('Fee schedule updated (versioned and audit logged)');
  };

  const handleDeactivate = (schedule) => {
    if (window.confirm(`Deactivate fee schedule? Historical inspections retain the applied fee reference.`)) {
      const updated = schedules.map(s =>
        s.fee_schedule_id === schedule.fee_schedule_id
          ? { ...s, enabled: false, approval_status: 'Retired' }
          : s
      );
      setSchedules(updated);
      console.log('Fee schedule deactivated (audit logged)');
    }
  };

  const resetForm = () => {
    setFormData({
      inspection_type_id: '',
      vehicle_class_id: '',
      base_fee_amount: 0,
      currency: 'ETB',
      enabled: true,
      effective_from: new Date().toISOString().split('T')[0],
      effective_to: null,
      approval_status: 'Draft',
      notes: '',
    });
  };

  const getInspectionTypeName = (typeId) => {
    const type = mockInspectionTypes.find(t => t.inspection_type_id === typeId);
    return type ? type.name_en : typeId;
  };

  const getVehicleClassName = (classId) => {
    const vc = mockVehicleClasses.find(c => c.vehicle_class_id === classId);
    return vc ? vc.name_en : classId;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fee Structure</h1>
          <p className="text-gray-600">
            Define base fees for each inspection type and vehicle class
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create Fee Schedule
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
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Fee schedule cannot be activated without approval</li>
          <li>• System uses the schedule effective on the inspection registration date</li>
          <li>• Changing a fee creates a new version; historical inspections retain the applied fee reference</li>
        </ul>
      </div>

      {/* Fee Schedules Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Fee Schedules</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Inspection Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Vehicle Class</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Base Fee</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Currency</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Version</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Effective</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schedules.map(schedule => (
                <tr key={schedule.fee_schedule_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getInspectionTypeName(schedule.inspection_type_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getVehicleClassName(schedule.vehicle_class_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {schedule.base_fee_amount.toLocaleString()} {schedule.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {schedule.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {schedule.enabled ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        schedule.approval_status === 'Approved' ? 'bg-green-100 text-green-800' :
                        schedule.approval_status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {schedule.approval_status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    v{schedule.version}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(schedule.effective_from).toLocaleDateString('en-ET')}
                    {schedule.effective_to && (
                      <div className="text-xs text-gray-500">
                        to {new Date(schedule.effective_to).toLocaleDateString('en-ET')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingSchedule(schedule);
                          setFormData({
                            inspection_type_id: schedule.inspection_type_id,
                            vehicle_class_id: schedule.vehicle_class_id,
                            base_fee_amount: schedule.base_fee_amount,
                            currency: schedule.currency,
                            enabled: schedule.enabled,
                            effective_from: schedule.effective_from?.split('T')[0] || '',
                            effective_to: schedule.effective_to?.split('T')[0] || '',
                            approval_status: schedule.approval_status,
                            notes: schedule.notes || '',
                          });
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {schedule.enabled && (
                        <button
                          onClick={() => handleDeactivate(schedule)}
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
      {(showCreateModal || editingSchedule) && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingSchedule ? 'Edit Fee Schedule' : 'Create Fee Schedule'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Inspection Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.inspection_type_id}
                  onChange={(e) => setFormData({ ...formData, inspection_type_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                >
                  <option value="">Select inspection type...</option>
                  {mockInspectionTypes.filter(t => t.enabled).map(type => (
                    <option key={type.inspection_type_id} value={type.inspection_type_id}>
                      {type.name_en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Class <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.vehicle_class_id}
                  onChange={(e) => setFormData({ ...formData, vehicle_class_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                >
                  <option value="">Select vehicle class...</option>
                  {mockVehicleClasses.map(vc => (
                    <option key={vc.vehicle_class_id} value={vc.vehicle_class_id}>
                      {vc.name_en}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Fee Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.base_fee_amount}
                    onChange={(e) => setFormData({ ...formData, base_fee_amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  >
                    <option value="ETB">ETB</option>
                    <option value="USD">USD</option>
                  </select>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  placeholder="Additional notes about this fee schedule..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingSchedule(null);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={editingSchedule ? handleUpdate : handleCreate}
                className="px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition"
              >
                {editingSchedule ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeeStructure;

