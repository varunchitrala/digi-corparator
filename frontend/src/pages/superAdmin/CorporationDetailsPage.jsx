import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { LoadingState } from '../../components/LoadingState';
import { StatusBadge } from '../../components/StatusBadge';
import { Table } from '../../components/Table';
import { Building2, Users, MapPin, CreditCard, Puzzle, FileText, Activity } from 'lucide-react';

export const CorporationDetailsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/super-admin/corporations/${id}`);
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch corporation details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching corporation 10-tab details..." />;

  const corp = data?.corporation || {};
  const wards = data?.wards || [];
  const users = data?.users || [];
  const subscription = data?.subscription || {};
  const modules = data?.modules || [];

  const tabs = [
    'Overview',
    'Profile',
    'Subscription',
    'Modules',
    'Users',
    'Wards',
    'Departments',
    'Usage',
    'Activity',
    'Audit Logs'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
              {corp.corporation_code}
            </span>
            <span className="text-xs text-slate-500 font-semibold">{corp.ulb_type}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">{corp.corporation_name}</h2>
          <p className="text-xs text-slate-500">{corp.city}, {corp.state} • Official Email: {corp.email}</p>
        </div>

        <StatusBadge status={corp.status} />
      </div>

      {/* 10-Tab Navigation Bar */}
      <div className="bg-white px-4 border-b border-slate-200 flex items-center space-x-1 overflow-x-auto">
        {tabs.map((t) => {
          const tabKey = t.toLowerCase().replace(/ /g, '-');
          const isActive = activeTab === tabKey;
          return (
            <button
              key={t}
              onClick={() => setActiveTab(tabKey)}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors shrink-0 ${
                isActive ? 'border-amber-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-bold text-blue-700">Total Wards</p>
                <h3 className="text-2xl font-black text-blue-900 mt-1">{wards.length}</h3>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-xs font-bold text-emerald-700">Active Users</p>
                <h3 className="text-2xl font-black text-emerald-900 mt-1">{users.length}</h3>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                <p className="text-xs font-bold text-purple-700">SaaS Plan</p>
                <h3 className="text-xl font-extrabold text-purple-900 mt-1">{subscription.plan_name || 'Professional'}</h3>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-xs font-bold text-amber-700">Enabled Modules</p>
                <h3 className="text-2xl font-black text-amber-900 mt-1">{modules.length}</h3>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Subscription & Billing Ledger</h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <p><strong>Plan Name:</strong> {subscription.plan_name || 'Professional City Plan'}</p>
              <p><strong>Status:</strong> <StatusBadge status={subscription.status || 'ACTIVE'} /></p>
              <p><strong>Amount:</strong> ₹{subscription.amount || '1,49,999.00'}/year</p>
              <p><strong>Valid Until:</strong> {subscription.end_date || '2026-12-31'}</p>
            </div>
          </div>
        )}

        {activeTab === 'modules' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Enabled SaaS Modules</h3>
            <div className="grid grid-cols-3 gap-3">
              {modules.map((m) => (
                <div key={m.module_id} className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-900 flex justify-between">
                  <span>{m.module_name}</span>
                  <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded">ENABLED</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'wards' && (
          <Table headers={['Ward Number', 'Ward Name', 'Area (sq km)', 'Population', 'Households', 'Status']}>
            {wards.map((w) => (
              <tr key={w.ward_id} className="hover:bg-slate-50 text-xs">
                <td className="px-6 py-3.5 font-bold text-blue-600">{w.ward_number}</td>
                <td className="px-6 py-3.5 font-bold text-slate-900">{w.ward_name}</td>
                <td className="px-6 py-3.5">{w.area_sq_km} sq km</td>
                <td className="px-6 py-3.5 font-semibold text-slate-700">{w.population}</td>
                <td className="px-6 py-3.5 text-slate-600">{w.households}</td>
                <td className="px-6 py-3.5"><StatusBadge status={w.status} /></td>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </div>
  );
};
