import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { Plus } from 'lucide-react';

export const CorpWasteWeighmentPage = () => {
  const [weighments, setWeighments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    vehicle_id: 'ast-001',
    gross_weight_kg: 10000,
    tare_weight_kg: 4000,
    waste_type: 'MIXED'
  });

  useEffect(() => {
    fetchWeighments();
  }, []);

  const fetchWeighments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/waste/weighment');
      setWeighments(res.data);
    } catch (err) {
      console.error('Failed to fetch weighments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/waste/weighment', formData);
      alert(`Weighment Recorded Successfully! Net Weight: ${res.data.net_weight} kg, Code: ${res.data.weighment_number}`);
      setIsRecordOpen(false);
      fetchWeighments();
    } catch (err) {
      alert(err.message || 'Weighment recording failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Weighbridge Weighment Records..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            WEIGHBRIDGE WEIGHMENT REGISTER
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Vehicle Net Tonnage Weighment</h2>
          <p className="text-xs text-slate-500">Record gross & tare weights for collection vehicles at transfer stations and processing facilities.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsRecordOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-1.5" /> Record Weighment
        </Button>
      </div>

      <Table headers={['Weighment Code', 'Vehicle ID', 'Gross Weight', 'Tare Weight', 'Net Weight', 'Waste Type', 'Date']}>
        {weighments.map((w) => (
          <tr key={w.weighment_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-emerald-700 font-mono">{w.weighment_number}</td>
            <td className="px-6 py-4 font-mono text-slate-600">{w.vehicle_id}</td>
            <td className="px-6 py-4 font-mono">{w.gross_weight_kg} kg</td>
            <td className="px-6 py-4 font-mono text-slate-500">{w.tare_weight_kg} kg</td>
            <td className="px-6 py-4 font-mono font-bold text-emerald-700">{w.net_weight_kg} kg</td>
            <td className="px-6 py-4 font-mono">{w.waste_type}</td>
            <td className="px-6 py-4 text-slate-600">{new Date(w.weighment_date).toLocaleDateString()}</td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isRecordOpen} onClose={() => setIsRecordOpen(false)} title="Record Weighbridge Weighment">
        <form onSubmit={handleRecordSubmit} className="space-y-4">
          <Input label="Gross Weight (kg)" type="number" value={formData.gross_weight_kg} onChange={(e) => setFormData({ ...formData, gross_weight_kg: e.target.value })} required />
          <Input label="Tare Weight (kg)" type="number" value={formData.tare_weight_kg} onChange={(e) => setFormData({ ...formData, tare_weight_kg: e.target.value })} required />
          <Select label="Waste Type" value={formData.waste_type} onChange={(e) => setFormData({ ...formData, waste_type: e.target.value })} options={[
            { value: 'MIXED', label: 'Mixed Municipal Waste' },
            { value: 'WET', label: 'Wet Organic Waste' },
            { value: 'DRY', label: 'Dry Inorganic Waste' },
            { value: 'RECYCLABLE', label: 'Recyclable Plastic / Paper' }
          ]} />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsRecordOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Record Net Weight</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
