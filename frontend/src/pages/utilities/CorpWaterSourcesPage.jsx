import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { Plus } from 'lucide-react';

export const CorpWaterSourcesPage = () => {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    source_name: 'Jayakwadi Dam Reservoir',
    source_type: 'DAM',
    capacity_mld: 450
  });

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/water/sources');
      setSources(res.data);
    } catch (err) {
      console.error('Failed to fetch sources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/water/sources', formData);
      alert(`Water Source Registered Successfully! Code: ${res.data.source_code}`);
      setIsRegisterOpen(false);
      fetchSources();
    } catch (err) {
      alert(err.message || 'Source registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Water Sources & Treatment Plants..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            WATER SOURCES & TREATMENT PLANTS
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Raw Water Intake & Reservoirs</h2>
          <p className="text-xs text-slate-500">Monitor dam reservoir levels, raw water intake capacity (MLD), and treatment plant output.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsRegisterOpen(true)} className="bg-cyan-600 hover:bg-cyan-700">
          <Plus className="w-4 h-4 mr-1.5" /> Register Water Source
        </Button>
      </div>

      <Table headers={['Source Code', 'Source Name', 'Type', 'Capacity (MLD)', 'Current Level', 'Status']}>
        {sources.map((s) => (
          <tr key={s.source_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-cyan-700 font-mono">{s.source_code}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{s.source_name}</td>
            <td className="px-6 py-4 font-mono">{s.source_type}</td>
            <td className="px-6 py-4 font-mono font-bold text-indigo-700">{s.capacity_mld} MLD</td>
            <td className="px-6 py-4 font-mono font-bold text-emerald-700">{s.current_level_percent}%</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {s.status}
              </span>
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} title="Register Water Source">
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <Input label="Source Name" value={formData.source_name} onChange={(e) => setFormData({ ...formData, source_name: e.target.value })} required />
          <Select label="Source Type" value={formData.source_type} onChange={(e) => setFormData({ ...formData, source_type: e.target.value })} options={[
            { value: 'DAM', label: 'Dam Reservoir' },
            { value: 'RIVER', label: 'River Intake' },
            { value: 'LAKE', label: 'Natural Lake' },
            { value: 'BOREWELL', label: 'Municipal Borewell Group' }
          ]} />
          <Input label="Intake Capacity (MLD)" type="number" value={formData.capacity_mld} onChange={(e) => setFormData({ ...formData, capacity_mld: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsRegisterOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Register Source</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
