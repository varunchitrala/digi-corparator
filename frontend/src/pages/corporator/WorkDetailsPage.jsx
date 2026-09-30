import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { LoadingState } from '../../components/LoadingState';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { formatCurrency } from '../../utils/formatters';
import { ArrowLeft, HardHat, CheckCircle2, Image as ImageIcon } from 'lucide-react';

export const WorkDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/corporator/works/${id}`);
      setWork(res.data);
    } catch (err) {
      console.error('Failed to fetch work details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching development work details & milestones..." />;
  if (!work) return <div className="p-6 bg-white rounded-xl">Work not found</div>;

  const milestoneSteps = ['Proposal', 'Approval', 'Work Order', 'Work Start', 'Milestone 1', 'Milestone 2', 'Inspection', 'Completion'];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button variant="ghost" size="sm" onClick={() => navigate('/corporator/works')}>
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Development Works
      </Button>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                {work.work_code}
              </span>
              <span className="text-xs text-slate-500 font-semibold">{work.department_name}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-2">{work.work_title}</h2>
          </div>
          <StatusBadge status={work.status} />
        </div>

        {/* Physical & Financial Progress Bars */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <div className="flex justify-between text-xs font-bold text-indigo-900 mb-1">
              <span>Physical Progress</span>
              <span>{work.physical_progress}%</span>
            </div>
            <div className="w-full bg-indigo-200 rounded-full h-3 overflow-hidden">
              <div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${work.physical_progress}%` }} />
            </div>
          </div>

          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <div className="flex justify-between text-xs font-bold text-emerald-900 mb-1">
              <span>Financial Progress</span>
              <span>{work.financial_progress}%</span>
            </div>
            <div className="w-full bg-emerald-200 rounded-full h-3 overflow-hidden">
              <div className="bg-emerald-600 h-3 rounded-full" style={{ width: `${work.financial_progress}%` }} />
            </div>
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3">Work Execution Milestone Timeline</h4>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {milestoneSteps.map((m, idx) => (
              <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold mx-auto flex items-center justify-center">
                  {idx + 1}
                </div>
                <span className="text-[9px] font-bold text-slate-700 mt-1 block truncate">{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial & Contractor Details */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <p><strong>Estimated Cost:</strong> {formatCurrency(work.estimated_cost)}</p>
            <p><strong>Approved Cost:</strong> {formatCurrency(work.approved_cost)}</p>
            <p><strong>Sanctioned Budget:</strong> {formatCurrency(work.sanctioned_amount)}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <p><strong>Contractor Firm:</strong> {work.contractor_name || 'Standard Infra Pvt Ltd'}</p>
            <p><strong>Start Date:</strong> {work.start_date ? new Date(work.start_date).toLocaleDateString('en-IN') : '2026-06-01'}</p>
            <p><strong>Target Completion:</strong> {work.target_date ? new Date(work.target_date).toLocaleDateString('en-IN') : '2026-09-30'}</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Work Specifications</h4>
          <p className="p-3 bg-slate-50 rounded-lg text-xs text-slate-800 border border-slate-100">{work.description}</p>
        </div>

        {/* Photo Gallery Placeholder */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center">
            <ImageIcon className="w-4 h-4 text-blue-600 mr-1.5" /> On-site Progress Photo Gallery
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-center text-xs text-slate-500 font-bold">
              Before Photos
            </div>
            <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-center text-xs text-slate-500 font-bold">
              Progress Photos (70%)
            </div>
            <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-center text-xs text-slate-500 font-bold">
              Inspection Photos
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
