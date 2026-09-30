import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { LoadingState } from '../../components/LoadingState';
import { Button } from '../../components/Button';
import { FileText, Clock, DollarSign, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const CitizenServicesCatalogPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const res = await api.get('/citizen/services');
      setServices(res.data);
    } catch (err) {
      console.error('Failed to fetch service catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Online Citizen Municipal Services Catalog..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
          MUNICIPAL CITIZEN PORTAL
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Online Municipal Services Directory</h2>
        <p className="text-xs text-slate-500">Apply online for certificates, utility connections, trade licenses, and building permissions.</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s) => (
          <div key={s.service_id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 uppercase">
                  {s.category_name}
                </span>
                <span className="text-xs font-mono font-bold text-blue-600">{s.service_code}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">{s.service_name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-4">{s.description || 'Apply for municipal sanction and certificate issuance online.'}</p>

              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3 mb-4 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Processing Time:</span>
                  <span className="font-bold text-slate-800">{s.processing_days} Working Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Service Fee:</span>
                  <span className="font-bold text-emerald-700">{s.fee_required ? formatCurrency(s.fee_amount) : 'Free'}</span>
                </div>
              </div>
            </div>

            <Button variant="primary" size="sm" onClick={() => navigate(`/citizen/services/${s.service_id}`)} className="w-full bg-blue-600 hover:bg-blue-700">
              Apply Online <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
