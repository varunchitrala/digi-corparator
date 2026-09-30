import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from './Button';
import { LogOut } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, logout } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!user || (!allowedRoles.includes(user.role_code) && user.role_code !== 'SUPER_ADMIN')) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 shadow-xl max-w-lg w-full space-y-4">
            <h3 className="text-xl font-bold text-rose-700">Access Denied (403 Forbidden)</h3>
            <p className="text-xs text-slate-600">
              Your logged-in role (<span className="font-mono font-bold text-slate-900">{user?.role_code || 'GUEST'}</span>) does not have permission to access this module.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  logout();
                  window.location.href = '/login';
                }}
                className="bg-slate-900 hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout & Switch Account
              </Button>
            </div>
          </div>
        </div>
      );
    }
  }

  return children;
};
