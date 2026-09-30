import React from 'react';
import { StatCard } from '../../components/StatCard';
import { Table } from '../../components/Table';
import { Layers, MapPin, Globe, Compass } from 'lucide-react';

export const SuperAdminGisPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-md border border-indigo-200">
          GIS PLATFORM CONFIGURATION
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">Spatial GIS Layers & Tile Server Configuration</h2>
        <p className="text-xs text-slate-500">Configure global Leaflet/OpenStreetMap tile servers, GeoJSON boundaries, and spatial spatial layers.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total GIS Layers" value="18 Layers" color="indigo" icon={Layers} />
        <StatCard title="Tile Server Engine" value="OpenStreetMap" color="blue" icon={Globe} />
        <StatCard title="Mapped Muncipal Features" value="2,450 Assets" color="emerald" icon={MapPin} />
        <StatCard title="Spatial Coordinate System" value="EPSG:4326 (WGS84)" color="purple" icon={Compass} />
      </div>

      <Table headers={['Layer Name', 'Layer Key', 'Feature Category', 'Tile Provider', 'Status']}>
        <tr className="hover:bg-slate-50 text-xs">
          <td className="px-6 py-4 font-bold text-slate-900">Ward Boundaries GeoJSON</td>
          <td className="px-6 py-4 font-mono font-bold text-indigo-700">layer_ward_boundaries</td>
          <td className="px-6 py-4 font-mono text-purple-700">POLYGON</td>
          <td className="px-6 py-4 text-slate-600">Local Vector Server</td>
          <td className="px-6 py-4">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              ACTIVE
            </span>
          </td>
        </tr>
      </Table>
    </div>
  );
};
