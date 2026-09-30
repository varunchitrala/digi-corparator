import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export const SlaIndicator = ({ slaDueAt, isBreached }) => {
  if (!slaDueAt) {
    return <span className="text-xs font-bold text-slate-500">24 Hours Standard SLA</span>;
  }

  const dueDate = new Date(slaDueAt);
  const now = new Date();
  const diffMs = dueDate - now;

  if (isBreached || diffMs < 0) {
    return (
      <span className="inline-flex items-center text-xs font-extrabold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
        <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-600" /> SLA BREACHED
      </span>
    );
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <span className={`inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-md border ${
      diffHours < 4 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-50 text-slate-700 border-slate-200'
    }`}>
      <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" /> {diffHours}h {diffMins}m remaining
    </span>
  );
};
