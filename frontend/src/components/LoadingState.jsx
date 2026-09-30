import React from 'react';

export const LoadingState = ({ message = "Loading data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white/80 rounded-xl border border-slate-200">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="text-xs font-semibold text-slate-600">{message}</p>
    </div>
  );
};
