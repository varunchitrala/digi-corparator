import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { RoadConditionBadge } from '../../components/roads/RoadConditionBadge';
import { Plus } from 'lucide-react';

export const CorpRoadsPage = () => {
  const [roads, setRoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    road_name: 'Civil Lines Main Road Ward 24',
    ward_id: 'w-demo-024',
    road_type: 'MAIN_ROAD',
    surface_type: 'BITUMEN',
    length_meters: 2500
  });

  useEffect(() => {
    fetchRoads();
  }, []);

  const fetchRoads = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/roads');
      setRoads(res.data);
    } catch (err) {
      console.error('Failed to fetch roads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/roads', formData);
      alert(`Municipal Road Registered Successfully! Code: ${res.data.road_code}`);
      setIsRegisterOpen(false);
      fetchRoads();
    } catch (err) {
      alert(err.message || 'Road registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Road Master Register..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            ROAD MASTER REGISTER
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Municipal Roads & Infrastructure Assets</h2>
          <p className="text-xs text-slate-500">Directory of city arterial roads, residential streets, surface types (Bitumen/Concrete), and condition ratings.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsRegisterOpen(true)} className="bg-cyan-600 hover:bg-cyan-700">
          <Plus className="w-4 h-4 mr-1.5" /> Add Road
        </Button>
      </div>

      <Table headers={['Road Code', 'Road Name', 'Ward', 'Type', 'Surface', 'Length (m)', 'Condition', 'Status']}>
        {roads.map((r) => (
          <tr key={r.road_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-cyan-700 font-mono">{r.road_code}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{r.road_name}</td>
            <td className="px-6 py-4 text-slate-600">{r.ward_name || 'Ward 24'}</td>
            <td className="px-6 py-4 font-mono">{r.road_type}</td>
            <td className="px-6 py-4 font-mono">{r.surface_type}</td>
            <td className="px-6 py-4 font-mono font-bold text-indigo-700">{r.length_meters} m</td>
            <td className="px-6 py-4">
              <RoadConditionBadge condition={r.condition} />
            </td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {r.status}
              </span>
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} title="Register Municipal Road">
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <Input label="Road Name" value={formData.road_name} onChange={(e) => setFormData({ ...formData, road_name: e.target.value })} required />
          <Select label="Road Classification" value={formData.road_type} onChange={(e) => setFormData({ ...formData, road_type: e.target.value })} options={[
            { value: 'MAIN_ROAD', label: 'Main City Road' },
            { value: 'ARTERIAL', label: 'Arterial Road' },
            { value: 'RESIDENTIAL', label: 'Residential Street' },
            { value: 'SERVICE_ROAD', label: 'Service Road' }
          ]} />
          <Select label="Surface Material" value={formData.surface_type} onChange={(e) => setFormData({ ...formData, surface_type: e.target.value })} options={[
            { value: 'BITUMEN', label: 'Asphalt / Bitumen' },
            { value: 'CONCRETE', label: 'Cement Concrete (CC)' },
            { value: 'PAVER', label: 'Interlocking Paver Blocks' }
          ]} />
          <Input label="Road Length (meters)" type="number" value={formData.length_meters} onChange={(e) => setFormData({ ...formData, length_meters: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsRegisterOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Register Road</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
