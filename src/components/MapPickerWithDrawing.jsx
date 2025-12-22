import { useEffect, useRef, useState } from "react";
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

function MapPickerWithDrawing({ 
  lat, 
  lng, 
  radius, 
  geofenceType = 'circle',
  polygon = [],
  onCoordinateChange, 
  onPolygonChange,
  className = "" 
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const polygonRef = useRef(null);
  const polygonMarkersRef = useRef([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const isDrawingRef = useRef(false);
  const geofenceTypeRef = useRef(geofenceType);
  const polygonRef_state = useRef(polygon);
  const onPolygonChangeRef = useRef(onPolygonChange);

  // Keep refs in sync
  useEffect(() => {
    isDrawingRef.current = isDrawing;
    geofenceTypeRef.current = geofenceType;
    polygonRef_state.current = polygon;
    onPolygonChangeRef.current = onPolygonChange;
  }, [isDrawing, geofenceType, polygon, onPolygonChange]);

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

    // Handle map click - use refs to avoid stale closures
    const handleMapClick = (e) => {
      const { lat, lng } = e.latlng;
      
      if (geofenceTypeRef.current === 'polygon' && isDrawingRef.current) {
        // Get current polygon from ref (always up-to-date)
        const currentPolygon = polygonRef_state.current || [];
        
        // Check if clicking near the first point (to close polygon)
        if (currentPolygon.length >= 3) {
          const firstPoint = currentPolygon[0];
          const distance = map.distance([lat, lng], firstPoint);
          // If within 50 meters of first point, close the polygon
          if (distance < 50) {
            // Close polygon by adding first point at the end
            const closedPolygon = [...currentPolygon, firstPoint];
            if (onPolygonChangeRef.current) {
              onPolygonChangeRef.current(closedPolygon);
            }
            setIsDrawing(false);
            return;
          }
        }
        
        // Add point to polygon
        const newPolygon = [...currentPolygon, [lat, lng]];
        if (onPolygonChangeRef.current) {
          onPolygonChangeRef.current(newPolygon);
        }
      } else if (geofenceTypeRef.current === 'circle') {
        // Set center location
        if (onCoordinateChange) {
          onCoordinateChange(lat, lng);
        }
      }
    };

    // Handle double-click to finish polygon
    const handleMapDoubleClick = (e) => {
      if (geofenceTypeRef.current === 'polygon' && isDrawingRef.current) {
        const currentPolygon = polygonRef_state.current || [];
        if (currentPolygon.length >= 3) {
          // Close polygon by adding first point at the end
          const closedPolygon = [...currentPolygon, currentPolygon[0]];
          if (onPolygonChangeRef.current) {
            onPolygonChangeRef.current(closedPolygon);
          }
          setIsDrawing(false);
        }
      }
    };

    map.on("click", handleMapClick);
    map.on("dblclick", handleMapDoubleClick);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off("click", handleMapClick);
        mapInstanceRef.current.off("dblclick", handleMapDoubleClick);
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker, circle, and polygon when props change
  useEffect(() => {
    if (!mapInstanceRef.current || (!lat || !lng)) return;

    const map = mapInstanceRef.current;

    // Remove existing layers
    if (markerRef.current) {
      map.removeLayer(markerRef.current);
    }
    if (circleRef.current) {
      map.removeLayer(circleRef.current);
    }
    if (polygonRef.current) {
      map.removeLayer(polygonRef.current);
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

    // Add circle for radius (if circle type)
    if (geofenceType === 'circle' && radius && radius > 0) {
      const circle = L.circle([lat, lng], {
        radius: radius,
        color: "#3b82f6",
        fillColor: "#3b82f6",
        fillOpacity: 0.2,
        weight: 2,
      }).addTo(map);

      circleRef.current = circle;
    }

    // Remove existing polygon markers
    polygonMarkersRef.current.forEach(marker => {
      if (map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    });
    polygonMarkersRef.current = [];

    // Add polygon (if polygon type and has points)
    if (geofenceType === 'polygon' && polygon.length > 0) {
      // Draw polygon
      const polygonLayer = L.polygon(polygon, {
        color: "#3b82f6",
        fillColor: "#3b82f6",
        fillOpacity: 0.2,
        weight: 2,
      }).addTo(map);

      polygonRef.current = polygonLayer;

      // Add markers for each polygon point
      polygon.forEach((point, index) => {
        const isFirstPoint = index === 0;
        const isLastPoint = index === polygon.length - 1;
        const isClosed = polygon.length > 3 && isLastPoint && 
          point[0] === polygon[0][0] && point[1] === polygon[0][1];

        const markerColor = isFirstPoint ? '#10b981' : (isClosed ? '#10b981' : '#3b82f6');
        const markerSize = isFirstPoint || isClosed ? 20 : 16;

        const pointMarker = L.circleMarker(point, {
          radius: markerSize,
          fillColor: markerColor,
          color: '#ffffff',
          weight: 2,
          fillOpacity: 0.8,
        }).addTo(map);

        // Add number label
        if (!isClosed || index === 0) {
          const label = L.divIcon({
            className: 'polygon-point-label',
            html: `<div style="
              background-color: ${markerColor};
              color: white;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              font-weight: bold;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ">${index + 1}</div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });
          L.marker(point, { icon: label }).addTo(map);
        }

        polygonMarkersRef.current.push(pointMarker);
      });
    }

    // Center map on marker
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, radius, geofenceType, polygon, onCoordinateChange]);

  const handleStartDrawing = () => {
    setIsDrawing(true);
    onPolygonChange([]);
  };

  const handleFinishDrawing = () => {
    if (polygon.length >= 3) {
      // Close polygon by adding first point at the end if not already closed
      const isClosed = polygon.length > 3 && 
        polygon[polygon.length - 1][0] === polygon[0][0] && 
        polygon[polygon.length - 1][1] === polygon[0][1];
      
      if (!isClosed) {
        const closedPolygon = [...polygon, polygon[0]];
        onPolygonChange(closedPolygon);
      }
    }
    setIsDrawing(false);
  };

  const handleClearPolygon = () => {
    onPolygonChange([]);
    setIsDrawing(false);
  };

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
            {geofenceType === 'circle' && radius && (
              <span className="text-gray-500">| {radius} m</span>
            )}
            {geofenceType === 'polygon' && polygon.length > 0 && (
              <span className="text-gray-500">| {polygon.length} points</span>
            )}
          </div>
        </div>
      )}
      <div className="absolute top-2 right-2 z-[1000] bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-gray-200 max-w-xs">
        <p className="text-xs text-gray-600">
          {geofenceType === 'circle' 
            ? 'Click map to set location • Drag marker to adjust'
            : isDrawing 
              ? `Click to add points (${polygon.length} points) • Double-click or click first point to finish`
              : 'Click "Start Drawing" to define polygon area'}
        </p>
      </div>
      {geofenceType === 'polygon' && (
        <div className="absolute bottom-2 left-2 z-[1000] flex gap-2">
          {!isDrawing ? (
            <button
              onClick={handleStartDrawing}
              className="bg-[#88bf47] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0fa84a] shadow-lg"
            >
              Start Drawing
            </button>
          ) : (
            <>
              <button
                onClick={handleFinishDrawing}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 shadow-lg"
              >
                Finish Drawing
              </button>
              <button
                onClick={handleClearPolygon}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 shadow-lg"
              >
                Clear
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default MapPickerWithDrawing;

