import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { ComplaintStatusBadge } from '../../components/complaints/ComplaintStatusBadge';
import { Button } from '../../components/Button';
import { LoadingState } from '../../components/LoadingState';
import { BarChart3, MapPin } from 'lucide-react';

export const CorpAdminComplaintsPage = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCorpComplaints();
  }, []);

  const fetchCorpComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/complaints');
      setComplaints(res.data);
    } catch (err) {
      console.error('Failed to fetch corporation complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            CITY-WIDE GRIEVANCES
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Corporation Complaints Directory</h2>
          <p className="text-xs text-slate-500">Monitor city-wide grievances across all municipal wards and departments.</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/corporation/complaints/analytics')}>
            <BarChart3 className="w-4 h-4 mr-1.5" /> View Analytics
          </Button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingState message="Fetching corporation complaints directory..." />
      ) : (
        <Table headers={['Complaint ID', 'Title', 'Ward', 'Department', 'Priority', 'Status', 'Assigned Officer']}>
          {complaints.map((cmp) => (
            <tr key={cmp.complaint_id} className="hover:bg-slate-50 text-xs">
              <td className="px-6 py-4 font-bold text-blue-600">{cmp.complaint_number}</td>
              <td className="px-6 py-4 font-bold text-slate-900 max-w-xs truncate">{cmp.title}</td>
              <td className="px-6 py-4 text-slate-600">{cmp.ward_name || 'Ward 24'}</td>
              <td className="px-6 py-4 text-slate-600">{cmp.department_name || 'Engineering'}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-0.5 rounded font-black text-[10px] ${
                  cmp.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {cmp.priority}
                </span>
              </td>
              <td className="px-6 py-4"><ComplaintStatusBadge status={cmp.status} /></td>
              <td className="px-6 py-4 text-slate-700">{cmp.officer_first_name ? `${cmp.officer_first_name} ${cmp.officer_last_name}` : 'Unassigned'}</td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
};
