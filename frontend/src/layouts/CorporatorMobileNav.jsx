import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Building, HardHat, CalendarDays, MoreHorizontal, Bell, IndianRupee, FileText, Bot, User, Layers, FileSpreadsheet } from 'lucide-react';

export const CorporatorMobileNav = () => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainTabs = [
    { label: 'HOME', path: '/corporator/dashboard', icon: Home },
    { label: 'WARD', path: '/corporator/ward', icon: Building },
    { label: 'WORKS', path: '/corporator/works', icon: HardHat },
    { label: 'MEETINGS', path: '/corporator/meetings', icon: CalendarDays }
  ];

  const moreItems = [
    { label: 'Funds Utilization', path: '/corporator/funds', icon: IndianRupee },
    { label: 'Proposals', path: '/corporator/proposals', icon: FileText },
    { label: 'GIS Spatial Map', path: '/corporator/gis', icon: Layers },
    { label: 'Reports & MIS', path: '/corporator/reports', icon: FileSpreadsheet },
    { label: 'Notifications', path: '/corporator/notifications', icon: Bell },
    { label: 'AI NagarSevak', path: '/corporator/ai-assistant', icon: Bot },
    { label: 'My Profile', path: '/corporator/profile', icon: User }
  ];

  return (
    <>
      {/* Drawer Overlay for MORE menu */}
      {showMoreMenu && (
        <div onClick={() => setShowMoreMenu(false)} className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs lg:hidden">
          <div className="absolute bottom-16 left-0 right-0 bg-white rounded-t-2xl p-4 space-y-3 shadow-2xl border-t border-slate-200 animate-in slide-in-from-bottom duration-200">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-2">More Modules</h3>
            <div className="grid grid-cols-2 gap-2">
              {moreItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={idx}
                    to={item.path}
                    onClick={() => setShowMoreMenu(false)}
                    className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors border border-slate-100"
                  >
                    <Icon className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Nav Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex items-center justify-around py-2 px-1 shadow-lg lg:hidden">
        {mainTabs.map((tab, idx) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={idx}
              to={tab.path}
              onClick={() => setShowMoreMenu(false)}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-extrabold transition-colors ${
                  isActive ? 'text-blue-600 font-black' : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}

        <button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-extrabold transition-colors ${
            showMoreMenu ? 'text-blue-600 font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span>MORE</span>
        </button>
      </div>
    </>
  );
};
