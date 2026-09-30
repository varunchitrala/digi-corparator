import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { User, Shield, Key, Mail, Phone, Building2, MapPin, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export const ProfilePage = () => {
  const { user } = useAuthStore();

  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || 'Anand',
    last_name: user?.last_name || 'Patil',
    phone: user?.phone || '9876543224',
    designation: user?.designation || 'Hon. Corporator (Ward 24)'
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passData, setPassData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPass, setChangingPass] = useState(false);
  const [passMessage, setPassMessage] = useState(null);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.put('/auth/profile', profileData);
      setEditMode(false);
      alert('Profile updated successfully');
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      setPassMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setChangingPass(true);
    setPassMessage(null);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword
      });
      setPassMessage({ type: 'success', text: 'Password changed successfully' });
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPassMessage(null);
      }, 1500);
    } catch (err) {
      setPassMessage({ type: 'error', text: err.message || 'Password change failed' });
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
            {user?.first_name && user?.last_name ? `${user.first_name[0]}${user.last_name[0]}` : 'AP'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {user?.first_name ? `${user.first_name} ${user.last_name}` : 'Anand Patil'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {user?.designation || 'Hon. Corporator (Ward 24)'}
            </p>
            <div className="mt-1 flex items-center space-x-2">
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                {user?.role_code || 'CORPORATOR'}
              </span>
              <span className="text-[10px] text-slate-400">• Multi-Tenant Session Active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => setIsPasswordModalOpen(true)}>
            <Key className="w-3.5 h-3.5 mr-1.5" /> Change Password
          </Button>
          <Button variant="primary" size="sm" onClick={() => setEditMode(!editMode)}>
            {editMode ? 'Cancel Edit' : 'Edit Profile'}
          </Button>
        </div>
      </div>

      {/* Main Profile Info & Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details / Edit Form */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center">
            <User className="w-4 h-4 text-blue-600 mr-2" /> Personal & Official Telemetry
          </h3>

          {editMode ? (
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={profileData.first_name}
                  onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                  required
                />
                <Input
                  label="Last Name"
                  value={profileData.last_name}
                  onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Mobile Phone"
                icon={Phone}
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                required
              />
              <Input
                label="Official Designation"
                value={profileData.designation}
                onChange={(e) => setProfileData({ ...profileData, designation: e.target.value })}
                required
              />

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="ghost" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={savingProfile}>
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="font-bold text-slate-500 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-slate-400" /> Email ID
                </span>
                <span className="font-bold text-slate-900">{user?.email || 'corporator.ward24@demomunicipal.gov.in'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="font-bold text-slate-500 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-slate-400" /> Phone
                </span>
                <span className="font-bold text-slate-900">{user?.phone || '9876543224'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="font-bold text-slate-500 flex items-center">
                  <Building2 className="w-4 h-4 mr-2 text-slate-400" /> Municipal Corporation
                </span>
                <span className="font-bold text-slate-900">{user?.corporation_name || 'Demo Municipal Corporation'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="font-bold text-slate-500 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-slate-400" /> Ward Assignment
                </span>
                <span className="font-bold text-blue-600">{user?.ward_name || 'Ward 24 - Shivaji Nagar'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Role Scopes */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center">
              <Shield className="w-4 h-4 text-emerald-600 mr-2" /> RBAC Security Scope
            </h3>
            <div className="space-y-2 text-xs">
              <p className="text-slate-500">Your role grant scope is established at database initialization:</p>
              <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-lg font-semibold border border-emerald-200">
                • COMPLAINT_VIEW, COMPLAINT_CREATE, COMPLAINT_ASSIGN, COMPLAINT_RESOLVE
              </div>
              <div className="p-2.5 bg-blue-50 text-blue-900 rounded-lg font-semibold border border-blue-200">
                • WORK_PROPOSE, WORK_VIEW, WORK_UPDATE_PROGRESS
              </div>
              <div className="p-2.5 bg-amber-50 text-amber-900 rounded-lg font-semibold border border-amber-200">
                • BUDGET_VIEW, PROPOSAL_SUBMIT, MEETING_SCHEDULE
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} title="Change Password">
        <form onSubmit={handleChangePassword} className="space-y-4">
          {passMessage && (
            <div className={`p-3 rounded-lg text-xs font-bold ${
              passMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {passMessage.text}
            </div>
          )}
          <Input
            label="Current Password"
            type="password"
            value={passData.currentPassword}
            onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
            required
          />
          <Input
            label="New Password"
            type="password"
            value={passData.newPassword}
            onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passData.confirmPassword}
            onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
            required
          />

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsPasswordModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={changingPass}>
              Update Password
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
