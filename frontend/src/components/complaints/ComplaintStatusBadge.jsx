import React from 'react';

export const ComplaintStatusBadge = ({ status }) => {
  const badgeStyles = {
    REGISTERED: 'bg-blue-100 text-blue-800 border-blue-200',
    TRIAGED: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    ASSIGNED: 'bg-purple-100 text-purple-800 border-purple-200',
    ACCEPTED: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    INSPECTION_PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
    INSPECTION_COMPLETED: 'bg-teal-100 text-teal-800 border-teal-200',
    IN_PROGRESS: 'bg-amber-100 text-amber-800 border-amber-200 font-bold',
    RESOLVED: 'bg-emerald-100 text-emerald-800 border-emerald-200 font-bold',
    CITIZEN_VERIFICATION: 'bg-blue-100 text-blue-800 border-blue-300 font-bold animate-pulse',
    CLOSED: 'bg-slate-100 text-slate-700 border-slate-200',
    REOPENED: 'bg-rose-100 text-rose-800 border-rose-200 font-bold',
    ESCALATED: 'bg-red-100 text-red-900 border-red-300 font-extrabold',
    REJECTED: 'bg-slate-200 text-slate-600 border-slate-300',
    CANCELLED: 'bg-slate-200 text-slate-500 border-slate-300'
  };

  const style = badgeStyles[status] || 'bg-slate-100 text-slate-800 border-slate-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${style}`}>
      {status ? status.replace(/_/g, ' ') : 'REGISTERED'}
    </span>
  );
};
