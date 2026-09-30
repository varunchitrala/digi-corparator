import React, { useState } from 'react';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { Header } from './Header';
import { Footer } from './Footer';

export const SuperAdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <SuperAdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-12">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};
