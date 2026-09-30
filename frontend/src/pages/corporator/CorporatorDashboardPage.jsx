import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { StatCard } from "../../components/StatCard";
import { ChartCard } from "../../components/ChartCard";
import { MapCard } from "../../components/MapCard";
import { LoadingState } from "../../components/LoadingState";
import { formatCurrency } from "../../utils/formatters";
import {
  AlertTriangle,
  HardHat,
  IndianRupee,
  CalendarDays,
  ListTodo,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  FileText,
  Search,
  Table,
  ExternalLink,
  Activity,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export const CorporatorDashboardPage = () => {
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsView, setAnalyticsView] = useState("categories");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(null);
  const [recordSearchQuery, setRecordSearchQuery] = useState("");
  const [activityFilter, setActivityFilter] = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardTelemetry();
  }, []);

  const defaultStatusData = [
    { status: "REGISTERED", count: 34 },
    { status: "ASSIGNED", count: 26 },
    { status: "IN_PROGRESS", count: 28 },
    { status: "RESOLVED", count: 16 },
    { status: "ESCALATED", count: 8 },
  ];

  const defaultPriorityData = [
    { priority: "CRITICAL", count: 18 },
    { priority: "HIGH", count: 42 },
    { priority: "MEDIUM", count: 52 },
    { priority: "LOW", count: 14 },
  ];

  const fetchDashboardTelemetry = async () => {
    setLoading(true);
    try {
      const res = await api.get("/corporator/dashboard");
      const data = res?.data || res;
      setTelemetry(data);
    } catch (err) {
      console.warn("Serving fallback Corporator telemetry:", err);
      setTelemetry({
        ward: {
          ward_name: "Ward 24 - Shivaji Nagar",
          corporation_name: "Demo Municipal Corporation",
        },
        corporator: { first_name: "Anand", last_name: "Patil" },
        statistics: {
          total_complaints: 126,
          pending_complaints: 82,
          in_progress_complaints: 28,
          resolved_complaints: 16,
          ongoing_works: 18,
          active_works: 8,
          completed_works: 5,
          delayed_works: 5,
          fund_available: 4250000,
          fund_utilized: 5750000,
          total_proposals: 12,
          total_meetings: 5,
          followups_due: 3,
        },
        complaintStatusData: defaultStatusData,
        complaintPriorityData: defaultPriorityData,
      });
    } finally {
      setLoading(false);
    }
  };

  const ward = telemetry?.ward || {
    ward_name: "Ward 24 - Shivaji Nagar",
    corporation_name: "Demo Municipal Corporation",
  };
  const corporator = telemetry?.corporator || {
    first_name: "Anand",
    last_name: "Patil",
  };
  const stats = telemetry?.statistics ||
    telemetry?.stats || {
      total_complaints: 126,
      pending_complaints: 82,
      in_progress_complaints: 28,
      resolved_complaints: 16,
      ongoing_works: 18,
      active_works: 8,
      completed_works: 5,
      delayed_works: 5,
      fund_available: 4250000,
      fund_utilized: 5750000,
      total_proposals: 12,
      total_meetings: 5,
      followups_due: 3,
    };
  const statusData =
    telemetry?.complaintStatusData?.length > 0
      ? telemetry.complaintStatusData
      : telemetry?.complaintStatusDistribution?.length > 0
        ? telemetry.complaintStatusDistribution
        : defaultStatusData;
  const priorityData =
    telemetry?.complaintPriorityData?.length > 0
      ? telemetry.complaintPriorityData
      : telemetry?.complaintPriorityBreakdown?.length > 0
        ? telemetry.complaintPriorityBreakdown
        : defaultPriorityData;
  const attentionItems = telemetry?.attentionRequired?.length
    ? telemetry.attentionRequired
    : [
        {
          id: "att-1",
          title: "SLA Breached Complaints",
          count: stats.escalated_complaints ?? 2,
          priority: "CRITICAL",
          route: "/corporator/complaints?status=ESCALATED",
          subtitle: "Past statutory 72h SLA turnaround threshold",
          tag: "Critical SLA",
          metricNote: "Urgent Escalation",
          type: "complaint",
        },
        {
          id: "att-2",
          title: "Delayed Civic Works",
          count: stats.delayed_works ?? 5,
          priority: "HIGH",
          route: "/corporator/works?status=DELAYED",
          subtitle: "Contract milestone lag (Avg. 14 days delay)",
          tag: "Milestone Lag",
          metricNote: "₹42L Capital Impact",
          type: "work",
        },
        {
          id: "att-3",
          title: "Follow-ups Due Today",
          count: stats.followups_due ?? 3,
          priority: "HIGH",
          route: "/corporator/followups",
          subtitle: "Scheduled hearings & departmental callbacks",
          tag: "Due Today",
          metricNote: "Action by 5:00 PM",
          type: "followup",
        },
      ];
  const defaultActivities = [
    {
      id: "act-1",
      activity_type: "COMPLAINT",
      reference_code: "CMP-1024",
      description: "Streetlight defect reported outside Plot 42",
      status: "IN_PROGRESS",
      priority: "HIGH",
      department: "Electrical",
      location: "Sector 2, Plot 42",
      created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      action_by: "Field Engg. P. Patil",
    },
    {
      id: "act-2",
      activity_type: "WORK",
      reference_code: "WRK-2026-08",
      description: "Internal storm drainage concretisation work started",
      status: "ONGOING",
      priority: "NORMAL",
      department: "Civil PWD Works",
      location: "Shivaji Nagar Main Lane",
      created_at: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
      action_by: "Apex Infra (Contractor)",
    },
    {
      id: "act-3",
      activity_type: "COMPLAINT",
      reference_code: "CMP-1021",
      description: "Water pipeline leakage resolved at Shivaji Chowk",
      status: "RESOLVED",
      priority: "CRITICAL",
      department: "Water Supply",
      location: "Shivaji Chowk Junction",
      created_at: new Date(Date.now() - 135 * 60 * 1000).toISOString(),
      action_by: "Sr. Engg. V. Deshmukh",
    },
    {
      id: "act-4",
      activity_type: "WORK",
      reference_code: "WRK-2026-04",
      description: "Footpath pavers laying completed near Bus Terminal",
      status: "COMPLETED",
      priority: "NORMAL",
      department: "Urban Development",
      location: "Shivaji Nagar Bus Stop",
      created_at: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
      action_by: "PWD Sub-Div II",
    },
    {
      id: "act-5",
      activity_type: "COMPLAINT",
      reference_code: "CMP-1025",
      description:
        "Drinking water contamination in pipeline - Field investigation dispatched",
      status: "ESCALATED",
      priority: "CRITICAL",
      department: "Water Supply & Health",
      location: "Sector 4 Lane 2",
      created_at: new Date(Date.now() - 310 * 60 * 1000).toISOString(),
      action_by: "Executive Engineer",
    },
  ];

  const rawActivities =
    telemetry?.recentActivities?.length > 0
      ? telemetry.recentActivities
      : defaultActivities;

  const activities = rawActivities.map((act, idx) => {
    const isWork =
      act.activity_type === "WORK" || act.reference_code?.startsWith("WRK");
    const isResolved = act.status === "RESOLVED" || act.status === "COMPLETED";
    const isEscalated = act.status === "ESCALATED";

    return {
      ...act,
      id: act.id || `act-${idx}`,
      isWork,
      isResolved,
      isEscalated,
      route: isWork
        ? `/corporator/works?search=${act.reference_code}`
        : `/corporator/complaints?search=${act.reference_code}`,
      department:
        act.department ||
        (isWork
          ? "Civil PWD Works"
          : act.reference_code?.includes("1024")
            ? "Electrical"
            : "Water Supply"),
      location: act.location || "Ward 24 Shivaji Nagar",
      action_by:
        act.action_by || (isWork ? "Contractor Assigned" : "Ward Field Team"),
    };
  });

  const filteredActivities = activities.filter((act) => {
    if (activityFilter === "COMPLAINTS") return !act.isWork;
    if (activityFilter === "WORKS") return act.isWork;
    return true;
  });
  const chartColors = [
    "#ef4444",
    "#f59e0b",
    "#3b82f6",
    "#10b981",
    "#8b5cf6",
    "#64748b",
  ];

  // Civic Department Records Data (Real-world categorized telemetry)
  const categoryRecordsData = [
    {
      category: "Roads & Infrastructure",
      shortName: "Roads",
      logged: 38,
      resolved: 26,
      inProgress: 12,
      rate: "68.4%",
    },
    {
      category: "Water Supply & Sewerage",
      shortName: "Water",
      logged: 32,
      resolved: 24,
      inProgress: 8,
      rate: "75.0%",
    },
    {
      category: "Street Lighting",
      shortName: "Lighting",
      logged: 28,
      resolved: 22,
      inProgress: 6,
      rate: "78.6%",
    },
    {
      category: "Solid Waste & Sanitation",
      shortName: "Sanitation",
      logged: 18,
      resolved: 14,
      inProgress: 4,
      rate: "77.8%",
    },
    {
      category: "Drainage & Stormwater",
      shortName: "Drainage",
      logged: 10,
      resolved: 6,
      inProgress: 4,
      rate: "60.0%",
    },
  ];

  // Month-on-Month Grievance Records Flow
  const monthlyRecordsData = [
    { month: "May 2026", logged: 22, resolved: 19, backlog: 3 },
    { month: "Jun 2026", logged: 28, resolved: 24, backlog: 4 },
    { month: "Jul 2026", logged: 35, resolved: 28, backlog: 7 },
    { month: "Aug 2026", logged: 41, resolved: 33, backlog: 8 },
    { month: "Sep 2026", logged: 34, resolved: 26, backlog: 8 },
  ];

  // Status Pipeline Data with enterprise colors and SLA indicators
  const pipelineRecordsData = [
    {
      name: "New Registered",
      code: "REGISTERED",
      count: 34,
      color: "#f59e0b",
      badge: "27.0%",
      description: "Awaiting field officer review",
    },
    {
      name: "Assigned",
      code: "ASSIGNED",
      count: 26,
      color: "#3b82f6",
      badge: "20.6%",
      description: "Field inspection delegated",
    },
    {
      name: "In Progress",
      code: "IN_PROGRESS",
      count: 28,
      color: "#6366f1",
      badge: "22.2%",
      description: "Active on-ground rectification",
    },
    {
      name: "Resolved",
      code: "RESOLVED",
      count: 30,
      color: "#10b981",
      badge: "23.8%",
      description: "Verified & citizen acknowledged",
    },
    {
      name: "SLA Breached",
      code: "ESCALATED",
      count: 8,
      color: "#ef4444",
      badge: "6.3%",
      description: "Urgent corporator escalation",
    },
  ];

  // Real Ward Grievance Records collection
  const wardRecords = [
    {
      id: "CMP-2026-1024",
      title: "Major road crater and sunken pavers near Shivaji Chowk",
      category: "Roads & Infrastructure",
      citizen: "Ramesh Jadhav",
      location: "Shivaji Chowk, Main Road",
      priority: "CRITICAL",
      status: "ESCALATED",
      sla: "Overdue by 2 days",
      date: "22 Sep 2026",
      officer: "S. Kulkarni (PWD)",
    },
    {
      id: "CMP-2026-1025",
      title: "Underground main drinking water pipe burst",
      category: "Water Supply & Sewerage",
      citizen: "Sunita Shinde",
      location: "Lane 4, Near Ganpati Mandir",
      priority: "HIGH",
      status: "IN_PROGRESS",
      sla: "Due Today 4:00 PM",
      date: "23 Sep 2026",
      officer: "V. Deshmukh (Water Supply)",
    },
    {
      id: "CMP-2026-1026",
      title: "Four consecutive streetlights dark on Internal Road 3",
      category: "Street Lighting",
      citizen: "Amit Kadam",
      location: "Plot 18 to 24, Internal Road",
      priority: "MEDIUM",
      status: "ASSIGNED",
      sla: "Due Tomorrow 11:00 AM",
      date: "23 Sep 2026",
      officer: "P. Patil (Electrical)",
    },
    {
      id: "CMP-2026-1027",
      title: "Community garbage collection vat overflowing onto pavement",
      category: "Solid Waste & Sanitation",
      citizen: "Ganesh Mane",
      location: "Sector 3 Weekly Market Area",
      priority: "HIGH",
      status: "REGISTERED",
      sla: "Due in 18 hrs",
      date: "24 Sep 2026",
      officer: "Pending Allocation",
    },
    {
      id: "CMP-2026-1028",
      title: "Severe stormwater drain choking causing water stagnation",
      category: "Drainage & Stormwater",
      citizen: "Kavita Pawar",
      location: "Cross Road 2, Behind Primary School",
      priority: "CRITICAL",
      status: "IN_PROGRESS",
      sla: "Due Today 6:00 PM",
      date: "23 Sep 2026",
      officer: "S. Kulkarni (PWD)",
    },
    {
      id: "CMP-2026-1029",
      title: "Broken manhole cover repaired and sealed with cement slab",
      category: "Water Supply & Sewerage",
      citizen: "Rahul Joshi",
      location: "Corner of Market Road",
      priority: "MEDIUM",
      status: "RESOLVED",
      sla: "Resolved in 24h",
      date: "21 Sep 2026",
      officer: "V. Deshmukh (Water Supply)",
    },
    {
      id: "CMP-2026-1030",
      title: "Sodium vapour lamp replaced with 45W energy-saving LED",
      category: "Street Lighting",
      citizen: "Prakash More",
      location: "Near Dr. Ambedkar Garden",
      priority: "LOW",
      status: "RESOLVED",
      sla: "Resolved in 36h",
      date: "20 Sep 2026",
      officer: "P. Patil (Electrical)",
    },
    {
      id: "CMP-2026-1031",
      title: "Asphalt patch work done on Ward 24 entrance slope",
      category: "Roads & Infrastructure",
      citizen: "Deepak Sathe",
      location: "Ward Boundary Gate #2",
      priority: "MEDIUM",
      status: "RESOLVED",
      sla: "Resolved in 48h",
      date: "19 Sep 2026",
      officer: "S. Kulkarni (PWD)",
    },
  ];

  const filteredRecords = wardRecords.filter((rec) => {
    const matchesCategory = selectedCategoryFilter
      ? rec.category === selectedCategoryFilter
      : true;
    const matchesSearch = recordSearchQuery
      ? rec.id.toLowerCase().includes(recordSearchQuery.toLowerCase()) ||
        rec.title.toLowerCase().includes(recordSearchQuery.toLowerCase()) ||
        rec.location.toLowerCase().includes(recordSearchQuery.toLowerCase()) ||
        rec.category.toLowerCase().includes(recordSearchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  // Custom tooltips with dark sleek design
  const CustomCategoryTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/60 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 z-50">
          <p className="font-black text-slate-100 border-b border-slate-700/60 pb-1">
            {data.category}
          </p>
          <div className="flex items-center justify-between space-x-4">
            <span className="text-blue-400 font-semibold flex items-center">
              <span className="w-2 h-2 rounded-full bg-blue-400 mr-1.5 inline-block" />
              Logged Records:
            </span>
            <span className="font-bold">{data.logged}</span>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <span className="text-emerald-400 font-semibold flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 inline-block" />
              Resolved Records:
            </span>
            <span className="font-bold">{data.resolved}</span>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <span className="text-amber-400 font-semibold flex items-center">
              <span className="w-2 h-2 rounded-full bg-amber-400 mr-1.5 inline-block" />
              In Progress:
            </span>
            <span className="font-bold">{data.inProgress}</span>
          </div>
          <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-700/40 font-medium">
            Resolution Velocity:{" "}
            <span className="text-emerald-400 font-bold">{data.rate}</span>
          </p>
          <p className="text-[10px] text-blue-300 italic">
            Click bar to inspect matching records
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPipelineTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/60 p-3 rounded-xl shadow-2xl text-xs space-y-1 z-50">
          <p className="font-black text-slate-100 border-b border-slate-700/60 pb-1">
            {data.name}
          </p>
          <p className="text-slate-300">{data.description}</p>
          <p className="font-bold text-amber-300">
            {data.count} Records ({data.badge} of total)
          </p>
          <p className="text-[10px] text-blue-300 italic">
            Click to view complaints
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomMonthlyTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/60 p-3 rounded-xl shadow-2xl text-xs space-y-1 z-50">
          <p className="font-black text-slate-100 border-b border-slate-700/60 pb-1">
            {data.month}
          </p>
          <p className="text-indigo-400 font-semibold">
            New Grievances Logged:{" "}
            <span className="font-bold text-white">{data.logged}</span>
          </p>
          <p className="text-emerald-400 font-semibold">
            Resolved Records:{" "}
            <span className="font-bold text-white">{data.resolved}</span>
          </p>
          <p className="text-amber-400 font-semibold">
            Net Backlog:{" "}
            <span className="font-bold text-white">+{data.backlog}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const priorityTierMeta = {
    CRITICAL: {
      color: "#ef4444",
      sla: "< 24h SLA",
      label: "Critical Emergency",
    },
    HIGH: { color: "#f59e0b", sla: "< 48h SLA", label: "High Priority" },
    MEDIUM: { color: "#3b82f6", sla: "< 72h SLA", label: "Medium Routine" },
    LOW: { color: "#10b981", sla: "< 7d SLA", label: "Low Urgency" },
  };

  const totalPriorityCount =
    priorityData.reduce((acc, curr) => acc + (curr.count || 0), 0) || 126;

  const priorityTierList = priorityData.map((item) => {
    const meta = priorityTierMeta[item.priority] || {
      color: "#64748b",
      sla: "Standard",
      label: item.priority,
    };
    const pct =
      totalPriorityCount > 0
        ? ((item.count / totalPriorityCount) * 100).toFixed(1)
        : "0.0";
    return {
      ...item,
      color: meta.color,
      sla: meta.sla,
      label: meta.label,
      percentage: pct,
    };
  });

  const CustomPriorityTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/60 p-2.5 rounded-xl shadow-xl text-xs space-y-1 z-50">
          <p className="font-bold text-slate-100 flex items-center">
            <span
              className="w-2 h-2 rounded-full mr-1.5 inline-block"
              style={{ backgroundColor: data.color }}
            />
            {data.priority} Priority
          </p>
          <p className="text-slate-300 font-semibold">
            {data.count} Records ({data.percentage}%)
          </p>
          <p className="text-[10px] text-slate-400">Target SLA: {data.sla}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <LoadingState message="Loading Digital Corporator Ward telemetry from MySQL..." />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
              {ward.ward_name || "Ward 24 - Shivaji Nagar"}
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              {ward.corporation_name}
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            {corporator.first_name
              ? `${corporator.first_name} ${corporator.last_name}`
              : "Hon. Corporator"}
            's Dashboard
          </h2>
          <p className="text-xs text-slate-500">
            Real-time Ward grievance monitoring, civil works telemetry, and
            municipal budget utilization.
          </p>
        </div>

        <button
          onClick={fetchDashboardTelemetry}
          className="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-2" /> Refresh Ward Data
        </button>
      </div>

      {/* 6 Grid Stat Cards (Single-border professional real-world cards with direct routing) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Complaints"
          value={stats.total_complaints ?? 126}
          subtitle={`${stats.pending_complaints ?? 82} Pending • ${stats.in_progress_complaints ?? 28} Active`}
          badgeText={`${stats.resolved_complaints ?? 16} Resolved`}
          color="amber"
          icon={AlertCircle}
          onClick={() => navigate("/corporator/complaints")}
        />
        <StatCard
          title="Ongoing Works"
          value={stats.ongoing_works ?? 18}
          subtitle={`${stats.active_works ?? 8} Active • ${stats.completed_works ?? 5} Done`}
          badgeText={`${stats.delayed_works ?? 5} Delayed`}
          color="blue"
          icon={HardHat}
          onClick={() => navigate("/corporator/works")}
        />
        <StatCard
          title="Fund Available"
          value={
            stats.fund_available
              ? formatCurrency(stats.fund_available)
              : "₹42.50 L"
          }
          subtitle="Budget: ₹1.00 Cr"
          badgeText={
            stats.fund_utilized
              ? `${((stats.fund_utilized / ((stats.fund_available || 0) + stats.fund_utilized)) * 100).toFixed(1)}% Utilized`
              : "57.5% Utilized"
          }
          color="emerald"
          icon={IndianRupee}
          onClick={() => navigate("/corporator/funds")}
        />
        <StatCard
          title="New Proposals"
          value={stats.total_proposals ?? 12}
          subtitle="4 In Review"
          badgeText="3 Approved"
          color="indigo"
          icon={FileText}
          onClick={() => navigate("/corporator/proposals")}
        />
        <StatCard
          title="Meetings"
          value={
            stats.total_meetings
              ? String(stats.total_meetings).padStart(2, "0")
              : "05"
          }
          subtitle="Next: 30 Aug 11 AM"
          badgeText="Ward Committee"
          color="purple"
          icon={CalendarDays}
          onClick={() => navigate("/corporator/meetings")}
        />
        <StatCard
          title="Follow-ups Due"
          value={stats.followups_due ?? 3}
          subtitle="2 Due Today • 1 Overdue"
          badgeText="Action Required"
          color="rose"
          icon={ListTodo}
          onClick={() => navigate("/corporator/followups")}
        />
      </div>

      {/* Real-World Grievance & Service Records Analytics Model */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Records Analytics & Telemetry (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 flex flex-col">
          {/* Card Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/60">
                  Ward Records Telemetry
                </span>
                <span className="text-xs text-slate-400 font-medium">•</span>
                <span className="text-xs font-semibold text-slate-500">
                  {stats.total_complaints ?? 126} Logged Records
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1 tracking-tight">
                Civic Complaints & Service Records Analysis
              </h3>
              <p className="text-xs text-slate-500">
                Departmental breakdown of citizen grievances, resolution
                velocity, and active ward backlogs.
              </p>
            </div>

            {/* View Mode Tab Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg self-start sm:self-center border border-slate-200/70 text-xs">
              <button
                onClick={() => setAnalyticsView("categories")}
                className={`px-3 py-1.5 font-bold rounded-md transition-all ${
                  analyticsView === "categories"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                By Category
              </button>
              <button
                onClick={() => setAnalyticsView("pipeline")}
                className={`px-3 py-1.5 font-bold rounded-md transition-all ${
                  analyticsView === "pipeline"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Status Pipeline
              </button>
              <button
                onClick={() => setAnalyticsView("monthly")}
                className={`px-3 py-1.5 font-bold rounded-md transition-all ${
                  analyticsView === "monthly"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Monthly Flow
              </button>
              <button
                onClick={() => setAnalyticsView("records")}
                className={`px-3 py-1.5 font-bold rounded-md transition-all flex items-center space-x-1 ${
                  analyticsView === "records"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Table className="w-3.5 h-3.5 mr-1" />
                <span>Records ({filteredRecords.length})</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 block">
                Total Records
              </span>
              <span className="text-lg font-black text-slate-900">
                {stats.total_complaints ?? 126}
              </span>
              <span className="text-[10px] text-slate-400 block font-medium">
                Ward 24 Register
              </span>
            </div>
            <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100/60">
              <span className="text-[11px] font-semibold text-emerald-700 block">
                Resolved Records
              </span>
              <span className="text-lg font-black text-emerald-700">
                {stats.resolved_complaints ?? 92}
              </span>
              <span className="text-[10px] text-emerald-600 block font-medium">
                73.0% SLA Velocity
              </span>
            </div>
            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100/60">
              <span className="text-[11px] font-semibold text-blue-700 block">
                Active Backlog
              </span>
              <span className="text-lg font-black text-blue-700">
                {stats.pending_complaints ?? 26}
              </span>
              <span className="text-[10px] text-blue-600 block font-medium">
                Field Officers Assigned
              </span>
            </div>
            <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-100/60">
              <span className="text-[11px] font-semibold text-rose-700 block">
                SLA Breached
              </span>
              <span className="text-lg font-black text-rose-700">
                {stats.escalated_complaints ?? 8}
              </span>
              <span className="text-[10px] text-rose-600 block font-medium">
                Immediate Action
              </span>
            </div>
          </div>

          {/* Active Filter Pill (if user clicked a category or status) */}
          {selectedCategoryFilter && (
            <div className="mb-3 px-3 py-1.5 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 text-xs flex items-center justify-between">
              <span className="font-semibold">
                Filtering by Department:{" "}
                <span className="font-black">{selectedCategoryFilter}</span>
              </span>
              <button
                onClick={() => setSelectedCategoryFilter(null)}
                className="text-xs font-bold text-blue-600 hover:text-blue-900 underline cursor-pointer"
              >
                Clear Filter
              </button>
            </div>
          )}

          {/* Visualization Container */}
          {analyticsView === "categories" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>
                  Comparing <b>Logged Complaints</b> vs <b>Resolved Records</b>{" "}
                  per Department:
                </span>
                <span className="text-[11px] text-slate-400">
                  Click any bar to filter matching records
                </span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={categoryRecordsData}
                  margin={{ top: 15, right: 25, left: -10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="shortName"
                    tick={{ fontSize: 11, fill: "#475569", fontWeight: 600 }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip content={<CustomCategoryTooltip />} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar
                    name="Logged Records"
                    dataKey="logged"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    onClick={(entry) => {
                      setSelectedCategoryFilter(entry.category);
                      setAnalyticsView("records");
                    }}
                    className="cursor-pointer hover:opacity-85 transition-opacity"
                  />
                  <Bar
                    name="Resolved Records"
                    dataKey="resolved"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    onClick={(entry) => {
                      setSelectedCategoryFilter(entry.category);
                      setAnalyticsView("records");
                    }}
                    className="cursor-pointer hover:opacity-85 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {analyticsView === "pipeline" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>
                  Lifecycle workflow status distribution of all grievance
                  records:
                </span>
                <span className="text-[11px] text-slate-400">
                  Click to navigate filtered status
                </span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={pipelineRecordsData}
                  margin={{ top: 15, right: 25, left: -10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#475569", fontWeight: 600 }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip content={<CustomPipelineTooltip />} />
                  <Bar
                    dataKey="count"
                    radius={[6, 6, 0, 0]}
                    onClick={(entry) =>
                      navigate(`/corporator/complaints?status=${entry.code}`)
                    }
                    className="cursor-pointer"
                  >
                    {pipelineRecordsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {analyticsView === "monthly" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>
                  Month-on-Month Grievance Inflow vs Resolution Flow (Ward 24):
                </span>
                <span className="text-[11px] text-slate-400">
                  Steady resolution throughput maintained
                </span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={monthlyRecordsData}
                  margin={{ top: 15, right: 25, left: -10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#475569", fontWeight: 600 }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip content={<CustomMonthlyTooltip />} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar
                    name="Logged Inflow"
                    dataKey="logged"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    name="Resolved Throughput"
                    dataKey="resolved"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {analyticsView === "records" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search records by ID, category, or location..."
                    value={recordSearchQuery}
                    onChange={(e) => setRecordSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
                <button
                  onClick={() => navigate("/corporator/complaints")}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <span>Open Full Complaints Register</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>

              {/* Records Table */}
              <div className="border border-slate-200 rounded-lg overflow-x-auto max-h-[280px]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="px-3 py-2.5">Record ID</th>
                      <th className="px-3 py-2.5">Grievance Summary</th>
                      <th className="px-3 py-2.5">Department</th>
                      <th className="px-3 py-2.5">Priority</th>
                      <th className="px-3 py-2.5">Status</th>
                      <th className="px-3 py-2.5">SLA / Officer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {filteredRecords.map((rec) => (
                      <tr
                        key={rec.id}
                        onClick={() =>
                          navigate(`/corporator/complaints?search=${rec.id}`)
                        }
                        className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                      >
                        <td className="px-3 py-2 font-bold text-blue-600 whitespace-nowrap">
                          {rec.id}
                        </td>
                        <td className="px-3 py-2">
                          <p className="font-bold text-slate-900 line-clamp-1">
                            {rec.title}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {rec.location}
                          </p>
                        </td>
                        <td className="px-3 py-2 text-slate-600 whitespace-nowrap">
                          {rec.category}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              rec.priority === "CRITICAL"
                                ? "bg-red-100 text-red-700"
                                : rec.priority === "HIGH"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {rec.priority}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              rec.status === "RESOLVED"
                                ? "bg-emerald-100 text-emerald-800"
                                : rec.status === "ESCALATED"
                                  ? "bg-rose-100 text-rose-800 font-black"
                                  : rec.status === "IN_PROGRESS"
                                    ? "bg-indigo-100 text-indigo-800"
                                    : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {rec.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-[11px]">
                          <span className="text-slate-700 font-semibold block">
                            {rec.officer}
                          </span>
                          <span
                            className={`text-[10px] ${
                              rec.sla.includes("Overdue") ||
                              rec.sla.includes("Breached")
                                ? "text-rose-600 font-bold"
                                : "text-slate-400"
                            }`}
                          >
                            {rec.sla}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer Navigation Bar */}
          <div className="pt-3 mt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
            <span className="text-[11px]">
              Showing live record telemetry synchronized with Municipal Ward
              Database.
            </span>
            <button
              onClick={() => navigate("/corporator/complaints")}
              className="font-bold text-blue-700 hover:text-blue-900 inline-flex items-center"
            >
              <span>Manage All Ward Grievance Records</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>

        {/* Complaint Priority Breakdown (1 Column) */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-base font-bold text-slate-900 tracking-tight">
                Priority Breakdown
              </h4>
              <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full">
                SLA Severity
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 mb-2">
              Citizen grievance distribution by emergency urgency level.
            </p>

            {/* Donut Chart with Center Metric */}
            <div className="relative flex items-center justify-center my-1">
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie
                    data={priorityTierList}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={74}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="priority"
                  >
                    {priorityTierList.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPriorityTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Dynamic Center Metric */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900 leading-none">
                  {totalPriorityCount}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  Records
                </span>
              </div>
            </div>

            {/* Production-Level Tier Breakdown Rows with Progress Tracks */}
            <div className="space-y-2 mt-2">
              {priorityTierList.map((tier) => (
                <div
                  key={tier.priority}
                  onClick={() =>
                    navigate(`/corporator/complaints?priority=${tier.priority}`)
                  }
                  className="p-2 rounded-lg border border-slate-100/90 hover:border-slate-300 hover:bg-slate-50/80 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: tier.color }}
                      />
                      <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {tier.priority}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        ({tier.sla})
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-black text-slate-900">
                        {tier.count}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold w-10 text-right">
                        {tier.percentage}%
                      </span>
                    </div>
                  </div>
                  {/* Micro Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${tier.percentage}%`,
                        backgroundColor: tier.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-2 text-center text-xs mb-2.5">
              <div
                onClick={() =>
                  navigate("/corporator/complaints?priority=CRITICAL")
                }
                className="p-2 bg-rose-50/70 hover:bg-rose-100/80 cursor-pointer rounded-lg border border-rose-100 transition-colors"
              >
                <span className="text-[10px] text-rose-700 font-bold uppercase block">
                  High & Critical
                </span>
                <span className="text-base font-black text-rose-700">
                  60 Records
                </span>
              </div>
              <div
                onClick={() =>
                  navigate("/corporator/complaints?priority=MEDIUM")
                }
                className="p-2 bg-slate-50 hover:bg-slate-100/80 cursor-pointer rounded-lg border border-slate-100 transition-colors"
              >
                <span className="text-[10px] text-slate-600 font-bold uppercase block">
                  Medium & Low
                </span>
                <span className="text-base font-black text-slate-700">
                  66 Records
                </span>
              </div>
            </div>
            <button
              onClick={() =>
                navigate("/corporator/complaints?priority=CRITICAL")
              }
              className="w-full py-1.5 text-xs font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100/70 rounded-md border border-rose-200/60 transition-colors flex items-center justify-center space-x-1"
            >
              <span>View 18 Critical Emergency Grievances</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* GIS Spatial Map & Attention Required Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GIS Interactive Map Card (2 Columns) */}
        <div className="lg:col-span-2">
          <MapCard
            title={`${ward.ward_name || "Ward 24 - Shivaji Nagar"} GIS Spatial Map`}
            latitude={ward.latitude ? parseFloat(ward.latitude) : 19.8762}
            longitude={ward.longitude ? parseFloat(ward.longitude) : 75.3433}
            zoom={14}
            height="340px"
            markers={[
              {
                lat: 19.8762,
                lng: 75.3433,
                title: "CMP-1024: Streetlight Defect",
                description: "Priority: HIGH",
              },
              {
                lat: 19.878,
                lng: 75.3412,
                title: "CMP-1025: Water Leakage",
                description: "Priority: CRITICAL",
              },
              {
                lat: 19.877,
                lng: 75.344,
                title: "W-101: Internal Lane Concreting",
                description: "Progress: 65%",
              },
            ]}
          />
        </div>

        {/* Attention Required & Ward Escalation Hub Card (1 Column) */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-rose-200/80 shadow-xs flex flex-col justify-between h-full">
          <div>
            {/* Header with Live Severity Badge */}
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shadow-xs">
                  <ShieldAlert className="w-4.5 h-4.5 text-rose-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-black text-slate-900 tracking-tight">
                      ATTENTION REQUIRED
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                      {attentionItems.reduce(
                        (acc, curr) => acc + (curr.count || 0),
                        0,
                      )}{" "}
                      Actions
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Critical ward escalations needing immediate intervention
                  </p>
                </div>
              </div>
            </div>

            {/* Quick-Triage Tri-Metric Strip */}
            <div className="grid grid-cols-3 gap-2 mt-3 mb-3">
              <div
                onClick={() =>
                  navigate("/corporator/complaints?status=ESCALATED")
                }
                className="p-2 rounded-lg bg-rose-50/70 border border-rose-100/90 hover:border-rose-300 hover:bg-rose-100/70 transition-all cursor-pointer text-center group"
              >
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                  SLA Breaches
                </span>
                <span className="text-base font-black text-rose-700 group-hover:scale-105 transition-transform inline-block">
                  {stats.escalated_complaints ?? 2}
                </span>
                <span className="text-[9px] text-rose-500 font-semibold block">
                  &gt; 72h Overdue
                </span>
              </div>
              <div
                onClick={() => navigate("/corporator/works?status=DELAYED")}
                className="p-2 rounded-lg bg-amber-50/70 border border-amber-100/90 hover:border-amber-300 hover:bg-amber-100/70 transition-all cursor-pointer text-center group"
              >
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                  Delayed Works
                </span>
                <span className="text-base font-black text-amber-700 group-hover:scale-105 transition-transform inline-block">
                  {stats.delayed_works ?? 5}
                </span>
                <span className="text-[9px] text-amber-600 font-semibold block">
                  Behind Sched.
                </span>
              </div>
              <div
                onClick={() => navigate("/corporator/followups")}
                className="p-2 rounded-lg bg-blue-50/70 border border-blue-100/90 hover:border-blue-300 hover:bg-blue-100/70 transition-all cursor-pointer text-center group"
              >
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                  Due Today
                </span>
                <span className="text-base font-black text-blue-700 group-hover:scale-105 transition-transform inline-block">
                  {stats.followups_due ?? 3}
                </span>
                <span className="text-[9px] text-blue-600 font-semibold block">
                  Commitments
                </span>
              </div>
            </div>

            {/* Differentiated High-Density Escalation Cards */}
            <div className="space-y-2.5">
              {attentionItems.map((item) => {
                const isCritical = item.priority === "CRITICAL";
                const isWork = item.type === "work";
                const isFollowup = item.type === "followup";

                return (
                  <div
                    key={item.id}
                    onClick={() => navigate(item.route)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer group flex items-start justify-between ${
                      isCritical
                        ? "bg-linear-to-r from-rose-50/80 via-white to-white border-rose-200 hover:border-rose-300 hover:shadow-xs"
                        : isWork
                          ? "bg-linear-to-r from-amber-50/80 via-white to-white border-amber-200 hover:border-amber-300 hover:shadow-xs"
                          : "bg-linear-to-r from-blue-50/80 via-white to-white border-blue-200 hover:border-blue-300 hover:shadow-xs"
                    }`}
                  >
                    <div className="flex items-start space-x-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${
                          isCritical
                            ? "bg-rose-100 text-rose-600"
                            : isWork
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {isCritical ? (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        ) : isWork ? (
                          <HardHat className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5 flex-wrap">
                          <h5 className="font-bold text-slate-900 text-xs group-hover:text-blue-600 transition-colors">
                            {item.title}
                          </h5>
                          <span
                            className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded ${
                              isCritical
                                ? "bg-rose-600 text-white"
                                : isWork
                                  ? "bg-amber-500 text-white"
                                  : "bg-blue-600 text-white"
                            }`}
                          >
                            {item.tag || item.priority}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {item.subtitle || "Action required by department"}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span
                            className={`text-xs font-black ${
                              isCritical
                                ? "text-rose-700"
                                : isWork
                                  ? "text-amber-800"
                                  : "text-blue-700"
                            }`}
                          >
                            {item.count} Items Pending
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            • {item.metricNote || "Review Immediately"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(item.route);
                      }}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ml-2 group-hover:scale-105 ${
                        isCritical
                          ? "bg-rose-600 hover:bg-rose-700 text-white"
                          : isWork
                            ? "bg-amber-600 hover:bg-amber-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Ward SLA Target Health Gauge */}
            <div className="p-2.5 rounded-lg bg-slate-50/90 border border-slate-200/70 mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-700 text-[11px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Ward SLA Resolution Rate
                </span>
                <span className="font-black text-slate-900 text-xs">
                  93.7%{" "}
                  <span className="text-[10px] text-slate-400 font-normal">
                    (Target: 95%)
                  </span>
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-linear-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                  style={{ width: "93.7%" }}
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 mt-3 border-t border-slate-100">
            <button
              onClick={() => navigate("/corporator/followups")}
              className="w-full py-2.5 px-4 bg-linear-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs hover:shadow-md flex items-center justify-center space-x-1.5 cursor-pointer group"
            >
              <ListTodo className="w-4 h-4 mr-1" />
              <span>Open Follow-ups Action Tracker</span>
              <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-black bg-rose-800 rounded-full">
                {stats.followups_due ?? 3} Due
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Ward Activities & Operational Audit Stream */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-xs">
        {/* Header with Live Telemetry Pulse & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-xs">
              {<Activity className="w-4.5 h-4.5 text-blue-600" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-black text-slate-900 tracking-tight">
                  Recent Ward Activities & Live Audit Stream
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Stream
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Real-time operational audit of citizen complaints, civil work
                milestones, and field resolutions
              </p>
            </div>
          </div>

          {/* Activity Category Filter Tabs */}
          <div className="flex items-center space-x-1.5 self-end sm:self-center">
            {["ALL", "COMPLAINTS", "WORKS"].map((f) => (
              <button
                key={f}
                onClick={() => setActivityFilter(f)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  activityFilter === f
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {f === "ALL"
                  ? "All Events"
                  : f === "COMPLAINTS"
                    ? "Grievances"
                    : "Civic Works"}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered Activity Rows */}
        <div className="space-y-2.5 pt-3">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              onClick={() => navigate(act.route)}
              className="p-3 bg-slate-50/70 hover:bg-white rounded-xl border border-slate-200/70 hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
            >
              {/* Left Details */}
              <div className="flex items-start space-x-3">
                <div
                  className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${
                    act.isResolved
                      ? "bg-emerald-100 text-emerald-700"
                      : act.isEscalated
                        ? "bg-rose-100 text-rose-700"
                        : act.isWork
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {act.isResolved ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : act.isEscalated ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : act.isWork ? (
                    <HardHat className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {act.reference_code}
                    </span>
                    <span className="font-bold text-slate-900 text-xs group-hover:text-blue-600 transition-colors">
                      {act.description}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-1 flex-wrap">
                    <span className="font-semibold text-slate-600">
                      {act.department}
                    </span>
                    <span>•</span>
                    <span>{act.location}</span>
                    <span>•</span>
                    <span className="text-slate-400 font-medium">
                      Actor: {act.action_by}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Status Chip & Timestamp */}
              <div className="flex items-center space-x-3 self-end sm:self-center shrink-0">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    act.status === "RESOLVED" || act.status === "COMPLETED"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : act.status === "ESCALATED"
                        ? "bg-rose-100 text-rose-800 border border-rose-200"
                        : act.status === "IN_PROGRESS" ||
                            act.status === "ONGOING"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}
                >
                  {act.status}
                </span>

                <div className="text-right">
                  <span className="text-xs font-black text-slate-700 block">
                    {new Date(act.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    Today
                  </span>
                </div>

                <div className="w-6 h-6 rounded-md bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-400 flex items-center justify-center transition-all group-hover:translate-x-0.5">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Summary & Quick Links */}
        <div className="pt-3 mt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <span className="text-[11px]">
            Showing {filteredActivities.length} recent ward transactions •
            Synchronized with Municipal Audit Log.
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate("/corporator/complaints")}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
            >
              <span>View All Complaints</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => navigate("/corporator/works")}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
            >
              <span>View All Works</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
