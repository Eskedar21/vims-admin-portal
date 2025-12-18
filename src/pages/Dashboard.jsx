import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Building2, CheckCircle2, XCircle, DollarSign, Car, Search, Bell, Eye, Printer, ChevronLeft, ChevronRight, AlertTriangle, MapPin } from "lucide-react";
import { useCenters } from "../context/CentersContext";
import { useNotifications } from "../context/NotificationContext";
import { mockInspectionsExtended } from "../data/mockInspections";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { batchCheckInspections } from "../utils/fraudNotificationService";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { centers } = useCenters();
  const { addNotification, notifications } = useNotifications();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentFilter, setPaymentFilter] = useState(false);
  const itemsPerPage = 5;

  // Role-based permissions
  const canViewPII = user?.role?.toLowerCase() !== "viewer";

  // Run fraud detection on inspections when component mounts or data changes
  useEffect(() => {
    // Add sample fraud notifications with center names and details
    const sampleNotifications = [
      {
        type: "geofence",
        title: "Geofence Violation - Bole Center 01",
        message: "Inspection VIS-2025-0025 for vehicle ET 99999X was performed 1.2km outside the authorized geofence boundary. Location: 9.0806°N, 38.8578°E. Center boundary: 500m radius from 8.9806°N, 38.7578°E.",
        severity: "high",
        inspectionId: "VIS-2025-0025",
        centerId: "CTR-001",
        vehiclePlate: "ET 99999X",
      },
      {
        type: "vehicle_presence",
        title: "Vehicle Presence Violation - Adama Center",
        message: "Inspection VIS-2025-0026 for vehicle ET 88888Y may have been performed without the vehicle being present. No machine test results recorded, no visual inspection photos captured. Inspector: Test Inspector 2.",
        severity: "high",
        inspectionId: "VIS-2025-0026",
        centerId: "CTR-002",
        vehiclePlate: "ET 88888Y",
      },
      {
        type: "geofence",
        title: "Geofence Violation - Hawassa Center",
        message: "Inspection VIS-2025-0020 for vehicle ET 85216Z was performed 850m outside the authorized geofence. Inspection location exceeds the 600m radius limit. Immediate review required.",
        severity: "high",
        inspectionId: "VIS-2025-0020",
        centerId: "CTR-004",
        vehiclePlate: "ET 85216Z",
      },
    ];

    // Add sample notifications if they don't already exist
    sampleNotifications.forEach((sample) => {
      const exists = notifications.some(
        (n) => n.inspectionId === sample.inspectionId && n.type === sample.type
      );
      if (!exists) {
        addNotification(sample);
      }
    });

    // Only check recent inspections (last 7 days) to avoid spam
    const recentInspections = mockInspectionsExtended.filter((inspection) => {
      if (!inspection.inspectionDate) return false;
      const inspectionDate = new Date(inspection.inspectionDate);
      const now = new Date();
      const daysDiff = Math.floor((now - inspectionDate) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7;
    });

    // Check for fraud violations and generate notifications
    // Pass existing notifications to prevent duplicates
    batchCheckInspections(recentInspections, centers, addNotification, notifications);
  }, [centers, addNotification, notifications]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalInspections = mockInspectionsExtended.length;
    const passCount = mockInspectionsExtended.filter((i) => i.status === "Passed").length;
    const failCount = mockInspectionsExtended.filter((i) => i.status === "Failed").length;
    const revenue = mockInspectionsExtended
      .filter((i) => i.paymentStatus === "Paid")
      .reduce((sum, i) => sum + (i.amount || 0), 0);
    const pendingPayments = mockInspectionsExtended.filter(
      (i) => i.paymentStatus === "Pending"
    ).length;
    const activeCenters = centers.filter((c) => c.status === "Online").length;
    const regionsCount = new Set(centers.map((c) => c.region)).size;

    return { totalInspections, passCount, failCount, revenue, pendingPayments, activeCenters, regionsCount, totalCenters: centers.length };
  }, [centers]);

  // Generate hourly chart data
  const hourlyInspectionData = useMemo(() => {
    const hours = Array.from({ length: 7 }, (_, i) => {
      const hour = 8 + i; // 8 AM to 2 PM
      const hourLabel = hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`;
      const count = Math.floor(Math.random() * 8) + 2; // Random between 2-10
      return { time: hourLabel, inspections: count };
    });
    return hours;
  }, []);

  const hourlyRevenueData = useMemo(() => {
    return hourlyInspectionData.map((item) => ({
      ...item,
      revenue: item.inspections * (Math.random() * 200 + 300), // Random revenue per inspection
    }));
  }, [hourlyInspectionData]);

  // Filter inspections based on search and payment status
  const filteredInspections = useMemo(() => {
    let filtered = mockInspectionsExtended;

    // Filter by payment status if pending payments button is clicked
    if (paymentFilter) {
      filtered = filtered.filter((inspection) => inspection.paymentStatus === "Pending");
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (inspection) =>
          inspection.vehicle.plate.toLowerCase().includes(query) ||
          inspection.id.toLowerCase().includes(query) ||
          inspection.meta.inspectorName.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, paymentFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredInspections.length / itemsPerPage);
  const paginatedInspections = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInspections.slice(start, start + itemsPerPage);
  }, [filteredInspections, currentPage]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-ET", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Vehicle History"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {metrics.pendingPayments > 0 && (
            <button 
              onClick={() => {
                setPaymentFilter(!paymentFilter);
                setCurrentPage(1);
              }}
              className={`relative inline-flex items-center gap-2 rounded-lg border text-sm font-medium px-4 py-2.5 transition-colors ${
                paymentFilter 
                  ? "border-yellow-500 bg-yellow-50 text-yellow-700" 
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Bell className="h-4 w-4" />
              Pending Payments
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-yellow-500 text-white text-xs flex items-center justify-center font-semibold">
                {metrics.pendingPayments}
              </span>
            </button>
          )}
          <select className="rounded-lg border border-gray-300 bg-white text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards - Inspection Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">VEHICLES INSPECTED</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.totalInspections}</p>
            </div>
            <div className="h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center">
              <Car className="h-7 w-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">PASS COUNT</p>
              <p className="text-3xl font-bold text-emerald-600">{metrics.passCount}</p>
            </div>
            <div className="h-14 w-14 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">FAIL COUNT</p>
              <p className="text-3xl font-bold text-red-600">{metrics.failCount}</p>
            </div>
            <div className="h-14 w-14 rounded-xl bg-red-50 flex items-center justify-center">
              <XCircle className="h-7 w-7 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">REVENUE (ETB)</p>
              <p className="text-3xl font-bold text-emerald-600">
                {formatCurrency(metrics.revenue)}
              </p>
            </div>
            <div className="h-14 w-14 rounded-xl bg-emerald-50 flex items-center justify-center">
              <DollarSign className="h-7 w-7 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* System KPIs - Centers & Regions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">TOTAL CENTERS</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.totalCenters}</p>
            </div>
            <div className="h-14 w-14 rounded-xl bg-gray-100 flex items-center justify-center">
              <Building2 className="h-7 w-7 text-gray-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">ACTIVE CENTERS</p>
              <p className="text-3xl font-bold text-emerald-600">{metrics.activeCenters}</p>
            </div>
            <div className="h-14 w-14 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">REGIONS COVERED</p>
              <p className="text-3xl font-bold text-blue-600">{metrics.regionsCount}</p>
            </div>
            <div className="h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center">
              <MapPin className="h-7 w-7 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Trend Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Inspections Over Time</h3>
            <span className="text-xs text-gray-500">Hourly</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyInspectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="inspections"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Revenue Trend (ETB)</h3>
            <span className="text-xs text-gray-500">Hourly</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Real-time Monitoring & Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Real-time System Monitoring</h2>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Live</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Geofencing Status</span>
            </div>
            <p className="text-xs text-gray-600">
              {centers.filter((c) => c.status === "Online").length} centers within valid zones
            </p>
          </div>
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-900">Active Alerts</span>
            </div>
            <p className="text-xs text-gray-600">
              {centers.filter((c) => c.status === "Offline").length} centers offline
            </p>
          </div>
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-gray-900">System Alerts</span>
            </div>
            <p className="text-xs text-gray-600">Video streaming: Active | Storage: 1 year retention</p>
          </div>
        </div>
      </div>

      {/* Recent Inspections Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Inspections</h2>
          <div className="flex-1 max-w-xs ml-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Plate, ID, or Technician..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer">
                  DATE & TIME ↓
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  PLATE
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  TYPE
                </th>
                {canViewPII && (
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    TECHNICIAN
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  RESULT
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  AMOUNT
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  PAYMENT
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  SYNC
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedInspections.map((inspection) => (
                <tr key={inspection.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(inspection.inspectionDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {inspection.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {inspection.vehicle.plate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {inspection.vehicle.type}
                  </td>
                  {canViewPII && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {inspection.meta.inspectorName}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        inspection.status === "Passed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {inspection.status === "Passed" ? (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {inspection.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {formatCurrency(inspection.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        inspection.paymentStatus === "Paid"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {inspection.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        inspection.syncStatus === "Synced"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {inspection.syncStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/inspections/${inspection.id}`)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => {
                          window.open(`/inspections/${inspection.id}`, '_blank');
                          setTimeout(() => window.print(), 500);
                        }}
                        className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors"
                        title="Print"
                      >
                        <Printer className="h-4 w-4" />
                        <span>Print</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredInspections.length)}-
            {Math.min(currentPage * itemsPerPage, filteredInspections.length)} of{" "}
            {filteredInspections.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
