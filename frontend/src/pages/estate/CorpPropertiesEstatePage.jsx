import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { Plus, ShieldAlert } from 'lucide-react';

export const CorpPropertiesEstatePage = () => {
  const [data, setData] = useState({ properties: [], encroachments: [] });
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    property_name: 'Ward 24 Municipal Shopping Complex',
    ward_id: 'w-demo-024',
    land_area_sqft: 15000,
    lease_status: 'LEASED',
    monthly_rent: 45000
  });

  useEffect(() => {
    fetchEstateData();
  }, []);

  const fetchEstateData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/estate/properties');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch estate data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/estate/properties', formData);
      alert(`Municipal Property Registered! Property Code: ${res.data.property_code}`);
      setIsOpen(false);
      fetchEstateData();
    } catch (err) {
      alert(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Municipal Estate & Encroachments..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            ESTATE & LAND MANAGEMENT
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Municipal Properties & Encroachment Removal</h2>
          <p className="text-xs text-slate-500">Registry of municipal lands, shopping complexes, lease rentals, and anti-encroachment notices.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-1.5" /> Register Property
        </Button>
      </div>

      {/* Municipal Properties */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3">Municipal Property Assets</h3>
        <Table headers={['Property Code', 'Property Name', 'Ward', 'Area (Sq.Ft)', 'Lease Status', 'Monthly Rent']}>
          {data.properties.map((p) => (
            <tr key={p.property_id} className="hover:bg-slate-50 text-xs">
              <td className="px-6 py-4 font-bold text-emerald-700 font-mono">{p.property_code}</td>
              <td className="px-6 py-4 font-bold text-slate-900">{p.property_name}</td>
              <td className="px-6 py-4 text-slate-600">{p.ward_name || 'Ward 24'}</td>
              <td className="px-6 py-4 font-mono">{p.land_area_sqft} sq.ft</td>
              <td className="px-6 py-4 font-mono font-bold text-indigo-700">{p.lease_status}</td>
              <td className="px-6 py-4 font-mono font-bold text-emerald-700">₹{p.monthly_rent}/mo</td>
            </tr>
          ))}
        </Table>
      </div>

      {/* Encroachments */}
      <div>
        <h3 className="text-sm font-bold text-rose-900 mb-3 flex items-center">
          <ShieldAlert className="w-4 h-4 text-rose-600 mr-2" /> Anti-Encroachment Cases
        </h3>
        <Table headers={['Case Code', 'Location', 'Ward', 'Severity', 'Notice Status']}>
          {data.encroachments.map((e) => (
            <tr key={e.encroachment_id} className="hover:bg-slate-50 text-xs">
              <td className="px-6 py-4 font-bold text-rose-700 font-mono">{e.encroachment_code}</td>
              <td className="px-6 py-4 font-bold text-slate-900">{e.location}</td>
              <td className="px-6 py-4 text-slate-600">{e.ward_name || 'Ward 24'}</td>
              <td className="px-6 py-4 font-mono font-bold text-amber-700">{e.severity}</td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {e.notice_status}
                </span>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Register Municipal Property">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Property Name" value={formData.property_name} onChange={(e) => setFormData({ ...formData, property_name: e.target.value })} required />
          <Input label="Land Area (Sq.Ft)" type="number" value={formData.land_area_sqft} onChange={(e) => setFormData({ ...formData, land_area_sqft: e.target.value })} required />
          <Select label="Lease Status" value={formData.lease_status} onChange={(e) => setFormData({ ...formData, lease_status: e.target.value })} options={[
            { value: 'LEASED', label: 'Leased Out to Commercial Tenant' },
            { value: 'SELF_USED', label: 'Municipal Self-Use Administrative Office' },
            { value: 'VACANT', label: 'Vacant Plot Available for Auction' }
          ]} />
          <Input label="Monthly Lease Rent Amount (₹)" type="number" value={formData.monthly_rent} onChange={(e) => setFormData({ ...formData, monthly_rent: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Register Property</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
