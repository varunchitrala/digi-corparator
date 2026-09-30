import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { ChartCard } from '../../components/ChartCard';
import { LoadingState } from '../../components/LoadingState';
import { formatCurrency } from '../../utils/formatters';
import {
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Clock,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const SuperAdminDashboardPage = () => {
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardTelemetry();
  }, []);

  const fetchDashboardTelemetry = async () => {
    setLoading(true);
    try {
      const res = await api.get('/super-admin/dashboard');
      setTelemetry(res.data);
    } catch (err) {
      console.error('Failed to fetch Super Admin telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading Super Admin SaaS telemetry from MySQL..." />;

  const kpis = telemetry?.kpis || {};
  const growthData = telemetry?.corporationGrowth || [];
  const subData = telemetry?.subscriptionDistribution || [];
  const revenueData = telemetry?.revenueOverview || [];
  const activities = telemetry?.recentActivities || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-200">
            SUPER ADMIN SAAS PANEL
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">SaaS Platform Command Center</h2>
          <p className="text-xs text-slate-500">Global multi-tenant municipal telemetry, corporation subscriptions, and platform revenue.</p>
        </div>

        <button
          onClick={fetchDashboardTelemetry}
          className="inline-flex items-center px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh Telemetry
        </button>
      </div>

      {/* 8 Responsive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Corporations" value={kpis.total_corporations} color="blue" icon={Building2} />
        <StatCard title="Active Corporations" value={kpis.active_corporations} color="emerald" icon={CheckCircle2} />
        <StatCard title="Inactive Corporations" value={kpis.inactive_corporations} color="amber" icon={AlertTriangle} />
        <StatCard title="Total Users" value={kpis.total_users} color="indigo" icon={Users} />

        <StatCard title="Active Subscriptions" value={kpis.active_subscriptions} color="emerald" icon={CreditCard} />
        <StatCard title="Trial Corporations" value={kpis.trial_corporations} color="blue" icon={Clock} />
        <StatCard title="Expired Subscriptions" value={kpis.expired_subscriptions} color="rose" icon={AlertTriangle} />
        <StatCard title="Monthly Revenue" value={formatCurrency(kpis.monthly_revenue)} color="emerald" icon={TrendingUp} />
      </div>

      {/* Telemetry Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Corporation Growth Line Chart */}
        <div className="lg:col-span-2">
          <ChartCard title="Corporation Growth Trend" subtitle="New & Active Municipal Corporations onboarded per month">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={growthData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="activeCorps" name="Active Corps" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="newCorps" name="New Onboarded" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Subscription Donut Chart */}
        <ChartCard title="Subscription Distribution" subtitle="Active Plans Breakdown">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={subData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="count">
                {subData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Revenue Chart & Recent Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Monthly Recurring Revenue (MRR)" subtitle="Revenue trajectory across municipal subscriptions">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip formatter={(val) => [`₹${val}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Recent Activity Log */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center">
              <Clock className="w-4 h-4 text-blue-600 mr-2" /> Recent Audit Activity Log
            </h4>
            <div className="space-y-3 pt-3">
              {activities.slice(0, 5).map((act, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg text-xs border border-slate-100">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{act.action}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{act.first_name ? `${act.first_name} ${act.last_name}` : 'Super Admin'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
