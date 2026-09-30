import React, { useState } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Plus, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const CorpExpenditurePage = () => {
  const [expenditures, setExpenditures] = useState([
    { id: 'exp-1', number: 'EXP-2026-881920', date: '2026-08-28', head: 'Road Infrastructure', amount: 150000, status: 'POSTED' },
    { id: 'exp-2', number: 'EXP-2026-102948', date: '2026-08-20', head: 'Water Supply', amount: 85000, status: 'POSTED' }
  ]);

  const [isPostOpen, setIsPostOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    amount: 100000,
    description: 'Expenditure posting for road maintenance'
  });

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/finance/expenditure', formData);
      alert(`Expenditure Posted! Number: ${res.data.expenditure_number}`);
      setIsPostOpen(false);
    } catch (err) {
      alert(err.message || 'Posting failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            EXPENDITURE POSTING LEDGER
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Municipal Expenditure Directory</h2>
          <p className="text-xs text-slate-500">Record and post verified expenditures to budget heads and double-side financial ledger.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsPostOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-1.5" /> Post New Expenditure
        </Button>
      </div>

      <Table headers={['Expenditure No', 'Posting Date', 'Budget Head', 'Amount (₹)', 'Status']}>
        {expenditures.map((e) => (
          <tr key={e.id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-blue-600">{e.number}</td>
            <td className="px-6 py-4 text-slate-500">{e.date}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{e.head}</td>
            <td className="px-6 py-4 font-mono font-bold text-emerald-700">{formatCurrency(e.amount)}</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {e.status}
              </span>
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isPostOpen} onClose={() => setIsPostOpen(false)} title="Post New Municipal Expenditure">
        <form onSubmit={handlePostSubmit} className="space-y-4">
          <Input label="Expenditure Amount (₹)" type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
          <Input label="Expenditure Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsPostOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Post Expenditure</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
