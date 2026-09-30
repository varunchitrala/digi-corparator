import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { Plus, Trees } from 'lucide-react';

export const CorpTreeCensusPage = () => {
  const [data, setData] = useState({ gardens: [], trees: [], permits: [], aqi_index: 68 });
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    species_name: 'Heritage Banyan Tree',
    ward_id: 'w-demo-024',
    girth_cm: 120,
    health_status: 'HEALTHY'
  });

  useEffect(() => {
    fetchEnvData();
  }, []);

  const fetchEnvData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/environment/gardens');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch environment data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/environment/trees', formData);
      alert(`Tree Census Item Tagged! Tree Code: ${res.data.tree_code}`);
      setIsOpen(false);
      fetchEnvData();
    } catch (err) {
      alert(err.message || 'Tagging failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Environment & Tree Census Data..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200">
            ENVIRONMENT & TREE CENSUS
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Gardens, Tree Census & Air Quality Index (AQI)</h2>
          <p className="text-xs text-slate-500">Manage municipal parks, QR-tagged tree census database, tree cutting permits, and live AQI telemetry.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-1.5" /> Tag Tree Census
        </Button>
      </div>

      {/* AQI Banner */}
      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Trees className="w-8 h-8 text-emerald-600" />
          <div>
            <div className="text-xs font-bold text-emerald-900">Ward 24 Real-time Air Quality Index (AQI)</div>
            <div className="text-lg font-extrabold text-emerald-950 font-mono">AQI {data.aqi_index} • Good Air Quality</div>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-200 text-emerald-900 border border-emerald-300">
          OPTIMAL GREEN COVER
        </span>
      </div>

      {/* Tree Census */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3">QR-Tagged Ward Tree Census Database</h3>
        <Table headers={['Tree Code', 'Species Name', 'Ward', 'Trunk Girth', 'Health Status']}>
          {data.trees.map((t) => (
            <tr key={t.tree_id} className="hover:bg-slate-50 text-xs">
              <td className="px-6 py-4 font-bold text-emerald-700 font-mono">{t.tree_code}</td>
              <td className="px-6 py-4 font-bold text-slate-900">{t.species_name}</td>
              <td className="px-6 py-4 text-slate-600">{t.ward_name || 'Ward 24'}</td>
              <td className="px-6 py-4 font-mono font-bold text-indigo-700">{t.girth_cm} cm</td>
              <td className="px-6 py-4 font-mono">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {t.health_status}
                </span>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Tag Tree Census Item">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Tree Species Name" value={formData.species_name} onChange={(e) => setFormData({ ...formData, species_name: e.target.value })} required />
          <Input label="Trunk Girth (cm)" type="number" value={formData.girth_cm} onChange={(e) => setFormData({ ...formData, girth_cm: e.target.value })} required />
          <Select label="Health Status" value={formData.health_status} onChange={(e) => setFormData({ ...formData, health_status: e.target.value })} options={[
            { value: 'HEALTHY', label: 'Healthy & Blooming' },
            { value: 'DISEASED', label: 'Diseased (Requires Treatment)' },
            { value: 'DANGEROUS', label: 'Dangerous (Risk of Falling)' }
          ]} />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Tag Tree</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
