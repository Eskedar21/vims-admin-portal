import { useState } from 'react';
import { Clock, AlertCircle, Save } from 'lucide-react';
import { mockSLARules } from '../../data/mockOperations';

function SLARules() {
  const [rules, setRules] = useState(mockSLARules);
  const [editingRule, setEditingRule] = useState(null);

  const handleSave = (rule) => {
    // In real app, this would be an API call
    setRules(rules.map(r => r.incident_type === rule.incident_type ? rule : r));
    setEditingRule(null);
    alert('SLA rule saved (mock)');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SLA Rules & Escalation</h1>
        <p className="text-gray-600">
          Configure Service Level Agreement rules and escalation policies for incidents
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <span className="text-sm font-semibold text-yellow-800">
            Configuration Restricted
          </span>
        </div>
        <p className="text-sm text-yellow-700">
          Only Federal Super Admin (or delegated policy admin) can manage SLA rules.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">SLA Rules</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {rules.map((rule, idx) => (
            <div key={idx} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {rule.incident_type.replace('_', ' ').toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Severity: <span className="font-medium">{rule.severity}</span>
                  </p>
                </div>
                <button
                  onClick={() => setEditingRule(editingRule === idx ? null : idx)}
                  className="px-4 py-2 text-sm font-medium text-[#88bf47] hover:bg-green-50 rounded-lg transition"
                >
                  {editingRule === idx ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {editingRule === idx ? (
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Acknowledge Due (minutes)
                      </label>
                      <input
                        type="number"
                        value={rule.ack_due_minutes}
                        onChange={(e) => {
                          const updated = [...rules];
                          updated[idx].ack_due_minutes = parseInt(e.target.value);
                          setRules(updated);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resolve Due (minutes)
                      </label>
                      <input
                        type="number"
                        value={rule.resolve_due_minutes}
                        onChange={(e) => {
                          const updated = [...rules];
                          updated[idx].resolve_due_minutes = parseInt(e.target.value);
                          setRules(updated);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Working Hours Policy
                    </label>
                    <select
                      value={rule.working_hours_policy}
                      onChange={(e) => {
                        const updated = [...rules];
                        updated[idx].working_hours_policy = e.target.value;
                        setRules(updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                    >
                      <option value="24/7">24/7</option>
                      <option value="business_hours">Business Hours</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(rule)}
                      className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition text-sm font-medium flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingRule(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-500">Acknowledge Due</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {rule.ack_due_minutes} min
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-500">Resolve Due</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {rule.resolve_due_minutes} min
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-500">Working Hours</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {rule.working_hours_policy === '24/7' ? '24/7' : 'Business Hours'}
                    </div>
                  </div>
                </div>
              )}

              {/* Escalation Steps */}
              {rule.escalation_steps && rule.escalation_steps.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Escalation Steps</h4>
                  <div className="space-y-2">
                    {rule.escalation_steps.map((step, stepIdx) => (
                      <div key={stepIdx} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            After {step.after_minutes} minutes
                          </span>
                          <span className="text-sm text-gray-600 ml-2">
                            → {step.target_role} ({step.channel})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">How SLA Rules Work</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• SLA timers start at <code className="bg-gray-100 px-1 rounded">first_detected_at</code></li>
          <li>• If ACK due is missed, incident is escalated and escalation is recorded</li>
          <li>• Escalation notifications are sent through configured channels (in-system + email/SMS optional)</li>
          <li>• All escalations are logged for audit purposes</li>
        </ul>
      </div>
    </div>
  );
}

export default SLARules;

