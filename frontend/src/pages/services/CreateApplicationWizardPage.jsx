import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { LoadingState } from '../../components/LoadingState';
import { CheckCircle2, ArrowLeft, ArrowRight, Upload } from 'lucide-react';

export const CreateApplicationWizardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    applicant_name: 'Rahul Sharma',
    mobile: '9822012345',
    email: 'rahul.sharma@example.com',
    property_number: 'PROP-W24-1002',
    address: 'Flat 402, Shiv Shahi Apartments, Ward 24'
  });

  useEffect(() => {
    fetchSchema();
  }, [id]);

  const fetchSchema = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/citizen/services/${id}`);
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch schema:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await api.post(`/citizen/services/${id}/applications`, {
        form_data: formData,
        documents: [{ name: 'Identity Proof', url: 'https://via.placeholder.com/150' }],
        ward_id: 'w-demo-024'
      });
      alert(`Application Submitted Successfully! Application No: ${res.data.application_number}`);
      navigate('/citizen/applications');
    } catch (err) {
      alert(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Loading Dynamic Application Form..." />;

  const s = data?.service || {};

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
          APPLICATION WIZARD: STEP {step} OF 3
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">{s.service_name}</h2>

        {step === 1 && (
          <div className="space-y-4">
            <Input label="Applicant Full Name" value={formData.applicant_name} onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Mobile Number" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} required />
              <Input label="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Input label="Municipal Property Number" value={formData.property_number} onChange={(e) => setFormData({ ...formData, property_number: e.target.value })} required />
            <Input label="Premises / Site Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900">Application Summary & Review</h4>
              <p>Applicant: <span className="font-bold">{formData.applicant_name}</span></p>
              <p>Property No: <span className="font-bold">{formData.property_number}</span></p>
              <p>Processing SLA: <span className="font-bold text-blue-600">{s.processing_days} Working Days</span></p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
            </Button>
          ) : <div />}

          {step < 3 ? (
            <Button variant="primary" onClick={() => setStep(step + 1)} className="bg-blue-600 hover:bg-blue-700">
              Next Step <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          ) : (
            <Button variant="success" onClick={handleSubmit} isLoading={submitting} className="bg-emerald-600 hover:bg-emerald-700">
              Submit Application
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
