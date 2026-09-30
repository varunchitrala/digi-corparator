import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { LoadingState } from '../../components/LoadingState';
import { AssetConditionBadge } from '../../components/gis/AssetConditionBadge';
import { MapPin, ShieldCheck, AlertTriangle, Layers } from 'lucide-react';

export const CorporatorSmartWardPage = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWardAssets();
  }, []);

  const fetchWardAssets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporator/assets');
      setAssets(res.data);
    } catch (err) {
      console.error('Failed to fetch corporator ward assets:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Ward 24 Smart Assets & Spatial Telemetry..." />;

  const totalAssets = assets.length;
  const activeAssets = assets.filter((a) => a.status === 'ACTIVE').length;
  const criticalAssets = assets.filter((a) => a.condition === 'CRITICAL' || a.condition === 'POOR').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
          SMART WARD 24 TELEMETRY
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Ward 24 Municipal Assets & GIS Telemetry</h2>
        <p className="text-xs text-slate-500">Real-time status of Ward 24 streetlights, roads, drains, water supply, and public gardens.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Ward Assets" value={totalAssets} color="blue" icon={MapPin} />
        <StatCard title="Active Operational Assets" value={activeAssets} color="emerald" icon={ShieldCheck} />
        <StatCard title="Critical / Maintenance Required" value={criticalAssets} color="rose" icon={AlertTriangle} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assets.map((a) => (
          <div key={a.asset_id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2 text-xs">
            <div className="flex justify-between items-start">
              <span className="font-bold font-mono text-blue-600">{a.asset_code}</span>
              <AssetConditionBadge condition={a.condition} />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">{a.asset_name}</h4>
            <p className="text-slate-500">{a.address}</p>
            <div className="font-mono text-slate-600 text-[11px] pt-2 border-t border-slate-100 flex justify-between">
              <span>Category: {a.category_name}</span>
              <span className="font-bold text-indigo-700">Health: {a.health_score}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
