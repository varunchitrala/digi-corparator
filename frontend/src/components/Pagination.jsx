import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-200 rounded-b-xl text-xs text-slate-600">
      <div>
        Page <span className="font-semibold text-slate-900">{currentPage}</span> of{' '}
        <span className="font-semibold text-slate-900">{totalPages}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex items-center px-2.5 py-1.5 border border-slate-300 rounded-md text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </button>
        <button
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center px-2.5 py-1.5 border border-slate-300 rounded-md text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};
