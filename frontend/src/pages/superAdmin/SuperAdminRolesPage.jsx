import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { LoadingState } from '../../components/LoadingState';
import { ShieldCheck, Lock } from 'lucide-react';

export const SuperAdminRolesPage = () => {
  const [data, setData] = useState({ roles: [], userCounts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await api.get('/super-admin/roles');
      setData(res.data || { roles: [], userCounts: [] });
    } catch (err) {
      console.error('Failed to fetch roles:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading Platform RBAC Matrix..." />;

  const roles = data.roles || [];
  const counts = data.userCounts || [];

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-md border border-indigo-200">
          RBAC MATRIX
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">System Roles & RBAC Permission Scopes</h2>
        <p className="text-xs text-slate-500">Platform role definitions, permission matrix, and active assigned user count.</p>
      </div>

      <Table headers={['Role Code', 'Role Name', 'Category', 'Description', 'Active Users', 'Status']}>
        {roles.map((r) => {
          const userCount = counts.find((c) => c.role_code === r.role_code)?.count || 1;
          return (
            <tr key={r.role_id || r.role_code} className="hover:bg-slate-50 text-xs">
              <td className="px-6 py-4 font-bold text-indigo-700 font-mono">{r.role_code}</td>
              <td className="px-6 py-4 font-bold text-slate-900">{r.role_name}</td>
              <td className="px-6 py-4 text-slate-600 uppercase font-mono">{r.category || 'MUNICIPAL'}</td>
              <td className="px-6 py-4 text-slate-600">{r.description || 'System RBAC Role'}</td>
              <td className="px-6 py-4 font-mono font-bold text-emerald-700">{userCount} Users</td>
              <td className="px-6 py-4">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  SYSTEM_ACTIVE
                </span>
              </td>
            </tr>
          );
        })}
      </Table>
    </div>
  );
};
