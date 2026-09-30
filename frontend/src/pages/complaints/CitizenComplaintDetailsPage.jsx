import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { LoadingState } from '../../components/LoadingState';
import { ComplaintStatusBadge } from '../../components/complaints/ComplaintStatusBadge';
import { ComplaintTimeline } from '../../components/complaints/ComplaintTimeline';
import { SlaIndicator } from '../../components/complaints/SlaIndicator';
import { CitizenFeedbackModal } from '../../components/complaints/CitizenFeedbackModal';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { ArrowLeft, CheckCircle2, RotateCcw, Star, ShieldCheck } from 'lucide-react';

export const CitizenComplaintDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/citizen/complaints/${id}`);
      setComplaint(res.data);
    } catch (err) {
      console.error('Failed to fetch citizen complaint details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptResolution = async () => {
    try {
      await api.post(`/citizen/complaints/${id}/verify`);
      alert('Resolution verified! Complaint closed.');
      setIsFeedbackModalOpen(true);
      fetchDetails();
    } catch (err) {
      alert(err.message || 'Verification failed');
    }
  };

  const handleReopenSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/citizen/complaints/${id}/reopen`, { reopen_reason: reopenReason });
      alert('Complaint reopened and sent back for re-inspection.');
      setIsReopenModalOpen(false);
      fetchDetails();
    } catch (err) {
      alert(err.message || 'Reopen failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeedbackSubmit = async ({ rating, comment }) => {
    setSubmitting(true);
    try {
      await api.post(`/citizen/complaints/${id}/feedback`, { rating, comment });
      alert('Thank you for submitting your feedback!');
      setIsFeedbackModalOpen(false);
      fetchDetails();
    } catch (err) {
      alert(err.message || 'Feedback submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching your complaint details..." />;
  if (!complaint) return <div className="p-6 bg-white rounded-xl">Complaint not found or access denied</div>;

  const isVerificationPending = complaint.status === 'CITIZEN_VERIFICATION' || complaint.status === 'RESOLVED';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button variant="ghost" size="sm" onClick={() => navigate('/citizen/complaints')}>
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to My Complaints
      </Button>

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
          <div className="text-right space-y-1">
            <ComplaintStatusBadge status={complaint.status} />
            <div><SlaIndicator slaDueAt={complaint.sla_due_at} isBreached={complaint.status === 'ESCALATED'} /></div>
          </div>
        </div>

        {/* Verification Action Banner when RESOLVED / CITIZEN_VERIFICATION */}
        {isVerificationPending && (
          <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-emerald-900 text-sm flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2" /> Field Officer Completed Work
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5">Please inspect the work and confirm if you are satisfied with the resolution.</p>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="success" size="sm" onClick={handleAcceptResolution}>
                  Accept & Close
                </Button>
                <Button variant="danger" size="sm" onClick={() => setIsReopenModalOpen(true)}>
                  <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reject & Reopen
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Description & Location */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <p><strong>Department:</strong> {complaint.department_name || 'Engineering'}</p>
            <p><strong>Ward:</strong> {complaint.ward_name || 'Ward 24 - Shivaji Nagar'}</p>
            <p><strong>Assigned Field Officer:</strong> {complaint.officer_first_name ? `${complaint.officer_first_name} ${complaint.officer_last_name}` : 'Assigned Field Officer'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <p><strong>Location Address:</strong> {complaint.location_address}</p>
            <p><strong>Registered Date:</strong> {new Date(complaint.created_at).toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Grievance Description</h4>
          <p className="p-3 bg-slate-50 rounded-lg text-xs text-slate-800 border border-slate-100">{complaint.description}</p>
        </div>

        {/* Public Timeline History */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Resolution Progress Timeline</h4>
          <ComplaintTimeline history={complaint.history} />
        </div>
      </div>

      {/* Reopen Modal */}
      <Modal isOpen={isReopenModalOpen} onClose={() => setIsReopenModalOpen(false)} title="Reject Resolution & Reopen Complaint">
        <form onSubmit={handleReopenSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Reason for Rejection / Unresolved Details</label>
            <textarea
              rows={3}
              placeholder="Explain why the resolution was not satisfactory..."
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs"
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsReopenModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="danger" isLoading={submitting}>Reopen Complaint</Button>
          </div>
        </form>
      </Modal>

      {/* Citizen Feedback Modal */}
      <CitizenFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
        submitting={submitting}
      />
    </div>
  );
};
