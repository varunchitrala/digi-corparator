import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { LoadingState } from '../../components/LoadingState';
import { RevenueStatusBadge } from '../../components/revenue/RevenueStatusBadge';
import { Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const CorpBillsPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    property_id: 'prop-001',
    financial_year: '2026-2027',
    base_amount: 12000
  });

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/revenue/bills');
      setBills(res.data);
    } catch (err) {
      console.error('Failed to fetch bills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/revenue/bills/generate', formData);
      alert(`Tax Bill Generated Successfully! Code: ${res.data.bill_number}`);
      setIsGenerateOpen(false);
      fetchBills();
    } catch (err) {
      alert(err.message || 'Bill generation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePay = async (billId) => {
    try {
      const res = await api.post(`/corporation/revenue/bills/${billId}/pay`);
      alert(`Payment Successful! Receipt Number: ${res.data.receipt_number}`);
      fetchBills();
    } catch (err) {
      alert(err.message || 'Payment failed');
    }
  };

  if (loading) return <LoadingState message="Fetching Tax Demand Bills..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            TAX DEMAND & BILLING REGISTER
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Property Tax Bills Directory</h2>
          <p className="text-xs text-slate-500">Generate property tax demand bills, process online/counter payments, and view ledger balances.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsGenerateOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-1.5" /> Generate Tax Bill
        </Button>
      </div>

      <Table headers={['Bill Number', 'Property Number', 'Owner Name', 'Billing Period', 'Total Bill', 'Outstanding', 'Status', 'Actions']}>
        {bills.map((b) => (
          <tr key={b.bill_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-blue-600 font-mono">{b.bill_number}</td>
            <td className="px-6 py-4 font-bold text-slate-900 font-mono">{b.property_number}</td>
            <td className="px-6 py-4 text-slate-600">{b.owner_name}</td>
            <td className="px-6 py-4 font-mono text-slate-500">{b.billing_period}</td>
            <td className="px-6 py-4 font-mono font-bold text-emerald-700">{formatCurrency(b.total_amount)}</td>
            <td className="px-6 py-4 font-mono font-bold text-rose-700">{formatCurrency(b.outstanding_amount)}</td>
            <td className="px-6 py-4">
              <RevenueStatusBadge status={b.status} />
            </td>
            <td className="px-6 py-4">
              {b.status !== 'PAID' && (
                <Button variant="success" size="xs" onClick={() => handlePay(b.bill_id)} className="bg-emerald-600 hover:bg-emerald-700">
                  Process Payment
                </Button>
              )}
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isGenerateOpen} onClose={() => setIsGenerateOpen(false)} title="Generate Tax Demand Bill">
        <form onSubmit={handleGenerateSubmit} className="space-y-4">
          <Input label="Financial Year" value={formData.financial_year} onChange={(e) => setFormData({ ...formData, financial_year: e.target.value })} required />
          <Input label="Base Tax Demand (₹)" type="number" value={formData.base_amount} onChange={(e) => setFormData({ ...formData, base_amount: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsGenerateOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Generate Bill</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
