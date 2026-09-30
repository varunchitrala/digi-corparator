import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { WorkStatusBadge } from '../../components/works/WorkStatusBadge';
import { ProgressProgressBar } from '../../components/works/ProgressProgressBar';
import { Button } from '../../components/Button';
import { LoadingState } from '../../components/LoadingState';
import { Plus, Eye, BarChart3, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const CorpWorksPage = () => {
  const navigate = useNavigate();
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/works');
      setWorks(res.data);
    } catch (err) {
      console.error('Failed to fetch works:', err);
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
            DEVELOPMENT WORKS & PROJECTS
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Municipal Development Works Directory</h2>
          <p className="text-xs text-slate-500">Monitor technical estimates, approvals, work orders, milestones, and running bills.</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/corporation/works/dashboard')}>
            <BarChart3 className="w-4 h-4 mr-1.5" /> Executive Dashboard
          </Button>
          <Link to="/corporation/works/create">
            <Button variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-1.5" /> Create New Work
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingState message="Fetching development works directory..." />
      ) : (
        <Table headers={['Work Code', 'Work Title', 'Ward', 'Estimated Cost', 'Status', 'Progress', 'Contractor', 'Action']}>
          {works.map((w) => (
            <tr key={w.work_id} className="hover:bg-slate-50 text-xs">
              <td className="px-6 py-4 font-bold text-blue-600">{w.work_code}</td>
              <td className="px-6 py-4 font-bold text-slate-900 max-w-xs truncate">{w.work_title}</td>
              <td className="px-6 py-4 text-slate-600">{w.ward_name || 'Ward 24'}</td>
              <td className="px-6 py-4 font-mono font-bold text-emerald-700">{formatCurrency(w.estimated_cost)}</td>
              <td className="px-6 py-4"><WorkStatusBadge status={w.status} /></td>
              <td className="px-6 py-4 w-44">
                <ProgressProgressBar physicalProgress={w.physical_progress} financialProgress={w.financial_progress} />
              </td>
              <td className="px-6 py-4 text-slate-700">{w.contractor_name || 'Unassigned'}</td>
              <td className="px-6 py-4">
                <Button size="sm" variant="outline" onClick={() => navigate(`/corporation/works/${w.work_id}`)}>
                  <Eye className="w-3.5 h-3.5 mr-1" /> View Details
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
};
