import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { Plus, ArrowRightLeft, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const CorpFundsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAllocateOpen, setIsAllocateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    budget_head_id: 'bhead-001',
    ward_id: 'w-demo-024',
    allocated_amount: 1000000
  });

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/finance/budgets');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch funds:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAllocateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/corporation/finance/funds/allocate', formData);
      alert('Fund allocated successfully!');
      setIsAllocateOpen(false);
      fetchFunds();
    } catch (err) {
      alert(err.message || 'Fund allocation failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Fund Allocations..." />;

  const heads = data?.budget_heads || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            FUND ALLOCATIONS & RESERVATIONS
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Department & Ward Fund Allocations</h2>
          <p className="text-xs text-slate-500">Allocate municipal budget heads to departments, wards, and work projects.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsAllocateOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-1.5" /> Allocate Fund
        </Button>
      </div>

      {/* Table */}
      <Table headers={['Budget Head Code', 'Head Name', 'Allocated', 'Reserved', 'Committed', 'Utilized']}>
        {heads.map((h) => (
          <tr key={h.budget_head_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-blue-600">{h.budget_head_code}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{h.budget_head_name}</td>
            <td className="px-6 py-4 font-mono font-bold text-slate-900">{formatCurrency(h.total_allocated)}</td>
            <td className="px-6 py-4 font-mono text-amber-600">{formatCurrency(h.total_reserved)}</td>
            <td className="px-6 py-4 font-mono text-indigo-600">{formatCurrency(h.total_committed)}</td>
            <td className="px-6 py-4 font-mono text-emerald-700">{formatCurrency(h.total_utilized)}</td>
          </tr>
        ))}
      </Table>

      {/* Allocate Fund Modal */}
      <Modal isOpen={isAllocateOpen} onClose={() => setIsAllocateOpen(false)} title="Allocate Fund to Ward / Department">
        <form onSubmit={handleAllocateSubmit} className="space-y-4">
          <Select label="Budget Head" value={formData.budget_head_id} onChange={(e) => setFormData({ ...formData, budget_head_id: e.target.value })} options={[
            { value: 'bhead-001', label: 'BH-101: Road Infrastructure' },
            { value: 'bhead-002', label: 'BH-102: Storm Water Drainage' },
            { value: 'bhead-003', label: 'BH-103: Drinking Water Supply' }
          ]} />
          <Input label="Allocation Amount (₹)" type="number" value={formData.allocated_amount} onChange={(e) => setFormData({ ...formData, allocated_amount: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsAllocateOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Grant Allocation</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
