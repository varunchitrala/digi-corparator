import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { User, Lock, Building, ShieldCheck } from 'lucide-react';

export const CorporatorProfilePage = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || 'Anand',
    last_name: user?.last_name || 'Patil',
    email: user?.email || 'corporator.ward24@demomunicipal.gov.in',
    phone: user?.phone || '9876543224',
    designation: user?.designation || 'Hon. Corporator (Ward 24)'
  });

  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    alert('Password changed successfully!');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
          CORPORATOR IDENTITY
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Corporator Profile Settings</h2>
        <p className="text-xs text-slate-500">Manage account information and security credentials.</p>
      </div>

      {/* Ward Context Card (Non-editable) */}
      <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 text-xs flex justify-between items-center">
        <div>
          <h4 className="font-extrabold text-blue-900">Official Ward Designation</h4>
          <p className="text-blue-700 font-bold mt-0.5">{user?.ward_name || 'Ward 24 - Shivaji Nagar'} • {user?.corporation_name || 'Demo Municipal Corporation'}</p>
        </div>
        <span className="text-[10px] font-black bg-blue-700 text-white px-2.5 py-1 rounded-md">ASSIGNED SCOPE</span>
      </div>

      {/* Profile Form */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center">
          <User className="w-4 h-4 text-blue-600 mr-2" /> Personal Information
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} required />
            <Input label="Last Name" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Official Email" type="email" value={formData.email} disabled />
            <Input label="Mobile Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary">Save Changes</Button>
          </div>
        </form>
      </div>

      {/* Password Form */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center">
          <Lock className="w-4 h-4 text-amber-600 mr-2" /> Change Security Password
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input label="Current Password" type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required />
          <Input label="New Password" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required />

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="outline">Update Password</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
