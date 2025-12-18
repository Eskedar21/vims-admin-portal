import { useParams, useNavigate } from "react-router-dom";
import { mockInspections, mockInspectionsExtended } from "../../data/mockInspections";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, Lock, CheckCircle2, XCircle, MapPin, Video, Phone, Printer } from "lucide-react";
import MapPicker from "../../components/MapPicker";

// Print styles
const printStyles = `
  @media print {
    body * {
      visibility: hidden;
    }
    .print-content, .print-content * {
      visibility: visible;
    }
    .print-content {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
    button, .no-print {
      display: none !important;
    }
  }
`;

function InspectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  // Try to find in extended data first, then fallback to original
  const inspection =
    mockInspectionsExtended.find((i) => i.id === id) ||
    mockInspections.find((i) => i.id === id);

  // Role-based PII access control
  // Only "Viewer" role cannot see PII (Personal Identifiable Information)
  const canViewPII = user?.role?.toLowerCase() !== "viewer";

  if (!inspection) {
    return (
      <div className="max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Inspection not found.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const statusColor =
    inspection.status === "Passed"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-red-100 text-red-700 border-red-200";

  const StatusIcon = inspection.status === "Passed" ? CheckCircle2 : XCircle;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <style>{printStyles}</style>
      <div className="max-w-7xl mx-auto w-full space-y-6 print-content">
      {/* Back Button & Actions */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
        >
          <Printer className="h-4 w-4" />
          <span>Print Report</span>
        </button>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <h1 className="text-4xl font-bold text-gray-900">
                {inspection.vehicle.plate}
              </h1>
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${statusColor}`}
              >
                <StatusIcon className="h-4 w-4" />
                {inspection.status}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">VIN:</span> {inspection.vehicle.vin}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Vehicle:</span> {inspection.vehicle.make}{" "}
                {inspection.vehicle.model}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Type:</span>{" "}
                {inspection.vehicle.type || inspection.type}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Vehicle & Payment */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle & Payment</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner Information
                </label>
                <div className="mt-2 space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    {canViewPII ? (
                      inspection.vehicle.owner.name
                    ) : (
                      <span className="blur-sm">{inspection.vehicle.owner.name}</span>
                    )}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>
                      {canViewPII ? (
                        inspection.vehicle.owner.phone
                      ) : (
                        <span className="blur-sm">{inspection.vehicle.owner.phone}</span>
                      )}
                    </span>
                  </div>
                  {canViewPII && (
                    <p className="text-xs text-gray-500">
                      ID: {inspection.vehicle.owner.idNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                  Payment Status
                </label>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      inspection.paymentStatus === "Paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {inspection.paymentStatus}
                  </span>
                  {inspection.paymentStatus === "Paid" && (
                    <span className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold">
                      Telebirr Transaction
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Machine Data */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Machine Data</h2>
          <div className="space-y-3">
            {inspection.machineResults && inspection.machineResults.length > 0 ? (
              inspection.machineResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.status === "Fail"
                    ? "bg-red-50 border-red-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{result.test}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      result.status === "Fail"
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {result.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-lg font-bold ${
                      result.status === "Fail" ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {result.val}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(result.timestamp)}
                  </span>
                </div>
              </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No machine test data available
              </p>
            )}
          </div>
        </div>

        {/* Column 3: Visual & Evidence */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Visual & Evidence</h2>
          <div className="space-y-3">
            {inspection.visualResults && inspection.visualResults.length > 0 ? (
              inspection.visualResults.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  item.status === "Fail"
                    ? "bg-red-50 border-red-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{item.item}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.status === "Fail"
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                {item.photoUrl && (
                  <div className="mt-3">
                    <img
                      src={item.photoUrl}
                      alt={`${item.item} evidence`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-300 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(item.photoUrl, "_blank")}
                      title="Click to view full size"
                    />
                  </div>
                )}
                {item.status === "Pass" && !item.photoUrl && (
                  <p className="text-xs text-gray-500 mt-2 italic">No photo captured (Passed)</p>
                )}
              </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No visual inspection data available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Captured Photos Gallery */}
      {inspection.visualResults && inspection.visualResults.some((item) => item.photoUrl) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Captured Photos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {inspection.visualResults
              .filter((item) => item.photoUrl)
              .map((item, index) => (
                <div key={index} className="space-y-2">
                  <img
                    src={item.photoUrl}
                    alt={`${item.item} - ${item.status}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-300 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(item.photoUrl, "_blank")}
                    title="Click to view full size"
                  />
                  <div className="text-xs">
                    <p className="font-medium text-gray-900">{item.item}</p>
                    <p
                      className={`${
                        item.status === "Pass" ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {item.status}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Audit Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Audit & Verification</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Evidence */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Video Evidence</label>
            <div className="w-full rounded-lg border border-gray-300 overflow-hidden bg-black">
              <video
                controls
                className="w-full h-64 object-contain"
                poster="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80"
              >
                <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                <source src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="text-xs text-gray-500">
              Full video recording of the inspection process
            </p>
          </div>

          {/* Map Verification */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Location Verification</label>
            <div className="h-48 rounded-lg border border-gray-300 overflow-hidden">
              <MapPicker
                lat={inspection.meta.location.lat}
                lng={inspection.meta.location.lng}
                radius={100}
                className="h-full"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">
                Geo-Fence Status:{" "}
                <span
                  className={`font-semibold ${
                    inspection.meta.geoFenceStatus === "Valid"
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {inspection.meta.geoFenceStatus}
                </span>
              </span>
              <span className="text-gray-500">
                {inspection.meta.location.lat.toFixed(4)},{" "}
                {inspection.meta.location.lng.toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        {/* Inspection Metadata */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500 mb-1">Inspector</p>
              <p className="font-medium text-gray-900">{inspection.meta.inspectorName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Center</p>
              <p className="font-medium text-gray-900">{inspection.meta.center}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Inspection Date</p>
              <p className="font-medium text-gray-900">
                {formatDate(
                  inspection.meta?.inspectionDate ||
                    inspection.inspectionDate ||
                    new Date().toISOString()
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Inspection ID</p>
              <p className="font-medium text-gray-900">{inspection.id}</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default InspectionDetail;
