import { useState, useMemo } from 'react';
import { Camera, AlertCircle, CheckCircle, XCircle, Filter, HardDrive } from 'lucide-react';
import { mockDevices, mockCentersFull } from '../../data/mockCentersInfrastructure';
import { useAuth } from '../../context/AuthContext';
import { getUserScope } from '../../utils/scopeFilter';

function CameraRegistry() {
  const { user } = useAuth();
  const userScope = getUserScope(user);
  const [cameras, setCameras] = useState(
    mockDevices.filter(d => d.device_type === 'camera')
  );
  const [centerFilter, setCenterFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCameras = useMemo(() => {
    let filtered = [...cameras];
    
    if (centerFilter !== 'all') {
      filtered = filtered.filter(c => c.center_id === centerFilter);
    }
    
    if (statusFilter === 'down') {
      filtered = filtered.filter(c => c.stream_health === 'Down' || c.connectivity_status === 'Offline');
    } else if (statusFilter === 'stale') {
      filtered = filtered.filter(c => {
        if (!c.last_frame_at) return true;
        const staleness = (Date.now() - new Date(c.last_frame_at).getTime()) / 1000;
        return staleness > 120; // 2 minutes
      });
    } else if (statusFilter === 'storage_low') {
      filtered = filtered.filter(c => {
        const usage = (c.storage_used_gb / c.storage_total_gb) * 100;
        return usage > 80;
      });
    }
    
    return filtered;
  }, [cameras, centerFilter, statusFilter]);

  const getCenterName = (centerId) => {
    const center = mockCentersFull.find(c => c.center_id === centerId);
    return center ? center.center_name_en : centerId;
  };

  const getStaleness = (lastFrameAt) => {
    if (!lastFrameAt) return { seconds: null, label: 'Never' };
    const seconds = Math.floor((Date.now() - new Date(lastFrameAt).getTime()) / 1000);
    if (seconds < 60) return { seconds, label: `${seconds}s` };
    if (seconds < 3600) return { seconds, label: `${Math.floor(seconds / 60)}m` };
    return { seconds, label: `${Math.floor(seconds / 3600)}h` };
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Camera Registry</h1>
        <p className="text-gray-600">
          Camera placement and operational health per center and lane
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Center</label>
            <select
              value={centerFilter}
              onChange={(e) => setCenterFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
            >
              <option value="all">All Centers</option>
              {mockCentersFull.map(center => (
                <option key={center.center_id} value={center.center_id}>
                  {center.center_name_en}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
            >
              <option value="all">All Cameras</option>
              <option value="down">Down</option>
              <option value="stale">Stale (last frame {'>'} 2min)</option>
              <option value="storage_low">Storage Low (&gt;80%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cameras Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Cameras ({filteredCameras.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Camera</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Center</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Lane</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">GPS Support</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Stream Health</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Last Frame</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Storage</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Retention</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Incidents</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCameras.map(camera => {
                const staleness = getStaleness(camera.last_frame_at);
                const storageUsage = (camera.storage_used_gb / camera.storage_total_gb) * 100;
                
                return (
                  <tr key={camera.device_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{camera.camera_label || camera.device_id}</div>
                      <div className="text-xs text-gray-500">{camera.serial_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getCenterName(camera.center_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {camera.lane_id || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {camera.gps_supported !== false ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3" />
                          GPS
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      {staleness.seconds !== null ? (
                        <div>
                          <div className={`text-sm font-medium ${
                            staleness.seconds > 120 ? 'text-red-600' :
                            staleness.seconds > 60 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {staleness.label} ago
                          </div>
                          {staleness.seconds > 120 && (
                            <div className="text-xs text-red-500">Stale</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">Never</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {camera.storage_used_gb}/{camera.storage_total_gb} GB
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className={`h-1.5 rounded-full ${
                            storageUsage > 80 ? 'bg-red-500' :
                            storageUsage > 60 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(storageUsage, 100)}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {storageUsage.toFixed(1)}% used
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {camera.retention_policy_days || 90} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {camera.open_camera_incidents_count > 0 ? (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          {camera.open_camera_incidents_count}
                        </span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <span className="text-sm font-semibold text-yellow-800">
            Export Restrictions
          </span>
        </div>
        <p className="text-sm text-yellow-700">
          Export of camera registry is restricted and logged. Reason required for export.
        </p>
      </div>
    </div>
  );
}

export default CameraRegistry;


