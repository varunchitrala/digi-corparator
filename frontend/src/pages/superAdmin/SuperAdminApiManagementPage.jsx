import React from 'react';
import { StatCard } from '../../components/StatCard';
import { Table } from '../../components/Table';
import { Key, ShieldAlert, Cpu, Network } from 'lucide-react';

export const SuperAdminApiManagementPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-cyan-800 bg-cyan-100 px-2.5 py-0.5 rounded-md border border-cyan-200">
          API GATEWAY MANAGEMENT
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">SaaS Open API Gateway & Partner Integrations</h2>
        <p className="text-xs text-slate-500">Manage third-party API keys, webhook subscribers, rate limits, and OAuth 2.0 endpoints.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active API Keys" value="12 Keys" color="cyan" icon={Key} />
        <StatCard title="Daily API Requests" value="1.2M Calls" color="blue" icon={Network} />
        <StatCard title="Average Latency" value="42ms" color="emerald" icon={Cpu} />
        <StatCard title="Blocked Unauthorized Requests" value="18" color="rose" icon={ShieldAlert} />
      </div>

      <Table headers={['Key Name', 'Client App', 'Rate Limit', 'Allowed Scope', 'Status']}>
        <tr className="hover:bg-slate-50 text-xs">
          <td className="px-6 py-4 font-bold text-cyan-700 font-mono">key_live_maha_gis_2026</td>
          <td className="px-6 py-4 font-bold text-slate-900">Maharashtra GIS Portal</td>
          <td className="px-6 py-4 font-mono text-slate-600">10,000 req / hr</td>
          <td className="px-6 py-4 font-mono text-purple-700">READ_ONLY_GIS</td>
          <td className="px-6 py-4">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              ACTIVE
            </span>
          </td>
        </tr>
      </Table>
    </div>
  );
};
