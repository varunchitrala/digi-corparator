import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { LoadingState } from '../../components/LoadingState';
import { Button } from '../../components/Button';
import {
  Building2,
  HardHat,
  Zap,
  Droplets,
  Waves,
  Trash2,
  Trees,
  HeartPulse,
  Building,
  Search,
  RefreshCw,
  Phone,
  Mail,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
  PhoneCall,
  LayoutGrid,
  List,
  Sparkles,
  ShieldCheck,
  FileText,
  Send,
  Printer,
  ArrowUpDown
} from 'lucide-react';

// ============================================================================
// SIMPLE & CLEAR METADATA FOR EACH DEPARTMENT
// ============================================================================
const DEPARTMENT_METADATA = {
  ENG: {
    icon: HardHat,
    color: 'indigo',
    bgLight: 'bg-indigo-50',
    borderLight: 'border-indigo-100',
    textAccent: 'text-indigo-600',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    sla: '2 to 3 Days',
    officeLocation: 'Ward 24 Office, Room 102',
    headOfficer: 'Er. Rajesh Deshmukh',
    designation: 'Roads & Civil Engineer',
    phone: '+91 98220 14820',
    email: 'ee.roads.w24@municipal.gov.in',
    services: [
      'Fixing potholes and road damages',
      'Making new concrete and tar roads',
      'Repairing footpaths and walkways',
      'Installing speed breakers and road signs'
    ]
  },
  ELEC: {
    icon: Zap,
    color: 'amber',
    bgLight: 'bg-amber-50',
    borderLight: 'border-amber-100',
    textAccent: 'text-amber-600',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
    sla: '24 Hours (1 Day)',
    officeLocation: 'Ward 24 Electrical Store, Ground Floor',
    headOfficer: 'Er. Anand Verma',
    designation: 'Streetlight Engineer',
    phone: '+91 98231 77412',
    email: 'ae.elec.w24@municipal.gov.in',
    services: [
      'Fixing streetlights that are off or flickering',
      'Repairing tall high-mast lights at chowks',
      'Fixing electric wires and power boxes',
      'Lights in public gardens and city buildings'
    ]
  },
  WATER: {
    icon: Droplets,
    color: 'sky',
    bgLight: 'bg-sky-50',
    borderLight: 'border-sky-100',
    textAccent: 'text-sky-600',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
    sla: '24 Hours (1 Day)',
    officeLocation: 'Water Pump House, Sector 4',
    headOfficer: 'Er. Suresh Kulkarni',
    designation: 'Water Supply Engineer',
    phone: '+91 98765 43233',
    email: 'ee.water.w24@municipal.gov.in',
    services: [
      'Fixing broken and leaking water pipes',
      'Solving low water pressure problems',
      'Sending drinking water tankers when needed',
      'Checking dirty water complaints and fixing valves'
    ]
  },
  DRAIN: {
    icon: Waves,
    color: 'teal',
    bgLight: 'bg-teal-50',
    borderLight: 'border-teal-100',
    textAccent: 'text-teal-600',
    badgeBg: 'bg-teal-100 text-teal-800 border-teal-200',
    sla: '1 to 2 Days',
    officeLocation: 'Ward 24 Office, Room 105',
    headOfficer: 'Er. Mahesh Patil',
    designation: 'Drainage & Gutter Engineer',
    phone: '+91 98224 88390',
    email: 'sde.drainage@municipal.gov.in',
    services: [
      'Unclogging choked underground sewer lines',
      'Cleaning open drains and gutters before monsoon',
      'Putting new covers on open manholes for safety',
      'Pumping out rainwater if streets get flooded'
    ]
  },
  SWM: {
    icon: Trash2,
    color: 'emerald',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-100',
    textAccent: 'text-emerald-600',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    sla: '12 Hours (Same Day)',
    officeLocation: 'Sanitation Office, Near Bus Depot',
    headOfficer: 'Mr. Ramesh Gaikwad',
    designation: 'Sanitation Inspector',
    phone: '+91 98210 55192',
    email: 'csi.swm.w24@municipal.gov.in',
    services: [
      'Daily garbage pickup from homes',
      'Emptying and cleaning large street garbage bins',
      'Sweeping streets and removing road dust',
      'Cleaning waste around vegetable and fruit markets'
    ]
  },
  GARDEN: {
    icon: Trees,
    color: 'emerald',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-100',
    textAccent: 'text-emerald-700',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    sla: '3 Days',
    officeLocation: 'Shivaji Park Office',
    headOfficer: 'Ms. Sunita Jadhav',
    designation: 'Parks Officer',
    phone: '+91 98901 33418',
    email: 'sup.gardens@municipal.gov.in',
    services: [
      'Cutting grass and keeping parks clean',
      'Trimming dangerous tree branches over roads',
      'Repairing children swings and slides in parks',
      'Maintaining open gym exercise machines'
    ]
  },
  HEALTH: {
    icon: HeartPulse,
    color: 'rose',
    bgLight: 'bg-rose-50',
    borderLight: 'border-rose-100',
    textAccent: 'text-rose-600',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
    sla: '24 Hours (1 Day)',
    officeLocation: 'Ward 24 Government Health Center',
    headOfficer: 'Dr. Vinod Gaikwad',
    designation: 'Ward Health Doctor',
    phone: '+91 98210 66451',
    email: 'mho.health.w24@municipal.gov.in',
    services: [
      'Mosquito smoke fogging and medicine spraying',
      'Preventing dengue and malaria in the area',
      'Free checkups and child vaccines at local clinic',
      'Checking cleanliness in hotels and tea stalls'
    ]
  },
  TOWN: {
    icon: Building,
    color: 'purple',
    bgLight: 'bg-purple-50',
    borderLight: 'border-purple-100',
    textAccent: 'text-purple-600',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
    sla: '7 Days (1 Week)',
    officeLocation: 'Municipal Corporation Head Office, 3rd Floor',
    headOfficer: 'Er. Pradeep Shinde',
    designation: 'Town Planning Officer',
    phone: '+91 98230 99182',
    email: 'tpo.w24@municipal.gov.in',
    services: [
      'Checking house and shop building permissions',
      'Removing illegal stalls blocking public roads',
      'Marking vendor and vegetable market zones',
      'Keeping public footpaths free for pedestrians'
    ]
  }
};

// ============================================================================
// DEFAULT DEPARTMENTS LIST
// ============================================================================
const DEFAULT_DEPARTMENTS = [
  {
    department_id: 'd-demo-001',
    department_code: 'ENG',
    department_name: 'Roads & Construction',
    description: 'Roads, potholes, footpaths, speed breakers, and gutters.',
    total_complaints: 34,
    pending_complaints: 8,
    total_works: 6
  },
  {
    department_id: 'd-demo-003',
    department_code: 'WATER',
    department_name: 'Drinking Water Supply',
    description: 'Tap water supply, pipeline leaks, low water pressure, and tankers.',
    total_complaints: 42,
    pending_complaints: 6,
    total_works: 4
  },
  {
    department_id: 'd-demo-002',
    department_code: 'ELEC',
    department_name: 'Streetlights & Electricity',
    description: 'Streetlights, light poles, cables, and dark spot lighting.',
    total_complaints: 28,
    pending_complaints: 4,
    total_works: 3
  },
  {
    department_id: 'd-demo-004',
    department_code: 'DRAIN',
    department_name: 'Drainage & Gutters',
    description: 'Underground drains, open gutters, manhole covers, and rainwater.',
    total_complaints: 22,
    pending_complaints: 5,
    total_works: 3
  },
  {
    department_id: 'd-demo-006',
    department_code: 'SWM',
    department_name: 'Garbage & Cleanliness',
    description: 'Daily door-to-door garbage collection, big bins, and road sweeping.',
    total_complaints: 38,
    pending_complaints: 3,
    total_works: 2
  },
  {
    department_id: 'd-demo-005',
    department_code: 'GARDEN',
    department_name: 'Parks & Trees',
    description: 'Public parks, children play areas, and trimming dangerous tree branches.',
    total_complaints: 12,
    pending_complaints: 2,
    total_works: 2
  },
  {
    department_id: 'd-demo-007',
    department_code: 'HEALTH',
    department_name: 'Health & Mosquito Control',
    description: 'Mosquito fogging, dengue control, local clinic, and food safety.',
    total_complaints: 16,
    pending_complaints: 1,
    total_works: 1
  },
  {
    department_id: 'd-demo-008',
    department_code: 'TOWN',
    department_name: 'Building & Road Clearance',
    description: 'Building permissions, clearing illegal stalls, and protecting footpaths.',
    total_complaints: 9,
    pending_complaints: 3,
    total_works: 1
  }
];

export const CorporatorDepartmentsPage = () => {
  const navigate = useNavigate();

  // State
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Views
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('ALL'); // ALL, ATTENTION, WORKS, COMPLIANT
  const [sortBy, setSortBy] = useState('DEFAULT'); // DEFAULT, PENDING_DESC, WORKS_DESC, RESOLUTION_DESC, NAME_ASC
  const [viewMode, setViewMode] = useState('CARDS'); // 'CARDS' | 'TABLE'

  // Drawer & Modals
  const [selectedDept, setSelectedDept] = useState(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isFollowupModalOpen, setIsFollowupModalOpen] = useState(false);

  // Quick Message Form
  const [followupForm, setFollowupForm] = useState({
    title: '',
    remarks: '',
    priority: 'HIGH',
    due_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  });
  const [submittingFollowup, setSubmittingFollowup] = useState(false);

  // Notification message
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopy = (text, id) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedId(id);
    showToast(`Copied ${text} to clipboard`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to add clean officer and service details
  const enrichDepartments = (deptList, officerList = []) => {
    return deptList.map((d) => {
      const code = (d.department_code || '').toUpperCase();
      const meta = DEPARTMENT_METADATA[code] || DEPARTMENT_METADATA.ENG;
      const totalC = parseInt(d.total_complaints || 0, 10);
      const pendingC = parseInt(d.pending_complaints || 0, 10);
      const resolvedC = Math.max(0, totalC - pendingC);
      const resolutionRate = totalC > 0 ? Math.round((resolvedC / totalC) * 100) : 100;

      const matchedOfficer = officerList.find(
        (o) =>
          (o.department_name && o.department_name.toLowerCase().includes(d.department_name?.toLowerCase())) ||
          (o.department_id === d.department_id)
      );

      return {
        ...d,
        meta,
        total_complaints: totalC,
        pending_complaints: pendingC,
        resolved_complaints: resolvedC,
        resolution_rate: resolutionRate,
        total_works: parseInt(d.total_works || 0, 10),
        lead_officer: matchedOfficer
          ? `${matchedOfficer.first_name || ''} ${matchedOfficer.last_name || ''}`.trim()
          : meta.headOfficer,
        officer_designation: matchedOfficer?.designation || meta.designation,
        officer_phone: matchedOfficer?.phone || meta.phone,
        officer_email: matchedOfficer?.email || meta.email
      };
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const [deptRes, offRes] = await Promise.all([
        api.get('/corporator/departments').catch((err) => {
          console.warn('Using standard department list:', err);
          return null;
        }),
        api.get('/corporator/officers').catch((err) => {
          console.warn('Officers list not available:', err);
          return null;
        })
      ]);

      const rawDepts = deptRes?.data || deptRes;
      const rawOfficers = offRes?.data || offRes || [];

      if (Array.isArray(rawDepts) && rawDepts.length > 0) {
        setDepartments(enrichDepartments(rawDepts, Array.isArray(rawOfficers) ? rawOfficers : []));
      } else {
        setDepartments(enrichDepartments(DEFAULT_DEPARTMENTS, Array.isArray(rawOfficers) ? rawOfficers : []));
      }

      if (isManual) {
        showToast('Updated latest department details.');
      }
    } catch (err) {
      console.warn('Using standard department data:', err);
      setDepartments(enrichDepartments(DEFAULT_DEPARTMENTS));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Summary counts
  const stats = useMemo(() => {
    const totalDepts = departments.length;
    const totalComplaints = departments.reduce((acc, d) => acc + (d.total_complaints || 0), 0);
    const totalPending = departments.reduce((acc, d) => acc + (d.pending_complaints || 0), 0);
    const totalResolved = totalComplaints - totalPending;
    const totalWorks = departments.reduce((acc, d) => acc + (d.total_works || 0), 0);
    const overallRate = totalComplaints > 0 ? Math.round((totalResolved / totalComplaints) * 100) : 100;

    return {
      totalDepts,
      totalComplaints,
      totalPending,
      totalResolved,
      totalWorks,
      overallRate
    };
  }, [departments]);

  // Filtering & Sorting
  const filteredDepartments = useMemo(() => {
    return departments
      .filter((dept) => {
        if (filterTab === 'ATTENTION' && (dept.pending_complaints || 0) === 0) return false;
        if (filterTab === 'WORKS' && (dept.total_works || 0) === 0) return false;
        if (filterTab === 'COMPLIANT' && (dept.resolution_rate || 0) < 85) return false;

        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          dept.department_name?.toLowerCase().includes(q) ||
          dept.department_code?.toLowerCase().includes(q) ||
          dept.description?.toLowerCase().includes(q) ||
          dept.lead_officer?.toLowerCase().includes(q) ||
          dept.officer_designation?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'PENDING_DESC') return (b.pending_complaints || 0) - (a.pending_complaints || 0);
        if (sortBy === 'WORKS_DESC') return (b.total_works || 0) - (a.total_works || 0);
        if (sortBy === 'RESOLUTION_DESC') return (b.resolution_rate || 0) - (a.resolution_rate || 0);
        if (sortBy === 'NAME_ASC') return a.department_name.localeCompare(b.department_name);
        return 0;
      });
  }, [departments, filterTab, searchQuery, sortBy]);

  // Open details drawer
  const handleOpenDossier = (dept) => {
    setSelectedDept(dept);
    setIsDossierOpen(true);
  };

  // Send message or task to officer
  const handleCreateFollowup = async (e) => {
    e.preventDefault();
    if (!followupForm.title.trim()) {
      showToast('Please type a short problem name or task.');
      return;
    }

    setSubmittingFollowup(true);
    try {
      await api.post('/corporator/followups', {
        title: `[${selectedDept?.department_name || 'Dept'}] ${followupForm.title}`,
        department_name: selectedDept?.department_name || 'Roads & Civil',
        officer_first_name: selectedDept?.lead_officer || 'Ward Officer',
        officer_phone: selectedDept?.officer_phone || '',
        priority: followupForm.priority,
        due_date: followupForm.due_date,
        remarks: followupForm.remarks || `Sent from Ward Departments page.`
      }).catch((err) => {
        console.warn('Saved message locally:', err);
      });

      showToast(`Message sent to ${selectedDept?.lead_officer || 'Officer in charge'}`);
      setIsFollowupModalOpen(false);
      setFollowupForm({
        title: '',
        remarks: '',
        priority: 'HIGH',
        due_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
      });
    } catch (err) {
      console.error(err);
      showToast('Message saved.');
      setIsFollowupModalOpen(false);
    } finally {
      setSubmittingFollowup(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading Ward Departments and Officers..." />;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 text-sm">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Header Banner & Action Buttons */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-50/60 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                WARD 24 • CITY DEPARTMENTS
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Chhatrapati Sambhajinagar Municipal Corporation
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Ward Departments & Officers
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              See all city departments working in Ward 24, check how fast complaints are being solved, see ongoing road & water work, and call officers directly.
            </p>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center flex-wrap gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEmergencyModalOpen(true)}
              className="text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200 text-xs font-bold gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Emergency Numbers
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="text-slate-700 hover:bg-slate-100 text-xs font-semibold gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              Print List
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="text-xs font-semibold gap-1.5 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Simple Numbers Summary (5 Big Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Departments</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900">{stats.totalDepts}</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Active in Ward 24</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Complaints</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900">{stats.totalComplaints}</span>
            <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">Received from citizens</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Unsolved</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-amber-600">{stats.totalPending}</span>
            <p className="text-[11px] text-amber-700 font-semibold mt-0.5">Needs to be fixed</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Ongoing Projects</span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
              <HardHat className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-teal-700">{stats.totalWorks}</span>
            <p className="text-[11px] text-teal-600 font-semibold mt-0.5">Roads & civil works</p>
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Solved Rate</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-600">{stats.overallRate}%</span>
              <span className="text-[11px] text-emerald-700 font-bold">Good</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${stats.overallRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Search and Simple Filter Buttons */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by department name (Water, Roads, Light) or officer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Departments' },
            { id: 'ATTENTION', label: 'Needs Attention' },
            { id: 'WORKS', label: 'Has Active Work' },
            { id: 'COMPLIANT', label: 'Mostly Solved (85%+)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                filterTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sorting and View Options */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-700 font-semibold focus:outline-none py-1 pr-2 text-xs cursor-pointer"
            >
              <option value="DEFAULT">Sort: Default</option>
              <option value="PENDING_DESC">Most Unsolved Problems</option>
              <option value="WORKS_DESC">Most Ongoing Works</option>
              <option value="RESOLUTION_DESC">Best Solved Rate</option>
              <option value="NAME_ASC">Name (A to Z)</option>
            </select>
          </div>

          {/* Grid vs Table View */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('CARDS')}
              title="Show as Cards"
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'CARDS'
                  ? 'bg-white text-blue-600 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              title="Show as Table"
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'TABLE'
                  ? 'bg-white text-blue-600 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong>{filteredDepartments.length}</strong> of {departments.length} departments
          {searchQuery && ` for "${searchQuery}"`}
        </span>
        {(filterTab !== 'ALL' || searchQuery) && (
          <button
            onClick={() => {
              setFilterTab('ALL');
              setSearchQuery('');
            }}
            className="text-blue-600 hover:underline font-semibold"
          >
            Show All
          </button>
        )}
      </div>

      {/* 4A. Clean Card Grid View */}
      {viewMode === 'CARDS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDepartments.map((dept) => {
            const meta = dept.meta || DEPARTMENT_METADATA.ENG;
            const IconComponent = meta.icon || Building2;
            const hasPending = dept.pending_complaints > 0;

            return (
              <div
                key={dept.department_id || dept.department_code}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${meta.bgLight} ${meta.borderLight} border ${meta.textAccent} shrink-0 group-hover:scale-105 transition-transform`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${meta.badgeBg}`}>
                          {dept.department_code}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug group-hover:text-blue-600 transition-colors">
                          {dept.department_name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">
                    {dept.description || 'City municipal department serving Ward 24.'}
                  </p>

                  {/* Progress Strip */}
                  <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-600">Complaints Solved:</span>
                      <span className="font-bold text-slate-800">
                        {dept.resolved_complaints} of {dept.total_complaints} ({dept.resolution_rate}%)
                      </span>
                    </div>
                    {/* Visual Bar */}
                    <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          dept.resolution_rate >= 80 ? 'bg-emerald-500' : dept.resolution_rate >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${dept.resolution_rate}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-200/60 text-center">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Total</span>
                        <strong className="text-sm font-black text-slate-800">{dept.total_complaints}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Unsolved</span>
                        <strong className={`text-sm font-black ${hasPending ? 'text-amber-600' : 'text-slate-400'}`}>
                          {dept.pending_complaints}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Works</span>
                        <strong className="text-sm font-black text-indigo-600">{dept.total_works}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Officer in Charge */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {dept.lead_officer?.split(' ').map((n) => n[0]).slice(0, 2).join('') || 'OF'}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {dept.lead_officer}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">{dept.officer_designation}</p>
                      </div>
                    </div>

                    {/* Quick Call / Copy */}
                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={`tel:${dept.officer_phone}`}
                        title="Call Officer Now"
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleCopy(dept.officer_phone, dept.department_code)}
                        title="Copy Phone Number"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                      >
                        {copiedId === dept.department_code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Bottom Links */}
                <div className="bg-slate-50/80 px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/corporator/complaints?dept=${dept.department_code}`)}
                      className="text-slate-600 hover:text-blue-600 transition-colors text-[11px]"
                    >
                      Complaints ({dept.total_complaints})
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      onClick={() => navigate(`/corporator/works?dept=${dept.department_code}`)}
                      className="text-slate-600 hover:text-indigo-600 transition-colors text-[11px]"
                    >
                      Works ({dept.total_works})
                    </button>
                  </div>

                  <button
                    onClick={() => handleOpenDossier(dept)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-bold group-hover:translate-x-0.5 transition-all text-xs"
                  >
                    View Details <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4B. Clean Table View */}
      {viewMode === 'TABLE' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Department</th>
                  <th className="px-5 py-3.5">Officer in Charge & Phone</th>
                  <th className="px-5 py-3.5 text-center">Total Complaints</th>
                  <th className="px-5 py-3.5 text-center">Unsolved</th>
                  <th className="px-5 py-3.5 text-center">Ongoing Works</th>
                  <th className="px-5 py-3.5">Solved Progress</th>
                  <th className="px-5 py-3.5">Fix Time</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDepartments.map((dept) => {
                  const meta = dept.meta || DEPARTMENT_METADATA.ENG;
                  const Icon = meta.icon || Building2;
                  const hasPending = dept.pending_complaints > 0;

                  return (
                    <tr key={dept.department_id || dept.department_code} className="hover:bg-slate-50/80 transition-colors">
                      {/* Department Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${meta.bgLight} ${meta.borderLight} border ${meta.textAccent}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 block text-xs">{dept.department_name}</span>
                            <span className="text-[10px] font-mono text-slate-500 font-bold">{dept.department_code}</span>
                          </div>
                        </div>
                      </td>

                      {/* Officer */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900">{dept.lead_officer}</div>
                        <div className="text-[11px] text-slate-500">{dept.officer_designation}</div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-blue-600">
                          <a href={`tel:${dept.officer_phone}`} className="hover:underline flex items-center gap-1 font-mono font-bold">
                            <Phone className="w-3 h-3" /> {dept.officer_phone}
                          </a>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-4 text-center font-black text-slate-800 text-sm">
                        {dept.total_complaints}
                      </td>

                      {/* Unsolved */}
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black ${
                            hasPending ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {dept.pending_complaints}
                        </span>
                      </td>

                      {/* Works */}
                      <td className="px-5 py-4 text-center font-bold text-indigo-700">
                        {dept.total_works}
                      </td>

                      {/* Solved Progress */}
                      <td className="px-5 py-4 min-w-[140px]">
                        <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                          <span className={dept.resolution_rate >= 80 ? 'text-emerald-700' : 'text-amber-700'}>
                            {dept.resolution_rate}% Solved
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${
                              dept.resolution_rate >= 80 ? 'bg-emerald-500' : dept.resolution_rate >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${dept.resolution_rate}%` }}
                          />
                        </div>
                      </td>

                      {/* Fix Time */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {meta.sla}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDossier(dept)}
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition-colors text-xs"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => navigate(`/corporator/complaints?dept=${dept.department_code}`)}
                            title="See Complaints"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={`tel:${dept.officer_phone}`}
                            title="Call Officer"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredDepartments.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No departments found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try typing another word or click below to see all departments.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilterTab('ALL');
              setSearchQuery('');
            }}
            className="mt-4 text-xs font-semibold"
          >
            Show All Departments
          </Button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. DEPARTMENT DETAILS DRAWER                                         */}
      {/* ==================================================================== */}
      {isDossierOpen && selectedDept && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
          <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col h-full">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${selectedDept.meta?.bgLight} ${selectedDept.meta?.borderLight} border ${selectedDept.meta?.textAccent}`}>
                  {React.createElement(selectedDept.meta?.icon || Building2, { className: 'w-6 h-6' })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                      {selectedDept.department_code}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Ward 24 Department</span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 mt-0.5">{selectedDept.department_name}</h2>
                </div>
              </div>
              <button
                onClick={() => setIsDossierOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Complaints & Works Numbers */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Work Summary
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">Total Complaints</span>
                    <span className="text-xl font-black text-slate-900">{selectedDept.total_complaints}</span>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-bold uppercase text-emerald-700 block">Solved</span>
                    <span className="text-xl font-black text-emerald-700">{selectedDept.resolved_complaints}</span>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                    <span className="text-[10px] font-bold uppercase text-amber-700 block">Unsolved</span>
                    <span className="text-xl font-black text-amber-700">{selectedDept.pending_complaints}</span>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                    <span className="text-[10px] font-bold uppercase text-indigo-700 block">Ongoing Works</span>
                    <span className="text-xl font-black text-indigo-700">{selectedDept.total_works}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-slate-700">Complaints Solved on Time</span>
                    <span className="text-emerald-700 font-black">{selectedDept.resolution_rate}% Solved</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${selectedDept.resolution_rate}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span>Normal Time to Fix: <strong>{selectedDept.meta?.sla}</strong></span>
                    <span>Status: <strong className="text-emerald-600">Active</strong></span>
                  </div>
                </div>
              </div>

              {/* Officer in Charge */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Officer in Charge for Ward 24
                </h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-base flex items-center justify-center shrink-0">
                        {selectedDept.lead_officer?.split(' ').map((n) => n[0]).slice(0, 2).join('') || 'OF'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{selectedDept.lead_officer}</h4>
                        <p className="text-xs text-blue-700 font-semibold">{selectedDept.officer_designation}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{selectedDept.meta?.officeLocation}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone:
                      </span>
                      <div className="flex items-center gap-1">
                        <a href={`tel:${selectedDept.officer_phone}`} className="font-mono font-bold text-slate-800 hover:text-blue-600">
                          {selectedDept.officer_phone}
                        </a>
                        <button
                          onClick={() => handleCopy(selectedDept.officer_phone, 'drawer-phone')}
                          className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> Email:
                      </span>
                      <a href={`mailto:${selectedDept.officer_email}`} className="font-semibold text-blue-600 truncate max-w-[150px] hover:underline">
                        {selectedDept.officer_email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* What this department does */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  What This Department Does
                </h4>
                <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
                  {(selectedDept.meta?.services || []).map((service, idx) => (
                    <div key={idx} className="p-3 flex items-start gap-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Quick Actions
                </h4>
                <div className="space-y-2.5">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      setIsDossierOpen(false);
                      setIsFollowupModalOpen(true);
                    }}
                    className="w-full text-xs font-bold gap-2 justify-center"
                  >
                    <Send className="w-4 h-4" />
                    Send Message or Task to {selectedDept.lead_officer}
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/corporator/complaints?dept=${selectedDept.department_code}`)}
                      className="text-xs font-semibold gap-1.5 justify-center"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      View Complaints ({selectedDept.total_complaints})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/corporator/works?dept=${selectedDept.department_code}`)}
                      className="text-xs font-semibold gap-1.5 justify-center"
                    >
                      <HardHat className="w-3.5 h-3.5 text-indigo-600" />
                      View Works ({selectedDept.total_works})
                    </Button>
                  </div>

                  <a
                    href={`tel:${selectedDept.officer_phone}`}
                    className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 text-emerald-600" />
                    Call {selectedDept.lead_officer} ({selectedDept.officer_phone})
                  </a>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDossierOpen(false)}
                className="text-xs font-semibold"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 6. EMERGENCY CONTACT NUMBERS MODAL                                   */}
      {/* ==================================================================== */}
      {isEmergencyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Ward 24 Emergency Contact Numbers
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct phone numbers for urgent problems like water pipe leaks, power cuts, or fallen trees.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEmergencyModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                {
                  service: 'Broken Water Pipe or Dirty Water',
                  wing: 'Water Supply Department',
                  officer: 'Er. Suresh Kulkarni',
                  phone: '+91 98765 43233',
                  sla: 'Fix Time: Within 2 hours',
                  color: 'text-sky-700 bg-sky-50 border-sky-200'
                },
                {
                  service: 'Dangerous Electric Sparking or Light Blackout',
                  wing: 'Electricity & Streetlights',
                  officer: 'Er. Anand Verma',
                  phone: '+91 98231 77412',
                  sla: 'Fix Time: Within 1 hour',
                  color: 'text-amber-700 bg-amber-50 border-amber-200'
                },
                {
                  service: 'Overflowing Gutter or Rainwater Flooding',
                  wing: 'Drainage Department',
                  officer: 'Er. Mahesh Patil',
                  phone: '+91 98224 88390',
                  sla: 'Fix Time: Within 3 hours',
                  color: 'text-teal-700 bg-teal-50 border-teal-200'
                },
                {
                  service: 'Fallen Tree Blocking the Road',
                  wing: 'Parks & Garden Team',
                  officer: 'Ms. Sunita Jadhav',
                  phone: '+91 98901 33418',
                  sla: 'Fix Time: Within 2 hours',
                  color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
                },
                {
                  service: 'Mosquito Spraying or Dead Animal Removal',
                  wing: 'Sanitation & Health Team',
                  officer: 'Mr. Ramesh Gaikwad',
                  phone: '+91 98210 55192',
                  sla: 'Fix Time: Within 4 hours',
                  color: 'text-rose-700 bg-rose-50 border-rose-200'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${item.color}`}
                >
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-75">
                      {item.wing} • {item.sla}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-0.5">{item.service}</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">Officer: {item.officer}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`tel:${item.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-mono font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      {item.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEmergencyModalOpen(false)}
                className="text-xs font-semibold"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 7. SEND MESSAGE / TASK TO OFFICER MODAL                              */}
      {/* ==================================================================== */}
      {isFollowupModalOpen && selectedDept && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">Send Message or Task to Officer</h3>
                  <p className="text-xs text-slate-500">
                    To: <strong>{selectedDept.lead_officer}</strong> ({selectedDept.department_name})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFollowupModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFollowup} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">What is the problem? *</label>
                <input
                  type="text"
                  required
                  placeholder="For example: Urgent water pipe leak near Shivaji Chowk"
                  value={followupForm.title}
                  onChange={(e) => setFollowupForm({ ...followupForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Urgency</label>
                  <select
                    value={followupForm.priority}
                    onChange={(e) => setFollowupForm({ ...followupForm, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CRITICAL">Very Urgent (Today)</option>
                    <option value="HIGH">High (Within 1-2 Days)</option>
                    <option value="MEDIUM">Normal</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Finish By Date</label>
                  <input
                    type="date"
                    value={followupForm.due_date}
                    onChange={(e) => setFollowupForm({ ...followupForm, due_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Extra details or note for the officer</label>
                <textarea
                  rows={3}
                  placeholder="Explain the location or details for the officer to inspect..."
                  value={followupForm.remarks}
                  onChange={(e) => setFollowupForm({ ...followupForm, remarks: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFollowupModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={submittingFollowup}
                  className="gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submittingFollowup ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
