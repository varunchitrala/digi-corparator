import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Map,
  HardHat,
  Calendar,
  MoreHorizontal
} from 'lucide-react';

export const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mobileNavItems = [
    { label: 'HOME', path: '/', icon: Home },
    { label: 'WARD', path: '/gis', icon: Map },
    { label: 'WORKS', path: '/works', icon: HardHat },
    { label: 'MEETINGS', path: '/meetings', icon: Calendar },
    { label: 'MORE', path: '/complaints', icon: MoreHorizontal },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Desktop & Mobile Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 lg:pb-8">
          {children}
        </main>

        <Footer />
      </div>

      {/* Mobile Bottom Navigation (Visible only on mobile/tablet screens < 1024px) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/90 shadow-lg lg:hidden flex items-center justify-around py-2 px-1">
        {mobileNavItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-extrabold tracking-wider transition-colors ${
                  isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
