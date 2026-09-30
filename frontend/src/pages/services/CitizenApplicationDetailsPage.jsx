import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { LoadingState } from '../../components/LoadingState';
import { ApplicationStatusBadge } from '../../components/services/ApplicationStatusBadge';
import { Button } from '../../components/Button';
import { FileCheck, Download, Clock, ShieldCheck } from 'lucide-react';

export const CitizenApplicationDetailsPage = () => {
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
      const res = await api.get(`/citizen/applications/${id}`);
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch application details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Application Telemetry & Certificate..." />;

  const app = data?.application || {};
  const cert = data?.certificate;
  const history = data?.history || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-bold font-mono text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
              APP NO: {app.application_number}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">{app.service_name}</h2>
            <p className="text-xs text-slate-500 mt-1">Submitted on {new Date(app.submitted_at).toLocaleString()}</p>
          </div>
          <ApplicationStatusBadge status={app.status} />
        </div>

        {/* Certificate Download Banner */}
        {cert && (
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
              <div>
                <h4 className="text-sm font-bold text-emerald-900">Official Municipal Certificate Issued</h4>
                <p className="text-xs text-emerald-700 font-mono">Certificate No: {cert.certificate_number}</p>
              </div>
            </div>
            <Button variant="success" size="sm" onClick={() => navigate(`/verify/certificate/${cert.certificate_number}`)} className="bg-emerald-600 hover:bg-emerald-700">
              <Download className="w-4 h-4 mr-1.5" /> View / Download Certificate
            </Button>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-600" /> Application Progress Timeline
        </h3>
        <div className="space-y-3 border-l-2 border-slate-200 ml-3 pl-4 text-xs">
          {history.map((h) => (
            <div key={h.history_id} className="relative">
              <div className="absolute -left-[23px] top-0 w-3 h-3 rounded-full bg-blue-600 border-2 border-white" />
              <div className="font-bold text-slate-900">{h.action.replace(/_/g, ' ')}</div>
              <div className="text-slate-500 text-[11px]">{new Date(h.created_at).toLocaleString()}</div>
              {h.remarks && <div className="text-slate-600 mt-0.5">{h.remarks}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
