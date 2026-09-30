import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { LoadingState } from '../../components/LoadingState';
import { WorkStatusBadge } from '../../components/works/WorkStatusBadge';
import { ProgressProgressBar } from '../../components/works/ProgressProgressBar';
import { MilestoneTracker } from '../../components/works/MilestoneTracker';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { ArrowLeft, CheckCircle2, FileText, HardHat, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const WorkDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Modals state
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isWorkOrderOpen, setIsWorkOrderOpen] = useState(false);
  const [isBillOpen, setIsBillOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [approvalType, setApprovalType] = useState('ADMINISTRATIVE');
  const [contractorId, setContractorId] = useState('cnt-001');
  const [contractAmount, setContractAmount] = useState(500000);
  const [physicalProgress, setPhysicalProgress] = useState(50);
  const [financialProgress, setFinancialProgress] = useState(40);
  const [grossAmount, setGrossAmount] = useState(100000);
  const [deductions, setDeductions] = useState(5000);

  useEffect(() => {
    fetchWorkDetails();
  }, [id]);

  const fetchWorkDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/corporation/works/${id}`);
      setWork(res.data);
    } catch (err) {
      console.error('Failed to fetch work details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/corporation/works/${id}/approve`, { approval_type: approvalType });
      alert(`Work ${approvalType} approval granted!`);
      setIsApproveOpen(false);
      fetchWorkDetails();
    } catch (err) {
      alert(err.message || 'Approval failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWorkOrderSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post(`/corporation/works/${id}/work-order`, {
        contractor_id: contractorId,
        contract_amount: contractAmount
      });
      alert(`Work Order Issued! Number: ${res.data.work_order_number}`);
      setIsWorkOrderOpen(false);
      fetchWorkDetails();
    } catch (err) {
      alert(err.message || 'Work Order failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProgressSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/corporation/works/${id}/progress`, {
        physical_progress: physicalProgress,
        financial_progress: financialProgress
      });
      alert('Work progress updated!');
      setIsProgressOpen(false);
      fetchWorkDetails();
    } catch (err) {
      alert(err.message || 'Progress update failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBillSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post(`/corporation/works/${id}/bills`, {
        gross_amount: grossAmount,
        deductions: deductions
      });
      alert(`Bill Submitted! Number: ${res.data.bill_number} (Net Amount: ${formatCurrency(res.data.net_amount)})`);
      setIsBillOpen(false);
      fetchWorkDetails();
    } catch (err) {
      alert(err.message || 'Bill submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Fetching development work details..." />;
  if (!work) return <div className="p-6 bg-white rounded-xl">Work not found</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Button variant="ghost" size="sm" onClick={() => navigate('/corporation/works')}>
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Works Directory
      </Button>

      {/* Main Header Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                {work.work_code}
              </span>
              <span className="text-xs text-slate-500 font-semibold">{work.category_name}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-2">{work.work_title}</h2>
          </div>
          <div className="text-right space-y-1">
            <WorkStatusBadge status={work.status} />
            <p className="text-xs font-mono font-bold text-emerald-700">{formatCurrency(work.estimated_cost)}</p>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          <Button variant="primary" size="sm" onClick={() => setIsApproveOpen(true)}>
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve Stage
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsWorkOrderOpen(true)}>
            <FileText className="w-3.5 h-3.5 mr-1" /> Issue Work Order
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsProgressOpen(true)}>
            <HardHat className="w-3.5 h-3.5 mr-1" /> Update Progress
          </Button>
          <Button variant="success" size="sm" onClick={() => setIsBillOpen(true)}>
            <DollarSign className="w-3.5 h-3.5 mr-1" /> Submit Bill
          </Button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-2 flex space-x-2 text-xs font-bold">
        {['overview', 'estimate', 'approvals', 'milestones', 'progress', 'bills'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg capitalize transition-colors ${
              activeTab === tab ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        {activeTab === 'overview' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <p><strong>Ward:</strong> {work.ward_name || 'Ward 24'}</p>
                <p><strong>Department:</strong> {work.department_name || 'Engineering'}</p>
                <p><strong>Contractor:</strong> {work.contractor_name || 'Unassigned'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <p><strong>Estimated Cost:</strong> {formatCurrency(work.estimated_cost)}</p>
                <p><strong>Approved Sanction:</strong> {formatCurrency(work.approved_cost)}</p>
                <p><strong>Location Address:</strong> {work.location_address}</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-700 uppercase mb-1">Physical vs Financial Progress</h4>
              <ProgressProgressBar physicalProgress={work.physical_progress} financialProgress={work.financial_progress} />
            </div>
          </div>
        )}

        {activeTab === 'estimate' && (
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 pb-2 border-b border-slate-100">Itemized Technical Estimate</h4>
            <div className="space-y-2">
              {work.estimate_items?.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg flex justify-between items-center border border-slate-200">
                  <div>
                    <h5 className="font-bold text-slate-900">{item.item_name}</h5>
                    <p className="text-[10px] text-slate-500">{item.quantity} {item.unit} @ ₹{item.rate}/unit</p>
                  </div>
                  <span className="font-mono font-bold text-emerald-700">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'milestones' && (
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 pb-2 border-b border-slate-100 text-xs">Milestone Sequence Progress</h4>
            <MilestoneTracker milestones={work.milestones} />
          </div>
        )}
      </div>

      {/* Approval Modal */}
      <Modal isOpen={isApproveOpen} onClose={() => setIsApproveOpen(false)} title="Grant Project Approval Stage">
        <form onSubmit={handleApproveSubmit} className="space-y-4">
          <Select label="Approval Stage" value={approvalType} onChange={(e) => setApprovalType(e.target.value)} options={[
            { value: 'TECHNICAL', label: 'Technical Approval' },
            { value: 'ADMINISTRATIVE', label: 'Administrative Approval' },
            { value: 'FINANCIAL', label: 'Financial Sanction' }
          ]} />
          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsApproveOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Confirm Approval</Button>
          </div>
        </form>
      </Modal>

      {/* Work Order Modal */}
      <Modal isOpen={isWorkOrderOpen} onClose={() => setIsWorkOrderOpen(false)} title="Issue Municipal Work Order">
        <form onSubmit={handleWorkOrderSubmit} className="space-y-4">
          <Input label="Contract Amount (₹)" type="number" value={contractAmount} onChange={(e) => setContractAmount(e.target.value)} required />
          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsWorkOrderOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Issue Work Order</Button>
          </div>
        </form>
      </Modal>

      {/* Progress Modal */}
      <Modal isOpen={isProgressOpen} onClose={() => setIsProgressOpen(false)} title="Update Project Progress %">
        <form onSubmit={handleProgressSubmit} className="space-y-4">
          <Input label="Physical Progress (%)" type="number" min="0" max="100" value={physicalProgress} onChange={(e) => setPhysicalProgress(e.target.value)} required />
          <Input label="Financial Utilization (%)" type="number" min="0" max="100" value={financialProgress} onChange={(e) => setFinancialProgress(e.target.value)} required />
          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsProgressOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Save Progress</Button>
          </div>
        </form>
      </Modal>

      {/* Bill Modal */}
      <Modal isOpen={isBillOpen} onClose={() => setIsBillOpen(false)} title="Submit Contractor Bill">
        <form onSubmit={handleBillSubmit} className="space-y-4">
          <Input label="Gross Bill Amount (₹)" type="number" value={grossAmount} onChange={(e) => setGrossAmount(e.target.value)} required />
          <Input label="TDS / Security Deductions (₹)" type="number" value={deductions} onChange={(e) => setDeductions(e.target.value)} required />
          <div className="p-3 bg-slate-50 rounded-lg text-xs font-mono font-bold text-slate-800">
            Net Payable Bill: {formatCurrency(Math.max(0, grossAmount - deductions))}
          </div>
          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsBillOpen(false)}>Cancel</Button>
            <Button type="submit" variant="success" isLoading={submitting}>Submit Bill</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
