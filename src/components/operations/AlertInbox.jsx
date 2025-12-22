import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Filter, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { filterIncidentsByScope } from '../../utils/scopeFilter';

function AlertInbox({ alerts, scope, filters }) {
  const navigate = useNavigate();
  const [severityFilter, setSeverityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter alerts by scope and merge with updated incidents from localStorage
  const scopedAlerts = useMemo(() => {
    let mergedAlerts = [...alerts];
    
    // Merge with updated incidents from localStorage
    try {
      const stored = localStorage.getItem('updatedIncidents');
      if (stored) {
        const updated = JSON.parse(stored);
        mergedAlerts = mergedAlerts.map(alert => {
          const alertId = alert.id || alert.incident_id || alert.alert_id;
          if (updated[alertId]) {
            return { ...alert, ...updated[alertId] };
          }
          return alert;
        });
      }
    } catch (e) {
      console.error('Failed to load updated incidents:', e);
    }
    
    return filterIncidentsByScope(mergedAlerts, scope);
  }, [alerts, scope]);

  // Apply filters
  const filteredAlerts = useMemo(() => {
    return scopedAlerts.filter(alert => {
      const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
      const matchesType = typeFilter === 'all' || alert.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
      return matchesSeverity && matchesType && matchesStatus;
    });
  }, [scopedAlerts, severityFilter, typeFilter, statusFilter]);

  const getSeverityBadge = (severity) => {
    const config = {
      Critical: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle },
      High: { bg: 'bg-orange-100', text: 'text-orange-800', icon: AlertCircle },
      Medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      Low: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Bell },
    };
    const c = config[severity] || config.Medium;
    const Icon = c.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${c.bg} ${c.text}`}>
        <Icon className="h-3 w-3" />
        {severity}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const config = {
      Open: { bg: 'bg-blue-100', text: 'text-blue-800', icon: AlertCircle },
      New: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Bell },
      Acknowledged: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      'In Progress': { bg: 'bg-purple-100', text: 'text-purple-800', icon: Clock },
      Resolved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      'False Positive': { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle },
      ConvertedToIncident: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      Suppressed: { bg: 'bg-gray-100', text: 'text-gray-800', icon: CheckCircle },
    };
    const c = config[status] || config.Open;
    const Icon = c.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${c.bg} ${c.text}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-ET');
  };

  const getTypeLabel = (type) => {
    const labels = {
      center_offline: 'Center Offline',
      geofence_breach: 'Geofence Breach',
      machine_fault: 'Machine Fault',
      camera_offline: 'Camera Offline',
      evidence_gap: 'Evidence Gap',
      suspicious_activity: 'Suspicious Activity',
      outlier_signal: 'Outlier Signal',
      storage_critical: 'Storage Critical',
    };
    return labels[type] || type;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Alert Inbox</h3>
        </div>
        <span className="text-xs text-gray-500">
          {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2 py-1.5 text-xs rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#88bf47]"
          >
            <option value="all">All Severity</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2 py-1.5 text-xs rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#88bf47]"
          >
            <option value="all">All Types</option>
            {Array.from(new Set(scopedAlerts.map(a => a.type))).map(type => (
              <option key={type} value={type}>{getTypeLabel(type)}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1.5 text-xs rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#88bf47]"
          >
            <option value="all">All Status</option>
            <option value="Open">Open</option>
            <option value="New">New</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="False Positive">False Positive</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <p className="text-sm">No alerts matching filters</p>
          </div>
        ) : (
          filteredAlerts.slice(0, 20).map(alert => (
            <div
              key={alert.alert_id || alert.id}
              onClick={() => navigate(`/operations/incidents/${alert.id || alert.incident_id || alert.alert_id}`)}
              className="px-6 py-4 hover:bg-gray-50 transition cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getSeverityBadge(alert.severity)}
                    <span className="text-sm font-medium text-gray-900">
                      {getTypeLabel(alert.type || alert.alert_type)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {alert.scope?.centerName || alert.scope?.center_id || 'Unknown Center'}
                  </p>
                </div>
                {getStatusBadge(alert.status)}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatTime(alert.detected_at || alert.firstDetectedAt)}</span>
                {alert.evidence_links && alert.evidence_links.length > 0 && (
                  <span>{alert.evidence_links.length} evidence link{alert.evidence_links.length !== 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {filteredAlerts.length > 20 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Showing 20 of {filteredAlerts.length} alerts
          </p>
        </div>
      )}
    </div>
  );
}

export default AlertInbox;

