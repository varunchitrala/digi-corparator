import React from 'react';
import { StatCard } from '../../components/StatCard';
import { Table } from '../../components/Table';
import { HardHat, CheckSquare, Clock, MapPin } from 'lucide-react';

export const StaffDashboardPage = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
          FIELD STAFF WORKSPACE
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Field Maintenance & Task Portal</h2>
        <p className="text-xs text-slate-500">View daily assigned field maintenance tasks, capture GPS site photos, and submit task progress.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Assigned Tasks" value={5} color="blue" icon={HardHat} />
        <StatCard title="Pending Field Inspections" value={2} color="amber" icon={Clock} />
        <StatCard title="Tasks Completed" value={18} color="emerald" icon={CheckSquare} />
        <StatCard title="Assigned Ward Sector" value="Ward 24 Sector 3" color="indigo" icon={MapPin} />
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3">Daily Field Maintenance Work Orders</h3>
        <Table headers={['Task Code', 'Task Title', 'Location', 'Assigned Officer', 'Priority', 'Status']}>
          <tr className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-slate-900 font-mono">TSK-2026-000101</td>
            <td className="px-6 py-4 font-bold text-slate-900">Valve Maintenance at Civil Lines Reservoir</td>
            <td className="px-6 py-4 text-slate-600">Ward 24 Sector 3</td>
            <td className="px-6 py-4 font-mono font-bold text-indigo-700">Suresh Kulkarni</td>
            <td className="px-6 py-4 font-mono font-bold text-rose-700">HIGH</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                IN_PROGRESS
              </span>
            </td>
          </tr>
          <tr className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-slate-900 font-mono">TSK-2026-000102</td>
            <td className="px-6 py-4 font-bold text-slate-900">Drainage Desilting Inspection Sector 4</td>
            <td className="px-6 py-4 text-slate-600">Ward 24 Sector 4</td>
            <td className="px-6 py-4 font-mono font-bold text-indigo-700">Suresh Kulkarni</td>
            <td className="px-6 py-4 font-mono font-bold text-amber-700">MEDIUM</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                COMPLETED
              </span>
            </td>
          </tr>
        </Table>
      </div>
    </div>
  );
};
