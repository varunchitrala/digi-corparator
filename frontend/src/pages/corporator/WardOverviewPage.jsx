import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { LoadingState } from "../../components/LoadingState";
import { MapCard } from "../../components/MapCard";
import {
  Building2,
  Users,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Mail,
  ExternalLink,
  Search,
  Printer,
  RefreshCw,
  Layers,
  Droplets,
  Zap,
  Trees,
  GraduationCap,
  TrendingUp,
  Activity,
  Compass,
  Building,
  HeartPulse,
  Trash2,
  Clock,
  ChevronRight,
  Home,
  PhoneCall,
  X,
  Sparkles,
} from "lucide-react";

export const WardOverviewPage = () => {
  const [data, setData] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("map"); // map, people, progress, officers
  const [facilityFilter, setFacilityFilter] = useState("ALL");
  const [facilityStatusFilter, setFacilityStatusFilter] = useState("ALL");
  const [facilitySearchQuery, setFacilitySearchQuery] = useState("");
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [officerSearchQuery, setOfficerSearchQuery] = useState("");
  const [officerDeptFilter, setOfficerDeptFilter] = useState("ALL");
  const [toastMessage, setToastMessage] = useState(null);
  const navigate = useNavigate();

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    fetchWardOverview();
  }, []);

  const fetchWardOverview = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [overviewRes, perfRes] = await Promise.all([
        api.get("/corporator/ward").catch((err) => {
          console.warn("API /corporator/ward not ready, showing standard ward info", err);
          return null;
        }),
        api.get("/corporator/ward/performance").catch((err) => {
          console.warn("API /corporator/ward/performance not ready, showing standard ward info", err);
          return null;
        }),
      ]);

      const oData = overviewRes?.data || overviewRes;
      const pData = perfRes?.data || perfRes;

      if (oData && typeof oData === "object") {
        setData(oData);
      }
      if (pData && typeof pData === "object") {
        setPerformance(pData);
      }
      if (isManualRefresh) {
        triggerToast("Ward details refreshed successfully");
      }
    } catch (err) {
      console.error("Could not fetch ward overview:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Friendly, realistic defaults for Ward 24 without any election/electoral matter
  const defaultWard = {
    ward_id: "w-demo-024",
    ward_number: 24,
    ward_name: "Ward 24 - Shivaji Nagar",
    corporation_name: "Chhatrapati Sambhajinagar Municipal Corporation",
    city: "Chhatrapati Sambhajinagar",
    state: "Maharashtra",
    zone: "Zone 4 (East)",
    area_sq_km: 6.8,
    population: 28400,
    households: 5900,
    sanitation_workers: 46,
    latitude: 19.8762,
    longitude: 75.3433,
  };

  const defaultPerformance = {
    complaint_resolution_rate: 82.5,
    sla_compliance_rate: 76.0,
    work_completion_rate: 68.4,
    fund_utilization_rate: 70.0,
    citizen_satisfaction_score: 84.0,
    avg_resolution_hours: "18 hours",
  };

  // Plain-English, common-sense public facilities in Ward 24
  const defaultFacilities = [
    {
      id: "fac-001",
      name: "Solar Streetlights - Main Market Road",
      category: "LIGHTING",
      category_label: "Streetlights",
      lat: 19.8762,
      lng: 75.3433,
      location: "Shivaji Nagar Market Main Road",
      status: "WORKING",
      status_label: "Working Fine",
      in_charge: "Amit Deshmukh (Electricity)",
      details: "Set of bright, energy-saving solar LED streetlights that automatically turn on at night along the main market road.",
      priority: "NORMAL",
      type: "asset",
    },
    {
      id: "fac-002",
      name: "Sector 4 Overhead Drinking Water Tank",
      category: "WATER",
      category_label: "Drinking Water",
      lat: 19.8785,
      lng: 75.34,
      location: "Sector 4 Hill Top Water Reservoir",
      status: "REPAIR",
      status_label: "Under Repair",
      in_charge: "Suresh Kulkarni (Water Supply)",
      details: "Large clean drinking water tank providing daily water to about 14,000 residents. Pipe valve replacement is currently in progress.",
      priority: "HIGH",
      type: "asset",
    },
    {
      id: "fac-003",
      name: "Shivaji Public Park & Children Playground",
      category: "PARK",
      category_label: "Parks & Gardens",
      lat: 19.873,
      lng: 75.349,
      location: "Sector 2 Residential Area",
      status: "WORKING",
      status_label: "Working Fine",
      in_charge: "Ramesh Bhosale (Parks)",
      details: "Public green garden with a 400m walking track, children swings, open gym equipment, and garden benches.",
      priority: "NORMAL",
      type: "asset",
    },
    {
      id: "fac-004",
      name: "Government Primary School & Anganwadi",
      category: "SCHOOL",
      category_label: "Schools",
      lat: 19.874,
      lng: 75.346,
      location: "Station Link Road, Ward 24",
      status: "WORKING",
      status_label: "Working Fine",
      in_charge: "Prakash Patil (Building Works)",
      details: "Municipal primary school for 420 local children, equipped with clean drinking water filters and mid-day meal kitchen.",
      priority: "NORMAL",
      type: "asset",
    },
    {
      id: "fac-005",
      name: "Local Health Clinic (Urban Health Center)",
      category: "HEALTH",
      category_label: "Health Clinics",
      lat: 19.8775,
      lng: 75.3418,
      location: "Community Center, Sector 3",
      status: "WORKING",
      status_label: "Working Fine",
      in_charge: "Dr. Sneha Jadhav (Health)",
      details: "Government health center offering daily doctor checkups, child vaccines, basic blood tests, and free medicines.",
      priority: "NORMAL",
      type: "asset",
    },
    {
      id: "fac-006",
      name: "Daily Garbage Collection & Cleaning Shed",
      category: "CLEANING",
      category_label: "Cleanliness & Waste",
      lat: 19.8715,
      lng: 75.3445,
      location: "Near Railway Boundary Road",
      status: "WORKING",
      status_label: "Working Fine",
      in_charge: "Dr. Sneha Jadhav (Health)",
      details: "Local waste pickup hub where daily wet and dry garbage from homes is collected and safely transported.",
      priority: "NORMAL",
      type: "asset",
    },
    {
      id: "fac-007",
      name: "Monsoon Rain Water Drain Pump Station",
      category: "DRAINAGE",
      category_label: "Water Drainage",
      lat: 19.8792,
      lng: 75.3475,
      location: "North Drain Crossing",
      status: "WORKING",
      status_label: "Working Fine",
      in_charge: "Suresh Kulkarni (Water Supply)",
      details: "Water pump station that drains excess rainwater during heavy monsoons to prevent road flooding.",
      priority: "NORMAL",
      type: "asset",
    },
    {
      id: "fac-008",
      name: "Community Reading Hall & Study Room",
      category: "COMMUNITY",
      category_label: "Community Centers",
      lat: 19.8755,
      lng: 75.348,
      location: "Near Ganesh Temple Square",
      status: "WORKING",
      status_label: "Working Fine",
      in_charge: "Prakash Patil (Building Works)",
      details: "Quiet community study space with newspapers, books, and study tables for students and senior citizens.",
      priority: "NORMAL",
      type: "asset",
    },
  ];

  // Plain-English local officers directory
  const defaultOfficers = [
    {
      id: "off-1",
      name: "Suresh Kulkarni",
      role: "Water Supply Engineer",
      dept: "Drinking Water & Sewage",
      phone: "9876543233",
      email: "suresh.kulkarni@demomunicipal.gov.in",
      location: "Sector 4 Water Sub-Station",
      tasks_active: 8,
      tasks_done: 24,
      duty_status: "Available on Duty",
    },
    {
      id: "off-2",
      name: "Amit Deshmukh",
      role: "Electricity & Streetlight Engineer",
      dept: "Streetlights & Electricity",
      phone: "9876543244",
      email: "amit.deshmukh@demomunicipal.gov.in",
      location: "Shivaji Chowk Electrical Office",
      tasks_active: 5,
      tasks_done: 31,
      duty_status: "On Field Visit",
    },
    {
      id: "off-3",
      name: "Prakash Patil",
      role: "Roads & Construction Engineer",
      dept: "Roads, Buildings & Drains",
      phone: "9876543255",
      email: "prakash.patil@demomunicipal.gov.in",
      location: "Ward 24 Municipal Office",
      tasks_active: 12,
      tasks_done: 19,
      duty_status: "Available on Duty",
    },
    {
      id: "off-4",
      name: "Dr. Sneha Jadhav",
      role: "Ward Doctor & Health Inspector",
      dept: "Health & Ward Cleanliness",
      phone: "9876543266",
      email: "sneha.jadhav@demomunicipal.gov.in",
      location: "Urban Health Clinic, Shivaji Nagar",
      tasks_active: 6,
      tasks_done: 42,
      duty_status: "Available on Duty",
    },
    {
      id: "off-5",
      name: "Ramesh Bhosale",
      role: "Parks & Greenery Supervisor",
      dept: "Public Gardens & Trees",
      phone: "9876543277",
      email: "ramesh.bhosale@demomunicipal.gov.in",
      location: "Shivaji Park Office",
      tasks_active: 3,
      tasks_done: 15,
      duty_status: "Available on Duty",
    },
  ];

  // Resolve data safely with fallbacks
  const ward = {
    ...defaultWard,
    ...(data?.ward || {}),
  };

  const corporationText = [
    ward.corporation_name || defaultWard.corporation_name,
    ward.city || defaultWard.city,
    ward.state || defaultWard.state,
  ]
    .filter(Boolean)
    .join(" • ");

  const facilities = defaultFacilities;
  const officers = defaultOfficers;
  const perf = {
    ...defaultPerformance,
    ...(performance || {}),
  };

  // Filtered facilities for map and list
  const filteredFacilities = useMemo(() => {
    return facilities.filter((fac) => {
      const matchCat =
        facilityFilter === "ALL" || fac.category === facilityFilter;
      const matchStatus =
        facilityStatusFilter === "ALL" || fac.status === facilityStatusFilter;

      const q = facilitySearchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        fac.name.toLowerCase().includes(q) ||
        fac.location.toLowerCase().includes(q) ||
        fac.category_label.toLowerCase().includes(q);

      return matchCat && matchStatus && matchSearch;
    });
  }, [facilities, facilityFilter, facilityStatusFilter, facilitySearchQuery]);

  // Markers for Leaflet MapCard
  const mapMarkers = useMemo(() => {
    return filteredFacilities.map((fac) => ({
      id: fac.id,
      lat: fac.lat,
      lng: fac.lng,
      title: fac.name,
      description: `${fac.location} • Status: ${fac.status_label}`,
      priority: fac.status === "REPAIR" ? "HIGH" : "NORMAL",
      type: "asset",
    }));
  }, [filteredFacilities]);

  // Filtered Officers
  const filteredOfficers = useMemo(() => {
    return officers.filter((off) => {
      const q = officerSearchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        off.name.toLowerCase().includes(q) ||
        off.role.toLowerCase().includes(q) ||
        off.dept.toLowerCase().includes(q) ||
        off.phone.includes(q);

      const matchDept =
        officerDeptFilter === "ALL" ||
        off.dept.toLowerCase().includes(officerDeptFilter.toLowerCase());

      return matchSearch && matchDept;
    });
  }, [officers, officerSearchQuery, officerDeptFilter]);

  if (loading) {
    return <LoadingState message="Loading Ward 24 information..." />;
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SIMPLE, FRIENDLY WARD HEADER */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Subtle color stripe */}
        <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 w-full" />

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            {/* Left side: Ward Name & Location */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  Ward #{ward.ward_number || 24}
                </span>
                <span className="text-slate-500 font-medium">
                  {ward.zone || "Zone 4 (East)"}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Active Civic Area
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {ward.ward_name || "Ward 24 - Shivaji Nagar"}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{corporationText}</span>
              </p>
            </div>

            {/* Right side: Area and Simple Actions */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center">
                <span className="text-[11px] uppercase font-bold text-slate-400 block">
                  Total Area
                </span>
                <span className="text-lg font-black text-slate-900">
                  {ward.area_sq_km || 6.8} sq km
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => fetchWardOverview(true)}
                  disabled={refreshing}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 active:scale-95 transition-all shadow-2xs"
                  title="Reload details"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${refreshing ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 active:scale-95 transition-all shadow-2xs"
                  title="Print this page"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-600" />
                  <span>Print Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="bg-slate-50/80 border-t border-slate-200 px-6 flex items-center gap-2 overflow-x-auto">
          {[
            { id: "map", label: "Ward Map & Facilities", icon: MapPin },
            { id: "people", label: "People & Local Areas", icon: Users },
            { id: "progress", label: "Complaints & Work Progress", icon: ShieldCheck },
            { id: "officers", label: "Ward Officers & Help Desk", icon: Phone },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 flex items-center gap-2 transition-all ${
                  isActive
                    ? "border-blue-600 text-blue-700 bg-white shadow-2xs -mb-px rounded-t-lg"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-t-lg"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. 5 EASY-TO-UNDERSTAND HIGHLIGHT CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Population */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Total Residents
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {(ward.population || 28400).toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-600">
            About <strong className="text-slate-800">14,480 Men</strong> & <strong className="text-slate-800">13,920 Women</strong>
          </div>
        </div>

        {/* Card 2: Households */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Families / Homes
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {(ward.households || 5900).toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Home className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-emerald-700 font-semibold">
            Clean drinking water in 98% homes
          </div>
        </div>

        {/* Card 3: Facilities */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Public Facilities
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {facilities.length}+ Places
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-purple-700 font-semibold">
            Parks, water tanks, schools & clinics
          </div>
        </div>

        {/* Card 4: Complaints Solved */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Complaints Solved
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {perf.complaint_resolution_rate}%
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-indigo-700 font-semibold">
            104 of 126 issues resolved quickly
          </div>
        </div>

        {/* Card 5: Ward Budget Used */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Ward Fund Spent
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {perf.fund_utilization_rate}%
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-amber-700 font-semibold">
            ₹57.5 Lakhs spent on local works
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: WARD MAP & LOCAL PUBLIC PLACES */}
      {/* ========================================================================= */}
      {activeTab === "map" && (
        <div className="space-y-6">
          {/* Simple Category Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {[
                { id: "ALL", label: "All Places", icon: Layers },
                { id: "WATER", label: "Drinking Water", icon: Droplets },
                { id: "LIGHTING", label: "Streetlights", icon: Zap },
                { id: "PARK", label: "Parks & Gardens", icon: Trees },
                { id: "SCHOOL", label: "Schools", icon: GraduationCap },
                { id: "HEALTH", label: "Health Clinics", icon: HeartPulse },
              ].map((cat) => {
                const isSelected = facilityFilter === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setFacilityFilter(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input & Status Filter */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search a place..."
                  value={facilitySearchQuery}
                  onChange={(e) => setFacilitySearchQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <select
                value={facilityStatusFilter}
                onChange={(e) => setFacilityStatusFilter(e.target.value)}
                className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="WORKING">Working Fine</option>
                <option value="REPAIR">Under Repair</option>
              </select>
            </div>
          </div>

          {/* Interactive Map */}
          <div className="relative">
            <MapCard
              title={`${ward.ward_name} - Map of Public Places`}
              latitude={ward.latitude ? parseFloat(ward.latitude) : 19.8762}
              longitude={ward.longitude ? parseFloat(ward.longitude) : 75.3433}
              zoom={14}
              height="400px"
              markers={mapMarkers}
            />

            {/* Map Legend */}
            <div className="absolute top-4 right-4 z-10 bg-white/95 border border-slate-200 p-2.5 rounded-xl shadow-md text-xs font-medium space-y-1 hidden sm:block">
              <span className="text-[10px] font-bold text-slate-400 uppercase block border-b border-slate-100 pb-1">
                Map Color Guide
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-700">Working Fine</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-slate-700">Repair in Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <span className="text-slate-700">Ward Office</span>
              </div>
            </div>
          </div>

          {/* List of Public Facilities */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" /> Public Places & Facilities in Ward 24
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click on any place below to see full details and which officer is responsible
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                {filteredFacilities.length} Places Found
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredFacilities.map((fac) => {
                const isRepair = fac.status === "REPAIR";
                return (
                  <div
                    key={fac.id}
                    onClick={() => setSelectedFacility(fac)}
                    className="group bg-slate-50/70 hover:bg-white rounded-xl border border-slate-200 hover:border-blue-400 p-4 transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          {fac.category_label}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isRepair
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          {fac.status_label}
                        </span>
                      </div>

                      {/* Title & Location */}
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {fac.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {fac.location}
                      </p>
                    </div>

                    {/* Bottom Officer Name */}
                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                      <span className="truncate max-w-[150px]">
                        Officer: <strong className="text-slate-700">{fac.in_charge.split(" ")[0]}</strong>
                      </span>
                      <span className="text-blue-600 font-bold group-hover:underline flex items-center">
                        Details <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PEOPLE, FAMILIES & LOCAL AREAS (NO ELECTION/VOTER MATTER) */}
      {/* ========================================================================= */}
      {activeTab === "people" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: People & Basic Amenities */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" /> People Living in Ward 24
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  General information about families, age groups, and everyday civic services
                </p>
              </div>

              {/* Age Groups in Simple English */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  People by Age Groups
                </h4>

                <div className="space-y-3">
                  {[
                    { label: "Children & Youth (below 18 years)", pct: 28, count: "7,950 children", color: "bg-sky-500" },
                    { label: "Working Adults (18 to 59 years)", pct: 58, count: "16,470 adults", color: "bg-blue-600" },
                    { label: "Senior Citizens (60 years and above)", pct: 14, count: "3,980 elders", color: "bg-purple-600" },
                  ].map((cohort) => (
                    <div key={cohort.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-700 font-semibold">{cohort.label}</span>
                        <span className="text-slate-900 font-bold">
                          {cohort.count} ({cohort.pct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${cohort.color} rounded-full`}
                          style={{ width: `${cohort.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Basic Daily Services Coverage */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Daily Essential Services in Ward 24
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 block">Drinking Water</span>
                    <span className="text-xl font-black text-emerald-600 mt-1 block">98.4%</span>
                    <span className="text-[10px] text-slate-500">Piped to homes</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 block">Streetlights</span>
                    <span className="text-xl font-black text-blue-600 mt-1 block">96.0%</span>
                    <span className="text-[10px] text-slate-500">Roads well lit</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 block">Garbage Pickup</span>
                    <span className="text-xl font-black text-purple-600 mt-1 block">100%</span>
                    <span className="text-[10px] text-slate-500">Daily van service</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 block">Paved Roads</span>
                    <span className="text-xl font-black text-slate-800 mt-1 block">92.0%</span>
                    <span className="text-[10px] text-slate-500">Concrete lanes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Ward Cleaning Team & Highlights */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-emerald-600" /> Daily Cleanliness Team
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Sanitation and daily street sweeping</p>
              </div>

              <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-100 space-y-1">
                <span className="text-xs font-bold text-emerald-900 block">Sanitation Staff on Duty</span>
                <span className="text-2xl font-black text-emerald-800">46 Daily Workers</span>
                <p className="text-xs text-emerald-700 mt-1">
                  Sweeping streets, clearing drains, and picking up doorstep garbage every morning.
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                  <span className="font-semibold text-slate-700">Garbage Collection Time:</span>
                  <span className="font-bold text-slate-900">7:00 AM – 11:30 AM</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                  <span className="font-semibold text-slate-700">Water Supply Timings:</span>
                  <span className="font-bold text-slate-900">Morning 6:00 – 9:00 AM</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                  <span className="font-semibold text-slate-700">Cleanliness Status:</span>
                  <span className="font-bold text-emerald-700">ODF++ Open Defecation Free</span>
                </div>
              </div>
            </div>
          </div>

          {/* Local Neighborhoods & Colonies */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-600" /> Main Colonies & Areas in Ward 24
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Shivaji Nagar Central", pop: "9,800 people", homes: "2,050 homes", desc: "Main market street, busy shops, and paved residential lanes." },
                { name: "Sector 4 Colony", pop: "7,400 people", homes: "1,520 homes", desc: "Family residential area with elevated water storage tank." },
                { name: "Station Link Road Area", pop: "6,200 people", homes: "1,310 homes", desc: "Connecting road with new solar streetlights and schools." },
                { name: "Railway Boundary Colony", pop: "5,000 people", homes: "1,020 homes", desc: "Developing residential area with storm water drain work." },
              ].map((area) => (
                <div key={area.name} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-sm font-bold text-slate-900">{area.name}</h4>
                  <p className="text-xs text-slate-500">{area.desc}</p>
                  <div className="pt-2 border-t border-slate-200/60 text-xs flex justify-between text-slate-700">
                    <span>{area.pop}</span>
                    <strong className="text-slate-900">{area.homes}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: COMPLAINTS & WORK PROGRESS IN PLAIN ENGLISH */}
      {/* ========================================================================= */}
      {activeTab === "progress" && (
        <div className="space-y-6">
          {/* Progress Cards */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" /> How Fast Are Ward Issues Getting Solved?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  See how citizen complaints, street repairs, and development funds are performing
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                Overall Performance: Very Good (82%)
              </span>
            </div>

            {/* 5 Progress Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Box 1 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-600">Complaints Solved</span>
                  <p className="text-3xl font-black text-blue-600 mt-2">
                    {perf.complaint_resolution_rate}%
                  </p>
                  <p className="text-xs text-slate-500 mt-1">104 of 126 issues closed</p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-200/60">
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${perf.complaint_resolution_rate}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-emerald-600 font-bold block mt-1.5">Most solved on time</span>
                </div>
              </div>

              {/* Box 2 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-600">Speed of Work</span>
                  <p className="text-3xl font-black text-emerald-600 mt-2">
                    {perf.sla_compliance_rate}%
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Average time: 18 hours</p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-200/60">
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${perf.sla_compliance_rate}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-emerald-700 font-bold block mt-1.5">Faster than city average</span>
                </div>
              </div>

              {/* Box 3 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-600">Local Construction</span>
                  <p className="text-3xl font-black text-indigo-600 mt-2">
                    {perf.work_completion_rate}%
                  </p>
                  <p className="text-xs text-slate-500 mt-1">18 road & drain projects</p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-200/60">
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${perf.work_completion_rate}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-blue-600 font-bold block mt-1.5">5 Completed • 8 Ongoing</span>
                </div>
              </div>

              {/* Box 4 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-600">Fund Spent</span>
                  <p className="text-3xl font-black text-amber-600 mt-2">
                    {perf.fund_utilization_rate}%
                  </p>
                  <p className="text-xs text-slate-500 mt-1">₹57.5 Lakhs of ₹1.00 Crore</p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-200/60">
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-600 rounded-full"
                      style={{ width: `${perf.fund_utilization_rate}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-amber-700 font-bold block mt-1.5">Properly accounted for</span>
                </div>
              </div>

              {/* Box 5 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-600">Citizen Rating</span>
                  <p className="text-3xl font-black text-purple-600 mt-2">
                    {perf.citizen_satisfaction_score}%
                  </p>
                  <p className="text-xs text-slate-500 mt-1">4.2 out of 5 stars</p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-200/60">
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full"
                      style={{ width: `${perf.citizen_satisfaction_score}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-purple-700 font-bold block mt-1.5">From 480+ local reviews</span>
                </div>
              </div>
            </div>
          </div>

          {/* Department Breakdown Table in Plain Language */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" /> Work Done by Each Department
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <th className="py-3 px-4 font-bold">Service / Department</th>
                    <th className="py-3 px-4 font-bold">Officer in Charge</th>
                    <th className="py-3 px-4 font-bold">Complaints Received</th>
                    <th className="py-3 px-4 font-bold">Avg Time Taken</th>
                    <th className="py-3 px-4 font-bold">Solved Rate</th>
                    <th className="py-3 px-4 font-bold">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {[
                    { dept: "Health & Street Cleaning", officer: "Dr. Sneha Jadhav", complaints: "42 complaints", time: "12 hours", rate: "92.8% solved", grade: "EXCELLENT", badgeClass: "bg-emerald-100 text-emerald-800" },
                    { dept: "Drinking Water Supply", officer: "Suresh Kulkarni", complaints: "36 complaints", time: "24 hours", rate: "86.1% solved", grade: "VERY GOOD", badgeClass: "bg-blue-100 text-blue-800" },
                    { dept: "Streetlights & Electricity", officer: "Amit Deshmukh", complaints: "28 complaints", time: "24 hours", rate: "82.1% solved", grade: "GOOD", badgeClass: "bg-indigo-100 text-indigo-800" },
                    { dept: "Roads & Storm Drains", officer: "Prakash Patil", complaints: "20 complaints", time: "72 hours", rate: "75.0% solved", grade: "SATISFACTORY", badgeClass: "bg-amber-100 text-amber-800" },
                  ].map((row) => (
                    <tr key={row.dept} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{row.dept}</td>
                      <td className="py-3 px-4 text-slate-600">{row.officer}</td>
                      <td className="py-3 px-4">{row.complaints}</td>
                      <td className="py-3 px-4">{row.time}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{row.rate}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${row.badgeClass}`}>
                          {row.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: WARD OFFICERS & 24x7 EMERGENCY HELPLINE */}
      {/* ========================================================================= */}
      {activeTab === "officers" && (
        <div className="space-y-6">
          {/* Officers Search Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search officer by name, department, or phone..."
                value={officerSearchQuery}
                onChange={(e) => setOfficerSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={officerDeptFilter}
                onChange={(e) => setOfficerDeptFilter(e.target.value)}
                className="text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Departments</option>
                <option value="Water">Water Supply</option>
                <option value="Electricity">Electricity & Lights</option>
                <option value="Roads">Roads & Construction</option>
                <option value="Health">Health & Cleaning</option>
                <option value="Parks">Parks & Gardens</option>
              </select>

              <span className="text-xs text-slate-500 font-semibold hidden md:inline">
                {filteredOfficers.length} Officers on Duty
              </span>
            </div>
          </div>

          {/* Officers Cards with Direct Phone Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOfficers.map((off) => {
              const initials = off.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();

              return (
                <div
                  key={off.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                          {initials}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{off.name}</h4>
                          <p className="text-xs text-blue-700 font-semibold mt-0.5">
                            {off.role}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                        {off.duty_status}
                      </span>
                    </div>

                    {/* Department & Office */}
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200/70 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Department:</span>
                        <strong className="text-slate-800">{off.dept}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Office Location:</span>
                        <span className="text-slate-700 font-medium truncate max-w-[170px]">
                          {off.location}
                        </span>
                      </div>
                    </div>

                    {/* Work numbers */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="p-2 bg-slate-50 rounded border border-slate-200/60">
                        <span className="text-[10px] text-slate-400 block font-semibold">Active Tasks</span>
                        <span className="text-sm font-bold text-slate-800">{off.tasks_active} ongoing</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded border border-slate-200/60">
                        <span className="text-[10px] text-slate-400 block font-semibold">Solved This Month</span>
                        <span className="text-sm font-bold text-emerald-600">{off.tasks_done} completed</span>
                      </div>
                    </div>
                  </div>

                  {/* Direct Contact Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <a
                      href={`tel:${off.phone}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all active:scale-95 shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call: {off.phone}</span>
                    </a>
                    {off.email && (
                      <a
                        href={`mailto:${off.email}`}
                        className="inline-flex items-center justify-center p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        title="Send Email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 24x7 Emergency Help Desk */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider block">
                24x7 Ward Emergency Desk
              </span>
              <h4 className="text-lg font-bold text-white mt-1">
                Need Urgent Help in Ward 24?
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                For broken drinking water pipes, sudden street waterlogging, fallen trees, or live electrical wire hazards.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="text-[10px] text-blue-200 block uppercase font-bold">Helpline Number</span>
                <span className="text-2xl font-black text-white">0240-2345678</span>
              </div>
              <a
                href="tel:02402345678"
                className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Helpline</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FACILITY DETAIL POPUP */}
      {/* ========================================================================= */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {selectedFacility.category_label}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedFacility.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedFacility.location}</p>
              </div>
              <button
                onClick={() => setSelectedFacility(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <p className="text-slate-700 leading-relaxed">{selectedFacility.details}</p>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Current Status</span>
                  <span
                    className={`font-bold ${
                      selectedFacility.status === "REPAIR"
                        ? "text-amber-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {selectedFacility.status_label}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Officer in Charge</span>
                  <span className="font-bold text-slate-900">{selectedFacility.in_charge}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => setSelectedFacility(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
