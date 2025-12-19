import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Building2,
  CheckCircle2,
  XCircle,
  DollarSign,
  Car,
  Search,
  Bell,
  Eye,
  Printer,
  AlertTriangle,
  MapPin,
  Clock,
  Users,
  Settings,
  FileText,
  Shield,
  Plus,
  RefreshCw,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { useCenters } from "../context/CentersContext";
import { useNotifications } from "../context/NotificationContext";
import { mockInspectionsExtended } from "../data/mockInspections";
import { mockIncidents, incidentTypeLabels, severityColors } from "../data/mockIncidents";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
} from "recharts";
import { batchCheckInspections } from "../utils/fraudNotificationService";
import { getUserScope, filterCentersByScope, filterInspectionsByScope, filterIncidentsByScope, hasPermission } from "../utils/scopeFilter";
import { calculateAttentionScore, getJurisdictionPath } from "../utils/centerAttentionScore";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { centers } = useCenters();
  const { addNotification, notifications } = useNotifications();

  // User scope
  const userScope = useMemo(() => getUserScope(user), [user]);

  // Global filters
  const [dateRange, setDateRange] = useState("Today");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [dataFreshness, setDataFreshness] = useState({
    lastRefreshed: new Date(),
    status: "Fresh",
    sourceHealth: "OK",
  });

  // Filter data by scope
  const scopedCenters = useMemo(() => filterCentersByScope(centers, userScope), [centers, userScope]);
  const scopedInspections = useMemo(
    () => filterInspectionsByScope(mockInspectionsExtended, userScope, centers),
    [userScope, centers]
  );
  const scopedIncidents = useMemo(() => filterIncidentsByScope(mockIncidents, userScope), [userScope]);

  // Date range filtering
  const getDateRangeFilter = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (dateRange) {
      case "Today":
        return { start: today, end: now };
      case "Yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return { start: yesterday, end: today };
      case "Last 7 days":
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return { start: weekAgo, end: now };
      case "Last 30 days":
        const monthAgo = new Date(today);
        monthAgo.setDate(monthAgo.getDate() - 30);
        return { start: monthAgo, end: now };
      default:
        return { start: null, end: null };
    }
  };

  const dateFilter = getDateRangeFilter();
  const filteredInspections = useMemo(() => {
    let filtered = scopedInspections;

    // Apply date filter
    if (dateFilter.start && dateFilter.end) {
      filtered = filtered.filter((insp) => {
        if (!insp.inspectionDate) return false;
        const inspDate = new Date(insp.inspectionDate);
        return inspDate >= dateFilter.start && inspDate <= dateFilter.end;
      });
    }

    // Apply region filter
    if (selectedRegion) {
      filtered = filtered.filter((insp) => {
        const center = centers.find((c) => c.id === insp.meta?.centerId || c.name === insp.meta?.center);
        return center?.region === selectedRegion;
      });
    }

    // Apply center filter
    if (selectedCenter) {
      filtered = filtered.filter((insp) => {
        const centerId = insp.meta?.centerId;
        const centerName = insp.meta?.center;
        return centerId === selectedCenter || centerName === selectedCenter;
      });
    }

    return filtered;
  }, [scopedInspections, dateFilter, selectedRegion, selectedCenter, centers]);

  // Filter centers by region/center selection
  const filteredCenters = useMemo(() => {
    let filtered = scopedCenters;

    if (selectedRegion) {
      filtered = filtered.filter((c) => c.region === selectedRegion);
    }

    if (selectedCenter) {
      filtered = filtered.filter((c) => c.id === selectedCenter || c.name === selectedCenter);
    }

    return filtered;
  }, [scopedCenters, selectedRegion, selectedCenter]);

  // Filter incidents by region/center selection
  const filteredIncidents = useMemo(() => {
    let filtered = scopedIncidents;

    if (selectedRegion) {
      filtered = filtered.filter((incident) => {
        const center = centers.find((c) => c.id === incident.scope?.centerId);
        return center?.region === selectedRegion;
      });
    }

    if (selectedCenter) {
      filtered = filtered.filter((incident) => {
        return incident.scope?.centerId === selectedCenter;
      });
    }

    return filtered;
  }, [scopedIncidents, selectedRegion, selectedCenter, centers]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayInspections = filteredInspections.filter((i) => {
      if (!i.inspectionDate) return false;
      const date = new Date(i.inspectionDate);
      return date >= today;
    });

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const last7DaysInspections = filteredInspections.filter((i) => {
      if (!i.inspectionDate) return false;
      return new Date(i.inspectionDate) >= last7Days;
    });

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const mtdInspections = filteredInspections.filter((i) => {
      if (!i.inspectionDate) return false;
      return new Date(i.inspectionDate) >= monthStart;
    });

    const passCount = filteredInspections.filter((i) => i.status === "Passed").length;
    const failCount = filteredInspections.filter((i) => i.status === "Failed").length;
    const totalInspections = filteredInspections.length;
    const passRate = totalInspections > 0 ? ((passCount / totalInspections) * 100).toFixed(1) : 0;

    // Calculate average inspection cycle time from filtered inspections
    const cycleTimes = filteredInspections
      .filter((i) => i.cycleTimeSeconds)
      .map((i) => i.cycleTimeSeconds / 60); // Convert to minutes
    const avgCycleTime = cycleTimes.length > 0
      ? Math.round(cycleTimes.reduce((sum, time) => sum + time, 0) / cycleTimes.length)
      : 45; // Default to 45 if no data

    const revenue = filteredInspections
      .filter((i) => i.paymentStatus === "Paid")
      .reduce((sum, i) => sum + (i.amount || 0), 0);

    const todayRevenue = todayInspections
      .filter((i) => i.paymentStatus === "Paid")
      .reduce((sum, i) => sum + (i.amount || 0), 0);

    const mtdRevenue = mtdInspections
      .filter((i) => i.paymentStatus === "Paid")
      .reduce((sum, i) => sum + (i.amount || 0), 0);

    const activeCenters = filteredCenters.filter((c) => c.status === "Online").length;
    const degradedCenters = filteredCenters.filter((c) => c.status === "Syncing" || c.status === "Degraded").length;
    const offlineCenters = filteredCenters.filter((c) => c.status === "Offline").length;

    return {
      totalInspections: {
        today: todayInspections.length,
        last7Days: last7DaysInspections.length,
        mtd: mtdInspections.length,
        all: totalInspections,
      },
      passCount,
      failCount,
      retestDue: filteredInspections.filter((i) => i.type === "Re-inspection" && i.status === "Failed").length,
      passRate: parseFloat(passRate),
      avgCycleTime,
      revenue: {
        today: todayRevenue,
        mtd: mtdRevenue,
        all: revenue,
      },
      activeCenters,
      totalCenters: filteredCenters.length,
      degradedCenters,
      offlineCenters,
    };
  }, [filteredInspections, filteredCenters]);

  // Centers requiring attention
  const centersRequiringAttention = useMemo(() => {
    return filteredCenters
      .map((center) => {
        const { score, reasons } = calculateAttentionScore(center, filteredIncidents);
        return {
          ...center,
          attentionScore: score,
          topReasons: reasons,
          lastUpdated: center.lastHeartbeat || new Date().toISOString(),
        };
      })
      .filter((c) => c.attentionScore > 0)
      .sort((a, b) => b.attentionScore - a.attentionScore)
      .slice(0, 10);
  }, [filteredCenters, filteredIncidents]);

  // Trend chart data - handles all time ranges with appropriate granularity
  const trendData = useMemo(() => {
    const data = [];
    const now = new Date();

    if (dateRange === "Today" || dateRange === "Yesterday") {
      // For Today/Yesterday, show hourly data (24 hours)
      const startDate = dateRange === "Today" 
        ? new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
        : new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0);
      
      for (let i = 0; i < 24; i++) {
        const hourStart = new Date(startDate);
        hourStart.setHours(i, 0, 0, 0);
        const hourEnd = new Date(hourStart);
        hourEnd.setHours(i + 1, 0, 0, 0);

        const hourInspections = filteredInspections.filter((insp) => {
          if (!insp.inspectionDate) return false;
          const inspDate = new Date(insp.inspectionDate);
          return inspDate >= hourStart && inspDate < hourEnd;
        });

        const passCount = hourInspections.filter((i) => i.status === "Passed").length;
        const failCount = hourInspections.filter((i) => i.status === "Failed").length;
        const revenue = hourInspections
          .filter((i) => i.paymentStatus === "Paid")
          .reduce((sum, i) => sum + (i.amount || 0), 0);

        data.push({
          date: hourStart.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          fullDate: hourStart.toISOString(),
          inspections: hourInspections.length,
          passed: passCount,
          failed: failCount,
          revenue,
        });
      }
    } else {
      // For Last 7 days and Last 30 days, show daily data
      const days = dateRange === "Last 7 days" ? 7 : 30;
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const dayInspections = filteredInspections.filter((insp) => {
          if (!insp.inspectionDate) return false;
          const inspDate = new Date(insp.inspectionDate);
          return inspDate >= date && inspDate < nextDate;
        });

        const passCount = dayInspections.filter((i) => i.status === "Passed").length;
        const failCount = dayInspections.filter((i) => i.status === "Failed").length;
        const revenue = dayInspections
          .filter((i) => i.paymentStatus === "Paid")
          .reduce((sum, i) => sum + (i.amount || 0), 0);

        data.push({
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          fullDate: date.toISOString(),
          inspections: dayInspections.length,
          passed: passCount,
          failed: failCount,
          revenue,
        });
      }
    }

    return data;
  }, [filteredInspections, dateRange]);

  // Quick actions
  const quickActions = useMemo(() => {
    const actions = [];

    // Actions available to all authenticated users
    actions.push({
      id: "view_inspections",
      label: "View Inspections",
      icon: Car,
      route: "/inspection-operations",
    });

    actions.push({
      id: "view_centers",
      label: "View Centers",
      icon: Building2,
      route: "/center-management",
    });

    actions.push({
      id: "view_reports",
      label: "View Reports",
      icon: FileText,
      route: "/reports/scorecard",
    });

    // Role-based actions
    if (hasPermission(user, "create_user")) {
      actions.push({
        id: "add_user",
        label: "Add User",
        icon: Users,
        route: "/administration",
        permission: "create_user",
      });
    }

    if (hasPermission(user, "create_center")) {
      actions.push({
        id: "create_center",
        label: "Create Inspection Center",
        icon: Plus,
        route: "/center-management/create",
        permission: "create_center",
      });
    }

    if (hasPermission(user, "view_audit")) {
      actions.push({
        id: "audit_logs",
        label: "Open Audit Logs",
        icon: Shield,
        route: "/security",
        permission: "view_audit",
      });
    }

    return actions;
  }, [user]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-ET", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  // Auto-refresh data freshness
  useEffect(() => {
    const interval = setInterval(() => {
      setDataFreshness({
        lastRefreshed: new Date(),
        status: "Fresh",
        sourceHealth: "OK",
      });
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Fraud detection
  useEffect(() => {
    const recentInspections = scopedInspections.filter((inspection) => {
      if (!inspection.inspectionDate) return false;
      const inspectionDate = new Date(inspection.inspectionDate);
      const now = new Date();
      const daysDiff = Math.floor((now - inspectionDate) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7;
    });

    batchCheckInspections(recentInspections, scopedCenters, addNotification, notifications);
  }, [scopedInspections, scopedCenters, addNotification, notifications]);

  // Get available regions for filter
  const availableRegions = useMemo(() => {
    return Array.from(new Set(scopedCenters.map((c) => c.region))).sort();
  }, [scopedCenters]);

  // Get available centers for filter
  const availableCenters = useMemo(() => {
    if (!selectedRegion) return scopedCenters;
    return scopedCenters.filter((c) => c.region === selectedRegion);
  }, [scopedCenters, selectedRegion]);

  return (
    <div className="w-full space-y-6 p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Home Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            {userScope.type === "National" ? "National Overview" : `Scope: ${userScope.type} - ${userScope.value || "All"}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500">
            Last updated: {formatTime(dataFreshness.lastRefreshed.toISOString())}
          </div>
          <button
            onClick={() => {
              setDataFreshness({
                lastRefreshed: new Date(),
                status: "Fresh",
                sourceHealth: "OK",
              });
            }}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Global Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <label className="text-sm font-medium text-gray-700">Date Range:</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>

          {userScope.type === "National" && (
            <>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Region:</label>
                <select
                  value={selectedRegion || ""}
                  onChange={(e) => {
                    setSelectedRegion(e.target.value || null);
                    setSelectedCenter(null);
                  }}
                  className="rounded-lg border border-gray-300 bg-white text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">All Regions</option>
                  {availableRegions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Center:</label>
                <select
                  value={selectedCenter || ""}
                  onChange={(e) => setSelectedCenter(e.target.value || null)}
                  disabled={!selectedRegion}
                  className="rounded-lg border border-gray-300 bg-white text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">All Centers</option>
                  {availableCenters.map((center) => (
                    <option key={center.id} value={center.id}>
                      {center.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inspections */}
        <div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate("/inspection-operations")}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-600">TOTAL INSPECTIONS</p>
            <Car className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{kpis.totalInspections.all}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
            <span>Today: {kpis.totalInspections.today}</span>
            <span>•</span>
            <span>7D: {kpis.totalInspections.last7Days}</span>
            <span>•</span>
            <span>MTD: {kpis.totalInspections.mtd}</span>
          </div>
        </div>

        {/* Pass Rate */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-600">PASS RATE</p>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{kpis.passRate}%</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
            <span>Pass: {kpis.passCount}</span>
            <span>Fail: {kpis.failCount}</span>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-600">REVENUE (ETB)</p>
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{formatCurrency(kpis.revenue.all)}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
            <span>Today: {formatCurrency(kpis.revenue.today)}</span>
            <span>•</span>
            <span>MTD: {formatCurrency(kpis.revenue.mtd)}</span>
          </div>
        </div>

        {/* Active Centers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-600">ACTIVE CENTERS</p>
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {kpis.activeCenters} / {kpis.totalCenters}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs">
            {kpis.offlineCenters > 0 && (
              <span className="text-red-600">Offline: {kpis.offlineCenters}</span>
            )}
            {kpis.degradedCenters > 0 && (
              <>
                {kpis.offlineCenters > 0 && <span>•</span>}
                <span className="text-yellow-600">Degraded: {kpis.degradedCenters}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Additional KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-600">AVG CYCLE TIME</p>
            <Clock className="h-5 w-5 text-gray-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{kpis.avgCycleTime} min</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-600">RETEST DUE</p>
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-600">{kpis.retestDue}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-600">CRITICAL INCIDENTS</p>
            <Bell className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600">
            {filteredIncidents.filter((i) => i.severity === "Critical").length}
          </p>
        </div>
      </div>

      {/* Live Incident Summary & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Incident Summary */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Live Incident Summary</h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Auto-refresh: 30s</span>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredIncidents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-emerald-500" />
                <p>No incidents detected</p>
              </div>
            ) : (
              filteredIncidents
                .sort((a, b) => {
                  const severityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
                  return severityOrder[b.severity] - severityOrder[a.severity];
                })
                .slice(0, 10)
                .map((incident) => (
                  <div
                    key={incident.id}
                    className={`p-3 rounded-lg border ${severityColors[incident.severity]} cursor-pointer hover:shadow-sm transition-shadow`}
                    onClick={() => navigate(`/center-management/${incident.scope?.centerId}`)}
                    title="Click to view center details"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold">{incident.severity}</span>
                          <span className="text-xs">•</span>
                          <span className="text-xs">{incidentTypeLabels[incident.type] || incident.type}</span>
                        </div>
                        <p className="text-sm font-medium mb-1">{incident.scope?.centerName || "Unknown Center"}</p>
                        <p className="text-xs opacity-90">{incident.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs opacity-75">
                          <span>Affected: {incident.impactMetrics?.inspectionsAffectedCount || 0} inspections</span>
                          <span>•</span>
                          <span>{formatTime(incident.firstDetectedAt)}</span>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${incident.status === "Open" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
                        {incident.status}
                      </span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {quickActions.length === 0 ? (
              <p className="text-sm text-gray-500">No actions available</p>
            ) : (
              quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => navigate(action.route)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors text-left"
                  >
                    <Icon className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{action.label}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Centers Requiring Attention */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Centers Requiring Attention</h2>
          <button
            onClick={() => navigate("/center-management")}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View All →
          </button>
        </div>
        {centersRequiringAttention.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-emerald-500" />
            <p>All centers operating normally</p>
          </div>
        ) : (
          <div className="space-y-3">
            {centersRequiringAttention.map((center) => (
              <div
                key={center.id || center.center_id}
                className="p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => navigate(`/center-management/${center.id || center.center_id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{center.name || center.center_name_en}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        center.status === "Online" ? "bg-emerald-100 text-emerald-700" :
                        center.status === "Syncing" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {center.status}
                      </span>
                      <span className="text-xs text-gray-500">{getJurisdictionPath(center)}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            center.attentionScore >= 70 ? "bg-red-500" :
                            center.attentionScore >= 40 ? "bg-yellow-500" :
                            "bg-blue-500"
                          }`}
                          style={{ width: `${center.attentionScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700">Score: {center.attentionScore}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {center.topReasons
                        .filter(reason => !reason.toLowerCase().includes('machine'))
                        .map((reason, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                            {reason}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inspections Over Time */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Inspections Over Time</h3>
              <p className="text-xs text-gray-500 mt-1">{dateRange} • {trendData.length} {dateRange === "Today" || dateRange === "Yesterday" ? "hours" : "days"}</p>
            </div>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div className="h-80">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorInspections" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280" 
                    fontSize={11}
                    tick={{ fill: '#6b7280' }}
                    angle={dateRange === "Today" || dateRange === "Yesterday" ? -45 : 0}
                    textAnchor={dateRange === "Today" || dateRange === "Yesterday" ? "end" : "middle"}
                    height={dateRange === "Today" || dateRange === "Yesterday" ? 60 : 30}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    fontSize={11}
                    tick={{ fill: '#6b7280' }}
                    width={50}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                    formatter={(value) => [value, "Inspections"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="inspections"
                    stroke="#3b82f6"
                    fill="url(#colorInspections)"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Car className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No data available for this period</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pass/Fail Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Pass/Fail Trend</h3>
              <p className="text-xs text-gray-500 mt-1">{dateRange} • {trendData.length} {dateRange === "Today" || dateRange === "Yesterday" ? "hours" : "days"}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-gray-600">Pass</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs text-gray-600">Fail</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280" 
                    fontSize={11}
                    tick={{ fill: '#6b7280' }}
                    angle={dateRange === "Today" || dateRange === "Yesterday" ? -45 : 0}
                    textAnchor={dateRange === "Today" || dateRange === "Yesterday" ? "end" : "middle"}
                    height={dateRange === "Today" || dateRange === "Yesterday" ? 60 : 30}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    fontSize={11}
                    tick={{ fill: '#6b7280' }}
                    width={50}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                  />
                  <Bar 
                    dataKey="passed" 
                    fill="#10b981" 
                    name="Passed"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="failed" 
                    fill="#ef4444" 
                    name="Failed"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No data available for this period</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
