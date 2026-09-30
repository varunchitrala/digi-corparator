import React from 'react';

export const StatusBadge = ({ status, size = 'sm' }) => {
  const getBadgeStyle = (statusStr) => {
    const s = String(statusStr).toUpperCase();

    switch (s) {
      case 'REGISTERED':
      case 'PROPOSED':
      case 'PENDING':
      case 'LOW':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'IN_PROGRESS':
      case 'ASSIGNED':
      case 'ONGOING':
      case 'MEDIUM':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'RESOLVED':
      case 'COMPLETED':
      case 'APPROVED':
      case 'ACTIVE':
      case 'CLOSED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'DELAYED':
      case 'ESCALATED':
      case 'HIGH':
      case 'CRITICAL':
      case 'DUE_TODAY':
      case 'OVERDUE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CANCELLED':
      case 'REJECTED':
      case 'SUSPENDED':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  return (
    <span className={`inline-flex items-center font-semibold rounded-full border ${getBadgeStyle(status)} ${sizeStyles[size]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75" />
      {String(status).replace(/_/g, ' ')}
    </span>
  );
};
