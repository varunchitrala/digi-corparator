import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Droplet, Calendar, Clock, AlertCircle } from 'lucide-react';

export const PublicSupplySchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPublicSchedules();
  }, []);

  const fetchPublicSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:5000/api/public/water/schedule');
      setSchedules(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch public supply schedules');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full p-6 rounded-2xl border border-slate-200 shadow-xl space-y-5">
        <div className="text-center space-y-1 border-b border-slate-100 pb-4">
          <div className="inline-flex p-3 bg-cyan-50 text-cyan-600 rounded-full mb-2">
            <Droplet className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Ward Water Supply Schedules</h2>
          <p className="text-xs text-slate-500">Official Municipal Water Supply & Outage Portal</p>
        </div>

        {loading && <div className="text-center text-xs text-slate-500 py-6">Loading water supply timetables...</div>}

        {error && (
          <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {schedules.map((s, idx) => (
          <div key={idx} className="p-4 bg-cyan-50 rounded-xl border border-cyan-200 text-cyan-900 space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-sm text-cyan-950">{s.zone_name}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {s.status}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-cyan-800">
              <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> {new Date(s.supply_date).toLocaleDateString()}</span>
              <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {s.start_time} - {s.end_time}</span>
            </div>
            <div className="text-[11px] text-slate-500 font-sans">{s.ward_name || 'Ward 24'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
