import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { LoadingState } from '../../components/LoadingState';
import { Users, UserCheck, Clock, Calendar, AlertTriangle, ShieldCheck, Award } from 'lucide-react';

export const CorpHrmsDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHrDashboard();
  }, []);

  const fetchHrDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/hrms/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch HR dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Municipal HRMS Telemetry..." />;

  const t = data || {};

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
          MUNICIPAL HUMAN RESOURCE TELEMETRY
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">HRMS Executive Dashboard</h2>
        <p className="text-xs text-slate-500">Monitor employee headcount, daily attendance, active leaves, postings, and exit clearances.</p>
      </div>

      {/* 10 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Staff Headcount" value={t.total_employees} color="blue" icon={Users} />
        <StatCard title="Active Employees" value={t.active_employees} color="emerald" icon={UserCheck} />
        <StatCard title="Present Today" value={t.present_today} color="indigo" icon={CheckCircleIcon} />
        <StatCard title="On Leave Today" value={t.on_leave_today} color="amber" icon={Calendar} />
        <StatCard title="Probation Staff" value={t.probation_employees} color="purple" icon={Clock} />
        <StatCard title="Retired Staff" value={t.retired_employees} color="slate" icon={Award} />
        <StatCard title="Pending Transfers" value={t.pending_transfers} color="blue" icon={Clock} />
        <StatCard title="Pending Exit Clearances" value={t.pending_exits} color="rose" icon={AlertTriangle} />
      </div>
    </div>
  );
};

const CheckCircleIcon = (props) => <ShieldCheck {...props} />;
