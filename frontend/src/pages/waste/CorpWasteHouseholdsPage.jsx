import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { Plus } from 'lucide-react';

export const CorpWasteHouseholdsPage = () => {
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    owner_name: 'Ramesh Patil',
    ward_id: 'w-demo-024',
    address: 'Plot 45 Civil Lines Ward 24',
    waste_category: 'WET'
  });

  useEffect(() => {
    fetchHouseholds();
  }, []);

  const fetchHouseholds = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/waste/households');
      setHouseholds(res.data);
    } catch (err) {
      console.error('Failed to fetch households:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/waste/households', formData);
      alert(`Household Registered Successfully! Number: ${res.data.household_number}`);
      setIsRegisterOpen(false);
      fetchHouseholds();
    } catch (err) {
      alert(err.message || 'Household registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Household Waste Register..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            HOUSEHOLD WASTE REGISTER
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Door-to-Door Household Directory</h2>
          <p className="text-xs text-slate-500">Register households for daily door-to-door collection and track wet/dry waste segregation.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsRegisterOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-1.5" /> Add Household
        </Button>
      </div>

      <Table headers={['Household Code', 'Owner Name', 'Ward', 'Category', 'Address', 'Status']}>
        {households.map((h) => (
          <tr key={h.household_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-emerald-700 font-mono">{h.household_number}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{h.owner_name}</td>
            <td className="px-6 py-4 text-slate-600">{h.ward_name || 'Ward 24'}</td>
            <td className="px-6 py-4 font-mono font-bold text-indigo-700">{h.waste_category}</td>
            <td className="px-6 py-4 text-slate-600">{h.address}</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {h.status}
              </span>
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} title="Register Waste Household">
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <Input label="Owner Full Name" value={formData.owner_name} onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })} required />
          <Select label="Primary Waste Category" value={formData.waste_category} onChange={(e) => setFormData({ ...formData, waste_category: e.target.value })} options={[
            { value: 'WET', label: 'Wet / Organic Waste' },
            { value: 'DRY', label: 'Dry Waste' },
            { value: 'RECYCLABLE', label: 'Recyclable Plastic / Paper' },
            { value: 'HAZARDOUS', label: 'Domestic Hazardous Waste' }
          ]} />
          <Input label="Household Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsRegisterOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Register Household</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
