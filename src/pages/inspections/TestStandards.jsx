import { useState } from 'react';
import { Plus, Edit, CheckCircle, AlertCircle, FileCheck } from 'lucide-react';
import { mockTestStandards, mockVehicleClasses } from '../../data/mockInspectionProgram';
import { useAuth } from '../../context/AuthContext';

const TEST_TYPES = ['Brake', 'Suspension', 'Emissions', 'Headlight', 'Horn'];
const PASS_LOGIC_TYPES = ['range', 'greater_than', 'less_than'];
const APPROVAL_STATUSES = ['Draft', 'Approved'];

function TestStandards() {
  const { user } = useAuth();
  const [standards, setStandards] = useState(mockTestStandards);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingStandard, setEditingStandard] = useState(null);
  const [formData, setFormData] = useState({
    vehicle_class_id: '',
    test_type: 'Brake',
    parameter_name: '',
    parameter_name_en: '',
    parameter_name_am: '',
    unit: '%',
    min_value: null,
    max_value: null,
    pass_logic: 'range',
    tolerance: 0,
    approval_status: 'Draft',
    effective_from: new Date().toISOString().split('T')[0],
    effective_to: null,
  });

  const handleCreate = () => {
    const newStandard = {
      standard_id: `STD-${Date.now()}`,
      ...formData,
      version: '1.0',
      created_by: user?.id || 'admin-001',
      approved_by: formData.approval_status === 'Approved' ? user?.id : null,
      created_at: new Date().toISOString(),
      approved_at: formData.approval_status === 'Approved' ? new Date().toISOString() : null,
    };
    setStandards([...standards, newStandard]);
    setShowCreateModal(false);
    resetForm();
    console.log('Test standard created (versioned and audit logged)', newStandard);
  };

  const handleUpdate = () => {
    const updated = standards.map(s =>
      s.standard_id === editingStandard.standard_id
        ? {
            ...s,
            ...formData,
            version: (parseFloat(s.version) + 0.1).toFixed(1),
            approved_by: formData.approval_status === 'Approved' ? user?.id : s.approved_by,
            approved_at: formData.approval_status === 'Approved' && s.approval_status !== 'Approved' 
              ? new Date().toISOString() 
              : s.approved_at,
          }
        : s
    );
    setStandards(updated);
    setEditingStandard(null);
    resetForm();
    console.log('Test standard updated (versioned and audit logged)');
  };

  const resetForm = () => {
    setFormData({
      vehicle_class_id: '',
      test_type: 'Brake',
      parameter_name: '',
      parameter_name_en: '',
      parameter_name_am: '',
      unit: '%',
      min_value: null,
      max_value: null,
      pass_logic: 'range',
      tolerance: 0,
      approval_status: 'Draft',
      effective_from: new Date().toISOString().split('T')[0],
      effective_to: null,
    });
  };

  const getVehicleClassName = (classId) => {
    const vc = mockVehicleClasses.find(c => c.vehicle_class_id === classId);
    return vc ? vc.name_en : classId;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Standards & Thresholds</h1>
          <p className="text-gray-600">
            Define machine test thresholds for each vehicle class
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create Standard
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
          <li>• Threshold changes require two-person approval (if enabled)</li>
          <li>• The system records which standard version was used per inspection (immutable reference)</li>
          <li>• Inspectors cannot override machine-generated values; only re-run tests per workflow</li>
        </ul>
      </div>

      {/* Standards Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Test Standards</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Vehicle Class</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Test Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Parameter</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Threshold</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Version</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {standards.map(standard => (
                <tr key={standard.standard_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getVehicleClassName(standard.vehicle_class_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {standard.test_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{standard.parameter_name_en}</div>
                    {standard.parameter_name_am && (
                      <div className="text-xs text-gray-500">{standard.parameter_name_am}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {standard.pass_logic === 'range' 
                        ? `${standard.min_value} - ${standard.max_value} ${standard.unit}`
                        : standard.pass_logic === 'greater_than'
                        ? `> ${standard.min_value} ${standard.unit}`
                        : `< ${standard.max_value} ${standard.unit}`}
                    </div>
                    {standard.tolerance > 0 && (
                      <div className="text-xs text-gray-500">Tolerance: ±{standard.tolerance}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      standard.approval_status === 'Approved' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {standard.approval_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    v{standard.version}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingStandard(standard);
                        setFormData({
                          vehicle_class_id: standard.vehicle_class_id,
                          test_type: standard.test_type,
                          parameter_name: standard.parameter_name,
                          parameter_name_en: standard.parameter_name_en,
                          parameter_name_am: standard.parameter_name_am || '',
                          unit: standard.unit,
                          min_value: standard.min_value,
                          max_value: standard.max_value,
                          pass_logic: standard.pass_logic,
                          tolerance: standard.tolerance,
                          approval_status: standard.approval_status,
                          effective_from: standard.effective_from?.split('T')[0] || '',
                          effective_to: standard.effective_to?.split('T')[0] || '',
                        });
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingStandard) && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingStandard ? 'Edit Test Standard' : 'Create Test Standard'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Class <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.vehicle_class_id}
                  onChange={(e) => setFormData({ ...formData, vehicle_class_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                >
                  <option value="">Select vehicle class...</option>
                  {mockVehicleClasses.map(vc => (
                    <option key={vc.vehicle_class_id} value={vc.vehicle_class_id}>
                      {vc.name_en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.test_type}
                  onChange={(e) => setFormData({ ...formData, test_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                >
                  {TEST_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parameter Name (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.parameter_name_en}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      parameter_name_en: e.target.value,
                      parameter_name: e.target.value.toLowerCase().replace(/\s+/g, '_'),
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parameter Name (Amharic)
                  </label>
                  <input
                    type="text"
                    value={formData.parameter_name_am}
                    onChange={(e) => setFormData({ ...formData, parameter_name_am: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                    placeholder="%, ppm, N, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pass Logic <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.pass_logic}
                    onChange={(e) => setFormData({ ...formData, pass_logic: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  >
                    {PASS_LOGIC_TYPES.map(logic => (
                      <option key={logic} value={logic}>{logic.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.pass_logic === 'range' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Value
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.min_value || ''}
                      onChange={(e) => setFormData({ ...formData, min_value: parseFloat(e.target.value) || null })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Value
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.max_value || ''}
                      onChange={(e) => setFormData({ ...formData, max_value: parseFloat(e.target.value) || null })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                    />
                  </div>
                </div>
              )}

              {(formData.pass_logic === 'greater_than' || formData.pass_logic === 'less_than') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.pass_logic === 'greater_than' ? 'Min Value' : 'Max Value'}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.pass_logic === 'greater_than' ? (formData.min_value || '') : (formData.max_value || '')}
                    onChange={(e) => {
                      if (formData.pass_logic === 'greater_than') {
                        setFormData({ ...formData, min_value: parseFloat(e.target.value) || null });
                      } else {
                        setFormData({ ...formData, max_value: parseFloat(e.target.value) || null });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tolerance (optional)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.tolerance}
                  onChange={(e) => setFormData({ ...formData, tolerance: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approval Status
                </label>
                <select
                  value={formData.approval_status}
                  onChange={(e) => setFormData({ ...formData, approval_status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                >
                  {APPROVAL_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingStandard(null);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={editingStandard ? handleUpdate : handleCreate}
                className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition"
              >
                {editingStandard ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestStandards;












