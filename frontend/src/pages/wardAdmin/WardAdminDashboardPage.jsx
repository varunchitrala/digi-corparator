import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { Table } from '../../components/Table';
import { LoadingState } from '../../components/LoadingState';
import { ShieldCheck, MapPin, AlertCircle, Wrench, Building } from 'lucide-react';

export const WardAdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWardAdminData();
  }, []);

  const fetchWardAdminData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporator/ward');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch ward admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading Ward Administrator Dashboard..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-md border border-indigo-200">
          WARD ADMINISTRATOR WORKSPACE
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Ward 24 Administrative Executive Dashboard</h2>
        <p className="text-xs text-slate-500">Supervise municipal ward operations, asset maintenance, field inspections, and ward officer task assignments.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Ward Administrative Office" value="Ward 24" color="indigo" icon={Building} />
        <StatCard title="Ward Municipal Assets" value={42} color="emerald" icon={ShieldCheck} />
        <StatCard title="Active Ward Complaints" value={14} color="rose" icon={AlertCircle} />
        <StatCard title="Ongoing Ward Maintenance Works" value={6} color="amber" icon={Wrench} />
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3">Ward Administrative Operations & Infrastructure Overview</h3>
        <Table headers={['Operational Sector', 'Assigned Officer', 'Asset Inventory', 'Active Issues', 'Status']}>
          <tr className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-slate-900">Ward 24 Water Supply & Pipelines</td>
            <td className="px-6 py-4 font-mono font-bold text-indigo-700">Suresh Kulkarni</td>
            <td className="px-6 py-4 font-mono">14 Assets</td>
            <td className="px-6 py-4 font-mono font-bold text-rose-700">2 Active Leakages</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                OPERATIONAL
              </span>
            </td>
          </tr>
          <tr className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-slate-900">Ward 24 Waste Collection Routes</td>
            <td className="px-6 py-4 font-mono font-bold text-indigo-700">Sanitation Inspector</td>
            <td className="px-6 py-4 font-mono">8 Bins / Vehicles</td>
            <td className="px-6 py-4 font-mono font-bold text-emerald-700">0 Alerts</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                OPERATIONAL
              </span>
            </td>
          </tr>
        </Table>
      </div>
    </div>
  );
};
