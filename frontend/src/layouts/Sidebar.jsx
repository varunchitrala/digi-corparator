import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  MapPin,
  AlertCircle,
  HardHat,
  IndianRupee,
  CalendarDays,
  FileText,
  Clock,
  Layers,
  Sparkles,
  BarChart3,
  Globe,
  Users,
  ShieldCheck,
  Settings
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const menuGroups = [
    {
      title: 'Main Dashboard',
      items: [
        { name: 'Corporator Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Ward GIS Map', path: '/gis', icon: Layers },
      ]
    },
    {
      title: 'Ward Operations',
      items: [
        { name: 'Complaints', path: '/complaints', icon: AlertCircle, badge: '126' },
        { name: 'Development Works', path: '/works', icon: HardHat, badge: '18' },
        { name: 'Fund Management', path: '/funds', icon: IndianRupee },
        { name: 'Meetings & Minutes', path: '/meetings', icon: CalendarDays },
        { name: 'Proposals & Agenda', path: '/proposals', icon: FileText },
        { name: 'Follow-ups', path: '/followups', icon: Clock },
      ]
    },
    {
      title: 'Analytics & Intelligence',
      items: [
        { name: 'AI NagarSevak Assistant', path: '/ai', icon: Sparkles, highlight: true },
        { name: 'Reports & MIS', path: '/reports', icon: BarChart3 },
        { name: 'Public Transparency', path: '/transparency', icon: Globe },
      ]
    },
    {
      title: 'Administration & SaaS',
      items: [
        { name: 'Super Admin SaaS', path: '/super-admin', icon: ShieldCheck },
        { name: 'Corporation Admin', path: '/corporation-admin', icon: Building2 },
        { name: 'Ward Setup', path: '/wards', icon: MapPin },
        { name: 'User Management', path: '/users', icon: Users },
        { name: 'System Settings', path: '/settings', icon: Settings },
      ]
    }
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

      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">
              N
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-white tracking-tight leading-tight">
                NAGAR SEVAK
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Digital Corporator SaaS
              </p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item, iIdx) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={iIdx}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                            : item.highlight
                            ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-amber-300 hover:from-amber-500/30 hover:to-amber-500/20 border border-amber-500/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                        }`
                      }
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Corporation & Ward Footer Card */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center justify-between bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/50">
            <div className="truncate">
              <p className="text-[11px] font-bold text-slate-200 truncate">Demo Municipal Corp</p>
              <p className="text-[10px] text-blue-400 font-semibold truncate">Ward 24 - Shivaji Nagar</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>
      </aside>
    </>
  );
};
