import { useState, useMemo } from 'react';
import { Download, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { mockReconciliations } from '../../data/mockFeesPayments';
import { mockCentersFull } from '../../data/mockCentersInfrastructure';
import { useAuth } from '../../context/AuthContext';

function Reconciliation() {
  const { user } = useAuth();
  const [reconciliations, setReconciliations] = useState(mockReconciliations);
  const [dateFilter, setDateFilter] = useState('today');
  const [centerFilter, setCenterFilter] = useState('all');
  const [selectedRecon, setSelectedRecon] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState('');

  const filteredRecons = useMemo(() => {
    let filtered = [...reconciliations];
    
    if (centerFilter !== 'all') {
      filtered = filtered.filter(r => r.center_id === centerFilter);
    }
    
    if (dateFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(r => r.date === today);
    } else if (dateFilter === '7d') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(r => new Date(r.date) >= weekAgo);
    }
    
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [reconciliations, dateFilter, centerFilter]);

  const handleApprove = (recon) => {
    if (!approvalNotes.trim() && recon.variance_amount !== 0) {
      alert('Approval notes are required when variance exists');
      return;
    }

    const updated = reconciliations.map(r =>
      r.recon_id === recon.recon_id
        ? {
            ...r,
            status: 'Closed',
            approved_by_user_id: user?.id || 'admin-001',
            approved_at: new Date().toISOString(),
            approval_notes: approvalNotes,
          }
        : r
    );
    setReconciliations(updated);
    setSelectedRecon(null);
    setApprovalNotes('');
    console.log('Reconciliation approved and locked (audit logged)', recon.recon_id);
  };

  const handleGenerate = () => {
    // In real app, would generate reconciliation for selected date/center
    alert('Reconciliation report generated (mock)');
  };

  const getCenterName = (centerId) => {
    const center = mockCentersFull.find(c => c.center_id === centerId);
    return center ? center.center_name_en : centerId;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reconciliation</h1>
          <p className="text-gray-600">
            Daily balancing reports comparing expected vs received payments
          </p>
        </div>
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition flex items-center gap-2"
        >
          <Calendar className="h-5 w-5" />
          Generate Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
            >
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Center</label>
            <select
              value={centerFilter}
              onChange={(e) => setCenterFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
            >
              <option value="all">All Centers</option>
              {mockCentersFull.map(center => (
                <option key={center.center_id} value={center.center_id}>
                  {center.center_name_en}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reconciliation Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Reconciliation Reports ({filteredRecons.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Center</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Inspections</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Expected</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Received</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Variance</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecons.map(recon => (
                <tr key={recon.recon_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(recon.date).toLocaleDateString('en-ET')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getCenterName(recon.center_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {recon.inspections_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {recon.expected_total_amount.toLocaleString()} ETB
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {recon.received_total_amount.toLocaleString()} ETB
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      recon.variance_amount === 0 ? 'text-gray-900' :
                      recon.variance_amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {recon.variance_amount > 0 ? '+' : ''}{recon.variance_amount.toLocaleString()} ETB
                    </div>
                    <div className="text-xs text-gray-500">
                      ({recon.variance_percent > 0 ? '+' : ''}{recon.variance_percent.toFixed(2)}%)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {recon.status === 'Closed' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : recon.status === 'Submitted' ? (
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                    <span className="ml-2 text-xs text-gray-600">{recon.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedRecon(recon)}
                        className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition text-xs"
                      >
                        View Details
                      </button>
                      {recon.status === 'Submitted' && (
                        <button
                          onClick={() => {
                            setSelectedRecon(recon);
                            setApprovalNotes('');
                          }}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail/Approve Modal */}
      {selectedRecon && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Reconciliation Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Date</span>
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(selectedRecon.date).toLocaleDateString('en-ET')}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Center</span>
                  <div className="text-sm font-medium text-gray-900">
                    {getCenterName(selectedRecon.center_id)}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Inspections Count</span>
                  <div className="text-sm font-medium text-gray-900">
                    {selectedRecon.inspections_count}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Status</span>
                  <div className="text-sm font-medium text-gray-900">
                    {selectedRecon.status}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Financial Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Expected</div>
                    <div className="text-lg font-bold text-gray-900">
                      {selectedRecon.expected_total_amount.toLocaleString()} ETB
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Received</div>
                    <div className="text-lg font-bold text-gray-900">
                      {selectedRecon.received_total_amount.toLocaleString()} ETB
                    </div>
                  </div>
                  <div className={`rounded-lg p-3 ${
                    selectedRecon.variance_amount === 0 ? 'bg-green-50' :
                    selectedRecon.variance_amount > 0 ? 'bg-blue-50' : 'bg-red-50'
                  }`}>
                    <div className="text-xs text-gray-500 mb-1">Variance</div>
                    <div className={`text-lg font-bold ${
                      selectedRecon.variance_amount === 0 ? 'text-green-700' :
                      selectedRecon.variance_amount > 0 ? 'text-blue-700' : 'text-red-700'
                    }`}>
                      {selectedRecon.variance_amount > 0 ? '+' : ''}{selectedRecon.variance_amount.toLocaleString()} ETB
                    </div>
                    <div className="text-xs text-gray-500">
                      ({selectedRecon.variance_percent > 0 ? '+' : ''}{selectedRecon.variance_percent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Breakdown by Payment Method</h3>
                <div className="space-y-2">
                  {Object.entries(selectedRecon.breakdown).map(([method, data]) => (
                    <div key={method} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{method}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {data.count} transactions
                        </div>
                        <div className="text-xs text-gray-500">
                          {data.amount.toLocaleString()} ETB
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedRecon.status === 'Submitted' && (
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approval Notes {selectedRecon.variance_amount !== 0 && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                    placeholder="Enter approval notes (required if variance exists)..."
                  />
                </div>
              )}

              {selectedRecon.variance_amount !== 0 && selectedRecon.status === 'Open' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Variance detected. Explanation notes required before approval.
                  </p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedRecon(null);
                  setApprovalNotes('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
              {selectedRecon.status === 'Submitted' && (
                <button
                  onClick={() => handleApprove(selectedRecon)}
                  disabled={selectedRecon.variance_amount !== 0 && !approvalNotes.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Approve & Lock
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reconciliation;

