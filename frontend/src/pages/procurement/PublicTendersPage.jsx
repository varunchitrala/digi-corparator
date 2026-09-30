import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { TenderStatusBadge } from '../../components/procurement/TenderStatusBadge';
import { formatCurrency } from '../../utils/formatters';

export const PublicTendersPage = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicTenders();
  }, []);

  const fetchPublicTenders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/public/tenders');
      setTenders(res.data.data);
    } catch (err) {
      console.error('Failed to fetch public tenders:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
            PUBLIC PROCUREMENT & TRANSPARENCY PORTAL
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">Municipal Tenders & Awarded Contracts</h1>
          <p className="text-xs text-slate-500">Public repository of published municipal tenders, eligibility criteria, NIT documents, and awarded contracts.</p>
        </div>

        {loading ? (
          <div className="text-center text-xs text-slate-500 py-12">Fetching public tenders repository...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {tenders.map((t) => (
              <div key={t.tender_id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{t.tender_number}</span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{t.title}</h3>
                    <p className="text-xs text-slate-500">{t.corporation_name} • {t.department_name}</p>
                  </div>
                  <TenderStatusBadge status={t.status} />
                </div>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">{t.description}</p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono pt-2 border-t border-slate-100 gap-2">
                  <span className="text-emerald-700 font-bold">Estimated Value: {formatCurrency(t.estimated_value)}</span>
                  <span className="text-slate-500">Submission Deadline: {new Date(t.submission_end).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
