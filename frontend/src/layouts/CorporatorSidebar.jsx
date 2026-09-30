import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building,
  AlertTriangle,
  HardHat,
  IndianRupee,
  CalendarDays,
  FileText,
  ListTodo,
  Building2,
  UserCheck,
  Layers,
  FileArchive,
  FileSpreadsheet,
  Bell,
  Bot,
  Settings,
  LogOut,
  Landmark,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const CorporatorSidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navSections = [
    {
      title: "Overview",
      items: [
        { name: "Dashboard", path: "/corporator/dashboard", icon: LayoutDashboard },
        { name: "Ward Telemetry", path: "/corporator/ward", icon: Building },
        { name: "GIS Spatial Map", path: "/corporator/gis", icon: Layers },
      ],
    },
    {
      title: "Operations & Grievances",
      items: [
        { name: "Complaints", path: "/corporator/complaints", icon: AlertTriangle, count: "8" },
        { name: "Follow-ups Tracker", path: "/corporator/followups", icon: ListTodo, count: "3" },
        { name: "Development Works", path: "/corporator/works", icon: HardHat, count: "18" },
        { name: "Ward Budgets & Funds", path: "/corporator/funds", icon: IndianRupee },
      ],
    },
    {
      title: "Governance & Administration",
      items: [
        { name: "Project Proposals", path: "/corporator/proposals", icon: FileText },
        { name: "Council Meetings", path: "/corporator/meetings", icon: CalendarDays },
        { name: "Civic Departments", path: "/corporator/departments", icon: Building2 },
        { name: "Officers Directory", path: "/corporator/officers", icon: UserCheck },
      ],
    },
    {
      title: "Intelligence & Management",
      items: [
        { name: "AI NagarSevak", path: "/corporator/ai-assistant", icon: Bot, isAi: true },
        { name: "Ward Documents", path: "/corporator/documents", icon: FileArchive },
        { name: "Reports & Analytics", path: "/corporator/reports", icon: FileSpreadsheet },
        { name: "Notifications", path: "/corporator/notifications", icon: Bell, count: "4" },
        { name: "Settings & Config", path: "/corporator/settings", icon: Settings },
      ],
    },
  ];

  const userName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : 'Hon. Anand Patil';
  const userRole = user?.designation || 'Ward Corporator';
  const userInitials = (user?.first_name?.[0] || 'A') + (user?.last_name?.[0] || 'P');

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0B0F19] border-r border-slate-800/70 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Corporate Workspace Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 bg-[#0B0F19] shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            {/* Corporate Logo Emblem */}
            <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-xs shrink-0">
              <Landmark className="w-4.5 h-4.5 text-blue-400" />
            </div>

            <div className="min-w-0">
              <h1 className="text-xs font-black tracking-tight text-white uppercase leading-tight truncate">
                Digital Corporator
              </h1>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-[11px] text-slate-400 font-medium truncate">
                  {user?.ward_name || 'Ward 24 • Shivaji Nagar'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Structured Corporate Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-800/60">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <h2 className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-500 select-none">
                {section.title}
              </h2>
              <div className="space-y-0.5">
                {section.items.map((item, idx) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={idx}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white font-bold shadow-xs'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 font-medium'
                        }`
                      }
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <Icon className="w-4 h-4 shrink-0 opacity-90" />
                        <span className="truncate">{item.name}</span>
                      </div>

                      {item.isAi ? (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>AI</span>
                        </span>
                      ) : item.count ? (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-800/80 text-slate-400">
                          {item.count}
                        </span>
                      ) : null}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Corporate Profile & Sign Out Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-[#0B0F19] shrink-0">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <div
              onClick={() => navigate('/corporator/profile')}
              className="flex items-center space-x-2.5 min-w-0 cursor-pointer flex-1 group"
            >
              <div className="w-7 h-7 rounded-md bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs shrink-0">
                {userInitials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-200 truncate group-hover:text-blue-400 transition-colors">
                  {userName}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {userRole}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out of Session"
              aria-label="Sign Out"
              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
