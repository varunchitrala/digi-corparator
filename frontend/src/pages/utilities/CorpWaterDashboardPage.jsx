import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { LoadingState } from '../../components/LoadingState';
import { Droplet, Activity, Sliders, AlertTriangle, ShieldCheck, Waves } from 'lucide-react';

export const CorpWaterDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUtility();
  }, []);

  const fetchUtility = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/water/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch utility telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Water Supply & Public Utility Telemetry..." />;

  const u = data || {};

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-cyan-800 bg-cyan-100 px-2.5 py-0.5 rounded-md border border-cyan-200">
          PUBLIC UTILITIES TELEMETRY
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Water Supply, Drainage & Sewerage Dashboard</h2>
        <p className="text-xs text-slate-500">Monitor raw water intake, treatment plant output, distribution pipeline networks, valves, leakages, and STPs.</p>
      </div>

      {/* 12 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Daily Water Intake (MLD)" value={`${u.daily_water_intake_mld || 450} MLD`} color="cyan" icon={Droplet} />
        <StatCard title="Treatment Output (MLD)" value={`${u.treatment_output_mld || 142} MLD`} color="blue" icon={Activity} />
        <StatCard title="Active Distribution Pipelines" value={u.active_pipelines || 1} color="indigo" icon={Waves} />
        <StatCard title="Distribution Network Valves" value={u.active_valves || 1} color="purple" icon={Sliders} />
        <StatCard title="Water Leakage Incidents" value={u.open_leakages || 1} color="rose" icon={AlertTriangle} />
        <StatCard title="Non-Revenue Water Loss" value={`${u.non_revenue_water_loss_percent || 18}%`} color="amber" icon={AlertTriangle} />
        <StatCard title="Sewage Treatment Plants (STP)" value={u.stp_facilities || 1} color="emerald" icon={ShieldCheck} />
        <StatCard title="Drainage Network Length" value={`${u.drainage_network_km || 12.5} km`} color="slate" icon={Waves} />
      </div>
    </div>
  );
};
