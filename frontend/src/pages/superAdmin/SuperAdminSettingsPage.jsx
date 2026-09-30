import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { LoadingState } from '../../components/LoadingState';
import { Settings, Globe, Mail, Shield, CheckCircle } from 'lucide-react';

export const SuperAdminSettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/super-admin/settings');
      setSettings(res.data || {});
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading Platform System Settings..." />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
          SYSTEM CONFIGURATION
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Global SaaS Platform Settings</h2>
        <p className="text-xs text-slate-500">Configure platform name, default timezones, gateway providers, and maintenance mode.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase flex items-center">
              <Globe className="w-4 h-4 mr-1.5 text-blue-600" /> Platform Name & Version
            </div>
            <div className="text-base font-extrabold text-slate-900">{settings.platform_name || 'Digital Corporator SaaS'}</div>
            <div className="text-xs font-mono font-bold text-blue-700">Version: {settings.platform_version || '2.0.0-PROD'}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase flex items-center">
              <Shield className="w-4 h-4 mr-1.5 text-emerald-600" /> Default Timezone & Locale
            </div>
            <div className="text-base font-extrabold text-slate-900">{settings.default_timezone || 'Asia/Kolkata'}</div>
            <div className="text-xs text-slate-500">Financial Year: 2026-2027</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase flex items-center">
              <Mail className="w-4 h-4 mr-1.5 text-purple-600" /> SMTP & SMS Gateways
            </div>
            <div className="text-xs font-bold text-emerald-700 flex items-center">
              <CheckCircle className="w-3.5 h-3.5 mr-1" /> SMTP Status: {settings.smtp_status || 'CONNECTED'}
            </div>
            <div className="text-xs text-slate-600">{settings.sms_gateway || 'CDAC MSdg SMS Gateway'}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase flex items-center">
              <Settings className="w-4 h-4 mr-1.5 text-amber-600" /> Payment & GIS Engines
            </div>
            <div className="text-xs font-bold text-slate-900">Gateways: Razorpay, Paytm, UPI</div>
            <div className="text-xs font-mono text-slate-600">{settings.gis_map_engine || 'Leaflet GIS Engine v1.9'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
