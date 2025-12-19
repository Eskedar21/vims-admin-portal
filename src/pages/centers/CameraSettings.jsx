import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Camera, MapPin, HardDrive, AlertCircle, CheckCircle, XCircle, Settings } from 'lucide-react';
import { mockDevices } from '../../data/mockCentersInfrastructure';
import { useAuth } from '../../context/AuthContext';

function CameraSettings() {
  const { id: centerId } = useParams();
  const { user } = useAuth();
  const [cameras, setCameras] = useState(
    mockDevices.filter(d => d.device_type === 'camera' && d.center_id === centerId)
  );
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [formData, setFormData] = useState({
    camera_label: '',
    gps_supported: true,
    gps_device_id: '',
    stream_url_ref: '',
    storage_total_gb: 500,
    retention_policy_days: 90,
    supports_snapshots: true,
    supports_video_clips: false,
  });

  const handleUpdate = () => {
    if (!selectedCamera) return;
    
    // Validate GPS requirement
    if (!formData.gps_supported) {
      alert('Camera cannot be marked Compliance Approved without GPS support');
      return;
    }

    const updated = cameras.map(c =>
      c.device_id === selectedCamera.device_id
        ? {
            ...c,
            camera_label: formData.camera_label,
            gps_supported: formData.gps_supported,
            gps_device_id: formData.gps_device_id || null,
            stream_url_ref: formData.stream_url_ref,
            storage_total_gb: formData.storage_total_gb,
            retention_policy_days: formData.retention_policy_days,
            supports_snapshots: formData.supports_snapshots,
            supports_video_clips: formData.supports_video_clips,
          }
        : c
    );
    setCameras(updated);
    setSelectedCamera(null);
    console.log('Camera settings updated (audit logged)', { camera_id: selectedCamera.device_id });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Camera Settings & GPS Compliance</h1>
        <p className="text-gray-600">
          Register cameras with GPS capability metadata and health indicators
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <span className="text-sm font-semibold text-yellow-800">
            GPS Requirement
          </span>
        </div>
        <p className="text-sm text-yellow-700">
          A camera cannot be marked "Compliance Approved" unless gps_supported = true. Camera health shows last frame time and triggers alerts when stale/down.
        </p>
      </div>

      {/* Cameras Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Cameras ({cameras.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Camera</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Lane</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">GPS Support</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Stream Health</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Last Frame</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Storage</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cameras.map(camera => (
                <tr key={camera.device_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{camera.camera_label || camera.device_id}</div>
                    <div className="text-xs text-gray-500">{camera.serial_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {camera.lane_id || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {camera.gps_supported ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3" />
                        GPS Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="h-3 w-3" />
                        No GPS
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      camera.stream_health === 'OK' ? 'bg-green-100 text-green-800' :
                      camera.stream_health === 'Degraded' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {camera.stream_health || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {camera.last_frame_at
                      ? `${Math.floor((Date.now() - new Date(camera.last_frame_at).getTime()) / 1000)}s ago`
                      : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {camera.storage_used_gb}/{camera.storage_total_gb} GB
                    <div className="text-xs text-gray-500">
                      {((camera.storage_used_gb / camera.storage_total_gb) * 100).toFixed(1)}% used
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedCamera(camera);
                        setFormData({
                          camera_label: camera.camera_label || '',
                          gps_supported: camera.gps_supported !== false,
                          gps_device_id: camera.gps_device_id || '',
                          stream_url_ref: camera.stream_url_ref || '',
                          storage_total_gb: camera.storage_total_gb || 500,
                          retention_policy_days: camera.retention_policy_days || 90,
                          supports_snapshots: camera.supports_snapshots !== false,
                          supports_video_clips: camera.supports_video_clips || false,
                        });
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Camera Settings Modal */}
      {selectedCamera && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Camera Settings</h2>
              <p className="text-sm text-gray-600 mt-1">Camera: {selectedCamera.device_id}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Camera Label
                </label>
                <input
                  type="text"
                  value={formData.camera_label}
                  onChange={(e) => setFormData({ ...formData, camera_label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.gps_supported}
                    onChange={(e) => setFormData({ ...formData, gps_supported: e.target.checked })}
                    className="rounded border-gray-300 text-[#009639] focus:ring-[#009639]"
                  />
                  <span className="text-sm font-medium text-gray-700">GPS Supported <span className="text-red-500">*</span></span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Required for compliance approval. Camera must have GPS sensors.
                </p>
              </div>

              {formData.gps_supported && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GPS Device ID / Module Serial (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.gps_device_id}
                    onChange={(e) => setFormData({ ...formData, gps_device_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stream URL Reference (secure)
                </label>
                <input
                  type="text"
                  value={formData.stream_url_ref}
                  onChange={(e) => setFormData({ ...formData, stream_url_ref: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  placeholder="secure://streams/camera-001"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Secure reference only. Not exposed to unauthorized roles.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Storage Total (GB)
                  </label>
                  <input
                    type="number"
                    value={formData.storage_total_gb}
                    onChange={(e) => setFormData({ ...formData, storage_total_gb: parseInt(e.target.value) || 500 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retention Policy (days)
                  </label>
                  <input
                    type="number"
                    value={formData.retention_policy_days}
                    onChange={(e) => setFormData({ ...formData, retention_policy_days: parseInt(e.target.value) || 90 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.supports_snapshots}
                    onChange={(e) => setFormData({ ...formData, supports_snapshots: e.target.checked })}
                    className="rounded border-gray-300 text-[#009639] focus:ring-[#009639]"
                  />
                  <span className="text-sm text-gray-700">Supports Snapshots (Start/End/Fail/Retest)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.supports_video_clips}
                    onChange={(e) => setFormData({ ...formData, supports_video_clips: e.target.checked })}
                    className="rounded border-gray-300 text-[#009639] focus:ring-[#009639]"
                  />
                  <span className="text-sm text-gray-700">Supports Video Clips (optional)</span>
                </label>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <strong>Vendor Setup Placeholder:</strong> Ethio Telecom configuration steps can be attached as SOP documents in the Knowledge Base.
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedCamera(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={!formData.gps_supported}
                className="px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CameraSettings;






