import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { LoadingState } from '../../components/LoadingState';
import { Plus } from 'lucide-react';

export const CorpWasteRoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    route_name: 'Ward 24 Morning Sanitation Route',
    ward_id: 'w-demo-024',
    distance_km: 6.5
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/waste/routes');
      setRoutes(res.data);
    } catch (err) {
      console.error('Failed to fetch routes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/waste/routes', formData);
      alert(`Route Created Successfully! Code: ${res.data.route_number}`);
      setIsCreateOpen(false);
      fetchRoutes();
    } catch (err) {
      alert(err.message || 'Route creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Waste Collection Routes..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            COLLECTION ROUTES MASTER
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Sanitation & Collection Routes</h2>
          <p className="text-xs text-slate-500">Design collection routes, assign compactor vehicles (Phase 10) and drivers (Phase 11).</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsCreateOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-1.5" /> Create Route
        </Button>
      </div>

      <Table headers={['Route Code', 'Route Name', 'Ward', 'Distance', 'Assigned Vehicle', 'Status']}>
        {routes.map((r) => (
          <tr key={r.route_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-emerald-700 font-mono">{r.route_number}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{r.route_name}</td>
            <td className="px-6 py-4 text-slate-600">{r.ward_name || 'Ward 24'}</td>
            <td className="px-6 py-4 font-mono font-bold text-indigo-700">{r.distance_km} km</td>
            <td className="px-6 py-4 font-mono text-slate-600">Garbage Tipper (ast-001)</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {r.status}
              </span>
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Waste Collection Route">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input label="Route Name" value={formData.route_name} onChange={(e) => setFormData({ ...formData, route_name: e.target.value })} required />
          <Input label="Distance (km)" type="number" step="0.1" value={formData.distance_km} onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Create Route</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
