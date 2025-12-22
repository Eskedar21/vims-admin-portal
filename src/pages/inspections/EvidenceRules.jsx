import { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, Plus, Edit } from 'lucide-react';
import { mockInspectionTypes, mockVehicleClasses } from '../../data/mockInspectionProgram';
import { useAuth } from '../../context/AuthContext';

// Mock evidence rules
const mockEvidenceRules = [
  {
    rule_id: 'EVID-RULE-001',
    inspection_type_id: 'INITIAL',
    vehicle_class_id: 'PRIVATE_CAR',
    checklist_item_id: 'CHK-EXT-001',
    photo_required_on_fail: true,
    evidence_type: 'photo',
    mandatory: true,
    gap_severity: 'High',
    incident_on_gap: true,
    enabled: true,
    effective_from: '2020-01-01T00:00:00Z',
  },
];

// Mock evidence gaps
const mockEvidenceGaps = [
  {
    inspection_id: 'INSP-001',
    center_id: 'CTR-001',
    inspection_date: new Date(Date.now() - 86400000).toISOString(),
    vehicle_plate: '3-12345',
    required_evidence_items: ['photo-failed-checklist-EXT-001'],
    provided_evidence_items: [],
    evidence_gap_count: 1,
    evidence_completeness_status: 'Incomplete',
    evidence_gap_incident_id: 'INC-EVID-001',
  },
];

function EvidenceRules() {
  const { user } = useAuth();
  const [rules, setRules] = useState(mockEvidenceRules);
  const [gaps, setGaps] = useState(mockEvidenceGaps);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    inspection_type_id: '',
    vehicle_class_id: '',
    checklist_item_id: '',
    photo_required_on_fail: true,
    evidence_type: 'photo',
    mandatory: true,
    gap_severity: 'High',
    incident_on_gap: true,
    enabled: true,
  });

  const handleCreate = () => {
    const newRule = {
      rule_id: `EVID-RULE-${Date.now()}`,
      ...formData,
      effective_from: new Date().toISOString(),
    };
    setRules([...rules, newRule]);
    setShowCreateModal(false);
    resetForm();
    console.log('Evidence rule created (audit logged)', newRule);
  };

  const resetForm = () => {
    setFormData({
      inspection_type_id: '',
      vehicle_class_id: '',
      checklist_item_id: '',
      photo_required_on_fail: true,
      evidence_type: 'photo',
      mandatory: true,
      gap_severity: 'High',
      incident_on_gap: true,
      enabled: true,
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Evidence Rules & Gap Detection</h1>
          <p className="text-gray-600">
            Enforce evidence rules and detect evidence gaps for inspection integrity
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create Rule
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <span className="text-sm font-semibold text-yellow-800">
            Evidence Compliance
          </span>
        </div>
        <p className="text-sm text-yellow-700">
          If inspection is completed with missing mandatory evidence, system blocks certification OR flags as "Completed but Non-Compliant" based on policy.
          Evidence gaps generate incidents and appear in Operations Command Center and Reports.
        </p>
      </div>

      {/* Evidence Rules Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Evidence Rules ({rules.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Inspection Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Vehicle Class</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Checklist Item</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Photo Required</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Mandatory</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Gap Severity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Incident on Gap</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rules.map(rule => (
                <tr key={rule.rule_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {mockInspectionTypes.find(t => t.inspection_type_id === rule.inspection_type_id)?.name_en || rule.inspection_type_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {mockVehicleClasses.find(v => v.vehicle_class_id === rule.vehicle_class_id)?.name_en || rule.vehicle_class_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rule.checklist_item_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {rule.photo_required_on_fail ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {rule.mandatory ? (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        Mandatory
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        Optional
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      rule.gap_severity === 'Critical' ? 'bg-red-100 text-red-800' :
                      rule.gap_severity === 'High' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {rule.gap_severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {rule.incident_on_gap ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {rule.enabled ? (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Enabled
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        Disabled
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Edit className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evidence Gaps Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Evidence Gaps ({gaps.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Inspection</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Center</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Gap Count</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Incident</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {gaps.map(gap => (
                <tr key={gap.inspection_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {gap.inspection_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {gap.center_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {gap.vehicle_plate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(gap.inspection_date).toLocaleDateString('en-ET')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      {gap.evidence_gap_count}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      gap.evidence_completeness_status === 'Complete' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {gap.evidence_completeness_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {gap.evidence_gap_incident_id ? (
                      <a href={`/operations/incidents/${gap.evidence_gap_incident_id}`} className="text-blue-600 hover:underline">
                        {gap.evidence_gap_incident_id}
                      </a>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Create Evidence Rule</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inspection Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.inspection_type_id}
                    onChange={(e) => setFormData({ ...formData, inspection_type_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  >
                    <option value="">Select...</option>
                    {mockInspectionTypes.map(type => (
                      <option key={type.inspection_type_id} value={type.inspection_type_id}>
                        {type.name_en}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Class <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.vehicle_class_id}
                    onChange={(e) => setFormData({ ...formData, vehicle_class_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  >
                    <option value="">Select...</option>
                    {mockVehicleClasses.map(vc => (
                      <option key={vc.vehicle_class_id} value={vc.vehicle_class_id}>
                        {vc.name_en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Checklist Item ID
                </label>
                <input
                  type="text"
                  value={formData.checklist_item_id}
                  onChange={(e) => setFormData({ ...formData, checklist_item_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.photo_required_on_fail}
                    onChange={(e) => setFormData({ ...formData, photo_required_on_fail: e.target.checked })}
                    className="rounded border-gray-300 text-[#88bf47] focus:ring-[#88bf47]"
                  />
                  <span className="text-sm text-gray-700">Photo Required on Fail</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.mandatory}
                    onChange={(e) => setFormData({ ...formData, mandatory: e.target.checked })}
                    className="rounded border-gray-300 text-[#88bf47] focus:ring-[#88bf47]"
                  />
                  <span className="text-sm text-gray-700">Mandatory</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.incident_on_gap}
                    onChange={(e) => setFormData({ ...formData, incident_on_gap: e.target.checked })}
                    className="rounded border-gray-300 text-[#88bf47] focus:ring-[#88bf47]"
                  />
                  <span className="text-sm text-gray-700">Generate Incident on Gap</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gap Severity
                </label>
                <select
                  value={formData.gap_severity}
                  onChange={(e) => setFormData({ ...formData, gap_severity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
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
                Create Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EvidenceRules;












