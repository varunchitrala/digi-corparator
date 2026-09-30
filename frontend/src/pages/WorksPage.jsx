import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Table } from '../components/Table';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { LoadingState } from '../components/LoadingState';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Plus, RefreshCw, HardHat, CheckCircle2 } from 'lucide-react';

export const WorksPage = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    work_title: '',
    description: '',
    estimated_cost: '',
    approved_cost: '',
    start_date: '2026-09-01',
    target_date: '2026-12-31'
  });

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/works?ward_id=w-demo-024');
      setWorks(res.data);
    } catch (err) {
      console.error('Failed to fetch development works:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWork = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/works', {
        ...formData,
        ward_id: 'w-demo-024'
      });
      setIsModalOpen(false);
      setFormData({ work_title: '', description: '', estimated_cost: '', approved_cost: '', start_date: '2026-09-01', target_date: '2026-12-31' });
      fetchWorks();
    } catch (err) {
      alert(err.message || 'Failed to create work proposal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
            DEVELOPMENT WORKS MODULE
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Ward Infrastructure Projects</h2>
          <p className="text-xs text-slate-500">Track civil engineering projects, physical progress, and financial approvals.</p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={fetchWorks} isLoading={loading}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> Propose Work
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Fetching development works telemetry..." />
      ) : (
        <Table
          headers={[
            'Work Code',
            'Project Title & Scope',
            'Estimated Cost',
            'Approved Budget',
            'Target Completion',
            'Progress',
            'Status'
          ]}
        >
          {works.map((w) => (
            <tr key={w.work_id} className="hover:bg-slate-50">
              <td className="px-6 py-4 font-bold text-blue-600 text-xs">{w.work_code}</td>
              <td className="px-6 py-4">
                <p className="font-bold text-slate-900 text-xs">{w.work_title}</p>
                <p className="text-[11px] text-slate-500">{w.department_name || 'Civil Engineering'}</p>
              </td>
              <td className="px-6 py-4 font-bold text-slate-900 text-xs">
                {formatCurrency(w.estimated_cost)}
              </td>
              <td className="px-6 py-4 font-bold text-emerald-700 text-xs">
                {formatCurrency(w.approved_cost)}
              </td>
              <td className="px-6 py-4 text-xs text-slate-600">
                {formatDate(w.target_date)}
              </td>
              <td className="px-6 py-4 w-40">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-600">Physical</span>
                    <span className="text-blue-600">{w.physical_progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${w.physical_progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                      style={{ width: `${w.physical_progress}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={w.status} />
              </td>
            </tr>
          ))}
        </Table>
      )}

      {/* Propose Work Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Propose New Ward Development Work">
        <form onSubmit={handleCreateWork} className="space-y-4">
          <Input
            label="Work Title"
            placeholder="e.g. Asphalting of Shivaji Nagar Main Road"
            value={formData.work_title}
            onChange={(e) => setFormData({ ...formData, work_title: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Estimated Cost (₹)"
              type="number"
              placeholder="2500000"
              value={formData.estimated_cost}
              onChange={(e) => setFormData({ ...formData, estimated_cost: e.target.value })}
              required
            />
            <Input
              label="Approved Cost (₹)"
              type="number"
              placeholder="2400000"
              value={formData.approved_cost}
              onChange={(e) => setFormData({ ...formData, approved_cost: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />
            <Input
              label="Target Completion Date"
              type="date"
              value={formData.target_date}
              onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Submit Proposal</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
