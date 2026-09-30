import React from 'react';
import { MapCard } from '../components/MapCard';

export const GisPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
          GEOGRAPHIC INFORMATION SYSTEM (GIS)
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Ward 24 Spatial Telemetry</h2>
        <p className="text-xs text-slate-500">Interactive OpenStreetMap layer with complaint markers and civil works locations.</p>
      </div>

      <MapCard
        title="Ward 24 Interactive GIS Boundary"
        latitude={19.8762}
        longitude={75.3433}
        zoom={14}
        height="560px"
        markers={[
          { lat: 19.8762, lng: 75.3433, title: 'CMP-1024: Streetlight Defect', description: 'Priority: HIGH' },
          { lat: 19.8780, lng: 75.3412, title: 'CMP-1025: Water Leakage', description: 'Priority: CRITICAL' },
          { lat: 19.8745, lng: 75.3489, title: 'CMP-1026: Garbage Dump Overflow', description: 'Status: RESOLVED' },
          { lat: 19.8770, lng: 75.3440, title: 'W-101: Internal Lane Concreting', description: 'Physical Progress: 65%' },
          { lat: 19.8790, lng: 75.3460, title: 'W-102: Smart LED Streetlights', description: 'Status: DELAYED' },
          { lat: 19.8730, lng: 75.3490, title: 'W-103: Shivaji Park Beautification', description: 'Status: COMPLETED' }
        ]}
      />
    </div>
  );
};
