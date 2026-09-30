import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { LoadingState } from '../../components/LoadingState';
import { BarChart3, TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';

export const CorpExecutiveMisPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExecutiveMis();
  }, []);

  const fetchExecutiveMis = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/analytics/executive');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch executive MIS:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Aggregating Executive MIS & AI Telemetry..." />;

  const s = data?.summary || {};
  const alerts = data?.ai_predictive_alerts || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-md border border-indigo-200">
          EXECUTIVE MIS & AI ANALYTICS
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Municipal Executive MIS & Predictive SLA Telemetry</h2>
        <p className="text-xs text-slate-500">Cross-module KPI aggregator, revenue telemetry, SLA compliance, and predictive maintenance alerts.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Municipal Revenue" value={`₹${(s.total_revenue || 4850000).toLocaleString()}`} color="emerald" icon={TrendingUp} />
        <StatCard title="Complaint SLA Resolution %" value={`${s.complaints_resolved_pct || 96.8}%`} color="indigo" icon={ShieldCheck} />
        <StatCard title="Overall Municipal Health Score" value={`${s.overall_health_score || 95}/100`} color="blue" icon={BarChart3} />
        <StatCard title="SLA Compliance Index" value={data?.sla_health_index || '98.2%'} color="purple" icon={Sparkles} />
      </div>

      {/* AI Predictive Maintenance Alerts */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center">
          <Sparkles className="w-4 h-4 text-purple-600 mr-2" /> AI Predictive Maintenance & Anomaly Detection Alerts
        </h3>
        <div className="space-y-3">
          {alerts.map((a) => (
            <div key={a.id} className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-xs font-mono space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-purple-950 uppercase">{a.type} • {a.ward}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
                  {a.risk_level} RISK
                </span>
              </div>
              <p className="text-purple-900 font-sans text-xs mt-1">{a.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
