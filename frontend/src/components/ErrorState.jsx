import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const ErrorState = ({ message = "Failed to load data.", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50/50 rounded-xl border border-red-200">
      <div className="p-3 bg-red-100 rounded-full text-red-600 mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-bold text-red-900">An Error Occurred</h4>
      <p className="text-xs text-red-700 mt-1 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
