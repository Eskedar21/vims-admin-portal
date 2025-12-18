import { useState, useEffect } from "react";
import { mockFeeStructure, VEHICLE_CLASSES, INSPECTION_TYPES, COMPONENTS } from "../../data/mockFees";
import { Plus, Trash2, Save } from "lucide-react";

function FeeStructure() {
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

  const [newRule, setNewRule] = useState({
    component: "",
    fee: "",
  });

  // Save to localStorage whenever fees change
  useEffect(() => {
    localStorage.setItem("vims-fee-structure", JSON.stringify(fees));
  }, [fees]);

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

  return (
    <div className="w-full space-y-6">
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
            className="inline-flex items-center gap-2 rounded-lg bg-[#005f40] text-white text-sm font-medium px-4 py-2 hover:bg-[#004d33] transition-colors shadow-sm"
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
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent"
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
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent"
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
                        className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent"
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
                  className="w-24 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent"
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
              className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-sm font-medium text-gray-900 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent"
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
                className="w-24 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent"
              />
              <span className="text-sm text-gray-600">ETB</span>
            </div>
            <button
              onClick={handleAddRule}
              disabled={!newRule.component || !newRule.fee}
              className="ml-auto inline-flex items-center gap-2 rounded-lg bg-[#005f40] text-white text-sm font-medium px-4 py-1.5 hover:bg-[#004d33] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
              className="w-32 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent"
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
          className="inline-flex items-center gap-2 rounded-lg bg-[#005f40] text-white px-6 py-2.5 text-sm font-medium hover:bg-[#004d33] transition-colors shadow-sm"
        >
          <Save className="h-4 w-4" />
          Save Fee Structure
        </button>
      </div>
    </div>
  );
}

export default FeeStructure;



