import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import {
  Compass,
  Navigation,
  ExternalLink,
  MapPin,
  Building2,
  AlertTriangle,
  HardHat,
  Layers,
  Sparkles,
} from 'lucide-react';

export const MapCard = ({
  title = "Ward Overview Map",
  center,
  latitude = 19.8762,
  longitude = 75.3433,
  zoom = 14,
  height = "340px",
  markers = [],
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerInstancesRef = useRef([]);
  const [activeMarkerId, setActiveMarkerId] = useState(null);
  const navigate = useNavigate();

  const actualLat = center && center.length === 2 ? center[0] : (latitude || 19.8762);
  const actualLng = center && center.length === 2 ? center[1] : (longitude || 75.3433);

  // Helper to construct custom production-level Leaflet DivIcon badges
  const createMarkerIcon = (type, priority) => {
    let bgColor = "#3b82f6";
    let pulseBg = "rgba(59, 130, 246, 0.4)";
    let iconSvg = "";

    if (type === "center") {
      bgColor = "#4f46e5";
      pulseBg = "rgba(79, 70, 229, 0.45)";
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`;
    } else if (priority === "CRITICAL" || (type && type.includes("CRITICAL"))) {
      bgColor = "#ef4444";
      pulseBg = "rgba(239, 68, 68, 0.45)";
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
    } else if (priority === "HIGH" || (type && type.includes("HIGH"))) {
      bgColor = "#f59e0b";
      pulseBg = "rgba(245, 158, 11, 0.45)";
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    } else {
      bgColor = "#10b981";
      pulseBg = "rgba(16, 185, 129, 0.45)";
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15v-3a8 8 0 0 1 16 0v3"/></svg>`;
    }

    return L.divIcon({
      className: "custom-leaflet-marker",
      html: `
        <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: ${pulseBg}; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 26px; height: 26px; border-radius: 50%; background-color: ${bgColor}; border: 2px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
            ${iconSvg}
          </div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -18],
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapContainerRef.current._leaflet_id && !mapInstanceRef.current) {
      mapContainerRef.current._leaflet_id = null;
    }

    let map = mapInstanceRef.current;
    if (!map) {
      map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView([actualLat, actualLng], zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Compact subtle attribution at bottom right
      L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('&copy; <a href="https://openstreetmap.org" class="text-slate-400 hover:text-slate-600">OpenStreetMap</a>')
        .addTo(map);

      mapInstanceRef.current = map;
    } else {
      map.setView([actualLat, actualLng], zoom);
    }

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    markerInstancesRef.current = [];

    // Add main ward center marker
    const centerPopup = `
      <div style="padding: 4px; font-family: inherit;">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
          <span style="background: #eef2ff; color: #4338ca; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">Ward HQ</span>
        </div>
        <div style="font-size: 12px; font-weight: 800; color: #0f172a; margin-bottom: 2px;">Ward 24 Administrative Center</div>
        <div style="font-size: 11px; color: #64748b;">Shivaji Nagar Ward Office • Active Dispatch Node</div>
      </div>
    `;

    const centerMarker = L.marker([actualLat, actualLng], {
      icon: createMarkerIcon("center", "NORMAL"),
    })
      .addTo(map)
      .bindPopup(centerPopup);

    markerInstancesRef.current.push({
      id: "ward-center",
      lat: actualLat,
      lng: actualLng,
      title: "Ward 24 Center",
      marker: centerMarker,
    });

    // Add passed incident markers
    markers.forEach((m, idx) => {
      if (m.lat && m.lng) {
        const priorityTag = m.description?.includes("CRITICAL")
          ? "CRITICAL"
          : m.description?.includes("HIGH")
          ? "HIGH"
          : m.priority || "NORMAL";

        const popupContent = `
          <div style="padding: 4px; font-family: inherit; min-width: 170px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 4px;">
              <span style="font-size: 11px; font-weight: 800; color: #0f172a;">${m.title}</span>
            </div>
            <div style="font-size: 10px; color: #475569; font-weight: 600; margin-bottom: 4px;">
              ${m.description || ''}
            </div>
            <div style="font-size: 9px; color: #94a3b8; font-family: monospace;">
              Coordinates: ${Number(m.lat).toFixed(4)}°N, ${Number(m.lng).toFixed(4)}°E
            </div>
          </div>
        `;

        const markerObj = L.marker([m.lat, m.lng], {
          icon: createMarkerIcon(m.type || "incident", priorityTag),
        })
          .addTo(map)
          .bindPopup(popupContent);

        markerInstancesRef.current.push({
          id: m.id || `marker-${idx}`,
          lat: m.lat,
          lng: m.lng,
          title: m.title,
          priority: priorityTag,
          marker: markerObj,
        });
      }
    });

    // Invalidate size once DOM layout completes to prevent tile seams
    const resizeTimer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(resizeTimer);
    };
  }, [actualLat, actualLng, zoom, JSON.stringify(markers)]);

  // Handle auto-fit on window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([actualLat, actualLng], zoom, { duration: 1 });
      setActiveMarkerId(null);
    }
  };

  const handleFocusIncident = (target) => {
    if (mapInstanceRef.current && target.marker) {
      setActiveMarkerId(target.id);
      mapInstanceRef.current.flyTo([target.lat, target.lng], 16, { duration: 1.2 });
      target.marker.openPopup();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 sm:p-5 flex flex-col justify-between h-full">
      {/* Map Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-xs">
              <MapPin className="w-4.5 h-4.5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-black text-slate-900 tracking-tight">{title}</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/70 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live GIS Feed
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Geo-spatial mapping of ward grievances, civic works & administrative assets
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 self-end sm:self-center">
            <button
              onClick={handleRecenter}
              title="Recenter to Ward Office"
              className="px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-slate-500" />
              <span>Recenter</span>
            </button>
            <button
              onClick={() => navigate('/corporator/gis')}
              title="Open Full Spatial Portal"
              className="px-2.5 py-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200 rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
            >
              <span>Full View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dynamic Responsive Leaflet Canvas (Fills vertical space without blank voids) */}
        <div className="relative mt-3 w-full rounded-xl border border-slate-200/90 overflow-hidden shadow-inner group">
          <div
            ref={mapContainerRef}
            style={{ minHeight: height || "340px", height: "350px" }}
            className="w-full z-0"
          />

          {/* Floating Glassmorphism Legend (Bottom-Left HUD) */}
          <div className="absolute bottom-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg rounded-lg p-2 text-[10px] space-y-1 text-slate-700 pointer-events-auto">
            <div className="font-black text-slate-900 text-[9px] uppercase tracking-wider border-b border-slate-100 pb-0.5">
              Live Map Layers
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span className="font-semibold text-rose-700">Critical Grievance (1)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span className="font-semibold text-amber-700">High Priority (1)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-semibold text-emerald-700">Civic Work (1)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
              <span className="font-semibold text-indigo-700">Ward Office Center</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Spatial Incidents Strip (Eliminates Blank Space and Enables 1-Click Pan & Inspect) */}
      <div className="pt-3 mt-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-slate-700 text-[11px] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Active Geo-Tagged Ward Incidents (Click to Inspect Pin):
          </span>
          <span className="text-[10px] text-slate-400 font-semibold">
            {markerInstancesRef.current.length} Live Spatial Points
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {markerInstancesRef.current.map((pt) => {
            const isCenter = pt.id === "ward-center";
            const isCritical = pt.priority === "CRITICAL";
            const isHigh = pt.priority === "HIGH";
            const isSelected = activeMarkerId === pt.id;

            return (
              <div
                key={pt.id}
                onClick={() => handleFocusIncident(pt)}
                className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                  isSelected
                    ? "bg-blue-50 border-blue-400 shadow-xs"
                    : isCritical
                    ? "bg-rose-50/60 border-rose-200/80 hover:border-rose-300 hover:bg-rose-100/70"
                    : isHigh
                    ? "bg-amber-50/60 border-amber-200/80 hover:border-amber-300 hover:bg-amber-100/70"
                    : "bg-slate-50/80 border-slate-200/70 hover:border-slate-300 hover:bg-slate-100/80"
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded ${
                      isCenter
                        ? "bg-indigo-100 text-indigo-800"
                        : isCritical
                        ? "bg-rose-100 text-rose-800 font-black"
                        : isHigh
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {isCenter ? "Ward Office" : isCritical ? "Critical" : isHigh ? "High SLA" : "Civil Work"}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {pt.lat.toFixed(3)}°, {pt.lng.toFixed(3)}°
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 line-clamp-1">
                  {pt.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
