import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { LoadingState } from '../../components/LoadingState';
import { Puzzle, CheckCircle } from 'lucide-react';

export const SuperAdminModulesPage = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const res = await api.get('/super-admin/modules');
      setModules(res.data || []);
    } catch (err) {
      console.error('Failed to fetch modules:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading Platform Modules Registry..." />;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-cyan-800 bg-cyan-100 px-2.5 py-0.5 rounded-md border border-cyan-200">
          FEATURE MODULES REGISTRY
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Municipal SaaS Feature Modules (Phases 1-24)</h2>
        <p className="text-xs text-slate-500">Master registry of core SaaS modules, route endpoints, and category groups.</p>
      </div>

      <Table headers={['Module Code', 'Module Name', 'Category', 'Route Prefix', 'Status']}>
        {modules.map((m) => (
          <tr key={m.module_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-cyan-700 font-mono">{m.module_code}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{m.module_name}</td>
            <td className="px-6 py-4 font-mono uppercase text-purple-700">{m.category}</td>
            <td className="px-6 py-4 font-mono text-slate-600">{m.route}</td>
            <td className="px-6 py-4">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                ACTIVE_INSTALLED
              </span>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};
