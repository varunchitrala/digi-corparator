import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Lock, CheckCircle } from 'lucide-react';
import api from '../services/api';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/reset-password', {
        resetToken: token,
        newPassword
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
        <div className="bg-slate-950 p-6 text-center text-white border-b border-slate-800">
          <h1 className="text-lg font-extrabold">Set New Password</h1>
          <p className="text-xs text-slate-400 mt-1">Digital Corporator Platform</p>
        </div>

        <div className="p-6 sm:p-8 space-y-4">
          {success ? (
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Password Updated!</h3>
              <p className="text-xs text-slate-600">Redirecting to login portal...</p>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200">
                  {error}
                </div>
              )}
              <Input
                label="New Password"
                type="password"
                icon={Lock}
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                icon={Lock}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" className="w-full py-2.5" isLoading={loading}>
                Update Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
