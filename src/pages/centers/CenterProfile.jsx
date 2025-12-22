import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, MapPin, Clock, Phone, Mail, AlertCircle, CheckCircle, XCircle, Building2, FileText, Globe, DollarSign, Camera, Hash, Calendar, Map, Upload, X } from 'lucide-react';
import { mockCentersFull, validateLatLon, getCenterJurisdictionPath } from '../../data/mockCentersInfrastructure';
import { mockAdminUnits } from '../../data/mockGovernance';
import { mockOperationsIncidents } from '../../data/mockOperations';
import { useAuth } from '../../context/AuthContext';
import MapPickerWithDrawing from '../../components/MapPickerWithDrawing';

function CenterProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [center, setCenter] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  // Check if we should show incidents view
  const showIncidents = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('view') === 'incidents';
  }, [location.search]);

  // Get incidents for this center
  const centerIncidents = useMemo(() => {
    if (!center) return [];
    return mockOperationsIncidents.filter(
      inc => inc.scope?.centerId === center.center_id || inc.scope?.centerId === id
    );
  }, [center, id]);

  // Scroll to incidents section when view=incidents
  useEffect(() => {
    if (showIncidents && centerIncidents.length > 0) {
      setTimeout(() => {
        const element = document.getElementById('incidents-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [showIncidents, centerIncidents.length]);

  useEffect(() => {
    // Check both mockCentersFull and createdCenters from context/localStorage
    const allCenters = [...mockCentersFull];
    // Try to get created centers from localStorage or context
    try {
      const stored = localStorage.getItem('createdCenters');
      if (stored) {
        const created = JSON.parse(stored);
        allCenters.push(...created);
      }
    } catch (e) {
      // Ignore
    }
    
    const found = allCenters.find(c => c.center_id === id);
    if (found) {
      setCenter(found);
      setFormData({
        center_name_en: found.center_name_en || found.center_name,
        center_name_am: found.center_name_am || '',
        center_code: found.center_code || '',
        region_id: found.region_id || found.region,
        zone_id: found.zone_id || found.zoneSubCity || '',
        sub_city_id: found.sub_city_id || found.zoneSubCity || '',
        woreda_id: found.woreda_id || found.woreda || '',
        kebele: found.kebele || '',
        house_no: found.house_no || found.houseNo || '',
        manager_name: found.manager_name || found.generalManagerName || '',
        phone: found.phone || found.telephone || '',
        fax: found.fax || '',
        email: found.email || '',
        address_text: found.address_text || '',
        geo_lat: found.geo_lat || found.latitude || found.lat || 0,
        geo_lon: found.geo_lon || found.longitude || found.lng || 0,
        hours_text: found.hours_text || '',
        status: found.status || 'Online',
        // Business Registration
        tin: found.tin || '',
        vat: found.vat || '',
        principal_registration_no: found.principal_registration_no || found.principalRegistrationNo || '',
        business_license_no: found.business_license_no || found.businessLicenseNo || '',
        business_license_date_of_issuance: found.business_license_date_of_issuance || found.businessLicenseDateOfIssuance || '',
        place_of_issue: found.place_of_issue || found.placeOfIssue || '',
        date_of_issue: found.date_of_issue || found.dateOfIssue || '',
        commercial_registration_procedure: found.commercial_registration_procedure || found.commercialRegistrationProcedure || '',
        // Owner/Company
        owner_company_name: found.owner_company_name || found.ownerCompanyName || '',
        nationality: found.nationality || '',
        trade_name: found.trade_name || found.tradeName || '',
        general_manager_name: found.general_manager_name || found.generalManagerName || '',
        // Contact
        telephone: found.telephone || found.phone || '',
        // Business
        field_of_business: found.field_of_business || found.fieldOfBusiness || '',
        capital_in_etb: found.capital_in_etb || found.capitalInETB || '',
        // Additional
        telebirr_number: found.telebirr_number || found.telebirrNumber || '',
        camera_configuration: found.camera_configuration || found.cameraConfiguration || '',
        // Geofence
        geofence_radius: found.geofence_radius || found.radius || 500,
        geofence_type: found.geofence_type || 'circle',
        geofence_polygon: found.geofence_polygon || found.geofencePolygon || [],
        // Documents
        documents: found.documents || {},
      });
    }
  }, [id]);

  const handleSave = () => {
    // Validate location
    const latValidation = validateLatLon(formData.geo_lat, formData.geo_lon);
    if (!latValidation.valid) {
      setValidationErrors({ location: latValidation.error });
      return;
    }

    // In real app, this would be an API call with audit logging
    const updated = {
      ...center,
      ...formData,
      updated_at: new Date().toISOString(),
      updated_by: user?.id,
    };
    setCenter(updated);
    setIsEditing(false);
    setValidationErrors({});
    console.log('Center updated (audit logged)', updated);
  };

  const handleJurisdictionChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    // Clear dependent fields
    if (field === 'region_id') {
      newFormData.zone_id = '';
      newFormData.sub_city_id = '';
      newFormData.woreda_id = '';
    } else if (field === 'zone_id' || field === 'sub_city_id') {
      newFormData.woreda_id = '';
    }
    setFormData(newFormData);
    // In real app, changing jurisdiction may require approval
    console.log('Jurisdiction change (may require approval)', { field, value });
  };

  // Show loading state while center is being fetched
  if (!center && id) {
    return (
      <div className="max-w-4xl mx-auto mt-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#88bf47] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading center details...</p>
        </div>
      </div>
    );
  }

  // Show not found if center doesn't exist
  if (!center) {
    return (
      <div className="max-w-4xl mx-auto mt-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Center Not Found</h2>
          <p className="text-gray-600 mb-4">The center with ID "{id}" could not be found.</p>
          <button
            onClick={() => navigate('/center-management')}
            className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition"
          >
            Back to Centers
          </button>
        </div>
      </div>
    );
  }

  const regions = mockAdminUnits.filter(u => u.admin_unit_type === 'Region' && u.status === 'Active');
  const zones = formData.region_id
    ? mockAdminUnits.filter(u => u.parent_admin_unit_id === formData.region_id && u.admin_unit_type === 'Zone')
    : [];
  const subCities = formData.region_id
    ? mockAdminUnits.filter(u => u.parent_admin_unit_id === formData.region_id && u.admin_unit_type === 'Sub-city')
    : [];
  const woredas = (formData.zone_id || formData.sub_city_id)
    ? mockAdminUnits.filter(u => {
        const parentId = formData.zone_id || formData.sub_city_id;
        return u.parent_admin_unit_id === parentId && u.admin_unit_type === 'Woreda';
      })
    : [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/center-management')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{center.center_name_en || center.center_name || center.name || 'Center'}</h1>
            <p className="text-gray-600 mt-1">{getCenterJurisdictionPath(center) || center.region || center.region_id || ''}</p>
          </div>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsEditing(false);
                // Reset to original center data
                setFormData({
                  center_name_en: center.center_name_en || center.center_name || center.name || '',
                  center_name_am: center.center_name_am || '',
                  center_code: center.center_code || '',
                  region_id: center.region_id || center.region || '',
                  zone_id: center.zone_id || center.zoneSubCity || '',
                  sub_city_id: center.sub_city_id || center.zoneSubCity || '',
                  woreda_id: center.woreda_id || center.woreda || '',
                  kebele: center.kebele || '',
                  house_no: center.house_no || center.houseNo || '',
                  manager_name: center.manager_name || center.generalManagerName || '',
                  phone: center.phone || center.telephone || '',
                  fax: center.fax || '',
                  email: center.email || '',
                  address_text: center.address_text || '',
                  geo_lat: center.geo_lat || center.latitude || center.lat || 0,
                  geo_lon: center.geo_lon || center.longitude || center.lng || 0,
                  hours_text: center.hours_text || '',
                  status: center.status || 'Online',
                  tin: center.tin || '',
                  vat: center.vat || '',
                  principal_registration_no: center.principal_registration_no || center.principalRegistrationNo || '',
                  business_license_no: center.business_license_no || center.businessLicenseNo || '',
                  business_license_date_of_issuance: center.business_license_date_of_issuance || center.businessLicenseDateOfIssuance || '',
                  place_of_issue: center.place_of_issue || center.placeOfIssue || '',
                  date_of_issue: center.date_of_issue || center.dateOfIssue || '',
                  commercial_registration_procedure: center.commercial_registration_procedure || center.commercialRegistrationProcedure || '',
                  owner_company_name: center.owner_company_name || center.ownerCompanyName || '',
                  nationality: center.nationality || '',
                  trade_name: center.trade_name || center.tradeName || '',
                  general_manager_name: center.general_manager_name || center.generalManagerName || '',
                  telephone: center.telephone || center.phone || '',
                  field_of_business: center.field_of_business || center.fieldOfBusiness || '',
                  capital_in_etb: center.capital_in_etb || center.capitalInETB || '',
                  telebirr_number: center.telebirr_number || center.telebirrNumber || '',
                  camera_configuration: center.camera_configuration || center.cameraConfiguration || '',
                  geofence_radius: center.geofence_radius || center.radius || 500,
                  geofence_type: center.geofence_type || 'circle',
                  geofence_polygon: center.geofence_polygon || center.geofencePolygon || [],
                  documents: center.documents || {},
                });
                setValidationErrors({});
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#88bf47] text-white rounded-lg hover:bg-[#0fa84a] transition flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="h-5 w-5 text-[#88bf47]" />
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Center Name (English) <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.center_name_en}
                    onChange={(e) => setFormData({ ...formData, center_name_en: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <p className="text-sm text-gray-900 font-medium">{center.center_name_en || center.center_name || '-'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Center Name (Amharic)
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.center_name_am}
                    onChange={(e) => setFormData({ ...formData, center_name_am: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{center.center_name_am || '-'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Center Code
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.center_code}
                    onChange={(e) => setFormData({ ...formData, center_code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">{center.center_code || '-'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <select
                    value={formData.status || 'Online'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  >
                    <option value="Online">Online</option>
                    <option value="Degraded">Degraded</option>
                    <option value="Offline">Offline</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-2">
                    {center.status === 'Online' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : center.status === 'Degraded' ? (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <p className="text-sm text-gray-900 font-medium">{center.status}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Jurisdiction */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="h-5 w-5 text-[#88bf47]" />
              <h2 className="text-lg font-semibold text-gray-900">Jurisdiction</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <select
                    value={formData.region_id}
                    onChange={(e) => handleJurisdictionChange('region_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  >
                    <option value="">Select region...</option>
                    {regions.map(region => (
                      <option key={region.admin_unit_id} value={region.admin_unit_id}>
                        {region.admin_unit_name_en}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-gray-900">
                    {regions.find(r => r.admin_unit_id === center.region_id)?.admin_unit_name_en || '-'}
                  </p>
                )}
              </div>
              {zones.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zone</label>
                  {isEditing ? (
                    <select
                      value={formData.zone_id || ''}
                      onChange={(e) => handleJurisdictionChange('zone_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                    >
                      <option value="">Select zone...</option>
                      {zones.map(zone => (
                        <option key={zone.admin_unit_id} value={zone.admin_unit_id}>
                          {zone.admin_unit_name_en}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-gray-900">
                      {zones.find(z => z.admin_unit_id === center.zone_id)?.admin_unit_name_en || '-'}
                    </p>
                  )}
                </div>
              )}
              {subCities.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sub-city</label>
                  {isEditing ? (
                    <select
                      value={formData.sub_city_id || ''}
                      onChange={(e) => handleJurisdictionChange('sub_city_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                    >
                      <option value="">Select sub-city...</option>
                      {subCities.map(subCity => (
                        <option key={subCity.admin_unit_id} value={subCity.admin_unit_id}>
                          {subCity.admin_unit_name_en}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-gray-900">
                      {subCities.find(s => s.admin_unit_id === center.sub_city_id)?.admin_unit_name_en || '-'}
                    </p>
                  )}
                </div>
              )}
              {woredas.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Woreda</label>
                  {isEditing ? (
                    <select
                      value={formData.woreda_id || ''}
                      onChange={(e) => setFormData({ ...formData, woreda_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                    >
                      <option value="">Select woreda...</option>
                      {woredas.map(woreda => (
                        <option key={woreda.admin_unit_id} value={woreda.admin_unit_id}>
                          {woreda.admin_unit_name_en}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-gray-900">
                      {woredas.find(w => w.admin_unit_id === center.woreda_id)?.admin_unit_name_en || '-'}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Phone className="h-5 w-5 text-[#88bf47]" />
              <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  General Manager Name <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.general_manager_name || formData.manager_name || ''}
                    onChange={(e) => setFormData({ ...formData, general_manager_name: e.target.value, manager_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{center.general_manager_name || center.generalManagerName || center.manager_name || '-'}</p>
                )}
              </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telephone No. <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                    value={formData.telephone || formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                    />
                  ) : (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-900">{center.telephone || center.phone || '-'}</p>
                  </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                    />
                  ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-900">{center.email || '-'}</p>
                  </div>
                  )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fax
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.fax || ''}
                    onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{center.fax || '-'}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.address_text}
                    onChange={(e) => setFormData({ ...formData, address_text: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{center.address_text || '-'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Business Registration Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="h-5 w-5 text-[#88bf47]" />
              <h2 className="text-lg font-semibold text-gray-900">Business Registration Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TIN (Tax Identification Number) <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.tin || ''}
                    onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">{center.tin || '-'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">VAT Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.vat || ''}
                    onChange={(e) => setFormData({ ...formData, vat: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">{center.vat || '-'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Principal Registration No. <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.principal_registration_no || ''}
                    onChange={(e) => setFormData({ ...formData, principal_registration_no: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{center.principal_registration_no || center.principalRegistrationNo || '-'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business License No. <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.business_license_no || ''}
                    onChange={(e) => setFormData({ ...formData, business_license_no: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">{center.business_license_no || center.businessLicenseNo || '-'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business License Date of Issuance <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.business_license_date_of_issuance || ''}
                    onChange={(e) => setFormData({ ...formData, business_license_date_of_issuance: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-900">{center.business_license_date_of_issuance || center.businessLicenseDateOfIssuance || '-'}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Place of Issue <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.place_of_issue || ''}
                    onChange={(e) => setFormData({ ...formData, place_of_issue: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{center.place_of_issue || center.placeOfIssue || '-'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Issue <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.date_of_issue || ''}
                    onChange={(e) => setFormData({ ...formData, date_of_issue: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-900">{center.date_of_issue || center.dateOfIssue || '-'}</p>
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Commercial Registration & Business License Procedure</label>
                {isEditing ? (
                  <textarea
                    value={formData.commercial_registration_procedure || ''}
                    onChange={(e) => setFormData({ ...formData, commercial_registration_procedure: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                    placeholder="Enter commercial registration and business license procedure details"
                  />
                ) : (
                  <p className="text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border border-gray-200">{center.commercial_registration_procedure || center.commercialRegistrationProcedure || '-'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Owner/Company Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="h-5 w-5 text-[#88bf47]" />
              <h2 className="text-lg font-semibold text-gray-900">Owner/Company Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner/Company Name <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.owner_company_name || ''}
                    onChange={(e) => setFormData({ ...formData, owner_company_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <p className="text-sm text-gray-900 font-medium">{center.owner_company_name || center.ownerCompanyName || '-'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nationality <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.nationality || ''}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-900">{center.nationality || '-'}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trade Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.trade_name || ''}
                    onChange={(e) => setFormData({ ...formData, trade_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{center.trade_name || center.tradeName || '-'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  General Manager Name <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.general_manager_name || ''}
                    onChange={(e) => setFormData({ ...formData, general_manager_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{center.general_manager_name || center.generalManagerName || '-'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="h-5 w-5 text-[#88bf47]" />
              <h2 className="text-lg font-semibold text-gray-900">Location Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zone / Sub City <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.zone_id || formData.sub_city_id || ''}
                    onChange={(e) => setFormData({ ...formData, zone_id: e.target.value, sub_city_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <p className="text-sm text-gray-900">
                    {zones.find(z => z.admin_unit_id === center.zone_id)?.admin_unit_name_en || 
                     subCities.find(s => s.admin_unit_id === center.sub_city_id)?.admin_unit_name_en || '-'}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Woreda <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.woreda_id || ''}
                    onChange={(e) => setFormData({ ...formData, woreda_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <p className="text-sm text-gray-900">
                    {woredas.find(w => w.admin_unit_id === center.woreda_id)?.admin_unit_name_en || '-'}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kebele <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.kebele || ''}
                    onChange={(e) => setFormData({ ...formData, kebele: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{center.kebele || '-'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  House No. <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.house_no || ''}
                    onChange={(e) => setFormData({ ...formData, house_no: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">{center.house_no || center.houseNo || '-'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="h-5 w-5 text-[#88bf47]" />
              <h2 className="text-lg font-semibold text-gray-900">Business Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field of Business <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.field_of_business || ''}
                    onChange={(e) => setFormData({ ...formData, field_of_business: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <p className="text-sm text-gray-900 font-medium">{center.field_of_business || center.fieldOfBusiness || '-'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capital in ETB <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.capital_in_etb || ''}
                    onChange={(e) => setFormData({ ...formData, capital_in_etb: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-900 font-semibold">{center.capital_in_etb || center.capitalInETB ? `ETB ${Number(center.capital_in_etb || center.capitalInETB).toLocaleString()}` : '-'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Hash className="h-5 w-5 text-[#88bf47]" />
              <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telebirr Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.telebirr_number || ''}
                    onChange={(e) => setFormData({ ...formData, telebirr_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">{center.telebirr_number || center.telebirrNumber || '-'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Camera Configuration</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.camera_configuration || ''}
                    onChange={(e) => setFormData({ ...formData, camera_configuration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-900">{center.camera_configuration || center.cameraConfiguration || '-'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="h-5 w-5 text-[#88bf47]" />
              <h2 className="text-lg font-semibold text-gray-900">Geographic Location</h2>
            </div>
            {validationErrors.location && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {validationErrors.location}
              </div>
            )}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="any"
                      value={formData.geo_lat}
                      onChange={(e) => {
                        const lat = parseFloat(e.target.value);
                        setFormData({ ...formData, geo_lat: lat });
                        const validation = validateLatLon(lat, formData.geo_lon);
                        if (!validation.valid) {
                          setValidationErrors({ ...validationErrors, location: validation.error });
                        } else {
                          setValidationErrors({ ...validationErrors, location: null });
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">{center.geo_lat || center.latitude || center.lat || '-'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="any"
                      value={formData.geo_lon}
                      onChange={(e) => {
                        const lon = parseFloat(e.target.value);
                        setFormData({ ...formData, geo_lon: lon });
                        const validation = validateLatLon(formData.geo_lat, lon);
                        if (!validation.valid) {
                          setValidationErrors({ ...validationErrors, location: validation.error });
                        } else {
                          setValidationErrors({ ...validationErrors, location: null });
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">{center.geo_lon || center.longitude || center.lng || '-'}</p>
                  )}
                </div>
              </div>
                <div className="h-96 rounded-lg border border-gray-300 overflow-hidden">
                <MapPickerWithDrawing
                  lat={formData.geo_lat || center.geo_lat || center.latitude || center.lat || 9.1450}
                  lng={formData.geo_lon || center.geo_lon || center.longitude || center.lng || 38.7618}
                  radius={formData.geofence_radius || center.geofence_radius || center.radius || 500}
                  geofenceType={formData.geofence_type || center.geofence_type || 'circle'}
                  polygon={formData.geofence_polygon || center.geofence_polygon || center.geofencePolygon || []}
                    onCoordinateChange={(lat, lng) => {
                    if (isEditing) {
                      setFormData({ ...formData, geo_lat: lat, geo_lon: lng });
                      const validation = validateLatLon(lat, lng);
                      if (!validation.valid) {
                        setValidationErrors({ ...validationErrors, location: validation.error });
                      } else {
                        setValidationErrors({ ...validationErrors, location: null });
                      }
                    }
                  }}
                  onPolygonChange={(polygon) => {
                    if (isEditing) {
                      setFormData({ ...formData, geofence_polygon: polygon });
                      }
                    }}
                    className="h-full"
                  />
              </div>
            </div>
          </div>

          {/* Geofence */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Map className="h-5 w-5 text-[#88bf47]" />
              <h2 className="text-lg font-semibold text-gray-900">Geofence Configuration</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Geofence Type</label>
                {isEditing ? (
                  <select
                    value={formData.geofence_type || 'circle'}
                    onChange={(e) => setFormData({ ...formData, geofence_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  >
                    <option value="circle">Circle (Radius)</option>
                    <option value="polygon">Polygon (Custom Area)</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-2">
                    <Map className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-900 font-medium capitalize">{center.geofence_type || center.geofenceType || 'circle'}</p>
                  </div>
                )}
              </div>
              {(!isEditing || formData.geofence_type === 'circle') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Radius (Meters) <span className="text-red-500">*</span></label>
                  {isEditing ? (
                    <input
                      type="number"
                      min="100"
                      value={formData.geofence_radius || 500}
                      onChange={(e) => setFormData({ ...formData, geofence_radius: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 font-semibold">{center.geofence_radius || center.radius || 500} m</p>
                  )}
                </div>
              )}
              {(!isEditing || formData.geofence_type === 'polygon') && (formData.geofence_polygon || center.geofence_polygon || center.geofencePolygon) && (formData.geofence_polygon?.length > 0 || center.geofence_polygon?.length > 0 || center.geofencePolygon?.length > 0) && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Polygon Points</label>
                  <p className="text-sm text-blue-800 font-medium">
                    {(formData.geofence_polygon || center.geofence_polygon || center.geofencePolygon || []).length} point{(formData.geofence_polygon || center.geofence_polygon || center.geofencePolygon || []).length !== 1 ? 's' : ''} defined
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Document Attachments */}
          {(center.documents || (center.businessLicense || center.registrationCertificate || center.taxCertificate)) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="h-5 w-5 text-[#88bf47]" />
                <h2 className="text-lg font-semibold text-gray-900">Document Attachments</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {center.documents?.businessLicense && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <label className="block text-sm font-medium text-gray-700">Business License</label>
                    </div>
                    <p className="text-sm text-gray-900 font-mono">{center.documents.businessLicense}</p>
                  </div>
                )}
                {center.documents?.registrationCertificate && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <label className="block text-sm font-medium text-gray-700">Registration Certificate</label>
                    </div>
                    <p className="text-sm text-gray-900 font-mono">{center.documents.registrationCertificate}</p>
                  </div>
                )}
                {center.documents?.taxCertificate && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <label className="block text-sm font-medium text-gray-700">Tax Certificate</label>
                    </div>
                    <p className="text-sm text-gray-900 font-mono">{center.documents.taxCertificate}</p>
                  </div>
                )}
                {center.documents?.otherDocuments && center.documents.otherDocuments.length > 0 && (
                  <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <label className="block text-sm font-medium text-gray-700">Other Documents</label>
                    </div>
                    <ul className="space-y-2">
                      {center.documents.otherDocuments.map((doc, idx) => (
                        <li key={idx} className="text-sm text-gray-900 font-mono bg-white px-3 py-2 rounded border border-gray-200">
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Incidents Section */}
          {(showIncidents || centerIncidents.length > 0) && (
            <div id="incidents-section" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <h2 className="text-lg font-semibold text-gray-900">Incidents</h2>
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    {centerIncidents.length}
                  </span>
                </div>
                {showIncidents && (
                  <button
                    onClick={() => navigate(`/center-management/${id}`)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Hide incidents
                  </button>
                )}
              </div>
              
              {centerIncidents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-sm">No incidents for this center</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {centerIncidents
                    .sort((a, b) => {
                      const severityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
                      return severityOrder[b.severity] - severityOrder[a.severity];
                    })
                    .map((incident) => (
                      <div
                        key={incident.id || incident.incident_id}
                        className={`p-4 rounded-lg border ${
                          incident.severity === 'Critical' ? 'bg-red-50 border-red-200' :
                          incident.severity === 'High' ? 'bg-orange-50 border-orange-200' :
                          incident.severity === 'Medium' ? 'bg-yellow-50 border-yellow-200' :
                          'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                incident.severity === 'Critical' ? 'bg-red-200 text-red-900' :
                                incident.severity === 'High' ? 'bg-orange-200 text-orange-900' :
                                incident.severity === 'Medium' ? 'bg-yellow-200 text-yellow-900' :
                                'bg-blue-200 text-blue-900'
                              }`}>
                                {incident.severity}
                              </span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-600">{incident.type?.replace(/_/g, ' ')}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900 mb-1">{incident.title || incident.description}</p>
                            {incident.description && incident.title && (
                              <p className="text-xs text-gray-600 mb-2">{incident.description}</p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>First detected: {new Date(incident.firstDetectedAt || incident.created_at).toLocaleString('en-ET')}</span>
                              {incident.impactMetrics?.inspectionsAffectedCount > 0 && (
                                <>
                                  <span>•</span>
                                  <span>Affected: {incident.impactMetrics.inspectionsAffectedCount} inspections</span>
                                </>
                              )}
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded font-medium ${
                            incident.status === 'Open' ? 'bg-red-100 text-red-700' :
                            incident.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {incident.status}
                          </span>
                        </div>
                        {incident.resolutionNotes && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-xs text-gray-600">
                              <strong>Resolution:</strong> {incident.resolutionNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Operating Hours */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-5 w-5 text-[#88bf47]" />
              <h2 className="text-lg font-semibold text-gray-900">Operating Hours</h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hours
              </label>
              {isEditing ? (
                <textarea
                  value={formData.hours_text}
                  onChange={(e) => setFormData({ ...formData, hours_text: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
                  placeholder="e.g., Mon–Fri 8:00–17:00; Sat 8:00–12:00"
                />
              ) : (
                <p className="text-sm text-gray-900">{center.hours_text || '-'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Current Status</span>
                <div className="mt-1">
                  {center.status === 'Online' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : center.status === 'Degraded' ? (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="ml-2 text-sm font-medium text-gray-900">{center.status}</span>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Last Heartbeat</span>
                <div className="mt-1 text-sm text-gray-900">
                  {new Date(center.last_heartbeat_at).toLocaleString('en-ET')}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Active Lanes</span>
                <div className="mt-1 text-sm font-medium text-gray-900">
                  {center.active_lanes_count}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CenterProfile;

