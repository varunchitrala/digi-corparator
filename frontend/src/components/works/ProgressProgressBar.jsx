import React from 'react';

export const ProgressProgressBar = ({ physicalProgress = 0, financialProgress = 0 }) => {
  return (
    <div className="space-y-2 text-xs">
      <div>
        <div className="flex justify-between font-bold text-slate-700 mb-1">
          <span>Physical Progress</span>
          <span className="text-emerald-600 font-extrabold">{physicalProgress}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, physicalProgress))}%` }}
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between font-bold text-slate-700 mb-1">
          <span>Financial Utilization</span>
          <span className="text-blue-600 font-extrabold">{financialProgress}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, financialProgress))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
