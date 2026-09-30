import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { TenderStatusBadge } from '../../components/procurement/TenderStatusBadge';
import { Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const CorpTendersPage = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: 'Road Concreting Work Ward 24',
    department_id: 'dept-001',
    ward_id: 'w-demo-024',
    estimated_value: 1200000,
    emd_amount: 24000,
    tender_fee: 2000,
    description: 'Tender for 2km Asphalt Concreting Work Ward 24'
  });

  useEffect(() => {
    fetchTenders();
  }, []);

  const fetchTenders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/procurement/tenders');
      setTenders(res.data);
    } catch (err) {
      console.error('Failed to fetch tenders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/procurement/tenders', formData);
      alert(`Tender Published Successfully! Code: ${res.data.tender_number}`);
      setIsPublishOpen(false);
      fetchTenders();
    } catch (err) {
      alert(err.message || 'Publication failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Tenders Master Register..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            TENDERS MASTER REGISTER
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Municipal Tenders Directory</h2>
          <p className="text-xs text-slate-500">Publish tenders, track bid submissions, BOQ estimates, and technical evaluation stages.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsPublishOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-1.5" /> Publish New Tender
        </Button>
      </div>

      <Table headers={['Tender Number', 'Tender Title', 'Department', 'Estimated Value', 'EMD Amount', 'Submission Deadline', 'Status']}>
        {tenders.map((t) => (
          <tr key={t.tender_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-blue-600 font-mono">{t.tender_number}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{t.title}</td>
            <td className="px-6 py-4 text-slate-600">{t.department_name || 'Water Department'}</td>
            <td className="px-6 py-4 font-mono font-bold text-emerald-700">{formatCurrency(t.estimated_value)}</td>
            <td className="px-6 py-4 font-mono text-slate-700">{formatCurrency(t.emd_amount)}</td>
            <td className="px-6 py-4 text-slate-500">{new Date(t.submission_end).toLocaleDateString()}</td>
            <td className="px-6 py-4">
              <TenderStatusBadge status={t.status} />
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isPublishOpen} onClose={() => setIsPublishOpen(false)} title="Publish Municipal Tender">
        <form onSubmit={handlePublishSubmit} className="space-y-4">
          <Input label="Tender Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Estimated Value (₹)" type="number" value={formData.estimated_value} onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })} required />
            <Input label="EMD Amount (₹)" type="number" value={formData.emd_amount} onChange={(e) => setFormData({ ...formData, emd_amount: e.target.value })} required />
          </div>
          <Input label="Tender Document Fee (₹)" type="number" value={formData.tender_fee} onChange={(e) => setFormData({ ...formData, tender_fee: e.target.value })} required />
          <Input label="Tender Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsPublishOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Publish Tender</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
