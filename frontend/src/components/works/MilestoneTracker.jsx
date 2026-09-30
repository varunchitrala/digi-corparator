import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

export const MilestoneTracker = ({ milestones = [] }) => {
  if (!milestones || milestones.length === 0) {
    return <p className="text-xs text-slate-400 italic">No milestone stages configured for this work.</p>;
  }

  return (
    <div className="space-y-3 text-xs">
      {milestones.map((m, idx) => (
        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
              m.status === 'COMPLETED' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              {m.status === 'COMPLETED' ? <CheckCircle2 className="w-4 h-4" /> : m.sequence}
            </div>
            <div>
              <h5 className="font-bold text-slate-900">{m.milestone_name}</h5>
              <p className="text-[10px] text-slate-500">Weightage: {m.percentage}% of project scope</p>
            </div>
          </div>
          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
            m.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
          }`}>
            {m.status ? m.status.replace(/_/g, ' ') : 'NOT STARTED'}
          </span>
        </div>
      ))}
    </div>
  );
};
