import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { ComplaintStatusBadge } from '../../components/complaints/ComplaintStatusBadge';
import { Button } from '../../components/Button';
import { LoadingState } from '../../components/LoadingState';
import { Plus, Eye, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export const CitizenComplaintsPage = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/citizen/complaints');
      setComplaints(res.data);
    } catch (err) {
      console.error('Failed to fetch citizen complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
            CITIZEN GRIEVANCE PORTAL
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">My Registered Complaints</h2>
          <p className="text-xs text-slate-500">Track resolution progress, verify completed work, and provide feedback.</p>
        </div>

        <Link to="/citizen/complaints/create">
          <Button variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-1.5" /> Register New Complaint
          </Button>
        </Link>
      </div>

      {/* Complaints Table */}
      {loading ? (
        <LoadingState message="Fetching your complaints..." />
      ) : (
        <Table headers={['Complaint ID', 'Title', 'Category', 'Status', 'Submitted Date', 'Action']}>
          {complaints.map((cmp) => (
            <tr key={cmp.complaint_id} className="hover:bg-slate-50 text-xs">
              <td className="px-6 py-4 font-bold text-blue-600">{cmp.complaint_number}</td>
              <td className="px-6 py-4 font-bold text-slate-900 max-w-xs truncate">{cmp.title}</td>
              <td className="px-6 py-4 text-slate-600">{cmp.category_name || 'General'}</td>
              <td className="px-6 py-4"><ComplaintStatusBadge status={cmp.status} /></td>
              <td className="px-6 py-4 text-slate-500">{new Date(cmp.created_at).toLocaleDateString('en-IN')}</td>
              <td className="px-6 py-4">
                <Button size="sm" variant="outline" onClick={() => navigate(`/citizen/complaints/${cmp.complaint_id}`)}>
                  <Eye className="w-3.5 h-3.5 mr-1" /> View Status
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
};
