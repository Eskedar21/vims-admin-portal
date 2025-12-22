import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Edit, Trash2, AlertCircle, CheckCircle, Camera, Tablet, Monitor, Settings } from 'lucide-react';
import { mockDevices } from '../../data/mockCentersInfrastructure';
import { useAuth } from '../../context/AuthContext';

const DEVICE_TYPES = ['kiosk', 'tablet', 'machine', 'machine_gateway', 'camera'];

function DeviceRegistry() {
  const { id: centerId } = useParams();
  const { user } = useAuth();
  const [devices, setDevices] = useState(
    centerId ? mockDevices.filter(d => d.center_id === centerId) : mockDevices
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [formData, setFormData] = useState({
    device_type: 'kiosk',
    manufacturer: '',
    model: '',
    serial_number: '',
    center_id: centerId || '',
    lane_id: '',
    installed_at: new Date().toISOString().split('T')[0],
    status: 'Active',
    firmware_version: '',
    maintenance_due_at: '',
    calibration_due_at: '',
  });

  const handleCreate = () => {
    // Check for duplicate serial number
    const duplicate = devices.find(d => 
      d.serial_number === formData.serial_number && 
      d.device_type === formData.device_type
    );
    if (duplicate) {
      alert('Device with this serial number and type already exists');
      return;
    }

    const newDevice = {
      device_id: `${formData.device_type.toUpperCase()}-${Date.now()}`,
      ...formData,
      connectivity_status: 'Offline',
      last_seen_at: null,
    };
    setDevices([...devices, newDevice]);
    setShowCreateModal(false);
    resetForm();
    console.log('Device created (audit logged)', newDevice);
  };

  const handleRetire = (device) => {
    const reason = window.prompt('Enter reason for retiring this device (required):');
    if (!reason) return;

    const updated = devices.map(d =>
      d.device_id === device.device_id
        ? { ...d, status: 'Retired' }
        : d
    );
    setDevices(updated);
    console.log('Device retired (audit logged)', { device_id: device.device_id, reason });
  };

  const resetForm = () => {
    setFormData({
      device_type: 'kiosk',
      manufacturer: '',
      model: '',
      serial_number: '',
      center_id: centerId || '',
      lane_id: '',
      installed_at: new Date().toISOString().split('T')[0],
      status: 'Active',
      firmware_version: '',
      maintenance_due_at: '',
      calibration_due_at: '',
    });
  };

  const getDeviceIcon = (type) => {
    const icons = {
      kiosk: Monitor,
      tablet: Tablet,
      machine: Settings,
      machine_gateway: Settings,
      camera: Camera,
    };
    return icons[type] || Settings;
  };

  const devicesByType = useMemo(() => {
    const grouped = {};
    devices.forEach(device => {
      if (!grouped[device.device_type]) {
        grouped[device.device_type] = [];
      }
      grouped[device.device_type].push(device);
    });
    return grouped;
  }, [devices]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Device Registry</h1>
          <p className="text-gray-600">
            Register and manage devices assigned to centers and lanes
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Register Device
        </button>
      </div>

      {/* Device Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {DEVICE_TYPES.map(type => {
          const Icon = getDeviceIcon(type);
          const count = devices.filter(d => d.device_type === type).length;
          const active = devices.filter(d => d.device_type === type && d.status === 'Active').length;
          return (
            <div key={type} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-5 w-5 text-gray-400" />
                <span className="text-xs text-gray-500 capitalize">{type.replace('_', ' ')}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-xs text-gray-500 mt-1">{active} active</div>
            </div>
          );
        })}
      </div>

      {/* Devices by Type */}
      {Object.entries(devicesByType).map(([type, typeDevices]) => {
        const Icon = getDeviceIcon(type);
        return (
          <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900 capitalize">
                  {type.replace('_', ' ')} ({typeDevices.length})
                </h2>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Device ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Manufacturer/Model</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Serial Number</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Lane</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Connectivity</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Last Seen</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {typeDevices.map(device => (
                    <tr key={device.device_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {device.device_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{device.manufacturer}</div>
                        <div className="text-xs text-gray-500">{device.model}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {device.serial_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {device.lane_id || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          device.status === 'Active' ? 'bg-green-100 text-green-800' :
                          device.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {device.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {device.connectivity_status === 'Online' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : device.connectivity_status === 'Degraded' ? (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="ml-2 text-xs text-gray-600">{device.connectivity_status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {device.last_seen_at 
                          ? new Date(device.last_seen_at).toLocaleString('en-ET')
                          : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {device.status === 'Active' && (
                          <button
                            onClick={() => handleRetire(device)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* Create Device Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Register Device</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Device Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.device_type}
                  onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                >
                  {DEVICE_TYPES.map(type => (
                    <option key={type} value={type}>{type.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manufacturer <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.serial_number}
                  onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  placeholder="Must be unique per device type"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lane ID (optional)
                </label>
                <input
                  type="text"
                  value={formData.lane_id}
                  onChange={(e) => setFormData({ ...formData, lane_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Installed At
                  </label>
                  <input
                    type="date"
                    value={formData.installed_at}
                    onChange={(e) => setFormData({ ...formData, installed_at: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                </div>
                {formData.device_type === 'machine' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calibration Due
                    </label>
                    <input
                      type="date"
                      value={formData.calibration_due_at}
                      onChange={(e) => setFormData({ ...formData, calibration_due_at: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                    />
                  </div>
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
                onClick={handleCreate}
                className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition"
              >
                Register Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeviceRegistry;

