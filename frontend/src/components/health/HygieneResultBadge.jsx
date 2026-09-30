import React from 'react';

export const HygieneResultBadge = ({ result }) => {
  const getBadgeStyle = (r) => {
    switch (r) {
      case 'COMPLIANT':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'PARTIALLY_COMPLIANT':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'NON_COMPLIANT':
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyle(result)}`}>
      {result || 'COMPLIANT'}
    </span>
  );
};
