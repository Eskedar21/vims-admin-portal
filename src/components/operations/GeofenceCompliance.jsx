import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, MapPin } from 'lucide-react';
import { mockGeofenceCompliance, getGeofenceBand } from '../../data/mockOperations';

const COLORS = {
  GREEN: '#16A34A',
  YELLOW: '#F59E0B',
  RED: '#DC2626',
};

function GeofenceCompliance({ centerId, filters }) {
  const [dateRange, setDateRange] = useState('7d');

  // Filter geofence data
  const filteredData = useMemo(() => {
    let data = centerId
      ? mockGeofenceCompliance.filter(g => g.center_id === centerId)
      : mockGeofenceCompliance;

    const now = new Date();
    const cutoffDate = new Date();
    
    if (dateRange === 'today') {
      cutoffDate.setHours(0, 0, 0, 0);
    } else if (dateRange === '7d') {
      cutoffDate.setDate(cutoffDate.getDate() - 7);
    } else if (dateRange === '30d') {
      cutoffDate.setDate(cutoffDate.getDate() - 30);
    }

    return data.filter(g => new Date(g.captured_at) >= cutoffDate);
  }, [centerId, dateRange]);

  // Calculate band counts
  const bandCounts = useMemo(() => {
    const counts = { GREEN: 0, YELLOW: 0, RED: 0 };
    filteredData.forEach(g => {
      counts[g.band] = (counts[g.band] || 0) + 1;
    });
    return counts;
  }, [filteredData]);

  // Trend data (grouped by day)
  const trendData = useMemo(() => {
    const grouped = {};
    filteredData.forEach(g => {
      const date = new Date(g.captured_at).toLocaleDateString('en-ET');
      if (!grouped[date]) {
        grouped[date] = { date, GREEN: 0, YELLOW: 0, RED: 0 };
      }
      grouped[date][g.band] = (grouped[date][g.band] || 0) + 1;
    });
    return Object.values(grouped).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
  }, [filteredData]);

  // Red/Yellow inspections for drill-down
  const redYellowInspections = useMemo(() => {
    return filteredData
      .filter(g => g.band === 'RED' || g.band === 'YELLOW')
      .sort((a, b) => new Date(b.captured_at) - new Date(a.captured_at));
  }, [filteredData]);

  const pieData = [
    { name: 'Green (≤50m)', value: bandCounts.GREEN, color: COLORS.GREEN },
    { name: 'Yellow (50-100m)', value: bandCounts.YELLOW, color: COLORS.YELLOW },
    { name: 'Red (>100m)', value: bandCounts.RED, color: COLORS.RED },
  ];

  const total = filteredData.length;
  const redPercent = total > 0 ? ((bandCounts.RED / total) * 100).toFixed(1) : 0;
  const yellowPercent = total > 0 ? ((bandCounts.YELLOW / total) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-xs text-gray-500 mb-1">Total Inspections</div>
          <div className="text-2xl font-bold text-gray-900">{total}</div>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
          <div className="text-xs text-green-600 mb-1">Green (≤50m)</div>
          <div className="text-2xl font-bold text-green-700">{bandCounts.GREEN}</div>
          <div className="text-xs text-green-600 mt-1">
            {total > 0 ? ((bandCounts.GREEN / total) * 100).toFixed(1) : 0}%
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
          <div className="text-xs text-yellow-600 mb-1">Yellow (50-100m)</div>
          <div className="text-2xl font-bold text-yellow-700">{bandCounts.YELLOW}</div>
          <div className="text-xs text-yellow-600 mt-1">{yellowPercent}%</div>
        </div>
        <div className="bg-red-50 rounded-lg border border-red-200 p-4">
          <div className="text-xs text-red-600 mb-1">Red (>100m)</div>
          <div className="text-2xl font-bold text-red-700">{bandCounts.RED}</div>
          <div className="text-xs text-red-600 mt-1">{redPercent}%</div>
        </div>
      </div>

      {/* Warning for Red Inspections */}
      {bandCounts.RED > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-sm font-semibold text-red-800">
              {bandCounts.RED} Red Zone Breach{bandCounts.RED !== 1 ? 'es' : ''} Detected
            </span>
          </div>
          <p className="text-sm text-red-700">
            Red inspections automatically generate incidents of type "geofence_breach" unless explicitly whitelisted by policy.
          </p>
        </div>
      )}

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Date Range:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distance Band Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Red/Yellow Counts Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="RED" stackId="a" fill={COLORS.RED} name="Red (>100m)" />
              <Bar dataKey="YELLOW" stackId="a" fill={COLORS.YELLOW} name="Yellow (50-100m)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Drill-down List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Red & Yellow Inspections ({redYellowInspections.length})
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Inspections performed outside authorized boundaries
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Center</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Distance</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Band</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Location Source</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Confidence</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {redYellowInspections.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No red or yellow inspections found
                  </td>
                </tr>
              ) : (
                redYellowInspections.map((geo) => (
                  <tr key={geo.inspection_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(geo.captured_at).toLocaleString('en-ET')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {geo.center_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {geo.distance_m}m
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        geo.band === 'GREEN' ? 'bg-green-100 text-green-800' :
                        geo.band === 'YELLOW' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {geo.band}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {geo.location_source.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        geo.location_confidence === 'High' ? 'bg-green-100 text-green-800' :
                        geo.location_confidence === 'Med' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {geo.location_confidence}
                      </span>
                      {geo.reason_low_confidence && (
                        <div className="text-xs text-gray-500 mt-1">
                          {geo.reason_low_confidence}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GeofenceCompliance;

