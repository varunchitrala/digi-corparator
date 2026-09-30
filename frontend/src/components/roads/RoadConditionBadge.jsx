import React from 'react';

export const RoadConditionBadge = ({ condition }) => {
  const getBadgeStyle = (c) => {
    switch (c) {
      case 'EXCELLENT':
      case 'GOOD':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'FAIR':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'POOR':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'VERY_POOR':
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyle(condition)}`}>
      {condition || 'GOOD'}
    </span>
  );
};
