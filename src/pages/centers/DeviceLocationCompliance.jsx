import { useState, useMemo } from 'react';
import { MapPin, AlertCircle, CheckCircle, XCircle, Filter } from 'lucide-react';
import { mockDevices, mockCentersFull } from '../../data/mockCentersInfrastructure';
import { useAuth } from '../../context/AuthContext';
import { getUserScope } from '../../utils/scopeFilter';

// Mock device location data
const mockDeviceLocations = [
  {
    device_id: 'CAM-001',
    device_type: 'camera',
    center_id: 'CTR-001',
    last_seen_at: new Date(Date.now() - 30000).toISOString(),
    last_location_lat: 8.9806,
    last_location_lon: 38.7578,
    distance_m: 25,
    band: 'GREEN',
    location_source: 'camera_gps',
    confidence: 'High',
    flags: [],
  },
  {
    device_id: 'TAB-001',
    device_type: 'tablet',
    center_id: 'CTR-001',
    last_seen_at: new Date(Date.now() - 60000).toISOString(),
    last_location_lat: 8.9810,
    last_location_lon: 38.7580,
    distance_m: 45,
    band: 'GREEN',
    location_source: 'tablet_gps',
    confidence: 'High',
    flags: [],
  },
  {
    device_id: 'MACH-001',
    device_type: 'machine',
    center_id: 'CTR-002',
    last_seen_at: new Date(Date.now() - 120000).toISOString(),
    last_location_lat: 8.5405,
    last_location_lon: 39.2705,
    distance_m: 120,
    band: 'RED',
    location_source: 'machine_gateway_gps',
    confidence: 'Low',
    flags: ['gps_missing', 'stale_location'],
  },
];

function DeviceLocationCompliance() {
  const { user } = useAuth();
  const userScope = getUserScope(user);
  const [deviceLocations] = useState(mockDeviceLocations);
  const [centerFilter, setCenterFilter] = useState('all');
  const [deviceTypeFilter, setDeviceTypeFilter] = useState('all');
  const [bandFilter, setBandFilter] = useState('all');

  const filteredDevices = useMemo(() => {
    let filtered = [...deviceLocations];
    
    if (centerFilter !== 'all') {
      filtered = filtered.filter(d => d.center_id === centerFilter);
    }
    
    if (deviceTypeFilter !== 'all') {
      filtered = filtered.filter(d => d.device_type === deviceTypeFilter);
    }
    
    if (bandFilter !== 'all') {
      filtered = filtered.filter(d => d.band === bandFilter);
    }
    
    return filtered;
  }, [deviceLocations, centerFilter, deviceTypeFilter, bandFilter]);

  const centerStats = useMemo(() => {
    const stats = {};
    filteredDevices.forEach(device => {
      if (!stats[device.center_id]) {
        stats[device.center_id] = {
          total: 0,
          reporting_location: 0,
          within_green: 0,
          within_yellow: 0,
          within_red: 0,
          gps_missing: 0,
          spoof_suspected: 0,
          stale_location: 0,
        };
      }
      stats[device.center_id].total++;
      if (device.last_location_lat && device.last_location_lon) {
        stats[device.center_id].reporting_location++;
      }
      if (device.band === 'GREEN') stats[device.center_id].within_green++;
      if (device.band === 'YELLOW') stats[device.center_id].within_yellow++;
      if (device.band === 'RED') stats[device.center_id].within_red++;
      if (device.flags.includes('gps_missing')) stats[device.center_id].gps_missing++;
      if (device.flags.includes('spoof_suspected')) stats[device.center_id].spoof_suspected++;
      if (device.flags.includes('stale_location')) stats[device.center_id].stale_location++;
    });
    return stats;
  }, [filteredDevices]);

  const getBandBadge = (band) => {
    const config = {
      GREEN: { bg: 'bg-green-100', text: 'text-green-800' },
      YELLOW: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      RED: { bg: 'bg-red-100', text: 'text-red-800' },
    };
    const c = config[band] || config.GREEN;
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.bg} ${c.text}`}>{band}</span>;
  };

  const getCenterName = (centerId) => {
    const center = mockCentersFull.find(c => c.center_id === centerId);
    return center ? center.center_name_en : centerId;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Device Location Compliance Dashboard</h1>
        <p className="text-gray-600">
          Monitor whether devices are within geofence and reporting valid GPS
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-3 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Device Type</label>
            <select
              value={deviceTypeFilter}
              onChange={(e) => setDeviceTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
            >
              <option value="all">All Types</option>
              <option value="camera">Camera</option>
              <option value="tablet">Tablet</option>
              <option value="kiosk">Kiosk</option>
              <option value="machine">Machine</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Distance Band</label>
            <select
              value={bandFilter}
              onChange={(e) => setBandFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
            >
              <option value="all">All Bands</option>
              <option value="GREEN">Green (≤50m)</option>
              <option value="YELLOW">Yellow (50-100m)</option>
              <option value="RED">Red ({'>'}100m)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Center Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(centerStats).map(([centerId, stats]) => (
          <div key={centerId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{getCenterName(centerId)}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Devices</span>
                <span className="font-medium text-gray-900">{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reporting Location</span>
                <span className="font-medium text-gray-900">
                  {stats.reporting_location} ({((stats.reporting_location / stats.total) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">Within Green</span>
                <span className="font-medium text-green-700">{stats.within_green}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-600">Within Yellow</span>
                <span className="font-medium text-yellow-700">{stats.within_yellow}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600">Within Red</span>
                <span className="font-medium text-red-700">{stats.within_red}</span>
              </div>
              {stats.gps_missing > 0 && (
                <div className="flex justify-between">
                  <span className="text-red-600">GPS Missing</span>
                  <span className="font-medium text-red-700">{stats.gps_missing}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Device Details Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Device Location Details ({filteredDevices.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Device</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Center</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Last Seen</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Distance</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Band</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Source</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Confidence</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Flags</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDevices.map(device => (
                <tr key={device.device_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{device.device_id}</div>
                    <div className="text-xs text-gray-500 capitalize">{device.device_type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getCenterName(device.center_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(device.last_seen_at).toLocaleTimeString('en-ET')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {device.last_location_lat && device.last_location_lon ? (
                      <div>
                        {device.last_location_lat.toFixed(4)}, {device.last_location_lon.toFixed(4)}
                      </div>
                    ) : (
                      <span className="text-gray-400">No location</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {device.distance_m !== null ? `${device.distance_m.toFixed(1)}m` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {device.band ? getBandBadge(device.band) : <span className="text-gray-400">N/A</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {device.location_source ? device.location_source.replace(/_/g, ' ') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      device.confidence === 'High' ? 'bg-green-100 text-green-800' :
                      device.confidence === 'Med' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {device.confidence || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {device.flags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {device.flags.map(flag => (
                          <span key={flag} className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            {flag.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DeviceLocationCompliance;


