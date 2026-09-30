import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { LoadingState } from '../../components/LoadingState';
import { Plus, Search, Building2, Eye, ShieldAlert, CheckCircle, Ban } from 'lucide-react';

export const CorporationsPage = () => {
  const [corporations, setCorporations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCorporations();
  }, [search, statusFilter]);

  const fetchCorporations = async () => {
    setLoading(true);
    try {
      let url = '/super-admin/corporations?page=1&limit=20';
      if (search) url += `&search=${search}`;
      if (statusFilter) url += `&status=${statusFilter}`;

      const res = await api.get(url);
      setCorporations(res.data);
    } catch (err) {
      console.error('Failed to fetch corporations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (corpId, newStatus) => {
    try {
      await api.patch(`/super-admin/corporations/${corpId}/status`, { status: newStatus });
      fetchCorporations();
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-200">
            TENANT MANAGEMENT
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Municipal Corporations</h2>
          <p className="text-xs text-slate-500">Manage SaaS client corporations, active plans, wards, and status.</p>
        </div>

        <Link to="/super-admin/corporations/create">
          <Button variant="primary" size="sm" className="bg-amber-600 hover:bg-amber-700">
            <Plus className="w-4 h-4 mr-1.5" /> Create Corporation
          </Button>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-64">
            <Input
              placeholder="Search Code, Name, City..."
              icon={Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-44">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'ACTIVE', label: 'Active' },
                { value: 'INACTIVE', label: 'Inactive' },
                { value: 'SUSPENDED', label: 'Suspended' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Corporations Table */}
      {loading ? (
        <LoadingState message="Fetching corporations list..." />
      ) : (
        <Table
          headers={[
            'Corporation Code',
            'Corporation Name',
            'ULB Type',
            'City & State',
            'Wards',
            'Users',
            'SaaS Plan',
            'Status',
            'Actions'
          ]}
        >
          {corporations.map((corp) => (
            <tr key={corp.corporation_id} className="hover:bg-slate-50">
              <td className="px-6 py-4 font-bold text-amber-700 text-xs">{corp.corporation_code}</td>
              <td className="px-6 py-4 font-bold text-slate-900 text-xs">{corp.corporation_name}</td>
              <td className="px-6 py-4 text-xs font-semibold text-slate-600">{corp.ulb_type}</td>
              <td className="px-6 py-4 text-xs text-slate-600">{corp.city}, {corp.state}</td>
              <td className="px-6 py-4 font-bold text-slate-900 text-xs">{corp.total_wards || 0}</td>
              <td className="px-6 py-4 font-bold text-slate-900 text-xs">{corp.total_users || 0}</td>
              <td className="px-6 py-4 font-bold text-blue-600 text-xs">{corp.plan_name || 'Professional'}</td>
              <td className="px-6 py-4"><StatusBadge status={corp.status} /></td>
              <td className="px-6 py-4 flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/super-admin/corporations/${corp.corporation_id}`)}
                >
                  <Eye className="w-3.5 h-3.5 mr-1" /> View
                </Button>
                {corp.status === 'ACTIVE' ? (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleStatusToggle(corp.corporation_id, 'SUSPENDED')}
                  >
                    <Ban className="w-3.5 h-3.5" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleStatusToggle(corp.corporation_id, 'ACTIVE')}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
};
