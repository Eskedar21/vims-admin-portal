import { useState } from 'react';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { mockInspectionTypes, mockVehicleClasses } from '../../data/mockInspectionProgram';
import { useAuth } from '../../context/AuthContext';

// Mock mappings
const mockMappings = [
  {
    mapping_id: 'MAP-001',
    inspection_type_id: 'INITIAL',
    vehicle_class_id: 'PRIVATE_CAR',
    enabled: true,
    rules: { weight_range: null, axle_count: null, fuel_type: null },
    effective_from: '2020-01-01T00:00:00Z',
    effective_to: null,
  },
  {
    mapping_id: 'MAP-002',
    inspection_type_id: 'INITIAL',
    vehicle_class_id: 'TRUCK',
    enabled: true,
    rules: { weight_range: '>3500kg', axle_count: '>=2', fuel_type: null },
    effective_from: '2020-01-01T00:00:00Z',
    effective_to: null,
  },
];

function VehicleClassMapping() {
  const { user } = useAuth();
  const [mappings, setMappings] = useState(mockMappings);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    inspection_type_id: '',
    vehicle_class_id: '',
    enabled: true,
    rules: { weight_range: '', axle_count: '', fuel_type: '' },
  });

  const handleCreate = () => {
    if (!formData.inspection_type_id || !formData.vehicle_class_id) {
      alert('Inspection type and vehicle class are required');
      return;
    }

    const newMapping = {
      mapping_id: `MAP-${Date.now()}`,
      ...formData,
      effective_from: new Date().toISOString(),
      effective_to: null,
    };
    setMappings([...mappings, newMapping]);
    setShowCreateModal(false);
    resetForm();
    console.log('Mapping created (audit logged, may require approval)', newMapping);
  };

  const resetForm = () => {
    setFormData({
      inspection_type_id: '',
      vehicle_class_id: '',
      enabled: true,
      rules: { weight_range: '', axle_count: '', fuel_type: '' },
    });
  };

  const getInspectionTypeName = (id) => {
    const type = mockInspectionTypes.find(t => t.inspection_type_id === id);
    return type ? type.name_en : id;
  };

  const getVehicleClassName = (id) => {
    const vc = mockVehicleClasses.find(v => v.vehicle_class_id === id);
    return vc ? vc.name_en : id;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vehicle Class Mapping</h1>
          <p className="text-gray-600">
            Map inspection types to eligible vehicle classes
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create Mapping
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-semibold text-blue-800">
            Business Rule
          </span>
        </div>
        <p className="text-sm text-blue-700">
          Vehicle registration cannot proceed if vehicle class is not eligible for the selected inspection type.
          Mappings are versioned; changes require approval.
        </p>
      </div>

      {/* Mappings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Mappings ({mappings.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Inspection Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Vehicle Class</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Rules</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Effective From</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mappings.map(mapping => (
                <tr key={mapping.mapping_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {getInspectionTypeName(mapping.inspection_type_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getVehicleClassName(mapping.vehicle_class_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {mapping.enabled ? (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Enabled
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        Disabled
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {mapping.rules.weight_range || mapping.rules.axle_count || mapping.rules.fuel_type ? (
                      <div className="text-xs space-y-1">
                        {mapping.rules.weight_range && <div>Weight: {mapping.rules.weight_range}</div>}
                        {mapping.rules.axle_count && <div>Axles: {mapping.rules.axle_count}</div>}
                        {mapping.rules.fuel_type && <div>Fuel: {mapping.rules.fuel_type}</div>}
                      </div>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(mapping.effective_from).toLocaleDateString('en-ET')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Create Vehicle Class Mapping</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Inspection Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.inspection_type_id}
                  onChange={(e) => setFormData({ ...formData, inspection_type_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                >
                  <option value="">Select inspection type...</option>
                  {mockInspectionTypes.map(type => (
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

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Optional Rules</label>
                <input
                  type="text"
                  placeholder="Weight range (e.g., >3500kg)"
                  value={formData.rules.weight_range}
                  onChange={(e) => setFormData({
                    ...formData,
                    rules: { ...formData.rules, weight_range: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                />
                <input
                  type="text"
                  placeholder="Axle count (e.g., >=2)"
                  value={formData.rules.axle_count}
                  onChange={(e) => setFormData({
                    ...formData,
                    rules: { ...formData.rules, axle_count: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                />
                <input
                  type="text"
                  placeholder="Fuel type (e.g., Diesel)"
                  value={formData.rules.fuel_type}
                  onChange={(e) => setFormData({
                    ...formData,
                    rules: { ...formData.rules, fuel_type: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                    className="rounded border-gray-300 text-[#88bf47] focus:ring-[#88bf47]"
                  />
                  <span className="text-sm text-gray-700">Enabled</span>
                </label>
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
                onClick={handleCreate}
                className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition"
              >
                Create Mapping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VehicleClassMapping;












