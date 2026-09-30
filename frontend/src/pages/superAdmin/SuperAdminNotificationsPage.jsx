import React from 'react';
import { StatCard } from '../../components/StatCard';
import { Table } from '../../components/Table';
import { Bell, MessageSquare, Mail, Smartphone } from 'lucide-react';

export const SuperAdminNotificationsPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-md border border-rose-200">
          NOTIFICATION GATEWAY
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">SMS, Email & WhatsApp Notification Engine</h2>
        <p className="text-xs text-slate-500">Configure CDAC MSdg SMS Gateway, WhatsApp Business API, and automated citizen alerts.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="SMS Sent Today" value="4,850" color="rose" icon={MessageSquare} />
        <StatCard title="Email Dispatch" value="1,240" color="blue" icon={Mail} />
        <StatCard title="WhatsApp Alerts" value="890" color="emerald" icon={Smartphone} />
        <StatCard title="Push Notifications" value="6,400" color="purple" icon={Bell} />
      </div>

      <Table headers={['Template Name', 'Channel', 'Trigger Event', 'Gateway Provider', 'Status']}>
        <tr className="hover:bg-slate-50 text-xs">
          <td className="px-6 py-4 font-bold text-slate-900">Grievance Ticket Confirmation</td>
          <td className="px-6 py-4 font-mono font-bold text-rose-700">SMS + WhatsApp</td>
          <td className="px-6 py-4 text-slate-600">COMPLAINT_CREATED</td>
          <td className="px-6 py-4 font-mono text-indigo-700">CDAC MSdg Gateway</td>
          <td className="px-6 py-4">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              ACTIVE
            </span>
          </td>
        </tr>
        <tr className="hover:bg-slate-50 text-xs">
          <td className="px-6 py-4 font-bold text-slate-900">Property Tax Bill Demand Notice</td>
          <td className="px-6 py-4 font-mono font-bold text-blue-700">Email + SMS</td>
          <td className="px-6 py-4 text-slate-600">TAX_DEMAND_GENERATED</td>
          <td className="px-6 py-4 font-mono text-indigo-700">NagarSevak SMTP</td>
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
