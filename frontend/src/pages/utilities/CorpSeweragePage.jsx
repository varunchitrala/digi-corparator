import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { LoadingState } from '../../components/LoadingState';

export const CorpSeweragePage = () => {
  const [stps, setStps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStps();
  }, []);

  const fetchStps = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/sewerage/stp');
      setStps(res.data);
    } catch (err) {
      console.error('Failed to fetch STPs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Sewage Treatment Plants (STP)..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200">
          SEWAGE TREATMENT PLANTS & NETWORK
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Sewage Treatment Plants (STP) & Manholes</h2>
        <p className="text-xs text-slate-500">Monitor STP inflow/outflow metrics, missing manhole covers, sewer blockages, and treated water discharge quality.</p>
      </div>

      <Table headers={['STP Code', 'Facility Name', 'Capacity (MLD)', 'Status']}>
        {stps.map((s) => (
          <tr key={s.stp_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-emerald-700 font-mono">{s.stp_code}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{s.name}</td>
            <td className="px-6 py-4 font-mono font-bold text-indigo-700">{s.capacity_mld} MLD</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {s.status}
              </span>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};
