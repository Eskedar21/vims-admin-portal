import { useState } from "react";
import { Routes, Route, useNavigate, useLocation, NavLink } from "react-router-dom";
import TestStandards from "./TestStandards";
import VisualChecklists from "./VisualChecklists";
import FeeStructure from "./FeeStructure";
import { Settings, FileText, ListChecks, DollarSign } from "lucide-react";

function Configuration() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { id: "test-standards", label: "Test Standards", path: "/configuration", icon: FileText },
    {
      id: "visual-checklists",
      label: "Visual Checklists",
      path: "/configuration/visual-checklists",
      icon: ListChecks,
    },
    {
      id: "fee-structure",
      label: "Fee & Payment",
      path: "/configuration/fee-structure",
      icon: DollarSign,
    },
  ];

  // Determine active tab based on current path
  const getActiveTab = () => {
    const path = location.pathname;
    // Check if path exactly matches a tab path
    const exactMatch = tabs.find(tab => path === tab.path);
    if (exactMatch) return exactMatch.id;
    
    // Check if path starts with a tab path (for nested routes)
    const startsWithMatch = tabs.find(tab => tab.path !== "/configuration" && path.startsWith(tab.path));
    if (startsWithMatch) return startsWithMatch.id;
    
    // Default to first tab if path is exactly "/configuration"
    return tabs[0].id;
  };
  
  const activeTab = getActiveTab();

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuration</h1>
        <p className="text-gray-600">
          Configure test standards and visual inspection checklists for vehicle classes.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.path)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? "border-[#009639] text-[#009639]"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <Routes>
        <Route path="/" element={<TestStandards />} />
        <Route path="/visual-checklists" element={<VisualChecklists />} />
        <Route path="/fee-structure" element={<FeeStructure />} />
      </Routes>
    </div>
  );
}

export default Configuration;

