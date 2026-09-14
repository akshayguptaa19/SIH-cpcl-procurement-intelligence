import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, FileText, CheckCircle2, AlertTriangle, Search, ArrowRight, ChevronRight, 
  Eye, Building2, Landmark, Lock, Scale, FileCheck2, Cpu, Layers, Clock, 
  UserCheck, Users, Briefcase, Calendar, X, ExternalLink, HelpCircle, Menu, 
  Sparkles, Check, ArrowDown, ChevronDown, BarChart3, Database, ShieldAlert,
  ArrowUpRight, Sliders, CheckCircle, Info, Activity, Terminal, Zap, Shield,
  FileSpreadsheet, Award, FileCode, Hash, RefreshCw, ChevronUp, AlertCircle,
  Flame, KeyRound, Radio, Compass, Play, CheckCheck, Fingerprint, Copy,
  FileSignature, CheckSquare, ArrowLeftRight, ChevronLeft, ArrowUp, Globe
} from 'lucide-react';

// ─── CPCL CIRCULAR EMBLEM SVG ──────────────────────────────────────────
export function CpclEmblem({ size = 44, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="CPCL Emblem"
    >
      <circle cx="50" cy="50" r="48" fill="#061224" stroke="#00A3E0" strokeWidth="2.5" />
      {/* Top half red */}
      <path d="M 10 50 A 40 40 0 0 1 90 50 Z" fill="#DC2626" />
      {/* Bottom half blue */}
      <path d="M 10 50 A 40 40 0 0 0 90 50 Z" fill="#1D4ED8" />
      {/* Center White Ribbon */}
      <rect x="14" y="38" width="72" height="24" rx="4" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
      {/* CPCL Letters */}
      <text 
        x="50" 
        y="55" 
        fontFamily="sans-serif" 
        fontSize="17" 
        fontWeight="900" 
        fill="#0F172A" 
        textAnchor="middle" 
        letterSpacing="1.5"
      >
        CPCL
      </text>
      {/* Flame accent */}
      <path d="M 50 18 Q 54 26 50 32 Q 46 26 50 18 Z" fill="#FBBF24" />
      {/* Wave in blue half */}
      <path d="M 28 72 Q 50 66 72 72" stroke="#60A5FA" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ─── ASHOKA PILLAR / GOV OF INDIA EMBLEM SVG ───────────────────────────
function IndiaGovEmblem({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-amber-400/90 shrink-0">
      <path d="M12 2L4 5V11C4 16.55 7.42 21.74 12 23C16.58 21.74 20 16.55 20 11V5L12 2ZM12 4.18L18 6.43V11C18 15.22 15.45 19.14 12 20.24C8.55 19.14 6 15.22 6 11V6.43L12 4.18ZM11 7V9H13V7H11ZM11 11V17H13V11H11Z" />
    </svg>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  // Interactive UI State
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(2); // default to OCR extraction
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);
  const [bidderAppFilter, setBidderAppFilter] = useState('All');
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [howItWorksModalOpen, setHowItWorksModalOpen] = useState(false);
  const [selectedTenderModal, setSelectedTenderModal] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedTenderId, setCopiedTenderId] = useState(null);
  const [activeEvidenceTab, setActiveEvidenceTab] = useState('udin');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeTabTerm, setActiveTabTerm] = useState('live');

  // Monitor scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard accessibility: Escape to close modals, / to search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setEvidenceModalOpen(false);
        setHowItWorksModalOpen(false);
        setSelectedTenderModal(null);
      }
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        const el = document.getElementById('tender-search-input');
        el?.focus();
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Tenders Data
  const defaultTenders = [
    {
      id: 't-128',
      reference_number: 'CPCL/PROC/2026/128',
      title: 'Industrial Pipeline Valves & Hydrostatic Certification',
      category: 'Mechanical Equipment',
      estimated_value_display: '₹240 Cr',
      estimated_value: 2400000000,
      deadline: '18 Sep 2026',
      badge: 'ACTIVE',
      badgeColor: 'emerald',
      code: '03',
      description: 'Supply, installation and high-pressure hydrostatic certification of API 6D pipeline valves for Cauvery Basin crude transfer line.',
      eligibility: [
        'Class-1 Local Supplier (Make in India - Minimum 50% Local Value Addition)',
        'Min 3-Year Avg Annual Turnover: ₹50.00 Cr certified by practicing CA with valid UDIN',
        'Prior execution of at least one similar PSU refinery valve contract exceeding ₹25 Cr in last 5 years',
        'Active GSTIN with zero defaults in GSTR-3B filings for past 24 consecutive months'
      ]
    },
    {
      id: 't-147',
      reference_number: 'CPCL/PROC/2026/147',
      title: 'Refinery Hydrocracker Maintenance & Turnaround Services',
      category: 'Maintenance Services',
      estimated_value_display: '₹85 Cr',
      estimated_value: 850000000,
      deadline: '25 Sep 2026',
      badge: 'OPEN',
      badgeColor: 'blue',
      code: '03',
      description: 'Comprehensive mechanical overhaul, catalyst replacement assistance and hydrocracker maintenance support for Manali Unit-3.',
      eligibility: [
        'Prior PSU Refinery Turnaround Experience (Indian Oil / BPCL / HPCL / CPCL)',
        'Min 3-Year Avg Annual Turnover: ₹20.00 Cr with valid ICAI UDIN certificate',
        'Valid Tamil Nadu Directorate of Industrial Safety & Health (DISH) Factory Clearance',
        'Certified ISO 9001:2015 (Quality) & OHSAS 18001 / ISO 45001 (Occupational Safety)'
      ]
    },
    {
      id: 't-valve-001',
      reference_number: 'CPCL/VALVE/2025/001',
      title: 'Supply of High-Pressure Forged Steel Industrial Valves',
      category: 'Industrial Goods',
      estimated_value_display: '₹18.50 Cr',
      estimated_value: 185000000,
      deadline: '15 Oct 2026',
      badge: 'OPEN',
      badgeColor: 'blue',
      code: '03',
      description: 'Procurement of high-pressure forged steel gate, globe, and check valves conforming to API 600 / API 602 standards for refinery offsite piping.',
      eligibility: [
        'Approved IBR (Indian Boiler Regulations) & PESO Certified Manufacturer',
        'Min 3-Year Avg Turnover: ₹5.00 Cr certified with valid CA UDIN',
        'NABL Accredited Test Laboratory Chemical & Hydrostatic Test Reports',
        'Direct Calibration & Testing Facility located in India'
      ]
    }
  ];

  // 7 Workflow Steps Data
  const workflowSteps = [
    {
      num: '01',
      title: 'Tender Creation',
      icon: FileText,
      color: 'blue',
      desc: 'Publish tender specs with automated GFR 2017 clause mapping',
      officerDuty: 'Defines commercial specifications, turnover cut-offs, and GFR 2017 eligibility gates.',
      aiDuty: 'Cross-verifies clause consistency against CVC guidelines and GFR Rule 144(xi).'
    },
    {
      num: '02',
      title: 'Sealed Bid Intake',
      icon: Building2,
      color: 'blue',
      desc: 'Encrypted submission with SHA-256 integrity validation',
      officerDuty: 'Monitors aggregate incoming submission count while bids remain sealed and encrypted.',
      aiDuty: 'Performs pre-flight file integrity, virus scanning, and PDF format validation.'
    },
    {
      num: '03',
      title: 'Multi-Modal OCR',
      icon: FileCode,
      color: 'cyan',
      desc: 'Sub-second extraction of scanned PDFs, stamps & balance sheets',
      officerDuty: 'Reviews highlighted bounding box source citations for extracted entity parameters.',
      aiDuty: 'Extracts 500+ scanned pages in 1.4 seconds with 98.5% multi-modal accuracy.'
    },
    {
      num: '04',
      title: 'Deterministic Rules',
      icon: Scale,
      color: 'cyan',
      desc: 'Zero-hallucination compliance checking against PSU criteria',
      officerDuty: 'Inspects objective pass/fail scorecards mapped to CPCL tender conditions.',
      aiDuty: 'Executes programmatic rule engines with zero hallucinations or probabilistic errors.'
    },
    {
      num: '05',
      title: 'Registry Verification',
      icon: AlertTriangle,
      color: 'amber',
      desc: 'Live cross-checks against GSTN, PAN, MCA21 & ICAI UDIN',
      officerDuty: 'Examines flagged turnover anomalies, shell entities, or sudden balance sheet spikes.',
      aiDuty: 'Cross-checks live GSTIN active status, NSDL PAN, and ICAI UDIN registers.'
    },
    {
      num: '06',
      title: 'Officer Review',
      icon: UserCheck,
      color: 'cyan',
      desc: 'Explainable evidence dossiers for informed committee decisions',
      officerDuty: 'Retains 100% statutory discretion to approve, seek clarifications, or disqualify.',
      aiDuty: 'Compiles consolidated explainable scrutiny reports with exact PDF citations.'
    },
    {
      num: '07',
      title: 'Audit Ledger Seal',
      icon: CheckCircle2,
      color: 'emerald',
      desc: 'Cryptographic Merkle root permanent evidentiary defense',
      officerDuty: 'Signs off on technical evaluation and awards compliant commercial contracts.',
      aiDuty: 'Permanently stamps cryptographic SHA-256 Merkle root certificates into audit ledger.'
    }
  ];

  // Applications mock for Bidder widget
  const bidderApplications = [
    {
      id: 'CPCL/PROC/2026/128',
      title: 'Industrial Pipeline Equipment',
      status: 'Under Review',
      badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
      category: 'Under Review'
    },
    {
      id: 'CPCL/PROC/2026/147',
      title: 'Refinery Maintenance Services',
      status: 'Verified L1 Ready',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
      category: 'Active'
    },
    {
      id: 'CPCL/PROC/2026/152',
      title: 'Safety Valves & Flare Flare Spares',
      status: 'Draft Saved',
      badgeClass: 'bg-sky-500/20 text-sky-300 border border-sky-500/40',
      category: 'Active'
    }
  ];

  const filteredBidderApps = bidderApplications.filter(app => {
    if (bidderAppFilter === 'All') return true;
    if (bidderAppFilter === 'Active') return app.category === 'Active';
    if (bidderAppFilter === 'Under Review') return app.category === 'Under Review';
    if (bidderAppFilter === 'Closed') return app.category === 'Closed';
    return true;
  });

  // Chart data for Compliance bar chart
  const complianceMonthlyData = [
    { month: 'Jan', value: 45, verified: 18 },
    { month: 'Feb', value: 55, verified: 24 },
    { month: 'Mar', value: 70, verified: 36 },
    { month: 'Apr', value: 62, verified: 28 },
    { month: 'May', value: 85, verified: 45 },
    { month: 'Jun', value: 78, verified: 38 },
    { month: 'Jul', value: 92, verified: 48 },
    { month: 'Aug', value: 84, verified: 42 },
    { month: 'Sep', value: 98, verified: 58 },
    { month: 'Oct', value: 91, verified: 51 }
  ];

  const filteredTenders = defaultTenders.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reference_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || t.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All Status' || t.badge === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCopyHash = () => {
    navigator.clipboard?.writeText('7f8a9e21b4e7c3d5a6b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0');
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleCopyTenderId = (ref) => {
    navigator.clipboard?.writeText(ref);
    setCopiedTenderId(ref);
    setTimeout(() => setCopiedTenderId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-['Inter',sans-serif] selection:bg-blue-600 selection:text-white relative overflow-x-hidden">

      {/* ─── 1. TOP SOVEREIGN GOVERNMENT BANNER ──────────────────────────── */}
      <div className="bg-[#02050E] text-slate-400 text-[11px] py-2 px-6 sm:px-8 border-b border-slate-800/80 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left Gov branding */}
          <div className="flex items-center gap-2.5">
            <IndiaGovEmblem size={16} />
            <span className="text-slate-200 font-semibold tracking-tight">Government of India</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">Ministry of Petroleum & Natural Gas</span>
            <span className="text-slate-600 hidden lg:inline">|</span>
            <span className="text-amber-400/90 font-mono text-[10px] hidden lg:inline bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
              GFR 2017 & CVC COMPLIANT
            </span>
          </div>

          {/* Center CPCL Title */}
          <div className="hidden md:flex items-center gap-2 text-slate-300 font-medium tracking-tight">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A3E0]" />
            <span>Chennai Petroleum Corporation Limited (CPCL)</span>
            <span className="text-slate-500 text-[10px] font-normal">· IndianOil Group</span>
          </div>

          {/* Right Security Status */}
          <div className="flex items-center gap-3.5 text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
              <span>Sovereign Enclave Active</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-slate-400 font-mono text-[10px]">
              <Lock className="w-3.5 h-3.5 text-sky-400" />
              <span>SHA-256 SEALED</span>
            </div>
          </div>

        </div>
      </div>

      {/* ─── 2. MAIN FROSTED NAVBAR ───────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#040918]/90 backdrop-blur-xl border-b border-slate-800/90 transition-all shadow-xl shadow-black/40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="relative">
              <CpclEmblem size={46} className="group-hover:scale-105 transition-transform shrink-0 drop-shadow-lg" />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#040918]" title="AI Engine Online" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-white tracking-tight">CPCL</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-gradient-to-r from-blue-600 to-sky-500 text-white tracking-wide uppercase shadow-xs">
                  BIDVERIFY AI
                </span>
              </div>
              <span className="text-[11px] text-slate-400 leading-tight mt-0.5 font-medium">
                Autonomous Procurement Scrutiny & Fraud Intelligence
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <a href="#overview" className="text-white hover:text-sky-400 transition-colors py-1 relative font-bold">
              Overview
            </a>
            <a href="#pipeline" className="hover:text-white transition-colors py-1">
              AI Pipeline
            </a>
            <a href="#portals" className="hover:text-white transition-colors py-1">
              Command Centers
            </a>
            <a href="#tenders" className="hover:text-white transition-colors py-1">
              Live Tenders
            </a>
            <a href="#trust" className="hover:text-white transition-colors py-1">
              Statutory Trust
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Search shortcut button */}
            <button 
              onClick={() => {
                const el = document.getElementById('tender-search-input');
                el?.focus();
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="p-2.5 rounded-lg text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-all flex items-center gap-2 text-xs"
              title="Search Tenders (Press /)"
            >
              <Search className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-[11px] text-slate-400 font-mono hidden md:inline">Press /</span>
            </button>

            {/* Bidder Portal CTA */}
            <button
              onClick={() => navigate('/bidder/login')}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 shadow-xs hover:border-slate-600 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bidder Portal</span>
            </button>

            {/* Officer Login (Primary Glowing Button) */}
            <button
              onClick={() => navigate('/officer/login')}
              className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#0066FF] to-[#00A3E0] hover:from-[#0055D4] hover:to-[#0284c7] shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2 border border-sky-400/30"
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Officer Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

        {/* Mobile menu drop */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#070F21] border-b border-slate-800 p-5 space-y-3 shadow-2xl">
            <a href="#overview" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-semibold text-white">Overview</a>
            <a href="#pipeline" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-semibold text-slate-300">AI Pipeline</a>
            <a href="#portals" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-semibold text-slate-300">Command Centers</a>
            <a href="#tenders" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-semibold text-slate-300">Live Tenders</a>
            <a href="#trust" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-semibold text-slate-300">Statutory Trust</a>
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2.5">
              <button 
                onClick={() => navigate('/officer/login')}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Officer Console Login</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => navigate('/bidder/login')}
                  className="w-full py-2.5 rounded-lg bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700"
                >
                  Bidder Login
                </button>
                <button 
                  onClick={() => navigate('/bidder/register')}
                  className="w-full py-2.5 rounded-lg bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700"
                >
                  Bidder Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ─── 3. HERO SECTION (ULTRA-LUXURY GLASSMORPHIC COMMAND CENTER) ───── */}
      <section id="overview" className="relative min-h-[660px] lg:min-h-[720px] flex items-center overflow-hidden py-14">
        
        {/* Background Refinery Image with Deep Cinema Glow */}
        <div className="absolute inset-0 z-0 select-none">
          <img 
            src="/cpcl-refinery-hero.jpg" 
            alt="CPCL Manali Refinery Infrastructure" 
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 opacity-35"
          />
          {/* Subtle Cyber Grid Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(#00A3E0_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#040918]/95 to-[#030712]/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-[#030712]/90" />
        </div>

        {/* Location Badge */}
        <div className="absolute top-6 right-6 sm:right-12 z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          <span className="font-semibold text-white">CPCL Manali Refinery Enclave</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Cauvery Basin Project</span>
        </div>

        {/* Hero Content Grid */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Text & High-Impact CTAs */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Sovereign Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-sky-950/70 border border-sky-500/30 text-sky-400 text-[11px] font-bold tracking-wider uppercase shadow-lg shadow-sky-950/50">
              <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" />
              <span>AUTONOMOUS AI PROCUREMENT DEFENSE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span className="text-emerald-400 font-mono">v3.2 PROD</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black text-white tracking-tight leading-[1.12]">
              Smarter Scrutiny.<br />
              <span className="bg-gradient-to-r from-[#00A3E0] via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                Zero-Leakage Compliance.
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
              Eliminate technical evaluation backlogs and prevent statutory fraud. Accelerate 500+ page PSU tender scrutiny from 18 days to 1.4 days with multi-modal AI OCR, live GSTN/MCA cross-checks, and immutable SHA-256 audit trails.
            </p>

            {/* High-Impact Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/officer/login')}
                className="px-6 py-3.5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#0066FF] to-[#00A3E0] hover:from-[#0055D4] hover:to-[#0284c7] shadow-xl shadow-blue-600/35 hover:shadow-blue-600/60 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5 group cursor-pointer border border-sky-300/30"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Launch Officer Console</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setHowItWorksModalOpen(true)}
                className="px-5 py-3.5 rounded-xl font-bold text-xs text-slate-200 hover:text-white bg-[#07132B]/80 hover:bg-[#0B1E45] border border-slate-700/80 shadow-md hover:border-sky-500/50 transition-all flex items-center gap-2.5 cursor-pointer backdrop-blur-md"
              >
                <div className="w-5 h-5 rounded-full bg-blue-900/60 border border-blue-500/40 flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-current text-sky-400" />
                </div>
                <span>Architecture Walkthrough</span>
              </button>
            </div>

            {/* Feature Highlights Sub-strip */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800/80 text-xs select-none">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300 text-[11px] font-medium">GFR 2017 R144(xi)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300 text-[11px] font-medium">ICAI UDIN Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300 text-[11px] font-medium">100% Officer Led</span>
              </div>
            </div>

          </div>

          {/* Right Column: Live Simulated Sovereign AI Scrutiny Deck */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            
            {/* ─── LIVE AI VERIFICATION TERMINAL CARD ──────────────── */}
            <div className="rounded-2xl bg-[#061026]/90 backdrop-blur-2xl border border-sky-500/35 shadow-2xl p-5 text-xs text-white relative group hover:border-sky-500/60 transition-all">
              
              {/* Pulsing Scan Beam */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00A3E0] to-transparent opacity-80 animate-pulse" />

              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <div className="flex items-center gap-2 pl-2">
                    <Terminal className="w-3.5 h-3.5 text-sky-400" />
                    <span className="font-mono font-bold text-slate-200 text-[11px] tracking-wide">
                      AI ENGINE: CPCL/PROC/2026/128
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>AUTONOMOUS AUDIT</span>
                </div>
              </div>

              {/* Bidder Identification Sub-bar */}
              <div className="my-3 p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">Target Tender Submission</div>
                  <div className="font-bold text-white text-xs">Shakti Pipeline Engineering Ltd.</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Bid Security (EMD)</div>
                  <div className="font-mono font-bold text-emerald-400 text-xs">₹48.00 Lakh (BG Verified)</div>
                </div>
              </div>

              {/* Verification Checklist Items */}
              <div className="space-y-2 py-1">
                {/* Check 1 */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 hover:bg-slate-800/60 transition-colors border border-slate-800/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-200 text-xs">GSTIN 33AABCS1429B1ZX (Tamil Nadu)</div>
                      <div className="text-[10px] text-slate-400">Active · Regular · Zero Return Defaults (24M)</div>
                    </div>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold text-[11px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    MATCH 100%
                  </span>
                </div>

                {/* Check 2 */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 hover:bg-slate-800/60 transition-colors border border-slate-800/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-200 text-xs">ICAI CA Turnover Certificate (UDIN)</div>
                      <div className="text-[10px] text-slate-400">UDIN 26042158AAAAAB1234 · ₹52.40 Cr Avg Turnover</div>
                    </div>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold text-[11px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    GENUINE
                  </span>
                </div>

                {/* Check 3 */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 hover:bg-slate-800/60 transition-colors border border-slate-800/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-200 text-xs">Make in India Local Content (58.4%)</div>
                      <div className="text-[10px] text-amber-300">Exceeds 50% Threshold · Requires Auditor Attestation</div>
                    </div>
                  </div>
                  <span className="text-amber-400 font-mono font-bold text-[11px] bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                    FLAGGED REVIEW
                  </span>
                </div>
              </div>

              {/* Live Metric KPIs & Confidence Gauge */}
              <div className="grid grid-cols-4 gap-2 pt-3 mt-2 border-t border-slate-800 text-center">
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Compliance</div>
                  <div className="text-sm font-extrabold text-emerald-400 mt-0.5">94.8%</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">OCR Speed</div>
                  <div className="text-sm font-extrabold text-sky-400 mt-0.5">1.4s</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Fields</div>
                  <div className="text-sm font-extrabold text-white mt-0.5">1,248</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Risk Radar</div>
                  <div className="text-sm font-extrabold text-emerald-400 mt-0.5">LOW</div>
                </div>
              </div>

              {/* View Evidence Action Link */}
              <div className="mt-3.5 pt-2 flex items-center justify-between">
                <div className="text-[10px] font-mono text-slate-500">
                  SHA-256: 7f8a9e21b4e7...
                </div>
                <button
                  onClick={() => setEvidenceModalOpen(true)}
                  className="text-sky-400 hover:text-sky-300 font-bold text-xs inline-flex items-center gap-1.5 transition-colors group/btn cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform text-sky-400" />
                  <span>Inspect Evidence Dossier →</span>
                </button>
              </div>

            </div>

            {/* Quick Two-Chip Strip Below Terminal */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#061026]/70 border border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-sky-400 shrink-0">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs">Automated CSQ</div>
                  <div className="text-[10px] text-slate-400">Commercial Comparative Stmt</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#061026]/70 border border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs">CVC Vigilance Guard</div>
                  <div className="text-[10px] text-slate-400">Cartel & Ring Detection</div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ─── 4. SOVEREIGN METRICS STRIP ───────────────────────────────────── */}
      <section className="relative z-20 -mt-2 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="rounded-2xl bg-gradient-to-b from-[#08132B] to-[#050C1F] border border-sky-500/25 shadow-2xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80 backdrop-blur-xl">
          
          {/* Metric 1 */}
          <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-4 first:pl-0 hover:bg-slate-900/40 p-2 rounded-xl transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg shadow-cyan-950/50">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white tracking-tight">₹2,480+ Cr</div>
              <div className="text-xs text-slate-300 font-semibold mt-0.5">Tender Volume Audited</div>
              <div className="text-[10px] text-emerald-400 font-mono">Zero Statutory Violation</div>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-4 hover:bg-slate-900/40 p-2 rounded-xl transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-950/50">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white tracking-tight">98.5%</div>
              <div className="text-xs text-slate-300 font-semibold mt-0.5">Multi-Modal Extraction</div>
              <div className="text-[10px] text-sky-400 font-mono">500+ Pages/Second</div>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-4 hover:bg-slate-900/40 p-2 rounded-xl transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 shadow-lg shadow-blue-950/50">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white tracking-tight">1.4 Days</div>
              <div className="text-xs text-slate-300 font-semibold mt-0.5">Scrutiny Turnaround</div>
              <div className="text-[10px] text-amber-400 font-mono">Reduced from 18 Days</div>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-4 last:pr-0 hover:bg-slate-900/40 p-2 rounded-xl transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 shadow-lg shadow-purple-950/50">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white tracking-tight">100%</div>
              <div className="text-xs text-slate-300 font-semibold mt-0.5">SHA-256 Audit Seal</div>
              <div className="text-[10px] text-purple-400 font-mono">Permanent Evidentiary Trail</div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 5. THE PROCUREMENT CHALLENGE & TRANSFORMATION ───────────────── */}
      <section id="pipeline" className="py-24 px-6 sm:px-8 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-sky-950/70 border border-sky-500/30 text-sky-400 text-[10px] font-bold uppercase tracking-wider mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>THE SOVEREIGN PROCUREMENT CHALLENGE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              From Manual Vulnerability to AI Certainty.
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed mt-2">
              Public sector refining tenders attract hundreds of multi-document bids. Manual scrutiny introduces risks of forged UDINs, turnover inflation, and collusion.
            </p>
          </div>

          <button 
            onClick={() => setHowItWorksModalOpen(true)}
            className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>Read Architecture Specs</span>
            <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
          </button>
        </div>

        {/* 4 Cards Grid with High-Tech Dark Aesthetic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 01 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#071126] to-[#040A18] border border-slate-800/90 hover:border-sky-500/50 transition-all flex flex-col justify-between group shadow-xl hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-sm font-mono font-black text-slate-500">01</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Massive Document Scale</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Over 500+ pages of scanned balance sheets, work orders, test reports, and CA certificates per bidder.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-800/80 text-[11px] font-mono text-sky-400 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>Multi-Modal OCR resolves in 1.4s</span>
            </div>
          </div>

          {/* Card 02 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#071126] to-[#040A18] border border-slate-800/90 hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-xl hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <span className="text-sm font-mono font-black text-slate-500">02</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Forged CA Certificates</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Fraudulent turnover letters and invalid ICAI UDINs historically passed manual committee checks.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-800/80 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>Direct ICAI registry verification</span>
            </div>
          </div>

          {/* Card 03 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#071126] to-[#040A18] border border-slate-800/90 hover:border-rose-500/50 transition-all flex flex-col justify-between group shadow-xl hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <span className="text-sm font-mono font-black text-slate-500">03</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Cartels & Common Directors</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bidders operating under separate trade names with shared PANs, IP addresses, or director registries.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-800/80 text-[11px] font-mono text-rose-400 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>Graph collusion detector</span>
            </div>
          </div>

          {/* Card 04 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#071126] to-[#040A18] border border-slate-800/90 hover:border-emerald-500/50 transition-all flex flex-col justify-between group shadow-xl hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Scale className="w-5 h-5" />
                </div>
                <span className="text-sm font-mono font-black text-slate-500">04</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Statutory Audit Exposure</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Post-award RTI inquiries, CAG audits, and CVC scrutiny demand explainable, unalterable proof trails.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-800/80 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>SHA-256 Merkle root ledger</span>
            </div>
          </div>

        </div>

      </section>

      {/* ─── 6. INTERACTIVE 7-STAGE SOVEREIGN PIPELINE ────────────────────── */}
      <section className="py-20 bg-[#020716] border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-950/70 border border-blue-500/30 text-sky-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>END-TO-END VERIFICATION WORKFLOW</span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">
                The 7-Stage Sovereign Scrutiny Pipeline.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed mt-1">
                Deterministic rules guarantee 0% hallucination. Click any phase below to inspect the Officer duty vs. Autonomous AI role.
              </p>
            </div>

            {/* Core Principle Pill Card */}
            <div className="p-4 rounded-xl bg-[#061226] border border-sky-500/30 flex items-center gap-3.5 max-w-md shrink-0 shadow-lg">
              <div className="w-10 h-10 rounded-lg bg-blue-950/90 border border-blue-500/40 flex items-center justify-center text-sky-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">AI assists. Rules validate. Officers decide.</div>
                <div className="text-[11px] text-slate-400">Total statutory alignment with GFR 2017 & CVC procurement code.</div>
              </div>
            </div>
          </div>

          {/* 7 Workflow Step Cards Rail */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5">
            {workflowSteps.map((step, idx) => {
              const IconComp = step.icon;
              const isActive = activeWorkflowStep === idx;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveWorkflowStep(idx)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between group ${
                    isActive 
                      ? 'bg-gradient-to-b from-[#0C1F45] to-[#07132B] border-sky-400 shadow-xl shadow-sky-500/20 scale-[1.03]' 
                      : 'bg-[#050E20] border-slate-800/80 hover:border-slate-700 hover:bg-[#071328]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        step.color === 'cyan' 
                          ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-400'
                          : step.color === 'emerald'
                          ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-400'
                          : step.color === 'amber'
                          ? 'bg-amber-950/80 border border-amber-500/40 text-amber-400'
                          : 'bg-blue-950/80 border border-blue-500/40 text-blue-400'
                      }`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono font-black text-slate-500 group-hover:text-slate-300">
                        {step.num}
                      </span>
                    </div>
                    <div className="text-xs font-extrabold text-white leading-snug">
                      {step.title}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-snug font-normal line-clamp-2">
                      {step.desc}
                    </p>
                  </div>
                  {isActive && (
                    <div className="mt-3 text-[10px] text-sky-400 font-bold flex items-center gap-1">
                      <span>Active Drawer</span>
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Expandable Step Detail Drawer */}
          {activeWorkflowStep !== null && (
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-[#07132B] to-[#040A18] border border-sky-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded bg-blue-500/20 text-sky-400 font-mono text-[10px] font-bold border border-sky-500/30">
                    STAGE {workflowSteps[activeWorkflowStep].num} DEEP DIVE
                  </span>
                  <span className="text-base font-bold text-white">{workflowSteps[activeWorkflowStep].title}</span>
                </div>
                <div className="text-xs text-slate-200 leading-relaxed">
                  <strong className="text-sky-400 font-semibold">Procurement Officer Role:</strong> {workflowSteps[activeWorkflowStep].officerDuty}
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-emerald-400 font-semibold">Autonomous AI Verification:</strong> {workflowSteps[activeWorkflowStep].aiDuty}
                </div>
              </div>
              <button
                onClick={() => setEvidenceModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0055D4] text-white font-bold text-xs transition-colors shrink-0 cursor-pointer shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Stage Evidence</span>
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ─── 7. DUAL COMMAND CENTERS (OFFICER VS BIDDER) ─────────────────── */}
      <section id="portals" className="py-24 px-6 sm:px-8 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-sky-950/70 border border-sky-500/30 text-sky-400 text-[10px] font-bold uppercase tracking-wider mb-2">
            <Radio className="w-3.5 h-3.5 text-sky-400" />
            <span>PORTAL ECOSYSTEM</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Tailored Experiences for Every Stakeholder.
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Procurement officers gain deep audit clarity, while bidders experience a guided, pre-validated application process.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* ─── PANEL 1: FOR PROCUREMENT OFFICERS ────────────────── */}
          <div className="rounded-2xl bg-gradient-to-b from-[#08132B] to-[#040A18] border border-sky-500/30 p-7 sm:p-8 flex flex-col justify-between hover:border-sky-500/60 transition-all shadow-2xl group">
            <div>
              {/* Header Pill */}
              <div className="flex items-center justify-between mb-4">
                <div className="inline-block px-3 py-1 rounded-md bg-blue-950/80 border border-blue-500/40 text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                  FOR PROCUREMENT OFFICERS & COMMITTEES
                </div>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  RESTRICTED ENCLAVE
                </span>
              </div>

              {/* Title & Desc */}
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">
                Procurement Command & Scrutiny Center.
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Manage tenders, inspect automated discrepancy matrices, review flagged cartels, and issue CVC-compliant awards.
              </p>

              {/* Mini Dashboard Widget Preview */}
              <div className="rounded-xl bg-[#030814] border border-slate-800 p-4 text-[11px] mb-6">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-3">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-sky-400" />
                    <span>Real-Time Scrutiny Stream</span>
                  </span>
                  <span className="text-xs font-mono text-sky-400">48 Active Tenders</span>
                </div>

                {/* 3 Metric Pills */}
                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <div className="font-black text-white text-base">₹2,480 Cr</div>
                    <div className="text-[9px] text-slate-400">Audited Value</div>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <div className="font-black text-amber-400 text-base">12 Bids</div>
                    <div className="text-[9px] text-slate-400">In Review</div>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <div className="font-black text-rose-400 text-base">3 Flags</div>
                    <div className="text-[9px] text-slate-400">Cartel Alerts</div>
                  </div>
                </div>

                {/* Mini Bar Chart */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>Monthly Compliance Rate</span>
                  <span className="text-emerald-400 font-bold">98.5% Avg</span>
                </div>
                <div className="h-16 flex items-end justify-between gap-1.5 pt-1 px-1 bg-slate-950/60 rounded-lg p-2">
                  {complianceMonthlyData.map((item, i) => (
                    <div 
                      key={i} 
                      className="flex-1 flex flex-col items-center gap-1 cursor-pointer relative group/bar"
                      onMouseEnter={() => setHoveredBarIndex(i)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                    >
                      {hoveredBarIndex === i && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-20">
                          {item.month}: {item.value}%
                        </div>
                      )}
                      <div 
                        className="w-full bg-gradient-to-t from-blue-600 to-sky-400 group-hover/bar:from-sky-400 group-hover/bar:to-cyan-300 rounded-t transition-colors"
                        style={{ height: `${item.value}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/officer/login')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00A3E0] hover:from-[#0055D4] hover:to-[#0284c7] text-white font-bold text-xs shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Access Officer Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* ─── PANEL 2: FOR BIDDERS / APPLICANTS ─────────────────── */}
          <div className="rounded-2xl bg-gradient-to-b from-[#08132B] to-[#040A18] border border-emerald-500/30 p-7 sm:p-8 flex flex-col justify-between hover:border-emerald-500/60 transition-all shadow-2xl group">
            <div>
              {/* Header Pill */}
              <div className="flex items-center justify-between mb-4">
                <div className="inline-block px-3 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  FOR BIDDERS, VENDORS & SUPPLIERS
                </div>
                <span className="text-[10px] font-mono text-emerald-400">
                  SELF-SERVE PORTAL
                </span>
              </div>

              {/* Title & Desc */}
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">
                Guaranteed Pre-Flight Verification.
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Eliminate bid rejections before submission. Pre-validate GST, PAN, and CA UDIN documents against CPCL criteria in real-time.
              </p>

              {/* Mini Applications Preview */}
              <div className="rounded-xl bg-[#030814] border border-slate-800 p-4 text-[11px] mb-6">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2.5">
                  <span className="font-bold text-slate-200">My Bid Dossiers</span>
                  <div className="flex gap-1">
                    {['All', 'Active', 'Under Review'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setBidderAppFilter(tab)}
                        className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-colors ${
                          bidderAppFilter === tab 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtered Application Rows */}
                <div className="space-y-2">
                  {filteredBidderApps.map((app) => (
                    <div 
                      key={app.id} 
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 transition-colors"
                    >
                      <div>
                        <div className="font-bold text-white text-xs">{app.id}</div>
                        <div className="text-slate-400 text-[10px]">{app.title}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${app.badgeClass}`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/bidder/login')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Enter Bidder Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </section>

      {/* ─── 8. ACTIVE PUBLIC TENDERS MARKETPLACE ─────────────────────────── */}
      <section id="tenders" className="py-20 px-6 sm:px-8 max-w-7xl mx-auto">
        
        {/* Header with Search & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-sky-950/70 border border-sky-500/30 text-sky-400 text-[10px] font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>ACTIVE PUBLIC PROCUREMENT OPPORTUNITIES</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              CPCL Open Tenders Catalog.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mt-1">
              Browse sovereign tenders issued by Chennai Petroleum Corporation Limited with automated eligibility pre-checks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                id="tender-search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tenders (Press /)"
                className="w-full sm:w-64 pl-8 pr-8 py-2.5 bg-[#061024] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors shadow-inner"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#061024] border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="All Categories">All Categories</option>
              <option value="Mechanical Equipment">Mechanical Equipment</option>
              <option value="Maintenance Services">Maintenance Services</option>
              <option value="Industrial Goods">Industrial Goods</option>
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#061024] border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="OPEN">Open</option>
            </select>
          </div>
        </div>

        {/* 3 Tender Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTenders.map((tender) => (
            <div
              key={tender.id}
              className="p-6 rounded-2xl bg-gradient-to-b from-[#07132B] to-[#040A18] border border-slate-800/90 hover:border-sky-500/50 hover:bg-[#091938] transition-all flex flex-col justify-between group shadow-xl hover:-translate-y-1"
            >
              <div>
                {/* Status + Reference */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                      tender.badgeColor === 'emerald' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {tender.badge}
                    </span>
                    <button
                      onClick={() => handleCopyTenderId(tender.reference_number)}
                      title="Click to copy tender ID"
                      className="text-[11px] font-mono text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>{tender.reference_number}</span>
                      {copiedTenderId === tender.reference_number && (
                        <span className="text-[9px] text-emerald-400 font-bold">✓ Copied</span>
                      )}
                    </button>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    STAGE {tender.code}
                  </span>
                </div>

                {/* Tender Title */}
                <h3 className="text-base font-bold text-white mb-4 leading-snug group-hover:text-sky-300 transition-colors">
                  {tender.title}
                </h3>

                {/* Metadata Grid */}
                <div className="grid grid-cols-3 gap-2 pb-4 border-b border-slate-800/80 text-[11px]">
                  <div>
                    <div className="text-slate-500 text-[10px]">Category</div>
                    <div className="text-slate-200 font-semibold truncate mt-0.5">{tender.category}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px]">Estimated Budget</div>
                    <div className="text-emerald-400 font-extrabold mt-0.5">{tender.estimated_value_display}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px]">Submission Due</div>
                    <div className="text-slate-200 font-semibold mt-0.5">{tender.deadline}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mt-3 leading-relaxed">
                  {tender.description}
                </p>
              </div>

              {/* View Tender Action */}
              <div className="pt-5 mt-3 flex items-center justify-between">
                <button
                  onClick={() => setSelectedTenderModal(tender)}
                  className="text-xs font-bold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer group/link"
                >
                  <span>Check Eligibility</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/bidder/login')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ─── 9. STATUTORY TRUST & SOVEREIGN COMPLIANCE MATRIX ─────────────── */}
      <section id="trust" className="py-20 bg-[#02050E] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SOVEREIGN TRUST & STATUTORY ACCREDITATION</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Built Strictly for Indian Public Sector Mandates.
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Fully compliant with Central Vigilance Commission (CVC) standards, General Financial Rules (GFR 2017), and Gazette of India mandates.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center flex flex-col items-center">
              <Landmark className="w-6 h-6 text-sky-400 mb-2" />
              <div className="text-xs font-bold text-white">GFR 2017</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Rule 144(xi) Guard</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center flex flex-col items-center">
              <Scale className="w-6 h-6 text-emerald-400 mb-2" />
              <div className="text-xs font-bold text-white">CVC Guidelines</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Integrity & Vigilance</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center flex flex-col items-center">
              <Award className="w-6 h-6 text-amber-400 mb-2" />
              <div className="text-xs font-bold text-white">Make in India</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Class-1 Supplier Ratio</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center flex flex-col items-center">
              <Fingerprint className="w-6 h-6 text-purple-400 mb-2" />
              <div className="text-xs font-bold text-white">ICAI UDIN</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Gazette Certified CA</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center flex flex-col items-center">
              <Building2 className="w-6 h-6 text-cyan-400 mb-2" />
              <div className="text-xs font-bold text-white">GSTN Registry</div>
              <div className="text-[10px] text-slate-400 mt-0.5">24-Month Tax Check</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center flex flex-col items-center">
              <Lock className="w-6 h-6 text-rose-400 mb-2" />
              <div className="text-xs font-bold text-white">SHA-256 Ledger</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Immutable Merkle Proof</div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 10. REFINED SOVEREIGN FOOTER ─────────────────────────────────── */}
      <footer className="bg-[#01040A] text-slate-400 pt-16 pb-12 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-900 text-xs">
            
            {/* Brand Column */}
            <div className="md:col-span-4 space-y-3">
              <div className="flex items-center gap-3">
                <CpclEmblem size={42} />
                <div>
                  <div className="font-black text-white text-base leading-none">CPCL</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Chennai Petroleum Corporation Limited</div>
                  <div className="text-[10px] text-sky-400 font-semibold">Autonomous Sovereign Procurement Platform</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-sm">
                A premier refining PSU under the administrative jurisdiction of the Ministry of Petroleum & Natural Gas, Government of India.
              </p>
              <div className="text-[10px] text-slate-500 font-mono">
                Manali Refinery Enclave, Chennai - 600 068, Tamil Nadu
              </div>
            </div>

            {/* Platform links */}
            <div className="md:col-span-2 space-y-2">
              <div className="font-bold text-slate-200">Architecture</div>
              <ul className="space-y-1.5 text-slate-400">
                <li><a href="#pipeline" className="hover:text-white transition-colors">OCR Engine</a></li>
                <li><a href="#pipeline" className="hover:text-white transition-colors">Deterministic Rules</a></li>
                <li><a href="#pipeline" className="hover:text-white transition-colors">Fraud Detection</a></li>
                <li><button onClick={() => setEvidenceModalOpen(true)} className="hover:text-white transition-colors cursor-pointer">Audit Proof</button></li>
              </ul>
            </div>

            {/* Officer Links */}
            <div className="md:col-span-2 space-y-2">
              <div className="font-bold text-slate-200">For Officers</div>
              <ul className="space-y-1.5 text-slate-400">
                <li><button onClick={() => navigate('/officer/login')} className="hover:text-white transition-colors cursor-pointer">Officer Login</button></li>
                <li><button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors cursor-pointer">Procurement Deck</button></li>
                <li><button onClick={() => navigate('/officer/login')} className="hover:text-white transition-colors cursor-pointer">Scrutiny Reports</button></li>
                <li><button onClick={() => navigate('/officer/register')} className="hover:text-white transition-colors cursor-pointer">Committee Access</button></li>
              </ul>
            </div>

            {/* Bidder Links */}
            <div className="md:col-span-2 space-y-2">
              <div className="font-bold text-slate-200">For Bidders</div>
              <ul className="space-y-1.5 text-slate-400">
                <li><a href="#tenders" className="hover:text-white transition-colors">Active Tenders</a></li>
                <li><button onClick={() => navigate('/bidder/login')} className="hover:text-white transition-colors cursor-pointer">Bidder Login</button></li>
                <li><button onClick={() => navigate('/bidder/register')} className="hover:text-white transition-colors cursor-pointer">Supplier Sign Up</button></li>
                <li><button onClick={() => navigate('/bidder-portal')} className="hover:text-white transition-colors cursor-pointer">My Applications</button></li>
              </ul>
            </div>

            {/* Sovereign Portals Interop */}
            <div className="md:col-span-2 space-y-3">
              <div className="font-bold text-slate-200">National Portals</div>
              <ul className="space-y-1.5 text-slate-400">
                <li><a href="https://gem.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">GeM Portal <ExternalLink className="w-2.5 h-2.5" /></a></li>
                <li><a href="https://eprocure.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">CPPP India <ExternalLink className="w-2.5 h-2.5" /></a></li>
                <li><a href="https://cvc.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">CVC Vigilance <ExternalLink className="w-2.5 h-2.5" /></a></li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
            <div>
              © 2026 Chennai Petroleum Corporation Limited (CPCL). All rights reserved.
            </div>
            <div className="flex items-center gap-5 text-slate-400">
              <button onClick={() => alert('CPCL complies with the Information Technology Act 2000 and Digital Personal Data Protection Act 2023.')} className="hover:text-white transition-colors cursor-pointer">Privacy Protocol</button>
              <button onClick={() => alert('Governed under General Financial Rules (GFR 2017) and CPCL Procurement Manual.')} className="hover:text-white transition-colors cursor-pointer">Terms of Procurement</button>
              <button onClick={() => setEvidenceModalOpen(true)} className="hover:text-white transition-colors cursor-pointer">Cryptographic Assurance</button>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors cursor-pointer">Back to Top ↑</button>
            </div>
          </div>

        </div>
      </footer>

      {/* ─── MODAL 1: HOW IT WORKS WALKTHROUGH ────────────────────────────── */}
      {howItWorksModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#071126] rounded-2xl max-w-2xl w-full border border-sky-500/40 shadow-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setHowItWorksModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold mb-1">
              <Cpu className="w-4 h-4" />
              <span>PLATFORM ARCHITECTURE & STATUTORY PIPELINE</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">How CPCL BidVerify AI Works</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Designed according to General Financial Rules (GFR 2017) and Central Vigilance Commission (CVC) standards for total audit transparency.
            </p>

            <div className="space-y-3.5 text-xs">
              
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold shrink-0 text-xs font-mono">
                  01
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Bid Upload & Pre-Flight Validation</h4>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                    Bidders upload their technical and financial submissions. The platform executes immediate integrity scans, verifies PDF digital signatures, and ensures files meet CPCL tender criteria.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold shrink-0 text-xs font-mono">
                  02
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Multi-Modal OCR & Field Extraction</h4>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                    Scanned certificates (GST, PAN, Audited Balance Sheets, CA UDINs) are digitized with 98.5% precision. Over 1,200 entities are indexed with bounding box citations.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold shrink-0 text-xs font-mono">
                  03
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Deterministic Rule Compliance Engine</h4>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                    Pre-set public sector rules test minimum turnover thresholds, local supplier ratios (Make in India), and statutory safety clearances without hallucination.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0 text-xs font-mono">
                  04
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Officer Scrutiny & Cryptographic Audit Ledger</h4>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                    Procurement Officers make the final determination with explainable AI evidence. Every decision is sealed in a SHA-256 Merkle ledger for permanent scrutiny defense.
                  </p>
                </div>
              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setHowItWorksModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0055D4] text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Close Walkthrough
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: TENDER DETAILS MODAL ───────────────────────────────── */}
      {selectedTenderModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#071126] rounded-2xl max-w-xl w-full border border-sky-500/40 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedTenderModal(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                selectedTenderModal.badgeColor === 'emerald'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                {selectedTenderModal.badge}
              </span>
              <span className="text-xs font-mono text-slate-400">{selectedTenderModal.reference_number}</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-3">{selectedTenderModal.title}</h3>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#030814] border border-slate-800 text-xs mb-4">
              <div>
                <span className="text-slate-500 text-[10px]">Estimated Contract Value:</span>
                <div className="text-base font-bold text-emerald-400">{selectedTenderModal.estimated_value_display}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">Submission Deadline:</span>
                <div className="text-base font-semibold text-white">{selectedTenderModal.deadline}</div>
              </div>
            </div>

            <div className="space-y-3.5 text-xs mb-6">
              <div>
                <div className="font-bold text-slate-300 mb-1">Scope of Work Specification:</div>
                <p className="text-slate-400 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  {selectedTenderModal.description}
                </p>
              </div>

              <div>
                <div className="font-bold text-slate-300 mb-1.5">Mandatory Statutory Eligibility Criteria:</div>
                <div className="space-y-1.5">
                  {selectedTenderModal.eligibility?.map((e, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-300 bg-slate-900/40 p-2 rounded-lg border border-slate-800/60">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{e}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-sky-200 text-[11px]">
                💡 <strong>Pre-Submission Verification Guarantee:</strong> All required documents (GSTIN, PAN, CA UDIN, and Work Completion) will be validated automatically before final submission.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedTenderModal(null)}
                className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Close Notice
              </button>
              <button
                onClick={() => {
                  setSelectedTenderModal(null);
                  navigate('/bidder/login');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0055D4] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer"
              >
                <span>Proceed to Bid</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: CRYPTOGRAPHIC EVIDENCE AUDIT TRAIL ─────────────────── */}
      {evidenceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#071126] rounded-2xl max-w-xl w-full border border-sky-500/40 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEvidenceModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>CRYPTOGRAPHIC EVIDENCE AUDIT TRAIL</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Shakti Engineering Bid Package #128</h3>
            <p className="text-xs text-slate-400 mb-4">
              CPCL Refinery Unit-3 Hydrocracker Scrutiny Ledger · Manali Complex
            </p>

            {/* Evidence Modal Interactive Tabs */}
            <div className="flex gap-2 pb-3 border-b border-slate-800 mb-4 text-xs font-semibold">
              <button
                onClick={() => setActiveEvidenceTab('udin')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeEvidenceTab === 'udin' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                ICAI UDIN Proof
              </button>
              <button
                onClick={() => setActiveEvidenceTab('gst')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeEvidenceTab === 'gst' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                GSTIN & PAN
              </button>
              <button
                onClick={() => setActiveEvidenceTab('hash')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeEvidenceTab === 'hash' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                Merkle Hash
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              
              {activeEvidenceTab === 'hash' && (
                <div className="p-3.5 rounded-xl bg-[#030814] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>SHA-256 IMMUTABLE LEDGER HASH:</span>
                    <button onClick={handleCopyHash} className="text-sky-400 hover:underline font-bold flex items-center gap-1 cursor-pointer">
                      <Copy className="w-3 h-3" />
                      {copiedHash ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="font-mono text-sky-300 text-[11px] break-all bg-slate-950 p-2.5 rounded border border-slate-900 select-all">
                    7f8a9e21b4e7c3d5a6b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0
                  </div>
                  <p className="text-[10px] text-slate-500">
                    This cryptographic hash guarantees that zero alterations can be made after submission without invalidating the audit chain.
                  </p>
                </div>
              )}

              {activeEvidenceTab === 'udin' && (
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-200">
                    <span>ICAI UDIN Verification:</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                      GENUINE UDIN
                    </span>
                  </div>
                  <div className="text-slate-300">
                    UDIN: <strong className="text-white font-mono">26042158AAAAAB1234</strong>
                  </div>
                  <div className="text-slate-300">
                    Certifying CA: <strong className="text-white">R. Sundaram & Associates (FCA 042158)</strong>
                  </div>
                  <div className="text-slate-300">
                    Certified Turnover: <strong className="text-white">₹52.40 Cr</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] mt-2">
                    ✓ <strong>Statutory Turnover Satisfied:</strong> Exceeds CPCL threshold of ₹50.00 Cr for high-pressure pipeline contracts.
                  </div>
                </div>
              )}

              {activeEvidenceTab === 'gst' && (
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-200">
                    <span>GSTIN REG-06 Verification:</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                      ACTIVE & COMPLIANT
                    </span>
                  </div>
                  <div className="text-slate-300">
                    GSTIN: <strong className="text-white font-mono">33AABCS1429B1ZX</strong> (Tamil Nadu)
                  </div>
                  <div className="text-slate-300">
                    PAN: <strong className="text-white font-mono">AABCS1429B</strong> (Corporate Match)
                  </div>
                  <div className="text-slate-300">
                    Taxpayer Status: <strong className="text-emerald-400">Active · Regular</strong> (Zero defaults in last 24 months)
                  </div>
                </div>
              )}

            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-500 text-[11px]">CVC Audit Record #AUD-2026-992</span>
              <button
                onClick={() => setEvidenceModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── FLOATING BACK TO TOP BUTTON ─────────────────────────────────── */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white shadow-2xl shadow-blue-600/50 hover:scale-110 active:scale-95 transition-all cursor-pointer border border-sky-400/40"
          title="Back to Top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
}
