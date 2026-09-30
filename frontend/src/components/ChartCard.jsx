import React from 'react';

export const ChartCard = ({ title, subtitle, action, children }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-base font-bold text-slate-900 tracking-tight">{title}</h4>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="flex-1 w-full min-h-[260px]">
        {children}
      </div>
    </div>
  );
};
