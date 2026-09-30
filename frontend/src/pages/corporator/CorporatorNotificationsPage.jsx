import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { LoadingState } from '../../components/LoadingState';
import { Bell, CheckCircle2 } from 'lucide-react';

export const CorporatorNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporator/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/corporator/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error('Mark read failed:', err);
    }
  };

  if (loading) return <LoadingState message="Fetching notifications..." />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
          NOTIFICATIONS CENTER
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Ward Alerts & Notifications</h2>
        <p className="text-xs text-slate-500">SLA threshold warnings, work delays, and committee reminders.</p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.notification_id} className={`p-4 rounded-xl border flex items-start justify-between ${
            n.is_read ? 'bg-slate-50 border-slate-200' : 'bg-blue-50/70 border-blue-200 ring-1 ring-blue-300'
          }`}>
            <div className="flex items-start space-x-3">
              <Bell className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 text-xs">{n.title}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
            {!n.is_read && (
              <button onClick={() => handleMarkRead(n.notification_id)} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
