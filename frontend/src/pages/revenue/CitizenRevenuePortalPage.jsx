import React, { useState } from 'react';
import api from '../../services/api';
import { Button } from '../../components/Button';
import { ShieldCheck, FileCheck, ArrowRight } from 'lucide-react';

export const CitizenRevenuePortalPage = () => {
  const [generating, setGenerating] = useState(false);

  const handleGenerateClearance = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/citizen/revenue/clearance/generate', {
        property_id: 'prop-001'
      });
      alert(`Tax Clearance Certificate Generated Successfully! Number: ${res.data.certificate_number}`);
    } catch (err) {
      alert(err.message || 'Tax clearance certificate generation failed');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
          CITIZEN REVENUE & TAX PORTAL
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Property & Water Tax Portal</h2>
        <p className="text-xs text-slate-500">Pay property and water taxes online, view payment receipts, and download QR-verified Tax Clearance Certificates.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <h3 className="font-bold text-slate-900 text-sm flex items-center">
          <FileCheck className="w-5 h-5 mr-2 text-blue-600" /> Apply For No-Dues Tax Clearance Certificate
        </h3>
        <p className="text-slate-500">Generate an official QR-verified Tax Clearance Certificate for property transfer, loan approval, or mutation (Requires ₹0 outstanding balance).</p>

        <Button variant="primary" onClick={handleGenerateClearance} isLoading={generating} className="bg-blue-600 hover:bg-blue-700">
          GENERATE TAX CLEARANCE CERTIFICATE <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
};
