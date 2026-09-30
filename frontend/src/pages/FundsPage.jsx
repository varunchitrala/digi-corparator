import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { StatCard } from '../components/StatCard';
import { Table } from '../components/Table';
import { LoadingState } from '../components/LoadingState';
import { formatCurrency } from '../utils/formatters';
import { IndianRupee, PieChart, TrendingUp, CheckCircle } from 'lucide-react';

export const FundsPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/funds');
      setBudgets(res.data);
    } catch (err) {
      console.error('Failed to fetch budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
          FUND & BUDGET MANAGEMENT
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Ward Financial Telemetry</h2>
        <p className="text-xs text-slate-500">Financial Year 2026-2027 sanction, utilization, and balance ledger.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Sanctioned" value="₹1.00 Cr" color="blue" icon={IndianRupee} />
        <StatCard title="Sanctioned Amount" value="₹79.50 L" color="indigo" icon={TrendingUp} />
        <StatCard title="Utilized Amount" value="₹57.50 L" color="emerald" icon={CheckCircle} />
        <StatCard title="Balance Available" value="₹20.50 L" color="amber" icon={PieChart} />
      </div>

      {loading ? (
        <LoadingState message="Fetching budget ledgers..." />
      ) : (
        <Table
          headers={['Financial Year', 'Budget Head', 'Total Allocated', 'Utilized Amount', 'Available Balance']}
        >
          {budgets.map((b) => (
            <tr key={b.budget_id} className="hover:bg-slate-50">
              <td className="px-6 py-4 font-bold text-slate-900 text-xs">{b.financial_year}</td>
              <td className="px-6 py-4 font-bold text-blue-600 text-xs">{b.budget_head}</td>
              <td className="px-6 py-4 font-bold text-slate-900 text-xs">{formatCurrency(b.total_allocated)}</td>
              <td className="px-6 py-4 font-bold text-emerald-600 text-xs">{formatCurrency(b.utilized_amount)}</td>
              <td className="px-6 py-4 font-bold text-amber-600 text-xs">{formatCurrency(b.available_amount)}</td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
};
