import React, { useEffect, useRef, useState, useId } from "react";
import { Navigation, Bus, MapPin, Compass, Layers, Crosshair, RefreshCw, AlertCircle, Phone, Gauge, Fuel } from "lucide-react";
import { transportService } from "../../api/transportService";

export default function TransportRealMap({
  vehicles = [],
  routes = [],
  selectedVehicle = null,
  onSelectVehicle = () => {},
  height = "520px",
  onRefresh = () => {}
}) {
  const containerId = useId().replace(/:/g, "_");
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const routeLayersRef = useRef([]);
  const tileLayerRef = useRef(null);

  const [mapType, setMapType] = useState("streets"); // "streets" | "satellite"
  const [leafletReady, setLeafletReady] = useState(false);
  const [mapInitError, setMapInitError] = useState(false);
  const [gpsSyncing, setGpsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState("");

  // Ensure Leaflet is available safely
  useEffect(() => {
    if (typeof window !== "undefined" && window.L) {
      setLeafletReady(true);
      return;
    }

    let checkInterval = null;
    let timeoutId = null;

    if (typeof window !== "undefined") {
      checkInterval = setInterval(() => {
        if (window.L) {
          setLeafletReady(true);
          clearInterval(checkInterval);
        }
      }, 150);

      timeoutId = setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.L) {
          try {
            const script = document.createElement("script");
            script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
            script.async = true;
            script.onload = () => setLeafletReady(true);
            script.onerror = () => setMapInitError(true);
            document.head.appendChild(script);
          } catch (e) {
            setMapInitError(true);
          }
        }
      }, 1800);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Initialize Leaflet Map Safely
  useEffect(() => {
    if (!leafletReady || !mapContainerRef.current || !window.L) return;

    try {
      const L = window.L;

      // Safely cleanup if container was previously used
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {}
        mapInstanceRef.current = null;
      }

      if (mapContainerRef.current._leaflet_id) {
        delete mapContainerRef.current._leaflet_id;
      }

      // Default center: Delhi NCR
      const defaultCenter = selectedVehicle?.currentLocation?.lat 
        ? [selectedVehicle.currentLocation.lat, selectedVehicle.currentLocation.lng]
        : [28.6139, 77.2090];
      const initialZoom = selectedVehicle ? 14 : 12;

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: initialZoom,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: "topright" }).addTo(map);

      // Tile layer
      tileLayerRef.current = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapInitError(false);
    } catch (err) {
      console.warn("Leaflet map initialization handled:", err);
      setMapInitError(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {}
        mapInstanceRef.current = null;
      }
    };
  }, [leafletReady]);

  // Handle Map Type change
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    try {
      const L = window.L;
      const map = mapInstanceRef.current;

      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
      }

      if (mapType === "satellite") {
        tileLayerRef.current = L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          { maxZoom: 18 }
        ).addTo(map);
      } else {
        tileLayerRef.current = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          { maxZoom: 19 }
        ).addTo(map);
      }
    } catch (e) {
      console.warn("Map layer switch error handled:", e);
    }
  }, [mapType]);

  // Update Vehicle Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    try {
      const L = window.L;
      const map = mapInstanceRef.current;

      // Clear existing markers
      Object.keys(markersRef.current).forEach(id => {
        try {
          map.removeLayer(markersRef.current[id]);
        } catch (e) {}
      });
      markersRef.current = {};

      const bounds = [];

      vehicles.forEach(v => {
        const lat = v.currentLocation?.lat || 28.6139;
        const lng = v.currentLocation?.lng || 77.2090;
        const vId = v.id || v.vehicleNo;
        bounds.push([lat, lng]);

        const isSelected = selectedVehicle && (selectedVehicle.id === v.id || selectedVehicle.vehicleNo === v.vehicleNo);
        const isMoving = (v.speed || 0) > 0;

        const markerHtml = `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            ${isSelected ? '<span style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: rgba(99, 102, 241, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>' : ''}
            <div style="width: 36px; height: 36px; border-radius: 9999px; background: ${isSelected ? '#4f46e5' : isMoving ? '#16a34a' : '#d97706'}; border: 2.5px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
              <svg style="width: 18px; height: 18px; fill: white;" viewBox="0 0 24 24">
                <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
              </svg>
            </div>
            <div style="position: absolute; top: -24px; white-space: nowrap; background: #0f172a; color: white; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.25);">
              ${v.vehicleNo}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: "custom-bus-marker",
          html: markerHtml,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
          popupAnchor: [0, -20]
        });

        const popupContent = `
          <div style="font-family: inherit; min-width: 210px; padding: 6px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <strong style="font-size: 13px; color: #0f172a;">🚌 ${v.vehicleNo}</strong>
              <span style="font-size: 10px; font-weight: 800; background: ${isMoving ? '#dcfce7' : '#fef3c7'}; color: ${isMoving ? '#15803d' : '#b45309'}; padding: 2px 6px; border-radius: 4px;">
                ${isMoving ? `${v.speed} km/h` : 'Halted'}
              </span>
            </div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">Driver: <strong style="color: #1e293b;">${v.driver || 'Assigned'}</strong></div>
            <div style="font-size: 11px; color: #475569; margin-bottom: 4px;">📍 ${v.currentLocation?.address || 'In Transit'}</div>
            <div style="font-size: 9px; font-family: monospace; color: #94a3b8;">GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}</div>
          </div>
        `;

        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
        marker.bindPopup(popupContent);
        marker.on("click", () => onSelectVehicle(v));
        markersRef.current[vId] = marker;
      });

      if (selectedVehicle) {
        const sLat = selectedVehicle.currentLocation?.lat || 28.6139;
        const sLng = selectedVehicle.currentLocation?.lng || 77.2090;
        map.flyTo([sLat, sLng], 14, { animate: true, duration: 1 });
        const selMarker = markersRef.current[selectedVehicle.id || selectedVehicle.vehicleNo];
        if (selMarker) selMarker.openPopup();
      } else if (bounds.length > 0 && !markersRef.current.hasFitted) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
        markersRef.current.hasFitted = true;
      }
    } catch (e) {
      console.warn("Marker update error handled:", e);
    }
  }, [vehicles, selectedVehicle, leafletReady]);

  // Draw Route Paths & Stop Pins
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L || !routes || routes.length === 0) return;
    try {
      const L = window.L;
      const map = mapInstanceRef.current;

      routeLayersRef.current.forEach(layer => {
        try { map.removeLayer(layer); } catch (e) {}
      });
      routeLayersRef.current = [];

      const routeColors = ["#4f46e5", "#0284c7", "#059669", "#d97706", "#db2777"];

      routes.forEach((route, rIdx) => {
        const color = routeColors[rIdx % routeColors.length];
        const stopPoints = [];

        (route.stops || []).forEach((st, sIdx) => {
          if (st.location && st.location.lat && st.location.lng) {
            stopPoints.push([st.location.lat, st.location.lng]);

            const stopIcon = L.divIcon({
              className: "custom-stop-marker",
              html: `
                <div style="width: 22px; height: 22px; border-radius: 9999px; background: white; border: 2px solid ${color}; box-shadow: 0 2px 5px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; color: ${color};">
                  ${st.stopOrder || sIdx + 1}
                </div>
              `,
              iconSize: [22, 22],
              iconAnchor: [11, 11]
            });

            const stopMarker = L.marker([st.location.lat, st.location.lng], { icon: stopIcon })
              .bindPopup(`<strong>${st.stopName}</strong><br/>Route: ${route.name}<br/>Pickup: ${st.pickupTime || '--'}`)
              .addTo(map);

            routeLayersRef.current.push(stopMarker);
          }
        });

        if (stopPoints.length >= 2) {
          const polyline = L.polyline(stopPoints, {
            color: color,
            weight: 3.5,
            opacity: 0.8,
            dashArray: "6, 8"
          }).addTo(map);

          routeLayersRef.current.push(polyline);
        }
      });
    } catch (e) {
      console.warn("Route path error handled:", e);
    }
  }, [routes, leafletReady]);

  // Real GPS Device Sync using HTML5 Geolocation API
  const handleSyncRealDeviceGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setGpsSyncing(true);
    setSyncStatus("Acquiring Real Device Physical GPS coordinates...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, speed } = pos.coords;
        setSyncStatus(`GPS Acquired: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);

        try {
          const targetVehicle = selectedVehicle || vehicles[0];
          await transportService.updateVehicleGPS({
            vehicleId: targetVehicle?.id,
            vehicleNumber: targetVehicle?.vehicleNo,
            lat: latitude,
            lng: longitude,
            speed: speed ? Math.round(speed * 3.6) : 38,
            address: `Real Device GPS Location (Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)})`
          });

          setSyncStatus(`Synced to ${targetVehicle?.vehicleNo || 'Fleet'} successfully!`);
          setGpsSyncing(false);

          if (mapInstanceRef.current && window.L) {
            mapInstanceRef.current.flyTo([latitude, longitude], 15, { animate: true, duration: 1.5 });
          }

          if (onRefresh) onRefresh();
          setTimeout(() => setSyncStatus(""), 4000);
        } catch (err) {
          console.error("GPS Sync error:", err);
          setSyncStatus("Failed to sync GPS to server");
          setGpsSyncing(false);
        }
      },
      (err) => {
        console.warn("Geolocation warning:", err.message);
        setSyncStatus("GPS permission denied or unavailable.");
        setGpsSyncing(false);
        setTimeout(() => setSyncStatus(""), 4000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleFitAll = () => {
    if (!mapInstanceRef.current || vehicles.length === 0) return;
    try {
      const bounds = vehicles.map(v => [v.currentLocation?.lat || 28.6139, v.currentLocation?.lng || 77.2090]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } catch (e) {}
  };

  const activeFocus = selectedVehicle || vehicles[0] || {
    vehicleNo: "DL-01-AB-4501",
    currentLocation: { lat: 28.6139, lng: 77.2090, address: "Connaught Place, New Delhi" }
  };

  return (
    <div className="relative rounded-2xl border border-slate-200/80 bg-slate-900 shadow-sm overflow-hidden" style={{ height }}>
      
      {/* 1. Leaflet Interactive Container (Primary) */}
      <div 
        id={`leaflet-map-${containerId}`}
        ref={mapContainerRef} 
        className="w-full h-full z-0" 
      />

      {/* 2. Seamless OpenStreetMap Iframe Fallback (If Leaflet CDN blocked/offline) */}
      {mapInitError && (
        <iframe
          title="OpenStreetMap Real View"
          className="w-full h-full border-none z-0"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${(activeFocus.currentLocation?.lng || 77.2090) - 0.08},${(activeFocus.currentLocation?.lat || 28.6139) - 0.08},${(activeFocus.currentLocation?.lng || 77.2090) + 0.08},${(activeFocus.currentLocation?.lat || 28.6139) + 0.08}&layer=mapnik&marker=${activeFocus.currentLocation?.lat || 28.6139},${activeFocus.currentLocation?.lng || 77.2090}`}
        />
      )}

      {/* Floating Controls Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2 items-center">
        {/* Layer Toggle */}
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-sm rounded-xl px-2.5 py-1 flex items-center gap-1 text-xs font-bold text-slate-700">
          <Layers className="w-3.5 h-3.5 text-indigo-600" />
          <button
            onClick={() => setMapType("streets")}
            className={`px-2.5 py-1 rounded-lg cursor-pointer border-none text-[11px] font-bold transition-all ${
              mapType === "streets" ? "bg-indigo-600 text-white shadow-xs" : "bg-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Streets
          </button>
          <button
            onClick={() => setMapType("satellite")}
            className={`px-2.5 py-1 rounded-lg cursor-pointer border-none text-[11px] font-bold transition-all ${
              mapType === "satellite" ? "bg-indigo-600 text-white shadow-xs" : "bg-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Satellite
          </button>
        </div>

        {/* Real Device GPS Sync Button */}
        <button
          onClick={handleSyncRealDeviceGPS}
          disabled={gpsSyncing}
          title="Sync real physical GPS from your phone/browser to this school bus"
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer border-none active:scale-95 transition-all"
        >
          <Crosshair className={`w-3.5 h-3.5 ${gpsSyncing ? 'animate-spin' : ''}`} />
          <span>{gpsSyncing ? "Acquiring GPS..." : "📡 Sync Real Device GPS"}</span>
        </button>

        {/* Fit All Bounds Button */}
        <button
          onClick={handleFitAll}
          className="bg-white/95 hover:bg-white text-slate-700 text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-1 cursor-pointer transition-all"
        >
          <Compass className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline">Fit All Buses</span>
        </button>

        {/* Refresh Live Map */}
        <button
          onClick={onRefresh}
          className="bg-white/95 hover:bg-white text-slate-700 text-xs font-bold p-2 rounded-xl border border-slate-200/80 shadow-sm cursor-pointer transition-all"
          title="Refresh Live Fleet Telemetry"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
        </button>
      </div>

      {/* GPS Status Toast Bar */}
      {syncStatus && (
        <div className="absolute bottom-3 left-3 right-3 z-10 bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-xl border border-slate-700 shadow-xl text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{syncStatus}</span>
          </div>
          <button onClick={() => setSyncStatus("")} className="text-slate-400 hover:text-white bg-transparent border-none text-xs cursor-pointer">✕</button>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-3 right-3 z-10 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl p-2.5 text-[10px] font-bold text-slate-700 space-y-1.5 shadow-md pointer-events-none hidden md:block">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shadow-xs"></span>
          <span>Bus In Motion</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shadow-xs"></span>
          <span>Selected Vehicle</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shadow-xs"></span>
          <span>Idle / Workshop</span>
        </div>
      </div>
    </div>
  );
}
