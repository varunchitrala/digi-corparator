import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { HygieneResultBadge } from '../../components/health/HygieneResultBadge';
import { Plus } from 'lucide-react';

export const CorpFoodInspectionsPage = () => {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    establishment_name: 'Rajesh Sweets & Restaurant Ward 24',
    ward_id: 'w-demo-024',
    hygiene_score: 88,
    result: 'COMPLIANT'
  });

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/health/inspections');
      setInspections(res.data);
    } catch (err) {
      console.error('Failed to fetch food inspections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/health/inspections', formData);
      alert(`Food Hygiene Inspection Logged Successfully! Code: ${res.data.inspection_number}`);
      setIsLogOpen(false);
      fetchInspections();
    } catch (err) {
      alert(err.message || 'Inspection logging failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Food Hygiene Inspections..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            FOOD HYGIENE INSPECTIONS
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Food Establishment Hygiene & Safety</h2>
          <p className="text-xs text-slate-500">Conduct food hygiene safety inspections, record cleanliness scores, and issue violation notices.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsLogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-1.5" /> Log Inspection
        </Button>
      </div>

      <Table headers={['Inspection No.', 'Establishment Name', 'Ward', 'Hygiene Score', 'Result', 'Status']}>
        {inspections.map((i) => (
          <tr key={i.inspection_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-emerald-700 font-mono">{i.inspection_number}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{i.establishment_name}</td>
            <td className="px-6 py-4 text-slate-600">{i.ward_name || 'Ward 24'}</td>
            <td className="px-6 py-4 font-mono font-bold text-indigo-700">{i.hygiene_score}/100</td>
            <td className="px-6 py-4">
              <HygieneResultBadge result={i.result} />
            </td>
            <td className="px-6 py-4 font-mono text-slate-600">{i.status}</td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} title="Log Food Hygiene Inspection">
        <form onSubmit={handleLogSubmit} className="space-y-4">
          <Input label="Establishment Name" value={formData.establishment_name} onChange={(e) => setFormData({ ...formData, establishment_name: e.target.value })} required />
          <Input label="Hygiene Score (0-100)" type="number" min="0" max="100" value={formData.hygiene_score} onChange={(e) => setFormData({ ...formData, hygiene_score: e.target.value })} required />
          <Select label="Inspection Result" value={formData.result} onChange={(e) => setFormData({ ...formData, result: e.target.value })} options={[
            { value: 'COMPLIANT', label: 'Compliant (Pass)' },
            { value: 'PARTIALLY_COMPLIANT', label: 'Partially Compliant (Minor Remarks)' },
            { value: 'NON_COMPLIANT', label: 'Non-Compliant (Notice Issued)' },
            { value: 'CRITICAL', label: 'Critical Health Hazard' }
          ]} />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsLogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Log Inspection</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
