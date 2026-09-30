import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { LoadingState } from '../../components/LoadingState';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { ArrowLeft, Clock, MapPin, User, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ComplaintDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/corporator/complaints/${id}`);
      setComplaint(res.data);
    } catch (err) {
      console.error('Failed to fetch complaint details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching complaint details & history..." />;
  if (!complaint) return <div className="p-6 bg-white rounded-xl">Complaint not found</div>;

  const steps = ['REGISTERED', 'ASSIGNED', 'INSPECTION', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  const currentStepIdx = steps.indexOf(complaint.status) >= 0 ? steps.indexOf(complaint.status) : 2;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Button & Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/corporator/complaints')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Complaints
        </Button>
      </div>

      {/* Main Details Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                {complaint.complaint_number}
              </span>
              <span className="text-xs text-slate-500 font-semibold">{complaint.category_name}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-2">{complaint.title}</h2>
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        {/* Timeline Stepper */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3">Resolution Timeline Progress</h4>
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => {
              const isDone = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={step} className="flex flex-col items-center flex-1 text-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCurrent ? 'bg-blue-600 text-white shadow-md' : isDone ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`text-[10px] font-bold mt-1.5 ${isCurrent ? 'text-blue-700' : 'text-slate-500'}`}>{step.replace(/_/g, ' ')}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <p><strong>Citizen Name:</strong> {complaint.citizen_name || 'Vijay Shinde'}</p>
            <p><strong>Contact Phone:</strong> {complaint.citizen_phone || '9876543299'}</p>
            <p><strong>Location Address:</strong> {complaint.location_address}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <p><strong>Department:</strong> {complaint.department_name || 'Engineering'}</p>
            <p><strong>Assigned Officer:</strong> {complaint.officer_first_name ? `${complaint.officer_first_name} ${complaint.officer_last_name}` : 'Field Engineer'}</p>
            <p><strong>SLA Due Date:</strong> {complaint.sla_due_at ? new Date(complaint.sla_due_at).toLocaleString('en-IN') : '24 Hours'}</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Grievance Description</h4>
          <p className="p-3 bg-slate-50 rounded-lg text-xs text-slate-800 border border-slate-100">{complaint.description}</p>
        </div>

        {/* Audit History Logs */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Audit History & Remark Logs</h4>
          <div className="space-y-2">
            {(complaint.history || []).map((h, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg text-xs border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">{h.to_status}</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">{h.remarks}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">{new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
