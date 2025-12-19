import { useState } from 'react';
import { Search, FileText, AlertCircle, Share2, BarChart3 } from 'lucide-react';
import InspectionSearch from './InspectionSearch';
import EnforcementCases from './EnforcementCases';

// Placeholder components
function EvidenceBundles() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Evidence Bundles</h1>
        <p className="text-gray-600">Generate export-controlled evidence bundles for cases</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Evidence Bundles interface coming soon</p>
      </div>
    </div>
  );
}

function InterAgencySharing() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inter-Agency Sharing</h1>
        <p className="text-gray-600">Controlled sharing of case bundles with RSIFS/Police</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Share2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Inter-Agency Sharing interface coming soon</p>
      </div>
    </div>
  );
}

function CaseReporting() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Case Reporting</h1>
        <p className="text-gray-600">Search, dashboards, and reporting for enforcement cases</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Case Reporting interface coming soon</p>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'search', label: 'Inspection Search', icon: Search, component: InspectionSearch },
  { id: 'cases', label: 'Enforcement Cases', icon: AlertCircle, component: EnforcementCases },
  { id: 'bundles', label: 'Evidence Bundles', icon: FileText, component: EvidenceBundles },
  { id: 'sharing', label: 'Inter-Agency Sharing', icon: Share2, component: InterAgencySharing },
  { id: 'reporting', label: 'Case Reporting', icon: BarChart3, component: CaseReporting },
];

function Casework() {
  const [activeTab, setActiveTab] = useState('search');

  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component || InspectionSearch;

  return (
    <div className="max-w-[1920px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Inspection Records & Casework
        </h1>
        <p className="text-gray-600">
          National search, enforcement cases, evidence bundles, and inter-agency sharing
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
                      ? 'border-[#009639] text-[#009639]'
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

export default Casework;






