import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { Plus } from 'lucide-react';

export const CorpSurveillancePage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    ward_id: 'w-demo-024',
    condition_category: 'VECTOR_BORNE',
    case_count: 8,
    severity_category: 'MEDIUM'
  });

  useEffect(() => {
    fetchSurveillance();
  }, []);

  const fetchSurveillance = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/health/surveillance');
      setRecords(res.data);
    } catch (err) {
      console.error('Failed to fetch surveillance records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/health/surveillance', formData);
      alert(`Surveillance Report Logged Successfully! Code: ${res.data.surveillance_number}`);
      setIsLogOpen(false);
      fetchSurveillance();
    } catch (err) {
      alert(err.message || 'Surveillance logging failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Disease Surveillance Records..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            DISEASE SURVEILLANCE & ALERTS
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Aggregated Ward Disease Telemetry & Outbreak Monitoring</h2>
          <p className="text-xs text-slate-500">Track ward-wise aggregated disease counts (Vector-Borne / Water-Borne), monitor risk severity, and trigger early warning alerts.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsLogOpen(true)} className="bg-rose-600 hover:bg-rose-700">
          <Plus className="w-4 h-4 mr-1.5" /> Log Surveillance Case
        </Button>
      </div>

      <Table headers={['Report Code', 'Ward', 'Category', 'Case Count', 'Severity', 'Status']}>
        {records.map((r) => (
          <tr key={r.surveillance_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-rose-700 font-mono">{r.surveillance_number}</td>
            <td className="px-6 py-4 text-slate-600">{r.ward_name || 'Ward 24'}</td>
            <td className="px-6 py-4 font-mono font-bold text-slate-900">{r.condition_category}</td>
            <td className="px-6 py-4 font-mono font-bold text-indigo-700">{r.case_count} Cases</td>
            <td className="px-6 py-4 font-mono font-bold text-amber-700">{r.severity_category}</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {r.status}
              </span>
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} title="Log Aggregated Disease Surveillance Report">
        <form onSubmit={handleLogSubmit} className="space-y-4">
          <Select label="Condition Category" value={formData.condition_category} onChange={(e) => setFormData({ ...formData, condition_category: e.target.value })} options={[
            { value: 'VECTOR_BORNE', label: 'Vector-Borne (Dengue/Malaria)' },
            { value: 'WATER_BORNE', label: 'Water-Borne (Cholera/Gastroenteritis)' },
            { value: 'FOOD_BORNE', label: 'Food Poisoning' },
            { value: 'RESPIRATORY', label: 'Acute Respiratory' }
          ]} />
          <Input label="Aggregated Ward Case Count" type="number" value={formData.case_count} onChange={(e) => setFormData({ ...formData, case_count: e.target.value })} required />
          <Select label="Severity Category" value={formData.severity_category} onChange={(e) => setFormData({ ...formData, severity_category: e.target.value })} options={[
            { value: 'LOW', label: 'Low Risk' },
            { value: 'MEDIUM', label: 'Medium Risk' },
            { value: 'HIGH', label: 'High Alert Risk' },
            { value: 'CRITICAL', label: 'Critical Outbreak Alert' }
          ]} />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsLogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Log Report</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
