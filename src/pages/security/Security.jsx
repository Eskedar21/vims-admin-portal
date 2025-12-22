import { useState } from "react";
import { mockAuditLogs, mockAccessLogs, mockSecuritySettings, mockSecurityAlerts } from "../../data/mockSecurity";
import { Shield, Lock, Eye, AlertTriangle, Search, Download, Save, Plus, Trash2, FileText } from "lucide-react";

function Security() {
  const [activeTab, setActiveTab] = useState("audit");
  const [searchQuery, setSearchQuery] = useState("");
  const [settings, setSettings] = useState(mockSecuritySettings);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-ET", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredAuditLogs = mockAuditLogs.filter(
    (log) =>
      searchQuery === "" ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveSettings = () => {
    localStorage.setItem("vims-security-settings", JSON.stringify(settings));
    alert("Security settings saved successfully!");
  };

  // Export functions
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

  const exportAuditLogs = () => {
    const data = filteredAuditLogs.map(log => ({
      Timestamp: formatDate(log.timestamp),
      User: log.user,
      Action: log.action,
      Resource: log.resource,
      Details: log.details,
      "IP Address": log.ipAddress,
      Status: log.status
    }));
    exportToCSV(data, `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportAccessLogs = () => {
    const data = mockAccessLogs.map(access => ({
      Timestamp: formatDate(access.timestamp),
      User: access.user,
      "IP Address": access.ipAddress,
      Location: access.location,
      Device: access.device,
      "Session Duration": access.sessionDuration,
      Status: access.status
    }));
    exportToCSV(data, `access_logs_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportSecurityAlerts = () => {
    const data = mockSecurityAlerts.map(alert => ({
      ID: alert.id,
      Type: alert.type,
      Severity: alert.severity,
      Description: alert.description,
      Status: alert.status,
      Timestamp: formatDate(alert.timestamp)
    }));
    exportToCSV(data, `security_alerts_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Security & Audit</h1>
        <p className="text-gray-600">
          Monitor system security, audit logs, and access controls
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: "audit", label: "Audit Logs", icon: FileText },
              { id: "access", label: "Access Logs", icon: Eye },
              { id: "alerts", label: "Security Alerts", icon: AlertTriangle },
              { id: "settings", label: "Security Settings", icon: Lock },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-[#88bf47] text-[#88bf47]"
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
          {/* Audit Logs Tab */}
          {activeTab === "audit" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search audit logs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent"
                    />
                  </div>
                </div>
                <button 
                  onClick={exportAuditLogs}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white text-sm font-medium px-4 py-2 hover:bg-gray-800 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export Logs
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Timestamp</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Resource</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Details</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">IP Address</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAuditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(log.timestamp)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.user}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.action}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.resource}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{log.details}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.ipAddress}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                log.status === "Success"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Access Logs Tab */}
          {activeTab === "access" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Active Sessions & Access History</h3>
                <button 
                  onClick={exportAccessLogs}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white text-sm font-medium px-4 py-2 hover:bg-gray-800 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>

              <div className="space-y-4">
                {mockAccessLogs.map((access) => (
                  <div
                    key={access.id}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-base font-semibold text-gray-900">{access.user}</h4>
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              access.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {access.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">IP:</span> {access.ipAddress}
                          </div>
                          <div>
                            <span className="font-medium">Location:</span> {access.location}
                          </div>
                          <div>
                            <span className="font-medium">Device:</span> {access.device}
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span> {access.sessionDuration}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Started: {formatDate(access.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Alerts Tab */}
          {activeTab === "alerts" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Security Alerts</h3>
                <button 
                  onClick={exportSecurityAlerts}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white text-sm font-medium px-4 py-2 hover:bg-gray-800 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export Report
                </button>
              </div>

              <div className="space-y-4">
                {mockSecurityAlerts.map((alert) => (
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
                                : alert.severity === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
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
                        <p className="text-xs text-gray-500">{formatDate(alert.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                <button
                  onClick={handleSaveSettings}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white text-sm font-medium px-4 py-2 hover:bg-gray-800 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Save Settings
                </button>
              </div>

              {/* Password Policy */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="text-base font-semibold text-gray-900 mb-4">Password Policy</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Minimum Length</label>
                    <input
                      type="number"
                      min="6"
                      max="20"
                      value={settings.passwordPolicy.minLength}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          passwordPolicy: { ...settings.passwordPolicy, minLength: Number(e.target.value) },
                        })
                      }
                      className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Require Uppercase</label>
                    <input
                      type="checkbox"
                      checked={settings.passwordPolicy.requireUppercase}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          passwordPolicy: { ...settings.passwordPolicy, requireUppercase: e.target.checked },
                        })
                      }
                      className="h-4 w-4 text-[#88bf47] focus:ring-[#88bf47] border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Require Lowercase</label>
                    <input
                      type="checkbox"
                      checked={settings.passwordPolicy.requireLowercase}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          passwordPolicy: { ...settings.passwordPolicy, requireLowercase: e.target.checked },
                        })
                      }
                      className="h-4 w-4 text-[#88bf47] focus:ring-[#88bf47] border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Require Numbers</label>
                    <input
                      type="checkbox"
                      checked={settings.passwordPolicy.requireNumbers}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          passwordPolicy: { ...settings.passwordPolicy, requireNumbers: e.target.checked },
                        })
                      }
                      className="h-4 w-4 text-[#88bf47] focus:ring-[#88bf47] border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Require Special Characters</label>
                    <input
                      type="checkbox"
                      checked={settings.passwordPolicy.requireSpecialChars}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          passwordPolicy: { ...settings.passwordPolicy, requireSpecialChars: e.target.checked },
                        })
                      }
                      className="h-4 w-4 text-[#88bf47] focus:ring-[#88bf47] border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Password Expiration (Days)</label>
                    <input
                      type="number"
                      min="30"
                      max="365"
                      value={settings.passwordPolicy.expirationDays}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          passwordPolicy: { ...settings.passwordPolicy, expirationDays: Number(e.target.value) },
                        })
                      }
                      className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Session Settings */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="text-base font-semibold text-gray-900 mb-4">Session Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Session Timeout (Minutes)</label>
                    <input
                      type="number"
                      min="5"
                      max="480"
                      value={settings.sessionSettings.timeoutMinutes}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          sessionSettings: { ...settings.sessionSettings, timeoutMinutes: Number(e.target.value) },
                        })
                      }
                      className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Max Concurrent Sessions</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={settings.sessionSettings.maxConcurrentSessions}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          sessionSettings: { ...settings.sessionSettings, maxConcurrentSessions: Number(e.target.value) },
                        })
                      }
                      className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Require Multi-Factor Authentication</label>
                    <input
                      type="checkbox"
                      checked={settings.sessionSettings.requireMFA}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          sessionSettings: { ...settings.sessionSettings, requireMFA: e.target.checked },
                        })
                      }
                      className="h-4 w-4 text-[#88bf47] focus:ring-[#88bf47] border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* IP Whitelist */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-semibold text-gray-900">IP Whitelist</h4>
                  <button className="inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white text-sm font-medium px-4 py-2 hover:bg-gray-800 transition-colors">
                    <Plus className="h-4 w-4" />
                    Add IP
                  </button>
                </div>
                <div className="space-y-3">
                  {settings.ipWhitelist.map((ip) => (
                    <div
                      key={ip.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{ip.ip}</p>
                        <p className="text-xs text-gray-600">{ip.description}</p>
                      </div>
                      <button className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Security;

