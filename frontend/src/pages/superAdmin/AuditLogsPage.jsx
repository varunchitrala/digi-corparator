import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { LoadingState } from '../../components/LoadingState';
import { FileSpreadsheet, ShieldCheck, Clock } from 'lucide-react';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/super-admin/audit-logs');
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-200">
          IMMUTABLE AUDIT TRAIL
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Super Admin Audit Logs</h2>
        <p className="text-xs text-slate-500">Immutable security event records, platform mutations, and user activities.</p>
      </div>

      {loading ? (
        <LoadingState message="Fetching immutable audit logs from MySQL..." />
      ) : (
        <Table headers={['Log ID', 'Action', 'Module', 'User', 'Details', 'IP Address', 'Timestamp']}>
          {logs.map((log) => (
            <tr key={log.log_id} className="hover:bg-slate-50 text-xs">
              <td className="px-6 py-3.5 font-bold text-blue-600">{log.log_id}</td>
              <td className="px-6 py-3.5 font-bold text-slate-900">{log.action}</td>
              <td className="px-6 py-3.5 font-bold text-amber-700">{log.module}</td>
              <td className="px-6 py-3.5 text-slate-700">{log.first_name ? `${log.first_name} ${log.last_name}` : 'Super Admin'}</td>
              <td className="px-6 py-3.5 text-slate-600 max-w-xs truncate">{typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}</td>
              <td className="px-6 py-3.5 font-mono text-slate-500">{log.ip_address || '127.0.0.1'}</td>
              <td className="px-6 py-3.5 text-slate-500 font-medium">{new Date(log.created_at).toLocaleString('en-IN')}</td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
};
