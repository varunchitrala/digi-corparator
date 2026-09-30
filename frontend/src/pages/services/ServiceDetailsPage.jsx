import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { LoadingState } from '../../components/LoadingState';
import { Button } from '../../components/Button';
import { Clock, DollarSign, FileCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const ServiceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/citizen/services/${id}`);
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch service details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Service Guidelines & Dynamic Schema..." />;

  const s = data?.service || {};
  const docs = data?.documents || [];
  const fields = data?.fields || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
              SERVICE CODE: {s.service_code}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">{s.service_name}</h2>
            <p className="text-xs text-slate-500 mt-1">{s.description || 'Municipal service guidelines and required documentation list.'}</p>
          </div>
          <Button variant="primary" onClick={() => navigate(`/citizen/services/${id}/apply`)} className="bg-blue-600 hover:bg-blue-700">
            APPLY NOW <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono">
          <div>
            <span className="text-slate-400 block">Processing Time</span>
            <span className="font-bold text-slate-800">{s.processing_days} Working Days</span>
          </div>
          <div>
            <span className="text-slate-400 block">Application Fee</span>
            <span className="font-bold text-emerald-700">{s.fee_required ? formatCurrency(s.fee_amount) : 'Free'}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Field Inspection</span>
            <span className="font-bold text-indigo-700">{s.inspection_required ? 'Mandatory' : 'Not Required'}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center">
          <FileCheck className="w-5 h-5 mr-2 text-blue-600" /> Mandatory Documents Required
        </h3>
        <ul className="space-y-2 text-xs">
          {docs.length === 0 ? (
            <li className="text-slate-500 italic">No specific documents configured. Identity proof recommended.</li>
          ) : (
            docs.map((d) => (
              <li key={d.service_doc_id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800">{d.document_name}</span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200">MANDATORY</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};
