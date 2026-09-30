import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { IotStatusBadge } from '../../components/iot/IotStatusBadge';
import { Plus, Cpu } from 'lucide-react';

export const CorpIotCommandCentrePage = () => {
  const [data, setData] = useState({ devices: [], total_online: 0 });
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    device_name: 'Ward 24 Drainage Flood Level Sensor 1',
    ward_id: 'w-demo-024',
    device_type: 'WATER_LEVEL'
  });

  useEffect(() => {
    fetchIotDevices();
  }, []);

  const fetchIotDevices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/iot/devices');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch IoT devices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/iot/devices', formData);
      alert(`Smart City IoT Sensor Registered! Device Code: ${res.data.device_code}`);
      setIsOpen(false);
      fetchIotDevices();
    } catch (err) {
      alert(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Connecting to Smart City IoT Command Control Centre..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-cyan-800 bg-cyan-100 px-2.5 py-0.5 rounded-md border border-cyan-200">
            SMART CITY IOT COMMAND CENTRE
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">IoT Sensors, Telemetry Ingest & Threshold Rules Engine</h2>
          <p className="text-xs text-slate-500">Live telemetry monitoring for flood level sensors, air quality meters, smart streetlights, and smart bins.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)} className="bg-cyan-600 hover:bg-cyan-700">
          <Plus className="w-4 h-4 mr-1.5" /> Register IoT Device
        </Button>
      </div>

      {/* Live Telemetry Banner */}
      <div className="bg-slate-950 text-white p-5 rounded-xl border border-slate-800 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs text-cyan-400 font-bold tracking-wider uppercase">Live Telemetry Control Centre</div>
            <div className="text-lg font-extrabold font-mono text-white mt-0.5">{data.total_online} IoT Devices Connected & Operational</div>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          HEALTH: 100% OPERATIONAL
        </span>
      </div>

      {/* IoT Devices Table */}
      <Table headers={['Device Code', 'Device Name', 'Ward', 'Type', 'Battery %', 'Ping Status']}>
        {data.devices.map((d) => (
          <tr key={d.device_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-cyan-700 font-mono">{d.device_code}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{d.device_name}</td>
            <td className="px-6 py-4 text-slate-600">{d.ward_name || 'Ward 24'}</td>
            <td className="px-6 py-4 font-mono font-bold text-purple-700">{d.device_type}</td>
            <td className="px-6 py-4 font-mono font-bold text-emerald-700">{d.battery_pct}% Battery</td>
            <td className="px-6 py-4">
              <IotStatusBadge status={d.operating_status} />
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Register Smart City IoT Device">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Device Sensor Name" value={formData.device_name} onChange={(e) => setFormData({ ...formData, device_name: e.target.value })} required />
          <Select label="Sensor Device Type" value={formData.device_type} onChange={(e) => setFormData({ ...formData, device_type: e.target.value })} options={[
            { value: 'WATER_LEVEL', label: 'Drainage & River Flood Level Sensor' },
            { value: 'AIR_QUALITY', label: 'AQI Air Quality Environmental Meter' },
            { value: 'SMART_STREETLIGHT', label: 'Smart Solar Streetlight Controller' },
            { value: 'SMART_BIN', label: 'Ultrasonic Waste Bin Fill Meter' }
          ]} />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Register Sensor</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
