import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { BpmsStatusBadge } from '../../components/bpms/BpmsStatusBadge';
import { Plus } from 'lucide-react';

export const CorpBpmsApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    applicant_name: 'Ramesh Sharma',
    architect_name: 'Shree Architects Ward 24',
    ward_id: 'w-demo-024',
    plot_number: 'Plot 45',
    cts_number: 'CTS-8842',
    building_type: 'RESIDENTIAL',
    total_builtup_sqft: 3200
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/bpms/applications');
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to fetch BPMS applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/bpms/applications', formData);
      alert(`Building Permission Application Submitted! BP Code: ${res.data.bp_number}`);
      setIsOpen(false);
      fetchApplications();
    } catch (err) {
      alert(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Building Permission Applications..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            TOWN PLANNING & BPMS
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Building Permission Management System (BPMS)</h2>
          <p className="text-xs text-slate-500">Track architectural proposals, plot CTS verification, department NOCs, and Commencement / Occupancy certificates.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-1.5" /> Submit Application
        </Button>
      </div>

      <Table headers={['BP Number', 'Applicant Name', 'Architect', 'Plot / CTS', 'Builtup SqFt', 'Scrutiny Fee', 'Stage', 'Status']}>
        {applications.map((app) => (
          <tr key={app.bp_application_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-indigo-700 font-mono">{app.bp_number}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{app.applicant_name}</td>
            <td className="px-6 py-4 text-slate-600">{app.architect_name}</td>
            <td className="px-6 py-4 font-mono">{app.plot_number} ({app.cts_number})</td>
            <td className="px-6 py-4 font-mono font-bold text-slate-900">{app.total_builtup_sqft} sq.ft</td>
            <td className="px-6 py-4 font-mono font-bold text-emerald-700">₹{app.scrutiny_fee_amount}</td>
            <td className="px-6 py-4 font-mono text-slate-600">{app.stage}</td>
            <td className="px-6 py-4">
              <BpmsStatusBadge status={app.status} />
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Submit Building Plan Application">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Applicant Name" value={formData.applicant_name} onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })} required />
          <Input label="Licensed Architect Name" value={formData.architect_name} onChange={(e) => setFormData({ ...formData, architect_name: e.target.value })} required />
          <Input label="Plot Number" value={formData.plot_number} onChange={(e) => setFormData({ ...formData, plot_number: e.target.value })} required />
          <Input label="CTS Reference Number" value={formData.cts_number} onChange={(e) => setFormData({ ...formData, cts_number: e.target.value })} required />
          <Select label="Building Usage Type" value={formData.building_type} onChange={(e) => setFormData({ ...formData, building_type: e.target.value })} options={[
            { value: 'RESIDENTIAL', label: 'Residential Bungalow / Apartment' },
            { value: 'COMMERCIAL', label: 'Commercial Complex / Mall' },
            { value: 'INDUSTRIAL', label: 'Industrial Workshop' },
            { value: 'MIXED_USE', label: 'Mixed Commercial + Residential' }
          ]} />
          <Input label="Total Builtup Area (Sq.Ft)" type="number" value={formData.total_builtup_sqft} onChange={(e) => setFormData({ ...formData, total_builtup_sqft: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Submit Proposal</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
