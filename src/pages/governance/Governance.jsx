import { useState } from 'react';
import { Building2, Users, Handshake, FileCheck, Search, Settings } from 'lucide-react';
import AdministrationUnits from './AdministrationUnits';
import Assignments from './Assignments';
import Institutions from './Institutions';
import Relationships from './Relationships';
import ChangeRequests from './ChangeRequests';
import GovernanceReports from './GovernanceReports';

const TABS = [
  { id: 'units', label: 'Administration Units', icon: Building2, component: AdministrationUnits },
  { id: 'assignments', label: 'Assignments', icon: Users, component: Assignments },
  { id: 'institutions', label: 'Institutions', icon: Building2, component: Institutions },
  { id: 'relationships', label: 'Relationships', icon: Handshake, component: Relationships },
  { id: 'change-requests', label: 'Change Control', icon: FileCheck, component: ChangeRequests },
  { id: 'reports', label: 'Search & Reports', icon: Search, component: GovernanceReports },
];

function Governance() {
  const [activeTab, setActiveTab] = useState('units');

  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component || AdministrationUnits;

  return (
    <div className="max-w-[1920px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Governance Structure
        </h1>
        <p className="text-gray-600">
          Manage government hierarchy, institutions, assignments, and relationships
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

export default Governance;

