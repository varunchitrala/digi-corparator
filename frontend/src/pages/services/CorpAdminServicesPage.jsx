import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const CorpAdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [isFieldOpen, setIsFieldOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [fieldData, setFieldData] = useState({
    field_name: 'owner_name',
    label: 'Property Owner Name',
    type: 'TEXT'
  });

  useEffect(() => {
    fetchAdminServices();
  }, []);

  const fetchAdminServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/services');
      setServices(res.data);
    } catch (err) {
      console.error('Failed to fetch admin services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFieldSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService) return;
    setSubmitting(true);
    try {
      await api.post(`/corporation/services/${selectedService.service_id}/fields`, fieldData);
      alert('Dynamic form field added successfully!');
      setIsFieldOpen(false);
    } catch (err) {
      alert(err.message || 'Field addition failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Corporation Services & Form Builder Workspace..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
          MUNICIPAL SERVICE MASTER & FORM BUILDER
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Municipal Service Management</h2>
        <p className="text-xs text-slate-500">Configure municipal online services, processing SLA rules, dynamic form fields, and required document rules.</p>
      </div>

      <Table headers={['Code', 'Service Name', 'Category', 'SLA (Days)', 'Fee', 'Total Apps', 'Status', 'Actions']}>
        {services.map((s) => (
          <tr key={s.service_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-blue-600 font-mono">{s.service_code}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{s.service_name}</td>
            <td className="px-6 py-4 text-slate-600">{s.category_name}</td>
            <td className="px-6 py-4 font-mono font-bold text-slate-800">{s.processing_days} Days</td>
            <td className="px-6 py-4 font-mono text-emerald-700">{s.fee_required ? formatCurrency(s.fee_amount) : 'Free'}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{s.total_applications || 0}</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {s.status}
              </span>
            </td>
            <td className="px-6 py-4">
              <Button variant="ghost" size="xs" onClick={() => { setSelectedService(s); setIsFieldOpen(true); }}>
                + Add Dynamic Field
              </Button>
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isFieldOpen} onClose={() => setIsFieldOpen(false)} title={`Add Field to ${selectedService?.service_name}`}>
        <form onSubmit={handleAddFieldSubmit} className="space-y-4">
          <Input label="Field Name (Key)" value={fieldData.field_name} onChange={(e) => setFieldData({ ...fieldData, field_name: e.target.value })} required />
          <Input label="Field Label" value={fieldData.label} onChange={(e) => setFieldData({ ...fieldData, label: e.target.value })} required />
          <Select label="Field Input Type" value={fieldData.type} onChange={(e) => setFieldData({ ...fieldData, type: e.target.value })} options={[
            { value: 'TEXT', label: 'Single Line Text' },
            { value: 'NUMBER', label: 'Numeric Value' },
            { value: 'DATE', label: 'Date Picker' },
            { value: 'FILE', label: 'File Upload' }
          ]} />
          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsFieldOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Add Field</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
