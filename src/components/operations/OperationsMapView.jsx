import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function OperationsMapView({ centers, onCenterClick, filters }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on Ethiopia
    const map = L.map(mapRef.current, {
      center: [9.1450, 38.7618],
      zoom: 6,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when centers change
  useEffect(() => {
    if (!mapInstanceRef.current || !centers.length) return;

    const map = mapInstanceRef.current;

    // Remove existing markers
    markersRef.current.forEach(marker => {
      map.removeLayer(marker);
    });
    markersRef.current = [];

    // Add markers for each center
    centers.forEach(center => {
      if (!center.geo_lat || !center.geo_lon) return;

      const status = center.status || 'Offline';
      const statusColor = 
        status === 'Online' ? '#16A34A' :
        status === 'Degraded' ? '#F59E0B' :
        '#DC2626';

      // Create custom marker icon
      const icon = L.divIcon({
        className: 'custom-center-marker',
        html: `
          <div style="
            background-color: ${statusColor};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          ">
            ${center.open_incidents_count?.critical > 0 ? '⚠️' : ''}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([center.geo_lat, center.geo_lon], { icon })
        .addTo(map)
        .on('click', () => {
          onCenterClick(center);
        });

      // Add popup
      const lastHeartbeat = center.last_heartbeat_at 
        ? new Date(center.last_heartbeat_at).toLocaleString('en-ET')
        : 'Never';
      
      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px;">${center.center_name}</h3>
          <p style="margin: 4px 0; font-size: 12px;">
            <strong>Status:</strong> <span style="color: ${statusColor}">${status}</span>
          </p>
          <p style="margin: 4px 0; font-size: 12px;">
            <strong>Last Heartbeat:</strong> ${lastHeartbeat}
          </p>
          <p style="margin: 4px 0; font-size: 12px;">
            <strong>Incidents:</strong> ${center.open_incidents_count?.total || 0}
          </p>
          <p style="margin: 4px 0; font-size: 12px;">
            <strong>Attention Score:</strong> ${center.attention_score || 0}/100
          </p>
        </div>
      `);

      markersRef.current.push(marker);
    });

    // Fit map to show all markers
    if (markersRef.current.length > 0) {
      const group = new L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [centers, onCenterClick]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="h-[600px] relative">
        <div ref={mapRef} className="w-full h-full" />
        
        {/* Legend */}
        <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 p-3">
          <div className="text-xs font-semibold text-gray-700 mb-2">Status</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow"></div>
              <span className="text-xs text-gray-600">Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white shadow"></div>
              <span className="text-xs text-gray-600">Degraded</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow"></div>
              <span className="text-xs text-gray-600">Offline</span>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-3">
          <div className="text-xs font-semibold text-gray-700 mb-2">Summary</div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <div className="text-gray-500">Total Centers</div>
              <div className="font-semibold text-gray-900">{centers.length}</div>
            </div>
            <div>
              <div className="text-gray-500">Online</div>
              <div className="font-semibold text-green-600">
                {centers.filter(c => c.status === 'Online').length}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Issues</div>
              <div className="font-semibold text-red-600">
                {centers.filter(c => c.status !== 'Online').length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OperationsMapView;

