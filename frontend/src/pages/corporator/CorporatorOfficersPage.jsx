import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { LoadingState } from '../../components/LoadingState';
import { UserCheck, CheckCircle } from 'lucide-react';

export const CorporatorOfficersPage = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporator/officers');
      setOfficers(res.data);
    } catch (err) {
      console.error('Failed to fetch officers:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Ward field officers performance..." />;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200">
          FIELD OFFICERS MONITORING
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Ward 24 Officers Directory & SLA Telemetry</h2>
        <p className="text-xs text-slate-500">Monitor resolution efficiency and assigned complaint resolution status.</p>
      </div>

      <Table headers={['Officer Name', 'Designation', 'Department', 'Phone', 'Assigned Complaints', 'Resolved Complaints']}>
        {officers.map((off) => (
          <tr key={off.user_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-slate-900">{off.first_name} {off.last_name}</td>
            <td className="px-6 py-4 text-blue-600 font-semibold">{off.designation}</td>
            <td className="px-6 py-4 text-slate-600">{off.department_name || 'Engineering'}</td>
            <td className="px-6 py-4 font-mono text-slate-600">{off.phone}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{off.total_assigned || 1}</td>
            <td className="px-6 py-4 font-bold text-emerald-600">{off.total_resolved || 1}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
};
