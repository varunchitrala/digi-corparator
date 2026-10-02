import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import {
  AlertTriangle,
  FileText,
  FileCheck,
  Receipt,
  HardHat,
  PlusCircle,
  PhoneCall,
  Clock,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Building2,
  MapPin,
  Calendar,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../components/Button';
import { ComplaintStatusBadge } from '../../components/complaints/ComplaintStatusBadge';

export const CitizenDashboardPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalComplaints: 3,
    activeComplaints: 2,
    resolvedComplaints: 1,
    applicationsCount: 2,
    taxDue: 12850,
    wardWorksCount: 3,
  });

  const [recentComplaints, setRecentComplaints] = useState([
    {
      complaint_id: 'cmp-1024',
      complaint_number: 'CMP-2026-1024',
      title: 'Flickering Streetlight outside Plot 42',
      category_name: 'Streetlight Defect',
      status: 'REGISTERED',
      sla_hours: 24,
      created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    },
    {
      complaint_id: 'cmp-1025',
      complaint_number: 'CMP-2026-1025',
      title: 'Water Pipeline Burst near Bus Stop',
      category_name: 'Water Supply Leakage',
      status: 'IN_PROGRESS',
      sla_hours: 24,
      created_at: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
    },
    {
      complaint_id: 'cmp-1026',
      complaint_number: 'CMP-2026-1026',
      title: 'Garbage Bin Overflow near Community Hall',
      category_name: 'Garbage Overflow',
      status: 'RESOLVED',
      sla_hours: 12,
      created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    },
  ]);

  const [recentApplications, setRecentApplications] = useState([
    {
      application_id: 'app-001',
      application_number: 'APP-2026-4091',
      service_name: 'Birth Certificate Issuance',
      status: 'APPROVED',
      applied_date: '2026-09-18',
      certificate_ready: true,
    },
    {
      application_id: 'app-002',
      application_number: 'APP-2026-8812',
      service_name: 'Residential Potable Water Connection (1/2")',
      status: 'UNDER_REVIEW',
      applied_date: '2026-09-25',
      certificate_ready: false,
    },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Attempt live fetch if available
    const loadData = async () => {
      try {
        const res = await api.get('/citizen/complaints');
        if (res.data && res.data.length > 0) {
          setRecentComplaints(res.data);
          const active = res.data.filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length;
          const resolved = res.data.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
          setStats(prev => ({
            ...prev,
            totalComplaints: res.data.length,
            activeComplaints: active,
            resolvedComplaints: resolved,
          }));
        }
      } catch (e) {
        // Fallback to rich demo state
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome & Ward Announcement Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-emerald-900/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>NAGARIK SEVA PORTAL &bull; WARD 24 (SHIVAJI NAGAR)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Namaskar, {user?.first_name || 'Vijay'} {user?.last_name || 'Shinde'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              Your direct civic window to Chhatrapati Sambhajinagar Municipal Corporation. Register grievances, track public certificates, pay ward taxes, and monitor ongoing local development.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link to="/citizen/complaints/create">
              <Button variant="primary" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black shadow-lg shadow-emerald-500/20 border-0">
                <PlusCircle className="w-4 h-4 mr-1.5 text-slate-950" />
                Register Grievance
              </Button>
            </Link>
            <Link to="/citizen/revenue">
              <Button variant="outline" className="border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-bold">
                <CreditCard className="w-4 h-4 mr-1.5 text-emerald-400" />
                Pay Dues (₹12,850)
              </Button>
            </Link>
          </div>
        </div>

        {/* Live Citizen Alert Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center space-x-2.5 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider shrink-0">CIVIC NOTICE:</span>
            <span className="truncate text-slate-300">
              Ward 24 Cleanliness & Tree Plantation Drive this Saturday | Water pipeline maintenance on Oct 4 (10 AM - 2 PM).
            </span>
          </div>
          <Link to="/citizen/helpline" className="text-emerald-400 hover:text-emerald-300 font-bold shrink-0 ml-4 hidden sm:inline-flex items-center">
            Helplines <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Complaints */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Grievances</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-slate-900">{stats.totalComplaints}</span>
              <span className="text-xs text-slate-400 font-semibold ml-1.5">Registered</span>
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {stats.activeComplaints} Active
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">{stats.resolvedComplaints} resolved & verified</span>
            <Link to="/citizen/complaints" className="font-bold text-blue-600 hover:text-blue-700 flex items-center">
              View All <ChevronRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        </div>

        {/* Card 2: Applications */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Civic Services</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-slate-900">{stats.applicationsCount}</span>
              <span className="text-xs text-slate-400 font-semibold ml-1.5">Applications</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              1 Ready
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Birth Certificate Approved</span>
            <Link to="/citizen/applications" className="font-bold text-blue-600 hover:text-blue-700 flex items-center">
              Track <ChevronRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        </div>

        {/* Card 3: Municipal Taxes */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Taxes & Dues</span>
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-slate-900">₹{stats.taxDue.toLocaleString('en-IN')}</span>
              <span className="text-[11px] text-slate-400 font-semibold ml-1">Due</span>
            </div>
            <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              FY 2026-27
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">5% Early Rebate Eligible</span>
            <Link to="/citizen/revenue" className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center">
              Pay Now <ChevronRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        </div>

        {/* Card 4: Ward 24 Works */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ward 24 Works</span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <HardHat className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-slate-900">{stats.wardWorksCount}</span>
              <span className="text-xs text-slate-400 font-semibold ml-1.5">Projects</span>
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              Shivaji Nagar
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Road, LED & Park Works</span>
            <Link to="/citizen/ward-works" className="font-bold text-blue-600 hover:text-blue-700 flex items-center">
              Details <ChevronRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Core Quick Action Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/citizen/complaints/create"
          className="group p-5 bg-gradient-to-br from-amber-500/10 via-white to-white rounded-xl border border-amber-200/80 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 mb-3 group-hover:scale-105 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h3 className="font-black text-slate-900 text-sm">Register Grievance</h3>
            <p className="text-xs text-slate-500 mt-1">
              Broken streetlight, road pothole, garbage dump, or water line leak.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform">
            <span>Open 5-Step Form</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </Link>

        <Link
          to="/citizen/services"
          className="group p-5 bg-gradient-to-br from-blue-500/10 via-white to-white rounded-xl border border-blue-200/80 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-black text-slate-900 text-sm">Civic Services Catalog</h3>
            <p className="text-xs text-slate-500 mt-1">
              Apply for Birth/Death Cert, Trade License, Water Connection, or NOC.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform">
            <span>Browse 8 Services</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </Link>

        <Link
          to="/citizen/revenue"
          className="group p-5 bg-gradient-to-br from-emerald-500/10 via-white to-white rounded-xl border border-emerald-200/80 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 mb-3 group-hover:scale-105 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="font-black text-slate-900 text-sm">Pay Taxes & Water Bill</h3>
            <p className="text-xs text-slate-500 mt-1">
              Property tax assessment, instant UPI payment & Tax Clearance download.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
            <span>Payment Portal</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </Link>

        <Link
          to="/citizen/helpline"
          className="group p-5 bg-gradient-to-br from-purple-500/10 via-white to-white rounded-xl border border-purple-200/80 hover:border-purple-400 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 mb-3 group-hover:scale-105 transition-transform">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="font-black text-slate-900 text-sm">Ward 24 Corporator Connect</h3>
            <p className="text-xs text-slate-500 mt-1">
              Direct phone & WhatsApp contact with Hon. Anand Patil & Ward Office.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-purple-700 group-hover:translate-x-1 transition-transform">
            <span>Contact Office</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </Link>
      </div>

      {/* Main 2-Column Split: Active Grievances & Live Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Live Grievances Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
                My Active Grievance Redressals
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Track SLA deadlines, assigned officers, and verification statuses.
              </p>
            </div>
            <Link to="/citizen/complaints">
              <Button variant="outline" size="sm" className="text-xs font-bold">
                View All Complaints
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {recentComplaints.map((item) => (
              <div
                key={item.complaint_id}
                className="p-4 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {item.complaint_number}
                    </span>
                    <ComplaintStatusBadge status={item.status} />
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      SLA: {item.sla_hours}h Max
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center space-x-2">
                    <span>{item.category_name}</span>
                    <span>&bull;</span>
                    <span>Reported {new Date(item.created_at).toLocaleDateString('en-IN')}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/citizen/complaints/${item.complaint_id}`)}
                    className="text-xs font-bold"
                  >
                    View Status & Timeline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Column: Corporator Profile & Civic Bulletins */}
        <div className="space-y-6">
          {/* Ward Corporator Card */}
          <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-xl p-5 shadow-lg border border-blue-800">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-600 border-2 border-white/20 flex items-center justify-center text-white font-black text-xl shadow-md">
                AP
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider bg-blue-500/20 px-2 py-0.5 rounded">
                  Elected NagarSevak
                </span>
                <h3 className="text-base font-extrabold text-white mt-1">Hon. Anand Patil</h3>
                <p className="text-xs text-blue-200">Ward 24 (Shivaji Nagar)</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-blue-800/60 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Office Location:</span>
                <span className="font-semibold text-white truncate ml-2">Town Hall Sub-Office, Shivaji Nagar</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Citizen Visiting Hours:</span>
                <span className="font-semibold text-emerald-400">10:00 AM - 1:00 PM</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Ward Helpline:</span>
                <span className="font-mono font-bold text-white">+91 98765 43224</span>
              </div>
            </div>

            <div className="mt-4 pt-3 flex gap-2">
              <Link to="/citizen/helpline" className="w-full">
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs">
                  <PhoneCall className="w-3.5 h-3.5 mr-1.5" /> Direct Connect
                </Button>
              </Link>
            </div>
          </div>

          {/* Applications Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center">
                <FileCheck className="w-4 h-4 mr-1.5 text-blue-600" />
                Service Applications
              </h3>
              <Link to="/citizen/applications" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                View All
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentApplications.map((app) => (
                <div key={app.application_id} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-700">{app.application_number}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 truncate">{app.service_name}</p>
                  <p className="text-[11px] text-slate-500">Submitted on {app.applied_date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
