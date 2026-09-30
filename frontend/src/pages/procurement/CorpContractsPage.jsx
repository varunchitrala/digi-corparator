import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { LoadingState } from '../../components/LoadingState';
import { Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const CorpContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    tender_id: 'tndr-001',
    vendor_id: 'ven-001',
    department_id: 'dept-001',
    ward_id: 'w-demo-024',
    contract_value: 1150000,
    work_order_id: 'wo-001'
  });

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/procurement/contracts');
      setContracts(res.data);
    } catch (err) {
      console.error('Failed to fetch contracts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/procurement/contracts', formData);
      alert(`Contract Created & Linked to Work Order! Code: ${res.data.contract_number}`);
      setIsCreateOpen(false);
      fetchContracts();
    } catch (err) {
      alert(err.message || 'Contract creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Municipal Contracts Master..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            MUNICIPAL CONTRACTS DIRECTORY
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Contracts & Awarded Works Master</h2>
          <p className="text-xs text-slate-500">Manage awarded municipal contracts, retention percentages, Phase 7 Work Orders, and Phase 8 payments.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-1.5" /> Award New Contract
        </Button>
      </div>

      <Table headers={['Contract Number', 'Vendor Name', 'Tender Title', 'Contract Value', 'Retention %', 'Work Order Link', 'Status']}>
        {contracts.map((c) => (
          <tr key={c.contract_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-blue-600 font-mono">{c.contract_number}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{c.vendor_name}</td>
            <td className="px-6 py-4 text-slate-600">{c.tender_title}</td>
            <td className="px-6 py-4 font-mono font-bold text-emerald-700">{formatCurrency(c.contract_value)}</td>
            <td className="px-6 py-4 font-mono text-indigo-700">{c.retention_percentage}%</td>
            <td className="px-6 py-4 font-mono font-bold text-blue-800">{c.work_order_id || 'WO-2026-314274'}</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {c.status}
              </span>
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Award Municipal Contract">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input label="Contract Value (₹)" type="number" value={formData.contract_value} onChange={(e) => setFormData({ ...formData, contract_value: e.target.value })} required />
          <Input label="Linked Work Order ID" value={formData.work_order_id} onChange={(e) => setFormData({ ...formData, work_order_id: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Award Contract</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
