import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { LeakageStatusBadge } from '../../components/utilities/LeakageStatusBadge';
import { Plus } from 'lucide-react';

export const CorpLeakagesPage = () => {
  const [leakages, setLeakages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    pipeline_id: 'pipe-001',
    ward_id: 'w-demo-024',
    severity: 'MEDIUM',
    description: 'Pipeline joint leakage near Plot 45'
  });

  useEffect(() => {
    fetchLeakages();
  }, []);

  const fetchLeakages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/water/leakages');
      setLeakages(res.data);
    } catch (err) {
      console.error('Failed to fetch leakages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/water/leakages', formData);
      alert(`Leakage Logged Successfully! Code: ${res.data.leakage_number}`);
      setIsLogOpen(false);
      fetchLeakages();
    } catch (err) {
      alert(err.message || 'Leakage logging failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Pipeline Leakages Register..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            PIPELINE LEAKAGES REGISTER
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Water Leakage Incidents & Repair Workflows</h2>
          <p className="text-xs text-slate-500">Log pipeline leakage breakdowns, assign repair work orders (Phase 7), and track pressure restoration.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsLogOpen(true)} className="bg-rose-600 hover:bg-rose-700">
          <Plus className="w-4 h-4 mr-1.5" /> Log Leakage
        </Button>
      </div>

      <Table headers={['Leakage Code', 'Pipeline Name', 'Ward', 'Severity', 'Description', 'Status']}>
        {leakages.map((l) => (
          <tr key={l.leakage_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-rose-700 font-mono">{l.leakage_number}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{l.pipeline_name}</td>
            <td className="px-6 py-4 text-slate-600">{l.ward_name || 'Ward 24'}</td>
            <td className="px-6 py-4 font-mono font-bold text-amber-700">{l.severity}</td>
            <td className="px-6 py-4 text-slate-600">{l.description}</td>
            <td className="px-6 py-4">
              <LeakageStatusBadge status={l.status} />
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} title="Log Pipeline Leakage">
        <form onSubmit={handleLogSubmit} className="space-y-4">
          <Select label="Severity Level" value={formData.severity} onChange={(e) => setFormData({ ...formData, severity: e.target.value })} options={[
            { value: 'LOW', label: 'Low Seepage' },
            { value: 'MEDIUM', label: 'Medium Pressure Leakage' },
            { value: 'HIGH', label: 'High Burst Leakage' },
            { value: 'CRITICAL', label: 'Critical Transmission Line Burst' }
          ]} />
          <Input label="Leakage Description & Site Notes" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsLogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Log Leakage</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
