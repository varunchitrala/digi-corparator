import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export const PublicTaxClearancePage = () => {
  const { certificateNumber } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (certificateNumber) fetchPublicCert();
  }, [certificateNumber]);

  const fetchPublicCert = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/public/clearance/${certificateNumber}`);
      setCert(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Tax clearance certificate not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-6 rounded-2xl border border-slate-200 shadow-xl space-y-5">
        <div className="text-center space-y-1 border-b border-slate-100 pb-4">
          <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-full mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Tax Clearance Certificate Verification</h2>
          <p className="text-xs text-slate-500">Official Municipal Revenue Verification Portal</p>
        </div>

        {loading && <div className="text-center text-xs text-slate-500 py-6">Verifying certificate authenticity...</div>}

        {error && (
          <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {cert && (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
              <span className="text-[10px] font-bold bg-emerald-200 px-2 py-0.5 rounded text-emerald-900">{cert.certificate_number}</span>
              <h3 className="text-base font-extrabold mt-1">{cert.owner_name}</h3>
              <p className="text-xs text-emerald-800">{cert.property_number}</p>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-3 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">Site Address:</span>
                <span className="font-bold text-slate-900">{cert.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Issue Date:</span>
                <span className="font-bold text-slate-900">{new Date(cert.issue_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Valid Until:</span>
                <span className="font-bold text-slate-900">{new Date(cert.valid_until).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-emerald-600">{cert.status}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
