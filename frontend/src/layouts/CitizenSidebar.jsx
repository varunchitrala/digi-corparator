import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  PlusCircle,
  FileText,
  FileCheck,
  Receipt,
  HardHat,
  PhoneCall,
  User,
  LogOut,
  Building2,
  MapPin,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const CitizenSidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navSections = [
    {
      title: 'Portal Overview',
      items: [
        { name: 'Citizen Dashboard', path: '/citizen/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Grievance Redressal',
      items: [
        { name: 'Register Grievance', path: '/citizen/complaints/create', icon: PlusCircle, highlight: true },
        { name: 'My Complaints', path: '/citizen/complaints', icon: AlertTriangle, count: '3' },
      ],
    },
    {
      title: 'Civic Services & Tax',
      items: [
        { name: 'Service Catalog', path: '/citizen/services', icon: FileText },
        { name: 'My Applications', path: '/citizen/applications', icon: FileCheck, count: '2' },
        { name: 'Property & Water Tax', path: '/citizen/revenue', icon: Receipt },
      ],
    },
    {
      title: 'Ward & Transparency',
      items: [
        { name: 'Ward 24 Works', path: '/citizen/ward-works', icon: HardHat },
        { name: 'Ward Helpline & Corporator', path: '/citizen/helpline', icon: PhoneCall },
      ],
    },
    {
      title: 'My Account',
      items: [
        { name: 'Citizen Profile', path: '/citizen/profile', icon: User },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-5 border-b border-slate-800 bg-slate-950/60 justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-emerald-500/20">
              ना
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="font-extrabold text-sm text-white tracking-tight leading-tight">
                  NAGARIK SEVA
                </h1>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                  CITIZEN
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Ward 24 - Shivaji Nagar
              </p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5">
          {navSections.map((section, sIdx) => (
            <div key={sIdx}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item, iIdx) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={iIdx}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                            : item.highlight
                            ? 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                        }`
                      }
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.name}</span>
                      </div>
                      {item.count && (
                        <span className="text-[10px] font-bold bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-full border border-slate-700">
                          {item.count}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Transparency Portal Link */}
          <div className="pt-2 border-t border-slate-800/80">
            <a
              href="/public/roads/map"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            >
              <div className="flex items-center space-x-2.5">
                <ExternalLink className="w-4 h-4 text-slate-500" />
                <span>Public City Map</span>
              </div>
              <span className="text-[9px] text-slate-500 uppercase">Public</span>
            </a>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70">
          <div className="flex items-center justify-between bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/60">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                {user?.first_name ? user.first_name[0] : 'V'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">
                  {user ? `${user.first_name} ${user.last_name}` : 'Vijay Shinde'}
                </p>
                <p className="text-[10px] text-emerald-400 font-medium truncate flex items-center">
                  <ShieldCheck className="w-3 h-3 mr-1 inline" /> Verified Resident
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
