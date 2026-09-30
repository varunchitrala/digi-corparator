import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Stethoscope, Calendar } from 'lucide-react';

export const PublicHealthFacilitiesPage = () => {
  const [data, setData] = useState({ facilities: [], camps: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicHealth();
  }, []);

  const fetchPublicHealth = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/public/health/facilities');
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to fetch public health facilities:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-3xl w-full p-6 rounded-2xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-1 border-b border-slate-100 pb-4">
          <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-full mb-2">
            <Stethoscope className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Municipal Health Facilities & Camps</h2>
          <p className="text-xs text-slate-500">Official Municipal Hospitals, Urban Health Centres & Free Screening Camps Portal</p>
        </div>

        {loading && <div className="text-center text-xs text-slate-500 py-6">Loading public health data...</div>}

        {!loading && (
          <div className="space-y-6">
            {/* Health Facilities */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
                <Stethoscope className="w-4 h-4 text-emerald-600 mr-2" /> Municipal Hospitals & Health Centres
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.facilities.map((f, idx) => (
                  <div key={idx} className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-mono space-y-1">
                    <div className="font-bold text-emerald-950">{f.facility_name}</div>
                    <div className="text-emerald-800">{f.ward_name || 'Ward 24'} • {f.facility_type}</div>
                    <div className="flex justify-between items-center pt-1 text-[11px]">
                      <span className="text-indigo-700 font-bold">{f.capacity_beds} Beds Available</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">{f.operating_status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Camps */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
                <Calendar className="w-4 h-4 text-purple-600 mr-2" /> Scheduled Health & Immunization Camps
              </h3>
              <div className="space-y-3">
                {data.camps.map((c, idx) => (
                  <div key={idx} className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs font-mono space-y-1">
                    <div className="font-bold text-purple-950">{c.camp_name}</div>
                    <div className="text-purple-800">{c.ward_name || 'Ward 24'} • {c.camp_type}</div>
                    <div className="flex justify-between items-center pt-1 text-[11px]">
                      <span className="text-purple-900">Date: {new Date(c.camp_date).toLocaleDateString()}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-200 text-purple-900">{c.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
