import { useState, useMemo } from 'react';
import { Plus, Edit, FileText, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockEnforcementCases, mockViolations, VIOLATION_TYPES, getViolationLabel, getViolationSeverity } from '../../data/mockCasework';
import { useAuth } from '../../context/AuthContext';

const CASE_TYPES = ['Compliance', 'Integrity', 'Fraud', 'Operational'];
const PRIORITIES = ['Critical', 'High', 'Medium', 'Low'];
const STATUSES = ['Open', 'Acknowledged', 'In Progress', 'Resolved', 'Closed', 'Rejected'];

function EnforcementCases() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cases, setCases] = useState(mockEnforcementCases);
  const [violations] = useState(mockViolations);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [formData, setFormData] = useState({
    plate_number: '',
    vin: '',
    certificate_number: '',
    inspection_id: '',
    case_type: 'Compliance',
    priority: 'Medium',
    summary: '',
    notes: '',
  });

  const filteredCases = useMemo(() => {
    let filtered = [...cases];
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(c => c.priority === priorityFilter);
    }
    return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [cases, statusFilter, priorityFilter]);

  const handleCreateCase = () => {
    if (!formData.plate_number && !formData.certificate_number && !formData.inspection_id) {
      alert('At least one identifier (plate number, certificate number, or inspection ID) is required');
      return;
    }

    const newCase = {
      case_id: `CASE-${Date.now()}`,
      case_number: `CASE-${new Date().getFullYear()}-${String(cases.length + 1).padStart(3, '0')}`,
      created_at: new Date().toISOString(),
      created_by_user_id: user?.id || 'U-005',
      scope: 'Region',
      plate_number: formData.plate_number || null,
      vin: formData.vin || null,
      inspection_ids: formData.inspection_id ? [formData.inspection_id] : [],
      case_type: formData.case_type,
      priority: formData.priority,
      status: 'Open',
      assigned_to_user_id: null,
      assigned_team_id: null,
      sla_due_at: null,
      summary: formData.summary,
      notes: [
        {
          note_id: `NOTE-${Date.now()}`,
          note_text: formData.notes || 'Case created',
          created_at: new Date().toISOString(),
          created_by: user?.id || 'U-005',
        },
      ],
    };
    setCases([...cases, newCase]);
    setShowCreateModal(false);
    resetForm();
    console.log('Enforcement case created (audit logged)', newCase);
  };

  const handleUpdateStatus = (caseId, newStatus) => {
    const updated = cases.map(c =>
      c.case_id === caseId
        ? {
            ...c,
            status: newStatus,
            notes: [
              ...c.notes,
              {
                note_id: `NOTE-${Date.now()}`,
                note_text: `Status changed to ${newStatus}`,
                created_at: new Date().toISOString(),
                created_by: user?.id || 'admin-001',
              },
            ],
          }
        : c
    );
    setCases(updated);
    console.log('Case status updated (audit logged)', { case_id: caseId, new_status: newStatus });
  };

  const resetForm = () => {
    setFormData({
      plate_number: '',
      vin: '',
      certificate_number: '',
      inspection_id: '',
      case_type: 'Compliance',
      priority: 'Medium',
      summary: '',
      notes: '',
    });
  };

  const getStatusBadge = (status) => {
    const config = {
      Open: { bg: 'bg-gray-100', text: 'text-gray-800', icon: Clock },
      'In Progress': { bg: 'bg-blue-100', text: 'text-blue-800', icon: AlertCircle },
      Resolved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      Closed: { bg: 'bg-gray-100', text: 'text-gray-800', icon: CheckCircle },
      Rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
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

  const getPriorityBadge = (priority) => {
    const config = {
      Critical: 'bg-red-100 text-red-800',
      High: 'bg-orange-100 text-orange-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${config[priority] || config.Medium}`}>
        {priority}
      </span>
    );
  };

  const caseViolations = (caseId) => violations.filter(v => v.case_id === caseId);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enforcement Cases</h1>
          <p className="text-gray-600">
            Create and manage enforcement cases for violations and compliance issues
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create Case
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
            >
              <option value="all">All Status</option>
              {STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
            >
              <option value="all">All Priorities</option>
              {PRIORITIES.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Cases ({filteredCases.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Case Number</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Plate Number</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Violations</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Created</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCases.map(caseItem => {
                const caseViols = caseViolations(caseItem.case_id);
                return (
                  <tr key={caseItem.case_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {caseItem.case_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {caseItem.plate_number || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {caseItem.case_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(caseItem.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(caseItem.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{caseViols.length}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(caseItem.created_at).toLocaleDateString('en-ET')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedCase(caseItem)}
                        className="text-[#88bf47] hover:text-[#0fa84a] hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Case Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Create Enforcement Case</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  At least one identifier is required: Plate Number, Certificate Number, or Inspection ID
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plate Number
                  </label>
                  <input
                    type="text"
                    value={formData.plate_number}
                    onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    VIN (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.vin}
                    onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificate Number
                  </label>
                  <input
                    type="text"
                    value={formData.certificate_number}
                    onChange={(e) => setFormData({ ...formData, certificate_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inspection ID
                  </label>
                  <input
                    type="text"
                    value={formData.inspection_id}
                    onChange={(e) => setFormData({ ...formData, inspection_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Case Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.case_type}
                    onChange={(e) => setFormData({ ...formData, case_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  >
                    {CASE_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  >
                    {PRIORITIES.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Summary <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  placeholder="Brief summary of the case..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  placeholder="Additional notes..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCase}
                className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition"
              >
                Create Case
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Case Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedCase.case_number}</h2>
                  <p className="text-sm text-gray-600 mt-1">{selectedCase.summary}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedCase.status)}
                  {getPriorityBadge(selectedCase.priority)}
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Plate Number</span>
                  <div className="text-sm font-medium text-gray-900">{selectedCase.plate_number || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Case Type</span>
                  <div className="text-sm font-medium text-gray-900">{selectedCase.case_type}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Created</span>
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(selectedCase.created_at).toLocaleString('en-ET')}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Assigned To</span>
                  <div className="text-sm font-medium text-gray-900">
                    {selectedCase.assigned_to_user_id || 'Unassigned'}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Violations</h3>
                <div className="space-y-2">
                  {caseViolations(selectedCase.case_id).map(violation => (
                    <div key={violation.violation_id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {getViolationLabel(violation.violation_type)}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          violation.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                          violation.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {violation.severity}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Detected: {new Date(violation.detected_at).toLocaleString('en-ET')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Timeline</h3>
                <div className="space-y-2">
                  {selectedCase.notes.map(note => (
                    <div key={note.note_id} className="border-l-2 border-gray-200 pl-3 py-2">
                      <div className="text-sm text-gray-900">{note.note_text}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(note.created_at).toLocaleString('en-ET')} by {note.created_by}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Actions</h3>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.filter(s => s !== selectedCase.status).map(status => (
                    <button
                      key={status}
                      onClick={() => {
                        handleUpdateStatus(selectedCase.case_id, status);
                        setSelectedCase({ ...selectedCase, status });
                      }}
                      className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                      Set {status}
                    </button>
                  ))}
                  <button
                    onClick={() => navigate(`/casework/cases/${selectedCase.case_id}/bundles`)}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Generate Evidence Bundle
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedCase(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnforcementCases;












