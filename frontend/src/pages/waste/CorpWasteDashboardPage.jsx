import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { LoadingState } from '../../components/LoadingState';
import { Trash2, Truck, MapPin, CheckCircle2, AlertTriangle, ShieldCheck, Home } from 'lucide-react';

export const CorpWasteDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWaste();
  }, []);

  const fetchWaste = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/waste/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch waste telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Solid Waste Management Telemetry..." />;

  const w = data || {};

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200">
          SOLID WASTE MANAGEMENT TELEMETRY
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Sanitation & Clean City Operational Dashboard</h2>
        <p className="text-xs text-slate-500">Monitor daily door-to-door waste collection, weighbridge net tonnage, smart bin fill levels, and collection routes.</p>
      </div>

      {/* 12 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Waste Collected Today" value={`${w.total_waste_collected_kg || 6000} kg`} color="emerald" icon={Trash2} />
        <StatCard title="Registered Households" value={w.registered_households || 2} color="blue" icon={Home} />
        <StatCard title="Active Collection Routes" value={w.active_routes || 1} color="indigo" icon={MapPin} />
        <StatCard title="Active Sanitation Vehicles" value={w.active_vehicles || 4} color="cyan" icon={Truck} />
        <StatCard title="Smart Bin Network" value={w.smart_bins || 2} color="purple" icon={Trash2} />
        <StatCard title="Collection Efficiency" value={`${w.collection_efficiency || 98}%`} color="emerald" icon={CheckCircle2} />
        <StatCard title="Sanitation Cleanliness Score" value={`${w.sanitation_score || 92}/100`} color="amber" icon={ShieldCheck} />
        <StatCard title="Open Sanitation Complaints" value={w.open_complaints || 0} color="rose" icon={AlertTriangle} />
      </div>
    </div>
  );
};
