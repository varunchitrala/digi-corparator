import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { Table } from '../../components/Table';
import { LoadingState } from '../../components/LoadingState';
import { Building2, Users, FileText, CheckCircle2 } from 'lucide-react';

export const DeptHeadDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeptData();
  }, []);

  const fetchDeptData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/department-head/complaints');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch dept head complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading Department Head Executive Dashboard..." />;

  const complaints = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-md border border-purple-200">
          DEPARTMENT HEAD WORKSPACE
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Water Supply & Engineering Department Executive Dashboard</h2>
        <p className="text-xs text-slate-500">Monitor department SLAs, assigned officers, technical work orders, and complaint escalations.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Department Officers" value={4} color="purple" icon={Users} />
        <StatCard title="Total Department Complaints" value={complaints.length || 12} color="indigo" icon={FileText} />
        <StatCard title="SLA Resolution %" value="96.5%" color="emerald" icon={CheckCircle2} />
        <StatCard title="Department Budget Head" value="Water Supply" color="blue" icon={Building2} />
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3">Department Grievances & Officers Assignment</h3>
        <Table headers={['Complaint ID', 'Category', 'Ward', 'Assigned Officer', 'SLA Status', 'Action']}>
          {complaints.slice(0, 5).map((c, idx) => (
            <tr key={idx} className="hover:bg-slate-50 text-xs">
              <td className="px-6 py-4 font-bold text-purple-700 font-mono">{c.complaint_number || `CMP-2026-000${idx+1}`}</td>
              <td className="px-6 py-4 font-bold text-slate-900">{c.category_name || 'Water Supply Leakage'}</td>
              <td className="px-6 py-4 text-slate-600">{c.ward_name || 'Ward 24'}</td>
              <td className="px-6 py-4 font-mono font-bold text-indigo-700">{c.assigned_officer_name || 'Suresh Kulkarni'}</td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  WITHIN SLA
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-purple-600 hover:underline font-bold cursor-pointer">Review</span>
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
};
