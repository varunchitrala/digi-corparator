import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { LoadingState } from '../../components/LoadingState';

export const CorpSmartBinsPage = () => {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBins();
  }, []);

  const fetchBins = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporation/waste/bins');
      setBins(res.data);
    } catch (err) {
      console.error('Failed to fetch smart bins:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Smart Bin Telemetry Network..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-md border border-purple-200">
          SMART BIN NETWORK TELEMETRY
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Smart Garbage Bins & Fill Level Alerts</h2>
        <p className="text-xs text-slate-500">Monitor public garbage bin fill percentages, trigger overflow alerts, and verify QR codes.</p>
      </div>

      <Table headers={['Bin Code', 'Ward', 'Type', 'Capacity', 'Fill Level', 'Location', 'Status']}>
        {bins.map((b) => (
          <tr key={b.bin_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-purple-700 font-mono">{b.bin_code}</td>
            <td className="px-6 py-4 text-slate-600">{b.ward_name || 'Ward 24'}</td>
            <td className="px-6 py-4 font-mono">{b.bin_type}</td>
            <td className="px-6 py-4 font-mono text-slate-600">{b.capacity_liters} Liters</td>
            <td className="px-6 py-4">
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-slate-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${b.fill_level_percent > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${b.fill_level_percent}%` }}></div>
                </div>
                <span className={`font-mono font-bold ${b.fill_level_percent > 80 ? 'text-rose-600' : 'text-emerald-700'}`}>{b.fill_level_percent}%</span>
              </div>
            </td>
            <td className="px-6 py-4 text-slate-600">{b.address}</td>
            <td className="px-6 py-4">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${b.status === 'FULL' ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'}`}>
                {b.status}
              </span>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};
