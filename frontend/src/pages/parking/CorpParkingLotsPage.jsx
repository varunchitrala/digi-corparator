import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { LoadingState } from '../../components/LoadingState';
import { Plus, Car } from 'lucide-react';

export const CorpParkingLotsPage = () => {
  const [data, setData] = useState({ lots: [], challans: [] });
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    lot_name: 'Ward 24 Station Road Multi-Level Parking',
    ward_id: 'w-demo-024',
    total_capacity: 150,
    hourly_rate: 20
  });

  useEffect(() => {
    fetchParkingData();
  }, []);

  const fetchParkingData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/parking/lots');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch parking data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/parking/lots', formData);
      alert(`Smart Parking Lot Registered! Lot Code: ${res.data.lot_code}`);
      setIsOpen(false);
      fetchParkingData();
    } catch (err) {
      alert(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Smart Parking & Traffic Enforcement..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-md border border-indigo-200">
            PARKING & TRAFFIC ENFORCEMENT
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Smart Parking Lots & Traffic Violation Challans</h2>
          <p className="text-xs text-slate-500">Monitor multi-level parking capacity, real-time slot occupancy, and no-parking traffic fine challans.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-1.5" /> Add Parking Lot
        </Button>
      </div>

      {/* Parking Lots */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
          <Car className="w-4 h-4 text-indigo-600 mr-2" /> Municipal Smart Parking Lots
        </h3>
        <Table headers={['Lot Code', 'Parking Lot Name', 'Ward', 'Total Capacity', 'Occupied Slots', 'Hourly Rate']}>
          {data.lots.map((l) => (
            <tr key={l.lot_id} className="hover:bg-slate-50 text-xs">
              <td className="px-6 py-4 font-bold text-indigo-700 font-mono">{l.lot_code}</td>
              <td className="px-6 py-4 font-bold text-slate-900">{l.lot_name}</td>
              <td className="px-6 py-4 text-slate-600">{l.ward_name || 'Ward 24'}</td>
              <td className="px-6 py-4 font-mono font-bold text-slate-900">{l.total_capacity} Slots</td>
              <td className="px-6 py-4 font-mono font-bold text-emerald-700">{l.occupied_slots} Occupied</td>
              <td className="px-6 py-4 font-mono font-bold text-indigo-700">₹{l.hourly_rate}/hr</td>
            </tr>
          ))}
        </Table>
      </div>

      {/* Traffic Challans */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3">Traffic Violation Fine Challans</h3>
        <Table headers={['Challan No.', 'Vehicle Number', 'Violation Type', 'Fine Amount', 'Payment Status']}>
          {data.challans.map((c) => (
            <tr key={c.challan_id} className="hover:bg-slate-50 text-xs">
              <td className="px-6 py-4 font-bold text-rose-700 font-mono">{c.challan_number}</td>
              <td className="px-6 py-4 font-bold text-slate-900 font-mono">{c.vehicle_number}</td>
              <td className="px-6 py-4 font-mono">{c.violation_type}</td>
              <td className="px-6 py-4 font-mono font-bold text-rose-700">₹{c.fine_amount}</td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {c.payment_status}
                </span>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Register Smart Parking Lot">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Parking Lot Name" value={formData.lot_name} onChange={(e) => setFormData({ ...formData, lot_name: e.target.value })} required />
          <Input label="Total Vehicle Slots Capacity" type="number" value={formData.total_capacity} onChange={(e) => setFormData({ ...formData, total_capacity: e.target.value })} required />
          <Input label="Hourly Parking Rate (₹)" type="number" value={formData.hourly_rate} onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Register Lot</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
