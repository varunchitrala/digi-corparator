import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
      <h1 className="text-6xl font-black text-slate-900">404</h1>
      <h2 className="text-xl font-bold text-slate-800 mt-2">Page Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
        The page or municipal module you requested is unavailable or currently being initialized in Phase 1.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm"
      >
        <Home className="w-4 h-4 mr-2" /> Back to Dashboard
      </Link>
    </div>
  );
};
