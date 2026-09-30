import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  PackageCheck,
  CreditCard,
  Users,
  ShieldCheck,
  Puzzle,
  Database,
  Bell,
  Key,
  Layers,
  BarChart3,
  FileSpreadsheet,
  ShieldAlert,
  Settings,
  User,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const SuperAdminSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/super-admin/dashboard', icon: LayoutDashboard },
    { name: 'Corporations', path: '/super-admin/corporations', icon: Building2 },
    { name: 'SaaS Plans', path: '/super-admin/plans', icon: PackageCheck },
    { name: 'Subscriptions', path: '/super-admin/subscriptions', icon: CreditCard },
    { name: 'Users', path: '/super-admin/users', icon: Users },
    { name: 'Roles & Permissions', path: '/super-admin/roles', icon: ShieldCheck },
    { name: 'Modules', path: '/super-admin/modules', icon: Puzzle },
    { name: 'Master Data', path: '/super-admin/master-data', icon: Database },
    { name: 'Notifications', path: '/super-admin/notifications', icon: Bell },
    { name: 'API Management', path: '/super-admin/api-management', icon: Key },
    { name: 'GIS Configuration', path: '/super-admin/gis', icon: Layers },
    { name: 'Reports', path: '/super-admin/reports', icon: BarChart3 },
    { name: 'Audit Logs', path: '/super-admin/audit-logs', icon: FileSpreadsheet },
    { name: 'Security', path: '/super-admin/security', icon: ShieldAlert },
    { name: 'System Settings', path: '/super-admin/settings', icon: Settings },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden" />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 text-slate-300 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-md shadow-amber-500/20">
              S
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-white tracking-tight leading-tight">SUPER ADMIN</h1>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Platform SaaS Control</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={idx}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-900 bg-slate-950">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg text-xs font-bold transition-colors border border-red-800/40"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out SaaS</span>
          </button>
        </div>
      </aside>
    </>
  );
};
