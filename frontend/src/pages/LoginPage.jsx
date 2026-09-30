import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Mail, Lock, ExternalLink } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('corporator.ward24@demomunicipal.gov.in');
  const [password, setPassword] = useState('password123');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success && res.user) {
      const role = res.user.role_code;
      if (role === 'SUPER_ADMIN') {
        navigate('/super-admin/dashboard');
      } else if (role === 'CORPORATION_ADMIN') {
        navigate('/corporation/works/dashboard');
      } else if (role === 'WARD_ADMIN') {
        navigate('/ward/dashboard');
      } else if (role === 'CORPORATOR') {
        navigate('/corporator/dashboard');
      } else if (role === 'DEPARTMENT_HEAD') {
        navigate('/department-head/dashboard');
      } else if (role === 'OFFICER') {
        navigate('/officer/dashboard');
      } else if (role === 'STAFF') {
        navigate('/staff/dashboard');
      } else if (role === 'CONTRACTOR') {
        navigate('/contractor/dashboard');
      } else if (role === 'CITIZEN') {
        navigate('/citizen/services');
      } else {
        navigate('/');
      }
    }
  };

  const handleDemoSelect = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
        {/* Top Municipal Banner */}
        <div className="bg-slate-950 p-6 text-center text-white border-b border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-2xl mx-auto mb-3 shadow-lg shadow-blue-500/30">
            N
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">Digital Corporator Platform</h1>
          <p className="text-xs text-slate-400 mt-1">Smart Ward Management & Municipal SaaS</p>
        </div>

        {/* Login Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Official Email ID, Mobile, or Employee ID"
              type="text"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password or OTP"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" className="w-full py-2.5" isLoading={isLoading}>
              Sign In to Ward Portal
            </Button>
          </form>

          {/* Quick Role Switcher for Testing (All 9 DOCX Roles) */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              Quick Role Test Logins (DOCX Spec - Password: password123)
            </p>
            <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => handleDemoSelect('superadmin@nagarsevak.gov.in')}
                className="w-full text-left px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex justify-between items-center"
              >
                <span>1. Super Admin</span>
                <span className="text-[10px] text-blue-600 font-bold">SUPER_ADMIN</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('admin@demomunicipal.gov.in')}
                className="w-full text-left px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex justify-between items-center"
              >
                <span>2. Corporation Admin</span>
                <span className="text-[10px] text-blue-600 font-bold">CORP_ADMIN</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('wardadmin.ward24@demomunicipal.gov.in')}
                className="w-full text-left px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-xs font-semibold text-indigo-900 flex justify-between items-center border border-indigo-200"
              >
                <span>3. Ward Admin</span>
                <span className="text-[10px] text-indigo-700 font-bold">WARD_ADMIN</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('corporator.ward24@demomunicipal.gov.in')}
                className="w-full text-left px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-xs font-semibold text-blue-900 flex justify-between items-center border border-blue-200"
              >
                <span>4. Corporator (Ward 24)</span>
                <span className="text-[10px] text-blue-700 font-bold">CORPORATOR</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('depthead.water@demomunicipal.gov.in')}
                className="w-full text-left px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex justify-between items-center"
              >
                <span>5. Department Head</span>
                <span className="text-[10px] text-purple-600 font-bold">DEPT_HEAD</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('officer.water@demomunicipal.gov.in')}
                className="w-full text-left px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex justify-between items-center"
              >
                <span>6. Ward Officer</span>
                <span className="text-[10px] text-cyan-600 font-bold">OFFICER</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('staff.field@demomunicipal.gov.in')}
                className="w-full text-left px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex justify-between items-center"
              >
                <span>7. Field Staff</span>
                <span className="text-[10px] text-slate-600 font-bold">STAFF</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('contractor.demo@infra.com')}
                className="w-full text-left px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex justify-between items-center"
              >
                <span>8. Contractor</span>
                <span className="text-[10px] text-amber-600 font-bold">CONTRACTOR</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('citizen.demo@gmail.com')}
                className="w-full text-left px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex justify-between items-center"
              >
                <span>9. Citizen Portal</span>
                <span className="text-[10px] text-emerald-600 font-bold">CITIZEN</span>
              </button>
            </div>

            {/* Public User Portal Link */}
            <div className="pt-2 border-t border-slate-100">
              <Link
                to="/public/roads/map"
                className="w-full text-center py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-800 flex items-center justify-center space-x-1 border border-emerald-200"
              >
                <span>10. Open Public Portal (No Login Required)</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
