import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { CollectionStatusBadge } from '../../components/waste/CollectionStatusBadge';
import { Plus } from 'lucide-react';

export const CorpWasteCollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    household_id: 'hh-001',
    route_id: 'rt-001',
    waste_type: 'WET',
    actual_quantity_kg: 2.5
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/waste/collections');
      setCollections(res.data);
    } catch (err) {
      console.error('Failed to fetch collections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/waste/collections', formData);
      alert(`Collection Logged Successfully! Number: ${res.data.collection_number}`);
      setIsLogOpen(false);
      fetchCollections();
    } catch (err) {
      alert(err.message || 'Collection logging failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Daily Door-to-Door Collection Records..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            DOOR-TO-DOOR COLLECTION LOGS
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Daily Household Waste Collections</h2>
          <p className="text-xs text-slate-500">Log daily household collections, monitor missed collection alerts, and track wet/dry waste weights.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsLogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-1.5" /> Log Collection
        </Button>
      </div>

      <Table headers={['Collection Code', 'Household Code', 'Owner Name', 'Route', 'Waste Type', 'Quantity (kg)', 'Status']}>
        {collections.map((c) => (
          <tr key={c.collection_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-emerald-700 font-mono">{c.collection_number}</td>
            <td className="px-6 py-4 font-bold text-slate-900 font-mono">{c.household_number}</td>
            <td className="px-6 py-4 text-slate-600">{c.owner_name}</td>
            <td className="px-6 py-4 text-slate-600">{c.route_name}</td>
            <td className="px-6 py-4 font-mono font-bold text-indigo-700">{c.waste_type}</td>
            <td className="px-6 py-4 font-mono font-bold text-slate-900">{c.actual_quantity_kg} kg</td>
            <td className="px-6 py-4">
              <CollectionStatusBadge status={c.status} />
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} title="Log Household Collection">
        <form onSubmit={handleLogSubmit} className="space-y-4">
          <Select label="Waste Type" value={formData.waste_type} onChange={(e) => setFormData({ ...formData, waste_type: e.target.value })} options={[
            { value: 'WET', label: 'Wet / Organic Waste' },
            { value: 'DRY', label: 'Dry Waste' },
            { value: 'MIXED', label: 'Mixed Waste' },
            { value: 'RECYCLABLE', label: 'Recyclable Paper / Plastic' }
          ]} />
          <Input label="Actual Quantity (kg)" type="number" step="0.1" value={formData.actual_quantity_kg} onChange={(e) => setFormData({ ...formData, actual_quantity_kg: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsLogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Log Collection</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
