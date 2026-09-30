import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { LoadingState } from '../../components/LoadingState';
import { Database, Clock } from 'lucide-react';

export const SuperAdminMasterDataPage = () => {
  const [slaRules, setSlaRules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlaRules();
  }, []);

  const fetchSlaRules = async () => {
    setLoading(true);
    try {
      const res = await api.get('/super-admin/master-data/sla');
      setSlaRules(res.data || []);
    } catch (err) {
      console.error('Failed to fetch SLA rules:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading Municipal Master Data & SLA Rules..." />;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-200">
          MASTER DATA CONFIGURATION
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Municipal SLA Master Rules & Escalation Thresholds</h2>
        <p className="text-xs text-slate-500">Service Level Agreement clocks, warning triggers, and department escalation levels.</p>
      </div>

      <Table headers={['Rule ID', 'Grievance Category', 'Department', 'Priority', 'SLA Clock (Hrs)', 'Warning (Hrs)', 'Status']}>
        {slaRules.map((s) => (
          <tr key={s.rule_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-amber-700 font-mono">{s.rule_id}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{s.category_name}</td>
            <td className="px-6 py-4 font-mono font-bold text-indigo-700">{s.department_code || 'ENGINEERING'}</td>
            <td className="px-6 py-4 font-mono font-bold text-purple-700">{s.priority}</td>
            <td className="px-6 py-4 font-mono font-bold text-emerald-700">{s.sla_hours} hrs</td>
            <td className="px-6 py-4 font-mono text-amber-700">{s.warning_hours || 4} hrs</td>
            <td className="px-6 py-4">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {s.status || 'ACTIVE'}
              </span>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};
