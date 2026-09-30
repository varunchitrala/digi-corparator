import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { LoadingState } from '../../components/LoadingState';
import { Droplet, Plus } from 'lucide-react';

export const CorpWaterConnectionsPage = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReadingOpen, setIsReadingOpen] = useState(false);
  const [selectedConn, setSelectedConn] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currReading, setCurrReading] = useState(125);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/revenue/water/connections');
      setConnections(res.data);
    } catch (err) {
      console.error('Failed to fetch water connections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReadingSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/revenue/water/readings', {
        connection_id: selectedConn.connection_id,
        current_reading: currReading
      });
      alert(`Meter Reading Recorded! Consumption: ${res.data.consumption} units, Total Payable: ₹${res.data.total_payable}`);
      setIsReadingOpen(false);
      fetchConnections();
    } catch (err) {
      alert(err.message || 'Meter reading recording failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Water Connections & Meter Readings..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-cyan-800 bg-cyan-100 px-2.5 py-0.5 rounded-md border border-cyan-200">
          WATER TAX & METER CONSUMPTION
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Water Connections & Meter Readings</h2>
        <p className="text-xs text-slate-500">Record monthly water meter readings, compute slab-based consumption bills, and track disconnections.</p>
      </div>

      <Table headers={['Connection No', 'Owner Name', 'Meter Number', 'Type', 'Last Reading', 'Status', 'Actions']}>
        {connections.map((c) => (
          <tr key={c.connection_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-cyan-700 font-mono">{c.connection_number}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{c.owner_name}</td>
            <td className="px-6 py-4 font-mono text-slate-600">{c.meter_number}</td>
            <td className="px-6 py-4 font-mono">{c.connection_type}</td>
            <td className="px-6 py-4 font-mono font-bold text-indigo-700">{c.last_reading} units</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {c.status}
              </span>
            </td>
            <td className="px-6 py-4">
              <Button variant="primary" size="xs" onClick={() => { setSelectedConn(c); setIsReadingOpen(true); }} className="bg-cyan-600 hover:bg-cyan-700">
                <Droplet className="w-3.5 h-3.5 mr-1" /> Add Reading
              </Button>
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isReadingOpen} onClose={() => setIsReadingOpen(false)} title="Record Water Meter Reading">
        <form onSubmit={handleReadingSubmit} className="space-y-4">
          <Input label="Previous Reading" value={selectedConn?.last_reading || 100} disabled />
          <Input label="Current Meter Reading" type="number" value={currReading} onChange={(e) => setCurrReading(e.target.value)} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsReadingOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Compute & Record</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
