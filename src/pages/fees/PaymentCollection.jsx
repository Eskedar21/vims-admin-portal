import { useState, useMemo } from 'react';
import { Search, CheckCircle, XCircle, Clock, Printer, AlertCircle } from 'lucide-react';
import { mockPayments, calculateFeeWithVAT, mockTaxPolicies } from '../../data/mockFeesPayments';
import { useAuth } from '../../context/AuthContext';

const PAYMENT_METHODS = ['Cash', 'TeleBirr', 'Card', 'BankTransfer'];
const PAYMENT_STATUSES = ['Unpaid', 'Pending', 'Paid', 'Failed', 'Refunded'];

function PaymentCollection() {
  const { user } = useAuth();
  const [payments, setPayments] = useState(mockPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    payment_method: 'Cash',
    amount_paid: 0,
    provider_txn_id: '',
  });

  const isReceptionist = user?.role?.toLowerCase().includes('receptionist') || 
                        user?.role?.toLowerCase().includes('cashier');

  const filteredPayments = useMemo(() => {
    let filtered = [...payments];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.inspection_id.toLowerCase().includes(query) ||
        p.payer_reference?.toLowerCase().includes(query) ||
        p.receipt_number?.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.payment_status === statusFilter);
    }
    
    return filtered;
  }, [payments, searchQuery, statusFilter]);

  const handleCollectPayment = (payment) => {
    if (paymentForm.amount_paid < payment.amount_due) {
      alert(`Amount paid (${paymentForm.amount_paid}) is less than amount due (${payment.amount_due})`);
      return;
    }

    const updated = payments.map(p =>
      p.payment_id === payment.payment_id
        ? {
            ...p,
            amount_paid: paymentForm.amount_paid,
            payment_method: paymentForm.payment_method,
            provider_txn_id: paymentForm.provider_txn_id || null,
            payment_status: 'Paid',
            paid_at: new Date().toISOString(),
            collected_by_user_id: user?.id || 'U-002',
            receipt_number: `RCP-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
            receipt_print_count: 0,
          }
        : p
    );
    setPayments(updated);
    setSelectedPayment(null);
    setPaymentForm({ payment_method: 'Cash', amount_paid: 0, provider_txn_id: '' });
    console.log('Payment collected (audit logged)', { payment_id: payment.payment_id });
  };

  const handlePrintReceipt = (payment) => {
    if (payment.payment_status !== 'Paid') {
      alert('Receipt can only be printed for paid payments');
      return;
    }

    const updated = payments.map(p =>
      p.payment_id === payment.payment_id
        ? { ...p, receipt_print_count: (p.receipt_print_count || 0) + 1 }
        : p
    );
    setPayments(updated);
    console.log('Receipt printed (audit logged)', { payment_id: payment.payment_id });
    // In real app, would trigger print dialog
    alert('Receipt printed (mock)');
  };

  const getStatusBadge = (status) => {
    const config = {
      Paid: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      Pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      Failed: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
      Unpaid: { bg: 'bg-gray-100', text: 'text-gray-800', icon: Clock },
      Refunded: { bg: 'bg-blue-100', text: 'text-blue-800', icon: AlertCircle },
    };
    const c = config[status] || config.Unpaid;
    const Icon = c.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const currentTaxPolicy = mockTaxPolicies.find(p => p.approval_status === 'Approved' && !p.effective_to);
  const vatInfo = currentTaxPolicy 
    ? calculateFeeWithVAT(0, currentTaxPolicy.vat_percent, currentTaxPolicy.tax_inclusive)
    : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Collection</h1>
          <p className="text-gray-600">
            Collect and verify payments linked to inspections
          </p>
        </div>
      </div>

      {/* Info Banner */}
      {isReceptionist && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">
              Receptionist / Cashier Access
            </span>
          </div>
          <p className="text-sm text-blue-700">
            You can collect payments and print receipts. You cannot edit fee policies.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by inspection ID, plate, or receipt number..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
            >
              <option value="all">All Status</option>
              {PAYMENT_STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Payments ({filteredPayments.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Payment ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Inspection ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Amount Due</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Amount Paid</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Receipt</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map(payment => (
                <tr key={payment.payment_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.payment_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.inspection_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.amount_due.toLocaleString()} {payment.currency}
                    </div>
                    {vatInfo && (
                      <div className="text-xs text-gray-500">
                        Base: {(payment.amount_due / (1 + currentTaxPolicy.vat_percent / 100)).toFixed(2)} + VAT {currentTaxPolicy.vat_percent}%
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.amount_paid.toLocaleString()} {payment.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.payment_method || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.payment_status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.receipt_number ? (
                      <div>
                        <div className="text-sm text-gray-900">{payment.receipt_number}</div>
                        <div className="text-xs text-gray-500">
                          Printed {payment.receipt_print_count} time{payment.receipt_print_count !== 1 ? 's' : ''}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No receipt</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {payment.payment_status === 'Unpaid' && (
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="px-3 py-1.5 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition text-xs"
                        >
                          Collect Payment
                        </button>
                      )}
                      {payment.payment_status === 'Paid' && (
                        <button
                          onClick={() => handlePrintReceipt(payment)}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs flex items-center gap-1"
                        >
                          <Printer className="h-3 w-3" />
                          Print Receipt
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

      {/* Collect Payment Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Collect Payment</h2>
              <p className="text-sm text-gray-600 mt-1">
                Inspection: {selectedPayment.inspection_id} | Amount Due: {selectedPayment.amount_due.toLocaleString()} {selectedPayment.currency}
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  value={paymentForm.payment_method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                >
                  {PAYMENT_METHODS.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount Paid <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentForm.amount_paid}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount_paid: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  placeholder={selectedPayment.amount_due.toString()}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Amount due: {selectedPayment.amount_due.toLocaleString()} {selectedPayment.currency}
                </p>
              </div>

              {paymentForm.payment_method === 'TeleBirr' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provider Transaction ID
                  </label>
                  <input
                    type="text"
                    value={paymentForm.provider_txn_id}
                    onChange={(e) => setPaymentForm({ ...paymentForm, provider_txn_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                    placeholder="TeleBirr transaction ID"
                  />
                </div>
              )}

              {paymentForm.amount_paid > 0 && paymentForm.amount_paid < selectedPayment.amount_due && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Amount paid is less than amount due. Payment will be marked as partial.
                  </p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedPayment(null);
                  setPaymentForm({ payment_method: 'Cash', amount_paid: 0, provider_txn_id: '' });
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCollectPayment(selectedPayment)}
                className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentCollection;












