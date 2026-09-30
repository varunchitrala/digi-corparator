import React from 'react';
import { StatCard } from '../../components/StatCard';
import { Table } from '../../components/Table';
import { ShieldAlert, Lock, Eye, Key } from 'lucide-react';

export const SuperAdminSecurityPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-md border border-rose-200">
          PLATFORM SECURITY CONTROL
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">SaaS Security, IP Whitelist & Threat Detection</h2>
        <p className="text-xs text-slate-500">Monitor failed login attempts, JWT token revocations, IP access control lists, and security audits.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Security Health Score" value="99/100" color="emerald" icon={Lock} />
        <StatCard title="Failed Login Attempts" value="0 Suspicious" color="rose" icon={ShieldAlert} />
        <StatCard title="Active User Sessions" value="9 Sessions" color="blue" icon={Eye} />
        <StatCard title="2FA Protection" value="ENABLED" color="purple" icon={Key} />
      </div>

      <Table headers={['Security Event', 'IP Address', 'User Account', 'Location', 'Status']}>
        <tr className="hover:bg-slate-50 text-xs">
          <td className="px-6 py-4 font-bold text-slate-900">Super Admin JWT Session Created</td>
          <td className="px-6 py-4 font-mono font-bold text-slate-700">127.0.0.1 (Localhost)</td>
          <td className="px-6 py-4 text-slate-600">superadmin@nagarsevak.gov.in</td>
          <td className="px-6 py-4 text-slate-600">Chhatrapati Sambhajinagar</td>
          <td className="px-6 py-4">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              AUTHORIZED
            </span>
          </td>
        </tr>
      </Table>
    </div>
  );
};
