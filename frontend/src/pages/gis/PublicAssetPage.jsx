import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/Button';

export const PublicAssetPage = () => {
  const { assetCode } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (assetCode) fetchPublicAsset();
  }, [assetCode]);

  const fetchPublicAsset = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/public/assets/${assetCode}`);
      setAsset(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Public asset not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-6 rounded-2xl border border-slate-200 shadow-xl space-y-5">
        <div className="text-center space-y-1 border-b border-slate-100 pb-4">
          <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-full mb-2">
            <MapPin className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Municipal Asset Public Telemetry</h2>
          <p className="text-xs text-slate-500">Public Asset Telemetry & Citizen Grievance Portal</p>
        </div>

        {loading && <div className="text-center text-xs text-slate-500 py-6">Fetching public asset details...</div>}

        {error && (
          <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {asset && (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 space-y-1">
              <span className="text-[10px] font-bold bg-blue-200 px-2 py-0.5 rounded text-blue-900">{asset.asset_code}</span>
              <h3 className="text-base font-extrabold mt-1">{asset.asset_name}</h3>
              <p className="text-xs text-blue-800">{asset.corporation_name}</p>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-3 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="font-bold text-slate-900">{asset.category_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Site Location:</span>
                <span className="font-bold text-slate-900">{asset.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-emerald-600">{asset.status}</span>
              </div>
            </div>

            <Button variant="primary" onClick={() => navigate('/citizen/complaints/create')} className="w-full bg-rose-600 hover:bg-rose-700">
              REPORT ASSET PROBLEM <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
