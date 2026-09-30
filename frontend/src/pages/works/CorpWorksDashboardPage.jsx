import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { LoadingState } from '../../components/LoadingState';
import { HardHat, CheckCircle2, Clock, AlertTriangle, DollarSign, Layers, TrendingUp, ShieldCheck } from 'lucide-react';

export const CorpWorksDashboardPage = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/works');
      setWorks(res.data);
    } catch (err) {
      console.error('Failed to fetch works dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Executive Development Works Dashboard..." />;

  const totalWorks = works.length;
  const ongoing = works.filter((w) => w.status === 'ONGOING' || w.status === 'WORK_ORDER_ISSUED').length;
  const completed = works.filter((w) => w.status === 'COMPLETED' || w.status === 'CLOSED').length;
  const delayed = works.filter((w) => w.status === 'DELAYED' || w.isDelayed).length;

  const totalEstCost = works.reduce((sum, w) => sum + parseFloat(w.estimated_cost || 0), 0);
  const totalAppCost = works.reduce((sum, w) => sum + parseFloat(w.approved_cost || 0), 0);
  const totalContractCost = works.reduce((sum, w) => sum + parseFloat(w.contract_cost || 0), 0);
  const avgProgress = totalWorks > 0 ? Math.round(works.reduce((sum, w) => sum + parseInt(w.physical_progress || 0, 10), 0) / totalWorks) : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
          EXECUTIVE WORKS TELEMETRY
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Municipal Development Works Dashboard</h2>
        <p className="text-xs text-slate-500">Track project execution status, physical vs financial progress, and contractor performance.</p>
      </div>

      {/* 8 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Works" value={totalWorks} color="blue" icon={HardHat} />
        <StatCard title="Ongoing Works" value={ongoing} color="emerald" icon={Layers} />
        <StatCard title="Completed Works" value={completed} color="indigo" icon={CheckCircle2} />
        <StatCard title="Delayed Works" value={delayed} color="rose" icon={AlertTriangle} />
        <StatCard title="Total Estimated Budget" value={`₹${(totalEstCost / 100000).toFixed(2)} Lakh`} color="blue" icon={DollarSign} />
        <StatCard title="Total Approved Sanction" value={`₹${(totalAppCost / 100000).toFixed(2)} Lakh`} color="amber" icon={DollarSign} />
        <StatCard title="Total Contract Value" value={`₹${(totalContractCost / 100000).toFixed(2)} Lakh`} color="emerald" icon={DollarSign} />
        <StatCard title="Avg Physical Progress" value={`${avgProgress}%`} color="indigo" icon={TrendingUp} />
      </div>
    </div>
  );
};
