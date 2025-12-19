import { useState } from 'react';
import { DollarSign, MapPin, Settings, AlertCircle, Receipt, FileText, TrendingUp, RefreshCw } from 'lucide-react';
import FeeStructure from './FeeStructure';
import RegionalOverrides from './RegionalOverrides';
import PaymentCollection from './PaymentCollection';
import Reconciliation from './Reconciliation';

// Placeholder components for remaining features
function RetestRules() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Retest Component Rules</h1>
        <p className="text-gray-600">Define retest pricing per component</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Retest Component Rules interface coming soon</p>
      </div>
    </div>
  );
}

function FeeExceptions() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fee Exceptions</h1>
        <p className="text-gray-600">Manage fee waivers and manual adjustments with approval</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Fee Exceptions interface coming soon</p>
      </div>
    </div>
  );
}

function TaxSettings() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">VAT / Tax Settings</h1>
        <p className="text-gray-600">Configure VAT % and fee application rules</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Tax Settings interface coming soon</p>
      </div>
    </div>
  );
}

function PaymentMonitoring() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failure Monitoring</h1>
        <p className="text-gray-600">Monitor payment failures and provider outages</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Payment Monitoring interface coming soon</p>
      </div>
    </div>
  );
}

function Refunds() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Refunds & Chargebacks</h1>
        <p className="text-gray-600">Process refunds/chargebacks with approval</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <RefreshCw className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Refunds interface coming soon</p>
      </div>
    </div>
  );
}

function FinancialSummaries() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Summaries</h1>
        <p className="text-gray-600">Daily/monthly financial summaries and reports</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Financial Summaries interface coming soon</p>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'fee-structure', label: 'Fee Structure', icon: DollarSign, component: FeeStructure },
  { id: 'overrides', label: 'Regional Overrides', icon: MapPin, component: RegionalOverrides },
  { id: 'retest-rules', label: 'Retest Rules', icon: Settings, component: RetestRules },
  { id: 'exceptions', label: 'Fee Exceptions', icon: AlertCircle, component: FeeExceptions },
  { id: 'tax-settings', label: 'Tax Settings', icon: DollarSign, component: TaxSettings },
  { id: 'payment-collection', label: 'Payment Collection', icon: Receipt, component: PaymentCollection },
  { id: 'payment-monitoring', label: 'Payment Monitoring', icon: AlertCircle, component: PaymentMonitoring },
  { id: 'reconciliation', label: 'Reconciliation', icon: RefreshCw, component: Reconciliation },
  { id: 'refunds', label: 'Refunds', icon: RefreshCw, component: Refunds },
  { id: 'summaries', label: 'Financial Summaries', icon: FileText, component: FinancialSummaries },
];

function FeesPayments() {
  const [activeTab, setActiveTab] = useState('fee-structure');

  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component || FeeStructure;

  return (
    <div className="max-w-[1920px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Fees, Payments & Financial Controls
        </h1>
        <p className="text-gray-600">
          Manage fee structures, payments, reconciliation, and financial reporting
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

export default FeesPayments;






