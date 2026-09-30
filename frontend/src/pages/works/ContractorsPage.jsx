import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { LoadingState } from '../../components/LoadingState';
import { Plus, Eye, HardHat, Phone, Mail } from 'lucide-react';

export const ContractorsPage = () => {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    company_name: '',
    license_number: '',
    contact_person: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/contractors');
      setContractors(res.data);
    } catch (err) {
      console.error('Failed to fetch contractors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/corporation/contractors', formData);
      alert('Contractor registered successfully!');
      setIsCreateOpen(false);
      fetchContractors();
    } catch (err) {
      alert(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            CONTRACTOR DIRECTORY
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Empaneled Municipal Contractors</h2>
          <p className="text-xs text-slate-500">Manage registered contractors, licenses, assigned works, and performance rates.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-1.5" /> Register New Contractor
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingState message="Fetching empaneled contractors..." />
      ) : (
        <Table headers={['Company Name', 'License No', 'Contact Person', 'Phone', 'Email', 'Assigned Works', 'Status']}>
          {contractors.map((c) => (
            <tr key={c.contractor_id} className="hover:bg-slate-50 text-xs">
              <td className="px-6 py-4 font-bold text-slate-900">{c.company_name}</td>
              <td className="px-6 py-4 font-mono text-blue-600">{c.license_number}</td>
              <td className="px-6 py-4 text-slate-700">{c.contact_person}</td>
              <td className="px-6 py-4 text-slate-600">{c.phone}</td>
              <td className="px-6 py-4 text-slate-600">{c.email}</td>
              <td className="px-6 py-4 font-bold text-slate-900">{c.total_assigned_works || 0}</td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {c.status}
                </span>
              </td>
            </tr>
          ))}
        </Table>
      )}

      {/* Register Contractor Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Register Municipal Contractor">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input label="Company / Enterprise Name" placeholder="e.g. Apex Infrastructure Pvt Ltd" value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} required />
          <Input label="Municipal License Number" placeholder="e.g. PWD-LIC-2026-99" value={formData.license_number} onChange={(e) => setFormData({ ...formData, license_number: e.target.value })} required />
          <Input label="Contact Person Name" value={formData.contact_person} onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
            <Input label="Email Address" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Register Contractor</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
