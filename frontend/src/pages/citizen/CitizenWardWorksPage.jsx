import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  HardHat,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Clock,
  IndianRupee,
  Building,
  MapPin,
  ChevronRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../../components/Button';
import { LoadingState } from '../../components/LoadingState';

export const CitizenWardWorksPage = () => {
  const [works, setWorks] = useState([
    {
      work_id: 'w-101',
      work_code: 'W-101',
      work_title: 'Concreting of Internal Lane #4 with Storm Drains',
      description: '200m CC road pavement with reinforced concrete storm water side drains to prevent monsoon waterlogging.',
      department_name: 'Engineering (Civil)',
      sanctioned_amount: 2400000,
      start_date: '2026-06-01',
      target_date: '2026-09-30',
      physical_progress: 65,
      financial_progress: 50,
      status: 'ONGOING',
      location: 'Internal Lane #4, Shivaji Nagar, Ward 24',
      contractor_name: 'Apex Urban Infratech Pvt Ltd',
    },
    {
      work_id: 'w-102',
      work_code: 'W-102',
      work_title: 'Smart LED Streetlight Installation Phase II',
      description: 'Installation of 120 energy-efficient solar hybrid LED streetlights across Lane 1-8 with automated night sensors.',
      department_name: 'Electrical Department',
      sanctioned_amount: 1800000,
      start_date: '2026-05-15',
      target_date: '2026-08-15',
      physical_progress: 90,
      financial_progress: 85,
      status: 'DELAYED',
      location: 'Lane 1 to Lane 8, Shivaji Nagar, Ward 24',
      contractor_name: 'BrightPower Systems LLP',
    },
    {
      work_id: 'w-103',
      work_code: 'W-103',
      work_title: 'Shivaji Park Beautification & Children Play Zone',
      description: 'Comprehensive park rejuvenation with rubberized jogging tracks, synthetic safety tiles, open fitness gym, and solar park lights.',
      department_name: 'Garden & Parks',
      sanctioned_amount: 3500000,
      start_date: '2026-03-01',
      target_date: '2026-07-01',
      physical_progress: 100,
      financial_progress: 100,
      status: 'COMPLETED',
      location: 'Shivaji Park Sector 3, Ward 24',
      contractor_name: 'GreenScape Enterprises',
    },
  ]);

  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Attempt fetch from public/ward works if available
    const fetchWorks = async () => {
      try {
        const res = await api.get('/public/works');
        if (res.data && res.data.length > 0) {
          // Filter to ward 24 if needed or set
          setWorks(res.data);
        }
      } catch (e) {
        // Fallback to rich pre-loaded ward works
      }
    };
    fetchWorks();
  }, []);

  const filteredWorks = works.filter((w) => {
    const matchStatus = filterStatus === 'ALL' || w.status === filterStatus;
    const matchSearch =
      w.work_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
            <HardHat className="w-3.5 h-3.5" />
            <span>WARD 24 CITIZEN TRANSPARENCY</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-1.5">
            Neighborhood Development Works
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time public tracking of municipal works, road concretization, LED lighting, and park projects in Shivaji Nagar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-700">Total Sanctioned Budget</p>
            <p className="text-lg font-black text-emerald-600">₹77.00 Lakhs</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, lane, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'ONGOING', 'DELAYED', 'COMPLETED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Works List Cards */}
      <div className="space-y-4">
        {filteredWorks.map((work) => (
          <div
            key={work.work_id}
            className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-5 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {work.work_code}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      work.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : work.status === 'DELAYED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {work.status}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold flex items-center">
                    <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {work.department_name}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{work.work_title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{work.description}</p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[11px] text-slate-400 font-semibold block">Sanctioned Outlay</span>
                <span className="text-base font-black text-slate-900">
                  ₹{(work.sanctioned_amount / 100000).toFixed(2)} Lakhs
                </span>
              </div>
            </div>

            {/* Progress Bar & Details */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600 flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-1 text-purple-600" /> Physical Progress
                </span>
                <span className="text-purple-700">{work.physical_progress}% Completed</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    work.physical_progress === 100
                      ? 'bg-emerald-500'
                      : work.status === 'DELAYED'
                      ? 'bg-amber-500'
                      : 'bg-purple-600'
                  }`}
                  style={{ width: `${work.physical_progress}%` }}
                />
              </div>
            </div>

            {/* Work Meta Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{work.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  Target: {new Date(work.target_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="truncate font-semibold text-slate-700">Contractor: {work.contractor_name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
