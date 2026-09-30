import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { LoadingState } from '../../components/LoadingState';

export const CorpDrainagePage = () => {
  const [drains, setDrains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrains();
  }, []);

  const fetchDrains = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/drainage/drains');
      setDrains(res.data);
    } catch (err) {
      console.error('Failed to fetch drains:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Storm Water Drain Network..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
          STORM WATER DRAINAGE NETWORK
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Municipal Storm Water Drains & Flood Points</h2>
        <p className="text-xs text-slate-500">Monitor storm water drains, monsoon desilting cleaning tasks, flood-prone locations, and outfalls.</p>
      </div>

      <Table headers={['Drain Code', 'Ward', 'Type', 'Length (m)', 'Status']}>
        {drains.map((d) => (
          <tr key={d.drain_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-blue-700 font-mono">{d.drain_code}</td>
            <td className="px-6 py-4 text-slate-600">{d.ward_name || 'Ward 24'}</td>
            <td className="px-6 py-4 font-mono">{d.drain_type}</td>
            <td className="px-6 py-4 font-mono font-bold text-indigo-700">{d.length_meters} m</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {d.status}
              </span>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};
