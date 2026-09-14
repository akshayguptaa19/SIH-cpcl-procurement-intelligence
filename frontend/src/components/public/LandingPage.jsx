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
  FileSignature, CheckSquare, ArrowLeftRight, ChevronLeft
} from 'lucide-react';

// ─── CPCL CIRCULAR EMBLEM SVG ──────────────────────────────────────────
export function CpclEmblem({ size = 42, className = "" }) {
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
      <circle cx="50" cy="50" r="48" fill="#0A1628" stroke="#38BDF8" strokeWidth="2.5" />
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
function IndiaGovEmblem({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-slate-400">
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
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(null);
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

  // Exact 3 Tenders from Reference Image
  const defaultTenders = [
    {
      id: 't-128',
      reference_number: 'CPCL/PROC/2026/128',
      title: 'Industrial Pipeline Equipment',
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
      title: 'Refinery Maintenance Services',
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
      title: 'Supply of High-Pressure Industrial Valves',
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

  // 7 Workflow Steps Data matching reference image
  const workflowSteps = [
    {
      num: '01',
      title: 'Tender',
      icon: FileText,
      color: 'blue',
      desc: 'Create and publish tender with eligibility requirements',
      officerDuty: 'Defines commercial specifications, turnover cut-offs, and GFR 2017 eligibility gates.',
      aiDuty: 'Cross-verifies clause consistency against CVC guidelines and GFR Rule 144(xi).'
    },
    {
      num: '02',
      title: 'Bid',
      icon: Building2,
      color: 'blue',
      desc: 'Submit application with required documents',
      officerDuty: 'Monitors aggregate incoming submission count while bids remain sealed and encrypted.',
      aiDuty: 'Performs pre-flight file integrity, virus scanning, and PDF format validation.'
    },
    {
      num: '03',
      title: 'Documents',
      icon: FileCode,
      color: 'blue',
      desc: 'Process with OCR and AI extraction',
      officerDuty: 'Reviews highlighted bounding box source citations for extracted entity parameters.',
      aiDuty: 'Extracts 500+ scanned pages in 1.4 seconds with 98.5% multi-modal accuracy.'
    },
    {
      num: '04',
      title: 'Compliance',
      icon: Scale,
      color: 'cyan',
      desc: 'Evaluate with deterministic rules',
      officerDuty: 'Inspects objective pass/fail scorecards mapped to CPCL tender conditions.',
      aiDuty: 'Executes programmatic rule engines with zero hallucinations or probabilistic errors.'
    },
    {
      num: '05',
      title: 'Risk',
      icon: AlertTriangle,
      color: 'blue',
      desc: 'Identify potential risk indicators',
      officerDuty: 'Examines flagged turnover anomalies, shell entities, or sudden balance sheet spikes.',
      aiDuty: 'Cross-checks live GSTIN active status, NSDL PAN, and ICAI UDIN registers.'
    },
    {
      num: '06',
      title: 'Officer Review',
      icon: UserCheck,
      color: 'cyan',
      desc: 'Review evidence and verify findings',
      officerDuty: 'Retains 100% statutory discretion to approve, seek clarifications, or disqualify.',
      aiDuty: 'Compiles consolidated explainable scrutiny reports with exact PDF citations.'
    },
    {
      num: '07',
      title: 'Decision',
      icon: CheckCircle2,
      color: 'emerald',
      desc: 'Make final decision with audit trail',
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
      badgeClass: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
      category: 'Under Review'
    },
    {
      id: 'CPCL/PROC/2026/147',
      title: 'Refinery Maintenance Services',
      status: 'Submitted',
      badgeClass: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      category: 'Active'
    },
    {
      id: 'CPCL/PROC/2026/152',
      title: 'Safety Equipment Supply',
      status: 'Draft',
      badgeClass: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
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
    { month: 'Jan', value: 35, verified: 18 },
    { month: 'Feb', value: 45, verified: 24 },
    { month: 'Mar', value: 60, verified: 36 },
    { month: 'Apr', value: 50, verified: 28 },
    { month: 'May', value: 75, verified: 45 },
    { month: 'Jun', value: 65, verified: 38 },
    { month: 'Jul', value: 80, verified: 48 },
    { month: 'Aug', value: 70, verified: 42 },
    { month: 'Sep', value: 95, verified: 58 },
    { month: 'Oct', value: 85, verified: 51 }
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

      {/* ─── 1. TOP GOVERNMENT BAR ────────────────────────────────────────── */}
      <div className="bg-[#02050E] text-slate-400 text-[11px] py-2 px-6 sm:px-8 border-b border-slate-900/90 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left Gov branding */}
          <div className="flex items-center gap-2.5">
            <IndiaGovEmblem size={15} />
            <span className="text-slate-200 font-medium tracking-tight">Government of India</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Ministry of Petroleum & Natural Gas</span>
          </div>

          {/* Center CPCL Title */}
          <div className="hidden md:block text-slate-300 font-medium tracking-tight">
            Chennai Petroleum Corporation Limited (CPCL)
          </div>

          {/* Right Security Status */}
          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
              <span>Secure Procurement Environment</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SHA-256 Secured</span>
            </div>
          </div>

        </div>
      </div>

      {/* ─── 2. MAIN NAVBAR ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#050B17]/95 backdrop-blur-md border-b border-slate-800/80 transition-all shadow-md shadow-black/20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <CpclEmblem size={44} className="group-hover:scale-105 transition-transform shrink-0 drop-shadow-md" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-lg font-black text-white tracking-wider">CPCL</span>
              </div>
              <span className="text-[11px] text-slate-400 leading-tight mt-0.5 font-medium">
                Chennai Petroleum Corporation Limited
              </span>
              <span className="text-[10px] text-sky-400 font-semibold tracking-tight uppercase">
                Sovereign Procurement
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#overview" className="text-white font-bold transition-colors hover:text-sky-400">Home</a>
            <a href="#workflow" className="hover:text-white transition-colors">How It Works</a>
            <a href="#tenders" className="hover:text-white transition-colors">Procurement</a>
            <a href="#challenge" className="hover:text-white transition-colors">About</a>
            <a href="#faq" className="hover:text-white transition-colors">Help</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Search icon button */}
            <button 
              onClick={() => {
                const el = document.getElementById('tender-search-input');
                el?.focus();
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              title="Search Tenders (Press /)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Bidder Login */}
            <button
              onClick={() => navigate('/bidder/login')}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 shadow-xs hover:border-slate-600 transition-all cursor-pointer"
            >
              Bidder Login
            </button>

            {/* Bidder Sign Up */}
            <button
              onClick={() => navigate('/bidder/register')}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 shadow-xs hover:border-slate-600 transition-all cursor-pointer"
            >
              Bidder Sign Up
            </button>

            {/* Officer Login (Primary Strongest CTA) */}
            <button
              onClick={() => navigate('/officer/login')}
              className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#0066FF] hover:bg-[#0055D4] shadow-md shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Officer Login
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
          <div className="lg:hidden bg-[#070F21] border-b border-slate-800 p-4 space-y-3 shadow-2xl">
            <a href="#overview" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-semibold text-white">Home</a>
            <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-semibold text-slate-300">How It Works</a>
            <a href="#tenders" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-semibold text-slate-300">Procurement</a>
            <a href="#challenge" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-semibold text-slate-300">About</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-semibold text-slate-300">Help</a>
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <button 
                onClick={() => navigate('/officer/login')}
                className="w-full py-2.5 rounded-lg bg-[#0066FF] text-white font-bold text-xs shadow-md shadow-blue-600/30"
              >
                Officer Login
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => navigate('/bidder/login')}
                  className="w-full py-2 rounded-lg bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700"
                >
                  Bidder Login
                </button>
                <button 
                  onClick={() => navigate('/bidder/register')}
                  className="w-full py-2 rounded-lg bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700"
                >
                  Bidder Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ─── 3. HERO SECTION ─────────────────────────────────────────────── */}
      <section id="overview" className="relative min-h-[580px] lg:min-h-[640px] flex items-center overflow-hidden">
        
        {/* Background Refinery Image with Deep Gradient Overlays */}
        <div className="absolute inset-0 z-0 select-none">
          <img 
            src="/cpcl-refinery-hero.jpg" 
            alt="CPCL Manali Refinery" 
            className="w-full h-full object-cover object-center scale-102 transition-transform duration-700 opacity-85"
          />
          {/* Dark cinematic gradient matching reference */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#050B17]/90 to-[#030712]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-[#030712]/40" />
        </div>

        {/* Location Caption Top Right */}
        <div className="absolute top-6 right-6 sm:right-12 z-10 text-right select-none">
          <div className="text-xs font-bold text-slate-200 tracking-wide">CPCL Manali Refinery</div>
          <div className="text-[10px] text-slate-400">Chennai, Tamil Nadu</div>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Hero Copy & CTA */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-950/70 border border-sky-500/30 text-sky-400 text-[10px] font-bold tracking-wider uppercase shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <span>AI-POWERED GOVERNMENT PROCUREMENT</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-white tracking-tight leading-[1.12]">
              Smarter Procurement.<br />
              <span className="text-[#38BDF8]">Stronger Compliance.</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-[15px] text-slate-300 font-normal leading-relaxed max-w-lg">
              Accelerate tender scrutiny, verify complex procurement documents and surface potential compliance risks through one secure, intelligent workspace.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <a
                href="#tenders"
                className="px-6 py-3 rounded-lg font-bold text-xs text-white bg-[#0066FF] hover:bg-[#0055D4] shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Explore Tenders</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={() => setHowItWorksModalOpen(true)}
                className="px-6 py-3 rounded-lg font-bold text-xs text-slate-200 hover:text-white bg-[#0B152A]/90 hover:bg-slate-800/90 border border-slate-700/80 shadow-sm hover:border-slate-600 transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center">
                  <Play className="w-2 h-2 fill-current text-slate-300" />
                </div>
                <span>How It Works</span>
              </button>
            </div>

            {/* Feature Sub-strip */}
            <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium pt-2 select-none">
              <div className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>AI-assisted</span>
              </div>
              <span className="text-slate-600">·</span>
              <div className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
                <FileCheck2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Evidence-based</span>
              </div>
              <span className="text-slate-600">·</span>
              <div className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
                <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Human-controlled</span>
              </div>
            </div>

          </div>

          {/* Right Column: AI Verification Product Card & Floating Cards */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 justify-end">
            
            {/* ─── MAIN AI VERIFICATION CARD ─────────────────────── */}
            <div className="w-full sm:w-[325px] rounded-2xl bg-[#081023]/90 backdrop-blur-xl border border-sky-500/30 shadow-2xl p-5 text-xs text-white relative group hover:border-sky-500/50 transition-all">
              
              {/* Subtle pulsing live scan bar */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-60 animate-pulse" />

              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-sky-400" />
                  <span className="font-bold text-slate-100 tracking-wide">AI VERIFICATION</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>✦ Live Analysis</span>
                </div>
              </div>

              {/* Checklist Rows with interactive hover feel */}
              <div className="py-3.5 space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800/40 transition-colors">
                  <span className="text-slate-300 font-medium">GST Certificate</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 font-mono text-[11px]">
                    <Check className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800/40 transition-colors">
                  <span className="text-slate-300 font-medium">PAN</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 font-mono text-[11px]">
                    <Check className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded hover:bg-amber-950/30 transition-colors">
                  <span className="text-slate-300 font-medium">Turnover Certificate</span>
                  <span className="text-amber-400 font-bold flex items-center gap-1 font-mono text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5" /> Review
                  </span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800/40 transition-colors">
                  <span className="text-slate-300 font-medium">Experience Certificate</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 font-mono text-[11px]">
                    <Check className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
              </div>

              {/* Score & Risk Footer Strip */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center">
                <div className="p-1 rounded bg-slate-900/50">
                  <div className="text-[10px] text-slate-400">Compliance</div>
                  <div className="text-sm font-bold text-white mt-0.5">94%</div>
                </div>
                <div className="p-1 rounded bg-slate-900/50">
                  <div className="text-[10px] text-slate-400">AI Confidence</div>
                  <div className="text-sm font-bold text-white mt-0.5">96%</div>
                </div>
                <div className="p-1 rounded bg-slate-900/50">
                  <div className="text-[10px] text-slate-400">Risk</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">LOW</div>
                </div>
              </div>

              {/* View Evidence Link */}
              <div className="mt-3 pt-2 text-center">
                <button
                  onClick={() => setEvidenceModalOpen(true)}
                  className="text-sky-400 hover:text-sky-300 font-semibold text-xs inline-flex items-center gap-1.5 transition-colors group/btn cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                  <span>View Evidence →</span>
                </button>
              </div>

            </div>

            {/* ─── STACKED FLOATING CARDS TO THE RIGHT ───────────── */}
            <div className="flex flex-col gap-3.5 w-full sm:w-[195px]">
              
              {/* Floating Card 1: Document Processing */}
              <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-[#08122A]/90 backdrop-blur-md border border-slate-700/70 shadow-xl text-xs hover:border-sky-500/40 transition-all group">
                <div className="w-9 h-9 rounded-lg bg-sky-950 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-[11px]">Document Processing</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">OCR Complete</div>
                  <div className="text-[9px] text-slate-400">1,248 fields extracted</div>
                </div>
              </div>

              {/* Floating Card 2: Audit Trail */}
              <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-[#08122A]/90 backdrop-blur-md border border-slate-700/70 shadow-xl text-xs hover:border-cyan-500/40 transition-all group">
                <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-[11px]">Audit Trail</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">Tamper-Evident</div>
                  <div className="text-[9px] text-slate-400">SHA-256 Secured</div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ─── 4. METRICS STRIP ────────────────────────────────────────────── */}
      <section className="relative z-20 -mt-2 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="rounded-2xl bg-[#070F22] border border-slate-800/90 shadow-xl p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
          
          {/* Metric 1 */}
          <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-4 first:pl-0 hover:bg-slate-900/30 p-2 rounded-xl transition-colors">
            <div className="w-11 h-11 rounded-xl bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-sm">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight">₹2,480+ Cr</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Tender Value Evaluated</div>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-4 hover:bg-slate-900/30 p-2 rounded-xl transition-colors">
            <div className="w-11 h-11 rounded-xl bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight">98.5%</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Multi-Modal OCR Accuracy</div>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-4 hover:bg-slate-900/30 p-2 rounded-xl transition-colors">
            <div className="w-11 h-11 rounded-xl bg-blue-950/70 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight">1.4 Days</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Average Verification Cycle</div>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-4 last:pr-0 hover:bg-slate-900/30 p-2 rounded-xl transition-colors">
            <div className="w-11 h-11 rounded-xl bg-purple-950/70 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight">100%</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Tamper-Evident Audit Coverage</div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 5. THE PROCUREMENT CHALLENGE ────────────────────────────────── */}
      <section id="challenge" className="py-20 px-6 sm:px-8 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
              THE PROCUREMENT CHALLENGE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1.5 mb-2">
              Government procurement is complex.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Large bid volumes, extensive documentation and multiple eligibility requirements make manual verification difficult to scale, increasing the risk of delays and inconsistencies.
            </p>
          </div>

          <a 
            href="#workflow"
            className="self-start md:self-auto px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Learn More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 4 Cards Grid matching reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 01 */}
          <div className="p-6 rounded-xl bg-[#070F22] border border-slate-800/80 hover:border-slate-700 hover:bg-[#09132B] transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">01</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Large Document Volumes</h3>
              <p className="text-[13px] text-slate-300 leading-relaxed font-normal">
                Hundreds of bidders can generate thousands of documents requiring verification.
              </p>
            </div>
          </div>

          {/* Card 02 */}
          <div className="p-6 rounded-xl bg-[#070F22] border border-slate-800/80 hover:border-slate-700 hover:bg-[#09132B] transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">02</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Manual Verification</h3>
              <p className="text-[13px] text-slate-300 leading-relaxed font-normal">
                Officers spend significant time checking repetitive information.
              </p>
            </div>
          </div>

          {/* Card 03 */}
          <div className="p-6 rounded-xl bg-[#070F22] border border-slate-800/80 hover:border-slate-700 hover:bg-[#09132B] transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">03</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Hidden Inconsistencies</h3>
              <p className="text-[13px] text-slate-300 leading-relaxed font-normal">
                Potential mismatches or anomalies may be difficult to identify manually.
              </p>
            </div>
          </div>

          {/* Card 04 */}
          <div className="p-6 rounded-xl bg-[#070F22] border border-slate-800/80 hover:border-slate-700 hover:bg-[#09132B] transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  <Eye className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">04</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Limited Visibility</h3>
              <p className="text-[13px] text-slate-300 leading-relaxed font-normal">
                Teams need a clearer view of verification progress and required actions.
              </p>
            </div>
          </div>

        </div>

      </section>

      {/* ─── 6. END-TO-END WORKFLOW ──────────────────────────────────────── */}
      <section id="workflow" className="py-20 bg-[#040918] border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          {/* Header with Right Principle Card */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-14 gap-6">
            <div>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                ONE PLATFORM, END-TO-END
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 mb-2">
                From Tender to Verified Decision.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
                A connected workflow that brings tender management, document intelligence, compliance and risk analysis into one platform.
              </p>
            </div>

            {/* Principle Card matching reference */}
            <div className="p-4 rounded-xl bg-[#08122A] border border-sky-500/30 flex items-center gap-3.5 max-w-md shrink-0 shadow-lg">
              <div className="w-10 h-10 rounded-lg bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">AI assists. Rules validate. Officers decide.</div>
                <div className="text-[11px] text-slate-400">Intelligence for better analysis. Humans for better decisions.</div>
              </div>
            </div>
          </div>

          {/* 7 Workflow Steps Horizontal Rail with Clickable Interactive Polish */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 relative">
            {workflowSteps.map((step, idx) => {
              const IconComp = step.icon;
              const isActive = activeWorkflowStep === idx;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveWorkflowStep(isActive ? null : idx)}
                  className={`p-4 rounded-xl border text-center flex flex-col items-center transition-all cursor-pointer text-left ${
                    isActive 
                      ? 'bg-blue-950/70 border-sky-400 shadow-lg shadow-sky-500/20 scale-[1.03]' 
                      : 'bg-[#070F22] border-slate-800/80 hover:border-slate-700 hover:bg-[#09132B]'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 transition-colors ${
                    step.color === 'cyan' 
                      ? 'bg-cyan-950/60 border border-cyan-500/30 text-cyan-400'
                      : step.color === 'emerald'
                      ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-400'
                      : 'bg-blue-950/60 border border-blue-500/30 text-blue-400'
                  }`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{step.num}</span>
                  <div className="text-xs font-bold text-white mt-0.5">{step.title}</div>
                  <p className="text-[11px] text-slate-300 leading-tight mt-1.5 font-normal">
                    {step.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Expandable Step Detail Drawer (Elevates UX without breaking layout) */}
          {activeWorkflowStep !== null && (
            <div className="mt-6 p-5 rounded-xl bg-[#070F22] border border-sky-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-sky-400 font-mono text-[10px] font-bold">
                    STAGE {workflowSteps[activeWorkflowStep].num} DEEP DIVE
                  </span>
                  <span className="text-xs font-bold text-white">{workflowSteps[activeWorkflowStep].title}</span>
                </div>
                <div className="text-xs text-slate-200">
                  <strong className="text-sky-400">Officer Responsibility:</strong> {workflowSteps[activeWorkflowStep].officerDuty}
                </div>
                <div className="text-xs text-slate-300">
                  <strong className="text-emerald-400">Autonomous AI Role:</strong> {workflowSteps[activeWorkflowStep].aiDuty}
                </div>
              </div>
              <button
                onClick={() => setActiveWorkflowStep(null)}
                className="text-xs text-slate-400 hover:text-white px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors shrink-0 cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ─── 7. OFFICER / BIDDER EXPERIENCE (Two Large Side-by-Side Panels) ─── */}
      <section className="py-20 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* ─── PANEL 1: FOR PROCUREMENT OFFICERS ────────────────── */}
          <div className="rounded-2xl bg-[#070F22] border border-slate-800 p-6 sm:p-8 flex flex-col justify-between hover:border-slate-700/90 transition-all shadow-xl">
            <div>
              {/* Pill */}
              <div className="inline-block px-3 py-1 rounded-md bg-blue-950/70 border border-blue-500/30 text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-4">
                FOR PROCUREMENT OFFICERS
              </div>

              {/* Title & Desc */}
              <h3 className="text-2xl font-black text-white mb-2 leading-tight">
                Your Procurement<br />Command Center.
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Manage tenders, review bidders, verify documents, monitor compliance and make informed decisions.
              </p>

              {/* Checklist & Mini Dashboard Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center mb-6">
                
                {/* Checklist */}
                <div className="sm:col-span-5 space-y-2.5 text-xs font-medium text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                    <span>Tender Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                    <span>Bidder Verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                    <span>Compliance Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                    <span>Risk Intelligence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                    <span>Reports & Audit Trail</span>
                  </div>
                </div>

                {/* Mini Dashboard Preview Widget matching reference */}
                <div className="sm:col-span-7 rounded-xl bg-[#040816] border border-slate-800 p-4 text-[10px]">
                  
                  {/* Overview Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2.5">
                    <span className="font-bold text-slate-200">Tender Overview</span>
                    <span className="text-slate-500 text-[9px] cursor-pointer hover:text-slate-300">Overview DE08 ▾</span>
                  </div>

                  {/* 3 Metric Pills */}
                  <div className="grid grid-cols-3 gap-1.5 mb-3 text-center">
                    <div className="bg-slate-900/90 p-2 rounded hover:bg-slate-800 transition-colors">
                      <div className="font-bold text-white text-xs">48</div>
                      <div className="text-[8px] text-slate-400 truncate">Active Tenders</div>
                    </div>
                    <div className="bg-slate-900/90 p-2 rounded hover:bg-slate-800 transition-colors">
                      <div className="font-bold text-white text-xs">12</div>
                      <div className="text-[8px] text-slate-400 truncate">Pending Review</div>
                    </div>
                    <div className="bg-slate-900/90 p-2 rounded hover:bg-slate-800 transition-colors">
                      <div className="font-bold text-rose-400 text-xs">3</div>
                      <div className="text-[8px] text-rose-400 truncate">High Risk</div>
                    </div>
                  </div>

                  {/* Compliance Bar Chart with Interactive Hover Tooltip */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-slate-300 text-[9px]">Compliance Overview</span>
                    <button 
                      onClick={() => setEvidenceModalOpen(true)}
                      className="text-sky-400 hover:text-sky-300 text-[8px] font-medium cursor-pointer"
                    >
                      View Reports →
                    </button>
                  </div>
                  
                  <div className="h-16 flex items-end justify-between gap-1 pt-2 px-1 relative">
                    {complianceMonthlyData.map((item, i) => (
                      <div 
                        key={i} 
                        className="flex-1 flex flex-col items-center gap-1 cursor-pointer relative group/bar"
                        onMouseEnter={() => setHoveredBarIndex(i)}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                      >
                        {hoveredBarIndex === i && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white text-[9px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap z-20">
                            {item.month}: {item.value}% ({item.verified} verified)
                          </div>
                        )}
                        <div 
                          className="w-full bg-[#0066FF] group-hover/bar:bg-sky-400 rounded-t-xs transition-colors"
                          style={{ height: `${item.value}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[8px] text-slate-500 px-0.5 mt-1 select-none font-medium">
                    {complianceMonthlyData.map((d, idx) => (
                      <span key={idx}>{d.month}</span>
                    ))}
                  </div>

                </div>

              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/officer/login')}
              className="w-full sm:w-auto self-start px-6 py-3 rounded-lg bg-[#0066FF] hover:bg-[#0055D4] text-white font-bold text-xs shadow-md shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Open Officer Portal</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* ─── PANEL 2: FOR BIDDERS / APPLICANTS ─────────────────── */}
          <div className="rounded-2xl bg-[#070F22] border border-slate-800 p-6 sm:p-8 flex flex-col justify-between hover:border-slate-700/90 transition-all shadow-xl">
            <div>
              {/* Pill */}
              <div className="inline-block px-3 py-1 rounded-md bg-emerald-950/70 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-4">
                FOR BIDDERS / APPLICANTS
              </div>

              {/* Title & Desc */}
              <h3 className="text-2xl font-black text-white mb-2 leading-tight">
                A Simpler Way<br />to Participate.
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Discover tenders, submit applications, upload documents and track verification progress.
              </p>

              {/* Checklist & Mini Applications Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center mb-6">
                
                {/* Checklist */}
                <div className="sm:col-span-5 space-y-2.5 text-xs font-medium text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Browse Tenders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Apply Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Upload Documents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Track Verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Respond to Clarifications</span>
                  </div>
                </div>

                {/* Mini "My Applications" Preview Widget with Interactive Tabs */}
                <div className="sm:col-span-7 rounded-xl bg-[#040816] border border-slate-800 p-4 text-[10px]">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2.5">
                    <span className="font-bold text-slate-200">My Applications</span>
                    <button 
                      onClick={() => navigate('/bidder/login')}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Open Applications"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Filter tabs - Fully interactive */}
                  <div className="flex gap-1.5 mb-2.5">
                    {['All', 'Active', 'Under Review', 'Closed'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setBidderAppFilter(tab)}
                        className={`px-2.5 py-1 rounded text-[9px] font-bold transition-colors cursor-pointer ${
                          bidderAppFilter === tab 
                            ? 'bg-blue-600 text-white shadow-xs' 
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Filtered Application Rows */}
                  <div className="space-y-1.5">
                    {filteredBidderApps.map((app) => (
                      <div 
                        key={app.id} 
                        className="flex items-center justify-between p-2 rounded bg-slate-900/80 hover:bg-slate-800/80 transition-colors"
                      >
                        <div>
                          <div className="font-bold text-white text-[9px]">{app.id}</div>
                          <div className="text-slate-400 text-[8px]">{app.title}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${app.badgeClass}`}>
                          {app.status}
                        </span>
                      </div>
                    ))}
                    {filteredBidderApps.length === 0 && (
                      <div className="py-3 text-center text-slate-500 text-[9px]">
                        No applications in this category.
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/bidder/login')}
              className="w-full sm:w-auto self-start px-6 py-3 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs shadow-md shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Open Bidder Portal</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </section>

      {/* ─── 8. PUBLIC TENDERS ────────────────────────────────────────────── */}
      <section id="tenders" className="py-20 px-6 sm:px-8 max-w-7xl mx-auto">
        
        {/* Header with Search & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
              PUBLIC PROCUREMENT OPPORTUNITIES
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 mb-1.5">
              Explore Active Tenders.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Browse the latest procurement opportunities issued by Chennai Petroleum Corporation Limited.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* View All Tenders Link */}
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All Categories');
                setSelectedStatus('All Status');
              }}
              className="hidden lg:inline text-xs font-bold text-sky-400 hover:text-sky-300 mr-2 cursor-pointer"
            >
              View All Tenders →
            </button>

            {/* Search Input with Clear Button */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                id="tender-search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tenders by keyword, ID (Press /)"
                className="w-full sm:w-64 pl-8 pr-8 py-2 bg-[#070F22] border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
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
              className="bg-[#070F22] border border-slate-800 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500 cursor-pointer"
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
              className="bg-[#070F22] border border-slate-800 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="OPEN">Open</option>
            </select>
          </div>
        </div>

        {/* 3 Tender Cards Matching Reference */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTenders.map((tender) => (
            <div
              key={tender.id}
              className="p-6 rounded-xl bg-[#070F22] border border-slate-800/90 hover:border-slate-700 hover:bg-[#09132B] transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                {/* Status + Reference Number + Code */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
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
                    {tender.code}
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
                    <div className="text-slate-500 text-[10px]">Estimated Value</div>
                    <div className="text-white font-bold mt-0.5">{tender.estimated_value_display}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px]">Deadline</div>
                    <div className="text-slate-200 font-semibold mt-0.5">{tender.deadline}</div>
                  </div>
                </div>
              </div>

              {/* View Tender Link */}
              <div className="pt-4">
                <button
                  onClick={() => setSelectedTenderModal(tender)}
                  className="text-xs font-bold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1.5 transition-colors group/link cursor-pointer"
                >
                  <span>View Tender</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTenders.length === 0 && (
          <div className="p-12 text-center bg-[#070F22] rounded-xl border border-slate-800 text-slate-400 text-xs">
            <Search className="w-6 h-6 mx-auto mb-2 text-slate-600" />
            <p>No active tenders found matching your filter criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All Categories');
                setSelectedStatus('All Status');
              }}
              className="mt-2 text-xs text-sky-400 font-bold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </section>

      {/* ─── 9. FOOTER ───────────────────────────────────────────────────── */}
      <footer id="faq" className="bg-[#02050E] text-slate-400 pt-16 pb-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-900 text-xs">
            
            {/* Brand column */}
            <div className="md:col-span-4 space-y-3">
              <div className="flex items-center gap-3">
                <CpclEmblem size={40} />
                <div>
                  <div className="font-extrabold text-white text-base leading-none">CPCL</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Chennai Petroleum Corporation Limited</div>
                  <div className="text-[10px] text-sky-400 font-semibold">Sovereign Procurement</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-sm">
                Chennai Petroleum Corporation Limited, a premier refining subsidiary of Indian Oil Corporation Limited, serving India's sovereign energy sector.
              </p>
            </div>

            {/* Platform */}
            <div className="md:col-span-2 space-y-2">
              <div className="font-bold text-slate-200">Platform</div>
              <ul className="space-y-1.5 text-slate-400">
                <li><a href="#workflow" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#tenders" className="hover:text-white transition-colors">Procurement</a></li>
                <li><a href="#workflow" className="hover:text-white transition-colors">Compliance</a></li>
                <li><button onClick={() => setEvidenceModalOpen(true)} className="hover:text-white transition-colors cursor-pointer">Security</button></li>
              </ul>
            </div>

            {/* For Officers */}
            <div className="md:col-span-2 space-y-2">
              <div className="font-bold text-slate-200">For Officers</div>
              <ul className="space-y-1.5 text-slate-400">
                <li><button onClick={() => navigate('/officer/login')} className="hover:text-white transition-colors cursor-pointer">Officer Login</button></li>
                <li><button onClick={() => navigate('/officer/register')} className="hover:text-white transition-colors cursor-pointer">Officer Registration</button></li>
                <li><button onClick={() => navigate('/officer/login')} className="hover:text-white transition-colors cursor-pointer">Verification</button></li>
                <li><button onClick={() => navigate('/officer/login')} className="hover:text-white transition-colors cursor-pointer">Reports</button></li>
              </ul>
            </div>

            {/* For Bidders */}
            <div className="md:col-span-2 space-y-2">
              <div className="font-bold text-slate-200">For Bidders</div>
              <ul className="space-y-1.5 text-slate-400">
                <li><a href="#tenders" className="hover:text-white transition-colors">Browse Tenders</a></li>
                <li><button onClick={() => navigate('/bidder/login')} className="hover:text-white transition-colors cursor-pointer">Bidder Login</button></li>
                <li><button onClick={() => navigate('/bidder/register')} className="hover:text-white transition-colors cursor-pointer">Bidder Registration</button></li>
                <li><button onClick={() => navigate('/bidder/login')} className="hover:text-white transition-colors cursor-pointer">Applications</button></li>
              </ul>
            </div>

            {/* Support & Connect */}
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2">
                <div className="font-bold text-slate-200">Support</div>
                <ul className="space-y-1.5 text-slate-400">
                  <li><a href="#faq" className="hover:text-white transition-colors">Help</a></li>
                  <li><a href="mailto:procurement@cpcl.gov.in" className="hover:text-white transition-colors">Contact</a></li>
                  <li><a href="#overview" className="hover:text-white transition-colors">Accessibility</a></li>
                </ul>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-200">Connect</div>
                <div className="flex items-center gap-3 text-slate-400">
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors p-1" title="LinkedIn">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors p-1" title="Twitter">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors p-1" title="YouTube">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Links */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
            <div>
              © 2026 Chennai Petroleum Corporation Limited. All rights reserved.
            </div>
            <div className="flex items-center gap-5 text-slate-400">
              <button onClick={() => alert('CPCL Privacy Policy adheres to Government of India Information Technology Act.')} className="hover:text-white transition-colors cursor-pointer">Privacy</button>
              <button onClick={() => alert('General Financial Rules (GFR 2017) Terms Apply.')} className="hover:text-white transition-colors cursor-pointer">Terms</button>
              <button onClick={() => setEvidenceModalOpen(true)} className="hover:text-white transition-colors cursor-pointer">Security</button>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors cursor-pointer">Sitemap</button>
            </div>
          </div>

        </div>
      </footer>

      {/* ─── MODAL: HOW IT WORKS WALKTHROUGH MODAL ────────────────────────── */}
      {howItWorksModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#070F22] rounded-2xl max-w-2xl w-full border border-sky-500/40 shadow-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setHowItWorksModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold mb-1">
              <Play className="w-4 h-4" />
              <span>PLATFORM ARCHITECTURE & WORKFLOW</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">How CPCL BidVerify AI Works</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Designed according to General Financial Rules (GFR 2017) and Central Vigilance Commission (CVC) standards for total transparency.
            </p>

            <div className="space-y-4 text-xs">
              
              {/* Step 1 */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold shrink-0 text-xs">
                  01
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Bid Upload & Pre-Flight Validation</h4>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                    Bidders upload their technical and financial submissions. The platform executes immediate integrity scans, verifies PDF digital signatures, and ensures files meet CPCL tender criteria.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold shrink-0 text-xs">
                  02
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Multi-Modal OCR & Field Extraction</h4>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                    Scanned certificates (GST, PAN, Audited Balance Sheets, CA UDINs) are digitized with 98.5% precision. Over 1,200 entities are indexed with bounding box citations.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold shrink-0 text-xs">
                  03
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Deterministic Rule Compliance Engine</h4>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                    Pre-set public sector rules test minimum turnover thresholds, local supplier ratios (Make in India), and statutory safety clearances without hallucination.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0 text-xs">
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
                className="px-6 py-2.5 rounded-lg bg-[#0066FF] hover:bg-[#0055D4] text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Close Walkthrough
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: TENDER DETAILS MODAL ─────────────────────────────────── */}
      {selectedTenderModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#070F22] rounded-2xl max-w-xl w-full border border-slate-800 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedTenderModal(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                selectedTenderModal.badgeColor === 'emerald'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                {selectedTenderModal.badge}
              </span>
              <span className="text-xs font-mono text-slate-400">{selectedTenderModal.reference_number}</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-3">{selectedTenderModal.title}</h3>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-[#040816] border border-slate-800 text-xs mb-4">
              <div>
                <span className="text-slate-500 text-[10px]">Estimated Contract Value:</span>
                <div className="text-base font-bold text-white">{selectedTenderModal.estimated_value_display}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">Submission Deadline:</span>
                <div className="text-base font-semibold text-white">{selectedTenderModal.deadline}</div>
              </div>
            </div>

            <div className="space-y-3.5 text-xs mb-6">
              <div>
                <div className="font-bold text-slate-300 mb-1">Scope of Work Specification:</div>
                <p className="text-slate-400 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                  {selectedTenderModal.description}
                </p>
              </div>

              <div>
                <div className="font-bold text-slate-300 mb-1.5">Mandatory Statutory Eligibility:</div>
                <div className="space-y-1.5">
                  {selectedTenderModal.eligibility?.map((e, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-300 bg-slate-900/40 p-2 rounded">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{e}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/30 text-sky-200 text-[11px]">
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
                className="px-5 py-2.5 rounded-lg bg-[#0066FF] hover:bg-[#0055D4] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer"
              >
                <span>Proceed to Bid</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: VIEW EVIDENCE / AUDIT CITATIONS ──────────────────────── */}
      {evidenceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#070F22] rounded-2xl max-w-xl w-full border border-sky-500/40 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
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
            <h3 className="text-lg font-bold text-white mb-1.5">Shakti Engineering Bid Package #128</h3>
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
                <div className="p-3.5 rounded-lg bg-[#040816] border border-slate-800 space-y-2">
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
                <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
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
                    Certified Turnover: <strong className="text-white">₹24.10 Cr</strong>
                  </div>
                  <div className="p-2.5 rounded bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px] mt-2">
                    ⚠️ <strong>YoY Revenue Spike Detected (+130.9%):</strong> System advised committee to cross-check work completion certificates before commercial L1 opening.
                  </div>
                </div>
              )}

              {activeEvidenceTab === 'gst' && (
                <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
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
                className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
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
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-[#0066FF] hover:bg-[#0055D4] text-white shadow-xl shadow-blue-600/40 hover:scale-110 active:scale-95 transition-all cursor-pointer"
          title="Back to Top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
}
