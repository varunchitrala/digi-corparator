import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { Plus } from 'lucide-react';

export const CorpLeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    leave_type_id: 'ltype-001',
    from_date: '2026-09-01',
    to_date: '2026-09-03',
    days: 3,
    reason: 'Personal leave'
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await api.get('/hrms/leave/applications');
      setLeaves(res.data);
    } catch (err) {
      console.error('Failed to fetch leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/hrms/leave/apply', formData);
      alert(`Leave Application Submitted! Remaining Balance: ${res.data.remaining_balance} days`);
      setIsApplyOpen(false);
      fetchLeaves();
    } catch (err) {
      alert(err.message || 'Application failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (leaveId) => {
    try {
      await api.post(`/hrms/leave/applications/${leaveId}/approve`);
      alert('Leave Approved Successfully!');
      fetchLeaves();
    } catch (err) {
      alert(err.message || 'Approval failed');
    }
  };

  if (loading) return <LoadingState message="Fetching Leave Applications & Balance Quotas..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            LEAVE MANAGEMENT & BALANCES
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Leave Applications & Quotas</h2>
          <p className="text-xs text-slate-500">Apply for leave, verify server-side balance quotas, and process manager approvals.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsApplyOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-1.5" /> Apply For Leave
        </Button>
      </div>

      <Table headers={['EMP Code', 'Employee Name', 'Leave Type', 'Duration', 'Days', 'Reason', 'Status', 'Actions']}>
        {leaves.map((l) => (
          <tr key={l.leave_app_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-blue-600 font-mono">{l.employee_code}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{l.first_name} {l.last_name}</td>
            <td className="px-6 py-4 text-slate-600">{l.leave_name}</td>
            <td className="px-6 py-4 text-slate-500">{new Date(l.from_date).toLocaleDateString()} - {new Date(l.to_date).toLocaleDateString()}</td>
            <td className="px-6 py-4 font-mono font-bold text-slate-900">{l.days} Days</td>
            <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{l.reason}</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {l.status}
              </span>
            </td>
            <td className="px-6 py-4">
              {l.status !== 'APPROVED' && (
                <Button variant="success" size="xs" onClick={() => handleApprove(l.leave_app_id)} className="bg-emerald-600 hover:bg-emerald-700">
                  Approve Leave
                </Button>
              )}
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isApplyOpen} onClose={() => setIsApplyOpen(false)} title="Submit Leave Application">
        <form onSubmit={handleApplySubmit} className="space-y-4">
          <Select label="Leave Type" value={formData.leave_type_id} onChange={(e) => setFormData({ ...formData, leave_type_id: e.target.value })} options={[
            { value: 'ltype-001', label: 'LV-CL: Casual Leave (Quota: 12 Days)' },
            { value: 'ltype-002', label: 'LV-SL: Sick Leave (Quota: 10 Days)' },
            { value: 'ltype-003', label: 'LV-EL: Earned Leave (Quota: 30 Days)' }
          ]} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="From Date" type="date" value={formData.from_date} onChange={(e) => setFormData({ ...formData, from_date: e.target.value })} required />
            <Input label="To Date" type="date" value={formData.to_date} onChange={(e) => setFormData({ ...formData, to_date: e.target.value })} required />
          </div>
          <Input label="Total Days" type="number" value={formData.days} onChange={(e) => setFormData({ ...formData, days: e.target.value })} required />
          <Input label="Reason for Leave" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsApplyOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Submit Leave</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
