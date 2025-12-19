import { useState } from 'react';
import { Plus, Edit, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { mockIntegrations, getIntegrationStatusColor, getInstitutionName } from '../../data/mockSystemAdmin';
import { useAuth } from '../../context/AuthContext';

const INTEGRATION_TYPES = ['Inbound', 'Outbound', 'Bidirectional'];
const STATUSES = ['Active', 'Degraded', 'Down', 'Disabled'];
const SCOPE_SUPPORTED = ['National', 'Regional', 'Center'];

function IntegrationRegistry() {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState(mockIntegrations);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [formData, setFormData] = useState({
    integration_name: '',
    integration_type: 'Bidirectional',
    owner_institution_id: '',
    scope_supported: 'National',
    status: 'Active',
    data_contract_version: 'v1.0',
    change_control_required: false,
  });

  const handleCreate = () => {
    const newIntegration = {
      integration_id: `INT-${Date.now()}`,
      ...formData,
      health_check_url_ref: `secure://health/${formData.integration_name.toLowerCase().replace(/\s+/g, '-')}`,
      last_success_at: null,
      last_failure_at: null,
      failure_rate_percent: 0,
      created_by: user?.id || 'admin-001',
      created_at: new Date().toISOString(),
      updated_by: user?.id || 'admin-001',
      updated_at: new Date().toISOString(),
    };
    setIntegrations([...integrations, newIntegration]);
    setShowCreateModal(false);
    resetForm();
    console.log('Integration created (audit logged)', newIntegration);
  };

  const handleUpdateStatus = (integrationId, newStatus) => {
    const updated = integrations.map(i =>
      i.integration_id === integrationId
        ? {
            ...i,
            status: newStatus,
            updated_by: user?.id || 'admin-001',
            updated_at: new Date().toISOString(),
          }
        : i
    );
    setIntegrations(updated);
    console.log('Integration status updated (audit logged)', { integration_id: integrationId, new_status: newStatus });
  };

  const resetForm = () => {
    setFormData({
      integration_name: '',
      integration_type: 'Bidirectional',
      owner_institution_id: '',
      scope_supported: 'National',
      status: 'Active',
      data_contract_version: 'v1.0',
      change_control_required: false,
    });
  };

  const getStatusIcon = (status) => {
    const icons = {
      Active: CheckCircle,
      Degraded: Clock,
      Down: XCircle,
      Disabled: AlertCircle,
    };
    return icons[status] || AlertCircle;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Integration Registry</h1>
          <p className="text-gray-600">
            Catalogue and manage all system integrations with ownership and status
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Register Integration
        </button>
      </div>

      {/* Integrations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Integrations ({integrations.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Integration</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Failure Rate</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Last Success</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Version</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {integrations.map(integration => {
                const StatusIcon = getStatusIcon(integration.status);
                return (
                  <tr key={integration.integration_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{integration.integration_name}</div>
                      <div className="text-xs text-gray-500">{integration.scope_supported} scope</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {integration.integration_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getInstitutionName(integration.owner_institution_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getIntegrationStatusColor(integration.status)}`}>
                        <StatusIcon className="h-3 w-3" />
                        {integration.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {integration.failure_rate_percent.toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {integration.last_success_at ? (
                        <div>
                          {new Date(integration.last_success_at).toLocaleTimeString('en-ET')}
                        </div>
                      ) : (
                        <span className="text-gray-400">Never</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {integration.data_contract_version}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedIntegration(integration)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Integration Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Register Integration</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Integration Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.integration_name}
                  onChange={(e) => setFormData({ ...formData, integration_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  placeholder="e.g., TeleBirr Payment Gateway"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Integration Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.integration_type}
                    onChange={(e) => setFormData({ ...formData, integration_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  >
                    {INTEGRATION_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scope Supported <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.scope_supported}
                    onChange={(e) => setFormData({ ...formData, scope_supported: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  >
                    {SCOPE_SUPPORTED.map(scope => (
                      <option key={scope} value={scope}>{scope}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Contract Version
                </label>
                <input
                  type="text"
                  value={formData.data_contract_version}
                  onChange={(e) => setFormData({ ...formData, data_contract_version: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  placeholder="v1.0"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.change_control_required}
                    onChange={(e) => setFormData({ ...formData, change_control_required: e.target.checked })}
                    className="rounded border-gray-300 text-[#009639] focus:ring-[#009639]"
                  />
                  <span className="text-sm text-gray-700">Change Control Required</span>
                </label>
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
                className="px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Integration Detail Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{selectedIntegration.integration_name}</h2>
                <select
                  value={selectedIntegration.status}
                  onChange={(e) => handleUpdateStatus(selectedIntegration.integration_id, e.target.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${getIntegrationStatusColor(selectedIntegration.status)}`}
                >
                  {STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Integration Type</span>
                  <div className="text-sm font-medium text-gray-900">{selectedIntegration.integration_type}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Owner</span>
                  <div className="text-sm font-medium text-gray-900">
                    {getInstitutionName(selectedIntegration.owner_institution_id)}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Scope Supported</span>
                  <div className="text-sm font-medium text-gray-900">{selectedIntegration.scope_supported}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Data Contract Version</span>
                  <div className="text-sm font-medium text-gray-900">{selectedIntegration.data_contract_version}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Failure Rate</span>
                  <div className="text-sm font-medium text-gray-900">
                    {selectedIntegration.failure_rate_percent.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Last Success</span>
                  <div className="text-sm font-medium text-gray-900">
                    {selectedIntegration.last_success_at
                      ? new Date(selectedIntegration.last_success_at).toLocaleString('en-ET')
                      : 'Never'}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedIntegration(null)}
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

export default IntegrationRegistry;






