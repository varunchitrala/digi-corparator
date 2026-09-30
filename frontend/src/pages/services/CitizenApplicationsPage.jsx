import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { LoadingState } from '../../components/LoadingState';
import { ApplicationStatusBadge } from '../../components/services/ApplicationStatusBadge';

export const CitizenApplicationsPage = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await api.get('/citizen/applications');
      setApps(res.data);
    } catch (err) {
      console.error('Failed to fetch citizen applications:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Your Online Applications..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
          MY SUBMITTED APPLICATIONS
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Application Workspace</h2>
        <p className="text-xs text-slate-500">Track processing status, document verification, inspection results, and download issued certificates.</p>
      </div>

      <Table headers={['Application No', 'Service Name', 'Submission Date', 'SLA Deadline', 'Status', 'Actions']}>
        {apps.map((a) => (
          <tr key={a.application_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-blue-600 font-mono">{a.application_number}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{a.service_name}</td>
            <td className="px-6 py-4 text-slate-500">{new Date(a.submitted_at).toLocaleDateString()}</td>
            <td className="px-6 py-4 font-mono text-slate-700">{a.sla_deadline ? new Date(a.sla_deadline).toLocaleDateString() : 'N/A'}</td>
            <td className="px-6 py-4">
              <ApplicationStatusBadge status={a.status} />
            </td>
            <td className="px-6 py-4">
              <button onClick={() => navigate(`/citizen/applications/${a.application_id}`)} className="text-xs font-bold text-blue-600 hover:underline">
                View Telemetry
              </button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};
