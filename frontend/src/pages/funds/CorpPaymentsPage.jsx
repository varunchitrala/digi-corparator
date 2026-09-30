import React, { useState } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { PaymentModal } from '../../components/funds/PaymentModal';
import { Plus, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const CorpPaymentsPage = () => {
  const [payments, setPayments] = useState([
    { id: 'pay-1', number: 'PAY-2026-992102', date: '2026-08-28', contractor: 'Apex Infrastructure Pvt Ltd', gross: 150000, deductions: 10000, net: 140000, mode: 'BANK_TRANSFER', status: 'PAID' }
  ]);

  const [isProcessOpen, setIsProcessOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleProcessSubmit = async ({ gross_amount, deductions, payment_mode }) => {
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/finance/payments', {
        gross_amount,
        deductions,
        payment_mode
      });
      alert(`Payment Processed Successfully! Number: ${res.data.payment_number} (Net Amount: ${formatCurrency(res.data.net_amount)})`);
      setIsProcessOpen(false);
    } catch (err) {
      alert(err.message || 'Payment processing failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            CONTRACTOR DISBURSEMENT WORKSPACE
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Contractor Payment Processing</h2>
          <p className="text-xs text-slate-500">Disburse contractor payments, process TDS deductions, and issue bank transfers.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsProcessOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-1.5" /> Disburse Payment
        </Button>
      </div>

      <Table headers={['Payment No', 'Disbursement Date', 'Contractor', 'Gross (₹)', 'Deductions (₹)', 'Net Paid (₹)', 'Status']}>
        {payments.map((p) => (
          <tr key={p.id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-blue-600">{p.number}</td>
            <td className="px-6 py-4 text-slate-500">{p.date}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{p.contractor}</td>
            <td className="px-6 py-4 font-mono text-slate-900">{formatCurrency(p.gross)}</td>
            <td className="px-6 py-4 font-mono text-rose-600">-{formatCurrency(p.deductions)}</td>
            <td className="px-6 py-4 font-mono font-bold text-emerald-700">{formatCurrency(p.net)}</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {p.status}
              </span>
            </td>
          </tr>
        ))}
      </Table>

      <PaymentModal
        isOpen={isProcessOpen}
        onClose={() => setIsProcessOpen(false)}
        onSubmit={handleProcessSubmit}
        submitting={submitting}
      />
    </div>
  );
};
