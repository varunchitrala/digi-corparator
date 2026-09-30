import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table } from '../../components/Table';
import { LoadingState } from '../../components/LoadingState';
import { Building2, AlertTriangle, HardHat } from 'lucide-react';

export const CorporatorDepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporator/departments');
      setDepartments(res.data);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Fetching Ward departments..." />;

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
          DEPARTMENT MONITORING
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Ward Department Performance</h2>
        <p className="text-xs text-slate-500">Monitor active municipal departments operating in Ward 24.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div key={dept.department_id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">{dept.department_code}</span>
              <h3 className="text-lg font-black text-slate-900 mt-2">{dept.department_name}</h3>
              <p className="text-xs text-slate-500 mt-1">{dept.description}</p>
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-700 font-semibold">
                <p className="flex justify-between"><span>Active Complaints:</span> <strong className="text-blue-600">{dept.total_complaints || 0}</strong></p>
                <p className="flex justify-between"><span>Pending Escalations:</span> <strong className="text-amber-600">{dept.pending_complaints || 0}</strong></p>
                <p className="flex justify-between"><span>Active Works:</span> <strong className="text-indigo-600">{dept.total_works || 0}</strong></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
