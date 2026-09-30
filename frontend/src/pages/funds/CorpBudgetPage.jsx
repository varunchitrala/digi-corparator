import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { StatCard } from '../../components/StatCard';
import { LoadingState } from '../../components/LoadingState';
import { DollarSign, Layers, CheckCircle2, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const CorpBudgetPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/finance/budgets');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Municipal Budget Telemetry..." />;

  const t = data?.telemetry || {};
  const heads = data?.budget_heads || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
          ANNUAL MUNICIPAL BUDGET 2026-27
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Corporation Budget & Budget Heads</h2>
        <p className="text-xs text-slate-500">Monitor annual budget allocation, commitments, utilization, and available funds.</p>
      </div>

      {/* KPI Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Municipal Budget" value={`₹${(t.total_budget / 10000000).toFixed(2)} Cr`} color="blue" icon={DollarSign} />
        <StatCard title="Allocated Funds" value={formatCurrency(t.allocated)} color="emerald" icon={Layers} />
        <StatCard title="Committed Funds" value={formatCurrency(t.committed)} color="indigo" icon={Clock} />
        <StatCard title="Available Balance" value={formatCurrency(t.available)} color="amber" icon={CheckCircle2} />
      </div>

      {/* Budget Heads Table */}
      <Table headers={['Code', 'Budget Head Name', 'Category', 'Allocated', 'Committed', 'Utilized', 'Status']}>
        {heads.map((h) => (
          <tr key={h.budget_head_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-blue-600">{h.budget_head_code}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{h.budget_head_name}</td>
            <td className="px-6 py-4 text-slate-600">{h.category}</td>
            <td className="px-6 py-4 font-mono font-bold text-slate-900">{formatCurrency(h.total_allocated)}</td>
            <td className="px-6 py-4 font-mono text-indigo-600">{formatCurrency(h.total_committed)}</td>
            <td className="px-6 py-4 font-mono text-emerald-700">{formatCurrency(h.total_utilized)}</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {h.status}
              </span>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};
