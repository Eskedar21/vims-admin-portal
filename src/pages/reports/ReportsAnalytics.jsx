import { useState } from "react";
import { mockRevenueData, mockInspectionStats, mockRegionalStats, mockFraudAlerts, mockReportTemplates, mockFraudTrendData } from "../../data/mockReports";
import { Download, FileText, TrendingUp, AlertTriangle, Calendar, Mail, Plus, X } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

function ReportsAnalytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [reportTemplates, setReportTemplates] = useState(mockReportTemplates);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: "",
    type: "Revenue",
    frequency: "Daily",
    recipients: "",
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-ET", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-ET", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalRevenue = mockRevenueData.reduce((sum, item) => sum + item.amount, 0);
  const averageDailyRevenue = Math.round(totalRevenue / mockRevenueData.length);

  // Export functions
  const exportToPDF = () => {
    window.print();
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      alert("No data to export");
      return;
    }
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        return typeof value === "string" && value.includes(",") ? `"${value}"` : value;
      }).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename || "export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportRevenueReport = () => {
    const data = mockRevenueData.map(item => ({
      Date: new Date(item.date).toLocaleDateString("en-ET"),
      Inspections: item.count,
      Revenue: item.amount,
      "Revenue (ETB)": `${item.amount.toLocaleString()} ETB`
    }));
    exportToCSV(data, `revenue_report_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportFraudReport = () => {
    const data = mockFraudAlerts.map(alert => ({
      ID: alert.id,
      Type: alert.type,
      Severity: alert.severity,
      Center: alert.center,
      Description: alert.description,
      Status: alert.status,
      Timestamp: formatDate(alert.timestamp)
    }));
    exportToCSV(data, `fraud_alerts_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportScheduledReport = (template) => {
    const data = [{
      "Report Name": template.name,
      "Type": template.type,
      "Frequency": template.frequency,
      "Recipients": template.recipients.join("; "),
      "Last Generated": formatDate(template.lastGenerated)
    }];
    exportToCSV(data, `${template.name.replace(/\s+/g, "_")}_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleAddSchedule = () => {
    if (!newSchedule.name.trim() || !newSchedule.recipients.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    const recipients = newSchedule.recipients
      .split(",")
      .map(email => email.trim())
      .filter(email => email.length > 0);

    if (recipients.length === 0) {
      alert("Please enter at least one recipient email");
      return;
    }

    const newTemplate = {
      id: `template-${Date.now()}`,
      name: newSchedule.name,
      type: newSchedule.type,
      frequency: newSchedule.frequency,
      recipients: recipients,
      lastGenerated: new Date().toISOString(),
    };

    setReportTemplates([...reportTemplates, newTemplate]);
    setNewSchedule({
      name: "",
      type: "Revenue",
      frequency: "Daily",
      recipients: "",
    });
    setShowScheduleModal(false);
    alert("Schedule created successfully!");
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">
          Comprehensive reporting and analytics for inspection operations
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "revenue", label: "Revenue Reports", icon: FileText },
              { id: "inspections", label: "Inspection Analytics", icon: FileText },
              { id: "fraud", label: "Fraud Alerts", icon: AlertTriangle },
              { id: "scheduled", label: "Scheduled Reports", icon: Calendar },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <p className="text-sm text-blue-700 mb-1">Total Revenue (7 Days)</p>
                  <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalRevenue)} ETB</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <p className="text-sm text-green-700 mb-1">Avg Daily Revenue</p>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(averageDailyRevenue)} ETB</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <p className="text-sm text-purple-700 mb-1">Total Inspections</p>
                  <p className="text-2xl font-bold text-purple-900">{formatCurrency(mockInspectionStats.totalInspections)}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                  <p className="text-sm text-orange-700 mb-1">Pass Rate</p>
                  <p className="text-2xl font-bold text-orange-900">{mockInspectionStats.passRate}%</p>
                </div>
              </div>

              {/* Fraud Trend Chart */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Fraud Trend (Last 7 Days)</h3>
                  <span className="text-xs text-gray-500">Vehicle Presence Violations</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockFraudTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6b7280" 
                        fontSize={12}
                        tickFormatter={(value) => new Date(value).toLocaleDateString("en-ET", { month: "short", day: "numeric" })}
                      />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                        labelFormatter={(value) => new Date(value).toLocaleDateString("en-ET")}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="geofenceViolations"
                        name="Outside Center Geofence"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="vehiclePresenceViolations"
                        name="Without Vehicle Presence"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        name="Total Violations"
                        stroke="#dc2626"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        dot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-xs text-gray-600 space-y-1">
                  <p className="font-medium">Key Metrics:</p>
                  <p>• Total violations detected: {mockFraudTrendData.reduce((sum, d) => sum + d.total, 0)}</p>
                  <p>• Geofence violations: {mockFraudTrendData.reduce((sum, d) => sum + d.geofenceViolations, 0)}</p>
                  <p>• Vehicle presence violations: {mockFraudTrendData.reduce((sum, d) => sum + d.vehiclePresenceViolations, 0)}</p>
                </div>
              </div>

              {/* Regional Stats */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Regional Performance</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Region</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Inspections</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Revenue</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Pass Rate</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockRegionalStats.map((stat) => (
                        <tr key={stat.region} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stat.region}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(stat.inspections)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(stat.revenue)} ETB</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.passRate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Revenue Reports Tab */}
          {activeTab === "revenue" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Reports</h3>
                <button 
                  onClick={exportRevenueReport}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white text-sm font-medium px-4 py-2 hover:bg-gray-800 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="text-base font-semibold text-gray-900 mb-4">Daily Revenue Breakdown</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Inspections</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockRevenueData.map((item) => (
                        <tr key={item.date} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(item.date).toLocaleDateString("en-ET")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.count}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(item.amount)} ETB
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Inspection Analytics Tab */}
          {activeTab === "inspections" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <p className="text-sm text-gray-600 mb-1">Total Inspections</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockInspectionStats.totalInspections)}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <p className="text-sm text-gray-600 mb-1">Pass Rate</p>
                  <p className="text-2xl font-bold text-green-600">{mockInspectionStats.passRate}%</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <p className="text-sm text-gray-600 mb-1">Avg Inspection Time</p>
                  <p className="text-2xl font-bold text-gray-900">{mockInspectionStats.averageInspectionTime} min</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="text-base font-semibold text-gray-900 mb-4">Inspection Statistics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Passed</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(mockInspectionStats.passed)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Failed</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(mockInspectionStats.failed)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pending</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(mockInspectionStats.pending)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fraud Alerts Tab */}
          {activeTab === "fraud" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Fraud Alerts</h3>
                <button 
                  onClick={exportFraudReport}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white text-sm font-medium px-4 py-2 hover:bg-gray-800 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export Report
                </button>
              </div>

              <div className="space-y-4">
                {mockFraudAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              alert.severity === "High"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {alert.severity}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">{alert.type}</span>
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              alert.status === "Open" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                            }`}
                          >
                            {alert.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Center: {alert.center}</span>
                          <span>•</span>
                          <span>{formatDate(alert.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scheduled Reports Tab */}
          {activeTab === "scheduled" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Scheduled Reports</h3>
                <button 
                  onClick={() => setShowScheduleModal(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white text-sm font-medium px-4 py-2 hover:bg-gray-800 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  New Schedule
                </button>
              </div>

              <div className="space-y-4">
                {reportTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-base font-semibold text-gray-900">{template.name}</h4>
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {template.type}
                          </span>
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {template.frequency}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Mail className="h-4 w-4" />
                          <span>{template.recipients.length} recipient(s)</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Last generated: {formatDate(template.lastGenerated)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => exportScheduledReport(template)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Export Report"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Create New Schedule</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Name *
                </label>
                <input
                  type="text"
                  value={newSchedule.name}
                  onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                  placeholder="e.g., Weekly Fraud Summary"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type *
                </label>
                <select
                  value={newSchedule.type}
                  onChange={(e) => setNewSchedule({ ...newSchedule, type: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="Revenue">Revenue</option>
                  <option value="Inspection">Inspection</option>
                  <option value="Regional">Regional</option>
                  <option value="Fraud">Fraud</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency *
                </label>
                <select
                  value={newSchedule.frequency}
                  onChange={(e) => setNewSchedule({ ...newSchedule, frequency: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipients (comma-separated emails) *
                </label>
                <input
                  type="text"
                  value={newSchedule.recipients}
                  onChange={(e) => setNewSchedule({ ...newSchedule, recipients: e.target.value })}
                  placeholder="email1@example.com, email2@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple emails with commas</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSchedule}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Create Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportsAnalytics;



