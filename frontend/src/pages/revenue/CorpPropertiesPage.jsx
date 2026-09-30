import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { Plus } from 'lucide-react';

export const CorpPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    owner_name: 'Ramesh Patil',
    mobile: '9822011445',
    ward_id: 'w-demo-024',
    property_type: 'RESIDENTIAL',
    usage_type: 'Residential Flat',
    built_up_area: 1000,
    address: 'Plot 45 Civil Lines Ward 24'
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/revenue/properties');
      setProperties(res.data);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/revenue/properties', formData);
      alert(`Property Registered Successfully! Number: ${res.data.property_number}`);
      setIsRegisterOpen(false);
      fetchProperties();
    } catch (err) {
      alert(err.message || 'Property registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Property Master Register..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            PROPERTY MASTER REGISTER
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Municipal Property Directory</h2>
          <p className="text-xs text-slate-500">Register property titles, track ownership history, assessments, and tax demands.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsRegisterOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-1.5" /> Register New Property
        </Button>
      </div>

      <Table headers={['Property Number', 'Owner Name', 'Ward', 'Type', 'Built-Up Area', 'Address', 'Status']}>
        {properties.map((p) => (
          <tr key={p.property_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-blue-600 font-mono">{p.property_number}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{p.owner_name}</td>
            <td className="px-6 py-4 text-slate-600">{p.ward_name || 'Ward 24'}</td>
            <td className="px-6 py-4 font-mono">{p.property_type}</td>
            <td className="px-6 py-4 font-mono font-bold text-indigo-700">{p.built_up_area} sq.ft</td>
            <td className="px-6 py-4 text-slate-600">{p.address}</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {p.status}
              </span>
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} title="Register Municipal Property">
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <Input label="Owner Full Name" value={formData.owner_name} onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })} required />
          <Input label="Mobile Number" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} required />
          <Select label="Property Type" value={formData.property_type} onChange={(e) => setFormData({ ...formData, property_type: e.target.value })} options={[
            { value: 'RESIDENTIAL', label: 'Residential Property' },
            { value: 'COMMERCIAL', label: 'Commercial Complex / Shop' },
            { value: 'INDUSTRIAL', label: 'Industrial Factory / Warehouse' }
          ]} />
          <Input label="Built-Up Area (sq.ft)" type="number" value={formData.built_up_area} onChange={(e) => setFormData({ ...formData, built_up_area: e.target.value })} required />
          <Input label="Site Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsRegisterOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Register Property</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
