import React from 'react';

export const ApplicationStatusBadge = ({ status }) => {
  const getBadgeStyle = (st) => {
    switch (st) {
      case 'DRAFT':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'SUBMITTED':
      case 'RESUBMITTED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PAYMENT_PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'PAYMENT_COMPLETED':
      case 'UNDER_SCRUTINY':
      case 'DOCUMENT_VERIFICATION':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'INSPECTION_PENDING':
      case 'INSPECTION_COMPLETED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'CLARIFICATION_REQUIRED':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'APPROVAL_PENDING':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'APPROVED':
      case 'CERTIFICATE_GENERATED':
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'REJECTED':
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'CLOSED':
        return 'bg-slate-200 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyle(status)}`}>
      {status ? status.replace(/_/g, ' ') : 'UNKNOWN'}
    </span>
  );
};
