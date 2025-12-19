import { useState, useMemo } from 'react';
import { Search, Download, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { mockAdminUnits, mockAssignments, mockInstitutions, getUnitsWithoutOwner } from '../../data/mockGovernance';
import { mockCenters } from '../../data/mockCenters';
import { useAuth } from '../../context/AuthContext';

function GovernanceReports() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [exportReason, setExportReason] = useState('');

  // Search functionality
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { units: [], institutions: [] };

    const query = searchQuery.toLowerCase();
    const units = mockAdminUnits.filter(u =>
      u.admin_unit_name_en.toLowerCase().includes(query) ||
      u.admin_unit_name_am?.toLowerCase().includes(query) ||
      u.admin_unit_code?.toLowerCase().includes(query) ||
      u.admin_unit_type.toLowerCase().includes(query)
    );

    const institutions = mockInstitutions.filter(i =>
      i.institution_name_en.toLowerCase().includes(query) ||
      i.institution_name_am?.toLowerCase().includes(query) ||
      i.institution_short_name?.toLowerCase().includes(query) ||
      i.institution_type.toLowerCase().includes(query)
    );

    return { units, institutions };
  }, [searchQuery]);

  // Completeness Reports
  const unitsWithoutOwner = useMemo(() => 
    getUnitsWithoutOwner(mockAdminUnits, mockAssignments),
    []
  );

  const centersNotLinked = useMemo(() => {
    const linkedCenterIds = new Set();
    // In real app, would check center.admin_unit_id linkage
    return mockCenters.filter(c => !linkedCenterIds.has(c.id));
  }, []);

  const inactiveUnitReferences = useMemo(() => {
    // In real app, would check users whose scope references inactive units
    return [];
  }, []);

  const handleExport = (reportType) => {
    if (!exportReason.trim()) {
      alert('Export reason is required and will be logged for audit purposes.');
      return;
    }

    // In real app, this would generate and download the report
    console.log('Export requested', {
      reportType,
      reason: exportReason,
      user: user?.id,
      timestamp: new Date().toISOString(),
    });
    alert(`Export logged (mock). Reason: ${exportReason}`);
    setExportReason('');
    setSelectedReport(null);
  };

  const reports = [
    {
      id: 'units-without-owner',
      title: 'Admin Units Without Owner',
      description: 'Administration units that do not have an assigned owner office',
      count: unitsWithoutOwner.length,
      data: unitsWithoutOwner,
      icon: AlertCircle,
    },
    {
      id: 'centers-not-linked',
      title: 'Centers Not Linked to Admin Units',
      description: 'Inspection centers that are not properly linked to a woreda/sub-city/zone',
      count: centersNotLinked.length,
      data: centersNotLinked,
      icon: AlertCircle,
    },
    {
      id: 'inactive-unit-references',
      title: 'Users with Inactive Unit References',
      description: 'Users whose scope references inactive administration units',
      count: inactiveUnitReferences.length,
      data: inactiveUnitReferences,
      icon: AlertCircle,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Governance Search & Reporting
        </h1>
        <p className="text-gray-600">
          Search and validate governance structure completeness and correctness
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Search</h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, code, type, or status..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
              />
            </div>
          </div>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
          >
            <option value="all">All Types</option>
            <option value="units">Admin Units</option>
            <option value="institutions">Institutions</option>
          </select>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mt-4 space-y-4">
            {(searchType === 'all' || searchType === 'units') && searchResults.units.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Administration Units ({searchResults.units.length})
                </h3>
                <div className="space-y-2">
                  {searchResults.units.map(unit => (
                    <div key={unit.admin_unit_id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-900">{unit.admin_unit_name_en}</div>
                      <div className="text-xs text-gray-500">{unit.jurisdiction_path}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Type: {unit.admin_unit_type} | Status: {unit.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(searchType === 'all' || searchType === 'institutions') && searchResults.institutions.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Institutions ({searchResults.institutions.length})
                </h3>
                <div className="space-y-2">
                  {searchResults.institutions.map(inst => (
                    <div key={inst.institution_id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-900">{inst.institution_name_en}</div>
                      <div className="text-xs text-gray-500">
                        Type: {inst.institution_type} | Status: {inst.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchQuery && searchResults.units.length === 0 && searchResults.institutions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No results found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Completeness Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Completeness Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reports.map(report => {
            const Icon = report.icon;
            return (
              <div
                key={report.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">{report.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{report.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">{report.count}</span>
                  <button className="text-xs text-[#009639] hover:underline flex items-center gap-1">
                    View Details
                    <FileText className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{selectedReport.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{selectedReport.description}</p>
            </div>
            <div className="p-6">
              {selectedReport.data.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900">All Clear!</p>
                  <p className="text-sm text-gray-500 mt-2">No issues found in this report.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">
                      {selectedReport.data.length} item{selectedReport.data.length !== 1 ? 's' : ''} found
                    </span>
                    <button
                      onClick={() => {
                        setExportReason('');
                        setSelectedReport(null);
                      }}
                      className="px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition flex items-center gap-2 text-sm"
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </button>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {selectedReport.data.map((item, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        {item.admin_unit_name_en && (
                          <>
                            <div className="text-sm font-medium text-gray-900">
                              {item.admin_unit_name_en}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {item.jurisdiction_path || item.admin_unit_id}
                            </div>
                          </>
                        )}
                        {item.name && (
                          <>
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{item.id}</div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedReport(null);
                  setExportReason('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
              {selectedReport.data.length > 0 && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={exportReason}
                    onChange={(e) => setExportReason(e.target.value)}
                    placeholder="Export reason (required)..."
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639]"
                  />
                  <button
                    onClick={() => handleExport(selectedReport.id)}
                    disabled={!exportReason.trim()}
                    className="px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Export Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-semibold text-blue-800">
            Export Restrictions
          </span>
        </div>
        <p className="text-sm text-blue-700">
          Export is allowed only for permitted roles. Export requires reason and is logged for audit purposes.
        </p>
      </div>
    </div>
  );
}

export default GovernanceReports;

