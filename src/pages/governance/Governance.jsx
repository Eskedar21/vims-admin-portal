import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2, Users, Handshake } from 'lucide-react';
import AdministrationUnits from './AdministrationUnits';
import Assignments from './Assignments';
import Institutions from './Institutions';
import Relationships from './Relationships';

const TABS = [
  { id: 'units', label: 'Administration Units', icon: Building2, route: '/governance/units', component: AdministrationUnits },
  { id: 'assignments', label: 'Assignments', icon: Users, route: '/governance/assignments', component: Assignments },
  { id: 'institutions', label: 'Institutions', icon: Building2, route: '/governance/institutions', component: Institutions },
  { id: 'relationships', label: 'Relationships', icon: Handshake, route: '/governance/relationships', component: Relationships },
];

function Governance() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get active tab from URL
  const getActiveTab = () => {
    const path = location.pathname;
    // Handle base /governance route
    if (path === '/governance' || path === '/governance/') {
      return 'units';
    }
    const tab = TABS.find(t => path === t.route || path.startsWith(t.route + '/'));
    return tab ? tab.id : 'units';
  };

  const activeTab = getActiveTab();

  // Get the active component based on the current route
  const getActiveComponent = () => {
    const tab = TABS.find(t => t.id === activeTab);
    return tab ? tab.component : AdministrationUnits;
  };

  const ActiveComponent = getActiveComponent();

  // Redirect /governance to /governance/units
  useEffect(() => {
    if (location.pathname === '/governance' || location.pathname === '/governance/') {
      navigate('/governance/units', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Show loading while redirecting
  if (location.pathname === '/governance' || location.pathname === '/governance/') {
    return null;
  }

  return (
    <div className="w-full">
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
                  onClick={() => navigate(tab.route)}
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

