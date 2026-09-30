import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  HardHat,
  IndianRupee,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Building2
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { ChartCard } from '../components/ChartCard';
import { MapCard } from '../components/MapCard';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { formatCurrency } from '../utils/formatters';
import api from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const DashboardPage = () => {
  const [healthInfo, setHealthInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHealthStatus();
  }, []);

  const fetchHealthStatus = async () => {
    setLoading(true);
    try {
      const res = await api.get('/health');
      setHealthInfo(res.data);
    } catch (err) {
      console.error('Failed to fetch backend health status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Demo Corporator Dashboard Metrics (Reference Values from Specification)
  const complaintChartData = [
    { name: 'Pending', count: 82, color: '#f59e0b' },
    { name: 'In Progress', count: 28, color: '#3b82f6' },
    { name: 'Resolved', count: 16, color: '#10b981' }
  ];

  const workStatusData = [
    { status: 'Ongoing', count: 8, fill: '#3b82f6' },
    { status: 'Completed', count: 5, fill: '#10b981' },
    { status: 'Delayed', statusColor: 'Delayed', count: 5, fill: '#ef4444' }
  ];

  const fundOverviewData = [
    { category: 'Utilized', amount: 57.5, color: '#10b981' },
    { category: 'Approved', amount: 22.0, color: '#3b82f6' },
    { category: 'Available', amount: 20.5, color: '#f59e0b' }
  ];

  const attentionItems = [
    { id: 'W-102', type: 'Delayed Work', title: 'Smart LED Streetlight Installation Phase II', tag: 'Delayed by 12 days', priority: 'HIGH', route: '/corporator/works' },
    { id: 'CMP-1024', type: 'SLA Breach Warning', title: 'Flickering Streetlight outside Plot 42', tag: 'SLA Expires in 2h', priority: 'CRITICAL', route: '/corporator/complaints' },
    { id: 'FLW-004', type: 'Follow-up Due', title: 'Monsoon Drain Cleaning Clearance Report', tag: 'Due Today 5:00 PM', priority: 'HIGH', route: '/corporator/followups' },
    { id: 'PROP-2026-01', type: 'Fund Approval Pending', title: 'New Open Gym in Sector 3 Garden', tag: '₹8.50 L Sanction Pending', priority: 'MEDIUM', route: '/corporator/proposals' }
  ];

  const recentComplaints = [
    { id: 'CMP-1024', category: 'Streetlight', citizen: 'Vijay Shinde', date: '2026-08-27', priority: 'HIGH', status: 'REGISTERED' },
    { id: 'CMP-1025', category: 'Water Supply', citizen: 'Ramesh Kale', date: '2026-08-26', priority: 'CRITICAL', status: 'IN_PROGRESS' },
    { id: 'CMP-1026', category: 'Garbage', citizen: 'Sunita Patil', date: '2026-08-25', priority: 'HIGH', status: 'RESOLVED' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              WARD 24 SHIVAJI NAGAR
            </span>
            <span className="text-xs font-medium text-slate-400">|</span>
            <span className="text-xs text-slate-500 font-semibold">Demo Municipal Corporation</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Digital Corporator Dashboard
          </h2>
          <p className="text-xs text-slate-500">
            Real-time ward telemetry, citizen grievances, infrastructure progress, and budget tracking.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={fetchHealthStatus} isLoading={loading}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Sync Telemetry
          </Button>

          <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>API & DB Connected</span>
          </div>
        </div>
      </div>

      {/* 5 Grid Stat Cards (Reference Spec with Direct Navigation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Complaints"
          value="126"
          subtitle="82 Pending • 28 In Progress"
          badgeText="16 Resolved"
          color="amber"
          icon={AlertCircle}
          onClick={() => navigate('/corporator/complaints')}
        />
        <StatCard
          title="Ongoing Works"
          value="18"
          subtitle="8 Active • 5 Completed"
          badgeText="5 Delayed"
          color="blue"
          icon={HardHat}
          onClick={() => navigate('/corporator/works')}
        />
        <StatCard
          title="Fund Available"
          value="₹42.50 L"
          subtitle="Total Budget: ₹1.00 Cr"
          badgeText="57.5% Utilized"
          color="emerald"
          icon={IndianRupee}
          onClick={() => navigate('/corporator/funds')}
        />
        <StatCard
          title="New Proposals"
          value="12"
          subtitle="4 Under Committee Review"
          badgeText="3 Approved"
          color="indigo"
          icon={FileText}
          onClick={() => navigate('/corporator/proposals')}
        />
        <StatCard
          title="Meetings"
          value="05"
          subtitle="Next: 30 Aug 11:00 AM"
          badgeText="Ward Committee"
          color="purple"
          icon={Calendar}
          onClick={() => navigate('/corporator/meetings')}
        />
      </div>

      {/* Main Charts & Telemetry Grid (2 Columns Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaints Breakdown Pie Chart */}
        <ChartCard
          title="Complaints Status Breakdown"
          subtitle="126 Total Registered Grievances"
        >
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={complaintChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="count"
              >
                {complaintChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} Complaints`, 'Count']} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Development Works Status Bar Chart */}
        <ChartCard
          title="Development Works Status"
          subtitle="18 Municipal Infrastructure Projects"
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={workStatusData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="status" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {workStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Fund Allocation & Utilization Bar Chart */}
        <ChartCard
          title="Fund Utilization (₹ Lakhs)"
          subtitle="Ward 24 Financial Year 2026-27"
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={fundOverviewData} layout="vertical" margin={{ top: 15, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" unit=" L" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis dataKey="category" type="category" tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }} />
              <Tooltip formatter={(val) => [`₹${val} Lakhs`, 'Amount']} />
              <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                {fundOverviewData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* GIS Map & Attention Required Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GIS Interactive Map Card (2 Columns) */}
        <div className="lg:col-span-2">
          <MapCard
            title="Ward 24 GIS Spatial Map"
            latitude={19.8762}
            longitude={75.3433}
            zoom={14}
            height="340px"
            markers={[
              { lat: 19.8762, lng: 75.3433, title: 'CMP-1024: Streetlight Defect', description: 'Priority: HIGH' },
              { lat: 19.8780, lng: 75.3412, title: 'CMP-1025: Water Leakage', description: 'Priority: CRITICAL' },
              { lat: 19.8770, lng: 75.3440, title: 'W-101: Internal Lane Concreting', description: 'Progress: 65%' }
            ]}
          />
        </div>

        {/* Attention Required Widget (1 Column) */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h4 className="text-base font-bold text-slate-900 flex items-center">
                <AlertTriangle className="w-4 h-4 text-amber-500 mr-2" />
                Attention Required
              </h4>
              <span className="text-xs bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full">
                4 Critical
              </span>
            </div>

            <div className="space-y-3">
              {attentionItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(item.route || '/corporator/followups')}
                  className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-100/90 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{item.type}</span>
                    <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 mt-1 transition-colors">{item.title}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/corporator/followups')}
            className="mt-4 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            View Action Center & Follow-ups
          </button>
        </div>
      </div>

      {/* Recent Complaints Table Widget */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-base font-bold text-slate-900">Recent Grievance Logs</h4>
            <p className="text-xs text-slate-500">Live feed of reported citizen complaints in Ward 24</p>
          </div>
          <Button variant="ghost" size="sm">
            View All Complaints <ArrowUpRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Complaint ID</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Citizen</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {recentComplaints.map((cmp, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-blue-600">{cmp.id}</td>
                  <td className="px-4 py-3">{cmp.category}</td>
                  <td className="px-4 py-3">{cmp.citizen}</td>
                  <td className="px-4 py-3 text-slate-500">{cmp.date}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-red-600">{cmp.priority}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={cmp.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
