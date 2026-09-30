import React from 'react';

export const WorkStatusBadge = ({ status }) => {
  const badgeStyles = {
    DRAFT: 'bg-slate-100 text-slate-700 border-slate-200',
    PROPOSED: 'bg-blue-100 text-blue-800 border-blue-200',
    ESTIMATE_PREPARED: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    TECHNICAL_APPROVAL_PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
    TECHNICAL_APPROVED: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    ADMIN_APPROVAL_PENDING: 'bg-purple-100 text-purple-800 border-purple-200',
    ADMIN_APPROVED: 'bg-teal-100 text-teal-800 border-teal-200 font-bold',
    FINANCIAL_APPROVAL_PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
    FINANCIAL_APPROVED: 'bg-emerald-100 text-emerald-800 border-emerald-200 font-bold',
    TENDER_PENDING: 'bg-purple-100 text-purple-800 border-purple-200',
    TENDERED: 'bg-indigo-100 text-indigo-800 border-indigo-200 font-bold',
    CONTRACTOR_SELECTED: 'bg-cyan-100 text-cyan-800 border-cyan-200 font-bold',
    WORK_ORDER_ISSUED: 'bg-blue-100 text-blue-800 border-blue-300 font-bold',
    NOT_STARTED: 'bg-slate-100 text-slate-700 border-slate-200',
    ONGOING: 'bg-emerald-100 text-emerald-800 border-emerald-200 font-bold animate-pulse',
    ON_HOLD: 'bg-amber-100 text-amber-800 border-amber-200',
    DELAYED: 'bg-rose-100 text-rose-800 border-rose-300 font-extrabold',
    COMPLETED: 'bg-blue-100 text-blue-800 border-blue-200 font-bold',
    FINAL_INSPECTION: 'bg-purple-100 text-purple-800 border-purple-200 font-bold',
    FINAL_APPROVED: 'bg-teal-100 text-teal-800 border-teal-200 font-bold',
    CLOSED: 'bg-slate-100 text-slate-700 border-slate-200 font-bold',
    CANCELLED: 'bg-slate-200 text-slate-500 border-slate-300'
  };

  const style = badgeStyles[status] || 'bg-slate-100 text-slate-800 border-slate-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${style}`}>
      {status ? status.replace(/_/g, ' ') : 'PROPOSED'}
    </span>
  );
};
