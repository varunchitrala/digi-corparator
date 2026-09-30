import React, { useState } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { Input } from '../Input';
import { Select } from '../Select';
import { formatCurrency } from '../../utils/formatters';

export const PaymentModal = ({ isOpen, onClose, onSubmit, submitting }) => {
  const [grossAmount, setGrossAmount] = useState(150000);
  const [deductions, setDeductions] = useState(10000);
  const [paymentMode, setPaymentMode] = useState('BANK_TRANSFER');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ gross_amount: grossAmount, deductions, payment_mode: paymentMode });
  };

  const netAmount = Math.max(0, parseFloat(grossAmount || 0) - parseFloat(deductions || 0));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Process Contractor Payment & TDS Deductions">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <Input label="Gross Payment Amount (₹)" type="number" value={grossAmount} onChange={(e) => setGrossAmount(e.target.value)} required />
        <Input label="TDS / Security Deposit Deductions (₹)" type="number" value={deductions} onChange={(e) => setDeductions(e.target.value)} required />

        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center font-mono font-bold text-emerald-900">
          <span>Net Payable Amount:</span>
          <span className="text-base">{formatCurrency(netAmount)}</span>
        </div>

        <Select label="Payment Disbursement Mode" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} options={[
          { value: 'BANK_TRANSFER', label: 'Direct Bank Transfer (NEFT/RTGS)' },
          { value: 'CHEQUE', label: 'Municipal Treasury Cheque' },
          { value: 'MANUAL', label: 'Manual Vouchering' }
        ]} />

        <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="success" isLoading={submitting}>Disburse Payment</Button>
        </div>
      </form>
    </Modal>
  );
};
