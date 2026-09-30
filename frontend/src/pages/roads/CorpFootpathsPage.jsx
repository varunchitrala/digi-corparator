import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { LoadingState } from '../../components/LoadingState';

export const CorpFootpathsPage = () => {
  const [footpaths, setFootpaths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFootpaths();
  }, []);

  const fetchFootpaths = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/roads/footpaths');
      setFootpaths(res.data);
    } catch (err) {
      console.error('Failed to fetch footpaths:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Footpaths & Pedestrian Infrastructure..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
          FOOTPATHS & PEDESTRIAN INFRASTRUCTURE
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Pedestrian Footpaths, Paver Blocks & Kerbs</h2>
        <p className="text-xs text-slate-500">Monitor pedestrian walkways, interlocking paver blocks, damaged kerbs, and accessibility safety features.</p>
      </div>

      <Table headers={['Footpath Code', 'Road Name', 'Ward', 'Surface Type', 'Length (m)', 'Status']}>
        {footpaths.map((f) => (
          <tr key={f.footpath_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-emerald-700 font-mono">{f.footpath_code}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{f.road_name}</td>
            <td className="px-6 py-4 text-slate-600">{f.ward_name || 'Ward 24'}</td>
            <td className="px-6 py-4 font-mono">{f.surface_type}</td>
            <td className="px-6 py-4 font-mono font-bold text-indigo-700">{f.length_meters} m</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {f.status}
              </span>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};
