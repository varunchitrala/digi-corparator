import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { CheckCircle2, ChevronRight, ChevronLeft, Plus, Trash2, MapPin, HardHat } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const CreateWorkWizardPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    work_title: '',
    description: '',
    ward_id: 'w-demo-024',
    department_id: 'd-demo-001',
    category_id: 'wcat-001',
    source_type: 'CORPORATION_PLAN',
    location_address: 'Shivaji Park Main Road, Ward 24',
    latitude: 19.8762,
    longitude: 75.3433
  });

  const [estimateItems, setEstimateItems] = useState([
    { item_name: 'Asphalt Concrete Layer (50mm)', description: 'Dense bituminous macadam', quantity: 1500, unit: 'sq_m', rate: 450 }
  ]);

  const handleAddItem = () => {
    setEstimateItems([
      ...estimateItems,
      { item_name: 'Excavation & Base Preparation', description: '', quantity: 100, unit: 'cu_m', rate: 250 }
    ]);
  };

  const handleRemoveItem = (index) => {
    setEstimateItems(estimateItems.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, val) => {
    const updated = [...estimateItems];
    updated[index][field] = val;
    setEstimateItems(updated);
  };

  const totalEstimateCost = estimateItems.reduce((sum, i) => sum + (parseFloat(i.quantity || 0) * parseFloat(i.rate || 0)), 0);

  const handleSubmitWork = async () => {
    setSubmitting(true);
    try {
      const res = await api.post('/corporation/works', {
        ...formData,
        estimate_items: estimateItems
      });
      alert(`Development Work Created Successfully! Reference Code: ${res.data.work_code}`);
      navigate(`/corporation/works/${res.data.work_id}`);
    } catch (err) {
      alert(err.message || 'Work creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
          DEVELOPMENT WORK WIZARD
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Create New Municipal Project</h2>
        <p className="text-xs text-slate-500">Provide basic project details, location address, and itemized technical estimate.</p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-around">
        {['Basic Details', 'Location & GPS', 'Technical Estimate', 'Review & Submit'].map((label, idx) => {
          const stepNum = idx + 1;
          const isActive = currentStep === stepNum;
          const isDone = currentStep > stepNum;
          return (
            <div key={idx} className="flex items-center space-x-1.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                isActive ? 'bg-blue-600 text-white shadow-md' : isDone ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
              </div>
              <span className={`text-xs font-bold hidden sm:inline ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
            </div>
          );
        })}
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">Step 1: Basic Work Information</h3>
            <Input label="Work Title" placeholder="e.g. Asphalting & Drain Construction at Ward 24 Main Road" value={formData.work_title} onChange={(e) => setFormData({ ...formData, work_title: e.target.value })} required />
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Scope Description</label>
              <textarea rows={3} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Category" value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} options={[
                { value: 'wcat-001', label: 'Road Construction & Resurfacing' },
                { value: 'wcat-002', label: 'Footpath & Paver Blocks' },
                { value: 'wcat-003', label: 'Storm Water Drainage System' },
                { value: 'wcat-004', label: 'Water Supply Pipeline' }
              ]} />
              <Select label="Source Type" value={formData.source_type} onChange={(e) => setFormData({ ...formData, source_type: e.target.value })} options={[
                { value: 'CORPORATOR_PROPOSAL', label: 'Corporator Ward Proposal' },
                { value: 'CORPORATION_PLAN', label: 'Annual Corporation Development Plan' },
                { value: 'EMERGENCY_REQUIREMENT', label: 'Emergency Requirement' }
              ]} />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center">
              <MapPin className="w-4 h-4 text-rose-600 mr-2" /> Step 2: Location & GPS Coordinates
            </h3>
            <Input label="Site Location Address" value={formData.location_address} onChange={(e) => setFormData({ ...formData, location_address: e.target.value })} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Latitude" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} />
              <Input label="Longitude" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Step 3: Itemized Technical Estimate</h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Estimate Item
              </Button>
            </div>

            <div className="space-y-3">
              {estimateItems.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-12 gap-2 text-xs items-center">
                  <div className="col-span-4">
                    <input type="text" placeholder="Item Name" className="w-full p-2 rounded border border-slate-300 text-xs" value={item.item_name} onChange={(e) => handleItemChange(idx, 'item_name', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <input type="number" placeholder="Qty" className="w-full p-2 rounded border border-slate-300 text-xs" value={item.quantity} onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <input type="text" placeholder="Unit" className="w-full p-2 rounded border border-slate-300 text-xs" value={item.unit} onChange={(e) => handleItemChange(idx, 'unit', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <input type="number" placeholder="Rate (₹)" className="w-full p-2 rounded border border-slate-300 text-xs" value={item.rate} onChange={(e) => handleItemChange(idx, 'rate', e.target.value)} />
                  </div>
                  <div className="col-span-2 flex items-center justify-between font-bold text-emerald-700">
                    <span>{formatCurrency(parseFloat(item.quantity || 0) * parseFloat(item.rate || 0))}</span>
                    <button type="button" onClick={() => handleRemoveItem(idx)} className="text-rose-600 hover:text-rose-800"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center text-xs">
              <span className="font-extrabold text-emerald-900">Total Technical Estimate Amount:</span>
              <span className="text-lg font-mono font-black text-emerald-700">{formatCurrency(totalEstimateCost)}</span>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">Step 4: Review Project Submission</h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <p><strong>Title:</strong> {formData.work_title || 'Not provided'}</p>
              <p><strong>Description:</strong> {formData.description || 'Not provided'}</p>
              <p><strong>Location:</strong> {formData.location_address}</p>
              <p><strong>Total Estimate Amount:</strong> {formatCurrency(totalEstimateCost)}</p>
            </div>
          </div>
        )}

        {/* Wizard Navigation */}
        <div className="flex justify-between pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" disabled={currentStep === 1} onClick={() => setCurrentStep(currentStep - 1)}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>

          {currentStep < 4 ? (
            <Button type="button" variant="primary" onClick={() => setCurrentStep(currentStep + 1)} className="bg-blue-600 hover:bg-blue-700">
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button type="button" variant="success" isLoading={submitting} onClick={handleSubmitWork}>
              CREATE WORK PROJECT
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
