import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigation, AlertTriangle, ShieldCheck } from 'lucide-react';

export const PublicRoadMapPage = () => {
  const [data, setData] = useState({ active_roads: [], active_closures: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicMap();
  }, []);

  const fetchPublicMap = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/public/roads/map');
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to fetch public road map data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-3xl w-full p-6 rounded-2xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-1 border-b border-slate-100 pb-4">
          <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-full mb-2">
            <Navigation className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Public Road Map & Traffic Diversions</h2>
          <p className="text-xs text-slate-500">Real-Time Municipal Road Status, Active Road Closures & Utility Diversions</p>
        </div>

        {loading && <div className="text-center text-xs text-slate-500 py-6">Loading public road map data...</div>}

        {!loading && (
          <div className="space-y-6">
            {/* Active Roads */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mr-2" /> Municipal Roads Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.active_roads.map((r, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono space-y-1">
                    <div className="font-bold text-slate-900">{r.road_name}</div>
                    <div className="text-slate-500">{r.ward_name || 'Ward 24'} • {r.road_type}</div>
                    <div className="flex justify-between pt-1">
                      <span className="text-emerald-700 font-extrabold">{r.condition}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">{r.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Road Closures / Diversions */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 text-amber-600 mr-2" /> Active Road Closures & Diversions
              </h3>
              <div className="space-y-3">
                {data.active_closures.map((c, idx) => (
                  <div key={idx} className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs font-mono space-y-1">
                    <div className="font-bold text-amber-950">{c.road_name} ({c.agency})</div>
                    <div className="text-amber-800">{c.purpose}</div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-amber-900 text-[11px]">Permit No: {c.application_number}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">{c.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
