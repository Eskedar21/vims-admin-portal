import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CreditCard, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { mockCentersFull } from '../../data/mockCentersInfrastructure';
import { mockInstitutions } from '../../data/mockGovernance';
import { useAuth } from '../../context/AuthContext';

// Mock TeleBirr configs
const mockTeleBirrConfigs = [
  {
    payment_partner_id: 'INST-TELEBIRR',
    center_id: 'CTR-001',
    merchant_id: 'MERCH-001',
    merchant_code: 'TEL-AA-BOLE-01',
    merchant_name: 'Bole Center 01 - RSIFS',
    terminal_id: 'TERM-001',
    callback_url: 'secure://webhooks/telebirr/CTR-001',
    webhook_ref: 'WEB-TELEBIRR-001',
    status: 'Active',
    activated_at: '2024-01-01T00:00:00Z',
    created_by: 'admin-001',
    created_at: '2024-01-01T00:00:00Z',
  },
];

function TeleBirrSetup() {
  const { id: centerId } = useParams();
  const { user } = useAuth();
  const [configs, setConfigs] = useState(
    mockTeleBirrConfigs.filter(c => c.center_id === centerId)
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    merchant_id: '',
    merchant_code: '',
    merchant_name: '',
    terminal_id: '',
    callback_url: '',
    status: 'Pending',
  });

  const center = mockCentersFull.find(c => c.center_id === centerId);
  const telebirrInstitution = mockInstitutions.find(i => i.institution_id === 'INST-TELEBIRR');

  const handleCreate = () => {
    if (!formData.merchant_id || !formData.merchant_code) {
      alert('Merchant ID and code are required');
      return;
    }

    const newConfig = {
      payment_partner_id: 'INST-TELEBIRR',
      center_id: centerId,
      ...formData,
      webhook_ref: `WEB-TELEBIRR-${Date.now()}`,
      activated_at: formData.status === 'Active' ? new Date().toISOString() : null,
      created_by: user?.id || 'admin-001',
      created_at: new Date().toISOString(),
    };
    setConfigs([...configs, newConfig]);
    setShowCreateModal(false);
    resetForm();
    console.log('TeleBirr config created (audit logged)', newConfig);
  };

  const resetForm = () => {
    setFormData({
      merchant_id: '',
      merchant_code: '',
      merchant_name: center ? `${center.center_name_en} - RSIFS` : '',
      terminal_id: '',
      callback_url: '',
      status: 'Pending',
    });
  };

  const getStatusBadge = (status) => {
    const config = {
      Active: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      Pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertCircle },
      Suspended: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
    };
    const c = config[status] || config.Pending;
    const Icon = c.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${c.bg} ${c.text}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TeleBirr Merchant Account Setup</h1>
          <p className="text-gray-600">
            Associate TeleBirr merchant configuration to center for payment reconciliation
          </p>
        </div>
        {configs.length === 0 && (
          <button
            onClick={() => {
              setFormData({
                ...formData,
                merchant_name: center ? `${center.center_name_en} - RSIFS` : '',
              });
              setShowCreateModal(true);
            }}
            className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition flex items-center gap-2"
          >
            <CreditCard className="h-5 w-5" />
            Setup TeleBirr
          </button>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-semibold text-blue-800">
            Integration Placeholder
          </span>
        </div>
        <p className="text-sm text-blue-700">
          TeleBirr must provide integration details. This interface allows storing merchant configuration even before full API integration exists.
          Only authorized roles can view sensitive merchant identifiers.
        </p>
      </div>

      {/* TeleBirr Config */}
      {configs.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">TeleBirr Configuration</h2>
          </div>
          <div className="p-6 space-y-4">
            {configs.map(config => (
              <div key={config.merchant_id} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Merchant ID</span>
                    <div className="text-sm font-medium text-gray-900">{config.merchant_id}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Merchant Code</span>
                    <div className="text-sm font-medium text-gray-900">{config.merchant_code}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Merchant Name</span>
                    <div className="text-sm font-medium text-gray-900">{config.merchant_name}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Status</span>
                    <div className="mt-1">{getStatusBadge(config.status)}</div>
                  </div>
                  {config.terminal_id && (
                    <div>
                      <span className="text-sm text-gray-500">Terminal ID</span>
                      <div className="text-sm font-medium text-gray-900">{config.terminal_id}</div>
                    </div>
                  )}
                  {config.activated_at && (
                    <div>
                      <span className="text-sm text-gray-500">Activated At</span>
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(config.activated_at).toLocaleString('en-ET')}
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Webhook Reference</div>
                  <div className="text-xs font-mono text-gray-700">{config.webhook_ref}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No TeleBirr configuration found for this center</p>
          <button
            onClick={() => {
              setFormData({
                ...formData,
                merchant_name: center ? `${center.center_name_en} - RSIFS` : '',
              });
              setShowCreateModal(true);
            }}
            className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition"
          >
            Setup TeleBirr Merchant
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">TeleBirr Merchant Setup</h2>
              <p className="text-sm text-gray-600 mt-1">Center: {center?.center_name_en}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  TeleBirr integration details pending. This configuration will be linked once API integration is available.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Merchant ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.merchant_id}
                  onChange={(e) => setFormData({ ...formData, merchant_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Merchant Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.merchant_code}
                  onChange={(e) => setFormData({ ...formData, merchant_code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Merchant Name
                </label>
                <input
                  type="text"
                  value={formData.merchant_name}
                  onChange={(e) => setFormData({ ...formData, merchant_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Terminal ID (optional)
                </label>
                <input
                  type="text"
                  value={formData.terminal_id}
                  onChange={(e) => setFormData({ ...formData, terminal_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                >
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
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
                onClick={handleCreate}
                className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeleBirrSetup;












