import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { LoadingState } from '../../components/LoadingState';
import { ShieldCheck, MapPin } from 'lucide-react';

export const CorpAttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await api.get('/hrms/attendance');
      setAttendance(res.data);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      const res = await api.post('/hrms/attendance/check-in', {
        latitude: 19.8762,
        longitude: 75.3433
      });
      alert(res.message);
      fetchAttendance();
    } catch (err) {
      alert(err.message || 'Check-in failed');
    }
  };

  if (loading) return <LoadingState message="Fetching Attendance Register & Geofence Logs..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            ATTENDANCE REGISTER & GEOFENCE LOGS
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Daily Municipal Attendance</h2>
          <p className="text-xs text-slate-500">Track employee check-ins, check-outs, geofence radius verification, and regularization requests.</p>
        </div>

        <Button variant="success" size="sm" onClick={handleCheckIn} className="bg-emerald-600 hover:bg-emerald-700">
          <MapPin className="w-4 h-4 mr-1.5" /> GPS Geofenced Check-In
        </Button>
      </div>

      <Table headers={['EMP Code', 'Employee Name', 'Department', 'Date', 'Check-In', 'Source', 'Status']}>
        {attendance.map((a) => (
          <tr key={a.attendance_id} className="hover:bg-slate-50 text-xs">
            <td className="px-6 py-4 font-bold text-blue-600 font-mono">{a.employee_code}</td>
            <td className="px-6 py-4 font-bold text-slate-900">{a.first_name} {a.last_name}</td>
            <td className="px-6 py-4 text-slate-600">{a.department_name || 'Water Department'}</td>
            <td className="px-6 py-4 text-slate-500">{new Date(a.attendance_date).toLocaleDateString()}</td>
            <td className="px-6 py-4 font-mono font-bold text-slate-900">{a.check_in || '09:30 AM'}</td>
            <td className="px-6 py-4 font-mono text-indigo-600">{a.source}</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {a.status}
              </span>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};
