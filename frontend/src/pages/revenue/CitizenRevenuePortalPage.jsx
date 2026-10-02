import React, { useState } from 'react';
import api from '../../services/api';
import {
  Receipt,
  FileCheck,
  CreditCard,
  Droplets,
  Building,
  CheckCircle2,
  Clock,
  Download,
  Printer,
  ShieldCheck,
  AlertCircle,
  QrCode,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';

export const CitizenRevenuePortalPage = () => {
  const [bills, setBills] = useState([
    {
      id: 'bill-prop-001',
      bill_type: 'PROPERTY_TAX',
      bill_number: 'BILL-2026-904122',
      property_id: 'PROP-2026-4402',
      title: 'Residential Property Tax (FY 2026-27)',
      billing_period: 'FY 2026 - 2027',
      address: 'Plot 42, Lane 4, Shivaji Nagar, Ward 24',
      base_amount: 12000,
      rebate_amount: 600,
      total_amount: 11400,
      due_date: '2026-11-30',
      status: 'UNPAID',
      breakdown: [
        { label: 'General Property Tax', amount: 7200 },
        { label: 'Conservancy & Solid Waste Cess', amount: 1500 },
        { label: 'Fire Service Protection Tax', amount: 1200 },
        { label: 'City Tree & Education Cess', amount: 1500 },
        { label: 'Early Bird 5% Rebate (Before Oct 31)', amount: -600 },
      ]
    },
    {
      id: 'bill-wtr-001',
      bill_type: 'WATER_CHARGES',
      bill_number: 'BILL-2026-110943',
      consumer_number: 'WTR-24-0091',
      meter_number: 'MTR-9941',
      title: 'Quarterly Potable Water Consumption',
      billing_period: 'Jul - Sep 2026 (Q2)',
      address: 'Plot 42, Lane 4, Shivaji Nagar, Ward 24',
      base_amount: 850,
      rebate_amount: 0,
      total_amount: 850,
      due_date: '2026-10-20',
      status: 'UNPAID',
      breakdown: [
        { label: 'Metered Water Charges (42 KL)', amount: 650 },
        { label: 'Sewerage Maintenance Charge', amount: 150 },
        { label: 'Meter Service Fee', amount: 50 },
      ]
    }
  ]);

  const [paymentHistory, setPaymentHistory] = useState([
    {
      receipt_number: 'REC-2025-881203',
      date: '2025-10-14',
      bill_type: 'Property Tax (FY 2025-26)',
      amount: 10800,
      method: 'UPI (Google Pay)',
      status: 'SUCCESS'
    },
    {
      receipt_number: 'REC-2026-104921',
      date: '2026-06-22',
      bill_type: 'Water Charges (Q1 Apr-Jun)',
      amount: 820,
      method: 'Net Banking (SBI)',
      status: 'SUCCESS'
    }
  ]);

  const [selectedBillForPay, setSelectedBillForPay] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('vijay.shinde@okhdfcbank');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const [generatingClearance, setGeneratingClearance] = useState(false);
  const [clearanceCert, setClearanceCert] = useState(null);
  const [clearanceError, setClearanceError] = useState('');

  const totalOutstanding = bills
    .filter((b) => b.status === 'UNPAID')
    .reduce((sum, b) => sum + b.total_amount, 0);

  const handleOpenPayModal = (bill) => {
    setSelectedBillForPay(bill);
    setClearanceError('');
  };

  const handleProcessPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      const paidBill = selectedBillForPay;

      // Update Bill Status
      setBills((prev) =>
        prev.map((b) =>
          b.id === paidBill.id ? { ...b, status: 'PAID' } : b
        )
      );

      // Create Receipt
      const receiptNum = `REC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const newReceipt = {
        receipt_number: receiptNum,
        bill_number: paidBill.bill_number,
        title: paidBill.title,
        property_id: paidBill.property_id || paidBill.consumer_number,
        payer_name: 'Vijay Shinde',
        address: paidBill.address,
        amount: paidBill.total_amount,
        breakdown: paidBill.breakdown,
        payment_method: paymentMethod,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        transaction_id: `TXN-MUNICIPAL-${Date.now().toString().slice(-8)}`
      };

      // Add to History
      setPaymentHistory((prev) => [
        {
          receipt_number: receiptNum,
          date: new Date().toISOString().split('T')[0],
          bill_type: paidBill.title,
          amount: paidBill.total_amount,
          method: paymentMethod,
          status: 'SUCCESS'
        },
        ...prev
      ]);

      setSelectedBillForPay(null);
      setActiveReceipt(newReceipt);
      setIsReceiptModalOpen(true);
    }, 1200);
  };

  const handleGenerateClearance = async () => {
    setGeneratingClearance(true);
    setClearanceError('');
    try {
      if (totalOutstanding > 0) {
        throw new Error(
          `Unpaid Dues Guard: Tax clearance certificate blocked due to outstanding balance of ₹${totalOutstanding.toLocaleString('en-IN')}. Please pay all pending property and water bills first.`
        );
      }

      // If backend is running, try api endpoint, or fallback to full certificate
      let certData;
      try {
        const res = await api.post('/citizen/revenue/clearance/generate', {
          property_id: 'prop-001'
        });
        certData = res.data;
      } catch (err) {
        certData = {
          certificate_number: `TCC-2026-${Math.floor(100000 + Math.random() * 900000)}`,
          issue_date: new Date().toISOString(),
          valid_until: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString()
        };
      }

      setClearanceCert(certData);
    } catch (err) {
      setClearanceError(err.message || 'Tax clearance certificate generation failed');
    } finally {
      setGeneratingClearance(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <Receipt className="w-3.5 h-3.5" />
            <span>MUNICIPAL REVENUE & TAX SERVICES</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-1.5">
            Property & Water Tax Billing Portal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Assess annual property taxes, water meter charges, pay instantly via UPI/NetBanking, and download QR-verified Tax Clearance (No-Dues) Certificates.
          </p>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-right shrink-0">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Outstanding Balance
          </span>
          <span
            className={`text-xl font-black ${
              totalOutstanding === 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Bill Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bills.map((bill) => (
          <div
            key={bill.id}
            className={`bg-white rounded-xl border transition-all p-5 space-y-4 shadow-xs ${
              bill.status === 'PAID'
                ? 'border-emerald-200 bg-emerald-50/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {bill.bill_number}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      bill.status === 'PAID'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {bill.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 flex items-center">
                  {bill.bill_type === 'PROPERTY_TAX' ? (
                    <Building className="w-4 h-4 mr-1.5 text-blue-600 shrink-0" />
                  ) : (
                    <Droplets className="w-4 h-4 mr-1.5 text-cyan-600 shrink-0" />
                  )}
                  {bill.title}
                </h3>
                <p className="text-xs text-slate-500">{bill.address}</p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 font-semibold block">Total Amount</span>
                <span className="text-lg font-black text-slate-900">
                  ₹{bill.total_amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Bill Breakdown Items */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Assessment Itemization
              </span>
              {bill.breakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between text-slate-600">
                  <span className={item.amount < 0 ? 'text-emerald-600 font-semibold' : ''}>
                    {item.label}
                  </span>
                  <span className={`font-mono font-medium ${item.amount < 0 ? 'text-emerald-600 font-bold' : ''}`}>
                    {item.amount < 0 ? `- ₹${Math.abs(item.amount)}` : `₹${item.amount.toLocaleString('en-IN')}`}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Due: {bill.due_date}
              </span>

              {bill.status === 'UNPAID' ? (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleOpenPayModal(bill)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                  Pay ₹{bill.total_amount.toLocaleString('en-IN')} Now
                </Button>
              ) : (
                <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                  Paid & Reconciled
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tax Clearance Certificate Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              OFFICIAL CERTIFICATE
            </span>
            <h3 className="font-black text-slate-900 text-base flex items-center mt-1">
              <FileCheck className="w-5 h-5 mr-2 text-blue-600" />
              Apply for No-Dues Tax Clearance Certificate (TCC)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Obtain an instant QR-code stamped certificate verifying zero outstanding municipal dues on your property for banking, loans, or ownership mutation.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={handleGenerateClearance}
            isLoading={generatingClearance}
            className="bg-blue-600 hover:bg-blue-700 font-bold shrink-0 text-xs py-2.5"
          >
            <ShieldCheck className="w-4 h-4 mr-1.5" />
            Generate Clearance Certificate
          </Button>
        </div>

        {clearanceError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{clearanceError}</span>
          </div>
        )}

        {clearanceCert && (
          <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-300 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <h4 className="font-black text-slate-900 text-sm">
                    Tax Clearance Certificate Issued Successfully!
                  </h4>
                  <p className="text-xs text-emerald-800 font-mono font-bold">
                    Certificate No: {clearanceCert.certificate_number}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold bg-emerald-600 text-white px-2.5 py-1 rounded">
                STATUS: VALID
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-emerald-200 text-slate-700">
              <div>
                <span className="text-slate-500 block">Property ID:</span>
                <span className="font-mono font-bold">PROP-2026-4402</span>
              </div>
              <div>
                <span className="text-slate-500 block">Issue Date:</span>
                <span className="font-semibold">{new Date(clearanceCert.issue_date).toLocaleDateString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Valid Until:</span>
                <span className="font-semibold">{new Date(clearanceCert.valid_until).toLocaleDateString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => alert(`Downloading Certificate ${clearanceCert.certificate_number} PDF...`)}
                className="bg-white border-emerald-300 text-emerald-800 font-bold text-xs"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" /> Download Stamped PDF
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Payment History Register */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <h3 className="font-black text-slate-900 text-sm flex items-center">
          <Clock className="w-4 h-4 mr-2 text-slate-500" />
          Past Payment History & Official E-Receipts
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3 font-bold">Receipt ID</th>
                <th className="px-4 py-3 font-bold">Tax / Service</th>
                <th className="px-4 py-3 font-bold">Date</th>
                <th className="px-4 py-3 font-bold">Payment Mode</th>
                <th className="px-4 py-3 font-bold">Amount Paid</th>
                <th className="px-4 py-3 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paymentHistory.map((rec, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-mono font-bold text-blue-600">{rec.receipt_number}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{rec.bill_type}</td>
                  <td className="px-4 py-3 text-slate-500">{rec.date}</td>
                  <td className="px-4 py-3 text-slate-600">{rec.method}</td>
                  <td className="px-4 py-3 font-black text-slate-900">₹{rec.amount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => alert(`Downloading Official Municipal Receipt ${rec.receipt_number}...`)}
                      className="text-blue-600 hover:text-blue-800 font-bold flex items-center"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" /> PDF Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedBillForPay && (
        <Modal
          isOpen={!!selectedBillForPay}
          onClose={() => setSelectedBillForPay(null)}
          title={`Pay ${selectedBillForPay.title}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">{selectedBillForPay.bill_number}</p>
                <p className="text-[11px] text-slate-500">{selectedBillForPay.billing_period}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase">Net Payable</span>
                <span className="text-lg font-black text-emerald-600">
                  ₹{selectedBillForPay.total_amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: Smartphone },
                  { id: 'NETBANKING', label: 'Net Banking', icon: Building },
                  { id: 'CARD', label: 'Debit / Credit', icon: CreditCard }
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-2.5 rounded-lg border flex flex-col items-center justify-center space-y-1 text-center font-bold transition-all ${
                        paymentMethod === m.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px]">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {paymentMethod === 'UPI' && (
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Enter UPI ID / VPA</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. resident@okaxis"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
                <p className="text-[11px] text-slate-400">Supported: Google Pay, PhonePe, Paytm, BHIM</p>
              </div>
            )}

            {paymentMethod === 'NETBANKING' && (
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Select Bank</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg">
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Bank of Maharashtra</option>
                </select>
              </div>
            )}

            {paymentMethod === 'CARD' && (
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Card Number</label>
                <input
                  type="text"
                  placeholder="4532 •••• •••• 8912"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  defaultValue="4532 9012 3456 8912"
                />
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedBillForPay(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleProcessPayment}
                isLoading={isProcessingPayment}
                className="bg-emerald-600 hover:bg-emerald-700 font-bold"
              >
                Confirm Payment of ₹{selectedBillForPay.total_amount.toLocaleString('en-IN')}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Official Receipt Modal */}
      {isReceiptModalOpen && activeReceipt && (
        <Modal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          title="Official Municipal Tax E-Receipt"
        >
          <div className="space-y-4 text-xs">
            {/* Header with Municipal Branding */}
            <div className="text-center pb-3 border-b border-slate-200">
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                PAYMENT CONFIRMED &bull; DIGITAL ACKNOWLEDGEMENT
              </span>
              <h3 className="font-black text-slate-900 text-sm mt-1">
                Chhatrapati Sambhajinagar Municipal Corporation
              </h3>
              <p className="text-[11px] text-slate-500">Town Hall, Municipal Revenue Department, Ward 24</p>
            </div>

            {/* Receipt Summary Grid */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px]">Receipt Number</span>
                <span className="font-mono font-bold text-slate-900">{activeReceipt.receipt_number}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Transaction ID</span>
                <span className="font-mono font-semibold text-slate-700">{activeReceipt.transaction_id}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Payment Date & Time</span>
                <span className="font-medium text-slate-800">{activeReceipt.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Payment Method</span>
                <span className="font-bold text-emerald-700">{activeReceipt.payment_method}</span>
              </div>
            </div>

            {/* Payer Information */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Payer Name:</span>
                <span className="font-bold text-slate-900">{activeReceipt.payer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Property / Connection ID:</span>
                <span className="font-mono font-bold text-slate-900">{activeReceipt.property_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Address:</span>
                <span className="font-medium text-slate-700 truncate max-w-xs">{activeReceipt.address}</span>
              </div>
            </div>

            {/* Total Paid Badge */}
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex justify-between items-center">
              <span className="font-black text-emerald-900">Total Amount Paid:</span>
              <span className="text-base font-black text-emerald-700">
                ₹{activeReceipt.amount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-slate-100">
              <span className="text-[10px] text-slate-400">
                Digitally Generated & Verified via Municipal Payment Gateway
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert(`Receipt ${activeReceipt.receipt_number} printed / saved!`);
                  setIsReceiptModalOpen(false);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 font-bold"
              >
                <Printer className="w-3.5 h-3.5 mr-1.5" /> Print / Save PDF
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
