import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { LoadingState } from '../../components/LoadingState';
import { Plus } from 'lucide-react';

export const CorpVectorControlPage = () => {
  const [foggingList, setFoggingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    ward_id: 'w-demo-024',
    fogging_date: '2026-08-28',
    route_name: 'Ward 24 Civil Lines Sector 3'
  });

  useEffect(() => {
    fetchFogging();
  }, []);

  const fetchFogging = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/health/fogging');
      setFoggingList(res.data);
    } catch (err) {
      console.error('Failed to fetch fogging activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/health/fogging', formData);
      alert(`Fogging Activity Scheduled Successfully! Code: ${res.data.fogging_number}`);
      setIsScheduleOpen(false);
      fetchFogging();
    } catch (err) {
      alert(err.message || 'Fogging scheduling failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Vector Control & Fogging Register..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            VECTOR CONTROL & FOGGING ACTIVITIES
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Mosquito Control & Fogging Operations</h2>
          <p className="text-xs text-slate-500">Manage ward-wise thermal fogging vehicle routes, larval surveys, and stagnant water breeding spot treatments.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsScheduleOpen(true)} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="w-4 h-4 mr-1.5" /> Schedule Fogging
        </Button>
      </div>

      <Table headers={['Fogging Code', 'Ward', 'Route / Location', 'Fogging Date', 'Status']}>
        {foggingList.map((f) => (
          <tr key={f.fogging_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-amber-700 font-mono">{f.fogging_number}</td>
            <td className="px-6 py-4 text-slate-600">{f.ward_name || 'Ward 24'}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{f.route_name}</td>
            <td className="px-6 py-4 font-mono text-indigo-700">{new Date(f.fogging_date).toLocaleDateString()}</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {f.status}
              </span>
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} title="Schedule Fogging Activity">
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <Input label="Target Route / Location Name" value={formData.route_name} onChange={(e) => setFormData({ ...formData, route_name: e.target.value })} required />
          <Input label="Fogging Date" type="date" value={formData.fogging_date} onChange={(e) => setFormData({ ...formData, fogging_date: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsScheduleOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Schedule Fogging</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
