import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ExternalLink, AlertCircle, CheckCircle, Camera, HardDrive, Activity } from 'lucide-react';
import { mockCameras, mockGeofenceCompliance } from '../../data/mockOperations';

function CenterSummaryDrawer({ center, onClose, onViewDetail, filters }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Get center cameras
  const centerCameras = mockCameras.filter(c => c.center_id === center.center_id);
  const camerasOnline = centerCameras.filter(c => c.stream_health === 'OK').length;
  const camerasOffline = centerCameras.filter(c => c.stream_health === 'Down').length;
  const camerasDegraded = centerCameras.filter(c => c.stream_health === 'Degraded').length;

  // Get geofence compliance for this center
  const centerGeofence = mockGeofenceCompliance.filter(g => g.center_id === center.center_id);
  const geofenceToday = centerGeofence.filter(g => {
    const date = new Date(g.captured_at);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  });
  const geofenceLast7d = centerGeofence.filter(g => {
    const date = new Date(g.captured_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo;
  });

  const greenCount = geofenceLast7d.filter(g => g.band === 'GREEN').length;
  const yellowCount = geofenceLast7d.filter(g => g.band === 'YELLOW').length;
  const redCount = geofenceLast7d.filter(g => g.band === 'RED').length;

  const formatUptime = (percent) => {
    return `${percent.toFixed(1)}%`;
  };

  const formatLastHeartbeat = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return date.toLocaleString('en-ET');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{center.center_name}</h2>
            <p className="text-sm text-gray-500">{center.jurisdiction_path || center.region}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onViewDetail}
              className="px-3 py-1.5 text-sm font-medium text-[#88bf47] hover:bg-green-50 rounded-lg transition"
            >
              <ExternalLink className="h-4 w-4 inline mr-1" />
              View Detail
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-4">
            {['overview', 'cameras', 'geofence'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === tab
                    ? 'border-[#88bf47] text-[#88bf47]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Center Health */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Center Health</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Status</div>
                    <div className="flex items-center gap-2">
                      {center.status === 'Online' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="text-sm font-medium text-gray-900">{center.status}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Last Heartbeat</div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatLastHeartbeat(center.last_heartbeat_at)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Uptime (24h)</div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatUptime(center.uptime_24h_percent || 0)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Active Lanes</div>
                    <div className="text-sm font-medium text-gray-900">
                      {center.active_lanes_count || 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Queue/Throughput Summary */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Queue/Throughput</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Inspections Today</div>
                    <div className="text-lg font-bold text-gray-900">
                      {center.inspections_today || 0}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Avg Cycle Time</div>
                    <div className="text-lg font-bold text-gray-900">
                      {center.avg_cycle_time_today ? `${center.avg_cycle_time_today} min` : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Lanes Active</div>
                    <div className="text-lg font-bold text-gray-900">
                      {center.active_lanes_count || 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Device Health Snapshot */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Device Health</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Kiosks</span>
                    <span className="text-sm font-medium text-gray-900">
                      {centerCameras.length} online / {centerCameras.length} total
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Tablets</span>
                    <span className="text-sm font-medium text-gray-900">
                      {centerCameras.length} online / {centerCameras.length} total
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Machine Gateways</span>
                    <span className="text-sm font-medium text-gray-900">
                      {center.machineStatus?.filter(m => m.status === 'Online').length || 0} online / {center.machineStatus?.length || 0} total
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Cameras</span>
                    <span className="text-sm font-medium text-gray-900">
                      {camerasOnline} online, {camerasDegraded} degraded, {camerasOffline} offline
                    </span>
                  </div>
                </div>
              </div>

              {/* Critical Incidents */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Critical Incidents</h3>
                {center.open_incidents_count?.total > 0 ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="text-sm font-medium text-red-900">
                        {center.open_incidents_count.critical || 0} Critical
                      </div>
                      <div className="text-xs text-red-700 mt-1">
                        {center.open_incidents_count.high || 0} High severity
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        navigate(`/center-management/${center.center_id}?view=incidents`);
                      }}
                      className="w-full text-sm text-[#88bf47] hover:underline"
                    >
                      View all incidents →
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                    No critical incidents
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'cameras' && (
            <div className="space-y-4">
              {centerCameras.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No cameras found</div>
              ) : (
                centerCameras.map(camera => (
                  <div key={camera.camera_id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{camera.camera_label}</h4>
                        <p className="text-xs text-gray-500">{camera.lane_id}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        camera.stream_health === 'OK' ? 'bg-green-100 text-green-800' :
                        camera.stream_health === 'Degraded' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {camera.stream_health}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      <div>
                        <span className="text-gray-500">Last Frame:</span>
                        <span className="ml-2 text-gray-900">
                          {camera.frame_staleness_seconds < 60 
                            ? `${camera.frame_staleness_seconds}s ago`
                            : `${Math.floor(camera.frame_staleness_seconds / 60)}m ago`}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">GPS:</span>
                        <span className={`ml-2 font-medium ${
                          camera.gps_supported ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {camera.gps_supported ? 'Supported' : 'Missing'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Storage:</span>
                        <span className="ml-2 text-gray-900">
                          {camera.storage_used_gb}GB / {camera.storage_total_gb}GB
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Free:</span>
                        <span className={`ml-2 font-medium ${
                          camera.storage_free_gb < 50 ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {camera.storage_free_gb}GB
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'geofence' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Compliance Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-700">{greenCount}</div>
                    <div className="text-xs text-green-600 mt-1">Green (≤50m)</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-700">{yellowCount}</div>
                    <div className="text-xs text-yellow-600 mt-1">Yellow (50-100m)</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-700">{redCount}</div>
                    <div className="text-xs text-red-600 mt-1">Red ({'>'}100m)</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Inspections (Last 7 Days)</h3>
                {geofenceLast7d.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No geofence data</div>
                ) : (
                  <div className="space-y-2">
                    {geofenceLast7d.slice(0, 10).map(geo => (
                      <div key={geo.inspection_id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">
                            {new Date(geo.captured_at).toLocaleString('en-ET')}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            geo.band === 'GREEN' ? 'bg-green-100 text-green-800' :
                            geo.band === 'YELLOW' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {geo.band} ({geo.distance_m}m)
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          Source: {geo.location_source.replace('_', ' ')} • Confidence: {geo.location_confidence}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CenterSummaryDrawer;

