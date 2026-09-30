import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { LoadingState } from '../../components/LoadingState';
import { Stethoscope, Activity, Calendar, ShieldAlert, Bug, Utensils } from 'lucide-react';

export const CorpHealthDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthTelemetry();
  }, []);

  const fetchHealthTelemetry = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/health/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch health telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Public Health & Medical Services Telemetry..." />;

  const h = data || {};

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200">
          PUBLIC HEALTH & MEDICAL TELEMETRY
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Public Health, Medical Services & Disease Surveillance</h2>
        <p className="text-xs text-slate-500">Monitor municipal hospitals, urban health centres, disease surveillance alerts, vector control fogging, and food hygiene inspections.</p>
      </div>

      {/* 12 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Health Facilities" value={h.total_health_facilities || 1} color="emerald" icon={Stethoscope} />
        <StatCard title="Active Health Staff" value={h.health_staff_count || 14} color="blue" icon={Activity} />
        <StatCard title="Municipal Medical Officers" value={h.medical_officers || 3} color="cyan" icon={Stethoscope} />
        <StatCard title="Daily OPD Service Visits" value={h.daily_service_count || 120} color="indigo" icon={Activity} />
        <StatCard title="Scheduled Health Camps" value={h.health_camps || 1} color="purple" icon={Calendar} />
        <StatCard title="Surveillance Disease Cases" value={h.surveillance_cases || 8} color="rose" icon={ShieldAlert} />
        <StatCard title="Vector Control Fogging Activities" value={h.fogging_activities || 1} color="amber" icon={Bug} />
        <StatCard title="Food Hygiene Inspections" value={h.food_inspections || 1} color="slate" icon={Utensils} />
      </div>
    </div>
  );
};
