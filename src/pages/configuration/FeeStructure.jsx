import { useState, useEffect } from "react";
import { mockFeeStructure, VEHICLE_CLASSES, INSPECTION_TYPES, COMPONENTS } from "../../data/mockFees";
import { mockRegionalOverrides, mockOverridePolicy, mockFeeSchedules } from "../../data/mockFeesPayments";
import { mockAdminUnits } from "../../data/mockGovernance";
import { useAuth } from "../../context/AuthContext";
import { Plus, Trash2, Save, MapPin, AlertCircle, CheckCircle, Edit, DollarSign } from "lucide-react";

function FeeStructure() {
  const { user } = useAuth();
  const [fees, setFees] = useState(() => {
    const saved = localStorage.getItem("vims-fee-structure");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return mockFeeStructure;
      }
    }
    return mockFeeStructure;
  });

  const [overrides, setOverrides] = useState(() => {
    const saved = localStorage.getItem("vims-regional-overrides");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return mockRegionalOverrides;
      }
    }
    return mockRegionalOverrides;
  });

  const [policy, setPolicy] = useState(() => {
    const saved = localStorage.getItem("vims-override-policy");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return mockOverridePolicy;
      }
    }
    return mockOverridePolicy;
  });

  const [activeSection, setActiveSection] = useState("base-fees");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [newRule, setNewRule] = useState({
    component: "",
    fee: "",
  });
  const [overrideFormData, setOverrideFormData] = useState({
    admin_unit_id: "",
    fee_schedule_id: "",
    override_fee_amount: 0,
    effective_from: new Date().toISOString().split("T")[0],
    effective_to: null,
    approval_status: "Draft",
  });

  // Save to localStorage whenever fees change
  useEffect(() => {
    localStorage.setItem("vims-fee-structure", JSON.stringify(fees));
  }, [fees]);

  useEffect(() => {
    localStorage.setItem("vims-regional-overrides", JSON.stringify(overrides));
  }, [overrides]);

  useEffect(() => {
    localStorage.setItem("vims-override-policy", JSON.stringify(policy));
  }, [policy]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-ET", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleFeeChange = (id, field, value) => {
    setFees((prev) => ({
      ...prev,
      baseFees: prev.baseFees.map((fee) =>
        fee.id === id ? { ...fee, [field]: field === "amount" ? Number(value) : value } : fee
      ),
    }));
  };

  const handleAddFee = () => {
    const newFee = {
      id: `fee-${Date.now()}`,
      inspectionType: "Initial",
      vehicleClass: VEHICLE_CLASSES[0],
      amount: 0,
    };
    setFees((prev) => ({
      ...prev,
      baseFees: [...prev.baseFees, newFee],
    }));
  };

  const handleDeleteFee = (id) => {
    setFees((prev) => ({
      ...prev,
      baseFees: prev.baseFees.filter((fee) => fee.id !== id),
    }));
  };

  const handleAddRule = () => {
    if (!newRule.component || !newRule.fee) return;

    const rule = {
      id: `rule-${Date.now()}`,
      component: newRule.component,
      fee: Number(newRule.fee),
    };

    setFees((prev) => ({
      ...prev,
      partialPaymentRules: [...prev.partialPaymentRules, rule],
    }));

    setNewRule({ component: "", fee: "" });
  };

  const handleDeleteRule = (id) => {
    setFees((prev) => ({
      ...prev,
      partialPaymentRules: prev.partialPaymentRules.filter((rule) => rule.id !== id),
    }));
  };

  const handleRuleFeeChange = (id, value) => {
    setFees((prev) => ({
      ...prev,
      partialPaymentRules: prev.partialPaymentRules.map((rule) =>
        rule.id === id ? { ...rule, fee: Number(value) } : rule
      ),
    }));
  };

  const handleVATChange = (value) => {
    setFees((prev) => ({
      ...prev,
      taxSettings: {
        ...prev.taxSettings,
        vatPercent: Number(value),
      },
    }));
  };

  const handleSave = () => {
    alert("Fee structure saved successfully!");
  };

  const handleCreateOverride = () => {
    if (!policy.allowed) {
      alert("Regional overrides are not allowed. Update policy first.");
      return;
    }

    const baseSchedule = mockFeeSchedules.find(s => s.fee_schedule_id === overrideFormData.fee_schedule_id);
    if (baseSchedule && policy.max_variance_percent) {
      const variance = ((overrideFormData.override_fee_amount - baseSchedule.base_fee_amount) / baseSchedule.base_fee_amount) * 100;
      if (Math.abs(variance) > policy.max_variance_percent) {
        alert(`Override exceeds maximum variance of ${policy.max_variance_percent}%`);
        return;
      }
    }

    const newOverride = {
      override_id: `OVR-${Date.now()}`,
      ...overrideFormData,
      requested_by: user?.id || "admin-003",
      approved_by: overrideFormData.approval_status === "Approved" ? user?.id : null,
      created_at: new Date().toISOString(),
      approved_at: overrideFormData.approval_status === "Approved" ? new Date().toISOString() : null,
    };
    setOverrides([...overrides, newOverride]);
    setShowCreateModal(false);
    setOverrideFormData({
      admin_unit_id: "",
      fee_schedule_id: "",
      override_fee_amount: 0,
      effective_from: new Date().toISOString().split("T")[0],
      effective_to: null,
      approval_status: "Draft",
    });
  };

  const handleUpdatePolicy = () => {
    setPolicy({ ...policy, ...overrideFormData });
    setShowPolicyModal(false);
  };

  const regions = mockAdminUnits.filter(u => u.admin_unit_type === "Region" && u.status === "Active");
  const activeFeeSchedules = mockFeeSchedules.filter(s => s.enabled && s.approval_status === "Approved");

  return (
    <div className="w-full space-y-6">
      {/* Section Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveSection("base-fees")}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeSection === "base-fees"
                  ? "border-[#88bf47] text-[#88bf47]"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <DollarSign className="h-4 w-4" />
              Base Fee Structure
            </button>
            <button
              onClick={() => setActiveSection("regional-overrides")}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeSection === "regional-overrides"
                  ? "border-[#88bf47] text-[#88bf47]"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <MapPin className="h-4 w-4" />
              Regional Overrides
            </button>
          </nav>
        </div>
      </div>

      {/* Base Fee Structure Section */}
      {activeSection === "base-fees" && (
        <div className="space-y-6">
      {/* Fee Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Base Fee Structure</h2>
            <p className="text-sm text-gray-600 mt-1">
              Set inspection fees by type and vehicle class
            </p>
          </div>
          <button
            onClick={handleAddFee}
            className="inline-flex items-center gap-2 rounded-lg bg-[#88bf47] text-white text-sm font-medium px-4 py-2 hover:bg-[#007c2d] transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Fee
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Inspection Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Vehicle Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Amount (ETB)
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fees.baseFees.map((fee) => (
                <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={fee.inspectionType}
                      onChange={(e) => handleFeeChange(fee.id, "inspectionType", e.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent"
                    >
                      {INSPECTION_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={fee.vehicleClass}
                      onChange={(e) => handleFeeChange(fee.id, "vehicleClass", e.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent"
                    >
                      {VEHICLE_CLASSES.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={fee.amount}
                        onChange={(e) => handleFeeChange(fee.id, "amount", e.target.value)}
                        className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent"
                      />
                      <span className="text-sm text-gray-600">ETB</span>
                      <span className="text-sm font-medium text-gray-900">
                        ({formatCurrency(fee.amount)})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleDeleteFee(fee.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete fee"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Partial Payment Rules Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Partial Payment Rules</h2>
          <p className="text-sm text-gray-600">
            Define fees for individual component retests. These apply when only specific components fail.
          </p>
        </div>

        <div className="space-y-4">
          {fees.partialPaymentRules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 bg-gray-50"
            >
              <span className="text-sm text-gray-700">IF</span>
              <span className="text-sm font-medium text-gray-900">[Component]</span>
              <span className="text-sm text-gray-700">is</span>
              <span className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-sm font-medium text-gray-900 min-w-[120px]">
                {rule.component}
              </span>
              <span className="text-sm text-gray-700">, THEN Fee is</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={rule.fee}
                  onChange={(e) => handleRuleFeeChange(rule.id, e.target.value)}
                  className="w-24 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent"
                />
                <span className="text-sm text-gray-600">ETB</span>
                <span className="text-sm font-medium text-gray-900">
                  ({formatCurrency(rule.fee)})
                </span>
              </div>
              <button
                onClick={() => handleDeleteRule(rule.id)}
                className="ml-auto p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete rule"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          {/* Add New Rule */}
          <div className="flex items-center gap-4 p-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
            <span className="text-sm text-gray-700">IF</span>
            <span className="text-sm font-medium text-gray-900">[Component]</span>
            <span className="text-sm text-gray-700">is</span>
            <select
              value={newRule.component}
              onChange={(e) => setNewRule({ ...newRule, component: e.target.value })}
              className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-sm font-medium text-gray-900 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent"
            >
              <option value="">Select component</option>
              {COMPONENTS.filter(
                (comp) => !fees.partialPaymentRules.some((r) => r.component === comp)
              ).map((comp) => (
                <option key={comp} value={comp}>
                  {comp}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">, THEN Fee is</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="10"
                value={newRule.fee}
                onChange={(e) => setNewRule({ ...newRule, fee: e.target.value })}
                placeholder="Amount"
                className="w-24 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent"
              />
              <span className="text-sm text-gray-600">ETB</span>
            </div>
            <button
              onClick={handleAddRule}
              disabled={!newRule.component || !newRule.fee}
              className="ml-auto inline-flex items-center gap-2 rounded-lg bg-[#88bf47] text-white text-sm font-medium px-4 py-1.5 hover:bg-[#007c2d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Rule
            </button>
          </div>
        </div>
      </div>

      {/* Tax Settings Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Tax Settings</h2>
          <p className="text-sm text-gray-600">Configure tax rates applied to inspection fees</p>
        </div>

        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">VAT Percentage (%)</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={fees.taxSettings.vatPercent}
              onChange={(e) => handleVATChange(e.target.value)}
              className="w-32 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent"
            />
            <span className="text-sm text-gray-600">%</span>
            <span className="text-sm text-gray-500">
              (Applied to all inspection fees)
            </span>
          </div>
        </div>
      </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-lg bg-[#88bf47] text-white px-6 py-2.5 text-sm font-medium hover:bg-[#007c2d] transition-colors shadow-sm"
            >
              <Save className="h-4 w-4" />
              Save Fee Structure
            </button>
          </div>
        </div>
      )}

      {/* Regional Overrides Section */}
      {activeSection === "regional-overrides" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Regional Fee Overrides</h2>
              <p className="text-gray-600">
                Allow or disallow regional fee overrides with policy controls
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPolicyModal(true)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Configure Policy
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                disabled={!policy.allowed}
                className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#007c2d] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Create Override
              </button>
            </div>
          </div>

          {/* Policy Status */}
          <div className={`rounded-lg p-4 ${
            policy.allowed ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {policy.allowed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`text-sm font-semibold ${
                    policy.allowed ? "text-green-800" : "text-red-800"
                  }`}>
                    Regional Overrides: {policy.allowed ? "Allowed" : "Not Allowed"}
                  </span>
                </div>
                {policy.allowed && (
                  <div className="text-sm text-green-700 space-y-1">
                    <p>• Allowed levels: {policy.allowed_levels.join(", ")}</p>
                    {policy.max_variance_percent && (
                      <p>• Max variance: {policy.max_variance_percent}%</p>
                    )}
                    <p>• Requires federal approval: {policy.requires_federal_approval ? "Yes" : "No"}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Overrides Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Regional Overrides</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Region</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Base Fee Schedule</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Override Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Variance</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {overrides.map(override => {
                    const baseSchedule = mockFeeSchedules.find(s => s.fee_schedule_id === override.fee_schedule_id);
                    const region = mockAdminUnits.find(u => u.admin_unit_id === override.admin_unit_id);
                    const variance = baseSchedule 
                      ? ((override.override_fee_amount - baseSchedule.base_fee_amount) / baseSchedule.base_fee_amount * 100).toFixed(1)
                      : 0;
                    
                    return (
                      <tr key={override.override_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {region ? region.admin_unit_name_en : override.admin_unit_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {baseSchedule ? `${baseSchedule.base_fee_amount} ETB` : override.fee_schedule_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {override.override_fee_amount.toLocaleString()} ETB
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${
                            parseFloat(variance) > 0 ? "text-green-600" : "text-red-600"
                          }`}>
                            {variance > 0 ? "+" : ""}{variance}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            override.approval_status === "Approved" ? "bg-green-100 text-green-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {override.approval_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setOverrideFormData({
                                admin_unit_id: override.admin_unit_id,
                                fee_schedule_id: override.fee_schedule_id,
                                override_fee_amount: override.override_fee_amount,
                                effective_from: override.effective_from?.split("T")[0] || "",
                                effective_to: override.effective_to?.split("T")[0] || "",
                                approval_status: override.approval_status,
                              });
                              setShowCreateModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Create Override Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Create Regional Override</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Region <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={overrideFormData.admin_unit_id}
                      onChange={(e) => setOverrideFormData({ ...overrideFormData, admin_unit_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                    >
                      <option value="">Select region...</option>
                      {regions.map(region => (
                        <option key={region.admin_unit_id} value={region.admin_unit_id}>
                          {region.admin_unit_name_en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Fee Schedule <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={overrideFormData.fee_schedule_id}
                      onChange={(e) => {
                        const schedule = activeFeeSchedules.find(s => s.fee_schedule_id === e.target.value);
                        setOverrideFormData({ 
                          ...overrideFormData, 
                          fee_schedule_id: e.target.value,
                          override_fee_amount: schedule ? schedule.base_fee_amount : 0,
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                    >
                      <option value="">Select fee schedule...</option>
                      {activeFeeSchedules.map(schedule => (
                        <option key={schedule.fee_schedule_id} value={schedule.fee_schedule_id}>
                          {schedule.base_fee_amount} ETB - {schedule.inspection_type_id} / {schedule.vehicle_class_id}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Override Fee Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={overrideFormData.override_fee_amount}
                      onChange={(e) => setOverrideFormData({ ...overrideFormData, override_fee_amount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                    />
                    {overrideFormData.fee_schedule_id && (
                      <p className="text-xs text-gray-500 mt-1">
                        Base: {activeFeeSchedules.find(s => s.fee_schedule_id === overrideFormData.fee_schedule_id)?.base_fee_amount || 0} ETB
                        {policy.max_variance_percent && ` | Max variance: ±${policy.max_variance_percent}%`}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Approval Status
                    </label>
                    <select
                      value={overrideFormData.approval_status}
                      onChange={(e) => setOverrideFormData({ ...overrideFormData, approval_status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Approved">Approved</option>
                    </select>
                    {policy.requires_federal_approval && (
                      <p className="text-xs text-yellow-600 mt-1">
                        ⚠️ Federal approval required
                      </p>
                    )}
                  </div>
                </div>
                <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setOverrideFormData({
                        admin_unit_id: "",
                        fee_schedule_id: "",
                        override_fee_amount: 0,
                        effective_from: new Date().toISOString().split("T")[0],
                        effective_to: null,
                        approval_status: "Draft",
                      });
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateOverride}
                    className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#007c2d] transition"
                  >
                    Create Override
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Policy Modal */}
          {showPolicyModal && (
            <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Override Policy Configuration</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={policy.allowed}
                        onChange={(e) => setPolicy({ ...policy, allowed: e.target.checked })}
                        className="rounded border-gray-300 text-[#88bf47] focus:ring-[#88bf47]"
                      />
                      <span className="text-sm font-medium text-gray-700">Allow Regional Overrides</span>
                    </label>
                  </div>

                  {policy.allowed && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Variance Percent (optional)
                        </label>
                        <input
                          type="number"
                          value={policy.max_variance_percent || ""}
                          onChange={(e) => setPolicy({ ...policy, max_variance_percent: parseFloat(e.target.value) || null })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                          placeholder="e.g., 20"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={policy.requires_federal_approval}
                            onChange={(e) => setPolicy({ ...policy, requires_federal_approval: e.target.checked })}
                            className="rounded border-gray-300 text-[#88bf47] focus:ring-[#88bf47]"
                          />
                          <span className="text-sm text-gray-700">Requires Federal Approval</span>
                        </label>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    onClick={() => setShowPolicyModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdatePolicy}
                    className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#007c2d] transition"
                  >
                    Save Policy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FeeStructure;



