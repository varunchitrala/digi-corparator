import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { LoadingState } from '../../components/LoadingState';
import { ApplicationStatusBadge } from '../../components/services/ApplicationStatusBadge';

export const OfficerApplicationsPage = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOfficerApps();
  }, []);

  const fetchOfficerApps = async () => {
    setLoading(true);
    try {
      const res = await api.get('/officer/applications');
      setApps(res.data);
    } catch (err) {
      console.error('Failed to fetch officer applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (appId) => {
    try {
      const res = await api.post(`/officer/applications/${appId}/approve`);
      alert(`Application Approved! Issued Certificate No: ${res.data.certificate_number}`);
      fetchOfficerApps();
    } catch (err) {
      alert(err.message || 'Approval failed');
    }
  };

  if (loading) return <LoadingState message="Fetching Officer Verification & Scrutiny Workspace..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
          OFFICER VERIFICATION & SCRUTINY WORKSPACE
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Citizen Applications Scrutiny</h2>
        <p className="text-xs text-slate-500">Verify documents, record field inspections, request clarification, and issue certificates.</p>
      </div>

      <Table headers={['App No', 'Service Name', 'Citizen', 'Submitted', 'Status', 'Actions']}>
        {apps.map((a) => (
          <tr key={a.application_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-blue-600 font-mono">{a.application_number}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{a.service_name}</td>
            <td className="px-6 py-4 text-slate-600">{a.citizen_name || 'Citizen User'}</td>
            <td className="px-6 py-4 text-slate-500">{new Date(a.submitted_at).toLocaleDateString()}</td>
            <td className="px-6 py-4">
              <ApplicationStatusBadge status={a.status} />
            </td>
            <td className="px-6 py-4 space-x-2">
              {a.status !== 'APPROVED' && (
                <Button variant="success" size="xs" onClick={() => handleApprove(a.application_id)} className="bg-emerald-600 hover:bg-emerald-700">
                  Approve & Issue Certificate
                </Button>
              )}
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};
