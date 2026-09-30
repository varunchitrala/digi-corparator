import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { LoadingState } from '../../components/LoadingState';
import { Layers, MapPin, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const CorpGisDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGis();
  }, []);

  const fetchGis = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/gis/layers');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch GIS layers:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Initializing Municipal Spatial GIS Telemetry..." />;

  const layers = data?.layers || [];
  const markers = data?.markers || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
          SPATIAL TELEMETRY SYSTEM
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Municipal GIS Infrastructure Map</h2>
        <p className="text-xs text-slate-500">Spatial telemetry of municipal ward boundaries, streetlight poles, water pipelines, drains, and public assets.</p>
      </div>

      {/* Layer Sidebar & Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Layer Controls */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 font-mono text-xs">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center">
            <Layers className="w-4 h-4 mr-2 text-blue-600" /> GIS Layer Control
          </h3>
          <div className="space-y-2">
            {layers.map((l) => (
              <label key={l.layer_id} className="flex items-center space-x-2 text-slate-700 cursor-pointer hover:text-slate-900">
                <input type="checkbox" defaultChecked={l.default_visible} className="rounded text-blue-600 focus:ring-blue-500" />
                <span>{l.layer_name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Spatial Map & Markers List */}
        <div className="lg:col-span-3 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-blue-600" /> Spatial Asset Markers ({markers.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {markers.map((m) => (
              <div key={m.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-start">
                  <span className="font-bold font-mono text-blue-600">{m.code}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">{m.condition}</span>
                </div>
                <h4 className="font-bold text-slate-900">{m.name}</h4>
                <p className="text-slate-500">{m.address}</p>
                <div className="font-mono text-slate-600 text-[11px] pt-2 border-t border-slate-200 flex justify-between">
                  <span>GPS: {m.lat}, {m.lng}</span>
                  <span className="font-bold text-blue-700">Health: {m.health_score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
