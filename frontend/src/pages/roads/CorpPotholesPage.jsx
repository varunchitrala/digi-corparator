import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { PotholeStatusBadge } from '../../components/roads/PotholeStatusBadge';
import { Plus } from 'lucide-react';

export const CorpPotholesPage = () => {
  const [potholes, setPotholes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    road_id: 'road-001',
    ward_id: 'w-demo-024',
    length_meters: 1.5,
    width_meters: 1.0,
    depth_meters: 0.15,
    severity: 'MEDIUM'
  });

  useEffect(() => {
    fetchPotholes();
  }, []);

  const fetchPotholes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/roads/potholes');
      setPotholes(res.data);
    } catch (err) {
      console.error('Failed to fetch potholes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/roads/potholes', formData);
      alert(`Pothole Logged & Volume Calculated Successfully!\nCode: ${res.data.pothole_number}\nEstimated Volume: ${res.data.estimated_volume_m3} m³`);
      setIsLogOpen(false);
      fetchPotholes();
    } catch (err) {
      alert(err.message || 'Pothole logging failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Pothole Management Register..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            POTHOLE MANAGEMENT & VOLUME CALCULATOR
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Pothole Breakdown Register & Measurement Engine</h2>
          <p className="text-xs text-slate-500">Log pothole dimensions (Length × Width × Depth), calculate asphalt volume required (m³), and assign repair work orders.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsLogOpen(true)} className="bg-rose-600 hover:bg-rose-700">
          <Plus className="w-4 h-4 mr-1.5" /> Log Pothole
        </Button>
      </div>

      <Table headers={['Pothole Code', 'Road Name', 'Ward', 'Dimensions (L×W×D)', 'Volume (m³)', 'Severity', 'Status']}>
        {potholes.map((p) => (
          <tr key={p.pothole_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-rose-700 font-mono">{p.pothole_number}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{p.road_name}</td>
            <td className="px-6 py-4 text-slate-600">{p.ward_name || 'Ward 24'}</td>
            <td className="px-6 py-4 font-mono">{p.length_meters}m × {p.width_meters}m × {p.depth_meters}m</td>
            <td className="px-6 py-4 font-mono font-bold text-indigo-700">{p.estimated_volume_m3} m³</td>
            <td className="px-6 py-4 font-mono font-bold text-amber-700">{p.severity}</td>
            <td className="px-6 py-4">
              <PotholeStatusBadge status={p.status} />
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} title="Log Pothole & Calculate Asphalt Volume">
        <form onSubmit={handleLogSubmit} className="space-y-4">
          <Select label="Severity Level" value={formData.severity} onChange={(e) => setFormData({ ...formData, severity: e.target.value })} options={[
            { value: 'LOW', label: 'Low Depth (<5 cm)' },
            { value: 'MEDIUM', label: 'Medium Depth (5-15 cm)' },
            { value: 'HIGH', label: 'High Depth (>15 cm)' },
            { value: 'CRITICAL', label: 'Critical Traffic Hazard' }
          ]} />
          <Input label="Length (meters)" type="number" step="0.1" value={formData.length_meters} onChange={(e) => setFormData({ ...formData, length_meters: e.target.value })} required />
          <Input label="Width (meters)" type="number" step="0.1" value={formData.width_meters} onChange={(e) => setFormData({ ...formData, width_meters: e.target.value })} required />
          <Input label="Depth (meters)" type="number" step="0.05" value={formData.depth_meters} onChange={(e) => setFormData({ ...formData, depth_meters: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsLogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Log Pothole</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
