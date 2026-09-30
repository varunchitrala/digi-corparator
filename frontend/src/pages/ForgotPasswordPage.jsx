import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../services/api';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Forgot password request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
        <div className="bg-slate-950 p-6 text-center text-white border-b border-slate-800">
          <h1 className="text-lg font-extrabold">Reset Password</h1>
          <p className="text-xs text-slate-400 mt-1">Digital Corporator Platform</p>
        </div>

        <div className="p-6 sm:p-8 space-y-4">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Reset Link Dispatched</h3>
              <p className="text-xs text-slate-600">
                If an account exists for <span className="font-bold text-slate-900">{email}</span>, password reset instructions have been generated.
              </p>
              <Link to="/login" className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 pt-2">
                <ArrowLeft className="w-4 h-4 mr-1" /> Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200">
                  {error}
                </div>
              )}
              <Input
                label="Official Email ID"
                type="email"
                icon={Mail}
                placeholder="enter your official email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" className="w-full py-2.5" isLoading={loading}>
                Generate Reset Token
              </Button>
              <div className="text-center pt-2">
                <Link to="/login" className="text-xs text-slate-500 hover:text-slate-800 font-semibold inline-flex items-center">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
