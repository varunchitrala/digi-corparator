import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { MapCard } from '../../components/MapCard';
import { LoadingState } from '../../components/LoadingState';
import { Button } from '../../components/Button';
import { ArrowLeft, MapPin } from 'lucide-react';

export const ComplaintMapPage = () => {
  const navigate = useNavigate();
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMapMarkers();
  }, []);

  const fetchMapMarkers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/corporator/complaints/map');
      const formatted = res.data.map((m) => ({
        id: m.complaint_id,
        lat: parseFloat(m.latitude) || 19.8762,
        lng: parseFloat(m.longitude) || 75.3433,
        title: `${m.complaint_number} - ${m.title}`,
        status: m.status,
        type: 'complaint'
      }));
      setMarkers(formatted);
    } catch (err) {
      console.error('Failed to fetch complaint map markers:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Rendering Leaflet spatial map..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate('/corporator/complaints')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Complaints List
        </Button>
        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
          Ward 24 Spatial Complaints Map
        </span>
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
