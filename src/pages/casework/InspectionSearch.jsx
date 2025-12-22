import { useState, useMemo } from 'react';
import { Search, Filter, Calendar, MapPin, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockInspectionRecords, filterInspectionsByScope } from '../../data/mockCasework';
import { useAuth } from '../../context/AuthContext';
import { getUserScope } from '../../utils/scopeFilter';

const INSPECTION_TYPES = ['Initial', 'Retest', 'Specialized'];
const VEHICLE_CLASSES = ['Private Car', 'Truck', 'Bus', 'Motorcycle', 'Taxi'];
const RESULTS = ['Pass', 'Fail', 'Retest Required'];
const CERTIFICATE_STATUSES = ['Valid', 'Expired', 'Voided'];

function InspectionSearch() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userScope = getUserScope(user);
  const [inspections] = useState(mockInspectionRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    plate_number: '',
    vin: '',
    certificate_number: '',
    inspection_id: '',
    center_id: 'all',
    admin_unit_id: 'all',
    date_from: '',
    date_to: '',
    inspection_type: 'all',
    vehicle_class: 'all',
    overall_result: 'all',
    certificate_status: 'all',
  });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const filteredInspections = useMemo(() => {
    let filtered = filterInspectionsByScope(inspections, userScope);
    
    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ins =>
        ins.plate_number?.toLowerCase().includes(query) ||
        ins.vin?.toLowerCase().includes(query) ||
        ins.certificate_number?.toLowerCase().includes(query) ||
        ins.inspection_id?.toLowerCase().includes(query) ||
        ins.center_name?.toLowerCase().includes(query)
      );
    }
    
    // Filter by plate
    if (filters.plate_number) {
      filtered = filtered.filter(ins =>
        ins.plate_number?.toLowerCase().includes(filters.plate_number.toLowerCase())
      );
    }
    
    // Filter by VIN
    if (filters.vin) {
      filtered = filtered.filter(ins =>
        ins.vin?.toLowerCase().includes(filters.vin.toLowerCase())
      );
    }
    
    // Filter by certificate number
    if (filters.certificate_number) {
      filtered = filtered.filter(ins =>
        ins.certificate_number?.toLowerCase().includes(filters.certificate_number.toLowerCase())
      );
    }
    
    // Filter by inspection ID
    if (filters.inspection_id) {
      filtered = filtered.filter(ins =>
        ins.inspection_id?.toLowerCase().includes(filters.inspection_id.toLowerCase())
      );
    }
    
    // Filter by center
    if (filters.center_id !== 'all') {
      filtered = filtered.filter(ins => ins.center_id === filters.center_id);
    }
    
    // Filter by date range
    if (filters.date_from) {
      filtered = filtered.filter(ins => new Date(ins.inspection_date) >= new Date(filters.date_from));
    }
    if (filters.date_to) {
      filtered = filtered.filter(ins => new Date(ins.inspection_date) <= new Date(filters.date_to));
    }
    
    // Filter by inspection type
    if (filters.inspection_type !== 'all') {
      filtered = filtered.filter(ins => ins.inspection_type === filters.inspection_type);
    }
    
    // Filter by vehicle class
    if (filters.vehicle_class !== 'all') {
      filtered = filtered.filter(ins => ins.vehicle.vehicle_class === filters.vehicle_class);
    }
    
    // Filter by result
    if (filters.overall_result !== 'all') {
      filtered = filtered.filter(ins => ins.overall_result === filters.overall_result);
    }
    
    // Filter by certificate status
    if (filters.certificate_status !== 'all') {
      const now = new Date();
      filtered = filtered.filter(ins => {
        if (filters.certificate_status === 'Valid') {
          return ins.certificate_status === 'Issued' && 
                 ins.certificate_expiry_date && 
                 new Date(ins.certificate_expiry_date) > now;
        }
        if (filters.certificate_status === 'Expired') {
          return ins.certificate_status === 'Expired' || 
                 (ins.certificate_expiry_date && new Date(ins.certificate_expiry_date) <= now);
        }
        if (filters.certificate_status === 'Voided') {
          return ins.certificate_status === 'Voided';
        }
        return true;
      });
    }
    
    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.inspection_date) - new Date(a.inspection_date);
      }
      if (sortBy === 'expiry') {
        if (!a.certificate_expiry_date) return 1;
        if (!b.certificate_expiry_date) return -1;
        return new Date(a.certificate_expiry_date) - new Date(b.certificate_expiry_date);
      }
      if (sortBy === 'flags') {
        return b.flags_count - a.flags_count;
      }
      return 0;
    });
    
    return filtered;
  }, [inspections, searchQuery, filters, sortBy, userScope]);

  const handleViewInspection = (inspection) => {
    console.log('Inspection accessed (audit logged)', { inspection_id: inspection.inspection_id, user: user?.id });
    navigate(`/inspections/${inspection.inspection_id}`);
  };

  const getResultBadge = (result) => {
    const config = {
      Pass: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      Fail: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
      'Retest Required': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertCircle },
    };
    const c = config[result] || config.Pass;
    const Icon = c.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${c.bg} ${c.text}`}>
        <Icon className="h-3 w-3" />
        {result}
      </span>
    );
  };

  const getGeofenceBadge = (band) => {
    const config = {
      GREEN: { bg: 'bg-green-100', text: 'text-green-800' },
      YELLOW: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      RED: { bg: 'bg-red-100', text: 'text-red-800' },
    };
    const c = config[band] || config.GREEN;
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.bg} ${c.text}`}>{band}</span>;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inspection Search</h1>
          <p className="text-gray-600">
            Search inspections by multiple keys for verification and investigation
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by plate number, VIN, certificate number, inspection ID, or center name..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
            >
              <option value="newest">Newest</option>
              <option value="expiry">Expiry Date</option>
              <option value="flags">Flags Count</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Plate Number</label>
              <input
                type="text"
                value={filters.plate_number}
                onChange={(e) => setFilters({ ...filters, plate_number: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">VIN</label>
              <input
                type="text"
                value={filters.vin}
                onChange={(e) => setFilters({ ...filters, vin: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Certificate Number</label>
              <input
                type="text"
                value={filters.certificate_number}
                onChange={(e) => setFilters({ ...filters, certificate_number: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Inspection ID</label>
              <input
                type="text"
                value={filters.inspection_id}
                onChange={(e) => setFilters({ ...filters, inspection_id: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Inspection Type</label>
              <select
                value={filters.inspection_type}
                onChange={(e) => setFilters({ ...filters, inspection_type: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
              >
                <option value="all">All Types</option>
                {INSPECTION_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Vehicle Class</label>
              <select
                value={filters.vehicle_class}
                onChange={(e) => setFilters({ ...filters, vehicle_class: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
              >
                <option value="all">All Classes</option>
                {VEHICLE_CLASSES.map(vc => (
                  <option key={vc} value={vc}>{vc}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Result</label>
              <select
                value={filters.overall_result}
                onChange={(e) => setFilters({ ...filters, overall_result: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
              >
                <option value="all">All Results</option>
                {RESULTS.map(result => (
                  <option key={result} value={result}>{result}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Certificate Status</label>
              <select
                value={filters.certificate_status}
                onChange={(e) => setFilters({ ...filters, certificate_status: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
              >
                <option value="all">All Status</option>
                {CERTIFICATE_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date From</label>
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date To</label>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#88bf47]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Search Results ({filteredInspections.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Inspection ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Plate Number</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Inspection Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Center</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Result</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Certificate</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Geofence</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Flags</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInspections.map(inspection => (
                <tr key={inspection.inspection_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {inspection.inspection_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {inspection.plate_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(inspection.inspection_date).toLocaleDateString('en-ET')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.center_name}</div>
                    <div className="text-xs text-gray-500">{inspection.jurisdiction_path}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getResultBadge(inspection.overall_result)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.certificate_number || 'N/A'}</div>
                    <div className="text-xs text-gray-500">
                      {inspection.certificate_status}
                      {inspection.certificate_expiry_date && (
                        <div>
                          Exp: {new Date(inspection.certificate_expiry_date).toLocaleDateString('en-ET')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getGeofenceBadge(inspection.geofence_band)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {inspection.flags_count > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        <AlertCircle className="h-3 w-3" />
                        {inspection.flags_count}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewInspection(inspection)}
                      className="text-[#88bf47] hover:text-[#0fa84a] hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InspectionSearch;












