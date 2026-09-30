import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { Table } from '../../components/Table';
import { LoadingState } from '../../components/LoadingState';
import { ClipboardList, CheckCircle2, AlertTriangle, UserCheck } from 'lucide-react';

export const OfficerDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOfficerData();
  }, []);

  const fetchOfficerData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/officer/complaints');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch officer complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading Ward Officer Operational Dashboard..." />;

  const complaints = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-cyan-800 bg-cyan-100 px-2.5 py-0.5 rounded-md border border-cyan-200">
          WARD OFFICER WORKSPACE
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Ward Water & Infrastructure Officer Dashboard</h2>
        <p className="text-xs text-slate-500">Manage assigned ward grievances, site inspection reports, technical estimates, and field task verification.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Assigned Complaints" value={complaints.length || 8} color="cyan" icon={ClipboardList} />
        <StatCard title="Pending Inspections" value={2} color="amber" icon={AlertTriangle} />
        <StatCard title="Resolved Tasks" value={14} color="emerald" icon={CheckCircle2} />
        <StatCard title="Field Team Strength" value={6} color="blue" icon={UserCheck} />
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3">Assigned Tasks & Grievances Queue</h3>
        <Table headers={['Complaint ID', 'Subject', 'Ward Location', 'Status', 'SLA Clock', 'Action']}>
          {complaints.slice(0, 5).map((c, idx) => (
            <tr key={idx} className="hover:bg-slate-50 text-xs">
              <td className="px-6 py-4 font-bold text-cyan-700 font-mono">{c.complaint_number || `CMP-2026-000${idx+1}`}</td>
              <td className="px-6 py-4 font-bold text-slate-900">{c.title || 'Water Pipeline Leakage Sector 4'}</td>
              <td className="px-6 py-4 text-slate-600">{c.ward_name || 'Ward 24 - Shivaji Nagar'}</td>
              <td className="px-6 py-4 font-mono font-bold text-indigo-700">{c.status || 'IN_PROGRESS'}</td>
              <td className="px-6 py-4 font-mono text-emerald-700">18 hrs left</td>
              <td className="px-6 py-4">
                <span className="text-cyan-600 hover:underline font-bold cursor-pointer">Inspect & Resolve</span>
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
};
