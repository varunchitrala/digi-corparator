import React from 'react';

export const IotStatusBadge = ({ status }) => {
  const getStyle = (st) => {
    switch (st) {
      case 'ONLINE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'ALERT':
        return 'bg-rose-100 text-rose-800 border-rose-200 animate-pulse';
      case 'OFFLINE':
      case 'MAINTENANCE':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStyle(status)}`}>
      ● {status || 'ONLINE'}
    </span>
  );
};
