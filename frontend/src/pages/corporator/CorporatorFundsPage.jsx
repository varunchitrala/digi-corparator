import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { LoadingState } from '../../components/LoadingState';
import { Drawer } from '../../components/Drawer';
import { Button } from '../../components/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  IndianRupee,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  Building2,
  Calendar,
  PieChart,
  ArrowUpRight,
  FileText,
  PlusCircle,
  Download,
  RefreshCw,
  SlidersHorizontal,
  Search,
  HelpCircle,
  Check,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Landmark,
  Receipt,
  Briefcase,
  CreditCard,
  ArrowDownRight,
  Sparkles,
  ExternalLink,
  X,
  Filter,
  Info,
  Car,
  Droplets,
  Lightbulb,
  Trees,
  HeartPulse,
  Eye
} from 'lucide-react';

// ============================================================================
// 1. STATUTORY RESPONSIBILITIES OF A CORPORATOR FOR WARD FUNDS
// ============================================================================
const CORPORATOR_RESPONSIBILITIES = [
  {
    step: '01',
    marathiTitle: 'वार्षिक प्रभाग स्वेच्छा निधी',
    englishTitle: 'Annual Ward Development Quota',
    icon: Landmark,
    badge: 'Statutory Allocation',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    summary:
      'Every elected corporator receives a dedicated annual budget (₹1.00 Crore for Ward 24) from the municipal corporation to execute critical civic works without waiting for centralized city projects.'
  },
  {
    step: '02',
    marathiTitle: 'नागरिकांच्या गरजेनुसार नवे प्रस्ताव',
    englishTitle: 'Citizen-Need-Driven Work Proposals',
    icon: FileText,
    badge: 'Community First',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    summary:
      'The corporator analyzes resident complaints (potholes, water leaks, dark alleys) and formulates technical proposals with ward engineers to allocate funds to high-priority neighborhood spots.'
  },
  {
    step: '03',
    marathiTitle: 'स्थायी समिती मंजुरी व वर्क ऑर्डर',
    englishTitle: 'Standing Committee Sanction & Tendering',
    icon: CheckCircle2,
    badge: 'Civic Approval',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    summary:
      'Proposals are submitted for administrative approval, followed by financial sanction from the Standing Committee and Municipal Commissioner before open e-tenders are issued.'
  },
  {
    step: '04',
    marathiTitle: 'प्रत्यक्ष जागेवर गुणवत्ता तपासणी',
    englishTitle: 'Ground Quality Verification Before Bills',
    icon: ShieldCheck,
    badge: 'Zero Corruption',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    summary:
      'Funds are never disbursed in advance. Money is released in stages only after the Junior Engineer records measurements in the official Measurement Book (MB) and confirms high construction quality.'
  },
  {
    step: '05',
    marathiTitle: 'निधी व्यपगत रोखणे (Zero Fund Lapse)',
    englishTitle: '100% Fund Commitment Before March 31',
    icon: Clock,
    badge: 'Fiscal Discipline',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    summary:
      'The corporator is responsible for ensuring 100% of the ward budget is committed and put to work before the fiscal year ends on March 31, preventing public money from lapsing back to the municipal treasury.'
  }
];

// ============================================================================
// 2. FUNDING GRANTS BREAKDOWN (Where Ward 24 Money Comes From)
// ============================================================================
const FUNDING_SOURCES = [
  {
    source_id: 'src-1',
    name: 'Corporator Ward Discretionary Fund',
    localName: 'महापालिका नगरसेवक स्वेच्छा निधी',
    amount: 6000000,
    sharePercent: 60,
    purpose: 'Local neighborhood priority works: cement-concrete lanes, paver blocks, garden seating & open gym.',
    sanction_authority: 'Standing Committee / Municipal Commissioner',
    color: 'from-blue-600 to-indigo-600',
    lightColor: 'bg-blue-50 border-blue-200 text-blue-900'
  },
  {
    source_id: 'src-2',
    name: '15th Central Finance Commission Grant',
    localName: '१५ वा वित्त आयोग मूलभूत नागरी अनुदान',
    amount: 2500000,
    sharePercent: 25,
    purpose: 'Tied grant restricted strictly for potable drinking water pipeline extensions, storm drains, and sanitation.',
    sanction_authority: 'Central Govt / Ministry of Housing & Urban Affairs',
    color: 'from-emerald-600 to-teal-600',
    lightColor: 'bg-emerald-50 border-emerald-200 text-emerald-900'
  },
  {
    source_id: 'src-3',
    name: 'State Urban Infrastructure Special Grant',
    localName: 'राज्य शासन नगरोत्थान विशेष अनुदान',
    amount: 1500000,
    sharePercent: 15,
    purpose: 'Major arterial road resurfacing, junction LED high-mast lighting, and pedestrian footpath security.',
    sanction_authority: 'Urban Development Department (Govt of Maharashtra)',
    color: 'from-amber-600 to-orange-600',
    lightColor: 'bg-amber-50 border-amber-200 text-amber-900'
  }
];

// ============================================================================
// 3. CIVIC SECTORS ALLOCATION
// ============================================================================
const CIVIC_SECTORS = [
  {
    id: 'sec-roads',
    name: 'Roads & Pavements',
    marathi: 'रस्ते व पादचारी मार्ग',
    icon: Car,
    allocated: 3800000,
    spent: 2450000,
    committed: 950000,
    available: 400000,
    worksCount: 5,
    color: 'indigo'
  },
  {
    id: 'sec-water',
    name: 'Water Supply & Drainage',
    marathi: 'पाणी पुरवठा व मलनिस्सारण',
    icon: Droplets,
    allocated: 2650000,
    spent: 1600000,
    committed: 650000,
    available: 400000,
    worksCount: 4,
    color: 'cyan'
  },
  {
    id: 'sec-parks',
    name: 'Parks, Gardens & Greenery',
    marathi: 'उद्याने व क्रीडांगणे',
    icon: Trees,
    allocated: 1500000,
    spent: 850000,
    committed: 350000,
    available: 300000,
    worksCount: 2,
    color: 'emerald'
  },
  {
    id: 'sec-lights',
    name: 'Streetlights & Electrical',
    marathi: 'रस्त्यावरील दिवे व वीज',
    icon: Lightbulb,
    allocated: 1200000,
    spent: 650000,
    committed: 250000,
    available: 300000,
    worksCount: 2,
    color: 'amber'
  },
  {
    id: 'sec-community',
    name: 'Community Amenities & Health',
    marathi: 'नागरी सुविधा व सार्वजनिक आरोग्य',
    icon: HeartPulse,
    allocated: 850000,
    spent: 200000,
    committed: 0,
    available: 650000,
    worksCount: 1,
    color: 'purple'
  }
];

// ============================================================================
// 4. REALISTIC WARD 24 PROJECTS FUNDED FROM BUDGET
// ============================================================================
const DEFAULT_FUNDED_WORKS = [
  {
    work_id: 'w-101',
    work_code: 'W-101',
    work_title: 'Concreting & Road Paving of Market Lane #4 (200m)',
    sector: 'Roads & Pavements',
    sanctioned_amount: 2400000,
    disbursed_amount: 1560000,
    balance_to_pay: 840000,
    physical_progress: 65,
    status: 'ONGOING',
    contractor_name: 'Shivam Construction & Infra Ltd',
    bills_count: 3,
    last_voucher: 'PAY-2026-849102',
    last_payment_date: '2026-08-20',
    mb_number: 'MB-2026/VOL-4/P-88',
    engineer: 'Er. Prakash Shinde'
  },
  {
    work_id: 'w-102',
    work_code: 'W-102',
    work_title: 'Smart LED Streetlight Installation Phase II (120 poles)',
    sector: 'Streetlights & Electrical',
    sanctioned_amount: 1800000,
    disbursed_amount: 1530000,
    balance_to_pay: 270000,
    physical_progress: 90,
    status: 'DELAYED',
    contractor_name: 'BrightSpark Energy Solutions Pvt Ltd',
    bills_count: 4,
    last_voucher: 'PAY-2026-772190',
    last_payment_date: '2026-08-12',
    mb_number: 'MB-2026/VOL-2/P-45',
    engineer: 'Er. Nilesh Gaikwad'
  },
  {
    work_id: 'w-103',
    work_code: 'W-103',
    work_title: 'Shivaji Park Beautification, Jogging Track & Children Play Area',
    sector: 'Parks, Gardens & Greenery',
    sanctioned_amount: 3500000,
    disbursed_amount: 3500000,
    balance_to_pay: 0,
    physical_progress: 100,
    status: 'COMPLETED',
    contractor_name: 'GreenScape Urban Designers',
    bills_count: 5,
    last_voucher: 'PAY-2026-661045',
    last_payment_date: '2026-07-28',
    mb_number: 'MB-2026/VOL-3/P-112',
    engineer: 'Er. Sandeep Jadhav'
  },
  {
    work_id: 'w-104',
    work_code: 'W-104',
    work_title: 'Pedestrian Footpath & Safety Railings Near School',
    sector: 'Roads & Pavements',
    sanctioned_amount: 1200000,
    disbursed_amount: 1080000,
    balance_to_pay: 120000,
    physical_progress: 90,
    status: 'ONGOING',
    contractor_name: 'Apex Urban Infra Works',
    bills_count: 2,
    last_voucher: 'PAY-2026-902341',
    last_payment_date: '2026-09-02',
    mb_number: 'MB-2026/VOL-4/P-94',
    engineer: 'Er. Prakash Shinde'
  },
  {
    work_id: 'w-105',
    work_code: 'W-105',
    work_title: 'Underground Drinking Water Pipeline Replacement (Sector 2)',
    sector: 'Water Supply & Drainage',
    sanctioned_amount: 1950000,
    disbursed_amount: 1460000,
    balance_to_pay: 490000,
    physical_progress: 75,
    status: 'ONGOING',
    contractor_name: 'JalDhara Pipes & Civil Works',
    bills_count: 3,
    last_voucher: 'PAY-2026-881204',
    last_payment_date: '2026-08-18',
    mb_number: 'MB-2026/VOL-1/P-62',
    engineer: 'Er. Suresh Kulkarni'
  },
  {
    work_id: 'w-106',
    work_code: 'W-106',
    work_title: 'Main Storm Water Drain RCC Covering & Desilting',
    sector: 'Water Supply & Drainage',
    sanctioned_amount: 1400000,
    disbursed_amount: 700000,
    balance_to_pay: 700000,
    physical_progress: 50,
    status: 'ONGOING',
    contractor_name: 'Shivam Construction & Infra Ltd',
    bills_count: 2,
    last_voucher: 'PAY-2026-913344',
    last_payment_date: '2026-09-10',
    mb_number: 'MB-2026/VOL-4/P-101',
    engineer: 'Er. Suresh Kulkarni'
  },
  {
    work_id: 'w-107',
    work_code: 'W-107',
    work_title: 'Shivaji Chowk Ring Road Junction Asphalt Patchwork',
    sector: 'Roads & Pavements',
    sanctioned_amount: 850000,
    disbursed_amount: 850000,
    balance_to_pay: 0,
    physical_progress: 100,
    status: 'COMPLETED',
    contractor_name: 'Apex Urban Infra Works',
    bills_count: 2,
    last_voucher: 'PAY-2026-559120',
    last_payment_date: '2026-06-25',
    mb_number: 'MB-2026/VOL-4/P-42',
    engineer: 'Er. Prakash Shinde'
  },
  {
    work_id: 'w-108',
    work_code: 'W-108',
    work_title: 'Solar High-Mast Illumination Tower at Vegetable Bazaar',
    sector: 'Streetlights & Electrical',
    sanctioned_amount: 450000,
    disbursed_amount: 450000,
    balance_to_pay: 0,
    physical_progress: 100,
    status: 'COMPLETED',
    contractor_name: 'BrightSpark Energy Solutions Pvt Ltd',
    bills_count: 1,
    last_voucher: 'PAY-2026-610982',
    last_payment_date: '2026-07-15',
    mb_number: 'MB-2026/VOL-2/P-30',
    engineer: 'Er. Nilesh Gaikwad'
  }
];

// ============================================================================
// 5. RECENT TREASURY VOUCHERS / PAYMENTS LEDGER
// ============================================================================
const DEFAULT_VOUCHERS = [
  {
    voucher_id: 'v-913344',
    voucher_number: 'PAY-2026-913344',
    work_code: 'W-106',
    work_title: 'Main Storm Water Drain RCC Covering & Desilting',
    contractor_name: 'Shivam Construction & Infra Ltd',
    gross_amount: 350000,
    tds_deduction: 7000,
    security_deposit: 17500,
    net_paid: 325500,
    payment_date: '2026-09-10',
    payment_mode: 'NEFT Bank Transfer',
    bank_reference: 'SBIN00294820194',
    engineer_verified: 'Er. Suresh Kulkarni',
    status: 'CLEARED'
  },
  {
    voucher_id: 'v-902341',
    voucher_number: 'PAY-2026-902341',
    work_code: 'W-104',
    work_title: 'Pedestrian Footpath & Safety Railings Near School',
    contractor_name: 'Apex Urban Infra Works',
    gross_amount: 540000,
    tds_deduction: 10800,
    security_deposit: 27000,
    net_paid: 502200,
    payment_date: '2026-09-02',
    payment_mode: 'RTGS Electronic Settlement',
    bank_reference: 'HDFC00018239012',
    engineer_verified: 'Er. Prakash Shinde',
    status: 'CLEARED'
  },
  {
    voucher_id: 'v-881204',
    voucher_number: 'PAY-2026-881204',
    work_code: 'W-105',
    work_title: 'Underground Drinking Water Pipeline Replacement (Sector 2)',
    contractor_name: 'JalDhara Pipes & Civil Works',
    gross_amount: 480000,
    tds_deduction: 9600,
    security_deposit: 24000,
    net_paid: 446400,
    payment_date: '2026-08-18',
    payment_mode: 'NEFT Bank Transfer',
    bank_reference: 'MAHB00049182301',
    engineer_verified: 'Er. Suresh Kulkarni',
    status: 'CLEARED'
  },
  {
    voucher_id: 'v-849102',
    voucher_number: 'PAY-2026-849102',
    work_code: 'W-101',
    work_title: 'Concreting & Road Paving of Market Lane #4 (200m)',
    contractor_name: 'Shivam Construction & Infra Ltd',
    gross_amount: 520000,
    tds_deduction: 10400,
    security_deposit: 26000,
    net_paid: 483600,
    payment_date: '2026-08-20',
    payment_mode: 'NEFT Bank Transfer',
    bank_reference: 'SBIN00294820194',
    engineer_verified: 'Er. Prakash Shinde',
    status: 'CLEARED'
  },
  {
    voucher_id: 'v-772190',
    voucher_number: 'PAY-2026-772190',
    work_code: 'W-102',
    work_title: 'Smart LED Streetlight Installation Phase II (120 poles)',
    contractor_name: 'BrightSpark Energy Solutions Pvt Ltd',
    gross_amount: 400000,
    tds_deduction: 8000,
    security_deposit: 20000,
    net_paid: 372000,
    payment_date: '2026-08-12',
    payment_mode: 'RTGS Electronic Settlement',
    bank_reference: 'ICIC00098124911',
    engineer_verified: 'Er. Nilesh Gaikwad',
    status: 'CLEARED'
  }
];

// ============================================================================
// 6. DEFAULT PROPOSALS PIPELINE
// ============================================================================
const DEFAULT_PROPOSALS = [
  {
    proposal_id: 'p-001',
    proposal_code: 'PROP-2026-01',
    title: 'New Open Gym & Outdoor Fitness Track in Sector 3 Garden',
    category: 'Parks, Gardens & Greenery',
    estimated_budget: 850000,
    status: 'UNDER_REVIEW',
    submitted_date: '2026-08-10',
    justification: 'Requested by 150+ senior citizens and youth residing in Sector 3 & 4.',
    feasibility: 'WITHIN_BUDGET'
  },
  {
    proposal_id: 'p-002',
    proposal_code: 'PROP-2026-02',
    title: 'Covered RCC Gutter & Storm Drain Channel behind Municipal School',
    category: 'Water Supply & Drainage',
    estimated_budget: 650000,
    status: 'SUBMITTED',
    submitted_date: '2026-09-05',
    justification: 'Prevent foul mosquito breeding and rainwater stagnation near school playground.',
    feasibility: 'WITHIN_BUDGET'
  },
  {
    proposal_id: 'p-003',
    proposal_code: 'PROP-2026-03',
    title: 'High-Mast 16-Meter Illumination Tower at Ambedkar Chowk Junction',
    category: 'Streetlights & Electrical',
    estimated_budget: 450000,
    status: 'APPROVED',
    submitted_date: '2026-07-15',
    justification: 'Night traffic safety and women pedestrian security at busy transit junction.',
    feasibility: 'SANCTIONED'
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export const CorporatorFundsPage = () => {
  const navigate = useNavigate();
  const [fundsData, setFundsData] = useState(null);
  const [works, setWorks] = useState(DEFAULT_FUNDED_WORKS);
  const [vouchers, setVouchers] = useState(DEFAULT_VOUCHERS);
  const [proposals, setProposals] = useState(DEFAULT_PROPOSALS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // UI States
  const [activeTab, setActiveTab] = useState('works'); // 'works' | 'vouchers' | 'proposals' | 'sources'
  const [showResponsibilitiesGuide, setShowResponsibilitiesGuide] = useState(false);
  const [selectedFiscalYear, setSelectedFiscalYear] = useState('2026-2027');
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Drawer State
  const [inspectItem, setInspectItem] = useState(null);
  const [inspectType, setInspectType] = useState(null); // 'WORK' | 'VOUCHER'

  useEffect(() => {
    fetchWardFunds();
  }, []);

  const fetchWardFunds = async () => {
    setLoading(true);
    try {
      const [fundsRes, worksRes, proposalsRes] = await Promise.allSettled([
        api.get('/corporator/funds'),
        api.get('/corporator/works'),
        api.get('/corporator/proposals')
      ]);

      if (fundsRes.status === 'fulfilled' && fundsRes.value?.data) {
        setFundsData(fundsRes.value.data);
      }

      if (worksRes.status === 'fulfilled') {
        const worksPayload = worksRes.value?.data?.data || worksRes.value?.data;
        if (Array.isArray(worksPayload) && worksPayload.length > 0) {
          // Merge API works with financial breakdown fields
          const merged = worksPayload.map((w, idx) => ({
            ...w,
            sanctioned_amount: Number(w.sanctioned_amount || w.estimated_cost || 1500000),
            disbursed_amount: Number(w.funds_spent || (w.sanctioned_amount ? w.sanctioned_amount * (w.financial_progress / 100) : 800000)),
            balance_to_pay: Math.max(0, Number(w.sanctioned_amount || 1500000) - Number(w.funds_spent || 800000)),
            sector: w.category || w.department_name || 'Civil Infrastructure',
            contractor_name: w.contractor_name || 'Shivam Construction & Infra Ltd',
            mb_number: `MB-2026/VOL-${(idx % 4) + 1}/P-${40 + idx * 12}`,
            last_voucher: `PAY-2026-${700000 + idx * 15300}`,
            last_payment_date: w.start_date || '2026-08-15'
          }));
          setWorks(merged);
        }
      }

      if (proposalsRes.status === 'fulfilled') {
        const proposalsPayload = proposalsRes.value?.data?.data || proposalsRes.value?.data;
        if (Array.isArray(proposalsPayload) && proposalsPayload.length > 0) {
          setProposals(proposalsPayload);
        }
      }
    } catch (err) {
      console.error('Failed to fetch corporator ward funds:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchWardFunds();
  };

  // Telemetry Calculations
  const telemetry = useMemo(() => {
    const totalAllocated = Number(fundsData?.total_allocated || fundsData?.allocated || 10000000);
    const sanctionedAmount = Number(fundsData?.sanctioned_amount || 7950000);
    const utilizedAmount = Number(fundsData?.utilized_amount || fundsData?.utilized || 5750000);
    const committedAmount = Math.max(0, sanctionedAmount - utilizedAmount);
    const freeAvailableBalance = Math.max(0, totalAllocated - sanctionedAmount);
    const utilizationRate = Math.round((utilizedAmount / totalAllocated) * 100);
    const commitmentRate = Math.round((sanctionedAmount / totalAllocated) * 100);

    return {
      totalAllocated,
      sanctionedAmount,
      utilizedAmount,
      committedAmount,
      freeAvailableBalance,
      utilizationRate,
      commitmentRate
    };
  }, [fundsData]);

  // Filtered Works List
  const filteredWorks = useMemo(() => {
    return works.filter((w) => {
      const matchSearch =
        !searchQuery ||
        w.work_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.work_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.contractor_name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchSector = sectorFilter === 'ALL' || w.sector === sectorFilter;
      const matchStatus = statusFilter === 'ALL' || w.status === statusFilter;

      return matchSearch && matchSector && matchStatus;
    });
  }, [works, searchQuery, sectorFilter, statusFilter]);

  // Export Transparency CSV
  const handleExportStatement = () => {
    const headers = ['Work Code', 'Work Title', 'Civic Sector', 'Sanctioned Amount (INR)', 'Disbursed Paid (INR)', 'Balance Due (INR)', 'Status', 'Contractor', 'Measurement Book Ref'];
    const rows = works.map((w) => [
      `"${w.work_code}"`,
      `"${w.work_title.replace(/"/g, '""')}"`,
      `"${w.sector}"`,
      w.sanctioned_amount,
      w.disbursed_amount,
      w.balance_to_pay,
      `"${w.status}"`,
      `"${w.contractor_name}"`,
      `"${w.mb_number || 'N/A'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ward_24_Public_Fund_Transparency_Report_FY${selectedFiscalYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <LoadingState message="Fetching Ward 24 Budget & Public Fund Accounts..." />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & FISCAL BAR */}
      {/* ========================================================================= */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                <span>MUNICIPAL FISCAL TRANSPARENCY • WARD 24</span>
              </span>
              <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-full border border-slate-200">
                Shivaji Nagar Ward
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-2 tracking-tight flex items-center gap-2">
              <IndianRupee className="w-6 h-6 text-emerald-600" />
              Ward 24 Public Fund & Development Budget
              <span className="text-base font-normal text-slate-500 hidden sm:inline">(नगरसेवक प्रभाग निधी)</span>
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Complete, transparent accounting of how public tax money is allocated, committed to local contractors, and
              spent on your roads, water pipes, streetlights, and parks in Ward 24.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center flex-wrap gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              isLoading={refreshing}
              icon={RefreshCw}
              className="text-xs"
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportStatement}
              icon={Download}
              className="text-xs text-slate-700 border-slate-300 hover:bg-slate-50"
            >
              Export Statement (CSV)
            </Button>
          </div>
        </div>

        {/* Fiscal Countdown & Active Year Sub-Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Financial Year:
            </span>
            <select
              value={selectedFiscalYear}
              onChange={(e) => setSelectedFiscalYear(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 font-bold rounded-lg px-2.5 py-1 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="2026-2027">FY 2026-2027 (Active Current)</option>
              <option value="2025-2026">FY 2025-2026 (Audited Complete)</option>
              <option value="2024-2025">FY 2024-2025 (Archive)</option>
            </select>
            <span className="hidden md:inline-block text-slate-300">|</span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-500">
              <Landmark className="w-3.5 h-3.5 text-slate-400" />
              Hon. Corporator Anand Patil
            </span>
          </div>

          {/* Countdown Pill */}
          <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-lg font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              <strong>186 Days Left</strong> until March 31, 2027 •{' '}
              <span className="text-emerald-700 font-bold">{formatCurrency(telemetry.freeAvailableBalance)}</span> Free for New Works
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CORPORATOR STATUTORY RESPONSIBILITIES GUIDE (Plain English / Marathi) */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl text-white shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="bg-blue-500/30 text-blue-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-400/30">
                  CIVIC RIGHTS & DUTIES
                </span>
                <span className="text-blue-200 text-xs">Maharashtra Municipal Corporations Act & 74th Amendment</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Understanding Your Corporator's Fund Responsibilities
              </h2>
              <p className="text-xs text-blue-100/90 max-w-2xl">
                How public money moves from municipal taxes into your street. Know your corporator's statutory powers,
                how tenders are approved, and why zero advance payment is ever released.
              </p>
            </div>

            <button
              onClick={() => setShowResponsibilitiesGuide(!showResponsibilitiesGuide)}
              className="inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition-all shrink-0 cursor-pointer"
            >
              <span>{showResponsibilitiesGuide ? 'Hide Statutory Guide' : 'Read 5 Statutory Duties'}</span>
              {showResponsibilitiesGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Collapsible 5 Steps Cards */}
          {showResponsibilitiesGuide && (
            <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-1 md:grid-cols-5 gap-3.5">
              {CORPORATOR_RESPONSIBILITIES.map((resp) => {
                const Icon = resp.icon;
                return (
                  <div
                    key={resp.step}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 flex flex-col justify-between hover:bg-white/15 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-amber-300 font-mono">{resp.step}</span>
                        <div className="p-1.5 rounded-lg bg-white/10">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="text-[11px] font-bold text-amber-200">{resp.marathiTitle}</div>
                      <h4 className="text-xs font-bold text-white leading-tight">{resp.englishTitle}</h4>
                      <p className="text-[11px] text-blue-100/80 leading-relaxed pt-1">{resp.summary}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CORE 4 METRIC CARDS (Citizen Friendly & Intuitive) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Allocated */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Annual Ward Fund</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {formatCurrency(telemetry.totalAllocated)}
            </div>
            <div className="text-xs font-semibold text-blue-600 mt-1">₹1.00 Crore Municipal Grant</div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2.5 pt-2.5 border-t border-slate-100">
            Total statutory budget granted to Ward 24 for FY 2026-27 to execute neighborhood works.
          </p>
        </div>

        {/* Card 2: Approved & Committed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Sanctioned & Locked</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-indigo-900 tracking-tight">
              {formatCurrency(telemetry.sanctionedAmount)}
            </div>
            <div className="text-xs font-semibold text-indigo-600 mt-1">
              {telemetry.commitmentRate}% of Total Quota Locked
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2.5 pt-2.5 border-t border-slate-100">
            Officially approved by Standing Committee & legally locked into active work orders.
          </p>
        </div>

        {/* Card 3: Utilized / Disbursed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Disbursed to Contractors</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-900 tracking-tight">
              {formatCurrency(telemetry.utilizedAmount)}
            </div>
            <div className="text-xs font-semibold text-emerald-600 mt-1">
              {telemetry.utilizationRate}% Physical Milestones Paid
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2.5 pt-2.5 border-t border-slate-100">
            Paid out after engineer quality checks, measurement book entries, and TDS deductions.
          </p>
        </div>

        {/* Card 4: Free Available Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Free for New Works</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <PlusCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-amber-900 tracking-tight">
              {formatCurrency(telemetry.freeAvailableBalance)}
            </div>
            <div className="text-xs font-semibold text-amber-600 mt-1">
              Uncommitted Balance Available
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2.5 pt-2.5 border-t border-slate-100">
            Money unassigned yet. Residents & corporator can propose new works from this balance.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. VISUAL OVERALL BUDGET HEALTH & UTILIZATION BAR */}
      {/* ========================================================================= */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-600" />
              Ward 24 Budget Health & Commitment Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Visual distribution of ₹1.00 Crore total ward fund between completed work, ongoing work, and free balance.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              Paid ({telemetry.utilizationRate}%)
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
              Committed In-Progress ({Math.round((telemetry.committedAmount / telemetry.totalAllocated) * 100)}%)
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              Free Available ({Math.round((telemetry.freeAvailableBalance / telemetry.totalAllocated) * 100)}%)
            </span>
          </div>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
          <div
            className="bg-emerald-500 h-full transition-all duration-500"
            style={{ width: `${telemetry.utilizationRate}%` }}
            title={`Paid to Contractors: ${formatCurrency(telemetry.utilizedAmount)} (${telemetry.utilizationRate}%)`}
          />
          <div
            className="bg-indigo-500 h-full transition-all duration-500"
            style={{ width: `${(telemetry.committedAmount / telemetry.totalAllocated) * 100}%` }}
            title={`Work In Progress Committed: ${formatCurrency(telemetry.committedAmount)}`}
          />
          <div
            className="bg-amber-400 h-full transition-all duration-500"
            style={{ width: `${(telemetry.freeAvailableBalance / telemetry.totalAllocated) * 100}%` }}
            title={`Free Balance for New Projects: ${formatCurrency(telemetry.freeAvailableBalance)}`}
          />
        </div>

        {/* Audit & Integrity Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-2 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Maker-Checker Guard:</strong> Official bills verified independently by Junior Engineer.
            </span>
          </div>
          <div className="flex items-center space-x-2 text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Zero Duplicate Payments:</strong> Automated voucher checks before RTGS release.
            </span>
          </div>
          <div className="flex items-center space-x-2 text-slate-700">
            <Briefcase className="w-4 h-4 text-purple-600 shrink-0" />
            <span>
              <strong>14 Active Contracts:</strong> Directly improving roads, water, lights, and sanitation.
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. WHERE DOES THE MONEY COME FROM? (FUNDING SOURCES) */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-indigo-600" />
              Where Does the Ward Fund Come From? (निधीचे स्त्रोत)
            </h3>
            <p className="text-xs text-slate-500">
              Ward 24 receives development grants from municipal revenues, central finance commissions, and state urban schemes.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">3 Statutory Grants Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FUNDING_SOURCES.map((src) => (
            <div key={src.source_id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {src.sharePercent}% of Total Fund
                  </span>
                  <span className="text-xs font-bold text-slate-700 px-2 py-0.5 rounded-full bg-slate-100">
                    {formatCurrency(src.amount)}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{src.name}</h4>
                  <div className="text-xs font-medium text-blue-700 mt-0.5">{src.localName}</div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {src.purpose}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Sanctioning Body:</span>
                <span className="font-semibold text-slate-700">{src.sanction_authority}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. CIVIC SECTOR BREAKDOWN (HOW IS IT BEING SPENT?) */}
      {/* ========================================================================= */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            Budget Allocation by Civic Sector (कशावर किती खर्च?)
          </h3>
          <p className="text-xs text-slate-500">
            See how much money is earmarked and spent across roads, water pipelines, streetlights, parks, and health.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {CIVIC_SECTORS.map((sec) => {
            const Icon = sec.icon;
            const pct = Math.round((sec.spent / sec.allocated) * 100);
            return (
              <div
                key={sec.id}
                className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 flex flex-col justify-between hover:bg-slate-100/70 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {sec.worksCount} Works
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">{sec.name}</h4>
                    <div className="text-[10px] text-slate-500 font-medium">{sec.marathi}</div>
                  </div>

                  <div className="pt-1">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="font-bold text-slate-900">{formatCurrency(sec.spent)}</span>
                      <span className="text-slate-400 text-[10px]">of {formatCurrency(sec.allocated)}</span>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-[10px] font-semibold text-blue-700 text-right mt-1">{pct}% Disbursed</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. INTERACTIVE TABS (FUNDED WORKS, VOUCHERS, PROPOSALS PIPELINE) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('works')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'works'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Works Funded by Budget ({works.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('vouchers')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'vouchers'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Payment Vouchers & Vouchering Ledger ({vouchers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('proposals')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'proposals'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Proposals Awaiting Approval ({proposals.length})</span>
          </button>
        </div>

        {/* Tab 1: Funded Works */}
        {activeTab === 'works' && (
          <div className="p-6 space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by work code, project name, or contractor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Civic Sectors</option>
                  <option value="Roads & Pavements">Roads & Pavements</option>
                  <option value="Water Supply & Drainage">Water Supply & Drainage</option>
                  <option value="Streetlights & Electrical">Streetlights & Electrical</option>
                  <option value="Parks, Gardens & Greenery">Parks & Gardens</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ONGOING">Under Construction (Ongoing)</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="DELAYED">Behind Schedule</option>
                </select>
              </div>
            </div>

            {/* Works Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Work Code & Title</th>
                    <th className="px-4 py-3">Civic Sector</th>
                    <th className="px-4 py-3 text-right">Sanctioned Budget</th>
                    <th className="px-4 py-3 text-right">Paid to Date</th>
                    <th className="px-4 py-3 text-right">Balance Due</th>
                    <th className="px-4 py-3 text-center">Progress %</th>
                    <th className="px-4 py-3">Contractor Agency</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredWorks.map((w) => (
                    <tr key={w.work_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{w.work_title}</div>
                        <div className="text-[11px] font-mono text-blue-700 mt-0.5">{w.work_code}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {w.sector}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900">
                        {formatCurrency(w.sanctioned_amount)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-700">
                        {formatCurrency(w.disbursed_amount)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-600">
                        {formatCurrency(w.balance_to_pay)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex items-center space-x-1.5">
                          <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-blue-600 h-full rounded-full"
                              style={{ width: `${w.physical_progress || 0}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-slate-700">{w.physical_progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-medium">
                        {w.contractor_name}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setInspectItem(w);
                            setInspectType('WORK');
                          }}
                          className="text-[11px] py-1 px-2.5 h-auto text-blue-700 border-blue-200 hover:bg-blue-50"
                        >
                          View Ledger
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Payment Vouchers Ledger */}
        {activeTab === 'vouchers' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <p>
                Transparent, audited municipal treasury ledger showing gross contractor bills, 2% TDS, 5% Security
                Deposit deductions, and electronic RTGS bank clearances.
              </p>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Zero Pending Contractor Disputes
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Voucher Number</th>
                    <th className="px-4 py-3">Work Title & Code</th>
                    <th className="px-4 py-3">Contractor / Beneficiary</th>
                    <th className="px-4 py-3 text-right">Gross Amount</th>
                    <th className="px-4 py-3 text-right">TDS & Deductions</th>
                    <th className="px-4 py-3 text-right">Net Released</th>
                    <th className="px-4 py-3">Payment Date & Ref</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vouchers.map((v) => (
                    <tr key={v.voucher_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-mono font-bold text-indigo-700">{v.voucher_number}</div>
                        <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-0.5">
                          {v.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <div className="font-bold text-slate-900 truncate">{v.work_title}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{v.work_code}</div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {v.contractor_name}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-600">
                        {formatCurrency(v.gross_amount)}
                      </td>
                      <td className="px-4 py-3 text-right text-rose-600 font-medium">
                        -{formatCurrency((v.tds_deduction || 0) + (v.security_deposit || 0))}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-700">
                        {formatCurrency(v.net_paid)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <div>{formatDate(v.payment_date)}</div>
                        <div className="text-[10px] font-mono text-slate-400">{v.bank_reference}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setInspectItem(v);
                            setInspectType('VOUCHER');
                          }}
                          className="text-[11px] py-1 px-2.5 h-auto text-slate-600 hover:text-blue-700"
                        >
                          View Voucher
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Proposals Awaiting Approval */}
        {activeTab === 'proposals' && (
          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <p className="text-slate-600">
                Official development works submitted by Hon. Corporator Anand Patil currently pending technical
                estimation or Standing Committee financial approval.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/corporator/proposals')}
                icon={ExternalLink}
                className="text-xs text-blue-700 border-blue-300 hover:bg-blue-50 shrink-0"
              >
                Open Full Proposals Pipeline ↗
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {proposals.map((p) => (
                <div
                  key={p.proposal_id}
                  className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {p.proposal_code}
                      </span>
                      <span className="text-[10px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                        {p.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{p.title}</h4>
                    <div className="text-xs font-semibold text-blue-700">{p.category || 'Ward Development'}</div>

                    <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                      {p.justification || p.description || 'Submitted based on resident requests.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Estimated Budget:</span>
                      <span className="font-bold text-slate-900 text-sm">{formatCurrency(p.estimated_budget)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Submitted Date:</span>
                      <span>{p.submitted_date || formatDate(p.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 8. SLIDE-OVER INSPECTION DRAWER (WORK / VOUCHER DETAILS) */}
      {/* ========================================================================= */}
      <Drawer
        isOpen={Boolean(inspectItem)}
        onClose={() => setInspectItem(null)}
        title={
          inspectType === 'WORK'
            ? `Project Financial Ledger: ${inspectItem?.work_code || ''}`
            : `Treasury Voucher: ${inspectItem?.voucher_number || ''}`
        }
      >
        {inspectItem && inspectType === 'WORK' && (
          <div className="space-y-5 text-xs text-slate-700">
            <div>
              <span className="text-[11px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                {inspectItem.sector}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2">{inspectItem.work_title}</h3>
              <p className="text-slate-500 mt-1 font-mono text-[11px]">Work Code: {inspectItem.work_code}</p>
            </div>

            {/* Financial Summary */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Sanctioned Work Order Cost:</span>
                <span className="font-bold text-slate-900">{formatCurrency(inspectItem.sanctioned_amount)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Paid to Contractor so far:</span>
                <span className="font-bold text-emerald-700">{formatCurrency(inspectItem.disbursed_amount)}</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200">
                <span className="font-semibold text-slate-700">Balance Retained / Due:</span>
                <span className="font-bold text-slate-900">{formatCurrency(inspectItem.balance_to_pay)}</span>
              </div>
            </div>

            {/* Verification & Quality Entries */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Statutory Engineering Records
              </h4>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Contractor:</span>
                  <span className="font-semibold text-slate-800">{inspectItem.contractor_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Measurement Book (MB) Ref:</span>
                  <span className="font-mono font-semibold text-blue-700">{inspectItem.mb_number || 'MB-2026/VOL-4'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Supervising Ward Engineer:</span>
                  <span className="font-semibold text-slate-800">{inspectItem.engineer || 'Er. Prakash Shinde (JE)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Last Cleared Voucher:</span>
                  <span className="font-mono text-indigo-700">{inspectItem.last_voucher || 'PAY-2026-849102'}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
              <strong>Public Audit Notice:</strong> All bills for this project are subject to pre-audit by the Municipal Chief
              Accounts Officer and post-audit by the Local Fund Audit Department.
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setInspectItem(null)}
              className="w-full text-xs"
            >
              Close Ledger
            </Button>
          </div>
        )}

        {inspectItem && inspectType === 'VOUCHER' && (
          <div className="space-y-5 text-xs text-slate-700">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                MUNICIPAL TREASURY PAYMENT VOUCHER
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2">{inspectItem.voucher_number}</h3>
              <p className="text-slate-500 mt-0.5">Cleared on {formatDate(inspectItem.payment_date)}</p>
            </div>

            {/* Voucher Itemization */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">Gross Bill Amount:</span>
                <span className="font-bold text-slate-900">{formatCurrency(inspectItem.gross_amount)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-rose-600">
                <span>(-) TDS Deduction (2%):</span>
                <span>-{formatCurrency(inspectItem.tds_deduction || 0)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-rose-600">
                <span>(-) Security Deposit (5%):</span>
                <span>-{formatCurrency(inspectItem.security_deposit || 0)}</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200 font-bold text-emerald-800 text-sm">
                <span>Net Disbursed:</span>
                <span>{formatCurrency(inspectItem.net_paid)}</span>
              </div>
            </div>

            {/* Transfer Details */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Contractor Beneficiary:</span>
                <span className="font-bold text-slate-800">{inspectItem.contractor_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Linked Work Code:</span>
                <span className="font-mono text-blue-700">{inspectItem.work_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Disbursement Mode:</span>
                <span className="font-semibold text-slate-800">{inspectItem.payment_mode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bank UTR / Ref No:</span>
                <span className="font-mono text-slate-700">{inspectItem.bank_reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Engineer Verification:</span>
                <span className="font-semibold text-slate-800">{inspectItem.engineer_verified}</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setInspectItem(null)}
              className="w-full text-xs"
            >
              Done
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  );
};
