import React from 'react';

export const Footer = () => {
  return (
    <footer className="mt-auto py-4 px-6 bg-white border-t border-slate-200/80 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
      <p>© 2026 Digital Corporator & Smart Ward Management Platform. All rights reserved.</p>
      <div className="flex items-center space-x-4">
        <span>Version 1.0.0 (Phase 1)</span>
        <span>•</span>
        <span className="text-emerald-600 font-semibold flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span> Multi-Tenant Active
        </span>
      </div>
    </footer>
  );
};
