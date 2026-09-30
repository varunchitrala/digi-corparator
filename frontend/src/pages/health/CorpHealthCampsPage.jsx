import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { Plus } from 'lucide-react';

export const CorpHealthCampsPage = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    camp_name: 'Ward 24 Monsoon Vector Control & Dengue Camp',
    ward_id: 'w-demo-024',
    camp_type: 'HEALTH_SCREENING',
    camp_date: '2026-08-28'
  });

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/health/camps');
      setCamps(res.data);
    } catch (err) {
      console.error('Failed to fetch camps:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/health/camps', formData);
      alert(`Health Camp Scheduled Successfully! Code: ${res.data.camp_code}`);
      setIsScheduleOpen(false);
      fetchCamps();
    } catch (err) {
      alert(err.message || 'Camp scheduling failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Health Camps & Screening Programs..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            HEALTH CAMPS & SCREENING
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Ward Health Camps & Immunization Drives</h2>
          <p className="text-xs text-slate-500">Schedule ward health screening camps, maternal immunization drives, and vector control awareness programs.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsScheduleOpen(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-1.5" /> Schedule Health Camp
        </Button>
      </div>

      <Table headers={['Camp Code', 'Camp Name', 'Ward', 'Type', 'Camp Date', 'Status']}>
        {camps.map((c) => (
          <tr key={c.camp_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-purple-700 font-mono">{c.camp_code}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{c.camp_name}</td>
            <td className="px-6 py-4 text-slate-600">{c.ward_name || 'Ward 24'}</td>
            <td className="px-6 py-4 font-mono">{c.camp_type}</td>
            <td className="px-6 py-4 font-mono text-indigo-700">{new Date(c.camp_date).toLocaleDateString()}</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {c.status}
              </span>
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} title="Schedule Health Camp">
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <Input label="Camp Program Name" value={formData.camp_name} onChange={(e) => setFormData({ ...formData, camp_name: e.target.value })} required />
          <Select label="Camp Type" value={formData.camp_type} onChange={(e) => setFormData({ ...formData, camp_type: e.target.value })} options={[
            { value: 'HEALTH_SCREENING', label: 'General Health Screening' },
            { value: 'IMMUNIZATION', label: 'Vaccination & Immunization' },
            { value: 'MATERNAL_HEALTH', label: 'Maternal & Child Health' },
            { value: 'EYE_CAMP', label: 'Eye Care Screening' }
          ]} />
          <Input label="Camp Date" type="date" value={formData.camp_date} onChange={(e) => setFormData({ ...formData, camp_date: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsScheduleOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Schedule Camp</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
