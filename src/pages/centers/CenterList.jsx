import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Wifi, WifiOff, Plus } from "lucide-react";
import MapPicker from "../../components/MapPicker";
import { useCenters } from "../../context/CentersContext";

const REGIONS = ["Addis Ababa", "Oromia", "Amhara", "Tigray", "SNNPR", "Afar", "Somali", "Gambela", "Harari", "Dire Dawa"];

function CenterList() {
  const navigate = useNavigate();
  const { centers, addCenter } = useCenters();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    region: "",
    status: "Online",
    lat: 9.1450, // Default to Addis Ababa
    lng: 38.7618,
    radius: 500,
  });

  const statusClass = (status) =>
    status === "Online"
      ? "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200"
      : "inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 border border-red-200";

  const StatusIcon = ({ status }) =>
    status === "Online" ? (
      <Wifi className="h-3 w-3" />
    ) : (
      <WifiOff className="h-3 w-3" />
    );

  const handleViewDetails = (centerId) => {
    navigate(`/center-management/${centerId}`);
  };

  const handleOpenModal = () => {
    setForm({
      name: "",
      region: "",
      status: "Online",
      lat: 9.1450,
      lng: 38.7618,
      radius: 500,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCenter = {
      id: `CTR-${String(centers.length + 1).padStart(3, "0")}`,
      name: form.name,
      region: form.region,
      status: form.status,
      lat: form.lat,
      lng: form.lng,
      radius: form.radius,
    };
    addCenter(newCenter);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Center Management</h1>
          <p className="text-gray-600">
            Manage inspection centers and their geo-fencing coordinates.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white text-sm font-medium px-5 py-2.5 hover:bg-gray-800 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Center
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Center Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Coordinates
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Geo-Fence Radius
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {centers.map((center) => (
                <tr key={center.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div className="text-sm font-medium text-gray-900">{center.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{center.region}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{center.radius} m</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={statusClass(center.status)}>
                      <StatusIcon status={center.status} />
                      {center.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(center.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {centers.length === 0 && (
                <tr>
                  <td
                    className="px-6 py-12 text-center text-sm text-gray-500"
                    colSpan={6}
                  >
                    No centers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Center Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl rounded-xl bg-white shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">Add New Center</h2>
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
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Center Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Center Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                    placeholder="Enter center name"
                  />
                </div>

                {/* Region */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Region *
                  </label>
                  <select
                    required
                    value={form.region}
                    onChange={(e) => setForm({ ...form, region: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                  >
                    <option value="">Select region</option>
                    {REGIONS.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Status *
                  </label>
                  <select
                    required
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>

                {/* Radius */}
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
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">100 m</span>
                      <span className="text-sm font-semibold text-gray-900">{form.radius} m</span>
                      <span className="text-xs text-gray-500">2000 m</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map and Coordinates */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Set Location on Map *
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Click on the map to set the center coordinates. The circle shows the geo-fence radius.
                  </p>
                  <div className="h-96 rounded-lg border border-gray-300 overflow-hidden">
                    <MapPicker
                      lat={form.lat}
                      lng={form.lng}
                      radius={form.radius}
                      onCoordinateChange={(lat, lng) => setForm({ ...form, lat, lng })}
                      className="h-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={form.lat}
                      onChange={(e) => setForm({ ...form, lat: Number(e.target.value) })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                      placeholder="Enter latitude"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={form.lng}
                      onChange={(e) => setForm({ ...form, lng: Number(e.target.value) })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                      placeholder="Enter longitude"
                    />
                  </div>
                </div>
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
                  className="rounded-lg bg-gray-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Save Center
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CenterList;

