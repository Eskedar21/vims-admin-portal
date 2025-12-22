import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockInspectionsExtended } from "../../data/mockInspections";
import { getInspections } from "../../api/inspectionApi";
import { Search, Filter, Eye, Printer, Download, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";

function InspectionOperations() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // Transform API data to expected format
  const transformInspectionData = (data) => {
    return Array.isArray(data) ? data.map(inspection => ({
      id: inspection.id,
      vehicle: {
        plate: inspection.vehicle?.plateNumber || inspection.vehicle?.plate,
        vin: inspection.vehicle?.vin || inspection.vehicle?.chassisNumber,
        make: inspection.vehicle?.make,
        model: inspection.vehicle?.model,
        owner: {
          name: inspection.vehicle?.owner?.name || inspection.vehicle?.ownerName,
          phone: inspection.vehicle?.owner?.phone,
        },
      },
      status: inspection.status || inspection.overallResult,
      type: inspection.type || "Initial Inspection",
      inspectionDate: inspection.inspectionDate,
      meta: {
        inspectorName: inspection.inspectorName,
        center: inspection.centerName || inspection.centerId,
        geoFenceStatus: inspection.geoFenceStatus,
        location: {
          lat: inspection.latitude,
          lng: inspection.longitude,
        },
      },
    })) : [];
  };

  // Fetch inspections from API
  const fetchInspections = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build filters
      const filters = {};
      if (statusFilter !== "all") filters.status = statusFilter;
      if (typeFilter !== "all") filters.type = typeFilter;
      
      // Date filters
      if (dateFilter === "today") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filters.dateFrom = today.toISOString();
      } else if (dateFilter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filters.dateFrom = weekAgo.toISOString();
      } else if (dateFilter === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filters.dateFrom = monthAgo.toISOString();
      }

      // Fetch from API
      const data = await getInspections(filters);
      const transformedInspections = transformInspectionData(data);
      setInspections(transformedInspections);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Failed to fetch inspections:", err);
      setError("Failed to load inspections. Using cached data.");
      // Fallback to mock data if API fails
      setInspections(mockInspectionsExtended);
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh function
  const handleRefresh = () => {
    fetchInspections();
  };

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchInspections();
    
    // Auto-refresh every 30 seconds to get new inspections
    const refreshInterval = setInterval(fetchInspections, 30000);
    
    return () => clearInterval(refreshInterval);
  }, [statusFilter, typeFilter, dateFilter]);

  const filteredInspections = useMemo(() => {
    return inspections.filter((inspection) => {
      const matchesSearch =
        searchQuery === "" ||
        inspection.vehicle.plate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inspection.vehicle.vin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inspection.vehicle.owner?.name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || inspection.status === statusFilter;
      const matchesType = typeFilter === "all" || inspection.type === typeFilter;

      let matchesDate = true;
      if (dateFilter !== "all" && inspection.inspectionDate) {
        const inspectionDate = new Date(inspection.inspectionDate);
        const now = new Date();
        const daysDiff = Math.floor((now - inspectionDate) / (1000 * 60 * 60 * 24));

        if (dateFilter === "today") matchesDate = daysDiff === 0;
        else if (dateFilter === "week") matchesDate = daysDiff <= 7;
        else if (dateFilter === "month") matchesDate = daysDiff <= 30;
      }

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [inspections, searchQuery, statusFilter, typeFilter, dateFilter]);

  const stats = useMemo(() => {
    const total = filteredInspections.length;
    const passed = filteredInspections.filter((i) => i.status === "Passed").length;
    const failed = filteredInspections.filter((i) => i.status === "Failed").length;
    const pending = filteredInspections.filter((i) => i.status === "Pending").length;

    return { total, passed, failed, pending };
  }, [filteredInspections]);

  // Pagination
  const totalPages = Math.ceil(filteredInspections.length / ITEMS_PER_PAGE);
  const paginatedInspections = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredInspections.slice(startIndex, endIndex);
  }, [filteredInspections, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter, dateFilter]);

  const getStatusBadge = (status) => {
    const styles = {
      Passed: "bg-green-100 text-green-800",
      Failed: "bg-red-100 text-red-800",
      Pending: "bg-yellow-100 text-yellow-800",
    };

    const icons = {
      Passed: CheckCircle,
      Failed: XCircle,
      Pending: Clock,
    };

    const Icon = icons[status] || AlertCircle;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}
      >
        <Icon className="h-3.5 w-3.5" />
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("en-ET", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Export to CSV
  const handleExport = () => {
    const headers = ['Date & Time', 'Plate Number', 'VIN', 'Make', 'Model', 'Type', 'Inspector', 'Status', 'Center'];
    const rows = filteredInspections.map(inspection => [
      formatDate(inspection.inspectionDate),
      inspection.vehicle.plate || inspection.vehicle.plateNumber || 'N/A',
      inspection.vehicle.vin || 'N/A',
      inspection.vehicle.make || 'N/A',
      inspection.vehicle.model || 'N/A',
      inspection.type || 'Initial',
      inspection.meta?.inspectorName || 'N/A',
      inspection.status || 'N/A',
      inspection.meta?.center || 'N/A',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inspections_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print inspection
  const handlePrint = (inspection) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print inspections');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Inspection ${inspection.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #88bf47; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Inspection Report: ${inspection.id}</h1>
          <table>
            <tr><th>Date & Time</th><td>${formatDate(inspection.inspectionDate)}</td></tr>
            <tr><th>Plate Number</th><td>${inspection.vehicle.plate || inspection.vehicle.plateNumber || 'N/A'}</td></tr>
            <tr><th>VIN</th><td>${inspection.vehicle.vin || 'N/A'}</td></tr>
            <tr><th>Make</th><td>${inspection.vehicle.make || 'N/A'}</td></tr>
            <tr><th>Model</th><td>${inspection.vehicle.model || 'N/A'}</td></tr>
            <tr><th>Type</th><td>${inspection.type || 'Initial'}</td></tr>
            <tr><th>Inspector</th><td>${inspection.meta?.inspectorName || 'N/A'}</td></tr>
            <tr><th>Status</th><td>${inspection.status || 'N/A'}</td></tr>
            <tr><th>Center</th><td>${inspection.meta?.center || 'N/A'}</td></tr>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="w-full space-y-6 p-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inspections</h1>
        <p className="text-gray-600">
          Manage and monitor vehicle inspections across all centers
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Inspections</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Filter className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Passed</p>
              <p className="text-2xl font-bold text-green-600">{stats.passed}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Failed</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by plate, VIN, or owner name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Passed">Passed</option>
              <option value="Failed">Failed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="Initial">Initial</option>
              <option value="Retest">Retest</option>
              <option value="Re-inspection">Re-inspection</option>
            </select>
          </div>
        </div>

        {/* Date Filter */}
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Date Range:</span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#88bf47] focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inspections Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Inspections ({filteredInspections.length})
            </h2>
            {filteredInspections.length > 0 && (
              <span className="text-sm text-gray-500">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredInspections.length)} of {filteredInspections.length}
              </span>
            )}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </div>
            )}
            {!loading && lastRefresh && (
              <span className="text-xs text-gray-400">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh inspections list"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              disabled={filteredInspections.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-[#88bf47] text-white text-sm font-medium px-4 py-2 hover:bg-[#0fa84a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export inspections to CSV"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Plate Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Vehicle Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Inspector
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Center
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && inspections.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                      <span>Loading inspections...</span>
                    </div>
                  </td>
                </tr>
              ) : error && inspections.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-6 w-6 text-amber-500" />
                      <span className="text-amber-600">{error}</span>
                      <button
                        onClick={handleRefresh}
                        className="mt-2 px-4 py-2 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200"
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredInspections.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    No inspections found matching your filters
                  </td>
                </tr>
              ) : (
                paginatedInspections.map((inspection) => (
                  <tr key={inspection.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(inspection.inspectionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {inspection.vehicle.plate || inspection.vehicle.plateNumber || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>{inspection.vehicle.make} {inspection.vehicle.model}</div>
                        <div className="text-xs text-gray-500">{inspection.vehicle.vin}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{inspection.type || "Initial"}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{inspection.meta?.inspectorName || "N/A"}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(inspection.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inspection.meta?.center || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/inspections/${inspection.id}`)}
                          className="p-2 text-[#88bf47] hover:bg-green-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handlePrint(inspection)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Print Inspection"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredInspections.length > 0 && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
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
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-[#88bf47] text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InspectionOperations;

