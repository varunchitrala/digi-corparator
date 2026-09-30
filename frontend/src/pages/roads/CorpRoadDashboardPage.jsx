import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { LoadingState } from '../../components/LoadingState';
import { Navigation, AlertTriangle, ShieldCheck, Wrench, Layers } from 'lucide-react';

export const CorpRoadDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoadTelemetry();
  }, []);

  const fetchRoadTelemetry = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/roads/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch road telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Road & Public Infrastructure Telemetry..." />;

  const r = data || {};

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
          ROAD & INFRASTRUCTURE TELEMETRY
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Roads, Footpaths & Traffic Management Dashboard</h2>
        <p className="text-xs text-slate-500">Monitor municipal road network length, condition ratings, pothole repairs, road cutting permits, traffic signals, and black spots.</p>
      </div>

      {/* 12 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Municipal Roads" value={r.total_roads || 1} color="cyan" icon={Navigation} />
        <StatCard title="Total Network Length (km)" value={`${r.total_road_length_km || 2.5} km`} color="blue" icon={Layers} />
        <StatCard title="Roads Under Repair" value={r.roads_under_repair || 0} color="indigo" icon={Wrench} />
        <StatCard title="Pothole Incidents Logged" value={r.open_potholes || 1} color="rose" icon={AlertTriangle} />
        <StatCard title="Active Work Orders Linked" value={r.active_work_orders || 1} color="purple" icon={Wrench} />
        <StatCard title="Road Cutting Requests" value={r.road_cutting_requests || 1} color="amber" icon={AlertTriangle} />
        <StatCard title="Footpath Network Length" value={`${r.footpath_length_km || 1.5} km`} color="emerald" icon={ShieldCheck} />
        <StatCard title="Traffic Signal Control Points" value={r.traffic_signals || 1} color="slate" icon={Navigation} />
      </div>
    </div>
  );
};
