import { useState } from 'react';
import { Settings, Link, Key, Activity, FileText, Database, RotateCcw, ToggleLeft, BookOpen, Calendar, HelpCircle } from 'lucide-react';
import IntegrationRegistry from './IntegrationRegistry';

// Placeholder components
function CredentialsManagement() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">API Keys & Secrets</h1>
        <p className="text-gray-600">Secure credential management without exposing secrets</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Key className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Credentials Management interface coming soon</p>
      </div>
    </div>
  );
}

function Webhooks() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Webhooks & Event Subscriptions</h1>
        <p className="text-gray-600">Configure outbound notifications for partner systems</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Link className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Webhooks interface coming soon</p>
      </div>
    </div>
  );
}

function IntegrationHealth() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Integration Health Dashboard</h1>
        <p className="text-gray-600">Monitor integration status, latency, and failures</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Integration Health Dashboard coming soon</p>
      </div>
    </div>
  );
}

function SystemLogs() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Logs</h1>
        <p className="text-gray-600">Centralized logs viewer with filters and search</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">System Logs interface coming soon</p>
      </div>
    </div>
  );
}

function BackupManagement() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Backup Management</h1>
        <p className="text-gray-600">Configure backup schedules and monitor status</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Backup Management interface coming soon</p>
      </div>
    </div>
  );
}

function RestoreTesting() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Restore Testing</h1>
        <p className="text-gray-600">Execute and log restore tests for compliance</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <RotateCcw className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Restore Testing interface coming soon</p>
      </div>
    </div>
  );
}

function SystemConfiguration() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Configuration</h1>
        <p className="text-gray-600">Manage environment settings and feature toggles</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <ToggleLeft className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">System Configuration interface coming soon</p>
      </div>
    </div>
  );
}

function ReleaseManagement() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Release Management</h1>
        <p className="text-gray-600">Release notes and controlled deployment workflows</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Release Management interface coming soon</p>
      </div>
    </div>
  );
}

function MaintenanceWindows() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Maintenance Windows</h1>
        <p className="text-gray-600">Schedule and communicate planned downtime</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Maintenance Windows interface coming soon</p>
      </div>
    </div>
  );
}

function Helpdesk() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Helpdesk Tickets</h1>
        <p className="text-gray-600">Track and resolve operational support requests</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Helpdesk interface coming soon</p>
      </div>
    </div>
  );
}

function KnowledgeBase() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Knowledge Base</h1>
        <p className="text-gray-600">SOPs, troubleshooting guides, and operational documentation</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Knowledge Base interface coming soon</p>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'integrations', label: 'Integration Registry', icon: Link, component: IntegrationRegistry },
  { id: 'credentials', label: 'API Keys & Secrets', icon: Key, component: CredentialsManagement },
  { id: 'webhooks', label: 'Webhooks', icon: Link, component: Webhooks },
  { id: 'health', label: 'Integration Health', icon: Activity, component: IntegrationHealth },
  { id: 'logs', label: 'System Logs', icon: FileText, component: SystemLogs },
  { id: 'backups', label: 'Backup Management', icon: Database, component: BackupManagement },
  { id: 'restore', label: 'Restore Testing', icon: RotateCcw, component: RestoreTesting },
  { id: 'config', label: 'System Configuration', icon: ToggleLeft, component: SystemConfiguration },
  { id: 'releases', label: 'Release Management', icon: Calendar, component: ReleaseManagement },
  { id: 'maintenance', label: 'Maintenance Windows', icon: Calendar, component: MaintenanceWindows },
  { id: 'helpdesk', label: 'Helpdesk', icon: HelpCircle, component: Helpdesk },
  { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen, component: KnowledgeBase },
];

function SystemAdministration() {
  const [activeTab, setActiveTab] = useState('integrations');

  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component || IntegrationRegistry;

  return (
    <div className="max-w-[1920px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          System Administration & Maintenance
        </h1>
        <p className="text-gray-600">
          Integration management, backups, configuration, and operational support tools
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

export default SystemAdministration;






