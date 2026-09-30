import React from 'react';
import { StatCard } from '../../components/StatCard';
import { Table } from '../../components/Table';
import { BarChart3, Download, TrendingUp, ShieldCheck } from 'lucide-react';

export const SuperAdminReportsPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200">
          GLOBAL SAAS REPORTS
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Platform Analytics & Executive Reports</h2>
        <p className="text-xs text-slate-500">Cross-corporation MIS reports, SLA compliance summaries, and revenue growth telemetry.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Platform SLA Index" value="97.4%" color="emerald" icon={ShieldCheck} />
        <StatCard title="Total Municipal Revenue" value="₹1.50 L" color="blue" icon={TrendingUp} />
        <StatCard title="Monthly Reports Generated" value="48" color="purple" icon={BarChart3} />
        <StatCard title="Data Exports" value="120 Downloads" color="indigo" icon={Download} />
      </div>

      <Table headers={['Report Name', 'Frequency', 'Format', 'Last Generated', 'Action']}>
        <tr className="hover:bg-slate-50 text-xs">
          <td className="px-6 py-4 font-bold text-slate-900">Platform Cross-Corporation SLA Report</td>
          <td className="px-6 py-4 text-slate-600">Monthly</td>
          <td className="px-6 py-4 font-mono font-bold text-indigo-700">PDF / XLSX</td>
          <td className="px-6 py-4 font-mono text-slate-500">28/08/2026</td>
          <td className="px-6 py-4">
            <span className="text-emerald-700 hover:underline font-bold cursor-pointer flex items-center space-x-1">
              <Download className="w-3.5 h-3.5 mr-1" /> Download
            </span>
          </td>
        </tr>
      </Table>
    </div>
  );
};
