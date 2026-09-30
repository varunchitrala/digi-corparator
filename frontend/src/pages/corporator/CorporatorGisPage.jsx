import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { MapCard } from '../../components/MapCard';
import { LoadingState } from '../../components/LoadingState';
import { Layers } from 'lucide-react';

export const CorporatorGisPage = () => {
  const [gisData, setGisData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGis();
  }, []);

  const fetchGis = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporator/gis');
      setGisData(res.data);
    } catch (err) {
      console.error('Failed to fetch GIS data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Rendering Leaflet OpenStreetMap GIS Spatial Dashboard..." />;

  const assets = gisData?.assets || [];
  const complaints = gisData?.complaints || [];

  const markers = [
    ...assets.map((a) => ({
      id: a.asset_id,
      lat: parseFloat(a.latitude) || 19.8762,
      lng: parseFloat(a.longitude) || 75.3433,
      title: `[ASSET] ${a.asset_name} (${a.asset_type})`,
      status: a.status,
      type: 'asset'
    })),
    ...complaints.map((c) => ({
      id: c.complaint_id,
      lat: parseFloat(c.latitude) || 19.8762,
      lng: parseFloat(c.longitude) || 75.3433,
      title: `[COMPLAINT] ${c.complaint_number} - ${c.title}`,
      status: c.status,
      type: 'complaint'
    }))
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
          SPATIAL WARD MAP
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Ward 24 GIS Spatial Dashboard</h2>
        <p className="text-xs text-slate-500">OpenStreetMap boundary view with active complaints, public assets, and civil works layers.</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <MapCard
          center={[19.8762, 75.3433]}
          zoom={14}
          markers={markers}
          height="550px"
        />
      </div>
    </div>
  );
};
