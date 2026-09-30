import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { LoadingState } from '../../components/LoadingState';
import { Plus } from 'lucide-react';

export const CorpSupplySchedulesPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    zone_name: 'Ward 24 Zone A Civil Lines',
    ward_id: 'w-demo-024',
    supply_date: '2026-08-28',
    start_time: '06:00:00',
    end_time: '09:00:00'
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/water/schedules');
      setSchedules(res.data);
    } catch (err) {
      console.error('Failed to fetch supply schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/corporation/water/schedules', formData);
      alert('Water Supply Schedule Published Successfully!');
      setIsPublishOpen(false);
      fetchSchedules();
    } catch (err) {
      alert(err.message || 'Publishing schedule failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Water Supply Schedules..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            WATER SUPPLY SCHEDULES
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Ward Water Supply Timetables</h2>
          <p className="text-xs text-slate-500">Publish ward supply timetables, manage zone schedules, and notify citizens of maintenance outages.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsPublishOpen(true)} className="bg-cyan-600 hover:bg-cyan-700">
          <Plus className="w-4 h-4 mr-1.5" /> Publish Schedule
        </Button>
      </div>

      <Table headers={['Zone Name', 'Ward', 'Supply Date', 'Start Time', 'End Time', 'Status']}>
        {schedules.map((s) => (
          <tr key={s.schedule_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-slate-900">{s.zone_name}</td>
            <td className="px-6 py-4 text-slate-600">{s.ward_name || 'Ward 24'}</td>
            <td className="px-6 py-4 font-mono text-indigo-700">{new Date(s.supply_date).toLocaleDateString()}</td>
            <td className="px-6 py-4 font-mono font-bold text-emerald-700">{s.start_time}</td>
            <td className="px-6 py-4 font-mono font-bold text-emerald-700">{s.end_time}</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {s.status}
              </span>
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isPublishOpen} onClose={() => setIsPublishOpen(false)} title="Publish Water Supply Schedule">
        <form onSubmit={handlePublishSubmit} className="space-y-4">
          <Input label="Supply Zone Name" value={formData.zone_name} onChange={(e) => setFormData({ ...formData, zone_name: e.target.value })} required />
          <Input label="Supply Date" type="date" value={formData.supply_date} onChange={(e) => setFormData({ ...formData, supply_date: e.target.value })} required />
          <Input label="Start Time" type="time" value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} required />
          <Input label="End Time" type="time" value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsPublishOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Publish Schedule</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
