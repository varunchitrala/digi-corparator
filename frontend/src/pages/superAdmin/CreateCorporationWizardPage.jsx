import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { CheckCircle2, ChevronRight, ChevronLeft, Building2, User, CreditCard, Puzzle, MapPin, ShieldCheck } from 'lucide-react';

export const CreateCorporationWizardPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1
    corporation_name: '',
    corporation_code: '',
    ulb_type: 'MUNICIPAL_CORPORATION',
    state: 'Maharashtra',
    district: 'Chhatrapati Sambhajinagar',
    city: 'Chhatrapati Sambhajinagar',
    address: 'City Administrative Hall',
    email: '',
    phone: '0240-2345678',
    website: '',
    // Step 2
    financial_year: '2026-2027',
    timezone: 'Asia/Kolkata',
    language: 'en',
    currency: 'INR',
    // Step 3
    admin_full_name: 'Rajesh Deshmukh',
    admin_email: '',
    admin_mobile: '9876543211',
    admin_password: 'password123',
    // Step 4
    plan_id: 'plan-pro',
    // Step 5
    selected_module_ids: ['mod-001', 'mod-002', 'mod-003', 'mod-004', 'mod-005', 'mod-006', 'mod-007', 'mod-008', 'mod-009'],
    // Step 6
    initial_wards: [
      { ward_number: 1, ward_name: 'Ward 1 - Station Area', population: 18500, households: 3800 },
      { ward_number: 2, ward_name: 'Ward 2 - Market Yard', population: 22000, households: 4500 }
    ]
  });

  const availableModules = [
    { id: 'mod-001', name: 'Complaints Management', desc: 'Grievances & SLA escalation' },
    { id: 'mod-002', name: 'Development Works', desc: 'Civil engineering & progress' },
    { id: 'mod-003', name: 'Fund Management', desc: 'Budget allocations & telemetry' },
    { id: 'mod-004', name: 'Meetings & Minutes', desc: 'General body & committee' },
    { id: 'mod-005', name: 'Proposals Pipeline', desc: 'Corporator proposals' },
    { id: 'mod-006', name: 'GIS Spatial Mapping', desc: 'OpenStreetMap boundaries' },
    { id: 'mod-007', name: 'AI NagarSevak Assistant', desc: 'Natural language queries' },
    { id: 'mod-008', name: 'Reports & MIS', desc: 'Municipal analytics' },
    { id: 'mod-009', name: 'Public Dashboard', desc: 'Transparency portal' }
  ];

  const handleModuleToggle = (id) => {
    setFormData((prev) => {
      const exists = prev.selected_module_ids.includes(id);
      return {
        ...prev,
        selected_module_ids: exists
          ? prev.selected_module_ids.filter((m) => m !== id)
          : [...prev.selected_module_ids, id]
      };
    });
  };

  const handleSubmitWizard = async () => {
    setSubmitting(true);
    try {
      const res = await api.post('/super-admin/corporations', formData);
      alert('Corporation created successfully!');
      navigate(`/super-admin/corporations/${res.data.corporation_id}`);
    } catch (err) {
      alert(err.message || 'Corporation creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    'Basic Info',
    'Org Settings',
    'Corporation Admin',
    'SaaS Plan',
    'Modules',
    'Ward Setup',
    'Review & Create'
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-200">
          7-STEP CREATION WIZARD
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Onboard New Municipal Corporation</h2>
        <p className="text-xs text-slate-500">Atomically provisions Corporation Tenant, Admin User, Subscription Plan, Modules, and Wards.</p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between overflow-x-auto">
        {steps.map((label, idx) => {
          const stepNum = idx + 1;
          const isActive = currentStep === stepNum;
          const isDone = currentStep > stepNum;
          return (
            <div key={idx} className="flex items-center space-x-2 shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                isActive ? 'bg-amber-500 text-slate-950 shadow-md' : isDone ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
              </div>
              <span className={`text-xs font-bold ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
              {stepNum < 7 && <ChevronRight className="w-4 h-4 text-slate-300 mx-1" />}
            </div>
          );
        })}
      </div>

      {/* Step Body Cards */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        {/* Step 1 */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center">
              <Building2 className="w-4 h-4 text-blue-600 mr-2" /> Step 1: Basic Corporation Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Corporation Name" placeholder="e.g. Nashik Municipal Corporation" value={formData.corporation_name} onChange={(e) => setFormData({ ...formData, corporation_name: e.target.value })} required />
              <Input label="Corporation Code" placeholder="NMC-2026" value={formData.corporation_code} onChange={(e) => setFormData({ ...formData, corporation_code: e.target.value })} required />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Select label="ULB Type" value={formData.ulb_type} onChange={(e) => setFormData({ ...formData, ulb_type: e.target.value })} options={[
                { value: 'MUNICIPAL_CORPORATION', label: 'Municipal Corporation' },
                { value: 'MUNICIPAL_COUNCIL', label: 'Municipal Council' },
                { value: 'NAGAR_PANCHAYAT', label: 'NAGAR PANCHAYAT' }
              ]} />
              <Input label="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
              <Input label="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Official Email" type="email" placeholder="contact@nashikmc.gov.in" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              <Input label="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">Step 2: Organization Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Financial Year" value={formData.financial_year} onChange={(e) => setFormData({ ...formData, financial_year: e.target.value })} />
              <Input label="Timezone" value={formData.timezone} onChange={(e) => setFormData({ ...formData, timezone: e.target.value })} />
            </div>
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center">
              <User className="w-4 h-4 text-blue-600 mr-2" /> Step 3: Initial Corporation Admin
            </h3>
            <Input label="Admin Full Name" value={formData.admin_full_name} onChange={(e) => setFormData({ ...formData, admin_full_name: e.target.value })} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Admin Email" type="email" value={formData.admin_email} onChange={(e) => setFormData({ ...formData, admin_email: e.target.value })} required />
              <Input label="Admin Mobile" value={formData.admin_mobile} onChange={(e) => setFormData({ ...formData, admin_mobile: e.target.value })} required />
            </div>
            <Input label="Initial Password" type="password" value={formData.admin_password} onChange={(e) => setFormData({ ...formData, admin_password: e.target.value })} required />
          </div>
        )}

        {/* Step 4 */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center">
              <CreditCard className="w-4 h-4 text-emerald-600 mr-2" /> Step 4: SaaS Subscription Plan
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div onClick={() => setFormData({ ...formData, plan_id: 'plan-basic' })} className={`p-4 rounded-xl border cursor-pointer ${formData.plan_id === 'plan-basic' ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500' : 'border-slate-200'}`}>
                <h4 className="font-bold text-slate-900">Basic Plan</h4>
                <p className="text-lg font-black text-blue-600 mt-1">₹49,999/yr</p>
                <p className="text-[11px] text-slate-500 mt-2">Up to 15 Wards & 20 Users</p>
              </div>
              <div onClick={() => setFormData({ ...formData, plan_id: 'plan-pro' })} className={`p-4 rounded-xl border cursor-pointer ${formData.plan_id === 'plan-pro' ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500' : 'border-slate-200'}`}>
                <h4 className="font-bold text-slate-900">Professional Plan</h4>
                <p className="text-lg font-black text-emerald-600 mt-1">₹1,49,999/yr</p>
                <p className="text-[11px] text-slate-500 mt-2">Up to 50 Wards & 100 Users</p>
              </div>
              <div onClick={() => setFormData({ ...formData, plan_id: 'plan-ent' })} className={`p-4 rounded-xl border cursor-pointer ${formData.plan_id === 'plan-ent' ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-500' : 'border-slate-200'}`}>
                <h4 className="font-bold text-slate-900">Enterprise Plan</h4>
                <p className="text-lg font-black text-purple-600 mt-1">₹3,99,999/yr</p>
                <p className="text-[11px] text-slate-500 mt-2">Unlimited Wards & AI Telemetry</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 5 */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center">
              <Puzzle className="w-4 h-4 text-purple-600 mr-2" /> Step 5: Module Selection
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {availableModules.map((m) => {
                const isChecked = formData.selected_module_ids.includes(m.id);
                return (
                  <div key={m.id} onClick={() => handleModuleToggle(m.id)} className={`p-3 rounded-lg border cursor-pointer flex items-start space-x-3 ${isChecked ? 'bg-amber-50/60 border-amber-500' : 'bg-slate-50 border-slate-200'}`}>
                    <input type="checkbox" checked={isChecked} readOnly className="mt-1" />
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{m.name}</p>
                      <p className="text-[10px] text-slate-500">{m.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 6 */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center">
              <MapPin className="w-4 h-4 text-rose-600 mr-2" /> Step 6: Initial Ward Configuration
            </h3>
            <p className="text-xs text-slate-500">Configure initial ward boundaries (can configure remaining wards later).</p>
            <div className="space-y-2">
              {formData.initial_wards.map((w, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold flex justify-between">
                  <span>{w.ward_name}</span>
                  <span className="text-slate-500">{w.population} Citizens</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 7 */}
        {currentStep === 7 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mr-2" /> Step 7: Review & Provision Tenant
            </h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <p><strong>Corporation Name:</strong> {formData.corporation_name || 'Not provided'}</p>
              <p><strong>Corporation Code:</strong> {formData.corporation_code || 'Not provided'}</p>
              <p><strong>Admin Email:</strong> {formData.admin_email || formData.email}</p>
              <p><strong>Selected Plan:</strong> {formData.plan_id}</p>
              <p><strong>Enabled Modules:</strong> {formData.selected_module_ids.length} Modules</p>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex justify-between pt-6 border-t border-slate-100">
          <Button type="button" variant="outline" disabled={currentStep === 1} onClick={() => setCurrentStep(currentStep - 1)}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>

          {currentStep < 7 ? (
            <Button type="button" variant="primary" onClick={() => setCurrentStep(currentStep + 1)} className="bg-amber-600 hover:bg-amber-700">
              Next Step <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button type="button" variant="success" isLoading={submitting} onClick={handleSubmitWizard}>
              CREATE CORPORATION
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
