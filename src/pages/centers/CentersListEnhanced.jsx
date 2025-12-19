import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, AlertCircle, CheckCircle, XCircle, TrendingUp, Plus, Upload, FileText, X, ChevronLeft, ChevronRight, RotateCcw, UserPlus, Settings } from 'lucide-react';
import { mockCentersFull, getCenterJurisdictionPath, mockDevices } from '../../data/mockCentersInfrastructure';
import { mockAdminUnits } from '../../data/mockGovernance';
import { filterCentersByScope, getUserScope } from '../../utils/scopeFilter';
import { useAuth } from '../../context/AuthContext';
import { calculateAttentionScore } from '../../utils/centerAttentionScore';
import { mockOperationsIncidents } from '../../data/mockOperations';
import { mockUsers } from '../../data/mockUsers';
import MapPickerWithDrawing from '../../components/MapPickerWithDrawing';

const REGIONS = ["Addis Ababa", "Oromia", "Amhara", "Tigray", "SNNPR", "Afar", "Somali", "Gambela", "Harari", "Dire Dawa"];
const ITEMS_PER_PAGE = 30;

function CentersListEnhanced() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [jurisdictionFilter, setJurisdictionFilter] = useState({ region: 'all', zone: 'all', subCity: 'all', woreda: 'all' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [hasIncidentsFilter, setHasIncidentsFilter] = useState('all');
  const [deviceHealthFilter, setDeviceHealthFilter] = useState('all');
  const [sortBy, setSortBy] = useState('attention_score');
  const [activeTab, setActiveTab] = useState('centers'); // 'centers', 'users', 'machines'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isMachineModalOpen, setIsMachineModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [machinePage, setMachinePage] = useState(1);
  const [createdCenters, setCreatedCenters] = useState(() => {
    // Load from localStorage on mount
    try {
      const stored = localStorage.getItem('createdCenters');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  const [createdUsers, setCreatedUsers] = useState(() => {
    try {
      const stored = localStorage.getItem('createdUsers');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  const [createdMachines, setCreatedMachines] = useState(() => {
    try {
      const stored = localStorage.getItem('createdMachines');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  
  // Persist to localStorage whenever createdCenters changes
  useEffect(() => {
    localStorage.setItem('createdCenters', JSON.stringify(createdCenters));
  }, [createdCenters]);
  
  // Persist to localStorage whenever createdUsers changes
  useEffect(() => {
    localStorage.setItem('createdUsers', JSON.stringify(createdUsers));
  }, [createdUsers]);
  
  // Persist to localStorage whenever createdMachines changes
  useEffect(() => {
    localStorage.setItem('createdMachines', JSON.stringify(createdMachines));
  }, [createdMachines]);
  const [geofenceType, setGeofenceType] = useState('circle'); // 'circle' or 'polygon'
  const [geofencePolygon, setGeofencePolygon] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [userFormErrors, setUserFormErrors] = useState({});
  const [machineFormErrors, setMachineFormErrors] = useState({});
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

  const userScope = useMemo(() => getUserScope(user), [user]);

  // Combine mock users with created users
  const allUsers = useMemo(() => {
    return [...mockUsers, ...createdUsers];
  }, [createdUsers]);

  // Combine mock machines with created machines (filter for machine type only)
  const allMachines = useMemo(() => {
    const mockMachines = mockDevices.filter(d => d.device_type === 'machine');
    return [...mockMachines, ...createdMachines];
  }, [createdMachines]);

  // User form state
  const [userForm, setUserForm] = useState({
    fullName: "",
    email: "",
    role: "Inspector",
    centerId: "",
    status: "Active",
    password: "",
    confirmPassword: "",
  });

  // Machine form state
  const [machineForm, setMachineForm] = useState({
    centerId: "",
    device_type: "machine",
    manufacturer: "",
    model: "",
    serial_number: "",
    lane_id: "",
    firmware_version: "",
    maintenance_due_at: "",
    calibration_due_at: "",
    status: "Active",
  });

  // Combine mock centers with created centers
  const allCenters = useMemo(() => {
    return [...mockCentersFull, ...createdCenters];
  }, [createdCenters]);

  // Filter centers by scope
  const scopedCenters = useMemo(() => {
    const filtered = filterCentersByScope(allCenters, userScope);
    return filtered.map((center) => {
      const centerIncidents = mockOperationsIncidents.filter(
        inc => inc.scope?.centerId === center.center_id
      );
      const attention = calculateAttentionScore(
        { ...center, status: center.status },
        centerIncidents
      );
      return {
        ...center,
        jurisdiction_path: getCenterJurisdictionPath(center),
        attention_score: attention.score,
      };
    });
  }, [allCenters, userScope]);

  // Apply filters
  const filteredCenters = useMemo(() => {
    // Separate newly created centers (always show at top, regardless of filters)
    const newlyCreated = scopedCenters.filter(c => 
      createdCenters.some(cc => cc.center_id === c.center_id)
    );
    
    // Get other centers
    const otherCenters = scopedCenters.filter(c => 
      !createdCenters.some(cc => cc.center_id === c.center_id)
    );
    
    let filtered = [...otherCenters];

    // Search - includes name, code, TIN, business license, owner name
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.center_name_en?.toLowerCase().includes(query) ||
        c.center_name_am?.toLowerCase().includes(query) ||
        c.center_code?.toLowerCase().includes(query) ||
        c.tin?.toLowerCase().includes(query) ||
        c.businessLicenseNo?.toLowerCase().includes(query) ||
        c.business_license_no?.toLowerCase().includes(query) ||
        c.ownerCompanyName?.toLowerCase().includes(query) ||
        c.owner_company_name?.toLowerCase().includes(query) ||
        c.tradeName?.toLowerCase().includes(query) ||
        c.trade_name?.toLowerCase().includes(query)
      );
    }

    // Jurisdiction filters
    if (jurisdictionFilter.region !== 'all') {
      filtered = filtered.filter(c => c.region_id === jurisdictionFilter.region);
    }
    if (jurisdictionFilter.zone !== 'all') {
      filtered = filtered.filter(c => c.zone_id === jurisdictionFilter.zone);
    }
    if (jurisdictionFilter.subCity !== 'all') {
      filtered = filtered.filter(c => c.sub_city_id === jurisdictionFilter.subCity);
    }
    if (jurisdictionFilter.woreda !== 'all') {
      filtered = filtered.filter(c => c.woreda_id === jurisdictionFilter.woreda);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    // Incidents filter
    if (hasIncidentsFilter === 'yes') {
      filtered = filtered.filter(c => c.open_incidents_count.total > 0);
    } else if (hasIncidentsFilter === 'critical') {
      filtered = filtered.filter(c => c.open_incidents_count.critical > 0);
    } else if (hasIncidentsFilter === 'high') {
      filtered = filtered.filter(c => c.open_incidents_count.high > 0);
    }

    // Device health filter (simplified - would check actual device status)
    if (deviceHealthFilter === 'camera_down') {
      // In real app, would check camera devices
      filtered = filtered.filter(c => c.status !== 'Online');
    } else if (deviceHealthFilter === 'machine_down') {
      // In real app, would check machine devices
      filtered = filtered.filter(c => c.status === 'Degraded' || c.status === 'Offline');
    }

    // Sort newly created centers by creation date (newest first)
    newlyCreated.sort((a, b) => {
      const aDate = new Date(a.created_at || 0);
      const bDate = new Date(b.created_at || 0);
      return bDate - aDate;
    });
    
    // Sort filtered centers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'status':
          const statusOrder = { Online: 0, Degraded: 1, Offline: 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        case 'last_online':
          return new Date(b.last_heartbeat_at) - new Date(a.last_heartbeat_at);
        case 'incident_count':
          return b.open_incidents_count.total - a.open_incidents_count.total;
        case 'attention_score':
        default:
          return b.attention_score - a.attention_score;
      }
    });

    // Combine: newly created centers first, then filtered centers
    return [...newlyCreated, ...filtered];
  }, [scopedCenters, searchQuery, jurisdictionFilter, statusFilter, hasIncidentsFilter, deviceHealthFilter, sortBy, createdCenters]);

  // Pagination
  const totalPages = Math.ceil(filteredCenters.length / ITEMS_PER_PAGE);
  const paginatedCenters = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const sliced = filteredCenters.slice(startIndex, endIndex);
    // Add list numbers based on pagination
    return sliced.map((center, index) => ({
      ...center,
      listNumber: startIndex + index + 1,
    }));
  }, [filteredCenters, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, jurisdictionFilter.region, jurisdictionFilter.zone, jurisdictionFilter.subCity, jurisdictionFilter.woreda, statusFilter, hasIncidentsFilter, deviceHealthFilter, sortBy]);

  const getStatusBadge = (status) => {
    const config = {
      Online: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      Degraded: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertCircle },
      Offline: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
    };
    const c = config[status] || config.Offline;
    const Icon = c.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const formatLastHeartbeat = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-ET');
  };

  // Get available regions/zones/etc for filters
  const regions = useMemo(() => 
    mockAdminUnits.filter(u => u.admin_unit_type === 'Region' && u.status === 'Active'),
    []
  );

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setJurisdictionFilter({ region: 'all', zone: 'all', subCity: 'all', woreda: 'all' });
    setStatusFilter('all');
    setHasIncidentsFilter('all');
    setDeviceHealthFilter('all');
    setSortBy('attention_score');
    setCurrentPage(1);
  };

  // Handle user creation
  const handleOpenUserModal = () => {
    setUserFormErrors({});
    setUserForm({
      fullName: "",
      email: "",
      role: "Inspector",
      centerId: "",
      status: "Active",
      password: "",
      confirmPassword: "",
    });
    setIsUserModalOpen(true);
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    
    const errors = {};
    if (!userForm.fullName.trim()) errors.fullName = 'Full name is required';
    if (!userForm.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!userForm.centerId) errors.centerId = 'Center is required';
    if (!userForm.password) errors.password = 'Password is required';
    else if (userForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (userForm.password !== userForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setUserFormErrors(errors);
      return;
    }

    const selectedCenter = [...mockCentersFull, ...createdCenters].find(c => c.center_id === userForm.centerId);
    const newUser = {
      id: `U-${String(createdUsers.length + 100).padStart(3, "0")}`,
      fullName: userForm.fullName,
      email: userForm.email,
      role: userForm.role,
      scopeType: "Center",
      scopeValue: selectedCenter?.center_name_en || userForm.centerId,
      centerId: userForm.centerId,
      status: userForm.status,
      password: userForm.password, // In real app, this would be hashed
      created_at: new Date().toISOString(),
    };

    setCreatedUsers(prev => [...prev, newUser]);
    setUserFormErrors({});
    setIsUserModalOpen(false);
    alert(`User "${userForm.fullName}" has been created successfully!`);
  };

  // Handle machine creation
  const handleOpenMachineModal = () => {
    setMachineFormErrors({});
    setMachineForm({
      centerId: "",
      device_type: "machine",
      manufacturer: "",
      model: "",
      serial_number: "",
      lane_id: "",
      firmware_version: "",
      maintenance_due_at: "",
      calibration_due_at: "",
      status: "Active",
    });
    setIsMachineModalOpen(true);
  };

  const handleMachineSubmit = (e) => {
    e.preventDefault();
    
    const errors = {};
    if (!machineForm.centerId) errors.centerId = 'Center is required';
    if (!machineForm.manufacturer.trim()) errors.manufacturer = 'Manufacturer is required';
    if (!machineForm.model.trim()) errors.model = 'Model is required';
    if (!machineForm.serial_number.trim()) errors.serial_number = 'Serial number is required';
    if (!machineForm.firmware_version.trim()) errors.firmware_version = 'Firmware version is required';

    if (Object.keys(errors).length > 0) {
      setMachineFormErrors(errors);
      return;
    }

    const newMachine = {
      device_id: `MACH-${String(createdMachines.length + 100).padStart(3, "0")}`,
      device_type: 'machine',
      manufacturer: machineForm.manufacturer,
      model: machineForm.model,
      serial_number: machineForm.serial_number,
      center_id: machineForm.centerId,
      lane_id: machineForm.lane_id || null,
      installed_at: new Date().toISOString(),
      status: machineForm.status,
      connectivity_status: 'Online',
      last_seen_at: new Date().toISOString(),
      firmware_version: machineForm.firmware_version,
      maintenance_due_at: machineForm.maintenance_due_at || null,
      calibration_due_at: machineForm.calibration_due_at || null,
      created_at: new Date().toISOString(),
    };

    setCreatedMachines(prev => [...prev, newMachine]);
    setMachineFormErrors({});
    setIsMachineModalOpen(false);
    alert(`Machine "${machineForm.model}" has been created successfully!`);
  };

  const handleOpenModal = () => {
    setFormErrors({});
    setForm({
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
    setGeofenceType('circle');
    setGeofencePolygon([]);
    setIsModalOpen(true);
  };

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
    
    // Basic Information - Required fields only
    if (!form.name.trim()) errors.name = 'Center name is required';
    if (!form.region) errors.region = 'Region is required';
    if (!form.lat || !form.lng) errors.location = 'Location coordinates are required';
    if (geofenceType === 'circle' && (!form.radius || form.radius < 100)) {
      errors.radius = 'Radius must be at least 100 meters';
    }
    if (geofenceType === 'polygon' && geofencePolygon.length < 3) {
      errors.polygon = 'Polygon must have at least 3 points';
    }
    
    // Business Registration - Required fields only
    if (!form.tin.trim()) errors.tin = 'TIN is required';
    if (!form.principalRegistrationNo.trim()) errors.principalRegistrationNo = 'Principal Registration No. is required';
    if (!form.businessLicenseNo.trim()) errors.businessLicenseNo = 'Business License No. is required';
    if (!form.businessLicenseDateOfIssuance) errors.businessLicenseDateOfIssuance = 'Business License Date of Issuance is required';
    if (!form.placeOfIssue.trim()) errors.placeOfIssue = 'Place of Issue is required';
    if (!form.dateOfIssue) errors.dateOfIssue = 'Date of Issue is required';
    
    // Owner/Company Information - Required fields only
    if (!form.ownerCompanyName.trim()) errors.ownerCompanyName = 'Owner/Company Name is required';
    if (!form.nationality.trim()) errors.nationality = 'Nationality is required';
    if (!form.generalManagerName.trim()) errors.generalManagerName = 'General Manager Name is required';
    
    // Location Details - Required fields only
    if (!form.zoneSubCity.trim()) errors.zoneSubCity = 'Zone/Sub City is required';
    if (!form.woreda.trim()) errors.woreda = 'Woreda is required';
    if (!form.kebele.trim()) errors.kebele = 'Kebele is required';
    if (!form.houseNo.trim()) errors.houseNo = 'House No. is required';
    
    // Contact Information - Required fields only
    if (!form.telephone.trim()) errors.telephone = 'Telephone is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Business Details - Required fields only
    if (!form.fieldOfBusiness.trim()) errors.fieldOfBusiness = 'Field of Business is required';
    if (!form.capitalInETB || parseFloat(form.capitalInETB) <= 0) {
      errors.capitalInETB = 'Capital in ETB is required and must be greater than 0';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form - get errors first
    const errors = {};
    
    // Basic Information - Required fields only
    if (!form.name.trim()) errors.name = 'Center name is required';
    if (!form.region) errors.region = 'Region is required';
    if (!form.lat || !form.lng) errors.location = 'Location coordinates are required';
    if (geofenceType === 'circle' && (!form.radius || form.radius < 100)) {
      errors.radius = 'Radius must be at least 100 meters';
    }
    if (geofenceType === 'polygon' && geofencePolygon.length < 3) {
      errors.polygon = 'Polygon must have at least 3 points';
    }
    
    // Business Registration - Required fields only
    if (!form.tin.trim()) errors.tin = 'TIN is required';
    if (!form.principalRegistrationNo.trim()) errors.principalRegistrationNo = 'Principal Registration No. is required';
    if (!form.businessLicenseNo.trim()) errors.businessLicenseNo = 'Business License No. is required';
    if (!form.businessLicenseDateOfIssuance) errors.businessLicenseDateOfIssuance = 'Business License Date of Issuance is required';
    if (!form.placeOfIssue.trim()) errors.placeOfIssue = 'Place of Issue is required';
    if (!form.dateOfIssue) errors.dateOfIssue = 'Date of Issue is required';
    
    // Owner/Company Information - Required fields only
    if (!form.ownerCompanyName.trim()) errors.ownerCompanyName = 'Owner/Company Name is required';
    if (!form.nationality.trim()) errors.nationality = 'Nationality is required';
    if (!form.generalManagerName.trim()) errors.generalManagerName = 'General Manager Name is required';
    
    // Location Details - Required fields only
    if (!form.zoneSubCity.trim()) errors.zoneSubCity = 'Zone/Sub City is required';
    if (!form.woreda.trim()) errors.woreda = 'Woreda is required';
    if (!form.kebele.trim()) errors.kebele = 'Kebele is required';
    if (!form.houseNo.trim()) errors.houseNo = 'House No. is required';
    
    // Contact Information - Required fields only
    if (!form.telephone.trim()) errors.telephone = 'Telephone is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Business Details - Required fields only
    if (!form.fieldOfBusiness.trim()) errors.fieldOfBusiness = 'Field of Business is required';
    if (!form.capitalInETB || parseFloat(form.capitalInETB) <= 0) {
      errors.capitalInETB = 'Capital in ETB is required and must be greater than 0';
    }
    
    // If there are errors, set them and return
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`) || 
                          document.querySelector(`[data-field="${firstErrorField}"]`) ||
                          document.getElementById(firstErrorField);
      if (errorElement) {
        setTimeout(() => {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorElement.focus();
        }, 100);
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
      // Documents (store file names/paths)
      documents: {
        businessLicense: form.documents.businessLicense?.name,
        registrationCertificate: form.documents.registrationCertificate?.name,
        taxCertificate: form.documents.taxCertificate?.name,
        otherDocuments: form.documents.otherDocuments.map(f => f.name),
      },
      // Default values for compatibility
      active_lanes_count: 0,
      open_incidents_count: { total: 0, critical: 0, high: 0, medium: 0, low: 0 },
      last_heartbeat_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    // Add to created centers
    setCreatedCenters(prev => [...prev, newCenter]);
    
    // Clear form errors
    setFormErrors({});
    
    // Reset form to initial state
    setForm({
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
    setGeofenceType('circle');
    setGeofencePolygon([]);
    
    // Close modal
    setIsModalOpen(false);
    
    // Reset to first page to show the new center at the top (don't clear search or filters)
    setCurrentPage(1);
    
    // Show success message
    alert(`Center "${newCenter.center_name_en}" has been created successfully!`);
  };

  return (
    <div className="w-full space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Centers & Infrastructure</h1>
          <p className="text-gray-600">
            Manage inspection centers and infrastructure within your scope
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenUserModal}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00a86b] to-[#00c97a] text-white text-sm font-medium px-5 py-2.5 hover:from-[#00965a] hover:to-[#00b86a] transition-all shadow-sm"
          >
            <UserPlus className="h-4 w-4" />
            Create User
          </button>
          <button
            type="button"
            onClick={handleOpenMachineModal}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00965a] to-[#00a86b] text-white text-sm font-medium px-5 py-2.5 hover:from-[#008550] hover:to-[#00965a] transition-all shadow-sm"
          >
            <Settings className="h-4 w-4" />
            Create Machine
          </button>
          <button
            type="button"
            onClick={handleOpenModal}
            className="inline-flex items-center gap-2 rounded-lg bg-[#005f40] text-white text-sm font-medium px-5 py-2.5 hover:bg-[#004d33] transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Create New Center
          </button>
        </div>
      </div>

      {/* Filters - Only show for Centers tab */}
      {activeTab === 'centers' && (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or code..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
            >
              <option value="all">All Status</option>
              <option value="Online">Online</option>
              <option value="Degraded">Degraded</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
            >
              <option value="attention_score">Sort by Attention</option>
              <option value="status">Sort by Status</option>
              <option value="last_online">Sort by Last Online</option>
              <option value="incident_count">Sort by Incidents</option>
            </select>
          </div>
        </div>

        {/* Jurisdiction Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Region</label>
            <select
              value={jurisdictionFilter.region}
              onChange={(e) => setJurisdictionFilter({ ...jurisdictionFilter, region: e.target.value, zone: 'all', subCity: 'all', woreda: 'all' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
            >
              <option value="all">All Regions</option>
              {regions.map(region => (
                <option key={region.admin_unit_id} value={region.admin_unit_id}>
                  {region.admin_unit_name_en}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Zone</label>
            <select
              value={jurisdictionFilter.zone}
              onChange={(e) => setJurisdictionFilter({ ...jurisdictionFilter, zone: e.target.value, subCity: 'all', woreda: 'all' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
              disabled={jurisdictionFilter.region === 'all'}
            >
              <option value="all">All Zones</option>
              {jurisdictionFilter.region !== 'all' && mockAdminUnits
                .filter(u => u.parent_admin_unit_id === jurisdictionFilter.region && u.admin_unit_type === 'Zone')
                .map(zone => (
                  <option key={zone.admin_unit_id} value={zone.admin_unit_id}>
                    {zone.admin_unit_name_en}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Sub-city</label>
            <select
              value={jurisdictionFilter.subCity}
              onChange={(e) => setJurisdictionFilter({ ...jurisdictionFilter, subCity: e.target.value, woreda: 'all' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
              disabled={jurisdictionFilter.region === 'all'}
            >
              <option value="all">All Sub-cities</option>
              {jurisdictionFilter.region !== 'all' && mockAdminUnits
                .filter(u => u.parent_admin_unit_id === jurisdictionFilter.region && u.admin_unit_type === 'Sub-city')
                .map(subCity => (
                  <option key={subCity.admin_unit_id} value={subCity.admin_unit_id}>
                    {subCity.admin_unit_name_en}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Woreda</label>
            <select
              value={jurisdictionFilter.woreda}
              onChange={(e) => setJurisdictionFilter({ ...jurisdictionFilter, woreda: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
              disabled={jurisdictionFilter.zone === 'all' && jurisdictionFilter.subCity === 'all'}
            >
              <option value="all">All Woredas</option>
              {(jurisdictionFilter.zone !== 'all' || jurisdictionFilter.subCity !== 'all') && mockAdminUnits
                .filter(u => {
                  const parentId = jurisdictionFilter.zone !== 'all' ? jurisdictionFilter.zone : jurisdictionFilter.subCity;
                  return u.parent_admin_unit_id === parentId && u.admin_unit_type === 'Woreda';
                })
                .map(woreda => (
                  <option key={woreda.admin_unit_id} value={woreda.admin_unit_id}>
                    {woreda.admin_unit_name_en}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Additional Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Has Incidents</label>
            <select
              value={hasIncidentsFilter}
              onChange={(e) => setHasIncidentsFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
            >
              <option value="all">All</option>
              <option value="yes">Yes</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Device Health</label>
            <select
              value={deviceHealthFilter}
              onChange={(e) => setDeviceHealthFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
            >
              <option value="all">All</option>
              <option value="camera_down">Camera Down</option>
              <option value="machine_down">Machine Down</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="flex justify-end pt-2 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClearFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Clear All Filters
          </button>
      </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('centers')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'centers'
                  ? 'border-[#005f40] text-[#005f40]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Centers ({filteredCenters.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'users'
                  ? 'border-[#00c97a] text-[#00c97a]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users ({allUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('machines')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'machines'
                  ? 'border-[#00a86b] text-[#00a86b]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Machines ({allMachines.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Centers Tab Content */}
      {activeTab === 'centers' && (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
              Centers ({filteredCenters.length} total)
          </h2>
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredCenters.length)} of {filteredCenters.length}
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-16">#</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Center</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Jurisdiction</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Last Heartbeat</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Incidents</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Attention</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Lanes</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCenters.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                    No centers found matching your filters
                  </td>
                </tr>
              ) : (
                paginatedCenters.map((center, index) => (
                  <tr
                    key={center.center_id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => navigate(`/center-management/${center.center_id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {((currentPage - 1) * ITEMS_PER_PAGE) + index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {center.center_name_en}
                      </div>
                      {center.center_code && (
                        <div className="text-xs text-gray-500">{center.center_code}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {center.jurisdiction_path}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(center.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatLastHeartbeat(center.last_heartbeat_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {center.open_incidents_count.critical > 0 && (
                          <span className="text-xs font-medium text-red-600">
                            {center.open_incidents_count.critical} Critical
                          </span>
                        )}
                        {center.open_incidents_count.high > 0 && (
                          <span className="text-xs font-medium text-orange-600">
                            {center.open_incidents_count.high} High
                          </span>
                        )}
                        <span className="text-sm text-gray-600">
                          {center.open_incidents_count.total} total
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
                          <div
                            className={`h-2 rounded-full ${
                              center.attention_score >= 70 ? 'bg-red-500' :
                              center.attention_score >= 50 ? 'bg-orange-500' :
                              center.attention_score >= 30 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(100, center.attention_score)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {center.attention_score}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {center.active_lanes_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/center-management/${center.center_id}`);
                        }}
                        className="text-[#009639] hover:text-[#007A2F]"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredCenters.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
      </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-[#005f40] text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
              )}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        </div>
      )}

      {/* Users Tab Content */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Users ({allUsers.length} total)
            </h2>
            <div className="text-sm text-gray-600">
              Showing {((userPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(userPage * ITEMS_PER_PAGE, allUsers.length)} of {allUsers.length}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">#</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Full Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Scope</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Center</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allUsers.slice((userPage - 1) * ITEMS_PER_PAGE, userPage * ITEMS_PER_PAGE).map((user, index) => {
                  const center = allCenters.find(c => c.center_id === user.centerId || c.center_name_en === user.scopeValue);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {((userPage - 1) * ITEMS_PER_PAGE) + index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email || `${user.fullName.toLowerCase().replace(/\s+/g, '.')}@rsifs.gov.et`}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.scopeType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{center?.center_name_en || user.scopeValue || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {Math.ceil(allUsers.length / ITEMS_PER_PAGE) > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {userPage} of {Math.ceil(allUsers.length / ITEMS_PER_PAGE)}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUserPage(prev => Math.max(1, prev - 1))}
                  disabled={userPage === 1}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <button
                  onClick={() => setUserPage(prev => Math.min(Math.ceil(allUsers.length / ITEMS_PER_PAGE), prev + 1))}
                  disabled={userPage >= Math.ceil(allUsers.length / ITEMS_PER_PAGE)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Machines Tab Content */}
      {activeTab === 'machines' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Machines ({allMachines.length} total)
            </h2>
            <div className="text-sm text-gray-600">
              Showing {((machinePage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(machinePage * ITEMS_PER_PAGE, allMachines.length)} of {allMachines.length}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">#</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Device ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Model</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Manufacturer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Serial Number</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Center</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Lane</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Connectivity</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allMachines.slice((machinePage - 1) * ITEMS_PER_PAGE, machinePage * ITEMS_PER_PAGE).map((machine, index) => {
                  const center = allCenters.find(c => c.center_id === machine.center_id);
                  return (
                    <tr key={machine.device_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {((machinePage - 1) * ITEMS_PER_PAGE) + index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{machine.device_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{machine.model}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{machine.manufacturer}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-mono">{machine.serial_number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{center?.center_name_en || machine.center_id || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{machine.lane_id || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          machine.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : machine.status === 'Maintenance'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {machine.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          machine.connectivity_status === 'Online' 
                            ? 'bg-green-100 text-green-800' 
                            : machine.connectivity_status === 'Degraded'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {machine.connectivity_status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {Math.ceil(allMachines.length / ITEMS_PER_PAGE) > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {machinePage} of {Math.ceil(allMachines.length / ITEMS_PER_PAGE)}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMachinePage(prev => Math.max(1, prev - 1))}
                  disabled={machinePage === 1}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <button
                  onClick={() => setMachinePage(prev => Math.min(Math.ceil(allMachines.length / ITEMS_PER_PAGE), prev + 1))}
                  disabled={machinePage >= Math.ceil(allMachines.length / ITEMS_PER_PAGE)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Center Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-6xl rounded-xl bg-white shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-900">Create New Inspection Center</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Error Summary */}
              {Object.keys(formErrors).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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
              
              {/* Basic Information Section */}
              <div className="space-y-4">
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
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors ${
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
                        setForm({ ...form, region: e.target.value });
                        if (formErrors.region) setFormErrors({ ...formErrors, region: '' });
                      }}
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors ${
                        formErrors.region ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select region</option>
                      {REGIONS.map((region) => (
                        <option key={region} value={region}>
                          {region}
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
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors"
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>

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
                        onChange={(e) => setForm({ ...form, radius: Number(e.target.value) })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#005f40]"
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">100 m</span>
                        <span className="text-sm font-semibold text-gray-900">{form.radius} m</span>
                        <span className="text-xs text-gray-500">2000 m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Registration Section */}
              <div className="space-y-4">
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
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors ${
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
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors"
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
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors ${
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
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors ${
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
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors ${
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
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors ${
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
                      Date of Issue *
                    </label>
                    <input
                      type="date"
                      required
                      value={form.dateOfIssue}
                      onChange={(e) => {
                        setForm({ ...form, dateOfIssue: e.target.value });
                        if (formErrors.dateOfIssue) setFormErrors({ ...formErrors, dateOfIssue: '' });
                      }}
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors ${
                        formErrors.dateOfIssue ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.dateOfIssue && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.dateOfIssue}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Commercial Registration & Business License Procedure
                    </label>
                    <textarea
                      value={form.commercialRegistrationProcedure}
                      onChange={(e) => setForm({ ...form, commercialRegistrationProcedure: e.target.value })}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors"
                      placeholder="Enter commercial registration and business license procedure details"
                    />
                  </div>
                </div>
              </div>

              {/* Owner/Company Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Owner/Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Owner/Company Name *
                    </label>
                    <input
                      type="text"
                      name="ownerCompanyName"
                      required
                      value={form.ownerCompanyName}
                      onChange={(e) => {
                        setForm({ ...form, ownerCompanyName: e.target.value });
                        if (formErrors.ownerCompanyName) setFormErrors({ ...formErrors, ownerCompanyName: '' });
                      }}
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors ${
                        formErrors.ownerCompanyName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter owner or company name"
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
                      Nationality *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.nationality}
                      onChange={(e) => {
                        setForm({ ...form, nationality: e.target.value });
                        if (formErrors.nationality) setFormErrors({ ...formErrors, nationality: '' });
                      }}
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors ${
                        formErrors.nationality ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter nationality"
                    />
                    {formErrors.nationality && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.nationality}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Trade Name
                    </label>
                    <input
                      type="text"
                      value={form.tradeName}
                      onChange={(e) => setForm({ ...form, tradeName: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors"
                      placeholder="Enter trade name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      General Manager Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.generalManagerName}
                      onChange={(e) => {
                        setForm({ ...form, generalManagerName: e.target.value });
                        if (formErrors.generalManagerName) setFormErrors({ ...formErrors, generalManagerName: '' });
                      }}
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors ${
                        formErrors.generalManagerName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter general manager name"
                    />
                    {formErrors.generalManagerName && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.generalManagerName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Location Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Zone / Sub City *
                    </label>
                    <input
                      type="text"
                      name="zoneSubCity"
                      required
                      value={form.zoneSubCity}
                      onChange={(e) => {
                        setForm({ ...form, zoneSubCity: e.target.value });
                        if (formErrors.zoneSubCity) setFormErrors({ ...formErrors, zoneSubCity: '' });
                      }}
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors ${
                        formErrors.zoneSubCity ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter zone or sub city"
                    />
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
                    <input
                      type="text"
                      name="woreda"
                      required
                      value={form.woreda}
                      onChange={(e) => {
                        setForm({ ...form, woreda: e.target.value });
                        if (formErrors.woreda) setFormErrors({ ...formErrors, woreda: '' });
                      }}
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors ${
                        formErrors.woreda ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter woreda"
                    />
                    {formErrors.woreda && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.woreda}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Kebele *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.kebele}
                      onChange={(e) => {
                        setForm({ ...form, kebele: e.target.value });
                        if (formErrors.kebele) setFormErrors({ ...formErrors, kebele: '' });
                      }}
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors ${
                        formErrors.kebele ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter kebele"
                    />
                    {formErrors.kebele && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.kebele}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      House No. *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.houseNo}
                      onChange={(e) => {
                        setForm({ ...form, houseNo: e.target.value });
                        if (formErrors.houseNo) setFormErrors({ ...formErrors, houseNo: '' });
                      }}
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors ${
                        formErrors.houseNo ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter house number"
                    />
                    {formErrors.houseNo && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.houseNo}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Telephone No. *
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      required
                      value={form.telephone}
                      onChange={(e) => {
                        setForm({ ...form, telephone: e.target.value });
                        if (formErrors.telephone) setFormErrors({ ...formErrors, telephone: '' });
                      }}
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors ${
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
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors"
                      placeholder="Enter fax number"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                      }}
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors ${
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

              {/* Business Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Business Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Field of Business *
                    </label>
                    <input
                      type="text"
                      name="fieldOfBusiness"
                      required
                      value={form.fieldOfBusiness}
                      onChange={(e) => {
                        setForm({ ...form, fieldOfBusiness: e.target.value });
                        if (formErrors.fieldOfBusiness) setFormErrors({ ...formErrors, fieldOfBusiness: '' });
                      }}
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors ${
                        formErrors.fieldOfBusiness ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter field of business"
                    />
                    {formErrors.fieldOfBusiness && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.fieldOfBusiness}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Capital in ETB *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={form.capitalInETB}
                      onChange={(e) => {
                        setForm({ ...form, capitalInETB: e.target.value });
                        if (formErrors.capitalInETB) setFormErrors({ ...formErrors, capitalInETB: '' });
                      }}
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors ${
                        formErrors.capitalInETB ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter capital in ETB"
                    />
                    {formErrors.capitalInETB && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.capitalInETB}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Telebirr Number
                    </label>
                    <input
                      type="text"
                      value={form.telebirrNumber}
                      onChange={(e) => setForm({ ...form, telebirrNumber: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors"
                      placeholder="Enter Telebirr number"
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
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors"
                      placeholder="Enter camera configuration details"
                    />
                  </div>
                </div>
              </div>

              {/* Document Attachments Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Document Attachments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Business License */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Business License
                    </label>
                    {form.documents.businessLicense ? (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <FileText className="h-5 w-5 text-gray-600" />
                        <span className="flex-1 text-sm text-gray-900">{form.documents.businessLicense.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile('businessLicense')}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Click to upload</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload('businessLicense', e.target.files[0])}
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
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <FileText className="h-5 w-5 text-gray-600" />
                        <span className="flex-1 text-sm text-gray-900">{form.documents.registrationCertificate.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile('registrationCertificate')}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Click to upload</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload('registrationCertificate', e.target.files[0])}
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
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <FileText className="h-5 w-5 text-gray-600" />
                        <span className="flex-1 text-sm text-gray-900">{form.documents.taxCertificate.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile('taxCertificate')}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Click to upload</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload('taxCertificate', e.target.files[0])}
                        />
                      </label>
                    )}
                  </div>

                  {/* Other Documents */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Other Documents
                    </label>
                    <div className="space-y-2">
                      {form.documents.otherDocuments.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <FileText className="h-5 w-5 text-gray-600" />
                          <span className="flex-1 text-sm text-gray-900">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveOtherDocument(index)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-3 pb-3">
                          <Upload className="h-6 w-6 text-gray-400 mb-1" />
                          <p className="text-xs text-gray-500">Add document</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleAddOtherDocument(e.target.files[0])}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map and Coordinates Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Geographic Location & Geofence</h3>
                
                {/* Geofence Type Selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Geofence Type *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="geofenceType"
                        value="circle"
                        checked={geofenceType === 'circle'}
                        onChange={(e) => setGeofenceType(e.target.value)}
                        className="w-4 h-4 text-[#005f40] focus:ring-[#005f40]"
                      />
                      <span className="text-sm text-gray-700">Circle (Radius)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="geofenceType"
                        value="polygon"
                        checked={geofenceType === 'polygon'}
                        onChange={(e) => setGeofenceType(e.target.value)}
                        className="w-4 h-4 text-[#005f40] focus:ring-[#005f40]"
                      />
                      <span className="text-sm text-gray-700">Polygon (Custom Area)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Set Location on Map *
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    {geofenceType === 'circle' 
                      ? 'Click on the map to set the center coordinates. Adjust the radius slider to set the geo-fence area.'
                      : 'Click on the map to set the center location, then click multiple points to draw the geofence polygon boundary.'}
                  </p>
                  <div className={`h-96 rounded-lg border overflow-hidden ${
                    formErrors.location || formErrors.radius || formErrors.polygon ? 'border-red-300' : 'border-gray-300'
                  }`}>
                    <MapPickerWithDrawing
                      lat={form.lat}
                      lng={form.lng}
                      radius={form.radius}
                      geofenceType={geofenceType}
                      polygon={geofencePolygon}
                      onCoordinateChange={(lat, lng) => {
                        setForm({ ...form, lat, lng });
                        if (formErrors.location) setFormErrors({ ...formErrors, location: '' });
                      }}
                      onPolygonChange={(polygon) => {
                        setGeofencePolygon(polygon);
                        if (formErrors.polygon) setFormErrors({ ...formErrors, polygon: '' });
                      }}
                      className="h-full"
                    />
                  </div>
                  {formErrors.location && (
                    <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.location}
                    </p>
                  )}
                  {formErrors.radius && (
                    <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.radius}
                    </p>
                  )}
                  {formErrors.polygon && (
                    <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.polygon}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Latitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={form.lat}
                      onChange={(e) => setForm({ ...form, lat: Number(e.target.value) })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors"
                      placeholder="Enter latitude"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Longitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={form.lng}
                      onChange={(e) => setForm({ ...form, lng: Number(e.target.value) })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005f40] focus:border-transparent transition-colors"
                      placeholder="Enter longitude"
                    />
                  </div>
                </div>

                {/* Radius Slider (only for circle type) */}
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
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#005f40]"
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">100 m</span>
                        <span className="text-sm font-semibold text-gray-900">{form.radius} m</span>
                        <span className="text-xs text-gray-500">2000 m</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Polygon Info (only for polygon type) */}
                {geofenceType === 'polygon' && geofencePolygon.length > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      Polygon defined with {geofencePolygon.length} point{geofencePolygon.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#005f40] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#004d33] transition-colors shadow-sm"
                >
                  Create Center
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-900">Create New User</h2>
              <button
                type="button"
                onClick={() => setIsUserModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUserSubmit} className="p-6 space-y-6">
              {Object.keys(userFormErrors).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-red-900 mb-2">Please fix the following errors:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-800">
                        {Object.entries(userFormErrors).map(([field, error]) => (
                          <li key={field}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={userForm.fullName}
                    onChange={(e) => {
                      setUserForm({ ...userForm, fullName: e.target.value });
                      if (userFormErrors.fullName) setUserFormErrors({ ...userFormErrors, fullName: '' });
                    }}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      userFormErrors.fullName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter full name"
                  />
                  {userFormErrors.fullName && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {userFormErrors.fullName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => {
                      setUserForm({ ...userForm, email: e.target.value });
                      if (userFormErrors.email) setUserFormErrors({ ...userFormErrors, email: '' });
                    }}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      userFormErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                  {userFormErrors.email && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {userFormErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="Inspector">Inspector</option>
                    <option value="Center Manager">Center Manager</option>
                    <option value="Regional Admin">Regional Admin</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Center <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={userForm.centerId}
                    onChange={(e) => {
                      setUserForm({ ...userForm, centerId: e.target.value });
                      if (userFormErrors.centerId) setUserFormErrors({ ...userFormErrors, centerId: '' });
                    }}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      userFormErrors.centerId ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select center</option>
                    {[...mockCentersFull, ...createdCenters].map(center => (
                      <option key={center.center_id} value={center.center_id}>
                        {center.center_name_en} ({center.center_code})
                      </option>
                    ))}
                  </select>
                  {userFormErrors.centerId && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {userFormErrors.centerId}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={userForm.status}
                    onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => {
                      setUserForm({ ...userForm, password: e.target.value });
                      if (userFormErrors.password) setUserFormErrors({ ...userFormErrors, password: '' });
                    }}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      userFormErrors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter password"
                  />
                  {userFormErrors.password && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {userFormErrors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={userForm.confirmPassword}
                    onChange={(e) => {
                      setUserForm({ ...userForm, confirmPassword: e.target.value });
                      if (userFormErrors.confirmPassword) setUserFormErrors({ ...userFormErrors, confirmPassword: '' });
                    }}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      userFormErrors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm password"
                  />
                  {userFormErrors.confirmPassword && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {userFormErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-[#00a86b] to-[#00c97a] text-white px-5 py-2.5 text-sm font-medium hover:from-[#00965a] hover:to-[#00b86a] transition-all shadow-sm"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Machine Modal */}
      {isMachineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-900">Create New Machine</h2>
              <button
                type="button"
                onClick={() => setIsMachineModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleMachineSubmit} className="p-6 space-y-6">
              {Object.keys(machineFormErrors).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-red-900 mb-2">Please fix the following errors:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-800">
                        {Object.entries(machineFormErrors).map(([field, error]) => (
                          <li key={field}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Center <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={machineForm.centerId}
                    onChange={(e) => {
                      setMachineForm({ ...machineForm, centerId: e.target.value });
                      if (machineFormErrors.centerId) setMachineFormErrors({ ...machineFormErrors, centerId: '' });
                    }}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      machineFormErrors.centerId ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select center</option>
                    {[...mockCentersFull, ...createdCenters].map(center => (
                      <option key={center.center_id} value={center.center_id}>
                        {center.center_name_en} ({center.center_code})
                      </option>
                    ))}
                  </select>
                  {machineFormErrors.centerId && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {machineFormErrors.centerId}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Manufacturer <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={machineForm.manufacturer}
                    onChange={(e) => {
                      setMachineForm({ ...machineForm, manufacturer: e.target.value });
                      if (machineFormErrors.manufacturer) setMachineFormErrors({ ...machineFormErrors, manufacturer: '' });
                    }}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      machineFormErrors.manufacturer ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter manufacturer"
                  />
                  {machineFormErrors.manufacturer && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {machineFormErrors.manufacturer}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={machineForm.model}
                    onChange={(e) => {
                      setMachineForm({ ...machineForm, model: e.target.value });
                      if (machineFormErrors.model) setMachineFormErrors({ ...machineFormErrors, model: '' });
                    }}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      machineFormErrors.model ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter model"
                  />
                  {machineFormErrors.model && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {machineFormErrors.model}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Serial Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={machineForm.serial_number}
                    onChange={(e) => {
                      setMachineForm({ ...machineForm, serial_number: e.target.value });
                      if (machineFormErrors.serial_number) setMachineFormErrors({ ...machineFormErrors, serial_number: '' });
                    }}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      machineFormErrors.serial_number ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter serial number"
                  />
                  {machineFormErrors.serial_number && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {machineFormErrors.serial_number}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Lane ID
                  </label>
                  <input
                    type="text"
                    value={machineForm.lane_id}
                    onChange={(e) => setMachineForm({ ...machineForm, lane_id: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="Enter lane ID (optional)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Firmware Version <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={machineForm.firmware_version}
                    onChange={(e) => {
                      setMachineForm({ ...machineForm, firmware_version: e.target.value });
                      if (machineFormErrors.firmware_version) setMachineFormErrors({ ...machineFormErrors, firmware_version: '' });
                    }}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      machineFormErrors.firmware_version ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., v3.2.1"
                  />
                  {machineFormErrors.firmware_version && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {machineFormErrors.firmware_version}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Maintenance Due Date
                  </label>
                  <input
                    type="date"
                    value={machineForm.maintenance_due_at}
                    onChange={(e) => setMachineForm({ ...machineForm, maintenance_due_at: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Calibration Due Date
                  </label>
                  <input
                    type="date"
                    value={machineForm.calibration_due_at}
                    onChange={(e) => setMachineForm({ ...machineForm, calibration_due_at: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={machineForm.status}
                    onChange={(e) => setMachineForm({ ...machineForm, status: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsMachineModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-[#00965a] to-[#00a86b] text-white px-5 py-2.5 text-sm font-medium hover:from-[#008550] hover:to-[#00965a] transition-all shadow-sm"
                >
                  Create Machine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CentersListEnhanced;

