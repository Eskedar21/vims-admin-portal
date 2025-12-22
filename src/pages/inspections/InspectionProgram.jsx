import { useState } from 'react';
import { FileText, Car, ClipboardCheck, AlertCircle, Settings, Eye } from 'lucide-react';
import InspectionTypes from './InspectionTypes';
import TestStandards from './TestStandards';
import ChecklistLibrary from './ChecklistLibrary';
import InspectionViewer from './InspectionViewer';
import VehicleClassMapping from './VehicleClassMapping';
import EvidenceRules from './EvidenceRules';

const TABS = [
  { id: 'types', label: 'Inspection Types', icon: FileText, component: InspectionTypes },
  { id: 'mapping', label: 'Vehicle Class Mapping', icon: Car, component: VehicleClassMapping },
  { id: 'standards', label: 'Test Standards', icon: Settings, component: TestStandards },
  { id: 'checklist', label: 'Checklist Library', icon: ClipboardCheck, component: ChecklistLibrary },
  { id: 'evidence', label: 'Evidence Rules', icon: AlertCircle, component: EvidenceRules },
];

function InspectionProgram() {
  const [activeTab, setActiveTab] = useState('types');

  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component || InspectionTypes;

  return (
    <div className="max-w-[1920px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Inspection Program Management
        </h1>
        <p className="text-gray-600">
          Define inspection types, test standards, checklists, and evidence rules
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#88bf47] text-[#88bf47]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Active Tab Content */}
      <ActiveComponent />
    </div>
  );
}

export default InspectionProgram;

