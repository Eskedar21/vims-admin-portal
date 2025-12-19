import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { mockCentersFull } from '../../data/mockCentersInfrastructure';
import { useAuth } from '../../context/AuthContext';
import MapPicker from '../../components/MapPicker';

// Mock geofence data
const mockGeofences = [
  {
    geofence_id: 'GEOF-001',
    center_id: 'CTR-001',
    geofence_type: 'Radius',
    center_lat: 8.9806,
    center_lon: 38.7578,
    radius_m: 50,
    green_radius_m: 50,
    yellow_radius_m: 100,
    effective_from: '2024-01-01T00:00:00Z',
    status: 'Active',
    created_by: 'admin-001',
    created_at: '2024-01-01T00:00:00Z',
  },
];

function GeofenceConfiguration() {
  const { id: centerId } = useParams();
  const { user } = useAuth();
  const [geofence, setGeofence] = useState(
    mockGeofences.find(g => g.center_id === centerId) || null
  );
  const [formData, setFormData] = useState({
    geofence_type: 'Radius',
    center_lat: 0,
    center_lon: 0,
    radius_m: 50,
    green_radius_m: 50,
    yellow_radius_m: 100,
  });
  const [isEditing, setIsEditing] = useState(false);

  const center = mockCentersFull.find(c => c.center_id === centerId);

  useEffect(() => {
    if (center) {
      if (geofence) {
        setFormData({
          geofence_type: geofence.geofence_type,
          center_lat: geofence.center_lat,
          center_lon: geofence.center_lon,
          radius_m: geofence.radius_m,
          green_radius_m: geofence.green_radius_m,
          yellow_radius_m: geofence.yellow_radius_m,
        });
      } else {
        // Auto-create default 50m geofence
        setFormData({
          geofence_type: 'Radius',
          center_lat: center.geo_lat,
          center_lon: center.geo_lon,
          radius_m: 50,
          green_radius_m: 50,
          yellow_radius_m: 100,
        });
      }
    }
  }, [center, geofence]);

  const handleSave = () => {
    if (!formData.center_lat || !formData.center_lon) {
      alert('Center location is required');
      return;
    }

    const savedGeofence = {
      geofence_id: geofence?.geofence_id || `GEOF-${Date.now()}`,
      center_id: centerId,
      ...formData,
      effective_from: geofence?.effective_from || new Date().toISOString(),
      status: 'Active',
      created_by: geofence?.created_by || user?.id || 'admin-001',
      created_at: geofence?.created_at || new Date().toISOString(),
    };
    
    setGeofence(savedGeofence);
    setIsEditing(false);
    console.log('Geofence updated (audit logged, may require approval)', savedGeofence);
  };

  if (!center) {
    return (
      <div className="max-w-4xl mx-auto mt-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Center Not Found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Geofence Configuration</h1>
          <p className="text-gray-600">
            Automatic geofence setup with default 50m radius and compliance monitoring
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition flex items-center gap-2"
          >
            <MapPin className="h-5 w-5" />
            Edit Geofence
          </button>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-sm font-semibold text-green-800">
            Automatic Configuration
          </span>
        </div>
        <p className="text-sm text-green-700">
          When a center is created with valid lat/lon, the system automatically creates a geofence with radius 50m.
          Green/Yellow/Red thresholds are recorded (50/100) for consistent grading.
        </p>
      </div>

      {/* Geofence Display/Edit */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Geofence Visualization</h3>
                <div className="h-96 rounded-lg border border-gray-300 overflow-hidden">
                  <MapPicker
                    lat={formData.center_lat}
                    lng={formData.center_lon}
                    radius={formData.radius_m}
                    onCoordinateChange={(lat, lng) => {
                      if (isEditing) {
                        setFormData({ ...formData, center_lat: lat, center_lon: lng });
                      }
                    }}
                    className="h-full"
                  />
                </div>
              </div>
            </div>

            {/* Configuration */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Geofence Parameters</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Geofence Type
                    </label>
                    <select
                      value={formData.geofence_type}
                      onChange={(e) => setFormData({ ...formData, geofence_type: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639] disabled:bg-gray-100"
                    >
                      <option value="Radius">Radius</option>
                      <option value="Polygon" disabled>Polygon (Future)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Center Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formData.center_lat}
                        onChange={(e) => setFormData({ ...formData, center_lat: parseFloat(e.target.value) || 0 })}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639] disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Center Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formData.center_lon}
                        onChange={(e) => setFormData({ ...formData, center_lon: parseFloat(e.target.value) || 0 })}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639] disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Radius (meters) - Default: 50m
                    </label>
                    <input
                      type="number"
                      value={formData.radius_m}
                      onChange={(e) => {
                        const radius = parseInt(e.target.value) || 50;
                        setFormData({
                          ...formData,
                          radius_m: radius,
                          green_radius_m: radius,
                          yellow_radius_m: radius * 2,
                        });
                      }}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009639] disabled:bg-gray-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Default radius is 50m. Yellow threshold is automatically set to 2x radius (100m).
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Green Zone (≤50m)</span>
                      <span className="text-sm font-medium text-green-700">{formData.green_radius_m}m</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Yellow Zone (50-100m)</span>
                      <span className="text-sm font-medium text-yellow-700">
                        {formData.green_radius_m + 1}-{formData.yellow_radius_m}m
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Red Zone ({'>'}100m)</span>
                      <span className="text-sm font-medium text-red-700">&gt;{formData.yellow_radius_m}m</span>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        ⚠️ Editing geofence parameters is restricted, logged, and may require approval.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      // Reset form data
                      if (geofence) {
                        setFormData({
                          geofence_type: geofence.geofence_type,
                          center_lat: geofence.center_lat,
                          center_lon: geofence.center_lon,
                          radius_m: geofence.radius_m,
                          green_radius_m: geofence.green_radius_m,
                          yellow_radius_m: geofence.yellow_radius_m,
                        });
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 bg-[#009639] text-white rounded-lg hover:bg-[#007A2F] transition flex items-center justify-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Geofence
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeofenceConfiguration;


