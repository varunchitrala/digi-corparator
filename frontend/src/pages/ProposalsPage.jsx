import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Table } from '../components/Table';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { LoadingState } from '../components/LoadingState';
import { formatCurrency } from '../utils/formatters';
import { Plus } from 'lucide-react';

export const ProposalsPage = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', estimated_budget: '' });

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const res = await api.get('/proposals');
      setProposals(res.data);
    } catch (err) {
      console.error('Failed to fetch proposals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProposal = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/proposals', formData);
      setIsModalOpen(false);
      fetchProposals();
    } catch (err) {
      alert(err.message || 'Failed to submit proposal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
            PROPOSALS & AGENDA PIPELINE
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Corporator Proposals</h2>
          <p className="text-xs text-slate-500">Submit and track sanctioning of new ward development initiatives.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> Submit New Proposal
        </Button>
      </div>

      {loading ? (
        <LoadingState message="Fetching proposals..." />
      ) : (
        <Table headers={['Proposal Code', 'Title', 'Description', 'Estimated Budget', 'Status']}>
          {proposals.map((p) => (
            <tr key={p.proposal_id} className="hover:bg-slate-50">
              <td className="px-6 py-4 font-bold text-blue-600 text-xs">{p.proposal_code}</td>
              <td className="px-6 py-4 font-bold text-slate-900 text-xs">{p.title}</td>
              <td className="px-6 py-4 text-xs text-slate-600 max-w-xs">{p.description}</td>
              <td className="px-6 py-4 font-bold text-slate-900 text-xs">{formatCurrency(p.estimated_budget)}</td>
              <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
            </tr>
          ))}
        </Table>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit New Corporator Proposal">
        <form onSubmit={handleCreateProposal} className="space-y-4">
          <Input label="Proposal Title" placeholder="e.g. New Open Gym in Sector 3 Garden" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          <Input label="Estimated Budget (₹)" type="number" placeholder="850000" value={formData.estimated_budget} onChange={(e) => setFormData({...formData, estimated_budget: e.target.value})} required />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Description & Rationale</label>
            <textarea rows={3} className="w-full rounded-lg border border-slate-300 p-3 text-sm" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Why is this work needed?" required />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Submit Proposal</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
