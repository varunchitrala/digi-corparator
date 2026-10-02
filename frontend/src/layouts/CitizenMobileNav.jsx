import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  FileText,
  Receipt,
  User
} from 'lucide-react';

export const CitizenMobileNav = () => {
  const items = [
    { label: 'HOME', path: '/citizen/dashboard', icon: LayoutDashboard },
    { label: 'GRIEVANCE', path: '/citizen/complaints', icon: AlertTriangle },
    { label: 'SERVICES', path: '/citizen/services', icon: FileText },
    { label: 'TAX/BILLS', path: '/citizen/revenue', icon: Receipt },
    { label: 'PROFILE', path: '/citizen/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-xl lg:hidden flex items-center justify-around py-2 px-1">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-bold tracking-tight transition-colors ${
                isActive ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
