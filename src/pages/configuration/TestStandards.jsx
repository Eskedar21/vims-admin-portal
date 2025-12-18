import { useState, useEffect } from "react";
import { mockStandards } from "../../data/mockStandards";
import { Save, Send, Settings } from "lucide-react";

function TestStandards() {
  const [standards, setStandards] = useState(() => {
    // Load from localStorage if available, otherwise use mock data
    const saved = localStorage.getItem("vims-test-standards");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return mockStandards;
      }
    }
    return mockStandards;
  });

  const [selectedClassId, setSelectedClassId] = useState(standards[0]?.id || null);

  // Save to localStorage whenever standards change
  useEffect(() => {
    localStorage.setItem("vims-test-standards", JSON.stringify(standards));
  }, [standards]);

  const selectedClass = standards.find((c) => c.id === selectedClassId);

  const handleParameterChange = (testTypeId, parameterId, value) => {
    setStandards((prev) =>
      prev.map((vehicleClass) => {
        if (vehicleClass.id !== selectedClassId) return vehicleClass;

        return {
          ...vehicleClass,
          testTypes: vehicleClass.testTypes.map((testType) => {
            if (testType.id !== testTypeId) return testType;

            return {
              ...testType,
              parameters: testType.parameters.map((param) =>
                param.id === parameterId
                  ? { ...param, threshold: Number(value) }
                  : param
              ),
            };
          }),
        };
      })
    );
  };

  const handleSave = () => {
    // Save changes (already saved to localStorage via useEffect)
    alert("Test standards saved successfully!");
  };

  const handlePublish = () => {
    // Save and publish
    handleSave();
    alert("Test standards published and are now active!");
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Vehicle Classes */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-900">Vehicle Classes</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {standards.map((vehicleClass) => (
                <button
                  key={vehicleClass.id}
                  onClick={() => setSelectedClassId(vehicleClass.id)}
                  className={`w-full px-4 py-3 text-left transition-colors ${
                    selectedClassId === vehicleClass.id
                      ? "bg-blue-50 text-blue-900 border-l-4 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="text-sm font-medium">{vehicleClass.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Test Parameters Form */}
        <div className="lg:col-span-3">
          {selectedClass ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedClass.name} - Test Parameters
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Configure pass/fail thresholds for each test type
                </p>
              </div>

              <div className="p-6 space-y-8">
                {selectedClass.testTypes.map((testType) => (
                  <div key={testType.id} className="space-y-4">
                    <div className="border-b border-gray-200 pb-2">
                      <h3 className="text-base font-semibold text-gray-900">
                        {testType.name}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {testType.parameters.map((parameter) => (
                        <div key={parameter.id} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            {parameter.name}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={parameter.min}
                              max={parameter.max}
                              step={parameter.step}
                              value={parameter.threshold}
                              onChange={(e) =>
                                handleParameterChange(
                                  testType.id,
                                  parameter.id,
                                  e.target.value
                                )
                              }
                              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                            />
                            <span className="text-sm text-gray-600 w-12">
                              {parameter.unit}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            Range: {parameter.min} - {parameter.max} {parameter.unit}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handlePublish}
                    className="inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                  >
                    <Send className="h-4 w-4" />
                    Save & Publish
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select a vehicle class to configure test standards</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TestStandards;

