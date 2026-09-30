import React from 'react';

export const LeakageStatusBadge = ({ status }) => {
  const getBadgeStyle = (st) => {
    switch (st) {
      case 'REPAIRED':
      case 'CLOSED':
      case 'VERIFIED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'IN_PROGRESS':
      case 'WORK_ASSIGNED':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'REPORTED':
      case 'CONFIRMED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyle(status)}`}>
      {status || 'REPORTED'}
    </span>
  );
};
