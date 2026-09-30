import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { LoadingState } from '../../components/LoadingState';
import { Users, Shield, Mail, Phone } from 'lucide-react';

export const SuperAdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/super-admin/users');
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading Platform User Registry..." />;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
          GLOBAL USER DIRECTORY
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Platform Accounts & User Registry</h2>
        <p className="text-xs text-slate-500">Cross-corporation account registry, system roles, and account statuses.</p>
      </div>

      <Table headers={['User ID', 'Full Name', 'Role Code', 'Corporation', 'Email', 'Mobile', 'Status']}>
        {users.map((u) => (
          <tr key={u.user_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-blue-700 font-mono">{u.user_id}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{u.first_name} {u.last_name}</td>
            <td className="px-6 py-4 font-mono font-bold text-indigo-700">{u.role_code}</td>
            <td className="px-6 py-4 text-slate-600">{u.corporation_name || 'Global SaaS'}</td>
            <td className="px-6 py-4 text-slate-600">{u.email}</td>
            <td className="px-6 py-4 font-mono text-slate-600">{u.phone}</td>
            <td className="px-6 py-4">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {u.status || 'ACTIVE'}
              </span>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};
