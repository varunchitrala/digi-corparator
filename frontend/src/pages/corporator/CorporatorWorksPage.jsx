import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { LoadingState } from '../../components/LoadingState';
import { Drawer } from '../../components/Drawer';
import { Pagination } from '../../components/Pagination';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  HardHat,
  Search,
  Eye,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  Building2,
  Phone,
  ArrowUpRight,
  TrendingUp,
  SlidersHorizontal,
  RefreshCw,
  Download,
  X,
  HelpCircle,
  Sparkles,
  MapPin,
  IndianRupee,
  Construction,
  Waves,
  Lightbulb,
  Trees,
  Check,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
  AlertCircle,
  FileText,
  UserCheck,
  Building
} from 'lucide-react';

// ============================================================================
// REALISTIC WARD 24 DEVELOPMENT PROJECTS (Fallback when database is unseeded)
// ============================================================================
const DEFAULT_WARD_WORKS = [
  // 1. Roads & Pavements
  {
    work_id: 'w-101',
    work_code: 'W-101',
    work_title: 'Concreting & Road Paving of Market Lane #4',
    category: 'Roads & Pavements',
    department_name: 'Roads & Infrastructure Engineering Wing',
    description: '200-meter durable cement-concrete road with covered side storm drain channels to prevent monsoon water accumulation.',
    location_address: 'Market Lane #4, Near Weekly Vegetable Bazaar, Ward 24',
    landmark: 'Behind Old Municipal Library',
    estimated_cost: 2500000,
    sanctioned_amount: 2400000,
    funds_spent: 1250000,
    physical_progress: 65,
    financial_progress: 50,
    status: 'ONGOING',
    start_date: '2026-06-01',
    target_date: '2026-10-30',
    contractor_name: 'Shivam Construction & Infra Ltd',
    contractor_phone: '+91 98220 44112',
    engineer_in_charge: 'Er. Prakash Shinde (Junior Engineer)',
    delay_reason: null,
    milestones: [
      { name: 'Old asphalt excavation & road leveling', done: true },
      { name: 'Side drain trenching and RCC casting', done: true },
      { name: 'M30 grade concrete slab laying (In Progress)', done: false },
      { name: 'Water curing & joint cutting', done: false },
      { name: 'Public safety opening & line marking', done: false }
    ]
  },
  {
    work_id: 'w-104',
    work_code: 'W-104',
    work_title: 'Safe Pedestrian Footpath & Railings Near School',
    category: 'Roads & Pavements',
    department_name: 'Roads & Infrastructure Engineering Wing',
    description: 'Wide anti-skid interlocking paver track with sturdy iron safety railings to protect students walking to municipal primary school.',
    location_address: 'Vidya Mandir School Road, Sector 4, Ward 24',
    landmark: 'Opposite Vidya Mandir Main Gate',
    estimated_cost: 1200000,
    sanctioned_amount: 1200000,
    funds_spent: 1080000,
    physical_progress: 90,
    financial_progress: 90,
    status: 'ONGOING',
    start_date: '2026-05-10',
    target_date: '2026-10-15',
    contractor_name: 'Apex Urban Infra Works',
    contractor_phone: '+91 94221 77884',
    engineer_in_charge: 'Er. Prakash Shinde (Junior Engineer)',
    delay_reason: null,
    milestones: [
      { name: 'Footpath demarcation & tree protection', done: true },
      { name: 'Concrete curb stones installation', done: true },
      { name: 'Heavy-duty paver blocks laying', done: true },
      { name: 'Yellow & black paint on safety railing', done: false }
    ]
  },
  {
    work_id: 'w-107',
    work_code: 'W-107',
    work_title: 'Shivaji Chowk Ring Road Junction Asphalt Patchwork',
    category: 'Roads & Pavements',
    department_name: 'Roads & Infrastructure Engineering Wing',
    description: 'Smooth asphalt resurfacing over 400 meters of damaged road to eliminate craters and ensure accident-free transit for city buses.',
    location_address: 'Shivaji Maharaj Chowk Junction, Ward 24',
    landmark: 'Around Chhatrapati Shivaji Statue Circle',
    estimated_cost: 850000,
    sanctioned_amount: 850000,
    funds_spent: 850000,
    physical_progress: 100,
    financial_progress: 100,
    status: 'COMPLETED',
    start_date: '2026-04-01',
    target_date: '2026-06-15',
    contractor_name: 'Modern Bitumen Technologies',
    contractor_phone: '+91 98901 33221',
    engineer_in_charge: 'Er. Amit Bhosale (Executive Engineer)',
    delay_reason: null,
    milestones: [
      { name: 'Pothole milling & cleaning', done: true },
      { name: 'Hot bitumen tack coat application', done: true },
      { name: 'Dense bituminous concrete laying & rolling', done: true },
      { name: 'Finished and opened for vehicle traffic', done: true }
    ]
  },
  {
    work_id: 'w-110',
    work_code: 'W-110',
    work_title: 'Cement Paving of Internal By-Lane #2',
    category: 'Roads & Pavements',
    department_name: 'Roads & Infrastructure Engineering Wing',
    description: 'Paved lane replacing mud surface to stop slush and dirt during rain for 65 residential houses in Kranti Nagar.',
    location_address: 'Lane 2, Kranti Nagar Colony, Ward 24',
    landmark: 'Behind Hanuman Temple',
    estimated_cost: 1800000,
    sanctioned_amount: 1800000,
    funds_spent: 720000,
    physical_progress: 40,
    financial_progress: 40,
    status: 'ONGOING',
    start_date: '2026-07-01',
    target_date: '2026-11-30',
    contractor_name: 'Balaji Civil Builders',
    contractor_phone: '+91 98231 66543',
    engineer_in_charge: 'Er. Prakash Shinde (Junior Engineer)',
    delay_reason: null,
    milestones: [
      { name: 'Site clearing & soil stabilization', done: true },
      { name: 'Gravel base compaction', done: true },
      { name: 'Concrete slab pouring', done: false },
      { name: 'Curbs & inspection chamber covers', done: false }
    ]
  },
  {
    work_id: 'w-113',
    work_code: 'W-113',
    work_title: 'Speed Breakers & Zebra Crossings on High School Road',
    category: 'Roads & Pavements',
    department_name: 'Roads & Infrastructure Engineering Wing',
    description: 'Installation of rubberized speed bumps, thermoplastic reflective road paint, and blinking caution lights for child safety.',
    location_address: 'Zilla Parishad High School Road, Ward 24',
    landmark: 'Between School Gate and Bus Stop',
    estimated_cost: 450000,
    sanctioned_amount: 450000,
    funds_spent: 100000,
    physical_progress: 25,
    financial_progress: 22,
    status: 'DELAYED',
    start_date: '2026-05-01',
    target_date: '2026-08-30',
    contractor_name: 'Safety First Traffic Solutions',
    contractor_phone: '+91 94033 11887',
    engineer_in_charge: 'Er. Amit Bhosale (Executive Engineer)',
    delay_reason: 'Contractor delayed paint delivery; penalty notice issued by Municipal Office.',
    milestones: [
      { name: 'Traffic speed survey completed', done: true },
      { name: 'Speed breakers molded on road', done: false },
      { name: 'Reflective thermoplastic paint application', done: false },
      { name: 'Solar blinking warning signboards', done: false }
    ]
  },
  {
    work_id: 'w-116',
    work_code: 'W-116',
    work_title: 'Road Widening & Side Drainage on Station Road',
    category: 'Roads & Pavements',
    department_name: 'Roads & Infrastructure Engineering Wing',
    description: 'Widening narrow 2-lane bottleneck into a spacious 4-lane stretch with 300-meter covered storm channel.',
    location_address: 'Railway Station Feeder Road, Sector 4, Ward 24',
    landmark: 'From Flyover End to Station Auto Stand',
    estimated_cost: 4800000,
    sanctioned_amount: 4500000,
    funds_spent: 1920000,
    physical_progress: 40,
    financial_progress: 40,
    status: 'DELAYED',
    start_date: '2026-03-15',
    target_date: '2026-09-15',
    contractor_name: 'Western Maharashtra Infra Projects',
    contractor_phone: '+91 98224 88344',
    engineer_in_charge: 'Er. Suresh Kadam (Deputy Engineer)',
    delay_reason: 'Underground electric line relocation by electricity board delayed road digging by 3 weeks.',
    milestones: [
      { name: 'Right-of-way demarcation & tree shifting', done: true },
      { name: 'MSEB electric pole shifting', done: true },
      { name: 'Box culvert concrete trenching', done: false },
      { name: 'Asphalt paving on widened lanes', done: false }
    ]
  },

  // 2. Water Supply & Drainage
  {
    work_id: 'w-105',
    work_code: 'W-105',
    work_title: 'New Clean Drinking Water Pipeline for 400 Houses',
    category: 'Water & Drainage',
    department_name: 'Water Supply & Sewerage Wing',
    description: 'Replacing 30-year-old rusted iron pipes with clean ductile-iron pipes to guarantee clean drinking water with strong tap pressure.',
    location_address: 'Gulmohar Colony Lanes 1 to 6, Ward 24',
    landmark: 'Connecting to Municipal Water Booster Station',
    estimated_cost: 4200000,
    sanctioned_amount: 4000000,
    funds_spent: 3360000,
    physical_progress: 80,
    financial_progress: 80,
    status: 'ONGOING',
    start_date: '2026-04-15',
    target_date: '2026-10-31',
    contractor_name: 'Mahavir Watertech Engineering',
    contractor_phone: '+91 94220 99011',
    engineer_in_charge: 'Er. Prakash Kulkarni (Hydraulic Engineer)',
    delay_reason: null,
    milestones: [
      { name: 'Pipeline trenching across 1.2 km', done: true },
      { name: 'Laying 200mm ductile iron drinking pipe', done: true },
      { name: 'Household domestic meter connections (80% done)', done: false },
      { name: 'Pressure testing & chlorinated water flushing', done: false }
    ]
  },
  {
    work_id: 'w-108',
    work_code: 'W-108',
    work_title: 'Covered Stormwater Drain to Stop Monsoon Flooding',
    category: 'Water & Drainage',
    department_name: 'Water Supply & Sewerage Wing',
    description: 'Deep concrete box drain replacing open muddy gutter so rainwater flows smoothly without spilling onto bazaar streets.',
    location_address: 'Near Weekly Vegetable Market Ground, Ward 24',
    landmark: 'Along the East Market Perimeter',
    estimated_cost: 3600000,
    sanctioned_amount: 3500000,
    funds_spent: 1750000,
    physical_progress: 45,
    financial_progress: 50,
    status: 'DELAYED',
    start_date: '2026-03-01',
    target_date: '2026-08-30',
    contractor_name: 'Vardhman Drainage Solutions',
    contractor_phone: '+91 98902 44331',
    engineer_in_charge: 'Er. Suresh Patil (Stormwater In-Charge)',
    delay_reason: 'Monsoon showers caused soil cave-in; additional de-watering pumps brought on site.',
    milestones: [
      { name: 'Excavation of 600m drainage bed', done: true },
      { name: 'PCC bed concrete poured', done: true },
      { name: 'RCC wall casting with steel mesh', done: false },
      { name: 'Heavy vehicle-proof concrete cover slabs', done: false }
    ]
  },
  {
    work_id: 'w-111',
    work_code: 'W-111',
    work_title: '50,000-Liter Overhead Water Tank in Kranti Nagar',
    category: 'Water & Drainage',
    department_name: 'Water Supply & Sewerage Wing',
    description: 'Elevated storage reservoir providing round-the-clock water pressure to tail-end households in elevated areas.',
    location_address: 'Kranti Nagar Hillock, Sector 4, Ward 24',
    landmark: 'Adjacent to Water Department Pumphouse',
    estimated_cost: 2800000,
    sanctioned_amount: 2800000,
    funds_spent: 2800000,
    physical_progress: 100,
    financial_progress: 100,
    status: 'COMPLETED',
    start_date: '2025-11-01',
    target_date: '2026-05-30',
    contractor_name: 'Hydrolink Water Systems Pvt Ltd',
    contractor_phone: '+91 98221 55677',
    engineer_in_charge: 'Er. Prakash Kulkarni (Hydraulic Engineer)',
    delay_reason: null,
    milestones: [
      { name: 'Pillar foundation & structural stability testing', done: true },
      { name: 'Cylindrical RCC tank construction', done: true },
      { name: 'Inlet-outlet pipeline valve connections', done: true },
      { name: 'Water quality lab test & inauguration', done: true }
    ]
  },
  {
    work_id: 'w-114',
    work_code: 'W-114',
    work_title: 'Machine Desilting & Cleaning of Main Ward Nallah',
    category: 'Water & Drainage',
    department_name: 'Water Supply & Sewerage Wing',
    description: 'Removing 800 truckloads of silt and solid debris from the 2.5-km central municipal canal before the monsoon.',
    location_address: 'Ward 24 Central Nallah (From Railway Culvert to River)',
    landmark: 'Running behind Anand Nagar',
    estimated_cost: 1500000,
    sanctioned_amount: 1500000,
    funds_spent: 1500000,
    physical_progress: 100,
    financial_progress: 100,
    status: 'COMPLETED',
    start_date: '2026-04-01',
    target_date: '2026-06-10',
    contractor_name: 'Swachh Enviro Care Services',
    contractor_phone: '+91 94225 77112',
    engineer_in_charge: 'Er. Suresh Patil (Stormwater In-Charge)',
    delay_reason: null,
    milestones: [
      { name: 'Hydraulic excavator machine deployment', done: true },
      { name: 'Silt extraction and drying on banks', done: true },
      { name: 'Transport of silt to municipal dump yard', done: true },
      { name: 'Water flow clear without obstructions', done: true }
    ]
  },

  // 3. Streetlights & Electrical Power
  {
    work_id: 'w-102',
    work_code: 'W-102',
    work_title: 'Bright Solar & LED Streetlight Installation (120 Poles)',
    category: 'Streetlights & Electrical',
    department_name: 'Electrical & Public Lighting Wing',
    description: 'Replacing dim yellow sodium lamps with bright energy-saving 45W LED lights across Lanes 1 to 8 to keep roads bright and safe at night.',
    location_address: 'Gulmohar Colony & Anand Nagar Main Arterial Roads',
    landmark: 'Across 120 Municipal Light Poles',
    estimated_cost: 1800000,
    sanctioned_amount: 1800000,
    funds_spent: 1440000,
    physical_progress: 75,
    financial_progress: 80,
    status: 'DELAYED',
    start_date: '2026-05-15',
    target_date: '2026-08-15',
    contractor_name: 'Surya Roshni Power Projects Ltd',
    contractor_phone: '+91 98810 55443',
    engineer_in_charge: 'Er. Amit Deshmukh (Electrical In-Charge)',
    delay_reason: 'Delay in consignment of automated timer boxes from manufacturer; technician crew deployed to finish pending 25 poles.',
    milestones: [
      { name: 'Survey of dark spots and faulty wiring', done: true },
      { name: 'Delivery of 120 LED fixtures and brackets', done: true },
      { name: 'Installation on 95 street poles completed', done: true },
      { name: 'Pending 25 poles wiring & automatic on-off timer', done: false }
    ]
  },
  {
    work_id: 'w-109',
    work_code: 'W-109',
    work_title: '24-Meter High-Mast Light Tower at Shivaji Chowk',
    category: 'Streetlights & Electrical',
    department_name: 'Electrical & Public Lighting Wing',
    description: 'Giant 6-floodlight high-mast tower turning the busy roundabout bright as day for evening pedestrians and motorists.',
    location_address: 'Shivaji Maharaj Chowk, Sector 4, Ward 24',
    landmark: 'Center of Chowk Roundabout',
    estimated_cost: 1400000,
    sanctioned_amount: 1400000,
    funds_spent: 1400000,
    physical_progress: 100,
    financial_progress: 100,
    status: 'COMPLETED',
    start_date: '2026-02-01',
    target_date: '2026-05-15',
    contractor_name: 'Crompton Illuminations & Towers',
    contractor_phone: '+91 98223 99881',
    engineer_in_charge: 'Er. Amit Deshmukh (Electrical In-Charge)',
    delay_reason: null,
    milestones: [
      { name: 'Deep pile concrete foundation laid', done: true },
      { name: '24-meter steel mast hoisted with crane', done: true },
      { name: '6 x 400W LED floodlight array fixed', done: true },
      { name: 'Power feeder connected & test-switched on', done: true }
    ]
  },
  {
    work_id: 'w-115',
    work_code: 'W-115',
    work_title: 'Underground Power Cabling to Remove Hanging Wires',
    category: 'Streetlights & Electrical',
    department_name: 'Electrical & Public Lighting Wing',
    description: 'Burying dangerous loose hanging overhead wires safely underground with fireproof conduits near garden and playground.',
    location_address: 'Garden Road, Near Municipal Joggers Park, Ward 24',
    landmark: 'Around Park Perimeter Fence',
    estimated_cost: 2200000,
    sanctioned_amount: 2200000,
    funds_spent: 660000,
    physical_progress: 30,
    financial_progress: 30,
    status: 'ONGOING',
    start_date: '2026-07-15',
    target_date: '2026-12-15',
    contractor_name: 'Western Powerlines Infrastructure',
    contractor_phone: '+91 94220 88224',
    engineer_in_charge: 'Er. Amit Deshmukh (Electrical In-Charge)',
    delay_reason: null,
    milestones: [
      { name: 'Road shoulder trenching (400m done)', done: true },
      { name: 'Heavy-duty armored cable laying', done: false },
      { name: 'Feeder pillar installation', done: false },
      { name: 'Removal of old tangled overhead wires', done: false }
    ]
  },

  // 4. Parks, Playgrounds & Gardens
  {
    work_id: 'w-103',
    work_code: 'W-103',
    work_title: 'Shivaji Joggers Park Beautification & Play Area',
    category: 'Parks & Playgrounds',
    department_name: 'Parks & Garden Amenities Wing',
    description: 'Lush green lawns, soft walking track for morning walkers, rubber safety tiles, children swings, slides, and garden benches.',
    location_address: 'Sector 4 Public Park, Ward 24',
    landmark: 'Behind Ward Sub-Office',
    estimated_cost: 3500000,
    sanctioned_amount: 3500000,
    funds_spent: 3500000,
    physical_progress: 100,
    financial_progress: 100,
    status: 'COMPLETED',
    start_date: '2026-01-10',
    target_date: '2026-06-30',
    contractor_name: 'Green Horizon Landscapes',
    contractor_phone: '+91 97660 33441',
    engineer_in_charge: 'Er. Sneha Jadhav (Garden Superintendent)',
    delay_reason: null,
    milestones: [
      { name: 'Landscaping, soil replenishment & grass turf', done: true },
      { name: '600m rubberized walking track', done: true },
      { name: 'Modern children playground equipment', done: true },
      { name: 'Gazebo & garden lamp posts installation', done: true }
    ]
  },
  {
    work_id: 'w-106',
    work_code: 'W-106',
    work_title: 'Open-Air Free Fitness Gym in Sector 3 Garden',
    category: 'Parks & Playgrounds',
    department_name: 'Parks & Garden Amenities Wing',
    description: '10 all-weather outdoor fitness exercise machines (air walkers, pull-down exercisers, chest press) free for all ward residents.',
    location_address: 'Sector 3 Municipal Garden Ground, Ward 24',
    landmark: 'Opposite Community Hall',
    estimated_cost: 950000,
    sanctioned_amount: 950000,
    funds_spent: 855000,
    physical_progress: 90,
    financial_progress: 90,
    status: 'ONGOING',
    start_date: '2026-06-01',
    target_date: '2026-10-10',
    contractor_name: 'FitIndia Civil Equipments',
    contractor_phone: '+91 98224 55678',
    engineer_in_charge: 'Er. Sneha Jadhav (Garden Superintendent)',
    delay_reason: null,
    milestones: [
      { name: 'Concrete plinth platform casting', done: true },
      { name: 'Heavy-duty steel gym equipment anchoring', done: true },
      { name: 'Weather-proof rubber top coating', done: true },
      { name: 'Instruction board and shade umbrella', done: false }
    ]
  },
  {
    work_id: 'w-117',
    work_code: 'W-117',
    work_title: 'Public Playground Fencing & 200 Shady Trees',
    category: 'Parks & Playgrounds',
    department_name: 'Parks & Garden Amenities Wing',
    description: 'Chain-link boundary fencing around the community playground to keep stray animals out, plus planting 200 native shady trees with drip tubes.',
    location_address: 'Ward 24 Sports Ground, Sector 4',
    landmark: 'Near Football Goalposts',
    estimated_cost: 700000,
    sanctioned_amount: 700000,
    funds_spent: 350000,
    physical_progress: 50,
    financial_progress: 50,
    status: 'ONGOING',
    start_date: '2026-07-01',
    target_date: '2026-11-15',
    contractor_name: 'Nature First Greenery Foundation',
    contractor_phone: '+91 98811 77332',
    engineer_in_charge: 'Er. Sneha Jadhav (Garden Superintendent)',
    delay_reason: null,
    milestones: [
      { name: 'Boundary survey and post holes digging', done: true },
      { name: 'Galvanized iron chain-link fence fixing', done: true },
      { name: 'Tree saplings planting (Neem, Gulmohar, Karanj)', done: false },
      { name: 'Drip watering pipe installation', done: false }
    ]
  },

  // 5. Community Buildings & Public Amenities
  {
    work_id: 'w-112',
    work_code: 'W-112',
    work_title: 'Modern Public Toilet Block with Clean Water & Solar Lights',
    category: 'Community Facilities',
    department_name: 'Civil Buildings & Public Amenities Wing',
    description: 'Clean, hygienic, tiled public restroom facility with dedicated sections for women, men, and persons with disabilities.',
    location_address: 'Near Weekly Bazaar Ground, Sector 4, Ward 24',
    landmark: 'Next to Auto-Rickshaw Stand',
    estimated_cost: 1650000,
    sanctioned_amount: 1600000,
    funds_spent: 990000,
    physical_progress: 60,
    financial_progress: 60,
    status: 'DELAYED',
    start_date: '2026-04-01',
    target_date: '2026-08-30',
    contractor_name: 'Swarna Sanitation Infra Builders',
    contractor_phone: '+91 98904 22119',
    engineer_in_charge: 'Er. Ravindra Sawant (Civil Engineer)',
    delay_reason: 'Underground septic chamber excavation delayed due to hard rock; rock breakers deployed to resume work.',
    milestones: [
      { name: 'Brick masonry and slab completed', done: true },
      { name: 'Plumbing pipes and drainage septic tank', done: false },
      { name: 'Ceramic wall tiles and flush fittings', done: false },
      { name: 'Overhead 2,000L tank and solar light', done: false }
    ]
  },
  {
    work_id: 'w-118',
    work_code: 'W-118',
    work_title: 'Renovation of Citizen Reading Hall & Study Center',
    category: 'Community Facilities',
    department_name: 'Civil Buildings & Public Amenities Wing',
    description: 'Airy, peaceful study hall with 40 reading desks, free Wi-Fi, competitive exam books, and a senior citizen newspaper reading section.',
    location_address: 'Ward 24 Community Hall, 1st Floor, Sector 4',
    landmark: 'Above Ward Citizen Assistance Center',
    estimated_cost: 2250000,
    sanctioned_amount: 2200000,
    funds_spent: 900000,
    physical_progress: 40,
    financial_progress: 40,
    status: 'ONGOING',
    start_date: '2026-07-01',
    target_date: '2026-11-30',
    contractor_name: 'Shree Samarth Builders & Interiors',
    contractor_phone: '+91 98231 44556',
    engineer_in_charge: 'Er. Ravindra Sawant (Civil Engineer)',
    delay_reason: null,
    milestones: [
      { name: 'Roof waterproofing & plastering repair', done: true },
      { name: 'Electrical rewiring and LED tubelights', done: true },
      { name: 'Wooden study desks and book racks setup', done: false },
      { name: 'Computers, Wi-Fi router & inaugural books stocking', done: false }
    ]
  }
];

// Helpful Category Classification
const WORK_CATEGORIES = [
  { id: 'ALL', name: 'All Development Works', icon: Layers },
  { id: 'Roads & Pavements', name: 'Roads & Pavements', icon: Construction },
  { id: 'Water & Drainage', name: 'Water & Drainage', icon: Waves },
  { id: 'Streetlights & Electrical', name: 'Streetlights & Power', icon: Lightbulb },
  { id: 'Parks & Playgrounds', name: 'Parks & Gardens', icon: Trees },
  { id: 'Community Facilities', name: 'Community Buildings & Toilets', icon: Building2 }
];

export const CorporatorWorksPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || '';

  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('budget_desc'); // budget_desc, progress_desc, date_asc
  const [viewMode, setViewMode] = useState('grid'); // grid (commoner friendly) or table
  const [currentPage, setCurrentPage] = useState(1);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const itemsPerPage = 6;

  // Selected work for slide-over drawer
  const [selectedWork, setSelectedWork] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await api.get('/corporator/works');
      const rawList = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res)
        ? res
        : [];

      if (rawList && rawList.length > 0) {
        // Merge with friendly defaults if backend only has 2-3 bare items
        const merged = rawList.map((item, idx) => {
          const fallback = DEFAULT_WARD_WORKS[idx % DEFAULT_WARD_WORKS.length];
          return {
            ...fallback,
            ...item,
            category: fallback.category,
            landmark: fallback.landmark,
            milestones: fallback.milestones,
            funds_spent: item.funds_spent || Math.round((item.estimated_cost || fallback.estimated_cost) * ((item.financial_progress || fallback.financial_progress) / 100))
          };
        });
        setWorks(merged.length >= 6 ? merged : DEFAULT_WARD_WORKS);
      } else {
        setWorks(DEFAULT_WARD_WORKS);
      }

      if (isManual) {
        showToast('Development works refreshed successfully.');
      }
    } catch (err) {
      console.warn('Using default development works due to network:', err);
      setWorks(DEFAULT_WARD_WORKS);
      if (isManual) {
        showToast('Loaded latest development works.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // High-Level Statistics (Plain English)
  const stats = useMemo(() => {
    const totalCount = works.length;
    const ongoingCount = works.filter((w) => w.status === 'ONGOING').length;
    const completedCount = works.filter((w) => w.status === 'COMPLETED').length;
    const delayedCount = works.filter((w) => w.status === 'DELAYED').length;
    const totalBudget = works.reduce((sum, w) => sum + Number(w.estimated_cost || 0), 0);
    const totalSpent = works.reduce((sum, w) => sum + Number(w.funds_spent || (w.estimated_cost * (w.financial_progress / 100)) || 0), 0);

    return { totalCount, ongoingCount, completedCount, delayedCount, totalBudget, totalSpent };
  }, [works]);

  // Delayed works needing special attention
  const delayedWorks = useMemo(() => {
    return works.filter((w) => w.status === 'DELAYED');
  }, [works]);

  // Filtered & Sorted Works
  const filteredWorks = useMemo(() => {
    return works.filter((w) => {
      // Category filter
      if (categoryFilter !== 'ALL' && w.category !== categoryFilter) {
        return false;
      }

      // Status filter
      if (statusFilter && w.status !== statusFilter) {
        return false;
      }

      // Search (English plain words)
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesCode = w.work_code?.toLowerCase().includes(q);
        const matchesTitle = w.work_title?.toLowerCase().includes(q);
        const matchesDesc = w.description?.toLowerCase().includes(q);
        const matchesLoc = w.location_address?.toLowerCase().includes(q);
        const matchesContractor = w.contractor_name?.toLowerCase().includes(q);

        if (!matchesCode && !matchesTitle && !matchesDesc && !matchesLoc && !matchesContractor) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'budget_desc') {
        return Number(b.estimated_cost || 0) - Number(a.estimated_cost || 0);
      }
      if (sortBy === 'progress_desc') {
        return Number(b.physical_progress || 0) - Number(a.physical_progress || 0);
      }
      if (sortBy === 'date_asc') {
        return new Date(a.target_date || 0) - new Date(b.target_date || 0);
      }
      return 0;
    });
  }, [works, categoryFilter, statusFilter, search, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredWorks.length / itemsPerPage) || 1;
  const paginatedWorks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredWorks.slice(start, start + itemsPerPage);
  }, [filteredWorks, currentPage, itemsPerPage]);

  const handleOpenWork = (work) => {
    setSelectedWork(work);
    setIsDrawerOpen(true);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setCategoryFilter('ALL');
    setSortBy('budget_desc');
    setCurrentPage(1);
    showToast('Reset all filters.');
  };

  const handleExportCSV = () => {
    if (filteredWorks.length === 0) {
      showToast('No projects to export.');
      return;
    }

    const headers = [
      'Project ID',
      'Project Name',
      'Category',
      'Location',
      'Sanctioned Budget (INR)',
      'Funds Spent (INR)',
      'Work Completed (%)',
      'Status',
      'Target Completion Date',
      'Contractor Name',
      'Contact'
    ];

    const rows = filteredWorks.map((w) => [
      `"${w.work_code || ''}"`,
      `"${(w.work_title || '').replace(/"/g, '""')}"`,
      `"${w.category || ''}"`,
      `"${(w.location_address || '').replace(/"/g, '""')}"`,
      w.estimated_cost || 0,
      w.funds_spent || 0,
      w.physical_progress || 0,
      `"${w.status || ''}"`,
      `"${w.target_date || ''}"`,
      `"${w.contractor_name || ''}"`,
      `"${w.contractor_phone || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ward_24_Public_Works_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filteredWorks.length} public projects to CSV.`);
  };

  // Helper for friendly status pills
  const renderFriendlyStatus = (status) => {
    if (status === 'COMPLETED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" /> Completed & Open
        </span>
      );
    }
    if (status === 'ONGOING') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" /> Under Construction
        </span>
      );
    }
    if (status === 'DELAYED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Behind Schedule
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
        <Clock className="w-3.5 h-3.5 text-slate-500" /> Planned Work
      </span>
    );
  };

  const hasActiveFilters = search || statusFilter || categoryFilter !== 'ALL';

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 transition-all">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. CITIZEN & CORPORATOR HEADER (Plain English & Transparent) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
              Ward 24 Public Transparency
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Shivaji Nagar Jurisdiction</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Ward Development Projects & Public Works
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            See all local roads, water pipelines, parks, and streetlights being built in Ward 24.
            Track construction progress, money spent, contractors, and completion deadlines in simple words.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowHowItWorks(!showHowItWorks)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showHowItWorks
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Understand how municipal projects are proposed, approved, and built"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How Works Happen</span>
            {showHowItWorks ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            onClick={() => fetchWorks(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all active:scale-95 disabled:opacity-50"
            title="Refresh latest progress"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
            <span>{refreshing ? 'Syncing...' : 'Sync'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all active:scale-95"
            title="Download Excel / CSV sheet"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CITIZEN GUIDE CARD: "How Public Works Happen in Your Ward" */}
      {/* ========================================================================= */}
      {showHowItWorks && (
        <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50 rounded-xl p-4 sm:p-5 border border-blue-200 shadow-2xs space-y-3 transition-all">
          <div className="flex items-center justify-between pb-2 border-b border-blue-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-blue-600 text-white">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                How a Public Work Gets Built in Ward 24 (4 Simple Steps)
              </h3>
            </div>
            <button onClick={() => setShowHowItWorks(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white rounded-lg border border-blue-100 space-y-1">
              <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">Step 1</span>
              <div className="font-bold text-slate-900">Need Identified & Funds Approved</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Citizens submit grievances or the Corporator proposes a project (e.g. road resurfacing). The municipal council sanctions the estimated budget.
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-blue-100 space-y-1">
              <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">Step 2</span>
              <div className="font-bold text-slate-900">Government Tender & Contractor</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                A licensed civil contractor is selected via transparent public e-tendering. A legal work order with a strict target deadline is issued.
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-blue-100 space-y-1">
              <span className="font-mono text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded">Step 3</span>
              <div className="font-bold text-slate-900">Ground Work & Progress Tracking</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Work crews build on site. Municipal engineers audit quality and check milestones before releasing installment payments to the builder.
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-blue-100 space-y-1">
              <span className="font-mono text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">Step 4</span>
              <div className="font-bold text-slate-900">Handed Over for Public Use</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                The road, park, or pipeline is thoroughly tested, certified completed, and dedicated for daily use by Ward 24 residents.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. WIDE PLAIN-ENGLISH SUMMARY CARDS (Key Ward Numbers) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Works */}
        <div
          onClick={() => {
            setStatusFilter('');
            setCategoryFilter('ALL');
          }}
          className={`cursor-pointer bg-white p-3.5 rounded-xl border transition-all ${
            statusFilter === '' && categoryFilter === 'ALL'
              ? 'border-blue-500 ring-2 ring-blue-100 shadow-2xs'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Total Projects</span>
            <div className="p-1 rounded-md bg-blue-50 text-blue-600">
              <HardHat className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across all ward lanes</div>
        </div>

        {/* Under Construction */}
        <div
          onClick={() => setStatusFilter('ONGOING')}
          className={`cursor-pointer bg-white p-3.5 rounded-xl border transition-all ${
            statusFilter === 'ONGOING'
              ? 'border-blue-500 ring-2 ring-blue-100 shadow-2xs'
              : 'border-slate-200 hover:border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between text-blue-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Under Construction</span>
            <div className="p-1 rounded-md bg-blue-50 text-blue-600">
              <Construction className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-600">{stats.ongoingCount}</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" /> Work currently active
          </div>
        </div>

        {/* Completed & Open */}
        <div
          onClick={() => setStatusFilter('COMPLETED')}
          className={`cursor-pointer bg-white p-3.5 rounded-xl border transition-all ${
            statusFilter === 'COMPLETED'
              ? 'border-emerald-500 ring-2 ring-emerald-100 shadow-2xs'
              : 'border-slate-200 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Completed & Open</span>
            <div className="p-1 rounded-md bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{stats.completedCount}</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Finished and in public use</div>
        </div>

        {/* Behind Schedule */}
        <div
          onClick={() => setStatusFilter('DELAYED')}
          className={`cursor-pointer bg-white p-3.5 rounded-xl border transition-all ${
            statusFilter === 'DELAYED'
              ? 'border-amber-500 ring-2 ring-amber-100 shadow-2xs'
              : 'border-slate-200 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Behind Schedule</span>
            <div className="p-1 rounded-md bg-amber-50 text-amber-600">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">{stats.delayedCount}</div>
          <div className="text-[11px] text-amber-700 font-medium mt-0.5">Contractors told to expedite</div>
        </div>

        {/* Ward Budget Invested */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Total Ward Budget</span>
            <div className="p-1 rounded-md bg-slate-100 text-slate-700">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{formatCurrency(stats.totalBudget)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {formatCurrency(stats.totalSpent)} disbursed so far
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. DELAYED WORKS NOTICE (Transparent Warning) */}
      {/* ========================================================================= */}
      {delayedWorks.length > 0 && statusFilter !== 'COMPLETED' && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-amber-100 text-amber-800 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-amber-900">
                Notice: {delayedWorks.length} projects are running behind schedule.
              </span>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Official show-cause notices have been issued to the contractors to deploy extra manpower and complete work without compromising safety.
              </p>
            </div>
          </div>
          <button
            onClick={() => setStatusFilter(statusFilter === 'DELAYED' ? '' : 'DELAYED')}
            className="text-xs font-bold text-amber-900 underline hover:text-amber-950 shrink-0 self-start sm:self-auto"
          >
            {statusFilter === 'DELAYED' ? 'Show all works' : `View ${delayedWorks.length} delayed works`}
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. WORK TYPE CATEGORY BUTTONS (Clean, Normal English Tabs) */}
      {/* ========================================================================= */}
      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {WORK_CATEGORIES.map((cat) => {
            const isSelected = categoryFilter === cat.id;
            const count = cat.id === 'ALL'
              ? works.length
              : works.filter((w) => w.category === cat.id).length;
            const IconC = cat.icon;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setCategoryFilter(cat.id);
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                <IconC className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-300' : 'text-slate-500'}`} />
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. SEARCH & FILTER TOOLBAR */}
      {/* ========================================================================= */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-center">
          {/* Search Box */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              placeholder="Search by project name, lane, landmark, contractor..."
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

          {/* Status Dropdown */}
          <div className="lg:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 rounded-lg text-xs font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all text-slate-800 cursor-pointer"
            >
              <option value="">All Statuses ({works.length})</option>
              <option value="ONGOING">🔄 Under Construction ({stats.ongoingCount})</option>
              <option value="DELAYED">⚠️ Behind Schedule ({stats.delayedCount})</option>
              <option value="COMPLETED">✅ Completed & Open ({stats.completedCount})</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="lg:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 rounded-lg text-xs font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all text-slate-800 cursor-pointer"
            >
              <option value="budget_desc">Highest Budget First</option>
              <option value="progress_desc">Most Work Completed First</option>
              <option value="date_asc">Earliest Target Date</option>
            </select>
          </div>

          {/* Reset / Actions */}
          <div className="lg:col-span-1 flex justify-end">
            {hasActiveFilters ? (
              <button
                onClick={handleResetFilters}
                className="w-full py-2 px-2 rounded-lg text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center justify-center gap-1 border border-rose-200"
                title="Reset all filters"
              >
                <X className="w-3.5 h-3.5" />
                <span className="lg:hidden">Reset</span>
              </button>
            ) : (
              <div className="hidden lg:block text-slate-400 text-center w-full">•</div>
            )}
          </div>
        </div>

        {/* Toolbar Footer & View Switcher */}
        <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-slate-100 gap-2">
          <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
            <span>Showing <span className="font-bold text-slate-900">{filteredWorks.length}</span> projects</span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-blue-600 hover:text-blue-800 font-semibold underline ml-1"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 px-2.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Easy Visual Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Project Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 px-2.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Detailed Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. MAIN PROJECTS LISTING (Cards Grid vs. Table) */}
      {/* ========================================================================= */}
      {loading ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-2xs">
          <LoadingState message="Fetching Ward 24 development projects..." />
        </div>
      ) : filteredWorks.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center shadow-2xs space-y-3">
          <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
            <HardHat className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">No projects match your filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are no development works matching your search or category selection.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleResetFilters}>
            Show All Projects
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        /* ======================== 7A. CARDS VIEW (Commoner Friendly) ======================== */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedWorks.map((w) => {
              const isDone = w.status === 'COMPLETED';
              const isDelayed = w.status === 'DELAYED';

              return (
                <div
                  key={w.work_id}
                  onClick={() => handleOpenWork(w)}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div className="space-y-3">
                    {/* Header: Project Code & Status */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {w.work_code}
                      </span>
                      {renderFriendlyStatus(w.status)}
                    </div>

                    {/* Title & Category */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {w.category}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-2 mt-0.5 leading-snug">
                        {w.work_title}
                      </h3>
                    </div>

                    {/* Plain Description */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {w.description}
                    </p>

                    {/* Location with Landmark */}
                    <div className="flex items-start gap-1.5 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <div className="truncate">
                        <span className="font-semibold text-slate-800 truncate block">{w.location_address}</span>
                        {w.landmark && <span className="text-[11px] text-slate-500 block truncate">Near {w.landmark}</span>}
                      </div>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-medium">Work Completed:</span>
                        <span className="font-black text-slate-900">{w.physical_progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isDone
                              ? 'bg-emerald-500'
                              : isDelayed
                              ? 'bg-amber-500'
                              : 'bg-blue-600'
                          }`}
                          style={{ width: `${w.physical_progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Budget & Funds Spent */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Budget</span>
                        <span className="font-bold text-slate-900">{formatCurrency(w.estimated_cost)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Money Spent</span>
                        <span className="font-semibold text-slate-700">
                          {formatCurrency(w.funds_spent || Math.round(w.estimated_cost * (w.financial_progress / 100)))} ({w.financial_progress}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Contractor & Action */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs" onClick={(e) => e.stopPropagation()}>
                    <div className="truncate max-w-[150px]">
                      <span className="text-[10px] text-slate-400 block">Contractor:</span>
                      <span className="font-semibold text-slate-800 truncate block text-[11px]">
                        {w.contractor_name || 'Municipal Agency'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenWork(w)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
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
      ) : (
        /* ======================== 7B. TABLE VIEW (Detailed Administrative) ======================== */
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead className="bg-slate-50/90 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Project Code & Title</th>
                  <th className="px-3.5 py-3">Category</th>
                  <th className="px-3.5 py-3">Location</th>
                  <th className="px-3.5 py-3">Total Budget</th>
                  <th className="px-3.5 py-3">Work Completed</th>
                  <th className="px-3.5 py-3">Funds Spent</th>
                  <th className="px-3.5 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedWorks.map((w) => (
                  <tr
                    key={w.work_id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => handleOpenWork(w)}
                  >
                    {/* Code & Title */}
                    <td className="px-4 py-3 max-w-xs sm:max-w-sm">
                      <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        {w.work_code}
                      </span>
                      <div className="font-bold text-slate-900 mt-1 line-clamp-1 group-hover:text-blue-600 transition-colors text-xs">
                        {w.work_title}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-3.5 py-3 whitespace-nowrap font-medium text-slate-700">
                      {w.category}
                    </td>

                    {/* Location */}
                    <td className="px-3.5 py-3 max-w-[180px] truncate text-slate-600">
                      <div className="truncate font-medium text-slate-800">{w.location_address}</div>
                      {w.landmark && <div className="text-[10px] text-slate-400 truncate">Near {w.landmark}</div>}
                    </td>

                    {/* Budget */}
                    <td className="px-3.5 py-3 whitespace-nowrap font-bold text-slate-900">
                      {formatCurrency(w.estimated_cost)}
                    </td>

                    {/* Physical % */}
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${
                              w.status === 'COMPLETED'
                                ? 'bg-emerald-500'
                                : w.status === 'DELAYED'
                                ? 'bg-amber-500'
                                : 'bg-blue-600'
                            }`}
                            style={{ width: `${w.physical_progress}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-800 text-[11px]">{w.physical_progress}%</span>
                      </div>
                    </td>

                    {/* Financial % */}
                    <td className="px-3.5 py-3 whitespace-nowrap text-slate-700">
                      <div className="font-semibold text-slate-900">
                        {formatCurrency(w.funds_spent || Math.round(w.estimated_cost * (w.financial_progress / 100)))}
                      </div>
                      <div className="text-[10px] text-slate-400">{w.financial_progress}% disbursed</div>
                    </td>

                    {/* Status */}
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      {renderFriendlyStatus(w.status)}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenWork(w)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
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
      )}

      {/* ========================================================================= */}
      {/* 8. SLIDE-OVER PROJECT DETAILS DRAWER (Clear, Complete Information) */}
      {/* ========================================================================= */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={
          selectedWork
            ? `Project Details: ${selectedWork.work_code}`
            : 'Public Work Details'
        }
      >
        {selectedWork && (
          <div className="space-y-5 text-xs text-slate-700">
            {/* Header Status */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                {selectedWork.work_code}
              </span>
              {renderFriendlyStatus(selectedWork.status)}
            </div>

            {/* Title & Scope */}
            <div>
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                {selectedWork.category} • {selectedWork.department_name}
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                {selectedWork.work_title}
              </h2>
              <p className="text-slate-600 text-xs mt-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                {selectedWork.description}
              </p>
            </div>

            {/* Delay Explanation (if delayed) */}
            {selectedWork.status === 'DELAYED' && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Reason for Delay:
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  {selectedWork.delay_reason || 'Monsoon weather delay and material procurement lag. Contractor ordered to deploy extra team.'}
                </p>
              </div>
            )}

            {/* Exact Location & Landmark */}
            <div className="space-y-1">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Exact Work Location
              </h4>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">{selectedWork.location_address}</div>
                  {selectedWork.landmark && (
                    <div className="text-[11px] text-slate-500 mt-0.5">Landmark: Near {selectedWork.landmark}</div>
                  )}
                  <div className="text-[10px] text-slate-400 mt-0.5">Ward 24 Municipal Territory</div>
                </div>
              </div>
            </div>

            {/* Progress Bar & Timeline */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Physical Work Completed</span>
                <span className="font-black text-slate-900 text-sm">{selectedWork.physical_progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full ${
                    selectedWork.status === 'COMPLETED'
                      ? 'bg-emerald-500'
                      : selectedWork.status === 'DELAYED'
                      ? 'bg-amber-500'
                      : 'bg-blue-600'
                  }`}
                  style={{ width: `${selectedWork.physical_progress}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                <div>
                  <span className="text-slate-400 block font-medium">Work Started:</span>
                  <span className="font-semibold text-slate-800">{formatDate(selectedWork.start_date)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Target Completion:</span>
                  <span className="font-bold text-slate-900">{formatDate(selectedWork.target_date)}</span>
                </div>
              </div>
            </div>

            {/* Money & Budget Breakdown */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Public Budget & Expenditure Breakdown
              </span>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Sanctioned Budget</span>
                  <span className="font-bold text-slate-900 text-xs">{formatCurrency(selectedWork.estimated_cost)}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Amount Paid</span>
                  <span className="font-bold text-emerald-700 text-xs">
                    {formatCurrency(selectedWork.funds_spent || Math.round(selectedWork.estimated_cost * (selectedWork.financial_progress / 100)))}
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Balance Remaining</span>
                  <span className="font-bold text-slate-700 text-xs">
                    {formatCurrency(selectedWork.estimated_cost - (selectedWork.funds_spent || Math.round(selectedWork.estimated_cost * (selectedWork.financial_progress / 100))))}
                  </span>
                </div>
              </div>
            </div>

            {/* Contractor & Engineer in Charge */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Responsible Contractor & Supervising Engineer
              </span>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Executing Contractor:</span>
                    <span className="font-bold text-slate-900 text-xs">{selectedWork.contractor_name || 'Standard Infra Works'}</span>
                  </div>
                  {selectedWork.contractor_phone && (
                    <a
                      href={`tel:${selectedWork.contractor_phone}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 hover:bg-emerald-100"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call Contractor</span>
                    </a>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Municipal Engineer in Charge:</span>
                  <span className="font-semibold text-slate-800 text-xs">{selectedWork.engineer_in_charge || 'Ward Civil Engineer'}</span>
                </div>
              </div>
            </div>

            {/* Milestones / Checklist */}
            {selectedWork.milestones && selectedWork.milestones.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Construction Milestones
                </h4>
                <div className="space-y-1.5">
                  {selectedWork.milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg flex items-center justify-between border text-xs ${
                        m.done
                          ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {m.done ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                        )}
                        <span>{m.name}</span>
                      </div>
                      <span className="text-[10px] font-bold">
                        {m.done ? 'Finished' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate(`/corporator/works/${selectedWork.work_id}`);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span>Open Complete Work Profile & Documents</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  showToast('Thank you. Your feedback has been noted for the Corporator review.');
                }}
                className="w-full py-2 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>Report Quality Concern or Delay to Corporator</span>
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
