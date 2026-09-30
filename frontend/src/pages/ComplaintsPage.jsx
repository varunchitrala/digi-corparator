import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Table } from '../components/Table';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { Plus, RefreshCw, AlertCircle, MapPin, CheckCircle, Clock } from 'lucide-react';

export const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');

  // Register Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location_address: '',
    priority: 'HIGH',
    category_id: 'cat-001'
  });

  useEffect(() => {
    fetchComplaints();
  }, [selectedStatus, selectedPriority]);

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/complaints?ward_id=w-demo-024';
      if (selectedStatus) url += `&status=${selectedStatus}`;
      if (selectedPriority) url += `&priority=${selectedPriority}`;

      const res = await api.get(url);
      setComplaints(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load complaints from backend API');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterComplaint = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/complaints', {
        ...formData,
        ward_id: 'w-demo-024'
      });
      setIsModalOpen(false);
      setFormData({ title: '', description: '', location_address: '', priority: 'HIGH', category_id: 'cat-001' });
      fetchComplaints();
    } catch (err) {
      alert(err.message || 'Failed to register complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await api.put(`/complaints/${complaintId}/status`, {
        status: newStatus,
        remarks: `Status updated to ${newStatus} from Corporator Dashboard`
      });
      fetchComplaints();
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
              COMPLAINTS MANAGEMENT MODULE
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Ward Citizen Grievances</h2>
          <p className="text-xs text-slate-500">Live complaint registry, SLA tracking, and resolution workflow.</p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={fetchComplaints} isLoading={loading}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> Register Complaint
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-48">
            <Select
              label="Filter Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'REGISTERED', label: 'Registered' },
                { value: 'IN_PROGRESS', label: 'In Progress' },
                { value: 'RESOLVED', label: 'Resolved' },
                { value: 'CLOSED', label: 'Closed' }
              ]}
            />
          </div>
          <div className="w-48">
            <Select
              label="Filter Priority"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              options={[
                { value: '', label: 'All Priorities' },
                { value: 'CRITICAL', label: 'Critical' },
                { value: 'HIGH', label: 'High' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'LOW', label: 'Low' }
              ]}
            />
          </div>
        </div>

        <span className="text-xs font-bold text-slate-500">
          Showing <span className="text-blue-600 font-extrabold">{complaints.length}</span> Records
        </span>
      </div>

      {/* Table Data */}
      {loading ? (
        <LoadingState message="Connecting to MySQL database & fetching complaints..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchComplaints} />
      ) : complaints.length === 0 ? (
        <EmptyState title="No complaints found" description="No registered grievances match the selected filter criteria." />
      ) : (
        <Table
          headers={[
            'Complaint ID',
            'Title & Address',
            'Category',
            'SLA Window',
            'Priority',
            'Status',
            'Quick Action'
          ]}
        >
          {complaints.map((cmp) => (
            <tr key={cmp.complaint_id} className="hover:bg-slate-50">
              <td className="px-6 py-4 font-bold text-blue-600 text-xs">
                {cmp.complaint_number}
              </td>
              <td className="px-6 py-4">
                <p className="font-bold text-slate-900 text-xs">{cmp.title}</p>
                <p className="text-[11px] text-slate-500 flex items-center mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400 mr-1 shrink-0" />
                  {cmp.location_address}
                </p>
              </td>
              <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                {cmp.category_name || 'General'}
              </td>
              <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                <span className="flex items-center text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
                  <Clock className="w-3 h-3 mr-1" /> {cmp.sla_hours}h SLA
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`font-bold text-xs ${
                  cmp.priority === 'CRITICAL' ? 'text-red-600' : cmp.priority === 'HIGH' ? 'text-amber-600' : 'text-blue-600'
                }`}>
                  {cmp.priority}
                </span>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={cmp.status} />
              </td>
              <td className="px-6 py-4">
                {cmp.status === 'REGISTERED' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(cmp.complaint_id, 'IN_PROGRESS')}
                  >
                    Start Work
                  </Button>
                )}
                {cmp.status === 'IN_PROGRESS' && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleStatusChange(cmp.complaint_id, 'RESOLVED')}
                  >
                    Mark Resolved
                  </Button>
                )}
                {cmp.status === 'RESOLVED' && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" /> Verified
                  </span>
                )}
              </td>
            </tr>
          ))}
        </Table>
      )}

      {/* Create Complaint Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Citizen Grievance"
      >
        <form onSubmit={handleRegisterComplaint} className="space-y-4">
          <Input
            label="Grievance Title"
            placeholder="e.g. Broken Water Pipeline outside Sector 4"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Input
            label="Location Address"
            placeholder="Detailed street location in Ward 24"
            value={formData.location_address}
            onChange={(e) => setFormData({ ...formData, location_address: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority Level"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              options={[
                { value: 'CRITICAL', label: 'Critical (12h SLA)' },
                { value: 'HIGH', label: 'High (24h SLA)' },
                { value: 'MEDIUM', label: 'Medium (48h SLA)' },
                { value: 'LOW', label: 'Low (72h SLA)' }
              ]}
            />
            <Select
              label="Category"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              options={[
                { value: 'cat-001', label: 'Streetlight Defect' },
                { value: 'cat-002', label: 'Garbage Overflow' },
                { value: 'cat-003', label: 'Pothole & Road Damage' },
                { value: 'cat-004', label: 'Water Supply Leakage' }
              ]}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Description & Remarks
            </label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Provide context or instructions..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              Submit Complaint
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
