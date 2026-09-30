import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { AssetConditionBadge } from '../../components/gis/AssetConditionBadge';
import { Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const CorpAssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    asset_name: 'Smart LED Light Pole W24',
    category_id: 'acat-001',
    ward_id: 'w-demo-024',
    latitude: 19.8762,
    longitude: 75.3433,
    address: 'Main Road Ward 24',
    estimated_value: 25000,
    condition: 'GOOD'
  });

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/assets');
      setAssets(res.data);
    } catch (err) {
      console.error('Failed to fetch assets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/assets', formData);
      alert(`Asset Registered Successfully! Code: ${res.data.asset_code}`);
      setIsRegisterOpen(false);
      fetchAssets();
    } catch (err) {
      alert(err.message || 'Asset registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Municipal Assets Register..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            MUNICIPAL ASSET REGISTER
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Municipal Assets Directory</h2>
          <p className="text-xs text-slate-500">Register municipal assets, track condition, inspections, health scores, and maintenance status.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsRegisterOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-1.5" /> Register New Asset
        </Button>
      </div>

      <Table headers={['Asset Code', 'Asset Name', 'Category', 'Condition', 'Health Score', 'Value', 'Status']}>
        {assets.map((a) => (
          <tr key={a.asset_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-blue-600 font-mono">{a.asset_code}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{a.asset_name}</td>
            <td className="px-6 py-4 text-slate-600">{a.category_name}</td>
            <td className="px-6 py-4">
              <AssetConditionBadge condition={a.condition} />
            </td>
            <td className="px-6 py-4 font-mono font-bold text-indigo-700">{a.health_score}%</td>
            <td className="px-6 py-4 font-mono text-emerald-700">{formatCurrency(a.estimated_value)}</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {a.status}
              </span>
            </td>
          </tr>
        ))}
      </Table>

      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} title="Register Municipal Asset">
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <Input label="Asset Name" value={formData.asset_name} onChange={(e) => setFormData({ ...formData, asset_name: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Latitude (-90 to +90)" type="number" step="any" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} required />
            <Input label="Longitude (-180 to +180)" type="number" step="any" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} required />
          </div>
          <Input label="Site Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
          <Input label="Estimated Asset Value (₹)" type="number" value={formData.estimated_value} onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsRegisterOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Register Asset</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
