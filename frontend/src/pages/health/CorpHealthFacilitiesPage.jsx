import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { HealthFacilityBadge } from '../../components/health/HealthFacilityBadge';
import { Plus } from 'lucide-react';

export const CorpHealthFacilitiesPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    facility_name: 'Ward 24 Primary Urban Health Centre',
    ward_id: 'w-demo-024',
    facility_type: 'URBAN_HEALTH_CENTRE',
    capacity_beds: 25
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/health/facilities');
      setFacilities(res.data);
    } catch (err) {
      console.error('Failed to fetch facilities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/health/facilities', formData);
      alert(`Health Facility Registered Successfully! Code: ${res.data.facility_code}`);
      setIsRegisterOpen(false);
      fetchFacilities();
    } catch (err) {
      alert(err.message || 'Facility registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Health Facilities Master..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            HEALTH FACILITIES MASTER
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Municipal Hospitals & Health Centres</h2>
          <p className="text-xs text-slate-500">Directory of municipal hospitals, urban health centres, dispensaries, maternity homes, and bed capacities.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsRegisterOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-1.5" /> Add Facility
        </Button>
      </div>

      <Table headers={['Facility Code', 'Facility Name', 'Ward', 'Type', 'Beds Capacity', 'Operating Status']}>
        {facilities.map((f) => (
          <tr key={f.facility_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-emerald-700 font-mono">{f.facility_code}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{f.facility_name}</td>
            <td className="px-6 py-4 text-slate-600">{f.ward_name || 'Ward 24'}</td>
            <td className="px-6 py-4 font-mono">{f.facility_type}</td>
            <td className="px-6 py-4 font-mono font-bold text-indigo-700">{f.capacity_beds} Beds</td>
            <td className="px-6 py-4">
              <HealthFacilityBadge status={f.operating_status} />
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} title="Register Health Facility">
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <Input label="Facility Name" value={formData.facility_name} onChange={(e) => setFormData({ ...formData, facility_name: e.target.value })} required />
          <Select label="Facility Type" value={formData.facility_type} onChange={(e) => setFormData({ ...formData, facility_type: e.target.value })} options={[
            { value: 'URBAN_HEALTH_CENTRE', label: 'Urban Primary Health Centre' },
            { value: 'MUNICIPAL_HOSPITAL', label: 'Municipal General Hospital' },
            { value: 'DISPENSARY', label: 'Municipal Dispensary' },
            { value: 'MATERNITY_CENTRE', label: 'Maternal & Child Care Centre' }
          ]} />
          <Input label="Bed Capacity" type="number" value={formData.capacity_beds} onChange={(e) => setFormData({ ...formData, capacity_beds: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsRegisterOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Register Facility</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
