import React from 'react';

export const TenderStatusBadge = ({ status }) => {
  const getBadgeStyle = (st) => {
    switch (st) {
      case 'PUBLISHED':
      case 'OPEN':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'UNDER_TECHNICAL_EVALUATION':
      case 'UNDER_FINANCIAL_EVALUATION':
      case 'AWAITING_APPROVAL':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CLOSING_SOON':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'AWARDED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyle(status)}`}>
      {status || 'DRAFT'}
    </span>
  );
};
