import React from 'react';

export const EmployeeStatusBadge = ({ status }) => {
  const getBadgeStyle = (st) => {
    switch (st) {
      case 'ACTIVE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'PROBATION':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'INACTIVE':
      case 'ON_NOTICE':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'SUSPENDED':
      case 'TERMINATED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'RESIGNED':
      case 'RETIRED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyle(status)}`}>
      {status || 'ACTIVE'}
    </span>
  );
};
