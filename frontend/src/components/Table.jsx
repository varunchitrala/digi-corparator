import React from 'react';

export const Table = ({ headers = [], children, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white ${className}`}>
      <table className="w-full text-left text-sm text-slate-700 border-collapse">
        <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="px-6 py-3.5">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-normal">
          {children}
        </tbody>
      </table>
    </div>
  );
};
