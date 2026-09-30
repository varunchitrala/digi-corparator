import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { FireNocBadge } from '../../components/fire/FireNocBadge';
import { Plus, Flame } from 'lucide-react';

export const CorpFireStationsPage = () => {
  const [data, setData] = useState({ stations: [], nocs: [], incidents: [] });
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    building_name: 'Shivaji Heights Commercial Complex',
    risk_category: 'HIGH_RISK'
  });

  useEffect(() => {
    fetchFireData();
  }, []);

  const fetchFireData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/fire/stations');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch fire data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/fire/noc', formData);
      alert(`Fire NOC Application Submitted! Code: ${res.data.fnoc_number}`);
      setIsOpen(false);
      fetchFireData();
    } catch (err) {
      alert(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Fire Stations & Emergency Command..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-md border border-rose-200">
            FIRE & EMERGENCY SERVICES
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Fire Stations, NOC Approvals & Emergency Incidents</h2>
          <p className="text-xs text-slate-500">Monitor municipal fire stations, emergency vehicle fleet, Fire Safety NOC approvals, and rescue operations.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)} className="bg-rose-600 hover:bg-rose-700">
          <Plus className="w-4 h-4 mr-1.5" /> Submit Fire NOC
        </Button>
      </div>

      {/* Fire Stations */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
          <Flame className="w-4 h-4 text-rose-600 mr-2" /> Municipal Fire Stations Directory
        </h3>
        <Table headers={['Station Code', 'Station Name', 'Ward', 'Vehicles Fleet', 'Staff Strength']}>
          {data.stations.map((s) => (
            <tr key={s.station_id} className="hover:bg-slate-50 text-xs">
              <td className="px-6 py-4 font-bold text-rose-700 font-mono">{s.station_code}</td>
              <td className="px-6 py-4 font-bold text-slate-900">{s.station_name}</td>
              <td className="px-6 py-4 text-slate-600">{s.ward_name || 'Ward 24'}</td>
              <td className="px-6 py-4 font-mono font-bold text-indigo-700">{s.vehicles_count} Fire Tenders</td>
              <td className="px-6 py-4 font-mono font-bold text-slate-900">{s.staff_count} Firefighters</td>
            </tr>
          ))}
        </Table>
      </div>

      {/* Fire NOC Applications */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3">Fire Safety NOC Certificates</h3>
        <Table headers={['NOC Number', 'Building Name', 'Risk Category', 'Status']}>
          {data.nocs.map((n) => (
            <tr key={n.fnoc_id} className="hover:bg-slate-50 text-xs">
              <td className="px-6 py-4 font-bold text-indigo-700 font-mono">{n.fnoc_number}</td>
              <td className="px-6 py-4 font-bold text-slate-900">{n.building_name}</td>
              <td className="px-6 py-4 font-mono font-bold text-amber-700">{n.risk_category}</td>
              <td className="px-6 py-4">
                <FireNocBadge status={n.status} />
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Submit Fire Safety NOC Application">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Building / Establishment Name" value={formData.building_name} onChange={(e) => setFormData({ ...formData, building_name: e.target.value })} required />
          <Select label="Fire Risk Category" value={formData.risk_category} onChange={(e) => setFormData({ ...formData, risk_category: e.target.value })} options={[
            { value: 'LOW_RISK', label: 'Low Risk (Low-rise residential)' },
            { value: 'MEDIUM_RISK', label: 'Medium Risk (Commercial shops)' },
            { value: 'HIGH_RISK', label: 'High Risk (High-rise / Mall / Hospital)' }
          ]} />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Submit NOC</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
