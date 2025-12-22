import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Save, MapPin, Building2, FileText, User, Phone, DollarSign, Settings, Upload, X, Paperclip, File, Image, FileCheck } from 'lucide-react';
import { mockCentersFull } from '../../data/mockCentersInfrastructure';
import { mockAdminUnits } from '../../data/mockGovernance';
import MapPickerWithDrawing from '../../components/MapPickerWithDrawing';

const TABS = [
  { id: 'basic', label: 'Basic Information', icon: Building2 },
  { id: 'business', label: 'Business Registration', icon: FileText },
  { id: 'owner', label: 'Owner/Company', icon: User },
  { id: 'location', label: 'Location Details', icon: MapPin },
  { id: 'contact', label: 'Contact Information', icon: Phone },
  { id: 'details', label: 'Business Details', icon: DollarSign },
  { id: 'additional', label: 'Additional Info', icon: Settings },
  { id: 'documents', label: 'Documents', icon: Upload },
  { id: 'geofence', label: 'Geofence', icon: MapPin },
];

function CreateCenter() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [formErrors, setFormErrors] = useState({});
  const [geofenceType, setGeofenceType] = useState('circle');
  const [geofencePolygon, setGeofencePolygon] = useState([]);
  const [form, setForm] = useState({
    // Basic Information
    name: "",
    region: "",
    status: "Online",
    lat: 9.1450,
    lng: 38.7618,
    radius: 500,
    
    // Business Registration
    tin: "",
    vat: "",
    principalRegistrationNo: "",
    businessLicenseNo: "",
    businessLicenseDateOfIssuance: "",
    placeOfIssue: "",
    dateOfIssue: "",
    
    // Owner/Company Information
    ownerCompanyName: "",
    nationality: "",
    tradeName: "",
    generalManagerName: "",
    
    // Location Details
    zoneSubCity: "",
    woreda: "",
    kebele: "",
    houseNo: "",
    
    // Contact Information
    telephone: "",
    fax: "",
    email: "",
    
    // Business Details
    fieldOfBusiness: "",
    capitalInETB: "",
    
    // Additional
    telebirrNumber: "",
    cameraConfiguration: "",
    commercialRegistrationProcedure: "",
    
    // Documents
    documents: {
      businessLicense: null,
      registrationCertificate: null,
      taxCertificate: null,
      otherDocuments: [],
    },
  });

  // Load centers to get count
  const [allCenters] = useState(() => {
    try {
      const stored = localStorage.getItem('createdCenters');
      const created = stored ? JSON.parse(stored) : [];
      return [...mockCentersFull, ...created];
    } catch (e) {
      return mockCentersFull;
    }
  });

  const handleFileUpload = (field, file) => {
    if (file) {
      setForm(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: file,
        },
      }));
    }
  };

  const handleRemoveFile = (field) => {
    setForm(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: null,
      },
    }));
  };

  const handleAddOtherDocument = (file) => {
    if (file) {
      setForm(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          otherDocuments: [...prev.documents.otherDocuments, file],
        },
      }));
    }
  };

  const handleRemoveOtherDocument = (index) => {
    setForm(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        otherDocuments: prev.documents.otherDocuments.filter((_, i) => i !== index),
      },
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    // Basic Information
    if (!form.name.trim()) errors.name = 'Center name is required';
    if (!form.region) errors.region = 'Region is required';
    
    // Business Registration
    if (!form.tin.trim()) errors.tin = 'TIN is required';
    if (!form.principalRegistrationNo.trim()) errors.principalRegistrationNo = 'Principal Registration No. is required';
    if (!form.businessLicenseNo.trim()) errors.businessLicenseNo = 'Business License No. is required';
    if (!form.businessLicenseDateOfIssuance) errors.businessLicenseDateOfIssuance = 'Business License Date of Issuance is required';
    if (!form.placeOfIssue.trim()) errors.placeOfIssue = 'Place of Issue is required';
    
    // Owner/Company
    if (!form.ownerCompanyName.trim()) errors.ownerCompanyName = 'Owner/Company Name is required';
    
    // Location
    if (!form.zoneSubCity) errors.zoneSubCity = 'Zone/Sub City is required';
    if (!form.woreda) errors.woreda = 'Woreda is required';
    
    // Contact
    if (!form.telephone.trim()) errors.telephone = 'Telephone is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email format';
    
    // Geofence
    if (geofenceType === 'circle' && !form.radius) errors.radius = 'Geofence radius is required';
    if (geofenceType === 'polygon' && geofencePolygon.length < 3) errors.geofence = 'Polygon must have at least 3 points';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Find first tab with error
      const errorTabs = Object.keys(formErrors).map(field => {
        if (['name', 'region', 'status', 'lat', 'lng', 'radius'].includes(field)) return 'basic';
        if (['tin', 'vat', 'principalRegistrationNo', 'businessLicenseNo', 'businessLicenseDateOfIssuance', 'placeOfIssue', 'dateOfIssue'].includes(field)) return 'business';
        if (['ownerCompanyName', 'nationality', 'tradeName', 'generalManagerName'].includes(field)) return 'owner';
        if (['zoneSubCity', 'woreda', 'kebele', 'houseNo'].includes(field)) return 'location';
        if (['telephone', 'fax', 'email'].includes(field)) return 'contact';
        if (['fieldOfBusiness', 'capitalInETB'].includes(field)) return 'details';
        if (['telebirrNumber', 'cameraConfiguration', 'commercialRegistrationProcedure'].includes(field)) return 'additional';
        if (field.startsWith('documents')) return 'documents';
        if (['geofence', 'radius'].includes(field)) return 'geofence';
        return 'basic';
      });
      if (errorTabs.length > 0) {
        setActiveTab(errorTabs[0]);
      }
      return;
    }

    // Create new center object
    const newCenter = {
      center_id: `CTR-${String(allCenters.length + 1).padStart(3, "0")}`,
      center_name_en: form.name,
      center_name_am: form.name,
      center_code: `C${String(allCenters.length + 1).padStart(3, "0")}`,
      region_id: form.region,
      zone_id: form.zoneSubCity,
      sub_city_id: form.zoneSubCity,
      woreda_id: form.woreda,
      kebele: form.kebele,
      house_no: form.houseNo,
      latitude: form.lat,
      longitude: form.lng,
      geofence_radius: form.radius,
      geofence_type: geofenceType,
      geofence_polygon: geofencePolygon,
      status: form.status,
      // Business Registration
      tin: form.tin,
      vat: form.vat,
      principal_registration_no: form.principalRegistrationNo,
      business_license_no: form.businessLicenseNo,
      business_license_date_of_issuance: form.businessLicenseDateOfIssuance,
      place_of_issue: form.placeOfIssue,
      date_of_issue: form.dateOfIssue,
      commercial_registration_procedure: form.commercialRegistrationProcedure,
      // Owner/Company
      owner_company_name: form.ownerCompanyName,
      nationality: form.nationality,
      trade_name: form.tradeName,
      general_manager_name: form.generalManagerName,
      // Contact
      telephone: form.telephone,
      fax: form.fax,
      email: form.email,
      // Business
      field_of_business: form.fieldOfBusiness,
      capital_in_etb: parseFloat(form.capitalInETB) || 0,
      // Additional
      telebirr_number: form.telebirrNumber,
      camera_configuration: form.cameraConfiguration,
      // Documents
      documents: {
        businessLicense: form.documents.businessLicense?.name,
        registrationCertificate: form.documents.registrationCertificate?.name,
        taxCertificate: form.documents.taxCertificate?.name,
        otherDocuments: form.documents.otherDocuments.map(f => f.name),
      },
      // Default values
      active_lanes_count: 0,
      open_incidents_count: { total: 0, critical: 0, high: 0, medium: 0, low: 0 },
      device_health: { online: 0, degraded: 0, offline: 0 },
      attention_score: 0,
      last_heartbeat_at: new Date().toISOString(),
      created_at: new Date().toISOString(), // Timestamp for sorting
      updated_at: new Date().toISOString(),
      newlyCreated: true,
    };

    // Save to localStorage (database)
    try {
      const stored = localStorage.getItem('createdCenters');
      const existing = stored ? JSON.parse(stored) : [];
      const updated = [...existing, newCenter];
      // Sort by created_at timestamp (newest first) before saving
      updated.sort((a, b) => {
        const aDate = new Date(a.created_at || 0);
        const bDate = new Date(b.created_at || 0);
        return bDate - aDate; // Newest first
      });
      localStorage.setItem('createdCenters', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save center to database:', e);
      alert('Failed to save center. Please try again.');
      return;
    }

    // Navigate back to centers list
    navigate('/center-management');
  };

  // Get available regions from mockAdminUnits
  const availableRegions = useMemo(() => {
    return mockAdminUnits.filter(unit => 
      unit.admin_unit_type === 'Region' && unit.status === 'Active'
    );
  }, []);

  // Get available zones/sub-cities based on selected region
  const availableZones = useMemo(() => {
    if (!form.region) return [];
    
    // Find the selected region in mockAdminUnits by matching the name
    const selectedRegion = mockAdminUnits.find(
      unit => unit.admin_unit_type === 'Region' && unit.admin_unit_name_en === form.region
    );
    
    if (!selectedRegion) return [];
    
    // Filter zones/sub-cities that have the selected region as parent
    return mockAdminUnits.filter(unit => 
      (unit.admin_unit_type === 'Zone' || unit.admin_unit_type === 'Sub-city') &&
      unit.parent_admin_unit_id === selectedRegion.admin_unit_id &&
      unit.status === 'Active'
    );
  }, [form.region]);

  // Get available woredas based on selected zone
  const availableWoredas = useMemo(() => {
    if (!form.zoneSubCity) return [];
    
    // Filter woredas that have the selected zone/sub-city as parent
    return mockAdminUnits.filter(unit => 
      unit.admin_unit_type === 'Woreda' &&
      unit.parent_admin_unit_id === form.zoneSubCity &&
      unit.status === 'Active'
    );
  }, [form.zoneSubCity]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/center-management')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Inspection Center</h1>
            <p className="text-gray-600 mt-1">Fill in all required information to register a new inspection center</p>
          </div>
        </div>
      </div>

      {/* Error Summary */}
      {Object.keys(formErrors).length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-2">Please fix the following errors:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-800">
                {Object.entries(formErrors).map(([field, error]) => (
                  <li key={field}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                    isActive
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Basic Information Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Center Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                  }}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors ${
                    formErrors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter center name"
                />
                {formErrors.name && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Region *
                </label>
                <select
                  name="region"
                  required
                  value={form.region}
                  onChange={(e) => {
                    setForm({ ...form, region: e.target.value, zoneSubCity: '', woreda: '' });
                    if (formErrors.region) setFormErrors({ ...formErrors, region: '' });
                  }}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors ${
                    formErrors.region ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select region</option>
                  {availableRegions.map((region) => (
                    <option key={region.admin_unit_id} value={region.admin_unit_name_en}>
                      {region.admin_unit_name_en}
                    </option>
                  ))}
                </select>
                {formErrors.region && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.region}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status *
                </label>
                <select
                  required
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Business Registration Tab */}
        {activeTab === 'business' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Business Registration Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  TIN (Tax Identification Number) *
                </label>
                <input
                  type="text"
                  name="tin"
                  required
                  value={form.tin}
                  onChange={(e) => {
                    setForm({ ...form, tin: e.target.value });
                    if (formErrors.tin) setFormErrors({ ...formErrors, tin: '' });
                  }}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors ${
                    formErrors.tin ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter TIN"
                />
                {formErrors.tin && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.tin}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  VAT Number
                </label>
                <input
                  type="text"
                  value={form.vat}
                  onChange={(e) => setForm({ ...form, vat: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                  placeholder="Enter VAT number"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Principal Registration No. *
                </label>
                <input
                  type="text"
                  required
                  value={form.principalRegistrationNo}
                  onChange={(e) => {
                    setForm({ ...form, principalRegistrationNo: e.target.value });
                    if (formErrors.principalRegistrationNo) setFormErrors({ ...formErrors, principalRegistrationNo: '' });
                  }}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors ${
                    formErrors.principalRegistrationNo ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter principal registration number"
                />
                {formErrors.principalRegistrationNo && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.principalRegistrationNo}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Business License No. *
                </label>
                <input
                  type="text"
                  name="businessLicenseNo"
                  required
                  value={form.businessLicenseNo}
                  onChange={(e) => {
                    setForm({ ...form, businessLicenseNo: e.target.value });
                    if (formErrors.businessLicenseNo) setFormErrors({ ...formErrors, businessLicenseNo: '' });
                  }}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors ${
                    formErrors.businessLicenseNo ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter business license number"
                />
                {formErrors.businessLicenseNo && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.businessLicenseNo}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Business License Date of Issuance *
                </label>
                <input
                  type="date"
                  name="businessLicenseDateOfIssuance"
                  required
                  value={form.businessLicenseDateOfIssuance}
                  onChange={(e) => {
                    setForm({ ...form, businessLicenseDateOfIssuance: e.target.value });
                    if (formErrors.businessLicenseDateOfIssuance) setFormErrors({ ...formErrors, businessLicenseDateOfIssuance: '' });
                  }}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors ${
                    formErrors.businessLicenseDateOfIssuance ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.businessLicenseDateOfIssuance && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.businessLicenseDateOfIssuance}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Place of Issue *
                </label>
                <input
                  type="text"
                  required
                  value={form.placeOfIssue}
                  onChange={(e) => {
                    setForm({ ...form, placeOfIssue: e.target.value });
                    if (formErrors.placeOfIssue) setFormErrors({ ...formErrors, placeOfIssue: '' });
                  }}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors ${
                    formErrors.placeOfIssue ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter place of issue"
                />
                {formErrors.placeOfIssue && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.placeOfIssue}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date of Issue
                </label>
                <input
                  type="date"
                  value={form.dateOfIssue}
                  onChange={(e) => setForm({ ...form, dateOfIssue: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* Owner/Company Tab */}
        {activeTab === 'owner' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Owner/Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Owner/Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.ownerCompanyName}
                  onChange={(e) => {
                    setForm({ ...form, ownerCompanyName: e.target.value });
                    if (formErrors.ownerCompanyName) setFormErrors({ ...formErrors, ownerCompanyName: '' });
                  }}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors ${
                    formErrors.ownerCompanyName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter owner/company name"
                />
                {formErrors.ownerCompanyName && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.ownerCompanyName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nationality
                </label>
                <input
                  type="text"
                  value={form.nationality}
                  onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                  placeholder="Enter nationality"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Trade Name
                </label>
                <input
                  type="text"
                  value={form.tradeName}
                  onChange={(e) => setForm({ ...form, tradeName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                  placeholder="Enter trade name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  General Manager Name
                </label>
                <input
                  type="text"
                  value={form.generalManagerName}
                  onChange={(e) => setForm({ ...form, generalManagerName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                  placeholder="Enter general manager name"
                />
              </div>
            </div>
          </div>
        )}

        {/* Location Details Tab */}
        {activeTab === 'location' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Location Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Zone/Sub City *
                </label>
                <select
                  required
                  value={form.zoneSubCity}
                  onChange={(e) => {
                    setForm({ ...form, zoneSubCity: e.target.value, woreda: '' });
                    if (formErrors.zoneSubCity) setFormErrors({ ...formErrors, zoneSubCity: '' });
                  }}
                  disabled={!form.region}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500 ${
                    formErrors.zoneSubCity ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select zone/sub city</option>
                  {availableZones.map((zone) => (
                    <option key={zone.admin_unit_id} value={zone.admin_unit_id}>
                      {zone.admin_unit_name_en}
                    </option>
                  ))}
                </select>
                {formErrors.zoneSubCity && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.zoneSubCity}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Woreda *
                </label>
                <select
                  required
                  value={form.woreda}
                  onChange={(e) => {
                    setForm({ ...form, woreda: e.target.value });
                    if (formErrors.woreda) setFormErrors({ ...formErrors, woreda: '' });
                  }}
                  disabled={!form.zoneSubCity}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500 ${
                    formErrors.woreda ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select woreda</option>
                  {availableWoredas.map((woreda) => (
                    <option key={woreda.admin_unit_id} value={woreda.admin_unit_id}>
                      {woreda.admin_unit_name_en}
                    </option>
                  ))}
                </select>
                {formErrors.woreda && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.woreda}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Kebele
                </label>
                <input
                  type="text"
                  value={form.kebele}
                  onChange={(e) => setForm({ ...form, kebele: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                  placeholder="Enter kebele"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  House No.
                </label>
                <input
                  type="text"
                  value={form.houseNo}
                  onChange={(e) => setForm({ ...form, houseNo: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                  placeholder="Enter house number"
                />
              </div>
            </div>
          </div>
        )}

        {/* Contact Information Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Telephone *
                </label>
                <input
                  type="tel"
                  required
                  value={form.telephone}
                  onChange={(e) => {
                    setForm({ ...form, telephone: e.target.value });
                    if (formErrors.telephone) setFormErrors({ ...formErrors, telephone: '' });
                  }}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors ${
                    formErrors.telephone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter telephone number"
                />
                {formErrors.telephone && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.telephone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Fax
                </label>
                <input
                  type="text"
                  value={form.fax}
                  onChange={(e) => setForm({ ...form, fax: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                  placeholder="Enter fax number"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                  }}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors ${
                    formErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {formErrors.email && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Business Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Business Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Field of Business
                </label>
                <input
                  type="text"
                  value={form.fieldOfBusiness}
                  onChange={(e) => setForm({ ...form, fieldOfBusiness: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                  placeholder="Enter field of business"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Capital in ETB
                </label>
                <input
                  type="number"
                  value={form.capitalInETB}
                  onChange={(e) => setForm({ ...form, capitalInETB: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                  placeholder="Enter capital amount"
                />
              </div>
            </div>
          </div>
        )}

        {/* Additional Information Tab */}
        {activeTab === 'additional' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  TeleBirr Number
                </label>
                <input
                  type="text"
                  value={form.telebirrNumber}
                  onChange={(e) => setForm({ ...form, telebirrNumber: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                  placeholder="Enter TeleBirr number"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Camera Configuration
                </label>
                <input
                  type="text"
                  value={form.cameraConfiguration}
                  onChange={(e) => setForm({ ...form, cameraConfiguration: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                  placeholder="Enter camera configuration"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Commercial Registration Procedure
                </label>
                <textarea
                  value={form.commercialRegistrationProcedure}
                  onChange={(e) => setForm({ ...form, commercialRegistrationProcedure: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent transition-colors"
                  placeholder="Enter commercial registration procedure details"
                />
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Document Attachments</h3>
            <p className="text-sm text-gray-600">Upload required documents. All document fields are optional.</p>
            <div className="space-y-6">
              {/* Business License */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Business License
                </label>
                {form.documents.businessLicense ? (
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <FileCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{form.documents.businessLicense.name}</p>
                      <p className="text-xs text-gray-500">
                        {(form.documents.businessLicense.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile('businessLicense')}
                      className="flex-shrink-0 p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      title="Remove file"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#88bf47] hover:bg-[#88bf47]/5 transition-colors group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Paperclip className="h-10 w-10 text-gray-400 group-hover:text-[#88bf47] mb-2" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG (MAX. 10MB)</p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('businessLicense', e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Registration Certificate */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Registration Certificate
                </label>
                {form.documents.registrationCertificate ? (
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <FileCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{form.documents.registrationCertificate.name}</p>
                      <p className="text-xs text-gray-500">
                        {(form.documents.registrationCertificate.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile('registrationCertificate')}
                      className="flex-shrink-0 p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      title="Remove file"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#88bf47] hover:bg-[#88bf47]/5 transition-colors group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Paperclip className="h-10 w-10 text-gray-400 group-hover:text-[#88bf47] mb-2" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG (MAX. 10MB)</p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('registrationCertificate', e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Tax Certificate */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tax Certificate
                </label>
                {form.documents.taxCertificate ? (
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <FileCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{form.documents.taxCertificate.name}</p>
                      <p className="text-xs text-gray-500">
                        {(form.documents.taxCertificate.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile('taxCertificate')}
                      className="flex-shrink-0 p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      title="Remove file"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#88bf47] hover:bg-[#88bf47]/5 transition-colors group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Paperclip className="h-10 w-10 text-gray-400 group-hover:text-[#88bf47] mb-2" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG (MAX. 10MB)</p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('taxCertificate', e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Other Documents */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Other Documents
                </label>
                {form.documents.otherDocuments.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {form.documents.otherDocuments.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex-shrink-0">
                          <File className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveOtherDocument(index)}
                          className="flex-shrink-0 p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          title="Remove file"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#88bf47] hover:bg-[#88bf47]/5 transition-colors group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-10 w-10 text-gray-400 group-hover:text-[#88bf47] mb-2" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, JPG, PNG (MAX. 10MB)</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      if (e.target.files[0]) handleAddOtherDocument(e.target.files[0]);
                      e.target.value = '';
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Geofence Tab */}
        {activeTab === 'geofence' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Geofence Configuration</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Geofence Type *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="circle"
                      checked={geofenceType === 'circle'}
                      onChange={(e) => {
                        setGeofenceType(e.target.value);
                        setGeofencePolygon([]);
                        if (formErrors.geofence) setFormErrors({ ...formErrors, geofence: '' });
                      }}
                      className="w-4 h-4 text-[#88bf47] focus:ring-[#88bf47]"
                    />
                    <span className="text-sm text-gray-700">Circle</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="polygon"
                      checked={geofenceType === 'polygon'}
                      onChange={(e) => {
                        setGeofenceType(e.target.value);
                        setForm({ ...form, radius: 500 });
                        if (formErrors.geofence) setFormErrors({ ...formErrors, geofence: '' });
                      }}
                      className="w-4 h-4 text-[#88bf47] focus:ring-[#88bf47]"
                    />
                    <span className="text-sm text-gray-700">Polygon</span>
                  </label>
                </div>
              </div>

              {geofenceType === 'circle' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Geo-Fence Radius (Meters) *
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="100"
                      max="2000"
                      step="50"
                      value={form.radius}
                      onChange={(e) => {
                        setForm({ ...form, radius: Number(e.target.value) });
                        if (formErrors.radius) setFormErrors({ ...formErrors, radius: '' });
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#88bf47]"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">100 m</span>
                      <span className="text-sm font-semibold text-gray-900">{form.radius} m</span>
                      <span className="text-xs text-gray-500">2000 m</span>
                    </div>
                  </div>
                  {formErrors.radius && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.radius}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Location on Map *
                </label>
                <div className="h-96 rounded-lg border border-gray-300 overflow-hidden">
                  <MapPickerWithDrawing
                    lat={form.lat}
                    lng={form.lng}
                    onLocationChange={(lat, lng) => setForm({ ...form, lat, lng })}
                    radius={form.radius}
                    geofenceType={geofenceType}
                    polygon={geofencePolygon}
                    onPolygonChange={setGeofencePolygon}
                  />
                </div>
                {formErrors.geofence && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.geofence}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/center-management')}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[#88bf47] rounded-lg hover:bg-[#007c2d] transition-colors shadow-sm"
          >
            <Save className="h-4 w-4" />
            Create Center
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCenter;

