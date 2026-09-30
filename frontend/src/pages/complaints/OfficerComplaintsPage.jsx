import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { ComplaintStatusBadge } from '../../components/complaints/ComplaintStatusBadge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { LoadingState } from '../../components/LoadingState';
import { CheckCircle2, ClipboardCheck, TrendingUp, CheckSquare, Eye } from 'lucide-react';

export const OfficerComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCmp, setActiveCmp] = useState(null);

  // Modals state
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [isResolveOpen, setIsResolveOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [inspectionRemarks, setInspectionRemarks] = useState('');
  const [progressPct, setProgressPct] = useState(50);
  const [progressRemarks, setProgressRemarks] = useState('');
  const [resolutionDesc, setResolutionDesc] = useState('');
  const [resolutionCost, setResolutionCost] = useState(0);

  useEffect(() => {
    fetchOfficerComplaints();
  }, []);

  const fetchOfficerComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/officer/complaints');
      setComplaints(res.data);
    } catch (err) {
      console.error('Failed to fetch officer complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await api.patch(`/officer/complaints/${id}/accept`);
      alert('Complaint accepted!');
      fetchOfficerComplaints();
    } catch (err) {
      alert(err.message || 'Accept failed');
    }
  };

  const handleInspectSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/officer/complaints/${activeCmp.complaint_id}/inspection`, { remarks: inspectionRemarks });
      alert('Site inspection report saved!');
      setIsInspectOpen(false);
      fetchOfficerComplaints();
    } catch (err) {
      alert(err.message || 'Inspection failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProgressSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/officer/complaints/${activeCmp.complaint_id}/progress`, {
        progress_percentage: progressPct,
        remarks: progressRemarks
      });
      alert(`Progress updated to ${progressPct}%!`);
      setIsProgressOpen(false);
      fetchOfficerComplaints();
    } catch (err) {
      alert(err.message || 'Progress update failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/officer/complaints/${activeCmp.complaint_id}/resolve`, {
        resolution_description: resolutionDesc,
        resolution_cost: resolutionCost
      });
      alert('Complaint resolved and sent for citizen verification!');
      setIsResolveOpen(false);
      fetchOfficerComplaints();
    } catch (err) {
      alert(err.message || 'Resolution failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-cyan-800 bg-cyan-100 px-2.5 py-0.5 rounded-md border border-cyan-200">
          FIELD OFFICER WORKSPACE
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Assigned Field Grievances</h2>
        <p className="text-xs text-slate-500">Accept assignments, submit site inspections, update progress, and resolve complaints.</p>
      </div>

      {/* Complaints Table */}
      {loading ? (
        <LoadingState message="Fetching assigned officer complaints..." />
      ) : (
        <Table headers={['Complaint ID', 'Title', 'Ward', 'Priority', 'Status', 'Citizen', 'Actions']}>
          {complaints.map((cmp) => (
            <tr key={cmp.complaint_id} className="hover:bg-slate-50 text-xs">
              <td className="px-6 py-4 font-bold text-blue-600">{cmp.complaint_number}</td>
              <td className="px-6 py-4 font-bold text-slate-900 max-w-xs truncate">{cmp.title}</td>
              <td className="px-6 py-4 text-slate-600">{cmp.ward_name || 'Ward 24'}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-0.5 rounded font-black text-[10px] ${
                  cmp.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {cmp.priority}
                </span>
              </td>
              <td className="px-6 py-4"><ComplaintStatusBadge status={cmp.status} /></td>
              <td className="px-6 py-4 text-slate-700">{cmp.citizen_name || 'Vijay Shinde'}</td>
              <td className="px-6 py-4 flex items-center space-x-1.5">
                {cmp.status === 'ASSIGNED' && (
                  <Button size="sm" variant="success" onClick={() => handleAccept(cmp.complaint_id)}>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Accept
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => { setActiveCmp(cmp); setIsInspectOpen(true); }}>
                  <ClipboardCheck className="w-3.5 h-3.5" /> Inspect
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setActiveCmp(cmp); setIsProgressOpen(true); }}>
                  <TrendingUp className="w-3.5 h-3.5" /> Progress
                </Button>
                <Button size="sm" variant="primary" onClick={() => { setActiveCmp(cmp); setIsResolveOpen(true); }}>
                  <CheckSquare className="w-3.5 h-3.5" /> Resolve
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      )}

      {/* Inspection Modal */}
      <Modal isOpen={isInspectOpen} onClose={() => setIsInspectOpen(false)} title="Submit Site Inspection Findings">
        <form onSubmit={handleInspectSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Inspection Remarks & Findings</label>
            <textarea
              rows={3}
              placeholder="Describe on-site inspection findings..."
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs"
              value={inspectionRemarks}
              onChange={(e) => setInspectionRemarks(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsInspectOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Submit Report</Button>
          </div>
        </form>
      </Modal>

      {/* Progress Modal */}
      <Modal isOpen={isProgressOpen} onClose={() => setIsProgressOpen(false)} title="Update Work Progress %">
        <form onSubmit={handleProgressSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Progress Percentage ({progressPct}%)</label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              className="w-full"
              value={progressPct}
              onChange={(e) => setProgressPct(parseInt(e.target.value, 10))}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Milestone Remarks</label>
            <input
              type="text"
              placeholder="e.g. Material dispatched and work underway"
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs"
              value={progressRemarks}
              onChange={(e) => setProgressRemarks(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsProgressOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Save Progress</Button>
          </div>
        </form>
      </Modal>

      {/* Resolution Modal */}
      <Modal isOpen={isResolveOpen} onClose={() => setIsResolveOpen(false)} title="Submit Final Resolution & Close Work">
        <form onSubmit={handleResolveSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Resolution Summary</label>
            <textarea
              rows={3}
              placeholder="Detail the completed resolution work..."
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs"
              value={resolutionDesc}
              onChange={(e) => setResolutionDesc(e.target.value)}
              required
            />
          </div>
          <Input label="Resolution Cost (₹)" type="number" value={resolutionCost} onChange={(e) => setResolutionCost(e.target.value)} />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsResolveOpen(false)}>Cancel</Button>
            <Button type="submit" variant="success" isLoading={submitting}>Submit Resolution</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
