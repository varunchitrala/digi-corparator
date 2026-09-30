import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { LoadingState } from '../../components/LoadingState';
import { CheckCircle, Plus } from 'lucide-react';

export const CorpRoadCuttingPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    road_id: 'road-001',
    ward_id: 'w-demo-024',
    agency: 'MSEDCL Electricity',
    purpose: 'Underground High-Tension Cable Laying',
    cut_length_meters: 50,
    cut_width_meters: 1.2
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/roads/cutting');
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to fetch road cutting applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/roads/cutting', formData);
      alert(`Road Cutting Permission Application Submitted! Code: ${res.data.application_number}`);
      setIsApplyOpen(false);
      fetchApplications();
    } catch (err) {
      alert(err.message || 'Application submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await api.post(`/corporation/roads/cutting/${id}/approve`);
      alert(res.data.message);
      fetchApplications();
    } catch (err) {
      alert(err.message || 'Approval failed');
    }
  };

  if (loading) return <LoadingState message="Fetching Road Cutting Permits Register..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            ROAD CUTTING PERMITS & RESTORATION
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Utility Excavation Permissions & Road Restoration</h2>
          <p className="text-xs text-slate-500">Track utility road cutting permits (Water/Telecom/Power), conduct technical reviews, and enforce asphalt restoration.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsApplyOpen(true)} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="w-4 h-4 mr-1.5" /> Apply for Permit
        </Button>
      </div>

      <Table headers={['Permit No.', 'Road Name', 'Requesting Agency', 'Purpose', 'Cut Size', 'Status', 'Actions']}>
        {applications.map((c) => (
          <tr key={c.application_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-amber-700 font-mono">{c.application_number}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{c.road_name}</td>
            <td className="px-6 py-4 font-mono text-slate-700">{c.agency}</td>
            <td className="px-6 py-4 text-slate-600">{c.purpose}</td>
            <td className="px-6 py-4 font-mono">{c.cut_length_meters}m × {c.cut_width_meters}m</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {c.status}
              </span>
            </td>
            <td className="px-6 py-4">
              {c.status === 'SUBMITTED' && (
                <Button variant="secondary" size="xs" onClick={() => handleApprove(c.application_id)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                </Button>
              )}
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isApplyOpen} onClose={() => setIsApplyOpen(false)} title="Apply for Utility Road Cutting Permit">
        <form onSubmit={handleApplySubmit} className="space-y-4">
          <Input label="Requesting Agency / Department" value={formData.agency} onChange={(e) => setFormData({ ...formData, agency: e.target.value })} required />
          <Input label="Excavation Purpose" value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} required />
          <Input label="Cut Length (meters)" type="number" value={formData.cut_length_meters} onChange={(e) => setFormData({ ...formData, cut_length_meters: e.target.value })} required />
          <Input label="Cut Width (meters)" type="number" step="0.1" value={formData.cut_width_meters} onChange={(e) => setFormData({ ...formData, cut_width_meters: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsApplyOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Submit Permit Application</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
