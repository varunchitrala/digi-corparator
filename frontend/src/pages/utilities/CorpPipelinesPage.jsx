import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { LoadingState } from '../../components/LoadingState';
import { Sliders, Plus } from 'lucide-react';

export const CorpPipelinesPage = () => {
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    pipeline_name: 'Ward 24 Main Distribution Pipeline',
    ward_id: 'w-demo-024',
    length_meters: 1500
  });

  useEffect(() => {
    fetchPipelines();
  }, []);

  const fetchPipelines = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/water/pipelines');
      setPipelines(res.data);
    } catch (err) {
      console.error('Failed to fetch pipelines:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/water/pipelines', formData);
      alert(`Pipeline Created Successfully! Code: ${res.data.pipeline_code}`);
      setIsCreateOpen(false);
      fetchPipelines();
    } catch (err) {
      alert(err.message || 'Pipeline creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOperateValve = async (valveId) => {
    try {
      const res = await api.post(`/corporation/water/valves/${valveId}/operate`, {
        new_position: 'CLOSED',
        reason: 'Scheduled Ward 24 Maintenance'
      });
      alert(res.data.message);
      fetchPipelines();
    } catch (err) {
      alert(err.message || 'Valve operation failed');
    }
  };

  if (loading) return <LoadingState message="Fetching Water Pipeline Network & Valves..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            PIPELINE NETWORK & VALVES
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Water Distribution Lines & Valve Controls</h2>
          <p className="text-xs text-slate-500">Monitor primary/secondary distribution lines, operate valves with audit history, and trace GIS spatial segments.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsCreateOpen(true)} className="bg-cyan-600 hover:bg-cyan-700">
          <Plus className="w-4 h-4 mr-1.5" /> Add Pipeline
        </Button>
      </div>

      <Table headers={['Pipeline Code', 'Pipeline Name', 'Ward', 'Type', 'Length (m)', 'Status', 'Actions']}>
        {pipelines.map((p) => (
          <tr key={p.pipeline_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-cyan-700 font-mono">{p.pipeline_code}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{p.pipeline_name}</td>
            <td className="px-6 py-4 text-slate-600">{p.ward_name || 'Ward 24'}</td>
            <td className="px-6 py-4 font-mono">{p.pipeline_type}</td>
            <td className="px-6 py-4 font-mono font-bold text-indigo-700">{p.length_meters} m</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {p.status}
              </span>
            </td>
            <td className="px-6 py-4">
              <Button variant="secondary" size="xs" onClick={() => handleOperateValve('val-001')} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Sliders className="w-3.5 h-3.5 mr-1" /> Operate Valve
              </Button>
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Add Water Pipeline">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input label="Pipeline Name" value={formData.pipeline_name} onChange={(e) => setFormData({ ...formData, pipeline_name: e.target.value })} required />
          <Input label="Pipeline Length (meters)" type="number" value={formData.length_meters} onChange={(e) => setFormData({ ...formData, length_meters: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Add Pipeline</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
