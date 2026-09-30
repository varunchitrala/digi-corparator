import React, { useState } from 'react';
import { CorporatorSidebar } from './CorporatorSidebar';
import { CorporatorMobileNav } from './CorporatorMobileNav';
import { Header } from './Header';
import { Footer } from './Footer';

export const CorporatorLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <CorporatorSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64 flex flex-col flex-1 min-w-0 pb-16 lg:pb-0">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
        <Footer />
      </div>

      <CorporatorMobileNav />
    </div>
  );
};
