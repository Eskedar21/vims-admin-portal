import { useState, useMemo } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, Eye } from 'lucide-react';
import { mockChangeRequests } from '../../data/mockGovernance';
import { useAuth } from '../../context/AuthContext';

const RISK_LEVELS = {
  Low: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle },
  Med: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertCircle },
  High: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle },
};

function ChangeRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState(mockChangeRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredRequests = useMemo(() => {
    if (filterStatus === 'all') return requests;
    return requests.filter(r => r.approval_status === filterStatus);
  }, [requests, filterStatus]);

  const handleApprove = (request) => {
    if (request.requested_by === user?.id) {
      alert('You cannot approve your own governance change request.');
      return;
    }

    if (window.confirm(`Approve change request: ${request.change_summary}?`)) {
      const updated = requests.map(r =>
        r.change_request_id === request.change_request_id
          ? {
              ...r,
              approval_status: 'Approved',
              approved_by: user?.id || 'admin-003',
              approved_at: new Date().toISOString(),
            }
          : r
      );
      setRequests(updated);
      console.log('Change request approved - would apply changes to master data');
    }
  };

  const handleReject = (request) => {
    if (!rejectionReason.trim()) {
      alert('Rejection reason is mandatory');
      return;
    }

    if (window.confirm(`Reject change request: ${request.change_summary}?`)) {
      const updated = requests.map(r =>
        r.change_request_id === request.change_request_id
          ? {
              ...r,
              approval_status: 'Rejected',
              rejection_reason: rejectionReason,
            }
          : r
      );
      setRequests(updated);
      setRejectionReason('');
      setSelectedRequest(null);
      console.log('Change request rejected - master data unchanged');
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('en-ET');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Governance Change Control
          </h1>
          <p className="text-gray-600">
            Two-person approval workflow for sensitive governance changes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <span className="text-sm font-semibold text-yellow-800">
            Approval Rules
          </span>
        </div>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Requestor cannot approve their own governance change</li>
          <li>• Approved changes become effective immediately or on effective_from date</li>
          <li>• Rejected changes do not alter master data; rejection reason is mandatory</li>
          <li>• All actions appear in Audit Logs</li>
        </ul>
      </div>

      {/* Change Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Change Requests ({filteredRequests.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Request ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Domain</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Summary</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Requested By</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No change requests found
                  </td>
                </tr>
              ) : (
                filteredRequests.map(request => {
                  const riskConfig = RISK_LEVELS[request.risk_level] || RISK_LEVELS.Med;
                  const RiskIcon = riskConfig.icon;
                  
                  return (
                    <tr key={request.change_request_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request.change_request_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {request.change_domain}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{request.change_summary}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatTime(request.requested_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${riskConfig.bg} ${riskConfig.text}`}>
                          <RiskIcon className="h-3 w-3" />
                          {request.risk_level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.requested_by}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.approval_status === 'Pending' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3" />
                            Pending
                          </span>
                        ) : request.approval_status === 'Approved' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3" />
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="h-3 w-3" />
                            Rejected
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {request.approval_status === 'Pending' && request.requested_by !== user?.id && (
                            <>
                              <button
                                onClick={() => handleApprove(request)}
                                className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs font-medium"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setRejectionReason('');
                                }}
                                className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs font-medium"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail/Reject Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Change Request Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-700">Request ID:</span>
                <span className="ml-2 text-sm text-gray-900">{selectedRequest.change_request_id}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Domain:</span>
                <span className="ml-2 text-sm text-gray-900">{selectedRequest.change_domain}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Summary:</span>
                <p className="mt-1 text-sm text-gray-900">{selectedRequest.change_summary}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Risk Level:</span>
                <span className="ml-2 text-sm text-gray-900">{selectedRequest.risk_level}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Requested By:</span>
                <span className="ml-2 text-sm text-gray-900">{selectedRequest.requested_by}</span>
                <span className="ml-4 text-xs text-gray-500">
                  {formatTime(selectedRequest.requested_at)}
                </span>
              </div>
              {selectedRequest.approved_by && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Approved By:</span>
                  <span className="ml-2 text-sm text-gray-900">{selectedRequest.approved_by}</span>
                  <span className="ml-4 text-xs text-gray-500">
                    {formatTime(selectedRequest.approved_at)}
                  </span>
                </div>
              )}
              {selectedRequest.rejection_reason && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Rejection Reason:</span>
                  <p className="mt-1 text-sm text-red-700">{selectedRequest.rejection_reason}</p>
                </div>
              )}

              {/* Diff Display */}
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Change Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div>
                    <span className="text-xs font-medium text-gray-500">Before:</span>
                    <pre className="mt-1 text-xs text-gray-700 bg-white p-2 rounded border">
                      {JSON.stringify(selectedRequest.diff_before_after.before, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500">After:</span>
                    <pre className="mt-1 text-xs text-gray-700 bg-white p-2 rounded border">
                      {JSON.stringify(selectedRequest.diff_before_after.after, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Rejection Form */}
              {selectedRequest.approval_status === 'Pending' && selectedRequest.requested_by !== user?.id && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                    placeholder="Enter reason for rejection..."
                  />
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
              {selectedRequest.approval_status === 'Pending' && selectedRequest.requested_by !== user?.id && (
                <>
                  <button
                    onClick={() => handleApprove(selectedRequest)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedRequest)}
                    disabled={!rejectionReason.trim()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChangeRequests;

