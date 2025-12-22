import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, Download, AlertCircle, CheckCircle, XCircle, Monitor, Globe, X } from 'lucide-react';
import { mockAuditEvents, getEventTypeLabel, formatTimestamp } from '../../data/mockSecurityAudit';
import { useAuth } from '../../context/AuthContext';

const EVENT_TYPES = [
  'user_created', 'role_changed', 'center_created', 'geofence_updated',
  'threshold_updated', 'export_requested', 'export_downloaded',
  'incident_ack', 'case_shared',
];

const ACTIONS = ['create', 'update', 'delete', 'approve', 'reject', 'login', 'logout', 'view', 'export', 'download', 'share'];
const RESULTS = ['success', 'failure'];
const DATA_CLASSIFICATIONS = ['Public', 'Internal', 'Restricted'];

function AuditLogs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get log source from URL
  const getLogSourceFromUrl = () => {
    const path = location.pathname;
    if (path === '/security/desktop-app' || path.startsWith('/security/desktop-app/')) {
      return 'desktop-app';
    }
    if (path === '/security/admin-portal' || path.startsWith('/security/admin-portal/')) {
      return 'admin-portal';
    }
    return 'all';
  };

  const [logSource, setLogSource] = useState(getLogSourceFromUrl());

  // Update logSource when URL changes
  useEffect(() => {
    setLogSource(getLogSourceFromUrl());
  }, [location.pathname]);
  const [events] = useState(mockAuditEvents);
  const [filters, setFilters] = useState({
    event_type: 'all',
    action: 'all',
    target_type: 'all',
    result: 'all',
    data_classification: 'all',
    date_from: '',
    date_to: '',
    actor_user_id: '',
    target_id: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportPurpose, setExportPurpose] = useState('');

  const filteredEvents = useMemo(() => {
    let filtered = [...events];
    
    // Filter by source (desktop app or admin portal)
    if (logSource !== 'all') {
      filtered = filtered.filter(e => e.source === logSource);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.audit_event_id.toLowerCase().includes(query) ||
        e.actor_user_id.toLowerCase().includes(query) ||
        e.target_id?.toLowerCase().includes(query) ||
        getEventTypeLabel(e.event_type).toLowerCase().includes(query)
      );
    }
    
    if (filters.event_type !== 'all') {
      filtered = filtered.filter(e => e.event_type === filters.event_type);
    }
    
    if (filters.action !== 'all') {
      filtered = filtered.filter(e => e.action === filters.action);
    }
    
    if (filters.target_type !== 'all') {
      filtered = filtered.filter(e => e.target_type === filters.target_type);
    }
    
    if (filters.result !== 'all') {
      filtered = filtered.filter(e => e.result === filters.result);
    }
    
    if (filters.data_classification !== 'all') {
      filtered = filtered.filter(e => e.data_classification === filters.data_classification);
    }
    
    if (filters.actor_user_id) {
      filtered = filtered.filter(e => e.actor_user_id.toLowerCase().includes(filters.actor_user_id.toLowerCase()));
    }
    
    if (filters.target_id) {
      filtered = filtered.filter(e => e.target_id?.toLowerCase().includes(filters.target_id.toLowerCase()));
    }
    
    if (filters.date_from) {
      filtered = filtered.filter(e => new Date(e.timestamp) >= new Date(filters.date_from));
    }
    
    if (filters.date_to) {
      filtered = filtered.filter(e => new Date(e.timestamp) <= new Date(filters.date_to));
    }
    
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [events, filters, searchQuery, logSource]);

  const handleExport = () => {
    if (!exportPurpose.trim()) {
      alert('Purpose reason is required for export');
      return;
    }
    
    console.log('Audit log export requested (audit logged)', {
      requested_by: user?.id,
      purpose: exportPurpose,
      row_count: filteredEvents.length,
    });
    
    // In real app, would generate export file
    alert('Export generated (mock). All exports are logged.');
    setShowExportModal(false);
    setExportPurpose('');
  };

  const handleClearFilters = () => {
    setFilters({
      event_type: 'all',
      action: 'all',
      target_type: 'all',
      result: 'all',
      data_classification: 'all',
      date_from: '',
      date_to: '',
      actor_user_id: '',
      target_id: '',
    });
    setSearchQuery('');
    setLogSource('all');
  };

  const getResultIcon = (result) => {
    return result === 'success' ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Logs</h1>
          <p className="text-gray-600">
            Immutable audit logs of all system actions and changes
          </p>
        </div>
        <button
          onClick={() => setShowExportModal(true)}
          className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition flex items-center gap-2"
        >
          <Download className="h-5 w-5" />
          Export Logs
        </button>
      </div>

      {/* Source Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => navigate('/security/all')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition ${
                logSource === 'all'
                  ? 'border-[#88bf47] text-[#88bf47]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Logs
            </button>
            <button
              onClick={() => navigate('/security/desktop-app')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition ${
                logSource === 'desktop-app'
                  ? 'border-[#88bf47] text-[#88bf47]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Monitor className="h-5 w-5" />
              Desktop App Actions
            </button>
            <button
              onClick={() => navigate('/security/admin-portal')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition ${
                logSource === 'admin-portal'
                  ? 'border-[#88bf47] text-[#88bf47]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Globe className="h-5 w-5" />
              Admin Portal Actions
            </button>
          </nav>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <span className="text-sm font-semibold text-yellow-800">
            Immutable Logs
          </span>
        </div>
        <p className="text-sm text-yellow-700">
          Audit logs are append-only and cannot be edited or deleted. All log access and exports are themselves logged.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event ID, actor, target, or event type..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
            />
          </div>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-2 whitespace-nowrap"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Event Type</label>
            <select
              value={filters.event_type}
              onChange={(e) => setFilters({ ...filters, event_type: e.target.value })}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
            >
              <option value="all">All Types</option>
              {EVENT_TYPES.map(type => (
                <option key={type} value={type}>{getEventTypeLabel(type)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Action</label>
            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
            >
              <option value="all">All Actions</option>
              {ACTIONS.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Result</label>
            <select
              value={filters.result}
              onChange={(e) => setFilters({ ...filters, result: e.target.value })}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
            >
              <option value="all">All Results</option>
              {RESULTS.map(result => (
                <option key={result} value={result}>{result}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Classification</label>
            <select
              value={filters.data_classification}
              onChange={(e) => setFilters({ ...filters, data_classification: e.target.value })}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
            >
              <option value="all">All Classifications</option>
              {DATA_CLASSIFICATIONS.map(classification => (
                <option key={classification} value={classification}>{classification}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Date From</label>
            <input
              type="date"
              value={filters.date_from}
              onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Date To</label>
            <input
              type="date"
              value={filters.date_to}
              onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
            />
          </div>
        </div>
      </div>

      {/* Audit Events Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Audit Events ({filteredEvents.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Event Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actor</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Target</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Result</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">IP Address</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.map(event => (
                <tr key={event.audit_event_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatTimestamp(event.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{getEventTypeLabel(event.event_type)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.actor_user_id}</div>
                    <div className="text-xs text-gray-500">{event.actor_role_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {event.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.target_type}</div>
                    <div className="text-xs text-gray-500">{event.target_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {getResultIcon(event.result)}
                      <span className="text-sm text-gray-900">{event.result}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.ip_address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="text-[#88bf47] hover:text-[#0fa84a] hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Audit Event Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Event ID</span>
                  <div className="text-sm font-medium text-gray-900">{selectedEvent.audit_event_id}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Timestamp</span>
                  <div className="text-sm font-medium text-gray-900">{formatTimestamp(selectedEvent.timestamp)}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Actor</span>
                  <div className="text-sm font-medium text-gray-900">{selectedEvent.actor_user_id}</div>
                  <div className="text-xs text-gray-500">{selectedEvent.actor_role_id} • {selectedEvent.actor_scope_type}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Target</span>
                  <div className="text-sm font-medium text-gray-900">{selectedEvent.target_type}</div>
                  <div className="text-xs text-gray-500">{selectedEvent.target_id}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">IP Address</span>
                  <div className="text-sm font-medium text-gray-900">{selectedEvent.ip_address}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Session ID</span>
                  <div className="text-sm font-medium text-gray-900">{selectedEvent.session_id}</div>
                </div>
              </div>

              {selectedEvent.before_snapshot && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Before Snapshot</h3>
                  <pre className="bg-gray-50 rounded-lg p-3 text-xs overflow-x-auto">
                    {JSON.stringify(selectedEvent.before_snapshot, null, 2)}
                  </pre>
                </div>
              )}

              {selectedEvent.after_snapshot && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">After Snapshot</h3>
                  <pre className="bg-gray-50 rounded-lg p-3 text-xs overflow-x-auto">
                    {JSON.stringify(selectedEvent.after_snapshot, null, 2)}
                  </pre>
                </div>
              )}

              {selectedEvent.failure_reason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="text-sm font-semibold text-red-800 mb-1">Failure Reason</div>
                  <div className="text-sm text-red-700">{selectedEvent.failure_reason}</div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Export Audit Logs</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  Exporting audit logs requires a purpose reason and will be logged. All exports are tracked.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={exportPurpose}
                  onChange={(e) => setExportPurpose(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  placeholder="Explain why you need to export these audit logs..."
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>Export will include: {filteredEvents.length} audit events</p>
                <p>Format: CSV</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowExportModal(false);
                  setExportPurpose('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={!exportPurpose.trim()}
                className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuditLogs;






