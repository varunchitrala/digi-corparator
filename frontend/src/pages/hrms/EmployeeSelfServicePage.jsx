import React, { useState } from 'react';
import api from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { Button } from '../../components/Button';
import { MapPin, Calendar, Clock, UserCheck } from 'lucide-react';

export const EmployeeSelfServicePage = () => {
  const [checkingIn, setCheckingIn] = useState(false);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      const res = await api.post('/hrms/attendance/check-in', {
        latitude: 19.8762,
        longitude: 75.3433
      });
      alert(res.message);
    } catch (err) {
      alert(err.message || 'Check-in failed');
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
          EMPLOYEE SELF-SERVICE PORTAL
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Employee Self-Service Workspace</h2>
        <p className="text-xs text-slate-500">Perform GPS geofenced check-in, check available leave balance, and review your profile posting.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Casual Leave Balance" value="12 Days" color="blue" icon={Calendar} />
        <StatCard title="Sick Leave Balance" value="10 Days" color="emerald" icon={UserCheck} />
        <StatCard title="Earned Leave Balance" value="30 Days" color="purple" icon={Clock} />
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs font-mono">
        <h3 className="font-bold text-slate-900 text-sm">GPS Geofenced Daily Attendance</h3>
        <p className="text-slate-500 font-sans">Click below to record check-in at municipal office location (within 200m geofence radius).</p>
        <Button variant="success" onClick={handleCheckIn} isLoading={checkingIn} className="bg-emerald-600 hover:bg-emerald-700">
          <MapPin className="w-4 h-4 mr-1.5" /> MARK GEOLOCATION CHECK-IN
        </Button>
      </div>
    </div>
  );
};
