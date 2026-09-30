import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  Building,
  User,
  LogOut,
  Shield
} from 'lucide-react';
import { AiNagarSevakModal } from '../components/AiNagarSevakModal';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export const Header = ({ onToggleSidebar }) => {
  const [selectedWard, setSelectedWard] = useState('w-demo-024');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-xs">
        {/* Left Section: Mobile Menu Toggle & Ward Selector */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Ward Selector Dropdown */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700">
            <Building className="w-4 h-4 text-blue-600 hidden sm:block" />
            <span className="hidden sm:inline text-slate-400">Ward:</span>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="w-demo-024">Ward 24 (Shivaji Nagar)</option>
              <option value="w-demo-001">Ward 1 (Station Area)</option>
              <option value="w-demo-002">Ward 2 (Market Yard)</option>
              <option value="w-demo-003">Ward 3 (Green Park)</option>
            </select>
          </div>
        </div>

        {/* Center Section: Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Complaint ID, Work Order, Proposal..."
              className="w-full bg-slate-100/80 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Right Section: Actions & User Avatar */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* AI NagarSevak Quick Button */}
          <button
            onClick={() => setIsAiOpen(true)}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI NagarSevak</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900">Notifications</h4>
                  <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full">3 New</span>
                </div>
                <div className="space-y-3 pt-3 text-xs">
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-100">
                    <p className="font-bold text-amber-900">SLA Breach Warning</p>
                    <p className="text-amber-700 text-[11px]">CMP-1024 (Streetlight Defect) SLA expiring in 2 hours.</p>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
                    <p className="font-bold text-blue-900">New Proposal Submitted</p>
                    <p className="text-blue-700 text-[11px]">PROP-2026-01 submitted for Ward 24 Park open gym.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                {user?.first_name && user?.last_name ? `${user.first_name[0]}${user.last_name[0]}` : 'AP'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Anand Patil'}
                </p>
                <p className="text-[10px] text-slate-500 font-semibold">
                  {user?.designation || user?.role_code || 'Hon. Corporator'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">
                    {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Anand Patil'}
                  </p>
                  <p className="text-[11px] text-slate-500">{user?.email || 'corporator.ward24@demomunicipal.gov.in'}</p>
                  <span className="mt-1 inline-block text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                    {user?.role_code || 'CORPORATOR'} ROLE
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 text-left"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* AI Assistant Modal */}
      <AiNagarSevakModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </>
  );
};
