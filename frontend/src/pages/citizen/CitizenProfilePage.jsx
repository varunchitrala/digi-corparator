import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Building,
  Home,
  Save,
  Bell,
  CheckCircle2,
  FileBadge,
  CreditCard,
  Droplets
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export const CitizenProfilePage = () => {
  const { user } = useAuthStore();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.first_name || 'Vijay',
    lastName: user?.last_name || 'Shinde',
    phone: user?.phone || '9876543299',
    email: user?.email || 'citizen.demo@gmail.com',
    wardName: 'Ward 24 - Shivaji Nagar',
    houseAddress: 'Plot No. 42, Lane 4, Near Shivaji Statue, Shivaji Nagar',
    pincode: '431001',
    emergencyContactName: 'Sunita Shinde (Spouse)',
    emergencyContactPhone: '+91 98765 43298',
    propertyId: 'PROP-2026-4402',
    waterConnectionId: 'WTR-24-0091',
    aadhaarMasked: 'XXXX-XXXX-8921',
  });

  const [notifications, setNotifications] = useState({
    smsGrievance: true,
    whatsappAlerts: true,
    emailReceipts: true,
    wardAnnouncements: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <User className="w-3.5 h-3.5" />
            <span>CITIZEN PROFILE & ACCOUNT</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-1.5">
            Resident Profile & Linked Civic Identifiers
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your residential details, linked municipal property & water connection IDs, and emergency alert preferences.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Aadhaar Verified</span>
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center space-x-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile changes and alert preferences saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal & Residential Details */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center border-b border-slate-100 pb-2">
            <Home className="w-4 h-4 mr-2 text-emerald-600" />
            Personal & Residential Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
            <Input
              label="Registered Mobile Number (OTP Login)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <div className="sm:col-span-2">
              <Input
                label="Full Residential Street Address"
                value={formData.houseAddress}
                onChange={(e) => setFormData({ ...formData, houseAddress: e.target.value })}
                required
              />
            </div>
            <Input
              label="Elected Ward"
              value={formData.wardName}
              disabled
              className="bg-slate-50 cursor-not-allowed"
            />
            <Input
              label="PIN Code"
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Linked Municipal Civic Assets */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center border-b border-slate-100 pb-2">
            <FileBadge className="w-4 h-4 mr-2 text-blue-600" />
            Linked Corporation Assets & IDs
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Property Assessment No
              </span>
              <p className="text-sm font-mono font-black text-slate-900 flex items-center justify-between">
                <span>{formData.propertyId}</span>
                <CreditCard className="w-4 h-4 text-blue-600" />
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold">Active Residential Unit</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Water Consumer Connection No
              </span>
              <p className="text-sm font-mono font-black text-slate-900 flex items-center justify-between">
                <span>{formData.waterConnectionId}</span>
                <Droplets className="w-4 h-4 text-cyan-600" />
              </p>
              <p className="text-[11px] text-cyan-600 font-semibold">Metered Connection (1/2")</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Digital Identity (UIDAI)
              </span>
              <p className="text-sm font-mono font-black text-slate-900 flex items-center justify-between">
                <span>{formData.aadhaarMasked}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold">KYC Verified Resident</p>
            </div>
          </div>
        </div>

        {/* Emergency Contacts & Alerts */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center border-b border-slate-100 pb-2">
            <Bell className="w-4 h-4 mr-2 text-amber-600" />
            Emergency Contacts & Civic Alert Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Emergency Contact Name & Relation"
              value={formData.emergencyContactName}
              onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
            />
            <Input
              label="Emergency Contact Phone"
              value={formData.emergencyContactPhone}
              onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
            />
          </div>

          <div className="pt-3 space-y-2.5">
            <label className="flex items-center space-x-3 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={notifications.smsGrievance}
                onChange={(e) => setNotifications({ ...notifications, smsGrievance: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Receive real-time SMS alerts when my reported grievance status changes</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={notifications.whatsappAlerts}
                onChange={(e) => setNotifications({ ...notifications, whatsappAlerts: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Receive WhatsApp notifications for Ward 24 water supply cutoffs and maintenance</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={notifications.emailReceipts}
                onChange={(e) => setNotifications({ ...notifications, emailReceipts: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Send digital payment receipts and tax clearance certificates to my email</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" variant="primary" className="bg-emerald-600 hover:bg-emerald-700 px-6 font-bold">
            <Save className="w-4 h-4 mr-1.5" />
            Save Profile Updates
          </Button>
        </div>
      </form>
    </div>
  );
};
