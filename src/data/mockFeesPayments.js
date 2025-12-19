// Mock data for EPIC 5 - Fees, Payments & Financial Controls
// Fee Schedules, Payments, Reconciliation, Refunds, Tax Policies

import { mockInspectionTypes } from './mockInspectionProgram';
import { mockVehicleClasses } from './mockInspectionProgram';

// Fee Schedules
export const mockFeeSchedules = [
  {
    fee_schedule_id: 'FEE-001',
    inspection_type_id: 'TYPE-001',
    vehicle_class_id: 'VC-001',
    base_fee_amount: 500,
    currency: 'ETB',
    enabled: true,
    effective_from: '2020-01-01T00:00:00Z',
    effective_to: null,
    version: '1.0',
    approval_status: 'Approved',
    created_by: 'admin-001',
    approved_by: 'admin-002',
    created_at: '2020-01-01T00:00:00Z',
    approved_at: '2020-01-05T00:00:00Z',
    notes: 'Standard initial inspection fee for private cars',
  },
  {
    fee_schedule_id: 'FEE-002',
    inspection_type_id: 'TYPE-001',
    vehicle_class_id: 'VC-002',
    base_fee_amount: 800,
    currency: 'ETB',
    enabled: true,
    effective_from: '2020-01-01T00:00:00Z',
    effective_to: null,
    version: '1.0',
    approval_status: 'Approved',
    created_by: 'admin-001',
    approved_by: 'admin-002',
    created_at: '2020-01-01T00:00:00Z',
    approved_at: '2020-01-05T00:00:00Z',
    notes: 'Standard initial inspection fee for trucks',
  },
  {
    fee_schedule_id: 'FEE-003',
    inspection_type_id: 'TYPE-002',
    vehicle_class_id: 'VC-001',
    base_fee_amount: 300,
    currency: 'ETB',
    enabled: true,
    effective_from: '2020-01-01T00:00:00Z',
    effective_to: null,
    version: '1.0',
    approval_status: 'Approved',
    created_by: 'admin-001',
    approved_by: 'admin-002',
    created_at: '2020-01-01T00:00:00Z',
    approved_at: '2020-01-05T00:00:00Z',
    notes: 'Retest fee for private cars',
  },
];

// Regional Fee Override Policy
export const mockOverridePolicy = {
  override_policy_id: 'POL-001',
  allowed: true,
  allowed_levels: ['Region'],
  max_variance_percent: 20,
  requires_federal_approval: true,
  created_by: 'admin-001',
  created_at: '2020-01-01T00:00:00Z',
};

// Regional Overrides
export const mockRegionalOverrides = [
  {
    override_id: 'OVR-001',
    admin_unit_id: 'AU-OROMIA',
    fee_schedule_id: 'FEE-001',
    override_fee_amount: 550,
    effective_from: '2024-01-01T00:00:00Z',
    effective_to: null,
    approval_status: 'Approved',
    requested_by: 'admin-003',
    approved_by: 'admin-001',
    created_at: '2023-12-15T00:00:00Z',
    approved_at: '2023-12-20T00:00:00Z',
  },
];

// Retest Component Rules
export const mockRetestRules = [
  {
    retest_rule_id: 'RET-001',
    component: 'Brakes',
    vehicle_class_id: 'VC-001',
    retest_fee_amount: 100,
    rule_conditions: 'only if failed component',
    enabled: true,
    effective_from: '2020-01-01T00:00:00Z',
    effective_to: null,
    version: '1.0',
    approval_status: 'Approved',
  },
  {
    retest_rule_id: 'RET-002',
    component: 'Emissions',
    vehicle_class_id: 'VC-001',
    retest_fee_amount: 150,
    rule_conditions: 'only if failed component',
    enabled: true,
    effective_from: '2020-01-01T00:00:00Z',
    effective_to: null,
    version: '1.0',
    approval_status: 'Approved',
  },
  {
    retest_rule_id: 'RET-003',
    component: 'Suspension',
    vehicle_class_id: 'VC-001',
    retest_fee_amount: 120,
    rule_conditions: 'only if failed component',
    enabled: true,
    effective_from: '2020-01-01T00:00:00Z',
    effective_to: null,
    version: '1.0',
    approval_status: 'Approved',
  },
];

// Fee Exceptions
export const mockFeeExceptions = [
  {
    fee_exception_id: 'EXC-001',
    inspection_id: 'INS-001',
    center_id: 'CTR-001',
    exception_type: 'Waiver',
    requested_amount: 0,
    new_amount: 0,
    reason_code: 'GOVT_VEHICLE',
    reason_text: 'Government vehicle - fee waived per policy',
    requested_by_user_id: 'U-002',
    approval_required: true,
    approval_status: 'Approved',
    approved_by_user_id: 'admin-001',
    approved_at: new Date(Date.now() - 86400000).toISOString(),
    audit_ref: 'AUD-001',
  },
  {
    fee_exception_id: 'EXC-002',
    inspection_id: 'INS-002',
    center_id: 'CTR-002',
    exception_type: 'Discount',
    requested_amount: 400,
    new_amount: 300,
    reason_code: 'PROMOTION',
    reason_text: 'Promotional discount - first time customer',
    requested_by_user_id: 'U-002',
    approval_required: true,
    approval_status: 'Pending',
    approved_by_user_id: null,
    approved_at: null,
    audit_ref: null,
  },
];

// VAT / Tax Settings
export const mockTaxPolicies = [
  {
    tax_policy_id: 'TAX-001',
    vat_percent: 15,
    tax_inclusive: false,
    applies_to: 'all',
    effective_from: '2020-01-01T00:00:00Z',
    effective_to: null,
    version: '1.0',
    approval_status: 'Approved',
    created_by: 'admin-001',
    approved_by: 'admin-002',
    created_at: '2020-01-01T00:00:00Z',
    approved_at: '2020-01-05T00:00:00Z',
  },
];

// Payment Transactions
export const mockPayments = [
  {
    payment_id: 'PAY-001',
    inspection_id: 'INS-001',
    center_id: 'CTR-001',
    payer_reference: 'PLATE-3-12345-AA',
    amount_due: 575, // 500 base + 15% VAT
    amount_paid: 575,
    currency: 'ETB',
    payment_method: 'TeleBirr',
    provider: 'TeleBirr',
    provider_txn_id: 'TEL-2024-001234',
    payment_status: 'Paid',
    paid_at: new Date(Date.now() - 3600000).toISOString(),
    collected_by_user_id: 'U-002',
    receipt_number: 'RCP-2024-001234',
    receipt_print_count: 1,
    fee_schedule_version: '1.0',
    tax_policy_version: '1.0',
  },
  {
    payment_id: 'PAY-002',
    inspection_id: 'INS-002',
    center_id: 'CTR-002',
    payer_reference: 'PLATE-3-12346-AA',
    amount_due: 300,
    amount_paid: 0,
    currency: 'ETB',
    payment_method: 'Cash',
    provider: null,
    provider_txn_id: null,
    payment_status: 'Unpaid',
    paid_at: null,
    collected_by_user_id: null,
    receipt_number: null,
    receipt_print_count: 0,
    fee_schedule_version: '1.0',
    tax_policy_version: '1.0',
  },
  {
    payment_id: 'PAY-003',
    inspection_id: 'INS-003',
    center_id: 'CTR-001',
    payer_reference: 'PLATE-3-12347-AA',
    amount_due: 345, // 300 base + 15% VAT
    amount_paid: 345,
    currency: 'ETB',
    payment_method: 'TeleBirr',
    provider: 'TeleBirr',
    provider_txn_id: 'TEL-2024-001235',
    payment_status: 'Failed',
    paid_at: null,
    collected_by_user_id: null,
    receipt_number: null,
    receipt_print_count: 0,
    fee_schedule_version: '1.0',
    tax_policy_version: '1.0',
  },
];

// Payment Provider Status
export const mockProviderStatus = {
  provider: 'TeleBirr',
  status: 'OK',
  failure_rate_percent: 2.5,
  failed_transactions_count: 5,
  avg_confirmation_delay_seconds: 3.2,
  centers_affected_count: 0,
  incident_id: null,
  last_updated: new Date().toISOString(),
};

// Reconciliation Records
export const mockReconciliations = [
  {
    recon_id: 'REC-001',
    center_id: 'CTR-001',
    date: new Date().toISOString().split('T')[0],
    inspections_count: 45,
    expected_total_amount: 25875,
    received_total_amount: 25875,
    variance_amount: 0,
    variance_percent: 0,
    breakdown: {
      Cash: { count: 10, amount: 5750 },
      TeleBirr: { count: 35, amount: 20125 },
    },
    prepared_by_user_id: 'U-003',
    approved_by_user_id: 'admin-001',
    status: 'Closed',
    created_at: new Date().toISOString(),
    approved_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    recon_id: 'REC-002',
    center_id: 'CTR-002',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    inspections_count: 32,
    expected_total_amount: 18400,
    received_total_amount: 18000,
    variance_amount: -400,
    variance_percent: -2.17,
    breakdown: {
      Cash: { count: 15, amount: 8625 },
      TeleBirr: { count: 17, amount: 9375 },
    },
    prepared_by_user_id: 'U-004',
    approved_by_user_id: null,
    status: 'Open',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    approved_at: null,
  },
];

// Refunds
export const mockRefunds = [
  {
    refund_id: 'REF-001',
    payment_id: 'PAY-001',
    amount_refunded: 575,
    reason_code: 'DUPLICATE_PAYMENT',
    reason_text: 'Duplicate payment detected and refunded',
    requested_by: 'U-002',
    approved_by: 'admin-001',
    provider_refund_txn_id: 'TEL-REF-2024-001',
    refund_status: 'Processed',
    processed_at: new Date(Date.now() - 172800000).toISOString(),
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

// Financial Summaries
export const mockFinancialSummaries = [
  {
    summary_id: 'SUM-001',
    scope_applied: 'National',
    period: 'Daily',
    date_from: new Date().toISOString().split('T')[0],
    date_to: new Date().toISOString().split('T')[0],
    total_revenue: 125000,
    breakdown_by_inspection_type: {
      'Initial': { count: 150, revenue: 90000 },
      'Retest': { count: 80, revenue: 35000 },
    },
    breakdown_by_payment_method: {
      Cash: { count: 60, revenue: 40000 },
      TeleBirr: { count: 170, revenue: 85000 },
    },
    refunds_total: 575,
    exceptions_total: 0,
    reconciliation_variances: { count: 1, total: -400 },
    generated_at: new Date().toISOString(),
    generated_by: 'admin-001',
  },
];

// Helper functions
export function calculateFeeWithVAT(baseFee, vatPercent, taxInclusive = false) {
  if (taxInclusive) {
    return {
      base: baseFee / (1 + vatPercent / 100),
      vat: baseFee - (baseFee / (1 + vatPercent / 100)),
      total: baseFee,
    };
  } else {
    return {
      base: baseFee,
      vat: baseFee * (vatPercent / 100),
      total: baseFee * (1 + vatPercent / 100),
    };
  }
}

export function getFeeForInspection(inspectionTypeId, vehicleClassId, regionId = null) {
  // Check for regional override first
  if (regionId) {
    const override = mockRegionalOverrides.find(
      o => o.admin_unit_id === regionId && 
           o.approval_status === 'Approved' &&
           o.effective_to === null
    );
    if (override) {
      const schedule = mockFeeSchedules.find(s => s.fee_schedule_id === override.fee_schedule_id);
      if (schedule && schedule.inspection_type_id === inspectionTypeId) {
        return override.override_fee_amount;
      }
    }
  }
  
  // Use base fee schedule
  const schedule = mockFeeSchedules.find(
    s => s.inspection_type_id === inspectionTypeId &&
         s.vehicle_class_id === vehicleClassId &&
         s.enabled &&
         s.approval_status === 'Approved'
  );
  return schedule ? schedule.base_fee_amount : 0;
}

export function calculateRetestFee(failedComponents, vehicleClassId) {
  let total = 0;
  failedComponents.forEach(component => {
    const rule = mockRetestRules.find(
      r => r.component === component &&
           r.vehicle_class_id === vehicleClassId &&
           r.enabled &&
           r.approval_status === 'Approved'
    );
    if (rule) {
      total += rule.retest_fee_amount;
    }
  });
  return total;
}






