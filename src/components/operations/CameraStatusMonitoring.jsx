import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Camera, AlertCircle, HardDrive } from 'lucide-react';
import { mockCameras } from '../../data/mockOperations';

const STALE_THRESHOLD = 120; // seconds

function CameraStatusMonitoring({ centerId, filters }) {
  // Get cameras for this center (or all if centerId not specified)
  const cameras = useMemo(() => {
    const allCameras = centerId 
      ? mockCameras.filter(c => c.center_id === centerId)
      : mockCameras;
    
    return allCameras.map(cam => ({
      ...cam,
      needsAttention: cam.frame_staleness_seconds > STALE_THRESHOLD || cam.stream_health === 'Down',
      storagePercent: (cam.storage_used_gb / cam.storage_total_gb) * 100,
    }));
  }, [centerId]);

  // Generate uptime trend data (mock - in real app would come from API)
  const uptimeTrend24h = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date();
      hour.setHours(hour.getHours() - (23 - i));
      return {
        time: hour.getHours() + ':00',
        uptime: 95 + Math.random() * 5, // Mock data
      };
    });
    return hours;
  }, []);

  // Generate staleness trend data
  const stalenessTrend = useMemo(() => {
    return cameras.map(cam => ({
      camera: cam.camera_label,
      staleness: cam.frame_staleness_seconds,
      status: cam.stream_health,
    }));
  }, [cameras]);

  // Generate storage utilization data
  const storageData = useMemo(() => {
    return cameras.map(cam => ({
      camera: cam.camera_label,
      used: cam.storage_used_gb,
      free: cam.storage_free_gb,
      total: cam.storage_total_gb,
      percent: cam.storagePercent,
    }));
  }, [cameras]);

  const camerasOnline = cameras.filter(c => c.stream_health === 'OK').length;
  const camerasDegraded = cameras.filter(c => c.stream_health === 'Degraded').length;
  const camerasDown = cameras.filter(c => c.stream_health === 'Down').length;
  const camerasNeedingAttention = cameras.filter(c => c.needsAttention).length;
  const camerasWithoutGPS = cameras.filter(c => !c.gps_supported).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Camera className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-500">Total Cameras</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{cameras.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-5 w-5 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-500">Online</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{camerasOnline}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-5 w-5 rounded-full bg-yellow-500"></div>
            <span className="text-xs text-gray-500">Degraded</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{camerasDegraded}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-5 w-5 rounded-full bg-red-500"></div>
            <span className="text-xs text-gray-500">Down</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{camerasDown}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <span className="text-xs text-gray-500">Needs Attention</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">{camerasNeedingAttention}</div>
        </div>
      </div>

      {/* GPS Compliance Warning */}
      {camerasWithoutGPS > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-800">
              GPS Compliance Warning
            </span>
          </div>
          <p className="text-sm text-yellow-700">
            {camerasWithoutGPS} camera{camerasWithoutGPS !== 1 ? 's' : ''} lack GPS capability where GPS is mandatory.
            These cameras are listed under "Centers Requiring Attention."
          </p>
        </div>
      )}

      {/* Camera List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Camera Status</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Camera</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Last Frame</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">GPS</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Storage</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cameras.map(camera => (
                <tr key={camera.camera_id} className={camera.needsAttention ? 'bg-red-50' : ''}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{camera.camera_label}</div>
                    <div className="text-xs text-gray-500">{camera.lane_id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      camera.stream_health === 'OK' ? 'bg-green-100 text-green-800' :
                      camera.stream_health === 'Degraded' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {camera.stream_health}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {camera.frame_staleness_seconds < 60
                        ? `${camera.frame_staleness_seconds}s ago`
                        : `${Math.floor(camera.frame_staleness_seconds / 60)}m ago`}
                    </div>
                    {camera.frame_staleness_seconds > STALE_THRESHOLD && (
                      <div className="text-xs text-red-600">Stale</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      camera.gps_supported ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {camera.gps_supported ? 'Supported' : 'Missing'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {camera.storage_used_gb}GB / {camera.storage_total_gb}GB
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className={`h-1.5 rounded-full ${
                          camera.storagePercent > 90 ? 'bg-red-500' :
                          camera.storagePercent > 75 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${camera.storagePercent}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Uptime Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Camera Uptime Trend (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={uptimeTrend24h}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="uptime" stroke="#16A34A" strokeWidth={2} name="Uptime %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Frame Staleness Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Last Frame Staleness</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stalenessTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="camera" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="staleness" fill="#F59E0B" name="Staleness (seconds)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Storage Utilization */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Utilization</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={storageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="camera" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="used" stackId="a" fill="#DC2626" name="Used (GB)" />
              <Bar dataKey="free" stackId="a" fill="#16A34A" name="Free (GB)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default CameraStatusMonitoring;

