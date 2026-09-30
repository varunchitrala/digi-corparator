import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({ title = "No data found", description = "There are no records to display at this time." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs">
      <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
        <Inbox className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-slate-900">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mt-1">{description}</p>
    </div>
  );
};
