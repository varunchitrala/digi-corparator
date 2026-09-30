import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { Plus } from 'lucide-react';

export const CorpRoadRepairsPage = () => {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    road_id: 'road-001',
    pothole_id: 'pot-001',
    work_order_id: 'WO-2026-314274',
    repair_type: 'POTHOLE_REPAIR'
  });

  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/roads/repairs');
      setRepairs(res.data);
    } catch (err) {
      console.error('Failed to fetch repairs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/roads/repairs', formData);
      alert(`Road Repair Linked to Work Order Successfully! Code: ${res.data.repair_number}`);
      setIsLinkOpen(false);
      fetchRepairs();
    } catch (err) {
      alert(err.message || 'Linking repair failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Road Repair Progress Register..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            ROAD REPAIR WORKFLOWS
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Road Repair Progress & Quality Control</h2>
          <p className="text-xs text-slate-500">Link pothole repairs to Phase 7 Work Orders, track completion percentage, and record quality inspection scores.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsLinkOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-1.5" /> Link Work Order
        </Button>
      </div>

      <Table headers={['Repair Code', 'Road Name', 'Repair Type', 'Work Order ID', 'Progress (%)', 'Status']}>
        {repairs.map((r) => (
          <tr key={r.repair_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-indigo-700 font-mono">{r.repair_number}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{r.road_name}</td>
            <td className="px-6 py-4 font-mono">{r.repair_type}</td>
            <td className="px-6 py-4 font-mono font-bold text-slate-700">{r.work_order_id}</td>
            <td className="px-6 py-4 font-mono font-bold text-emerald-700">{r.progress_percentage}%</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {r.status}
              </span>
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isLinkOpen} onClose={() => setIsLinkOpen(false)} title="Link Road Repair Work Order">
        <form onSubmit={handleLinkSubmit} className="space-y-4">
          <Select label="Repair Type" value={formData.repair_type} onChange={(e) => setFormData({ ...formData, repair_type: e.target.value })} options={[
            { value: 'POTHOLE_REPAIR', label: 'Pothole Bitumen Patching' },
            { value: 'PATCH_WORK', label: 'Sectional Patching' },
            { value: 'RESURFACING', label: 'Asphalt Resurfacing Overlay' },
            { value: 'RECONSTRUCTION', label: 'Full Road Reconstruction' }
          ]} />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsLinkOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Link Work Order</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
