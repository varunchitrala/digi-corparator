import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { LoadingState } from '../../components/LoadingState';
import { Home, Droplet, DollarSign, CheckCircle2, AlertTriangle, ShieldCheck, FileCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const CorpRevenueDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/revenue/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch revenue telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Municipal Revenue & Tax Telemetry..." />;

  const r = data || {};

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
          MUNICIPAL REVENUE TELEMETRY
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Revenue, Property Tax & Water Billing Dashboard</h2>
        <p className="text-xs text-slate-500">Monitor property tax demands, water bill collections, collection efficiency, arrears, and tax clearance certificates.</p>
      </div>

      {/* 12 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Municipal Demand" value={formatCurrency(r.total_demand)} color="blue" icon={DollarSign} />
        <StatCard title="Total Tax Collected" value={formatCurrency(r.total_collected)} color="emerald" icon={CheckCircle2} />
        <StatCard title="Outstanding Tax Dues" value={formatCurrency(r.total_outstanding)} color="rose" icon={AlertTriangle} />
        <StatCard title="Collection Efficiency" value={`${r.collection_efficiency}%`} color="indigo" icon={ShieldCheck} />
        <StatCard title="Registered Properties" value={r.total_properties} color="slate" icon={Home} />
        <StatCard title="Water Connections" value={r.water_connections} color="cyan" icon={Droplet} />
        <StatCard title="Pending Assessments" value={r.pending_assessments} color="amber" icon={FileCheck} />
        <StatCard title="Active Objections" value={r.active_objections} color="purple" icon={AlertTriangle} />
      </div>
    </div>
  );
};
