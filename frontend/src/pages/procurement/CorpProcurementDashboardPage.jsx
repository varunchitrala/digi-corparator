import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { LoadingState } from '../../components/LoadingState';
import { FileText, Award, DollarSign, CheckCircle2, Clock, AlertTriangle, ShieldCheck, Users } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const CorpProcurementDashboardPage = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProcurement();
  }, []);

  const fetchProcurement = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/procurement/tenders');
      setTenders(res.data);
    } catch (err) {
      console.error('Failed to fetch procurement telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Municipal Procurement Telemetry..." />;

  const totalTenders = tenders.length;
  const publishedTenders = tenders.filter((t) => t.status === 'PUBLISHED' || t.status === 'OPEN').length;
  const underEval = tenders.filter((t) => t.status.includes('EVALUATION')).length;
  const awardedTenders = tenders.filter((t) => t.status === 'AWARDED').length;
  const totalValue = tenders.reduce((sum, t) => sum + parseFloat(t.estimated_value || 0), 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
          MUNICIPAL PROCUREMENT TELEMETRY
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Procurement & Tender Executive Dashboard</h2>
        <p className="text-xs text-slate-500">Monitor active tenders, bid evaluations, L1 awards, contracts, vendor ratings, and budget utilization.</p>
      </div>

      {/* 12 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tenders" value={totalTenders} color="blue" icon={FileText} />
        <StatCard title="Active Published Tenders" value={publishedTenders} color="emerald" icon={CheckCircle2} />
        <StatCard title="Under Evaluation" value={underEval} color="amber" icon={Clock} />
        <StatCard title="Awarded Contracts" value={awardedTenders} color="purple" icon={Award} />
        <StatCard title="Total Procurement Value" value={formatCurrency(totalValue)} color="indigo" icon={DollarSign} />
        <StatCard title="Registered Vendors" value="15" color="slate" icon={Users} />
        <StatCard title="Blacklisted Vendors" value="1" color="rose" icon={AlertTriangle} />
        <StatCard title="Active Contracts" value="4" color="emerald" icon={ShieldCheck} />
      </div>
    </div>
  );
};
