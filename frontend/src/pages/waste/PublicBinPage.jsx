import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/Button';

export const PublicBinPage = () => {
  const { binCode } = useParams();
  const [bin, setBin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (binCode) fetchPublicBin();
  }, [binCode]);

  const fetchPublicBin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/public/waste/bin/${binCode}`);
      setBin(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Smart bin not found');
    } finally {
      setLoading(false);
    }
  };

  const handleReportProblem = () => {
    alert(`Thank you! Bin overflow report logged for Bin Code: ${binCode}. Municipal sanitation team has been notified.`);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-6 rounded-2xl border border-slate-200 shadow-xl space-y-5">
        <div className="text-center space-y-1 border-b border-slate-100 pb-4">
          <div className="inline-flex p-3 bg-purple-50 text-purple-600 rounded-full mb-2">
            <Trash2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Public Smart Bin Telemetry</h2>
          <p className="text-xs text-slate-500">Official Municipal Sanitation Monitoring Portal</p>
        </div>

        {loading && <div className="text-center text-xs text-slate-500 py-6">Verifying smart bin QR code...</div>}

        {error && (
          <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {bin && (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 space-y-1">
              <span className="text-[10px] font-bold bg-purple-200 px-2 py-0.5 rounded text-purple-900">{bin.bin_code}</span>
              <h3 className="text-base font-extrabold mt-1">{bin.address}</h3>
              <p className="text-xs text-purple-800">{bin.ward_name || 'Ward 24'}</p>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-3 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">Bin Type:</span>
                <span className="font-bold text-slate-900">{bin.bin_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Capacity:</span>
                <span className="font-bold text-slate-900">{bin.capacity_liters} Liters</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Fill Level:</span>
                  <span className={`font-bold ${bin.fill_level_percent > 80 ? 'text-rose-600' : 'text-emerald-600'}`}>{bin.fill_level_percent}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${bin.fill_level_percent > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${bin.fill_level_percent}%` }}></div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-emerald-600">{bin.status}</span>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="danger" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-sans" onClick={handleReportProblem}>
                <AlertTriangle className="w-4 h-4 mr-2" /> REPORT OVERFLOW / PROBLEM
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
