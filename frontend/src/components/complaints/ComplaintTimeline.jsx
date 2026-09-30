import React from 'react';
import { CheckCircle2, Clock, User, ShieldAlert } from 'lucide-react';

export const ComplaintTimeline = ({ history = [] }) => {
  if (!history || history.length === 0) {
    return <p className="text-xs text-slate-400 italic">No timeline entries recorded yet.</p>;
  }

  return (
    <div className="space-y-4">
      {history.map((item, idx) => (
        <div key={idx} className="flex items-start space-x-3 text-xs">
          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
            {idx + 1}
          </div>
          <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900">{item.to_status ? item.to_status.replace(/_/g, ' ') : 'REGISTERED'}</span>
              <span className="text-[10px] text-slate-400 font-semibold">{new Date(item.created_at).toLocaleString('en-IN')}</span>
            </div>
            {item.remarks && <p className="text-slate-600 mt-1">{item.remarks}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};
