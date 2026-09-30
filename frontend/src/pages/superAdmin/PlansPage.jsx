import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { LoadingState } from '../../components/LoadingState';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Check, Minus, PackageCheck } from 'lucide-react';

export const PlansPage = () => {
  const [plansData, setPlansData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    plan_name: '',
    plan_code: '',
    description: '',
    price: '',
    billing_cycle: 'YEARLY',
    max_users: 50,
    max_wards: 30
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await api.get('/super-admin/plans');
      setPlansData(res.data);
    } catch (err) {
      console.error('Failed to fetch SaaS plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/super-admin/plans', formData);
      setIsModalOpen(false);
      fetchPlans();
    } catch (err) {
      alert(err.message || 'Failed to create plan');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching SaaS Plans & Feature Matrix..." />;

  const plans = plansData?.plans || [];
  const modules = plansData?.modules || [];
  const planModules = plansData?.planModules || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-200">
            SAAS PRICING & PLANS
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">SaaS Subscription Plans & Feature Matrix</h2>
          <p className="text-xs text-slate-500">Configure tier limits, pricing cycles, and dynamic module permissions.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="w-4 h-4 mr-1.5" /> Create SaaS Plan
        </Button>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div key={p.plan_id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">{p.plan_code}</span>
                <StatusBadge status={p.status} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-3">{p.plan_name}</h3>
              <p className="text-xs text-slate-500 mt-1">{p.description}</p>
              <div className="my-4 pt-4 border-t border-slate-100">
                <p className="text-3xl font-black text-slate-900">{formatCurrency(p.price)}</p>
                <p className="text-xs text-slate-400 font-semibold">per {p.billing_cycle.toLowerCase()}</p>
              </div>
              <div className="space-y-1.5 text-xs text-slate-700 font-medium">
                <p>• Max Wards: <strong>{p.max_wards} Wards</strong></p>
                <p>• Max Users: <strong>{p.max_users} Users</strong></p>
                <p>• Storage: <strong>{p.max_storage_gb || 100} GB</strong></p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Feature Matrix */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center">
          <PackageCheck className="w-4 h-4 text-emerald-600 mr-2" /> Dynamic Plan Feature Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 font-bold text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">SaaS Module Feature</th>
                {plans.map((p) => (
                  <th key={p.plan_id} className="px-4 py-3 text-center">{p.plan_name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {modules.map((mod) => (
                <tr key={mod.module_id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{mod.module_name}</p>
                    <p className="text-[10px] text-slate-400">{mod.description}</p>
                  </td>
                  {plans.map((p) => {
                    const isIncluded = planModules.some((pm) => pm.plan_id === p.plan_id && pm.module_id === mod.module_id) || p.plan_code === 'ENTERPRISE';
                    return (
                      <td key={p.plan_id} className="px-4 py-3 text-center">
                        {isIncluded ? (
                          <div className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                            <Minus className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Plan Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create SaaS Subscription Plan">
        <form onSubmit={handleCreatePlan} className="space-y-4">
          <Input label="Plan Name" placeholder="e.g. Smart City Enterprise" value={formData.plan_name} onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })} required />
          <Input label="Plan Code" placeholder="ENTERPRISE_PRO" value={formData.plan_code} onChange={(e) => setFormData({ ...formData, plan_code: e.target.value })} required />
          <Input label="Annual Price (₹)" type="number" placeholder="299999" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Max Users" type="number" value={formData.max_users} onChange={(e) => setFormData({ ...formData, max_users: e.target.value })} />
            <Input label="Max Wards" type="number" value={formData.max_wards} onChange={(e) => setFormData({ ...formData, max_wards: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Description</label>
            <textarea rows={2} className="w-full rounded-lg border border-slate-300 p-2.5 text-sm" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Save SaaS Plan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
