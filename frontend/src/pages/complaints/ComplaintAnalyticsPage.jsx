import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { ChartCard } from '../../components/ChartCard';
import { LoadingState } from '../../components/LoadingState';
import { AlertTriangle, CheckCircle, Clock, RotateCcw, Star, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ComplaintAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/complaints/analytics');
      setAnalytics(res.data);
    } catch (err) {
      console.error('Failed to fetch complaint analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Grievance Analytics & SLA Telemetry..." />;

  const a = analytics || {};
  const categoryData = a.category_breakdown || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
          GRIEVANCE ANALYTICS & SLA PERFORMANCE
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">City-Wide Grievance Telemetry</h2>
        <p className="text-xs text-slate-500">SLA compliance rate, citizen satisfaction score, and category distribution.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Complaints" value={a.total_complaints} color="blue" icon={AlertTriangle} />
        <StatCard title="SLA Compliance Rate" value={`${a.sla_compliance_rate}%`} color="emerald" icon={CheckCircle} />
        <StatCard title="SLA Escalated" value={a.escalated_complaints} color="rose" icon={Clock} />
        <StatCard title="Citizen Satisfaction" value={`${a.average_satisfaction_rating} / 5 ⭐`} color="amber" icon={Star} />
      </div>

      {/* Category Distribution Chart */}
      <ChartCard title="Category Grievance Volume" subtitle="Complaint counts grouped by category">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="category_name" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};
