import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { LoadingState } from '../../components/LoadingState';
import { DollarSign, CheckCircle2, Clock, Layers, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const CorpFinanceDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancials();
  }, []);

  const fetchFinancials = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/finance/budgets');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch finance dashboard telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Executive Financial Dashboard Telemetry..." />;

  const t = data?.telemetry || {};

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
          EXECUTIVE FINANCIAL TELEMETRY
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Municipal Finance Dashboard</h2>
        <p className="text-xs text-slate-500">Overview of municipal budget allocation, reservations, commitments, utilization, and payments.</p>
      </div>

      {/* 8 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Annual Municipal Budget" value={`₹${(t.total_budget / 10000000).toFixed(2)} Cr`} color="blue" icon={DollarSign} />
        <StatCard title="Allocated Funds" value={formatCurrency(t.allocated)} color="emerald" icon={Layers} />
        <StatCard title="Reserved Funds" value={formatCurrency(t.reserved)} color="amber" icon={Clock} />
        <StatCard title="Committed Funds" value={formatCurrency(t.committed)} color="indigo" icon={Clock} />
        <StatCard title="Utilized Expenditure" value={formatCurrency(t.utilized)} color="emerald" icon={CheckCircle2} />
        <StatCard title="Available Balance" value={formatCurrency(t.available)} color="amber" icon={DollarSign} />
        <StatCard title="Budget Utilization Rate" value={`${t.utilization_rate}%`} color="indigo" icon={TrendingUp} />
        <StatCard title="Pending Payments" value="₹0.00" color="rose" icon={Clock} />
      </div>
    </div>
  );
};
