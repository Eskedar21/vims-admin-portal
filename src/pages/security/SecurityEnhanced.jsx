import { useState } from 'react';
import { Shield, FileText, LogIn, AlertTriangle, Settings, Network, Users, Download, Eye, Search } from 'lucide-react';
import AuditLogs from './AuditLogs';

// Placeholder components
function LifecycleLogs() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inspection Lifecycle Logs</h1>
        <p className="text-gray-600">Chain of custody logs for inspection records</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Lifecycle Logs interface coming soon</p>
      </div>
    </div>
  );
}

function AccessLogs() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Logs</h1>
        <p className="text-gray-600">Authentication and session access logs</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <LogIn className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Access Logs interface coming soon</p>
      </div>
    </div>
  );
}

function SecurityAlerts() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Alerts</h1>
        <p className="text-gray-600">Automated security alerts and suspicious behavior detection</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Security Alerts interface coming soon</p>
      </div>
    </div>
  );
}

function SecurityPolicies() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Policies</h1>
        <p className="text-gray-600">Password, MFA, and session policy management</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Security Policies interface coming soon</p>
      </div>
    </div>
  );
}

function IPPolicies() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">IP Allowlist/Denylist</h1>
        <p className="text-gray-600">Network access control via IP policies</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Network className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">IP Policies interface coming soon</p>
      </div>
    </div>
  );
}

function SessionControls() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Session Controls</h1>
        <p className="text-gray-600">Monitor and manage active user sessions</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Session Controls interface coming soon</p>
      </div>
    </div>
  );
}

function ExportGovernance() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Export Governance</h1>
        <p className="text-gray-600">Govern export requests, approvals, and audit logs</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Download className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Export Governance interface coming soon</p>
      </div>
    </div>
  );
}

function DataClassification() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Classification</h1>
        <p className="text-gray-600">Field-level protection and classification rules</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Data Classification interface coming soon</p>
      </div>
    </div>
  );
}

function AuditReviewTools() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Review Tools</h1>
        <p className="text-gray-600">Advanced filters, saved views, and tamper evidence</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Audit Review Tools interface coming soon</p>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'audit-logs', label: 'Audit Logs', icon: FileText, component: AuditLogs },
  { id: 'lifecycle-logs', label: 'Lifecycle Logs', icon: FileText, component: LifecycleLogs },
  { id: 'access-logs', label: 'Access Logs', icon: LogIn, component: AccessLogs },
  { id: 'security-alerts', label: 'Security Alerts', icon: AlertTriangle, component: SecurityAlerts },
  { id: 'security-policies', label: 'Security Policies', icon: Settings, component: SecurityPolicies },
  { id: 'ip-policies', label: 'IP Policies', icon: Network, component: IPPolicies },
  { id: 'sessions', label: 'Session Controls', icon: Users, component: SessionControls },
  { id: 'export-governance', label: 'Export Governance', icon: Download, component: ExportGovernance },
  { id: 'data-classification', label: 'Data Classification', icon: Eye, component: DataClassification },
  { id: 'audit-review', label: 'Audit Review Tools', icon: Search, component: AuditReviewTools },
];

function SecurityEnhanced() {
  const [activeTab, setActiveTab] = useState('audit-logs');

  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component || AuditLogs;

  return (
    <div className="max-w-[1920px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Security, Audit & Data Governance
        </h1>
        <p className="text-gray-600">
          Immutable audit logs, access controls, security alerts, and export governance
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

export default SecurityEnhanced;






