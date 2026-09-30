import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { LoadingState } from '../../components/LoadingState';
import { Plus, ShieldAlert } from 'lucide-react';

export const CorpVendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    vendor_name: 'Apex Infrastructure Ltd',
    legal_name: 'Apex Infrastructure Pvt Ltd',
    pan: 'ABCDE1234F',
    gstin: '27ABCDE1234F1Z5',
    mobile: '9822088776',
    email: 'contact@apexinfra.com'
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/procurement/vendors');
      setVendors(res.data);
    } catch (err) {
      console.error('Failed to fetch vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/procurement/vendors', formData);
      alert(`Vendor Registered Successfully! Code: ${res.data.vendor_code}`);
      setIsRegisterOpen(false);
      fetchVendors();
    } catch (err) {
      alert(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBlacklist = async (vendorId) => {
    if (!confirm('Are you sure you want to BLACKLIST this vendor? Blacklisted vendors cannot submit bids or receive contracts.')) return;
    try {
      await api.post(`/corporation/procurement/vendors/${vendorId}/blacklist`, {
        reason: 'Contractual default & quality failure'
      });
      alert('Vendor Blacklisted Successfully!');
      fetchVendors();
    } catch (err) {
      alert(err.message || 'Blacklist operation failed');
    }
  };

  if (loading) return <LoadingState message="Fetching Municipal Vendors Register..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            VENDORS & CONTRACTORS DIRECTORY
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Vendor Master Directory</h2>
          <p className="text-xs text-slate-500">Manage vendor profiles, PAN/GSTIN verifications, performance ratings, and blacklisting controls.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsRegisterOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-1.5" /> Register New Vendor
        </Button>
      </div>

      <Table headers={['Vendor Code', 'Vendor Name', 'PAN', 'GSTIN', 'Mobile / Email', 'Status', 'Actions']}>
        {vendors.map((v) => (
          <tr key={v.vendor_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-blue-600 font-mono">{v.vendor_code}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{v.vendor_name}</td>
            <td className="px-6 py-4 font-mono text-slate-600">{v.pan}</td>
            <td className="px-6 py-4 font-mono text-slate-600">{v.gstin}</td>
            <td className="px-6 py-4 text-slate-500">{v.mobile}<br />{v.email}</td>
            <td className="px-6 py-4">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${v.blacklisted ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'}`}>
                {v.status}
              </span>
            </td>
            <td className="px-6 py-4">
              {!v.blacklisted && (
                <Button variant="danger" size="xs" onClick={() => handleBlacklist(v.vendor_id)} className="bg-rose-600 hover:bg-rose-700">
                  <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Blacklist
                </Button>
              )}
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} title="Register Vendor">
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <Input label="Vendor Trade Name" value={formData.vendor_name} onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })} required />
          <Input label="Legal Entity Name" value={formData.legal_name} onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="PAN Number" value={formData.pan} onChange={(e) => setFormData({ ...formData, pan: e.target.value })} required />
            <Input label="GSTIN Number" value={formData.gstin} onChange={(e) => setFormData({ ...formData, gstin: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Mobile Number" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} required />
            <Input label="Email Address" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsRegisterOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Register Vendor</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
