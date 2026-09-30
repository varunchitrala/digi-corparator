import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { CheckCircle2, ChevronRight, ChevronLeft, AlertTriangle, MapPin, Camera } from 'lucide-react';

export const CreateComplaintWizardPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [duplicates, setDuplicates] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: 'cat-001',
    subcategory_id: 'sub-001',
    priority: 'MEDIUM',
    location_address: 'Shivaji Nagar Main Road, Ward 24',
    latitude: 19.8762,
    longitude: 75.3433,
    ward_id: 'w-demo-024',
    source: 'WEB'
  });

  const categories = [
    { value: 'cat-001', label: 'Electrical & Streetlight' },
    { value: 'cat-002', label: 'Solid Waste & Garbage' },
    { value: 'cat-003', label: 'Roads & Potholes' },
    { value: 'cat-004', label: 'Water Supply & Leakage' }
  ];

  const subcategories = [
    { value: 'sub-001', label: 'Streetlight Light Blinking / Broken Pole' },
    { value: 'sub-002', label: 'Live Wire Hazard' },
    { value: 'sub-003', label: 'Garbage Dump & Bin Overflow' },
    { value: 'sub-004', label: 'Deep Pothole on Main Road' },
    { value: 'sub-005', label: 'Water Supply Line Leakage' }
  ];

  const handleSubmitComplaint = async () => {
    setSubmitting(true);
    try {
      const res = await api.post('/citizen/complaints', formData);
      if (res.data.possibleDuplicates && res.data.possibleDuplicates.length > 0) {
        setDuplicates(res.data.possibleDuplicates);
      }
      alert(`Complaint Registered Successfully! Reference ID: ${res.data.complaint_number}`);
      navigate(`/citizen/complaints/${res.data.complaint_id}`);
    } catch (err) {
      alert(err.message || 'Failed to register complaint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
          5-STEP COMPLAINT REGISTRATION
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Register New Ward Complaint</h2>
        <p className="text-xs text-slate-500">Provide category, details, location address, and photo proof for auto SLA assignment.</p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-around">
        {['Category', 'Subcategory', 'Grievance Details', 'Location & GPS', 'Review & Submit'].map((label, idx) => {
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
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">Step 1: Select Complaint Category</h3>
            <Select label="Category" value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} options={categories} />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">Step 2: Select Subcategory</h3>
            <Select label="Subcategory" value={formData.subcategory_id} onChange={(e) => setFormData({ ...formData, subcategory_id: e.target.value })} options={subcategories} />
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">Step 3: Grievance Details</h3>
            <Input label="Complaint Title" placeholder="e.g. Streetlight pole blinking continuously" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Detailed Description</label>
              <textarea rows={4} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
            </div>
            <Select label="Priority Level" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} options={[
              { value: 'LOW', label: 'Low (72h SLA)' },
              { value: 'MEDIUM', label: 'Medium (48h SLA)' },
              { value: 'HIGH', label: 'High (24h SLA)' },
              { value: 'CRITICAL', label: 'Critical Safety Hazard (12h SLA)' }
            ]} />
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center">
              <MapPin className="w-4 h-4 text-rose-600 mr-2" /> Step 4: Location & GPS Coordinates
            </h3>
            <Input label="Street / Landmark Address" value={formData.location_address} onChange={(e) => setFormData({ ...formData, location_address: e.target.value })} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Latitude" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} />
              <Input label="Longitude" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} />
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">Step 5: Review & Submit Grievance</h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <p><strong>Title:</strong> {formData.title || 'Not provided'}</p>
              <p><strong>Description:</strong> {formData.description || 'Not provided'}</p>
              <p><strong>Priority:</strong> {formData.priority}</p>
              <p><strong>Location:</strong> {formData.location_address}</p>
              <p><strong>Estimated SLA:</strong> {formData.priority === 'CRITICAL' ? '12 Hours' : formData.priority === 'HIGH' ? '24 Hours' : '48 Hours'}</p>
            </div>
          </div>
        )}

        {/* Wizard Navigation */}
        <div className="flex justify-between pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" disabled={currentStep === 1} onClick={() => setCurrentStep(currentStep - 1)}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>

          {currentStep < 5 ? (
            <Button type="button" variant="primary" onClick={() => setCurrentStep(currentStep + 1)} className="bg-blue-600 hover:bg-blue-700">
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button type="button" variant="success" isLoading={submitting} onClick={handleSubmitComplaint}>
              SUBMIT COMPLAINT
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
