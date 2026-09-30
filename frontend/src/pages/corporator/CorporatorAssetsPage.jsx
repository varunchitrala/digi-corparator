import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingState } from '../../components/LoadingState';
import { Building, MapPin } from 'lucide-react';

export const CorporatorAssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporator/assets');
      setAssets(res.data);
    } catch (err) {
      console.error('Failed to fetch assets:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching public ward assets..." />;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-md border border-purple-200">
          PUBLIC ASSET INVENTORY
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Ward 24 Public Assets Directory</h2>
        <p className="text-xs text-slate-500">Streetlights, water points, schools, gardens, public toilets, and municipal infrastructure.</p>
      </div>

      <Table headers={['Asset Name', 'Asset Type', 'Location Address', 'Status', 'Last Inspection']}>
        {assets.map((ast) => (
          <tr key={ast.asset_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-slate-900">{ast.asset_name}</td>
            <td className="px-6 py-4 font-bold text-purple-700">{ast.asset_type}</td>
            <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{ast.location_address}</td>
            <td className="px-6 py-4"><StatusBadge status={ast.status} /></td>
            <td className="px-6 py-4 text-slate-500">{ast.last_inspection_date ? new Date(ast.last_inspection_date).toLocaleDateString('en-IN') : 'Recent'}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
};
