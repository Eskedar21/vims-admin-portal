import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Wifi, WifiOff } from "lucide-react";
import MapPicker from "../../components/MapPicker";
import { useCenters } from "../../context/CentersContext";

function CenterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCenterById, updateCenter } = useCenters();
  const center = getCenterById(id);

  const [geoFence, setGeoFence] = useState({
    lat: center?.lat || 0,
    lng: center?.lng || 0,
    radius: center?.radius || 500,
  });

  useEffect(() => {
    if (center) {
      setGeoFence({
        lat: center.lat,
        lng: center.lng,
        radius: center.radius,
      });
    }
  }, [center]);

  if (!center) {
    return (
      <div className="max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Center not found.</p>
          <button
            onClick={() => navigate("/center-management")}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Back to Center List
          </button>
        </div>
      </div>
    );
  }

  const statusClass =
    center.status === "Online"
      ? "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200"
      : "inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 border border-red-200";

  const StatusIcon = center.status === "Online" ? Wifi : WifiOff;

  const handleGeoFenceChange = (field, value) => {
    setGeoFence((prev) => ({
      ...prev,
      [field]: field === "radius" ? Number(value) : Number(value),
    }));
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/center-management")}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Center List</span>
      </button>

      {/* Center Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{center.name}</h1>
              <p className="text-sm text-gray-600 mb-2">{center.region}</p>
              <div className="flex items-center gap-4">
                <span className={statusClass}>
                  <StatusIcon className="h-3 w-3" />
                  {center.status}
                </span>
                <span className="text-sm text-gray-600">ID: {center.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Geo-Fence Tab */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Geo-Fencing Configuration</h2>
          <p className="text-sm text-gray-600 mt-1">
            Set the geographic boundaries for this inspection center.
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interactive Map */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Click on the map to update coordinates. The circle shows the geo-fence radius.
                </p>
                <div className="h-96 rounded-lg border border-gray-300 overflow-hidden">
                  <MapPicker
                    lat={geoFence.lat}
                    lng={geoFence.lng}
                    radius={geoFence.radius}
                    onCoordinateChange={(lat, lng) => {
                      setGeoFence((prev) => ({ ...prev, lat, lng }));
                    }}
                    className="h-full"
                  />
                </div>
              </div>
            </div>

            {/* Geo-Fence Controls */}
            <div className="space-y-6">
              {/* Latitude Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={geoFence.lat}
                  onChange={(e) => handleGeoFenceChange("lat", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                  placeholder="Enter latitude"
                />
                <p className="text-xs text-gray-500">
                  Current: {geoFence.lat.toFixed(6)} | Click map or enter manually
                </p>
              </div>

              {/* Longitude Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={geoFence.lng}
                  onChange={(e) => handleGeoFenceChange("lng", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                  placeholder="Enter longitude"
                />
                <p className="text-xs text-gray-500">
                  Current: {geoFence.lng.toFixed(6)} | Click map or enter manually
                </p>
              </div>

              {/* Radius Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Geo-Fence Radius (Meters)
                  </label>
                  <span className="text-lg font-semibold text-gray-900">
                    {geoFence.radius} m
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={geoFence.radius}
                  onChange={(e) => handleGeoFenceChange("radius", e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>100 m</span>
                  <span>1050 m</span>
                  <span>2000 m</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Adjust the radius to define the inspection center's coverage area.
                </p>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    updateCenter(center.id, {
                      lat: geoFence.lat,
                      lng: geoFence.lng,
                      radius: geoFence.radius,
                    });
                    alert("Geo-fence configuration saved successfully!");
                  }}
                  className="w-full rounded-lg bg-gray-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Save Geo-Fence Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CenterDetail;

