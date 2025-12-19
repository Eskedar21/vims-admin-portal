import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserScope, filterCentersByScope, hasPermission } from '../../utils/scopeFilter';
import { calculateAttentionScore } from '../../utils/centerAttentionScore';
import { mockOperationsCenters, mockOperationsIncidents, getCenterStatus } from '../../data/mockOperations';
import OperationsMapView from '../../components/operations/OperationsMapView';
import OperationsListView from '../../components/operations/OperationsListView';
import CenterSummaryDrawer from '../../components/operations/CenterSummaryDrawer';
import CentersRequiringAttention from '../../components/operations/CentersRequiringAttention';
import AlertInbox from '../../components/operations/AlertInbox';
import { Map, List, AlertCircle, Shield } from 'lucide-react';

// Constants
const ONLINE_THRESHOLD_MIN = 2;
const OFFLINE_THRESHOLD_MIN = 10;
const REFRESH_INTERVAL_MS = 30000; // 30 seconds

function OperationsCommandCenter() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('ops_view_mode') || 'MAP';
  });
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [showCenterDrawer, setShowCenterDrawer] = useState(false);
  const [filters, setFilters] = useState({
    jurisdiction: 'all',
    status: 'all',
    incidentType: 'all',
    dateWindow: 'today',
  });
  const [sortBy, setSortBy] = useState('attention_score');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Get user scope
  const userScope = useMemo(() => getUserScope(user), [user]);

  // Check permissions
  const hasOpsPermission = useMemo(() => {
    return hasPermission(user, 'operations') || hasPermission(user, 'monitor');
  }, [user]);

  // Filter centers by scope
  const scopedCenters = useMemo(() => {
    const filtered = filterCentersByScope(mockOperationsCenters, userScope);
    return filtered.map(center => {
      const status = getCenterStatus(center);
      const centerIncidents = mockOperationsIncidents.filter(
        inc => inc.scope?.centerId === center.center_id
      );
      const attention = calculateAttentionScore(
        { ...center, status },
        centerIncidents
      );
      return {
        ...center,
        status,
        attention_score: attention.score,
        top_reasons: attention.reasons,
        severity_bucket: attention.score >= 70 ? 'Critical' : 
                        attention.score >= 50 ? 'High' : 
                        attention.score >= 30 ? 'Medium' : 'Low',
      };
    });
  }, [userScope]);

  // Filtered and sorted centers
  const filteredCenters = useMemo(() => {
    let filtered = [...scopedCenters];

    // Apply filters
    if (filters.jurisdiction !== 'all') {
      filtered = filtered.filter(c => c.region === filters.jurisdiction);
    }
    if (filters.status !== 'all') {
      filtered = filtered.filter(c => c.status === filters.status);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'attention_score':
          return b.attention_score - a.attention_score;
        case 'last_seen':
          return new Date(b.last_heartbeat_at) - new Date(a.last_heartbeat_at);
        case 'incidents':
          return b.open_incidents_count.total - a.open_incidents_count.total;
        case 'throughput':
          return b.inspections_today - a.inspections_today;
        default:
          return 0;
      }
    });

    return filtered;
  }, [scopedCenters, filters, sortBy]);

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Save view preference
  useEffect(() => {
    localStorage.setItem('ops_view_mode', viewMode);
  }, [viewMode]);

  // Audit log access
  useEffect(() => {
    if (hasOpsPermission) {
      // Log access (in real app, this would be an API call)
      console.log('Operations Command Center accessed', {
        user_id: user?.id,
        role: user?.role,
        scope: userScope,
        timestamp: new Date().toISOString(),
        session_id: sessionStorage.getItem('session_id'),
        ip_address: 'client-side', // Would be server-side in real app
      });
    }
  }, [hasOpsPermission, user, userScope]);

  // Access denied
  if (!hasOpsPermission) {
    return (
      <div className="max-w-4xl mx-auto mt-12">
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You do not have permission to access the Operations Command Center.
          </p>
          <p className="text-sm text-gray-500">
            This access attempt has been logged for security purposes.
          </p>
        </div>
      </div>
    );
  }

  const handleCenterClick = (center) => {
    setSelectedCenter(center);
    setShowCenterDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowCenterDrawer(false);
    setSelectedCenter(null);
  };

  return (
    <div className="max-w-[1920px] mx-auto w-full space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Operations Command Center
          </h1>
          <p className="text-gray-600">
            Real-time monitoring and incident management for inspection centers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            Last refresh: {lastRefresh.toLocaleTimeString()}
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('MAP')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                viewMode === 'MAP'
                  ? 'bg-[#009639] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Map className="h-4 w-4 inline mr-2" />
              Map
            </button>
            <button
              onClick={() => setViewMode('LIST')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                viewMode === 'LIST'
                  ? 'bg-[#009639] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <List className="h-4 w-4 inline mr-2" />
              List
            </button>
          </div>
        </div>
      </div>

      {/* Scope Indicator */}
      {userScope.type !== 'National' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-blue-800">
            Viewing data for scope: <strong>{userScope.type}</strong>
            {userScope.value && ` - ${userScope.value}`}
          </span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Map/List View */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filters.jurisdiction}
                onChange={(e) => setFilters({ ...filters, jurisdiction: e.target.value })}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
              >
                <option value="all">All Jurisdictions</option>
                {Array.from(new Set(scopedCenters.map(c => c.region))).map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
              >
                <option value="all">All Status</option>
                <option value="Online">Online</option>
                <option value="Degraded">Degraded</option>
                <option value="Offline">Offline</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
              >
                <option value="attention_score">Sort by Attention</option>
                <option value="last_seen">Sort by Last Seen</option>
                <option value="incidents">Sort by Incidents</option>
                <option value="throughput">Sort by Throughput</option>
              </select>
              <select
                value={filters.dateWindow}
                onChange={(e) => setFilters({ ...filters, dateWindow: e.target.value })}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
              >
                <option value="today">Today</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>

          {/* Map or List View */}
          {viewMode === 'MAP' ? (
            <OperationsMapView
              centers={filteredCenters}
              onCenterClick={handleCenterClick}
              filters={filters}
            />
          ) : (
            <OperationsListView
              centers={filteredCenters}
              onCenterClick={handleCenterClick}
              sortBy={sortBy}
              filters={filters}
            />
          )}
        </div>

        {/* Right Column - Sidebar Widgets */}
        <div className="space-y-6">
          <CentersRequiringAttention
            centers={scopedCenters}
            onCenterClick={handleCenterClick}
          />
          <AlertInbox
            alerts={mockOperationsIncidents}
            scope={userScope}
            filters={filters}
          />
        </div>
      </div>

      {/* Center Summary Drawer */}
      {showCenterDrawer && selectedCenter && (
        <CenterSummaryDrawer
          center={selectedCenter}
          onClose={handleCloseDrawer}
          onViewDetail={() => {
            navigate(`/center-management/${selectedCenter.center_id}`);
            handleCloseDrawer();
          }}
          filters={filters}
        />
      )}
    </div>
  );
}

export default OperationsCommandCenter;

