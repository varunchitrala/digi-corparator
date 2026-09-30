import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { LoadingState } from '../../components/LoadingState';
import { CreditCard, CheckCircle, RefreshCw } from 'lucide-react';

export const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/super-admin/subscriptions');
      setSubscriptions(res.data || []);
    } catch (err) {
      console.error('Failed to fetch subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading Municipal Subscriptions Telemetry..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200">
            SAAS SUBSCRIPTION MANAGEMENT
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Municipal SaaS Subscriptions & License Tracking</h2>
          <p className="text-xs text-slate-500">Live subscription status, annual billing cycles, and SaaS plan tier allocations.</p>
        </div>
        <button onClick={fetchSubscriptions} className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh List</span>
        </button>
      </div>

      <Table headers={['Subscription ID', 'Corporation', 'Plan Tier', 'Billing Cycle', 'Amount', 'Status', 'Renewal Date']}>
        {subscriptions.map((s) => (
          <tr key={s.subscription_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-emerald-700 font-mono">{s.subscription_id}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{s.corporation_name || 'Municipal Corp'}</td>
            <td className="px-6 py-4 font-bold text-purple-700 font-mono">{s.plan_name || 'Professional'}</td>
            <td className="px-6 py-4 text-slate-600">{s.billing_cycle || 'YEARLY'}</td>
            <td className="px-6 py-4 font-mono font-bold text-emerald-800">₹{(s.amount || 149999).toLocaleString()}</td>
            <td className="px-6 py-4">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {s.status || 'ACTIVE'}
              </span>
            </td>
            <td className="px-6 py-4 font-mono text-slate-500">{s.end_date ? new Date(s.end_date).toLocaleDateString() : '31/12/2026'}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
};
