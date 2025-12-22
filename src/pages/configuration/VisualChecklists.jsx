import { useState, useEffect } from "react";
import { mockChecklistConfig } from "../../data/mockChecklistConfig";
import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";

function VisualChecklists() {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem("vims-checklist-config");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return mockChecklistConfig;
      }
    }
    return mockChecklistConfig;
  });

  const [selectedClass, setSelectedClass] = useState(config[0]?.class || "");
  const [expandedCategories, setExpandedCategories] = useState(
    new Set(config[0]?.categories.map((c) => c.name) || [])
  );
  const [newItemInputs, setNewItemInputs] = useState({});

  // Save to localStorage whenever config changes
  useEffect(() => {
    localStorage.setItem("vims-checklist-config", JSON.stringify(config));
  }, [config]);

  const selectedClassData = config.find((c) => c.class === selectedClass);

  const toggleCategory = (categoryName) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName);
      } else {
        newSet.add(categoryName);
      }
      return newSet;
    });
  };

  const handleDeleteItem = (categoryName, itemName) => {
    setConfig((prev) =>
      prev.map((vehicleClass) => {
        if (vehicleClass.class !== selectedClass) return vehicleClass;

        return {
          ...vehicleClass,
          categories: vehicleClass.categories.map((cat) => {
            if (cat.name !== categoryName) return cat;

            return {
              ...cat,
              items: cat.items.filter((item) => item.name !== itemName),
            };
          }),
        };
      })
    );
  };

  const handleTogglePhotoRequired = (categoryName, itemName) => {
    setConfig((prev) =>
      prev.map((vehicleClass) => {
        if (vehicleClass.class !== selectedClass) return vehicleClass;

        return {
          ...vehicleClass,
          categories: vehicleClass.categories.map((cat) => {
            if (cat.name !== categoryName) return cat;

            return {
              ...cat,
              items: cat.items.map((item) =>
                item.name === itemName
                  ? { ...item, photoRequiredOnFail: !item.photoRequiredOnFail }
                  : item
              ),
            };
          }),
        };
      })
    );
  };

  const handleAddItem = (categoryName) => {
    const newItemName = newItemInputs[categoryName]?.trim();
    if (!newItemName) return;

    setConfig((prev) =>
      prev.map((vehicleClass) => {
        if (vehicleClass.class !== selectedClass) return vehicleClass;

        return {
          ...vehicleClass,
          categories: vehicleClass.categories.map((cat) => {
            if (cat.name !== categoryName) return cat;

            // Check if item already exists
            if (cat.items.some((item) => item.name === newItemName)) {
              return cat;
            }

            return {
              ...cat,
              items: [
                ...cat.items,
                { name: newItemName, photoRequiredOnFail: false },
              ],
            };
          }),
        };
      })
    );

    // Clear input
    setNewItemInputs((prev) => ({
      ...prev,
      [categoryName]: "",
    }));
  };

  const handleClassChange = (className) => {
    setSelectedClass(className);
    const classData = config.find((c) => c.class === className);
    if (classData) {
      setExpandedCategories(new Set(classData.categories.map((c) => c.name)));
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Class Selector - Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-900">Vehicle Classes</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {config.map((vehicleClass) => (
                <button
                  key={vehicleClass.class}
                  onClick={() => handleClassChange(vehicleClass.class)}
                  className={`w-full px-4 py-3 text-left transition-colors ${
                    selectedClass === vehicleClass.class
                      ? "bg-[#88bf47] text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-sm font-medium">{vehicleClass.class}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-3">
          {selectedClassData ? (
            <div className="space-y-4">
              {selectedClassData.categories.map((category) => {
                const isExpanded = expandedCategories.has(category.name);

                return (
                  <div
                    key={category.name}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                  >
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(category.name)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="text-base font-semibold text-gray-900">
                        {category.name}
                      </h3>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>

                    {/* Category Content */}
                    {isExpanded && (
                      <div className="px-6 py-4 border-t border-gray-200 space-y-3">
                        {category.items.length > 0 ? (
                          category.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center gap-4 flex-1">
                                <span className="text-sm font-medium text-gray-900">
                                  {item.name}
                                </span>
                                <div className="flex items-center gap-2">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <span className="text-xs text-gray-600">
                                      Photo Required on Fail?
                                    </span>
                                    <div className="relative">
                                      <input
                                        type="checkbox"
                                        checked={item.photoRequiredOnFail}
                                        onChange={() =>
                                          handleTogglePhotoRequired(category.name, item.name)
                                        }
                                        className="sr-only"
                                      />
                                      <div
                                        className={`w-11 h-6 rounded-full transition-colors ${
                                          item.photoRequiredOnFail
                                            ? "bg-[#88bf47]"
                                            : "bg-[#fcd34d]"
                                        }`}
                                      >
                                        <div
                                          className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                                            item.photoRequiredOnFail
                                              ? "translate-x-5"
                                              : "translate-x-0.5"
                                          } mt-0.5`}
                                        />
                                      </div>
                                    </div>
                                  </label>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteItem(category.name, item.name)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No items in this category
                          </p>
                        )}

                        {/* Add Item Section */}
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Enter new item name"
                              value={newItemInputs[category.name] || ""}
                              onChange={(e) =>
                                setNewItemInputs((prev) => ({
                                  ...prev,
                                  [category.name]: e.target.value,
                                }))
                              }
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  handleAddItem(category.name);
                                }
                              }}
                              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                            />
                            <button
                              onClick={() => handleAddItem(category.name)}
                              className="inline-flex items-center gap-2 rounded-lg bg-[#88bf47] text-white text-sm font-medium px-4 py-2 hover:bg-[#0fa84a] transition-colors shadow-sm"
                            >
                              <Plus className="h-4 w-4" />
                              Add Item
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-600">Select a vehicle class to configure checklists</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VisualChecklists;

