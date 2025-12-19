import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer, QrCode, CheckCircle, XCircle, AlertCircle, MapPin, Camera, FileText, Building, Shield, Video } from 'lucide-react';
import { mockInspectionRecord, getLocalizedLabel, calculateCertificateExpiry } from '../../data/mockInspectionProgram';
import { mockInspectionsExtended, mockInspections } from '../../data/mockInspections';
import { useAuth } from '../../context/AuthContext';
import InspectionDetail from './InspectionDetail';

function InspectionViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [inspection, setInspection] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // First check mockInspectionsExtended, then mockInspections, then mockInspectionRecord
    const foundExtended = mockInspectionsExtended.find(i => i.id === id);
    const foundMock = mockInspections.find(i => i.id === id);
    const foundRecord = mockInspectionRecord && mockInspectionRecord.inspection_id === id ? mockInspectionRecord : null;
    
    if (foundExtended) {
      setInspection(foundExtended);
    } else if (foundMock) {
      setInspection(foundMock);
    } else if (foundRecord) {
      setInspection(foundRecord);
    } else {
      // Use mock data for demo
      setInspection(mockInspectionRecord || foundExtended || foundMock);
    }
  }, [id]);

  if (!inspection) {
    return (
      <div className="max-w-4xl mx-auto mt-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Inspection Not Found</h2>
          <button
            onClick={() => navigate('/inspections')}
            className="px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition"
          >
            Back to Inspections
          </button>
        </div>
      </div>
    );
  }

  // If Report tab is active, render InspectionDetail component
  if (activeTab === 'report') {
    return <InspectionDetail />;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-ET');
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatChassis = (c) => c?.length > 12 ? `${c.slice(0, 6)}...${c.slice(-4)}` : c;

  const getResultBadge = (result) => {
    const styles = {
      'PASS': 'bg-green-100 text-green-800',
      'FAIL': 'bg-red-100 text-red-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
    };
    const Icon = result === 'PASS' ? CheckCircle : result === 'FAIL' ? XCircle : AlertCircle;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${styles[result] || 'bg-gray-100 text-gray-800'}`}>
        <Icon className="h-4 w-4" />
        {result}
      </span>
    );
  };

  const getGeofenceBandBadge = (band) => {
    const styles = {
      'Inside': 'bg-green-100 text-green-800',
      'Warning': 'bg-yellow-100 text-yellow-800',
      'Outside': 'bg-red-100 text-red-800',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[band] || 'bg-gray-100 text-gray-800'}`}>
        {band || 'N/A'}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inspection Details</h1>
            <p className="text-sm text-gray-500">Inspection ID: {inspection.id || inspection.inspection_id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
              <Printer className="h-4 w-4" />
              Print
            </button>
          <button
            onClick={() => {/* Handle download */}}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#005f40] text-white hover:bg-[#004d33] transition-colors"
          >
              <Download className="h-4 w-4" />
              Export
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-[#005f40] text-[#005f40]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'evidence'
                  ? 'border-[#005f40] text-[#005f40]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Evidence
            </button>
              <button
              onClick={() => setActiveTab('report')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'report'
                  ? 'border-[#005f40] text-[#005f40]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
              Report
              </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Vehicle Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Plate Number</span>
                    <div className="text-sm font-medium text-gray-900">{inspection.vehicle?.plate || inspection.vehicle?.plateNumber || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">VIN/Chassis</span>
                    <div className="text-sm font-medium text-gray-900 font-mono">{formatChassis(inspection.vehicle?.vin || inspection.vehicle?.chassisNumber)}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Make & Model</span>
                    <div className="text-sm font-medium text-gray-900">{inspection.vehicle?.make} {inspection.vehicle?.model}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Type</span>
                    <div className="text-sm font-medium text-gray-900">{inspection.vehicle?.type || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Center & Staff */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Center & Staff</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Center</span>
                    <div className="text-sm font-medium text-gray-900">
                      {inspection.center?.center_name || inspection.meta?.center || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Lane</span>
                    <div className="text-sm font-medium text-gray-900">{inspection.center?.lane_id || 'N/A'}</div>
                  </div>
                      <div>
                        <span className="text-sm text-gray-500">Inspector</span>
                    <div className="text-sm font-medium text-gray-900">
                      {inspection.staff?.inspector_user_id || inspection.meta?.inspectorName || 'N/A'}
                    </div>
                      </div>
                </div>
              </div>

              {/* Results Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Results</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">Overall Result:</span>
                    {getResultBadge(inspection.results?.overall_result || inspection.status || 'N/A')}
                  </div>
                  {inspection.results?.fail_reasons_summary && inspection.results.fail_reasons_summary.length > 0 && (
                    <div className="mt-3">
                      <span className="text-sm text-gray-500">Fail Reasons:</span>
                      <ul className="mt-1 space-y-1">
                        {inspection.results.fail_reasons_summary.map((reason, idx) => (
                          <li key={idx} className="text-sm text-red-700">• {reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Geofence Compliance */}
              {inspection.geofence_compliance && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Geofence Compliance</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Distance</span>
                    <div className="text-sm font-medium text-gray-900">
                      {inspection.geofence_compliance?.distance_m ? `${inspection.geofence_compliance.distance_m}m` : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Band</span>
                    <div className="mt-1">{inspection.geofence_compliance?.band ? getGeofenceBandBadge(inspection.geofence_compliance.band) : 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Location Source</span>
                    <div className="text-sm font-medium text-gray-900">
                      {inspection.geofence_compliance?.location_source ? inspection.geofence_compliance.location_source.replace('_', ' ') : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Confidence</span>
                    <div className="text-sm font-medium text-gray-900">
                      {inspection.geofence_compliance?.location_confidence || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          )}
            </div>
          )}

          {/* Evidence Tab */}
          {activeTab === 'evidence' && (
            <div className="space-y-6">
              {!inspection.evidence && (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No evidence data available for this inspection</p>
                  <p className="text-xs mt-1">Evidence includes photos, videos, and other inspection documentation</p>
                </div>
              )}
              {inspection.evidence && (
              <>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Evidence Compliance</h3>
                {inspection.evidence?.evidence_completeness_status && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2">
                    {inspection.evidence.evidence_completeness_status === 'Complete' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      Status: {inspection.evidence.evidence_completeness_status}
                    </span>
                  </div>
                  {inspection.evidence.evidence_items && (
                  <div className="mt-2 text-sm text-gray-600">
                    {inspection.evidence.evidence_items.filter(e => e.required).length} required,{' '}
                    {inspection.evidence.evidence_items.filter(e => e.required && e.provided).length} provided
                  </div>
                  )}
                </div>
                )}
              </div>

              {/* Videos */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Videos</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  {inspection.evidence?.entry_video ? (
                    <div className="space-y-3">
                      <div className="relative">
                        <video
                          controls
                          className="w-full rounded-lg border border-gray-300 bg-black"
                          src={inspection.evidence?.entry_video?.url || inspection.evidence?.entry_video || ''}
                          poster={inspection.evidence?.entry_video?.thumbnail}
                          style={{ maxHeight: '400px' }}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Video className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{inspection.evidence?.entry_video?.description || 'Vehicle Entry Video'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-2">
                        <div>
                            <span className="font-medium">Captured:</span>{' '}
                            {inspection.evidence?.entry_video?.timestamp ? formatDate(inspection.evidence.entry_video.timestamp) : 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Location:</span> {inspection.center?.center_name || inspection.meta?.center || 'N/A'}
                          </div>
                          {inspection.evidence?.entry_video?.duration && (
                            <div>
                              <span className="font-medium">Duration:</span> {inspection.evidence.entry_video.duration} seconds
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Video className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>No videos available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Photos */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos</h3>
                {/* Visual Results Photos */}
                {inspection.visualResults && inspection.visualResults.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    <h4 className="text-sm font-semibold text-gray-700">Visual Inspection Photos</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {inspection.visualResults.map((result, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                          <div className="aspect-video bg-gray-100 relative overflow-hidden">
                            {result.photoUrl ? (
                              <img
                                src={result.photoUrl}
                                alt={result.item || `Visual inspection ${idx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                onError={(e) => {
                                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage not available%3C/text%3E%3C/svg%3E';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Camera className="h-8 w-8" />
            </div>
          )}
                            <div className={`absolute top-2 right-2 text-white text-[10px] px-2 py-1 rounded ${
                              result.status === "Pass" ? "bg-green-500" : "bg-red-500"
                            }`}>
                              {result.status}
                </div>
                  </div>
                          <div className="p-3">
                            <p className="text-xs font-medium text-gray-900">
                              {result.item || `Visual Item ${idx + 1}`}
                            </p>
                            <p className={`text-xs mt-1 ${
                              result.status === "Pass" ? "text-green-600" : "text-red-600"
                            }`}>
                              Status: {result.status}
                            </p>
                  </div>
                  </div>
                      ))}
                  </div>
                  </div>
                ) : null}
                {inspection.evidence?.inspection_photos && inspection.evidence.inspection_photos.length > 0 ? (
                  <div className="space-y-4">
                    {/* Only show visual_inspection category photos */}
                    {(() => {
                      const categoryPhotos = inspection.evidence.inspection_photos.filter(p => p.category === 'visual_inspection');
                      if (categoryPhotos.length === 0) return null;
                      
                      return (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {categoryPhotos.map((photo, idx) => (
                            <div key={idx} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                {photo.url || photo.dataUrl ? (
                                  <img
                                    src={photo.url || photo.dataUrl}
                                    alt={photo.item || `Inspection photo ${idx + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    onError={(e) => {
                                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage not available%3C/text%3E%3C/svg%3E';
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Camera className="h-8 w-8" />
                                  </div>
                                )}
                                <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded">
                                  {photo.timestamp ? new Date(photo.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                                </div>
                              </div>
                              <div className="p-3">
                                <p className="text-xs font-medium text-gray-900 line-clamp-2">
                                  {photo.item || `Photo ${idx + 1}`}
                                </p>
                                {photo.description && (
                                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{photo.description}</p>
                                )}
                                {photo.timestamp && (
                                  <p className="text-xs text-gray-400 mt-1">
                                    {formatDate(photo.timestamp)}
                                  </p>
                      )}
                    </div>
                  </div>
                          ))}
                </div>
                      );
                    })()}
                    
                    {/* All photos grid (fallback if no category) */}
                    {inspection.evidence?.inspection_photos && inspection.evidence.inspection_photos.filter(p => !p.category || !['inspection', 'machine_test', 'visual_inspection'].includes(p.category)).length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Other Photos</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {inspection.evidence.inspection_photos
                            .filter(p => !p.category || !['inspection', 'machine_test', 'visual_inspection'].includes(p.category))
                            .map((photo, idx) => (
                              <div key={idx} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                  {photo.url || photo.dataUrl ? (
                                    <img
                                      src={photo.url || photo.dataUrl}
                                      alt={photo.item || `Photo ${idx + 1}`}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                      onError={(e) => {
                                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage not available%3C/text%3E%3C/svg%3E';
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                      <Camera className="h-8 w-8" />
                                    </div>
                                  )}
                                </div>
                                <div className="p-3">
                                  <p className="text-xs font-medium text-gray-900">
                                    {photo.item || `Photo ${idx + 1}`}
                                  </p>
                                  {photo.timestamp && (
                                    <p className="text-xs text-gray-400 mt-1">
                                      {formatDate(photo.timestamp)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : inspection.visualResults && inspection.visualResults.length > 0 ? null : (
                  <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                    <Camera className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>No inspection photos available</p>
                    <p className="text-xs mt-1">Photos captured during inspection while vehicle is at the center</p>
                  </div>
                )}
              </div>
              </>
              )}
            </div>
          )}

          {/* Report Tab - Use InspectionDetail component */}
          {activeTab === 'report' && (
            <InspectionDetail />
          )}
        </div>
      </div>
    </div>
  );
}

export default InspectionViewer;
