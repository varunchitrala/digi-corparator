import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { Table } from '../../components/Table';
import { LoadingState } from '../../components/LoadingState';
import { Briefcase, FileCheck, IndianRupee, Clock } from 'lucide-react';

export const ContractorDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContractorData();
  }, []);

  const fetchContractorData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/vendor/roads/works');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch contractor works:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading Municipal Contractor Portal..." />;

  const works = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-200">
          APPROVED MUNICIPAL CONTRACTOR PORTAL
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">L&T Municipal Infrastructure Portal</h2>
        <p className="text-xs text-slate-500">Manage assigned development works, work orders, milestone completion billing, and quality inspection reports.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Assigned Development Works" value={works.length || 3} color="amber" icon={Briefcase} />
        <StatCard title="Active Work Orders" value={2} color="blue" icon={FileCheck} />
        <StatCard title="Total Work Contract Value" value="₹45,00,000" color="emerald" icon={IndianRupee} />
        <StatCard title="Milestone Pending Approval" value={1} color="purple" icon={Clock} />
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3">Assigned Work Contracts & Work Orders</h3>
        <Table headers={['Work Order Code', 'Project Name', 'Ward', 'Contract Value', 'Progress %', 'Status']}>
          {works.slice(0, 5).map((w, idx) => (
            <tr key={idx} className="hover:bg-slate-50 text-xs">
              <td className="px-6 py-4 font-bold text-amber-700 font-mono">{w.work_order_number || `WRK-2026-000${idx+1}`}</td>
              <td className="px-6 py-4 font-bold text-slate-900">{w.work_name || 'Ward 24 Asphalt Road Resurfacing'}</td>
              <td className="px-6 py-4 text-slate-600">{w.ward_name || 'Ward 24'}</td>
              <td className="px-6 py-4 font-mono font-bold text-emerald-700">₹{w.estimated_cost || '25,00,000'}</td>
              <td className="px-6 py-4 font-mono font-bold text-indigo-700">{w.progress_pct || 65}%</td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {w.status || 'IN_PROGRESS'}
                </span>
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
};
