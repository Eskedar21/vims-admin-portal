import { useState } from 'react';
import { BarChart3, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ExecutiveScorecard from './ExecutiveScorecard';

// Trend Analysis Report
function TrendAnalysis() {
  const [timeRange, setTimeRange] = useState('30D');
  const [metric, setMetric] = useState('inspections');

  const trendData = [
    { date: '2025-01-01', inspections: 1245, passRate: 87.3, revenue: 625000, cycleTime: 12.5 },
    { date: '2025-01-02', inspections: 1180, passRate: 85.2, revenue: 590000, cycleTime: 13.2 },
    { date: '2025-01-03', inspections: 1320, passRate: 88.1, revenue: 660000, cycleTime: 11.8 },
    { date: '2025-01-04', inspections: 1280, passRate: 86.5, revenue: 640000, cycleTime: 12.1 },
    { date: '2025-01-05', inspections: 1400, passRate: 89.2, revenue: 700000, cycleTime: 11.5 },
    { date: '2025-01-06', inspections: 1350, passRate: 88.7, revenue: 675000, cycleTime: 11.9 },
    { date: '2025-01-07', inspections: 1420, passRate: 90.1, revenue: 710000, cycleTime: 11.2 },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trend Analysis</h1>
        <p className="text-gray-600">Time-series trend analysis for seasonal patterns and shifts</p>
      </div>
        <div className="flex gap-3">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
            <option value="7D">Last 7 Days</option>
            <option value="30D">Last 30 Days</option>
            <option value="90D">Last 90 Days</option>
            <option value="1Y">Last Year</option>
          </select>
          <select value={metric} onChange={(e) => setMetric(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
            <option value="inspections">Inspections</option>
            <option value="passRate">Pass Rate</option>
            <option value="revenue">Revenue</option>
            <option value="cycleTime">Cycle Time</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend Chart</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280" 
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString("en-US")}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={metric}
                  stroke="#009639"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name={metric === 'inspections' ? 'Inspections' : metric === 'passRate' ? 'Pass Rate (%)' : metric === 'revenue' ? 'Revenue (ETB)' : 'Cycle Time (min)'}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Trend</p>
              <p className="text-2xl font-bold text-green-600">↑ 5.2%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Peak Day</p>
              <p className="text-lg font-semibold text-gray-900">Jan 7, 2025</p>
              <p className="text-sm text-gray-500">1,420 inspections</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Lowest Day</p>
              <p className="text-lg font-semibold text-gray-900">Jan 2, 2025</p>
              <p className="text-sm text-gray-500">1,180 inspections</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend Data Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Inspections</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Pass Rate</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Revenue (ETB)</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Avg Cycle Time</th>
              </tr>
            </thead>
            <tbody>
              {trendData.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{new Date(row.date).toLocaleDateString()}</td>
                  <td className="text-right py-3 px-4">{row.inspections.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">{row.passRate}%</td>
                  <td className="text-right py-3 px-4">{row.revenue.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">{row.cycleTime} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OperationalReports() {
  const [dateRange, setDateRange] = useState('7D');
  const [centerFilter, setCenterFilter] = useState('all');

  const operationalData = [
    { center: 'Bole Center 01', inspectionsPerHour: 52, inspectionsPerDay: 1250, avgCycleTime: 11.5, lanes: 4, utilization: 92.5 },
    { center: 'Mercato Center 02', inspectionsPerHour: 41, inspectionsPerDay: 980, avgCycleTime: 15.2, lanes: 3, utilization: 78.3 },
    { center: 'Adama Center', inspectionsPerHour: 38, inspectionsPerDay: 910, avgCycleTime: 14.8, lanes: 3, utilization: 75.6 },
    { center: 'Bahir Dar Center', inspectionsPerHour: 35, inspectionsPerDay: 840, avgCycleTime: 16.2, lanes: 2, utilization: 88.2 },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Operational Reports</h1>
        <p className="text-gray-600">Throughput, queue time, and lane utilization metrics</p>
      </div>
        <div className="flex gap-3">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
            <option value="1D">Today</option>
            <option value="7D">Last 7 Days</option>
            <option value="30D">Last 30 Days</option>
          </select>
          <select value={centerFilter} onChange={(e) => setCenterFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
            <option value="all">All Centers</option>
            {operationalData.map((c, idx) => <option key={idx} value={c.center}>{c.center}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total Inspections</p>
          <p className="text-3xl font-bold text-gray-900">{operationalData.reduce((sum, c) => sum + c.inspectionsPerDay, 0).toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Across all centers</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Avg Inspections/Hour</p>
          <p className="text-3xl font-bold text-gray-900">{Math.round(operationalData.reduce((sum, c) => sum + c.inspectionsPerHour, 0) / operationalData.length)}</p>
          <p className="text-xs text-gray-500 mt-1">System average</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Avg Cycle Time</p>
          <p className="text-3xl font-bold text-gray-900">{Math.round(operationalData.reduce((sum, c) => sum + c.avgCycleTime, 0) / operationalData.length * 10) / 10} min</p>
          <p className="text-xs text-gray-500 mt-1">System average</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Lane Utilization</p>
          <p className="text-3xl font-bold text-gray-900">{Math.round(operationalData.reduce((sum, c) => sum + c.utilization, 0) / operationalData.length * 10) / 10}%</p>
          <p className="text-xs text-gray-500 mt-1">System average</p>
      </div>
    </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Center Throughput Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Center</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Inspections/Day</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Inspections/Hour</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Avg Cycle Time</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Active Lanes</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Utilization</th>
              </tr>
            </thead>
            <tbody>
              {operationalData.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{row.center}</td>
                  <td className="text-right py-3 px-4">{row.inspectionsPerDay.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">{row.inspectionsPerHour}</td>
                  <td className="text-right py-3 px-4">{row.avgCycleTime} min</td>
                  <td className="text-right py-3 px-4">{row.lanes}</td>
                  <td className="text-right py-3 px-4">
                    <span className={`font-semibold ${row.utilization >= 90 ? 'text-green-600' : row.utilization >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {row.utilization}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Throughput Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { date: '2025-01-01', inspections: 1250, cycleTime: 11.5 },
                { date: '2025-01-02', inspections: 1180, cycleTime: 13.2 },
                { date: '2025-01-03', inspections: 1320, cycleTime: 11.8 },
                { date: '2025-01-04', inspections: 1280, cycleTime: 12.1 },
                { date: '2025-01-05', inspections: 1400, cycleTime: 11.5 },
                { date: '2025-01-06', inspections: 1350, cycleTime: 11.9 },
                { date: '2025-01-07', inspections: 1420, cycleTime: 11.2 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
                <Legend />
                <Line type="monotone" dataKey="inspections" stroke="#009639" strokeWidth={2} dot={{ r: 4 }} name="Inspections/Day" />
                <Line type="monotone" dataKey="cycleTime" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Cycle Time (min)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Queue Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Queue Time</span>
              <span className="font-semibold">4.2 min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Max Queue Time</span>
              <span className="font-semibold">18.5 min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Peak Hour</span>
              <span className="font-semibold">10:00 - 11:00 AM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Wait Time</span>
              <span className="font-semibold">3.8 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function EvidenceCompletenessReports() {
  const [dateRange, setDateRange] = useState('7D');

  const evidenceData = [
    { center: 'Bole Center 01', completed: 1250, complete: 1235, gaps: 15, rate: 98.8, missingPhotos: 10, missingVideos: 5, incidents: 3 },
    { center: 'Mercato Center 02', completed: 980, complete: 945, gaps: 35, rate: 96.4, missingPhotos: 25, missingVideos: 10, incidents: 5 },
    { center: 'Adama Center', completed: 910, complete: 895, gaps: 15, rate: 98.4, missingPhotos: 12, missingVideos: 3, incidents: 2 },
    { center: 'Bahir Dar Center', completed: 840, complete: 820, gaps: 20, rate: 97.6, missingPhotos: 15, missingVideos: 5, incidents: 4 },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Evidence Completeness Reports</h1>
        <p className="text-gray-600">Evidence completeness and gap analysis</p>
      </div>
        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
          <option value="1D">Today</option>
          <option value="7D">Last 7 Days</option>
          <option value="30D">Last 30 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total Inspections</p>
          <p className="text-3xl font-bold text-gray-900">{evidenceData.reduce((sum, e) => sum + e.completed, 0).toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Completed inspections</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Evidence Complete</p>
          <p className="text-3xl font-bold text-green-600">{evidenceData.reduce((sum, e) => sum + e.complete, 0).toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">With all evidence</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Evidence Gaps</p>
          <p className="text-3xl font-bold text-red-600">{evidenceData.reduce((sum, e) => sum + e.gaps, 0)}</p>
          <p className="text-xs text-gray-500 mt-1">Missing evidence</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Avg Completeness Rate</p>
          <p className="text-3xl font-bold text-gray-900">
            {Math.round(evidenceData.reduce((sum, e) => sum + e.rate, 0) / evidenceData.length * 10) / 10}%
          </p>
          <p className="text-xs text-gray-500 mt-1">System average</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Center Evidence Completeness</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Center</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Completed</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Complete</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Gaps</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Completeness Rate</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Missing Photos</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Missing Videos</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Incidents</th>
              </tr>
            </thead>
            <tbody>
              {evidenceData.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{row.center}</td>
                  <td className="text-right py-3 px-4">{row.completed.toLocaleString()}</td>
                  <td className="text-right py-3 px-4 text-green-600 font-semibold">{row.complete.toLocaleString()}</td>
                  <td className="text-right py-3 px-4 text-red-600 font-semibold">{row.gaps}</td>
                  <td className="text-right py-3 px-4">
                    <span className={`font-semibold ${row.rate >= 98 ? 'text-green-600' : row.rate >= 95 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {row.rate}%
                    </span>
                  </td>
                  <td className="text-right py-3 px-4">{row.missingPhotos}</td>
                  <td className="text-right py-3 px-4">{row.missingVideos}</td>
                  <td className="text-right py-3 px-4">
                    <span className={`font-semibold ${row.incidents === 0 ? 'text-green-600' : row.incidents <= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {row.incidents}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Evidence Completeness Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[
              { date: '2025-01-01', completeness: 98.8, gaps: 15 },
              { date: '2025-01-02', completeness: 96.4, gaps: 35 },
              { date: '2025-01-03', completeness: 98.4, gaps: 15 },
              { date: '2025-01-04', completeness: 97.6, gaps: 20 },
              { date: '2025-01-05', completeness: 99.1, gaps: 9 },
              { date: '2025-01-06', completeness: 98.2, gaps: 18 },
              { date: '2025-01-07', completeness: 99.0, gaps: 10 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
              <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} domain={[95, 100]} />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="completeness" stroke="#009639" strokeWidth={2} dot={{ r: 4 }} name="Completeness %" />
              <Line yAxisId="right" type="monotone" dataKey="gaps" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Gaps" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Missing Evidence Reasons</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <span className="text-sm font-medium text-gray-900">Photo-required item missing</span>
            <span className="text-sm font-semibold text-red-600">62 occurrences</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <span className="text-sm font-medium text-gray-900">Camera offline during inspection</span>
            <span className="text-sm font-semibold text-yellow-600">23 occurrences</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <span className="text-sm font-medium text-gray-900">Video capture failed</span>
            <span className="text-sm font-semibold text-yellow-600">15 occurrences</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-900">Storage quota exceeded</span>
            <span className="text-sm font-semibold text-gray-600">8 occurrences</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComplianceIntegrityReports() {
  const [dateRange, setDateRange] = useState('7D');

  const complianceData = [
    { center: 'Bole Center 01', geofenceBreaches: 2, redZone: 1, yellowZone: 1, fraudFlags: 0, cameraUptime: 99.2, anomalies: 0 },
    { center: 'Mercato Center 02', geofenceBreaches: 8, redZone: 3, yellowZone: 5, fraudFlags: 1, cameraUptime: 96.5, anomalies: 2 },
    { center: 'Adama Center', geofenceBreaches: 5, redZone: 2, yellowZone: 3, fraudFlags: 0, cameraUptime: 98.8, anomalies: 1 },
    { center: 'Bahir Dar Center', geofenceBreaches: 12, redZone: 5, yellowZone: 7, fraudFlags: 2, cameraUptime: 94.2, anomalies: 3 },
  ];

  const fraudSignals = [
    { id: 'SIG-001', type: 'Unusually Short Duration', center: 'Mercato Center 02', severity: 'High', detected: '2 hours ago', status: 'Open' },
    { id: 'SIG-002', type: 'Pass Rate Spike', center: 'Bahir Dar Center', severity: 'Medium', detected: '5 hours ago', status: 'Under Review' },
    { id: 'SIG-003', type: 'Geofence Violation Pattern', center: 'Bahir Dar Center', severity: 'High', detected: '1 day ago', status: 'Open' },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Compliance & Integrity Reports</h1>
        <p className="text-gray-600">Fraud/anomaly signals, geofence compliance, and camera uptime</p>
      </div>
        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
          <option value="1D">Today</option>
          <option value="7D">Last 7 Days</option>
          <option value="30D">Last 30 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total Geofence Breaches</p>
          <p className="text-3xl font-bold text-red-600">{complianceData.reduce((sum, c) => sum + c.geofenceBreaches, 0)}</p>
          <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Red Zone Breaches</p>
          <p className="text-3xl font-bold text-red-700">{complianceData.reduce((sum, c) => sum + c.redZone, 0)}</p>
          <p className="text-xs text-gray-500 mt-1">Critical violations</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Fraud Flags</p>
          <p className="text-3xl font-bold text-orange-600">{complianceData.reduce((sum, c) => sum + c.fraudFlags, 0)}</p>
          <p className="text-xs text-gray-500 mt-1">Anomalies detected</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Avg Camera Uptime</p>
          <p className="text-3xl font-bold text-green-600">
            {Math.round(complianceData.reduce((sum, c) => sum + c.cameraUptime, 0) / complianceData.length * 10) / 10}%
          </p>
          <p className="text-xs text-gray-500 mt-1">System average</p>
    </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Center Compliance Status</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Center</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Geofence Breaches</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Red Zone</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Yellow Zone</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Fraud Flags</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Camera Uptime</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Anomalies</th>
              </tr>
            </thead>
            <tbody>
              {complianceData.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{row.center}</td>
                  <td className="text-right py-3 px-4">
                    <span className={`font-semibold ${row.geofenceBreaches === 0 ? 'text-green-600' : row.geofenceBreaches <= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {row.geofenceBreaches}
                    </span>
                  </td>
                  <td className="text-right py-3 px-4 text-red-700 font-semibold">{row.redZone}</td>
                  <td className="text-right py-3 px-4 text-yellow-600">{row.yellowZone}</td>
                  <td className="text-right py-3 px-4">
                    <span className={`font-semibold ${row.fraudFlags === 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {row.fraudFlags}
                    </span>
                  </td>
                  <td className={`text-right py-3 px-4 font-semibold ${row.cameraUptime >= 98 ? 'text-green-600' : row.cameraUptime >= 95 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {row.cameraUptime}%
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className={`font-semibold ${row.anomalies === 0 ? 'text-green-600' : row.anomalies <= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {row.anomalies}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[
              { date: '2025-01-01', breaches: 2, fraudFlags: 0, cameraUptime: 99.2 },
              { date: '2025-01-02', breaches: 8, fraudFlags: 1, cameraUptime: 96.5 },
              { date: '2025-01-03', breaches: 5, fraudFlags: 0, cameraUptime: 98.8 },
              { date: '2025-01-04', breaches: 12, fraudFlags: 2, cameraUptime: 94.2 },
              { date: '2025-01-05', breaches: 3, fraudFlags: 0, cameraUptime: 99.5 },
              { date: '2025-01-06', breaches: 6, fraudFlags: 1, cameraUptime: 97.8 },
              { date: '2025-01-07', breaches: 4, fraudFlags: 0, cameraUptime: 98.9 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
              <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} domain={[90, 100]} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="breaches" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Geofence Breaches" />
              <Line yAxisId="left" type="monotone" dataKey="fraudFlags" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Fraud Flags" />
              <Line yAxisId="right" type="monotone" dataKey="cameraUptime" stroke="#009639" strokeWidth={2} dot={{ r: 4 }} name="Camera Uptime %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Fraud & Anomaly Signals</h3>
        <div className="space-y-3">
          {fraudSignals.map((signal) => (
            <div key={signal.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      signal.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {signal.severity}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{signal.type}</span>
    </div>
                  <p className="text-sm text-gray-600">Center: {signal.center}</p>
                  <p className="text-xs text-gray-500 mt-1">Detected: {signal.detected}</p>
      </div>
                <span className={`px-3 py-1 rounded text-xs font-semibold ${
                  signal.status === 'Open' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {signal.status}
                </span>
      </div>
    </div>
          ))}
      </div>
      </div>
    </div>
  );
}


const TABS = [
  { id: 'scorecard', label: 'Executive Scorecard', icon: BarChart3, component: ExecutiveScorecard },
  { id: 'trends', label: 'Trend Analysis', icon: TrendingUp, component: TrendAnalysis },
  { id: 'operational', label: 'Operational Reports', icon: BarChart3, component: OperationalReports },
  { id: 'evidence', label: 'Evidence Completeness', icon: CheckCircle, component: EvidenceCompletenessReports },
  { id: 'compliance', label: 'Compliance & Integrity', icon: AlertCircle, component: ComplianceIntegrityReports },
];

function ReportsAnalyticsEnhanced() {
  const [activeTab, setActiveTab] = useState('scorecard');

  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component || ExecutiveScorecard;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Reports & Analytics
        </h1>
        <p className="text-gray-600">
          Executive visibility, operational monitoring, compliance oversight, and scheduled reporting
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#009639] text-[#009639]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Active Tab Content */}
      <ActiveComponent />
    </div>
  );
}

export default ReportsAnalyticsEnhanced;






