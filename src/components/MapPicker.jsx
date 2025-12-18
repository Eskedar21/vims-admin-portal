import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";

// Fix for default marker icons in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function MapPicker({ lat, lng, radius, onCoordinateChange, className = "" }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    // Initialize map
    if (!mapRef.current || mapInstanceRef.current) return;

    // Default to Addis Ababa if no coordinates provided
    const defaultLat = lat || 9.1450;
    const defaultLng = lng || 38.7618;

    const map = L.map(mapRef.current, {
      center: [defaultLat, defaultLng],
      zoom: 13,
      scrollWheelZoom: true,
    });

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Handle map click
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      if (onCoordinateChange) {
        onCoordinateChange(lat, lng);
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker and circle when coordinates or radius change
  useEffect(() => {
    if (!mapInstanceRef.current || (!lat || !lng)) return;

    const map = mapInstanceRef.current;

    // Remove existing marker and circle
    if (markerRef.current) {
      map.removeLayer(markerRef.current);
    }
    if (circleRef.current) {
      map.removeLayer(circleRef.current);
    }

    // Create custom marker icon
    const customIcon = L.divIcon({
      className: "custom-marker",
      html: `<div style="
        background-color: #ef4444;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    // Add marker
    const marker = L.marker([lat, lng], { icon: customIcon, draggable: true }).addTo(map);

    marker.on("dragend", (e) => {
      const { lat, lng } = e.target.getLatLng();
      if (onCoordinateChange) {
        onCoordinateChange(lat, lng);
      }
    });

    markerRef.current = marker;

    // Add circle for radius
    if (radius && radius > 0) {
      const circle = L.circle([lat, lng], {
        radius: radius,
        color: "#3b82f6",
        fillColor: "#3b82f6",
        fillOpacity: 0.2,
        weight: 2,
      }).addTo(map);

      circleRef.current = circle;
    }

    // Center map on marker
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, radius, onCoordinateChange]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-lg" style={{ minHeight: "384px" }} />
      {lat && lng && (
        <div className="absolute top-2 left-2 z-[1000] bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <MapPin className="h-3 w-3 text-red-500" />
            <span className="font-medium">
              {lat.toFixed(6)}, {lng.toFixed(6)}
            </span>
            {radius && (
              <span className="text-gray-500">| {radius} m</span>
            )}
          </div>
        </div>
      )}
      <div className="absolute top-2 right-2 z-[1000] bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-gray-200">
        <p className="text-xs text-gray-600">
          Click map to set location • Drag marker to adjust
        </p>
      </div>
    </div>
  );
}

export default MapPicker;
