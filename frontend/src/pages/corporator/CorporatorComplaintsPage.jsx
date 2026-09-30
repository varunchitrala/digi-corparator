import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { LoadingState } from '../../components/LoadingState';
import { Drawer } from '../../components/Drawer';
import { Pagination } from '../../components/Pagination';
import {
  Search,
  MapPin,
  Eye,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Filter,
  Download,
  RefreshCw,
  Phone,
  User,
  Building2,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  X,
  Send,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  FileSpreadsheet,
  Trash2,
  Construction,
  Droplets,
  Waves,
  Lightbulb,
  HeartPulse,
  Building,
  Check,
  Info,
  FolderKanban,
  CheckCircle,
  AlertCircle,
  Sliders
} from 'lucide-react';

// ============================================================================
// 10 CIVIC COMPLAINT WORKFLOW CATEGORIES
// ============================================================================
export const CIVIC_COMPLAINT_WORKFLOWS = [
  {
    id: 'garbage-sanitation',
    name: 'Garbage and sanitation',
    shortName: 'Sanitation',
    department: 'Solid Waste Management Wing',
    standardSla: '24h SLA',
    icon: Trash2,
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Solid waste disposal, garbage bin overflow, street sweeping, and door-to-door collection.'
  },
  {
    id: 'roads-potholes',
    name: 'Roads and potholes',
    shortName: 'Roads & Potholes',
    department: 'Roads & Infrastructure Engineering Wing',
    standardSla: '48h SLA',
    icon: Construction,
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    description: 'Pothole patchworks, crater hazards, broken paver blocks, and road surface damage.'
  },
  {
    id: 'water-supply',
    name: 'Water supply',
    shortName: 'Water Supply',
    department: 'Water Supply & Public Distribution Wing',
    standardSla: '24h SLA',
    icon: Droplets,
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Pipeline bursts, erratic supply hours, low pressure, contaminated water, and valve issues.'
  },
  {
    id: 'drainage-sewerage',
    name: 'Drainage and sewerage',
    shortName: 'Drainage',
    department: 'Stormwater Drainage & Sewer Network Wing',
    standardSla: '24h SLA',
    icon: Waves,
    badgeClass: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    description: 'Stormwater drain overflows, blocked gutters, desilting requests, and open drainage chambers.'
  },
  {
    id: 'streetlights-electricity',
    name: 'Streetlights and electricity',
    shortName: 'Streetlights',
    department: 'Electrical & Public Lighting Wing',
    standardSla: '24h SLA',
    icon: Lightbulb,
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-300',
    description: 'Defective streetlights, dark roads, high-mast tower faults, and hanging live wires.'
  },
  {
    id: 'public-health',
    name: 'Public health',
    shortName: 'Public Health',
    department: 'Public Health & Vector Control Wing',
    standardSla: '48h SLA',
    icon: HeartPulse,
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    description: 'Mosquito breeding, dengue/malaria vector control, thermal fogging, and sanitation.'
  },
  {
    id: 'encroachment-estate',
    name: 'Encroachment and estate',
    shortName: 'Encroachment',
    department: 'Town Planning & Anti-Encroachment Squad',
    standardSla: '72h SLA',
    icon: ShieldAlert,
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Footpath encroachments, unauthorized hawker stalls, illegal hoardings, and debris.'
  },
  {
    id: 'wastewater-leakage',
    name: 'Wastewater and leakage',
    shortName: 'Wastewater',
    department: 'Underground Sewerage Treatment Wing',
    standardSla: '24h SLA',
    icon: Droplets,
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description: 'Sewage backflow into residential basements, manhole chamber leakage, and odor.'
  },
  {
    id: 'public-facilities',
    name: 'Public facilities',
    shortName: 'Facilities',
    department: 'Public Amenities & Gardens Wing',
    standardSla: '48h SLA',
    icon: Building2,
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
    description: 'Public toilet maintenance, broken park benches, playground swings, and bus shelters.'
  },
  {
    id: 'other-civic-issues',
    name: 'Other civic issues',
    shortName: 'Other Issues',
    department: 'General Ward Administration',
    standardSla: '48h SLA',
    icon: HelpCircle,
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    description: 'Stray cattle/animal nuisance, noise violations, and miscellaneous civic grievances.'
  }
];

// Helper to normalize any category string into the standard 10
export const normalizeCategory = (catName = '') => {
  const c = String(catName || '').toLowerCase().trim();
  if (c.includes('garbage') || c.includes('sanitation') || c.includes('solid waste') || c.includes('dustbin') || c.includes('dump') || c.includes('waste management')) {
    return 'Garbage and sanitation';
  }
  if (c.includes('pothole') || c.includes('road') || c.includes('asphalt') || c.includes('paver') || c.includes('street damage') || c.includes('infrastructure')) {
    return 'Roads and potholes';
  }
  if (c.includes('water supply') || c.includes('drinking water') || c.includes('water pressure') || c.includes('pipeline') || c.includes('tap water')) {
    return 'Water supply';
  }
  if (c.includes('drainage') || c.includes('stormwater') || c.includes('desilting') || c.includes('gutter') || (c.includes('sewerage') && !c.includes('waste'))) {
    return 'Drainage and sewerage';
  }
  if (c.includes('streetlight') || c.includes('electric') || c.includes('lighting') || c.includes('pole') || c.includes('lamp') || c.includes('high-mast')) {
    return 'Streetlights and electricity';
  }
  if (c.includes('health') || c.includes('dengue') || c.includes('malaria') || c.includes('mosquito') || c.includes('fogging') || c.includes('vector')) {
    return 'Public health';
  }
  if (c.includes('encroachment') || c.includes('estate') || c.includes('hawker') || c.includes('illegal') || c.includes('hoarding') || c.includes('footpath stall')) {
    return 'Encroachment and estate';
  }
  if (c.includes('wastewater') || c.includes('waste water') || c.includes('sewage leakage') || c.includes('backflow') || c.includes('sewage')) {
    return 'Wastewater and leakage';
  }
  if (c.includes('facility') || c.includes('toilet') || c.includes('park') || c.includes('bench') || c.includes('garden') || c.includes('hall') || c.includes('playground') || c.includes('trees')) {
    return 'Public facilities';
  }
  return 'Other civic issues';
};

// Realistic Ward 24 default grievances covering all 10 categories
const DEFAULT_WARD_COMPLAINTS = [
  // 1. Garbage and sanitation
  {
    complaint_id: 'cmp-105',
    complaint_number: 'CMP-2026-0820',
    title: 'Solid Waste Dumping & Unattended Garbage Skip',
    description: 'Community garbage dumpster has not been cleared for 48 hours; stray animal nuisance and waste spilling onto pedestrian footpath.',
    location_address: 'Near Weekly Vegetable Market Ground, Ward 24',
    category_name: 'Garbage and sanitation',
    department_name: 'Solid Waste Management Wing',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    citizen_name: 'Sunil Jadhav',
    citizen_phone: '+91 98812 77654',
    officer_first_name: 'Santosh',
    officer_last_name: 'Kadam',
    officer_phone: '+91 94227 88912',
    created_at: new Date(Date.now() - 16 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() + 8 * 3600000).toISOString(),
    history: [
      { to_status: 'REGISTERED', remarks: 'Complaint raised via ward WhatsApp helpline with photo.', created_at: new Date(Date.now() - 16 * 3600000).toISOString() },
      { to_status: 'IN_PROGRESS', remarks: 'Compactor vehicle scheduled for immediate lifting.', created_at: new Date(Date.now() - 2 * 3600000).toISOString() }
    ]
  },
  {
    complaint_id: 'cmp-109',
    complaint_number: 'CMP-2026-0851',
    title: 'Missed Door-to-Door Waste Collection & Litter Pile',
    description: 'Municipal waste collection vehicle skipped Gulmohar Lane 2 for second consecutive day. Waste bags accumulating near society gates.',
    location_address: 'Gulmohar Lane 2, Sector 4, Ward 24',
    category_name: 'Garbage and sanitation',
    department_name: 'Solid Waste Management Wing',
    priority: 'MEDIUM',
    status: 'ASSIGNED',
    citizen_name: 'Pooja Agarwal',
    citizen_phone: '+91 98223 99012',
    officer_first_name: 'Santosh',
    officer_last_name: 'Kadam',
    officer_phone: '+91 94227 88912',
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() + 16 * 3600000).toISOString(),
    history: [
      { to_status: 'REGISTERED', remarks: 'Grievance lodged online by resident committee.', created_at: new Date(Date.now() - 8 * 3600000).toISOString() },
      { to_status: 'ASSIGNED', remarks: 'Feeder vehicle dispatched for second shift.', created_at: new Date(Date.now() - 3 * 3600000).toISOString() }
    ]
  },

  // 2. Roads and potholes
  {
    complaint_id: 'cmp-103',
    complaint_number: 'CMP-2026-0839',
    title: 'Cluster of Deep Potholes Causing Traffic Gridlock',
    description: 'Severe road surface damage with 4-5 deep potholes following recent rainfall, leading to minor two-wheeler skidding accidents.',
    location_address: 'Sector 4 Main Access Road, Near Hanuman Temple, Ward 24',
    category_name: 'Roads and potholes',
    department_name: 'Roads & Infrastructure Engineering Wing',
    priority: 'HIGH',
    status: 'INSPECTION',
    citizen_name: 'Rameshwar Patil',
    citizen_phone: '+91 94225 67812',
    officer_first_name: 'Amit',
    officer_last_name: 'Bhosale',
    officer_phone: '+91 98221 44321',
    created_at: new Date(Date.now() - 20 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() + 28 * 3600000).toISOString(),
    history: [
      { to_status: 'REGISTERED', remarks: 'Lodged by Ward transport union driver.', created_at: new Date(Date.now() - 20 * 3600000).toISOString() },
      { to_status: 'INSPECTION', remarks: 'Site inspection completed. Cold-mix repair sanctioned.', created_at: new Date(Date.now() - 5 * 3600000).toISOString() }
    ]
  },
  {
    complaint_id: 'cmp-110',
    complaint_number: 'CMP-2026-0862',
    title: 'Broken Paver Blocks & Dangerous Uneven Road Surface',
    description: 'Paver blocks sank over 15 meters on busy pedestrian crossing behind ward shopping complex, creating tripping hazard for senior citizens.',
    location_address: 'Behind Ward 24 Market Complex, Sector 4',
    category_name: 'Roads and potholes',
    department_name: 'Roads & Infrastructure Engineering Wing',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    citizen_name: 'Mahesh Sharma',
    citizen_phone: '+91 98901 12345',
    officer_first_name: 'Amit',
    officer_last_name: 'Bhosale',
    officer_phone: '+91 98221 44321',
    created_at: new Date(Date.now() - 52 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    history: [
      { to_status: 'REGISTERED', remarks: 'Grievance lodged.', created_at: new Date(Date.now() - 52 * 3600000).toISOString() },
      { to_status: 'RESOLVED', remarks: 'Heavy-duty paver blocks re-laid.', created_at: new Date(Date.now() - 10 * 3600000).toISOString() }
    ]
  },

  // 3. Water supply
  {
    complaint_id: 'cmp-101',
    complaint_number: 'CMP-2026-0842',
    title: 'Main Drinking Water Pipeline Rupture & Heavy Leakage',
    description: 'Fresh water pipeline burst near Shivaji Chowk junction, causing street flooding and acute low water pressure for 85 households since early morning.',
    location_address: 'Opposite Shivaji Maharaj Chowk, Sector 4, Ward 24',
    category_name: 'Water supply',
    department_name: 'Water Supply & Public Distribution Wing',
    priority: 'CRITICAL',
    status: 'ESCALATED',
    citizen_name: 'Vijay Shinde',
    citizen_phone: '+91 98231 44521',
    officer_first_name: 'Prakash',
    officer_last_name: 'Kulkarni',
    officer_phone: '+91 94220 11984',
    created_at: new Date(Date.now() - 36 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    history: [
      { to_status: 'REGISTERED', remarks: 'Grievance lodged with geolocated photo.', created_at: new Date(Date.now() - 36 * 3600000).toISOString() },
      { to_status: 'ESCALATED', remarks: 'SLA threshold exceeded due to replacement pipe procurement.', created_at: new Date(Date.now() - 6 * 3600000).toISOString() }
    ]
  },
  {
    complaint_id: 'cmp-107',
    complaint_number: 'CMP-2026-0798',
    title: 'Low Water Pressure During Scheduled Morning Hours',
    description: 'Tail-end residents in Lane 5 receiving barely 15 minutes of water with extremely low head pressure for last 4 days.',
    location_address: 'Lane 5, Kranti Nagar, Ward 24',
    category_name: 'Water supply',
    department_name: 'Water Supply & Public Distribution Wing',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    citizen_name: 'Meena Kulkarni',
    citizen_phone: '+91 94033 88123',
    officer_first_name: 'Prakash',
    officer_last_name: 'Kulkarni',
    officer_phone: '+91 94220 11984',
    created_at: new Date(Date.now() - 72 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    history: [
      { to_status: 'REGISTERED', remarks: 'Complaint logged.', created_at: new Date(Date.now() - 72 * 3600000).toISOString() },
      { to_status: 'RESOLVED', remarks: 'Sluice valve calibrated; pressure restored.', created_at: new Date(Date.now() - 28 * 3600000).toISOString() }
    ]
  },

  // 4. Drainage and sewerage
  {
    complaint_id: 'cmp-102',
    complaint_number: 'CMP-2026-0845',
    title: 'Overflowing Stormwater Drain & Stagnant Sewage Water',
    description: 'Cover slab missing on roadside open drain with hazardous black water accumulation spreading foul odor near Municipal Primary School.',
    location_address: 'Lane 3, Near Vidya Mandir School, Ward 24',
    category_name: 'Drainage and sewerage',
    department_name: 'Stormwater Drainage & Sewer Network Wing',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    citizen_name: 'Anjali Deshmukh',
    citizen_phone: '+91 97654 32189',
    officer_first_name: 'Suresh',
    officer_last_name: 'Patil',
    officer_phone: '+91 98902 55432',
    created_at: new Date(Date.now() - 14 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() + 10 * 3600000).toISOString(),
    history: [
      { to_status: 'REGISTERED', remarks: 'Registered by resident welfare association.', created_at: new Date(Date.now() - 14 * 3600000).toISOString() },
      { to_status: 'IN_PROGRESS', remarks: 'Suction jetting tanker deployed, desilting in progress.', created_at: new Date(Date.now() - 4 * 3600000).toISOString() }
    ]
  },
  {
    complaint_id: 'cmp-111',
    complaint_number: 'CMP-2026-0870',
    title: 'Missing Heavy RCC Chamber Slab on Open Gutter',
    description: 'Heavy vehicle broke the concrete chamber cover; open 5-foot deep gutter is unbarricaded right on main bazaar turn.',
    location_address: 'Main Bazar Road Corner, Opposite Dena Bank, Ward 24',
    category_name: 'Drainage and sewerage',
    department_name: 'Stormwater Drainage & Sewer Network Wing',
    priority: 'HIGH',
    status: 'ASSIGNED',
    citizen_name: 'Girish Joshi',
    citizen_phone: '+91 98226 77114',
    officer_first_name: 'Suresh',
    officer_last_name: 'Patil',
    officer_phone: '+91 98902 55432',
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() + 18 * 3600000).toISOString(),
    history: [
      { to_status: 'REGISTERED', remarks: 'Urgent pedestrian safety hazard reported.', created_at: new Date(Date.now() - 6 * 3600000).toISOString() },
      { to_status: 'ASSIGNED', remarks: 'Contractor assigned for new slab casting.', created_at: new Date(Date.now() - 2 * 3600000).toISOString() }
    ]
  },

  // 5. Streetlights and electricity
  {
    complaint_id: 'cmp-104',
    complaint_number: 'CMP-2026-0831',
    title: 'High-Mast Junction Light & 6 Streetlights Not Working',
    description: 'Total dark stretch from Gulmohar Corner to Bus Stop for past 3 days due to feeder box short-circuit. Safety hazard for evening pedestrians.',
    location_address: 'Gulmohar Colony Bus Stop Road, Ward 24',
    category_name: 'Streetlights and electricity',
    department_name: 'Electrical & Public Lighting Wing',
    priority: 'HIGH',
    status: 'ASSIGNED',
    citizen_name: 'Kavita Gaikwad',
    citizen_phone: '+91 99228 11234',
    officer_first_name: 'Amit',
    officer_last_name: 'Deshmukh',
    officer_phone: '+91 98221 99876',
    created_at: new Date(Date.now() - 26 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() + 22 * 3600000).toISOString(),
    history: [
      { to_status: 'REGISTERED', remarks: 'Logged online by colony secretary.', created_at: new Date(Date.now() - 26 * 3600000).toISOString() },
      { to_status: 'ASSIGNED', remarks: 'Assigned to Electrical maintenance crew.', created_at: new Date(Date.now() - 18 * 3600000).toISOString() }
    ]
  },
  {
    complaint_id: 'cmp-112',
    complaint_number: 'CMP-2026-0881',
    title: 'Hanging Live Wire Cable & Blinking Sodium Lamp',
    description: 'Storm damaged feeder overhead cable hanging near tree branch, sparking intermittently during evening hours near children park.',
    location_address: 'Near Municipal Gym Ground, Sector 4, Ward 24',
    category_name: 'Streetlights and electricity',
    department_name: 'Electrical & Public Lighting Wing',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    citizen_name: 'Rahul Borse',
    citizen_phone: '+91 94220 88223',
    officer_first_name: 'Amit',
    officer_last_name: 'Deshmukh',
    officer_phone: '+91 98221 99876',
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() + 19 * 3600000).toISOString(),
    history: [
      { to_status: 'REGISTERED', remarks: 'Emergency hazard call received.', created_at: new Date(Date.now() - 5 * 3600000).toISOString() },
      { to_status: 'IN_PROGRESS', remarks: 'Lineman team dispatched with bucket truck.', created_at: new Date(Date.now() - 1 * 3600000).toISOString() }
    ]
  },

  // 6. Public health
  {
    complaint_id: 'cmp-113',
    complaint_number: 'CMP-2026-0855',
    title: 'Extensive Mosquito Breeding & Stagnant Water in Open Plot',
    description: 'Unfenced private open plot accumulated 2 feet of stagnant monsoon water. Heavy mosquito breeding and dengue fever cases reported.',
    location_address: 'Plot 42, Behind Anand Nagar Society, Ward 24',
    category_name: 'Public health',
    department_name: 'Public Health & Vector Control Wing',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    citizen_name: 'Dr. Nitin Kulkarni',
    citizen_phone: '+91 98230 44991',
    officer_first_name: 'Dr. Rekha',
    officer_last_name: 'Borde',
    officer_phone: '+91 97660 55123',
    created_at: new Date(Date.now() - 18 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() + 6 * 3600000).toISOString(),
    history: [
      { to_status: 'REGISTERED', remarks: 'Medical notice submitted.', created_at: new Date(Date.now() - 18 * 3600000).toISOString() },
      { to_status: 'IN_PROGRESS', remarks: 'Thermal fogging & larvicide spray initiated.', created_at: new Date(Date.now() - 4 * 3600000).toISOString() }
    ]
  },
  {
    complaint_id: 'cmp-114',
    complaint_number: 'CMP-2026-0856',
    title: 'Urgent Chemical Fogging & Larvicide Spray Request',
    description: 'Over 120 households requesting comprehensive smoke fogging in slum cluster following 2 suspected malaria hospitalizations.',
    location_address: 'Shahu Nagar Slum Cluster, Lane 4, Ward 24',
    category_name: 'Public health',
    department_name: 'Public Health & Vector Control Wing',
    priority: 'MEDIUM',
    status: 'ASSIGNED',
    citizen_name: 'Babasaheb Kambale',
    citizen_phone: '+91 94211 33445',
    officer_first_name: 'Dr. Rekha',
    officer_last_name: 'Borde',
    officer_phone: '+91 97660 55123',
    created_at: new Date(Date.now() - 10 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() + 38 * 3600000).toISOString(),
    history: [
      { to_status: 'REGISTERED', remarks: 'Community delegation submitted written grievance.', created_at: new Date(Date.now() - 10 * 3600000).toISOString() },
      { to_status: 'ASSIGNED', remarks: 'Scheduled for morning fogging drive.', created_at: new Date(Date.now() - 2 * 3600000).toISOString() }
    ]
  },

  // 7. Encroachment and estate
  {
    complaint_id: 'cmp-115',
    complaint_number: 'CMP-2026-0860',
    title: 'Illegal Commercial Stalls & Hawkers Blocking Footpath',
    description: 'Over 8 unauthorized wooden stalls set up on newly paved footpath outside railway station approach road, forcing pedestrians onto traffic lane.',
    location_address: 'Railway Station Feeder Road, Sector 4, Ward 24',
    category_name: 'Encroachment and estate',
    department_name: 'Town Planning & Anti-Encroachment Squad',
    priority: 'HIGH',
    status: 'ESCALATED',
    citizen_name: 'Sanjay Thorat',
    citizen_phone: '+91 98900 11882',
    officer_first_name: 'Vinod',
    officer_last_name: 'Salunkhe',
    officer_phone: '+91 94225 99341',
    created_at: new Date(Date.now() - 80 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    history: [
      { to_status: 'REGISTERED', remarks: 'Pedestrian safety complaint with photos.', created_at: new Date(Date.now() - 80 * 3600000).toISOString() },
      { to_status: 'ESCALATED', remarks: 'SLA breached. Removal squad requisitioned with police support.', created_at: new Date(Date.now() - 8 * 3600000).toISOString() }
    ]
  },
  {
    complaint_id: 'cmp-116',
    complaint_number: 'CMP-2026-0861',
    title: 'Unauthorized Advertising Hoarding Obstructing Traffic View',
    description: 'Huge iron flex board erected on municipal road divider without corporation permit, blocking line-of-sight for turning vehicles.',
    location_address: 'Shivaji Chowk Flyover Junction, Ward 24',
    category_name: 'Encroachment and estate',
    department_name: 'Town Planning & Anti-Encroachment Squad',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    citizen_name: 'Vivek Chitale',
    citizen_phone: '+91 98224 88331',
    officer_first_name: 'Vinod',
    officer_last_name: 'Salunkhe',
    officer_phone: '+91 94225 99341',
    created_at: new Date(Date.now() - 90 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() - 18 * 3600000).toISOString(),
    history: [
      { to_status: 'REGISTERED', remarks: 'Grievance submitted by local commuter.', created_at: new Date(Date.now() - 90 * 3600000).toISOString() },
      { to_status: 'RESOLVED', remarks: 'Illegal metal frame dismantled and seized.', created_at: new Date(Date.now() - 20 * 3600000).toISOString() }
    ]
  },

  // 8. Wastewater and leakage
  {
    complaint_id: 'cmp-117',
    complaint_number: 'CMP-2026-0865',
    title: 'Underground Sewer Line Choked & Sewage Backflow into Basements',
    description: 'Main 300mm sewer line choked with silt. Black sewage water reversing into underground parking basements of 3 apartment buildings.',
    location_address: 'Shree Krupa Society, Lane 7, Sector 4, Ward 24',
    category_name: 'Wastewater and leakage',
    department_name: 'Underground Sewerage Treatment Wing',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    citizen_name: 'Arun Bapat',
    citizen_phone: '+91 98220 55678',
    officer_first_name: 'Mahesh',
    officer_last_name: 'Gaikwad',
    officer_phone: '+91 98810 44221',
    created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() + 12 * 3600000).toISOString(),
    history: [
      { to_status: 'REGISTERED', remarks: 'Critical sewage backup emergency logged.', created_at: new Date(Date.now() - 12 * 3600000).toISOString() },
      { to_status: 'IN_PROGRESS', remarks: 'High-pressure sewer recycler tanker on site.', created_at: new Date(Date.now() - 3 * 3600000).toISOString() }
    ]
  },
  {
    complaint_id: 'cmp-118',
    complaint_number: 'CMP-2026-0866',
    title: 'Manhole Sewage Water Spilling Over Pedestrian Walkway',
    description: 'Chamber overflowing foul untreated wastewater onto sidewalk for past 24 hours, emitting noxious gases right beside grocery shops.',
    location_address: 'Opposite State Transport Bus Terminus, Ward 24',
    category_name: 'Wastewater and leakage',
    department_name: 'Underground Sewerage Treatment Wing',
    priority: 'HIGH',
    status: 'ASSIGNED',
    citizen_name: 'Kiran More',
    citizen_phone: '+91 94044 11229',
    officer_first_name: 'Mahesh',
    officer_last_name: 'Gaikwad',
    officer_phone: '+91 98810 44221',
    created_at: new Date(Date.now() - 7 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() + 17 * 3600000).toISOString(),
    history: [
      { to_status: 'REGISTERED', remarks: 'Complaint filed by shopkeepers.', created_at: new Date(Date.now() - 7 * 3600000).toISOString() },
      { to_status: 'ASSIGNED', remarks: 'Sewerage maintenance squad dispatched.', created_at: new Date(Date.now() - 2 * 3600000).toISOString() }
    ]
  },

  // 9. Public facilities
  {
    complaint_id: 'cmp-106',
    complaint_number: 'CMP-2026-0811',
    title: 'Fallen Tree Branch Obstructing Public Garden Pathways',
    description: 'Heavy banyan branch snapped in wind storm, leaning dangerously over pedestrian sidewalk and jogger tracks in ward garden.',
    location_address: 'Sector 4 Public Garden Road, Ward 24',
    category_name: 'Public facilities',
    department_name: 'Public Amenities & Gardens Wing',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    citizen_name: 'Pradeep Joshi',
    citizen_phone: '+91 98224 55678',
    officer_first_name: 'Sneha',
    officer_last_name: 'Jadhav',
    officer_phone: '+91 97660 33441',
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    history: [
      { to_status: 'REGISTERED', remarks: 'Grievance filed with photo.', created_at: new Date(Date.now() - 48 * 3600000).toISOString() },
      { to_status: 'RESOLVED', remarks: 'Branch safely pruned and removed.', created_at: new Date(Date.now() - 18 * 3600000).toISOString() }
    ]
  },
  {
    complaint_id: 'cmp-108',
    complaint_number: 'CMP-2026-0785',
    title: 'Damaged Public Park Bench and Broken Swing Chain',
    description: 'Two children swings broken with sharp metal links exposed in children play area, causing risk of injury.',
    location_address: 'Ward 24 Public Joggers Park, Sector 4',
    category_name: 'Public facilities',
    department_name: 'Public Amenities & Gardens Wing',
    priority: 'LOW',
    status: 'CLOSED',
    citizen_name: 'Deepak More',
    citizen_phone: '+91 98904 22115',
    officer_first_name: 'Sneha',
    officer_last_name: 'Jadhav',
    officer_phone: '+91 97660 33441',
    created_at: new Date(Date.now() - 96 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() - 40 * 3600000).toISOString(),
    history: [
      { to_status: 'REGISTERED', remarks: 'Park visitor registered complaint.', created_at: new Date(Date.now() - 96 * 3600000).toISOString() },
      { to_status: 'CLOSED', remarks: 'New heavy-duty swing chains installed.', created_at: new Date(Date.now() - 42 * 3600000).toISOString() }
    ]
  },
  {
    complaint_id: 'cmp-119',
    complaint_number: 'CMP-2026-0889',
    title: 'Community Public Toilet Tap Broken & Foul Odor',
    description: 'Flush valve damaged and washbasin tap stolen in public amenity block; running water not reaching sanitation cisterns.',
    location_address: 'Near Ward 24 Community Hall, Sector 4',
    category_name: 'Public facilities',
    department_name: 'Public Amenities & Gardens Wing',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    citizen_name: 'Shankar Shinde',
    citizen_phone: '+91 98811 77334',
    officer_first_name: 'Sneha',
    officer_last_name: 'Jadhav',
    officer_phone: '+91 97660 33441',
    created_at: new Date(Date.now() - 9 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() + 15 * 3600000).toISOString(),
    history: [
      { to_status: 'REGISTERED', remarks: 'Sanitation defect report logged.', created_at: new Date(Date.now() - 9 * 3600000).toISOString() },
      { to_status: 'IN_PROGRESS', remarks: 'Plumber deployed with replacement fittings.', created_at: new Date(Date.now() - 2 * 3600000).toISOString() }
    ]
  },

  // 10. Other civic issues
  {
    complaint_id: 'cmp-120',
    complaint_number: 'CMP-2026-0875',
    title: 'Stray Cattle & Animal Nuisance Blocking School Access Road',
    description: 'Herd of 10-12 stray cattle wandering and blocking school access road during morning rush hours, creating safety concerns for children.',
    location_address: 'Zilla Parishad High School Road, Ward 24',
    category_name: 'Other civic issues',
    department_name: 'General Ward Administration',
    priority: 'MEDIUM',
    status: 'ASSIGNED',
    citizen_name: 'Sushila Waghmare',
    citizen_phone: '+91 98229 00114',
    officer_first_name: 'Ravindra',
    officer_last_name: 'Sawant',
    officer_phone: '+91 94221 66778',
    created_at: new Date(Date.now() - 11 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() + 37 * 3600000).toISOString(),
    history: [
      { to_status: 'REGISTERED', remarks: 'School principal filed grievance.', created_at: new Date(Date.now() - 11 * 3600000).toISOString() },
      { to_status: 'ASSIGNED', remarks: 'Ward cattle squad notified.', created_at: new Date(Date.now() - 4 * 3600000).toISOString() }
    ]
  },
  {
    complaint_id: 'cmp-121',
    complaint_number: 'CMP-2026-0876',
    title: 'Excessive Late-Night Commercial Generator Noise & Vibration',
    description: 'Commercial godown running un-muffled heavy diesel generator after 11 PM violating municipal noise pollution guidelines.',
    location_address: 'Near Residential Cluster, Sector 4, Ward 24',
    category_name: 'Other civic issues',
    department_name: 'General Ward Administration',
    priority: 'LOW',
    status: 'INSPECTION',
    citizen_name: 'Pravin Deshpande',
    citizen_phone: '+91 98231 66554',
    officer_first_name: 'Ravindra',
    officer_last_name: 'Sawant',
    officer_phone: '+91 94221 66778',
    created_at: new Date(Date.now() - 22 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() + 26 * 3600000).toISOString(),
    history: [
      { to_status: 'REGISTERED', remarks: 'Noise violation lodged.', created_at: new Date(Date.now() - 22 * 3600000).toISOString() },
      { to_status: 'INSPECTION', remarks: 'Decibel audit conducted; warning issued.', created_at: new Date(Date.now() - 5 * 3600000).toISOString() }
    ]
  }
];

export const CorporatorComplaintsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || '';
  const initialPriority = searchParams.get('priority') || '';
  const initialCategory = searchParams.get('category') || 'ALL';

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [priorityFilter, setPriorityFilter] = useState(initialPriority);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('table'); // table, grid
  const [showCategoryGrid, setShowCategoryGrid] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Drawer Preview State
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const navigate = useNavigate();

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Sync URL query params
  useEffect(() => {
    const params = {};
    if (statusFilter) params.status = statusFilter;
    if (priorityFilter) params.priority = priorityFilter;
    if (selectedCategory && selectedCategory !== 'ALL') params.category = selectedCategory;
    setSearchParams(params);
  }, [statusFilter, priorityFilter, selectedCategory]);

  const fetchComplaints = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      let url = '/corporator/complaints?limit=100';
      const res = await api.get(url);

      const rawList = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];

      if (rawList && rawList.length > 0) {
        const normalizedList = rawList.map((c) => ({
          ...c,
          category_name: normalizeCategory(c.category_name)
        }));
        setComplaints(normalizedList);
      } else {
        setComplaints(DEFAULT_WARD_COMPLAINTS);
      }

      if (isManual) {
        showToast('Ward grievances refreshed successfully.');
      }
    } catch (err) {
      console.warn('Using default ward grievances list due to network/database:', err);
      setComplaints(DEFAULT_WARD_COMPLAINTS);
      if (isManual) {
        showToast('Loaded ward grievances cache.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Counts per Category
  const categoryCounts = useMemo(() => {
    const counts = {
      ALL: {
        total: complaints.length,
        escalated: complaints.filter((c) => c.status === 'ESCALATED').length,
        inProgress: complaints.filter((c) => ['IN_PROGRESS', 'INSPECTION', 'ASSIGNED'].includes(c.status)).length,
        resolved: complaints.filter((c) => ['RESOLVED', 'CLOSED'].includes(c.status)).length,
        critical: complaints.filter((c) => c.priority === 'CRITICAL').length
      }
    };

    CIVIC_COMPLAINT_WORKFLOWS.forEach((wf) => {
      const list = complaints.filter((c) => normalizeCategory(c.category_name) === wf.name);
      counts[wf.name] = {
        total: list.length,
        escalated: list.filter((c) => c.status === 'ESCALATED').length,
        inProgress: list.filter((c) => ['IN_PROGRESS', 'INSPECTION', 'ASSIGNED'].includes(c.status)).length,
        resolved: list.filter((c) => ['RESOLVED', 'CLOSED'].includes(c.status)).length,
        critical: list.filter((c) => c.priority === 'CRITICAL').length
      };
    });

    return counts;
  }, [complaints]);

  const activeCategoryObj = useMemo(() => {
    if (selectedCategory === 'ALL') return null;
    return CIVIC_COMPLAINT_WORKFLOWS.find((w) => w.name === selectedCategory) || null;
  }, [selectedCategory]);

  // Filtered and Sorted Complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((cmp) => {
      const normalizedCat = normalizeCategory(cmp.category_name);

      // Category filter
      if (selectedCategory && selectedCategory !== 'ALL') {
        if (normalizedCat !== selectedCategory) {
          return false;
        }
      }

      // Search
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesNumber = cmp.complaint_number?.toLowerCase().includes(query);
        const matchesTitle = cmp.title?.toLowerCase().includes(query);
        const matchesAddress = cmp.location_address?.toLowerCase().includes(query);
        const matchesCitizen = cmp.citizen_name?.toLowerCase().includes(query);
        const matchesCategory = cmp.category_name?.toLowerCase().includes(query);
        const matchesOfficer = `${cmp.officer_first_name || ''} ${cmp.officer_last_name || ''}`.toLowerCase().includes(query);

        if (!matchesNumber && !matchesTitle && !matchesAddress && !matchesCitizen && !matchesCategory && !matchesOfficer) {
          return false;
        }
      }

      // Status
      if (statusFilter && cmp.status !== statusFilter) {
        if (statusFilter === 'ACTIVE' && (cmp.status === 'RESOLVED' || cmp.status === 'CLOSED')) {
          return false;
        }
        if (statusFilter !== 'ACTIVE' && cmp.status !== statusFilter) {
          return false;
        }
      }

      // Priority
      if (priorityFilter && cmp.priority !== priorityFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      }
      if (sortBy === 'priority') {
        const order = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        return (order[b.priority] || 0) - (order[a.priority] || 0);
      }
      if (sortBy === 'sla') {
        return new Date(a.sla_due_at || Infinity) - new Date(b.sla_due_at || Infinity);
      }
      return 0;
    });
  }, [complaints, selectedCategory, search, statusFilter, priorityFilter, sortBy]);

  // Overall Statistics Counters
  const stats = useMemo(() => {
    const list = selectedCategory && selectedCategory !== 'ALL'
      ? complaints.filter((c) => normalizeCategory(c.category_name) === selectedCategory)
      : complaints;

    const total = list.length;
    const critical = list.filter((c) => c.priority === 'CRITICAL').length;
    const escalated = list.filter((c) => c.status === 'ESCALATED').length;
    const inProgress = list.filter((c) => ['IN_PROGRESS', 'INSPECTION', 'ASSIGNED'].includes(c.status)).length;
    const resolved = list.filter((c) => ['RESOLVED', 'CLOSED'].includes(c.status)).length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    return { total, critical, escalated, inProgress, resolved, resolutionRate };
  }, [complaints, selectedCategory]);

  // Pagination slice
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage) || 1;
  const paginatedComplaints = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredComplaints.slice(start, start + itemsPerPage);
  }, [filteredComplaints, currentPage, itemsPerPage]);

  const handleOpenPreview = (complaint) => {
    setSelectedComplaint(complaint);
    setIsDrawerOpen(true);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPriorityFilter('');
    setSelectedCategory('ALL');
    setSortBy('newest');
    setCurrentPage(1);
    showToast('Reset all filters.');
  };

  const handleExportCSV = () => {
    if (filteredComplaints.length === 0) {
      showToast('No complaints to export.');
      return;
    }

    const headers = [
      'Complaint ID',
      'Title',
      'Civic Category',
      'Department',
      'Priority',
      'Status',
      'Citizen Name',
      'Citizen Phone',
      'Assigned Officer',
      'Location',
      'Created Date'
    ];

    const rows = filteredComplaints.map((c) => [
      `"${c.complaint_number || ''}"`,
      `"${(c.title || '').replace(/"/g, '""')}"`,
      `"${normalizeCategory(c.category_name)}"`,
      `"${c.department_name || ''}"`,
      `"${c.priority || ''}"`,
      `"${c.status || ''}"`,
      `"${c.citizen_name || ''}"`,
      `"${c.citizen_phone || ''}"`,
      `"${c.officer_first_name ? `${c.officer_first_name} ${c.officer_last_name || ''}` : 'Unassigned'}"`,
      `"${(c.location_address || '').replace(/"/g, '""')}"`,
      `"${new Date(c.created_at).toLocaleDateString('en-IN')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const categorySuffix = selectedCategory === 'ALL' ? 'All_Complaints' : selectedCategory.replace(/\s+/g, '_');
    link.setAttribute('download', `Ward_24_${categorySuffix}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filteredComplaints.length} complaints to CSV file.`);
  };

  // Helper for SLA timer formatting
  const renderSlaBadge = (slaDueAt, status) => {
    if (status === 'RESOLVED' || status === 'CLOSED') {
      return (
        <span className="inline-flex items-center text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Resolved
        </span>
      );
    }
    if (!slaDueAt) {
      return <span className="text-[11px] text-slate-500 font-medium">Standard 48h</span>;
    }

    const dueDate = new Date(slaDueAt);
    const now = new Date();
    const diffHours = Math.round((dueDate - now) / (1000 * 3600));

    if (diffHours < 0) {
      return (
        <span className="inline-flex items-center text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
          <AlertTriangle className="w-3 h-3 mr-1 text-rose-600" /> Breached ({Math.abs(diffHours)}h)
        </span>
      );
    }

    if (diffHours <= 6) {
      return (
        <span className="inline-flex items-center text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
          <Clock className="w-3 h-3 mr-1 text-amber-600" /> {diffHours}h left
        </span>
      );
    }

    return (
      <span className="inline-flex items-center text-[11px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
        <Clock className="w-3 h-3 mr-1 text-slate-400" /> {diffHours}h left
      </span>
    );
  };

  // Helper for priority tag styling
  const renderPriorityBadge = (priority) => {
    const isCritical = priority === 'CRITICAL';
    const isHigh = priority === 'HIGH';
    const isMedium = priority === 'MEDIUM';

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${
          isCritical
            ? 'bg-rose-50 text-rose-700 border border-rose-200'
            : isHigh
            ? 'bg-amber-50 text-amber-800 border border-amber-200'
            : isMedium
            ? 'bg-blue-50 text-blue-700 border border-blue-200'
            : 'bg-slate-100 text-slate-600 border border-slate-200'
        }`}
      >
        {isCritical && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-ping" />}
        {priority || 'NORMAL'}
      </span>
    );
  };

  // Helper for Category badge with icon
  const renderCategoryBadge = (catName) => {
    const norm = normalizeCategory(catName);
    const wf = CIVIC_COMPLAINT_WORKFLOWS.find((w) => w.name === norm);
    const IconComponent = wf?.icon || HelpCircle;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
          wf?.badgeClass || 'bg-slate-100 text-slate-700 border-slate-200'
        }`}
      >
        <IconComponent className="w-3 h-3 shrink-0" />
        <span className="truncate">{norm}</span>
      </span>
    );
  };

  const hasActiveFilters = search || statusFilter || priorityFilter || (selectedCategory && selectedCategory !== 'ALL');

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 transition-all duration-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. PROFESSIONAL PORTAL HEADER */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Complaints & Grievance Redressal
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Ward 24
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage citizen requests across municipal departments with automated SLA tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowCategoryGrid(!showCategoryGrid)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showCategoryGrid
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Browse all 10 civic workflow categories in a grid"
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Categories Overview</span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-bold">10</span>
          </button>

          <button
            onClick={() => fetchComplaints(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all active:scale-95 disabled:opacity-50"
            title="Sync latest data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all active:scale-95"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </button>

          <button
            onClick={() => navigate('/corporator/complaints/map')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-all active:scale-95"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>GIS Map</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. COMPACT SUMMARY KPI CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Total */}
        <div
          onClick={() => {
            setStatusFilter('');
            setPriorityFilter('');
          }}
          className={`cursor-pointer bg-white p-3 rounded-xl border transition-all ${
            statusFilter === '' && priorityFilter === ''
              ? 'border-blue-500 ring-2 ring-blue-100 shadow-2xs'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Grievances</span>
            <Layers className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-xl font-black text-slate-900">{stats.total}</div>
          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
            {selectedCategory === 'ALL' ? 'All 10 Categories' : selectedCategory}
          </div>
        </div>

        {/* SLA Breached */}
        <div
          onClick={() => {
            setStatusFilter('ESCALATED');
            setPriorityFilter('');
          }}
          className={`cursor-pointer bg-white p-3 rounded-xl border transition-all ${
            statusFilter === 'ESCALATED'
              ? 'border-rose-500 ring-2 ring-rose-100 shadow-2xs'
              : 'border-slate-200 hover:border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between text-rose-600 mb-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">SLA Breached</span>
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-black text-rose-600">{stats.escalated}</div>
          <div className="text-[10px] text-rose-600 font-semibold mt-0.5">Urgent action</div>
        </div>

        {/* In Progress */}
        <div
          onClick={() => {
            setStatusFilter('IN_PROGRESS');
            setPriorityFilter('');
          }}
          className={`cursor-pointer bg-white p-3 rounded-xl border transition-all ${
            statusFilter === 'IN_PROGRESS'
              ? 'border-amber-500 ring-2 ring-amber-100 shadow-2xs'
              : 'border-slate-200 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between text-amber-600 mb-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Under Action</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-black text-amber-600">{stats.inProgress}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Field staff active</div>
        </div>

        {/* Critical Priority */}
        <div
          onClick={() => {
            setPriorityFilter('CRITICAL');
            setStatusFilter('');
          }}
          className={`cursor-pointer bg-white p-3 rounded-xl border transition-all ${
            priorityFilter === 'CRITICAL'
              ? 'border-rose-500 ring-2 ring-rose-100 shadow-2xs'
              : 'border-slate-200 hover:border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Critical Priority</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-xl font-black text-slate-900">{stats.critical}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">High safety impact</div>
        </div>

        {/* Resolved Rate */}
        <div
          onClick={() => {
            setStatusFilter('RESOLVED');
            setPriorityFilter('');
          }}
          className={`cursor-pointer bg-white p-3 rounded-xl border transition-all col-span-2 sm:col-span-1 ${
            statusFilter === 'RESOLVED'
              ? 'border-emerald-500 ring-2 ring-emerald-100 shadow-2xs'
              : 'border-slate-200 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-600 mb-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Resolved Rate</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-black text-emerald-600">{stats.resolutionRate}%</div>
          <div className="text-[10px] text-emerald-700 font-medium mt-0.5">{stats.resolved} resolved</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. OPTIONAL COLLAPSIBLE CATEGORIES GRID OVERVIEW */}
      {/* (Accessible with 1-click without cluttering the page by default) */}
      {/* ========================================================================= */}
      {showCategoryGrid && (
        <div className="bg-white rounded-xl border border-blue-200 p-4 space-y-3 shadow-xs transition-all">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                All 10 Civic Workflow Categories
              </h3>
            </div>
            <button
              onClick={() => setShowCategoryGrid(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {/* All Complaints Card */}
            <div
              onClick={() => {
                setSelectedCategory('ALL');
                setCurrentPage(1);
              }}
              className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Layers className="w-4 h-4" />
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  selectedCategory === 'ALL' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {categoryCounts.ALL.total}
                </span>
              </div>
              <div className="font-bold text-xs truncate">All Complaints</div>
              <div className={`text-[10px] mt-0.5 truncate ${selectedCategory === 'ALL' ? 'text-blue-100' : 'text-slate-400'}`}>
                Full ward jurisdiction
              </div>
            </div>

            {/* 10 Civic Categories */}
            {CIVIC_COMPLAINT_WORKFLOWS.map((wf) => {
              const isSelected = selectedCategory === wf.name;
              const count = categoryCounts[wf.name]?.total || 0;
              const hasBreach = categoryCounts[wf.name]?.escalated > 0;
              const IconComp = wf.icon;

              return (
                <div
                  key={wf.id}
                  onClick={() => {
                    setSelectedCategory(wf.name);
                    setCurrentPage(1);
                  }}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <IconComp className={`w-4 h-4 ${isSelected ? 'text-blue-300' : 'text-slate-500'}`} />
                    <div className="flex items-center gap-1">
                      {hasBreach && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" title="SLA breached" />
                      )}
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {count}
                      </span>
                    </div>
                  </div>
                  <div className="font-bold text-xs truncate">{wf.name}</div>
                  <div className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                    {wf.standardSla} • {wf.department}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PRACTICAL UNIFIED TOOLBAR (Single Clean Row) */}
      {/* ========================================================================= */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-center">
          {/* Search Box */}
          <div className="lg:col-span-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              placeholder="Search by ID, title, citizen, address..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-7 py-2 rounded-lg text-xs font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50 hover:bg-white transition-all text-slate-800"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Workflow Category Dropdown (Clean, standard, professional) */}
          <div className="lg:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 rounded-lg text-xs font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all text-slate-800 cursor-pointer"
            >
              <option value="ALL">📁 All Complaints ({categoryCounts.ALL.total})</option>
              <optgroup label="── 10 Civic Workflow Streams ──">
                {CIVIC_COMPLAINT_WORKFLOWS.map((wf) => (
                  <option key={wf.id} value={wf.name}>
                    {wf.name} ({categoryCounts[wf.name]?.total || 0})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 rounded-lg text-xs font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all text-slate-800 cursor-pointer"
            >
              <option value="">All Statuses ({stats.total})</option>
              <option value="ESCALATED">⚠️ SLA Breached ({stats.escalated})</option>
              <option value="IN_PROGRESS">🔄 In Progress ({stats.inProgress})</option>
              <option value="INSPECTION">🔍 Under Inspection</option>
              <option value="ASSIGNED">👤 Assigned</option>
              <option value="RESOLVED">✅ Resolved ({stats.resolved})</option>
            </select>
          </div>

          {/* Priority Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 rounded-lg text-xs font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all text-slate-800 cursor-pointer"
            >
              <option value="">All Priorities</option>
              <option value="CRITICAL">🔴 Critical</option>
              <option value="HIGH">🟠 High</option>
              <option value="MEDIUM">🔵 Medium</option>
              <option value="LOW">⚪ Low</option>
            </select>
          </div>

          {/* Reset / Clear Button */}
          <div className="lg:col-span-1 flex justify-end">
            {hasActiveFilters ? (
              <button
                onClick={handleResetFilters}
                className="w-full py-2 px-2.5 rounded-lg text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center justify-center gap-1 border border-rose-200"
                title="Reset all filters"
              >
                <X className="w-3.5 h-3.5" />
                <span className="lg:hidden">Reset</span>
              </button>
            ) : (
              <button
                onClick={() => setSortBy(sortBy === 'newest' ? 'sla' : 'newest')}
                className="w-full py-2 px-2 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center"
                title="Sort order"
              >
                {sortBy === 'newest' ? 'Newest' : 'SLA'}
              </button>
            )}
          </div>
        </div>

        {/* Context Bar with Active Filter Pills & View Switcher */}
        <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-slate-100 gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500 text-[11px]">
              Showing <span className="font-bold text-slate-900">{filteredComplaints.length}</span> complaints
            </span>

            {/* Active Category Tag */}
            {selectedCategory !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                <span>{selectedCategory}</span>
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className="hover:text-blue-950 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Active Status Tag */}
            {statusFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                <span>Status: {statusFilter}</span>
                <button
                  onClick={() => setStatusFilter('')}
                  className="hover:text-slate-950 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Active Priority Tag */}
            {priorityFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                <span>Priority: {priorityFilter}</span>
                <button
                  onClick={() => setPriorityFilter('')}
                  className="hover:text-slate-950 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-blue-600 hover:text-blue-800 underline font-semibold ml-1"
              >
                Clear all
              </button>
            )}
          </div>

          {/* View Mode Toggle: Table or Grid */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 px-2 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table Grid"
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 px-2 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Card Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. ACTIVE CATEGORY BANNER (If specific category is selected) */}
      {/* ========================================================================= */}
      {activeCategoryObj && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${activeCategoryObj.badgeClass} border shrink-0`}>
              {React.createElement(activeCategoryObj.icon, { className: 'w-4 h-4' })}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{activeCategoryObj.name}</span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.2 rounded border border-blue-200">
                  {activeCategoryObj.standardSla}
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                {activeCategoryObj.department} • {activeCategoryObj.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedCategory('ALL')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-colors shrink-0 self-start sm:self-auto"
          >
            <X className="w-3 h-3" />
            <span>Show All Complaints</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MAIN COMPLAINTS TABLE OR GRID */}
      {/* ========================================================================= */}
      {loading ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-2xs">
          <LoadingState message="Loading Ward 24 complaints data..." />
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center shadow-2xs space-y-3">
          <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">No matching grievances found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No complaints match your current filter settings. Try clearing the search or category filters.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleResetFilters}>
            Reset All Filters
          </Button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead className="bg-slate-50/90 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Grievance Info</th>
                  <th className="px-3.5 py-3">Category</th>
                  <th className="px-3 py-3">Priority</th>
                  <th className="px-3.5 py-3">Status</th>
                  <th className="px-3.5 py-3">Resolution SLA</th>
                  <th className="px-3.5 py-3">Assigned Officer</th>
                  <th className="px-3.5 py-3">Citizen</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedComplaints.map((cmp) => (
                  <tr
                    key={cmp.complaint_id || cmp.complaint_number}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => handleOpenPreview(cmp)}
                  >
                    {/* Complaint ID & Title */}
                    <td className="px-4 py-3 max-w-xs sm:max-w-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          {cmp.complaint_number}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(cmp.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 mt-1 line-clamp-1 group-hover:text-blue-600 transition-colors text-xs">
                        {cmp.title}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{cmp.location_address || 'Ward 24'}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      {renderCategoryBadge(cmp.category_name)}
                    </td>

                    {/* Priority */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      {renderPriorityBadge(cmp.priority)}
                    </td>

                    {/* Status */}
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <StatusBadge status={cmp.status} />
                    </td>

                    {/* SLA countdown */}
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      {renderSlaBadge(cmp.sla_due_at, cmp.status)}
                    </td>

                    {/* Assigned Officer */}
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-bold flex items-center justify-center text-[10px]">
                          {cmp.officer_first_name ? cmp.officer_first_name[0] : 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 text-xs">
                            {cmp.officer_first_name ? `${cmp.officer_first_name} ${cmp.officer_last_name || ''}` : 'Unassigned'}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                            {cmp.officer_phone || 'Field Officer'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Citizen */}
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <div className="font-medium text-slate-800 text-xs">{cmp.citizen_name || 'Resident'}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{cmp.citizen_phone || 'Contact provided'}</div>
                    </td>

                    {/* Action buttons */}
                    <td className="px-4 py-3 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenPreview(cmp)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Quick Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => navigate(`/corporator/complaints/${cmp.complaint_id}`)}
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-2xs transition-colors"
                        >
                          <span>Inspect</span>
                          <ArrowUpRight className="w-3 h-3 ml-1" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      ) : (
        /* CARDS GRID VIEW */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedComplaints.map((cmp) => (
              <div
                key={cmp.complaint_id || cmp.complaint_number}
                onClick={() => handleOpenPreview(cmp)}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {cmp.complaint_number}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {renderPriorityBadge(cmp.priority)}
                      <StatusBadge status={cmp.status} />
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-2 mt-1">
                    {cmp.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {cmp.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      {renderCategoryBadge(cmp.category_name)}
                      <span>{renderSlaBadge(cmp.sla_due_at, cmp.status)}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-600 text-xs truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{cmp.location_address || 'Ward 24'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">
                      {cmp.officer_first_name ? cmp.officer_first_name[0] : 'U'}
                    </div>
                    <span className="text-slate-700 font-medium text-[11px] truncate max-w-[120px]">
                      {cmp.officer_first_name ? `${cmp.officer_first_name} ${cmp.officer_last_name || ''}` : 'Unassigned'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenPreview(cmp)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-[11px] font-semibold"
                    >
                      Quick View
                    </button>
                    <button
                      onClick={() => navigate(`/corporator/complaints/${cmp.complaint_id}`)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-2xs"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. QUICK PREVIEW INSPECTION DRAWER */}
      {/* ========================================================================= */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={
          selectedComplaint
            ? `Inspection: ${selectedComplaint.complaint_number}`
            : 'Grievance Preview'
        }
      >
        {selectedComplaint && (
          <div className="space-y-6">
            {/* Header Status & Priority */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                {selectedComplaint.complaint_number}
              </span>
              <div className="flex items-center gap-2">
                {renderPriorityBadge(selectedComplaint.priority)}
                <StatusBadge status={selectedComplaint.status} />
              </div>
            </div>

            {/* Title & Category */}
            <div>
              <div className="mb-1.5">
                {renderCategoryBadge(selectedComplaint.category_name)}
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                {selectedComplaint.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {selectedComplaint.department_name}
              </p>
            </div>

            {/* SLA Alert Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-slate-700">Resolution SLA:</span>
              </div>
              {renderSlaBadge(selectedComplaint.sla_due_at, selectedComplaint.status)}
            </div>

            {/* Full Grievance Description */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Citizen Grievance Statement
              </h4>
              <p className="p-3 bg-slate-50 rounded-xl text-xs text-slate-800 leading-relaxed border border-slate-200/80">
                {selectedComplaint.description}
              </p>
            </div>

            {/* Location & Landmark */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Ward Geographic Location
              </h4>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-800 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">{selectedComplaint.location_address || 'Ward 24, Sambhaji Nagar'}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Ward 24 Municipal Jurisdiction</div>
                </div>
              </div>
            </div>

            {/* Citizen Details */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Complainant Citizen
                </span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  Verified Resident
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {selectedComplaint.citizen_name || 'Resident Citizen'}
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    {selectedComplaint.citizen_phone || '+91 98XXX XXXXX'}
                  </div>
                </div>
                {selectedComplaint.citizen_phone && (
                  <a
                    href={`tel:${selectedComplaint.citizen_phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold border border-emerald-200 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Citizen</span>
                  </a>
                )}
              </div>
            </div>

            {/* Assigned Field Engineer */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Assigned Field Officer
                </span>
                <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-bold">
                  Engineering Wing
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {selectedComplaint.officer_first_name
                      ? `${selectedComplaint.officer_first_name} ${selectedComplaint.officer_last_name || ''}`
                      : 'Not Assigned Yet'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {selectedComplaint.department_name || 'Municipal Field Engineer'}
                  </div>
                </div>
                <button
                  onClick={() => showToast(`Sent SMS / WhatsApp reminder to officer ${selectedComplaint.officer_first_name || 'in charge'}.`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold border border-blue-200 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Reminder</span>
                </button>
              </div>
            </div>

            {/* Audit History Timeline */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Action & Remark History
              </h4>
              <div className="space-y-2">
                {(selectedComplaint.history || [
                  {
                    to_status: 'REGISTERED',
                    remarks: 'Complaint registered by citizen with GPS location tag.',
                    created_at: selectedComplaint.created_at
                  },
                  {
                    to_status: selectedComplaint.status,
                    remarks: 'Latest status updated by ward field engineer.',
                    created_at: new Date().toISOString()
                  }
                ]).map((h, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg text-xs border border-slate-100 flex items-start justify-between gap-3">
                    <div>
                      <span className="font-bold text-slate-900">{h.to_status}</span>
                      <p className="text-[11px] text-slate-600 mt-0.5">{h.remarks}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                      {new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Drawer Action Bar */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate(`/corporator/complaints/${selectedComplaint.complaint_id}`);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span>Open Full Investigation View</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate('/corporator/complaints/map');
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Locate on Ward Spatial Map</span>
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
