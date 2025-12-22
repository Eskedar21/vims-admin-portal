import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Tag, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { mockOperationsIncidents, rootCauseTags } from '../../data/mockOperations';
import { mockSLARules } from '../../data/mockOperations';

function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [selectedRootCause, setSelectedRootCause] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [assignedTo, setAssignedTo] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);

  useEffect(() => {
    let found = mockOperationsIncidents.find(inc => inc.id === id || inc.incident_id === id);
    
    // Check for updated incident in localStorage
    try {
      const stored = localStorage.getItem('updatedIncidents');
      if (stored) {
        const updated = JSON.parse(stored);
        if (updated[id] && found) {
          found = { ...found, ...updated[id] };
        }
      }
    } catch (e) {
      console.error('Failed to load updated incident:', e);
    }
    
    if (found) {
      setIncident(found);
      setCurrentStatus(found.status);
      setSelectedRootCause(found.root_cause_tag_id);
      setResolutionNotes(found.resolution_notes || '');
      setAssignedTo(found.assignedToUserId);
    }
  }, [id]);

  const handleStatusChange = (newStatus) => {
    if (!incident) return;
    
    // Update local state
    setCurrentStatus(newStatus);
    
    // Update incident object
    const updatedIncident = {
      ...incident,
      status: newStatus,
      // Add timeline event for status change
      timeline_events: [
        ...(incident.timeline_events || []),
        {
          at: new Date().toISOString(),
          actor: 'current_user', // In real app, use actual user
          event_type: 'status_changed',
          details: `Status changed from ${incident.status} to ${newStatus}`,
        },
      ],
    };
    
    setIncident(updatedIncident);
    
    // In real app, this would be an API call
    // For now, update the mock data in localStorage or context
    try {
      const stored = localStorage.getItem('updatedIncidents') || '{}';
      const updated = JSON.parse(stored);
      updated[id] = updatedIncident;
      localStorage.setItem('updatedIncidents', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save status update:', e);
    }
  };

  const handleAcknowledge = () => {
    handleStatusChange('Acknowledged');
  };

  const handleAssign = () => {
    // In real app, this would open a user picker modal
    const userId = prompt('Enter user ID to assign:');
    if (userId) {
      setAssignedTo(userId);
      handleStatusChange('In Progress');
      // Update incident with assignment
      const updatedIncident = {
        ...incident,
        assignedToUserId: userId,
        timeline_events: [
          ...(incident.timeline_events || []),
          {
            at: new Date().toISOString(),
            actor: 'current_user',
            event_type: 'assigned',
            details: `Assigned to user ${userId}`,
          },
        ],
      };
      setIncident(updatedIncident);
    }
  };

  const handleEscalate = () => {
    // In real app, this would open escalation dialog
    if (confirm('Escalate this incident to higher priority?')) {
      const updatedIncident = {
        ...incident,
        severity: incident.severity === 'Low' ? 'Medium' :
                  incident.severity === 'Medium' ? 'High' :
                  incident.severity === 'High' ? 'Critical' : incident.severity,
        timeline_events: [
          ...(incident.timeline_events || []),
          {
            at: new Date().toISOString(),
            actor: 'current_user',
            event_type: 'escalated',
            details: 'Incident escalated',
          },
        ],
      };
      setIncident(updatedIncident);
    }
  };

  if (!incident) {
    return (
      <div className="max-w-4xl mx-auto mt-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Incident Not Found</h2>
          <p className="text-gray-600 mb-4">The incident you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/operations')}
            className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition"
          >
            Back to Operations
          </button>
        </div>
      </div>
    );
  }

  const getSeverityBadge = (severity) => {
    const config = {
      Critical: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle },
      High: { bg: 'bg-orange-100', text: 'text-orange-800', icon: AlertCircle },
      Medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      Low: { bg: 'bg-blue-100', text: 'text-blue-800', icon: AlertCircle },
    };
    const c = config[severity] || config.Medium;
    const Icon = c.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${c.bg} ${c.text}`}>
        <Icon className="h-4 w-4" />
        {severity}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const config = {
      Open: { bg: 'bg-blue-100', text: 'text-blue-800', icon: AlertCircle },
      Acknowledged: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      'In Progress': { bg: 'bg-purple-100', text: 'text-purple-800', icon: Clock },
      Resolved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      'False Positive': { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle },
    };
    const c = config[status] || config.Open;
    const Icon = c.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${c.bg} ${c.text}`}>
        <Icon className="h-4 w-4" />
        {status}
      </span>
    );
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleString('en-ET');
  };

  const getSLAStatus = () => {
    if (!incident.sla_due_at) return null;
    const now = new Date();
    const due = new Date(incident.sla_due_at);
    const diffMs = due - now;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 0) {
      return { status: 'overdue', text: 'SLA Overdue', color: 'text-red-600' };
    } else if (diffMins < 30) {
      return { status: 'warning', text: `Due in ${diffMins}m`, color: 'text-yellow-600' };
    } else {
      return { status: 'ok', text: `Due in ${Math.floor(diffMins / 60)}h`, color: 'text-green-600' };
    }
  };

  const slaStatus = getSLAStatus();
  const allRootCauseTags = Object.values(rootCauseTags).flat();

  const handleResolve = () => {
    if (!selectedRootCause && incident.status !== 'False Positive') {
      alert('Root cause tag is required to resolve an incident');
      return;
    }
    // In real app, this would be an API call
    console.log('Resolving incident', {
      incident_id: incident.id,
      root_cause_tag_id: selectedRootCause,
      resolution_notes: resolutionNotes,
    });
    alert('Incident resolved (mock)');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/operations')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Incident #{incident.id}</h1>
            <p className="text-gray-600 mt-1">{incident.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getSeverityBadge(incident.severity)}
          {getStatusBadge(currentStatus || incident.status)}
        </div>
      </div>

      {/* SLA Status */}
      {slaStatus && (
        <div className={`bg-white rounded-lg border p-4 ${
          slaStatus.status === 'overdue' ? 'border-red-200 bg-red-50' :
          slaStatus.status === 'warning' ? 'border-yellow-200 bg-yellow-50' :
          'border-green-200 bg-green-50'
        }`}>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span className={`font-medium ${slaStatus.color}`}>{slaStatus.text}</span>
            <span className="text-sm text-gray-500 ml-2">
              (Resolve due: {formatTime(incident.sla_due_at)})
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* What Happened */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What Happened</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Type:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">{incident.type}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">First Detected:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {formatTime(incident.firstDetectedAt)}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Last Seen:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {formatTime(incident.lastSeenAt)}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Description:</span>
                <p className="mt-1 text-sm text-gray-900">{incident.description}</p>
              </div>
            </div>
          </div>

          {/* Affected Assets */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Affected Assets</h2>
            <div className="space-y-2">
              {incident.affected_assets && incident.affected_assets.length > 0 ? (
                incident.affected_assets.map((asset, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs font-medium text-gray-500 uppercase">{asset.type}:</span>
                    <span className="text-sm text-gray-900">{asset.name || asset.id}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">
                  {incident.scope?.centerName || 'Unknown center'}
                </div>
              )}
              {incident.linked_inspections_count > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-900">
                    {incident.linked_inspections_count} inspection{incident.linked_inspections_count !== 1 ? 's' : ''} affected
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-4">
              {incident.timeline_events && incident.timeline_events.length > 0 ? (
                incident.timeline_events.map((event, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-[#88bf47]"></div>
                      {idx < incident.timeline_events.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">{event.event_type}</span>
                        <span className="text-xs text-gray-500">{formatTime(event.at)}</span>
                      </div>
                      <p className="text-sm text-gray-600">{event.details}</p>
                      <p className="text-xs text-gray-500 mt-1">Actor: {event.actor}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No timeline events</div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Change */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Status
              </label>
              <select
                value={currentStatus || incident.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
              >
                <option value="Open">Open</option>
                <option value="Acknowledged">Acknowledged</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="False Positive">False Positive</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-3">
              {currentStatus !== 'Acknowledged' && currentStatus !== 'In Progress' && currentStatus !== 'Resolved' && (
                <button
                  onClick={handleAcknowledge}
                  className="w-full px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition text-sm font-medium"
                >
                  Acknowledge
                </button>
              )}
              <button
                onClick={handleAssign}
                className="w-full px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition text-sm font-medium"
              >
                Assign
              </button>
              {incident.severity !== 'Critical' && (
                <button
                  onClick={handleEscalate}
                  className="w-full px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
                >
                  Escalate
                </button>
              )}
            </div>
          </div>

          {/* Resolution */}
          {currentStatus !== 'Resolved' && currentStatus !== 'False Positive' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resolve Incident</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Root Cause Tag <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedRootCause || ''}
                    onChange={(e) => setSelectedRootCause(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  >
                    <option value="">Select root cause...</option>
                    {allRootCauseTags.map(tag => (
                      <option key={tag.id} value={tag.id}>
                        {tag.category}: {tag.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resolution Notes
                  </label>
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                    placeholder="Describe how the incident was resolved..."
                  />
                </div>
                <button
                  onClick={handleResolve}
                  className="w-full px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition text-sm font-medium"
                >
                  Resolve Incident
                </button>
              </div>
            </div>
          )}

          {/* Assignment */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Assignment</h2>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-500">Assigned To:</span>
                <div className="mt-1 text-sm font-medium text-gray-900">
                  {assignedTo ? `User ${assignedTo}` : 'Unassigned'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncidentDetail;

