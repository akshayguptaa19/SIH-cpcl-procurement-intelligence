import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, FileText, CheckCircle2, AlertTriangle, Search, ArrowRight, ChevronRight, 
  Eye, Building2, Landmark, Lock, Scale, FileCheck2, Cpu, Layers, Clock, 
  UserCheck, Users, Briefcase, Calendar, X, ExternalLink, HelpCircle, Menu, 
  Sparkles, Check, ArrowDown, ChevronDown, BarChart3, Database, ShieldAlert,
  ArrowUpRight, Sliders, CheckCircle, Info, Activity, Terminal, Zap, Shield,
  FileSpreadsheet, Award, FileCode, Hash, RefreshCw, ChevronUp, AlertCircle,
  Flame, KeyRound, Radio, Compass, Play, CheckCheck, Fingerprint
} from 'lucide-react';
import { api } from '../../lib/api.js';

export default function LandingPage({ onNavigateAuth, onSelectTender }) {
  const navigate = useNavigate();

  // Tenders state
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  // Interactive UI state
  const [selectedDocTab, setSelectedDocTab] = useState('gst');
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [selectedTenderModal, setSelectedTenderModal] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWhyAnomaly, setShowWhyAnomaly] = useState(true);
  const [activeWorkflowStage, setActiveWorkflowStage] = useState(3); // Default to OCR + AI
  const [openFaq, setOpenFaq] = useState(0);

  // Default seed tenders
  const defaultTenders = [
    {
      id: 't-128',
      reference_number: 'CPCL/PROC/2026/128',
      title: 'Industrial Pipeline Equipment & High-Pressure Valves',
      department: 'Refinery Mechanical Engineering',
      estimated_value: 150000000,
      submission_deadline: '18 Sep 2026',
      status: 'ACTIVE',
      category: 'Mechanical Equipment',
      description: 'Supply, installation and high-pressure hydrostatic certification of API 6D pipeline valves for Cauvery Basin crude transfer line.',
      eligibility: ['Class-1 Local Supplier (Make in India)', 'Min 3-Year Avg Turnover: ₹25 Cr', 'ICAI Certified UDIN Turnover Certificate', 'Active GSTIN with zero compliance defaults']
    },
    {
      id: 't-147',
      reference_number: 'CPCL/PROC/2026/147',
      title: 'Refinery Maintenance Services & Turnaround Support',
      department: 'Plant Operations & Maintenance',
      estimated_value: 84000000,
      submission_deadline: '25 Sep 2026',
      status: 'ACTIVE',
      category: 'Services & Maintenance',
      description: 'Comprehensive mechanical overhaul, catalyst replacement assistance and hydrocracker maintenance support for Manali Unit-3.',
      eligibility: ['Prior PSU Refinery Turnaround Experience', 'Min 3-Year Avg Turnover: ₹15 Cr', 'Valid Factory Inspectorate Clearance', 'ISO 9001:2015 & OHSAS 18001 Certified']
    },
    {
      id: 't-152',
      reference_number: 'CPCL/PROC/2026/152',
      title: 'Industrial Safety Equipment & Multi-Gas Detection Arrays',
      department: 'Health, Safety & Environment (HSE)',
      estimated_value: 42000000,
      submission_deadline: '30 Sep 2026',
      status: 'ACTIVE',
      category: 'Safety & Environmental',
      description: 'Installation of optical flame detectors, wireless H2S monitoring sensors and ATEX Zone 0 personal safety monitors across tank farm.',
      eligibility: ['ATEX / PESO Certified Explosion-Proof Hardware', 'Min 3-Year Avg Turnover: ₹8 Cr', 'OEM Authorization Letter', 'Direct Calibration Facility in India']
    },
    {
      id: 't-164',
      reference_number: 'CPCL/PROC/2026/164',
      title: 'Distributed Control System (DCS) Cyber Security & SCADA Upgrade',
      department: 'Instrumentation & Process Automation',
      estimated_value: 115000000,
      submission_deadline: '05 Oct 2026',
      status: 'ACTIVE',
      category: 'IT & Automation',
      description: 'Implementation of air-gapped industrial firewall routers, IEC 62443 cyber architecture and redundancy controllers for refinery DCS.',
      eligibility: ['CERT-In Empaneled Security Architecture', 'Min 3-Year Avg Turnover: ₹20 Cr', 'NABL Accredited Test Lab Reports', 'OEM Certified System Engineers']
    }
  ];

  useEffect(() => {
    async function loadPublicTenders() {
      try {
        const data = await api.tenders.getAll({ status: 'ACTIVE' });
        if (data && data.length > 0) {
          setTenders(data);
        } else {
          setTenders(defaultTenders);
        }
      } catch (err) {
        setTenders(defaultTenders);
      } finally {
        setLoading(false);
      }
    }
    loadPublicTenders();
  }, []);

  const handleAuthNavigate = (target) => {
    if (onNavigateAuth) onNavigateAuth(target);
    if (target === 'officer-login') navigate('/officer/login');
    else if (target === 'officer-register') navigate('/officer/register');
    else if (target === 'bidder-login') navigate('/bidder/login');
    else if (target === 'bidder-register') navigate('/bidder/register');
    else navigate(`/${target}`);
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeTendersList = tenders.length > 0 ? tenders : defaultTenders;
  const filteredTenders = activeTendersList.filter(t => {
    const matchesSearch = !searchTerm || 
      t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reference_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Interactive 8-Stage Workflow Data
  const workflowStages = [
    { 
      step: '01', 
      title: 'Tender Spec', 
      badge: 'Specification',
      color: 'from-blue-500 to-cyan-400',
      glow: 'shadow-blue-500/20 border-blue-500/40 text-blue-400',
      desc: 'CPCL Procurement Officers define technical eligibility criteria, mandatory statutory filings, and average turnover thresholds.',
      inputs: ['GFR 2017 Tender Notice', 'Mandatory Document List', 'Financial Turnover Criteria'],
      output: 'Cryptographically published tender specification on CPCL Sovereign Portal.'
    },
    { 
      step: '02', 
      title: 'Bid Submission', 
      badge: 'Vendor Proposal',
      color: 'from-cyan-500 to-teal-400',
      glow: 'shadow-cyan-500/20 border-cyan-500/40 text-cyan-400',
      desc: 'Registered vendors submit technical bids, GST certificates, CA audited statements, and past PSU experience documents.',
      inputs: ['Form REG-06 (GST)', 'CA UDIN Certificate', 'Experience Completion Letters'],
      output: 'Tamper-evident submission container with digital timestamp.'
    },
    { 
      step: '03', 
      title: 'SHA-256 Seal', 
      badge: 'Integrity Seal',
      color: 'from-teal-500 to-emerald-400',
      glow: 'shadow-emerald-500/20 border-emerald-500/40 text-emerald-400',
      desc: 'Every uploaded PDF is digested into a SHA-256 cryptographic hash to guarantee zero post-submission tampering.',
      inputs: ['Raw Multi-page PDFs', 'ICAI UDIN Digit Signatures'],
      output: 'Permanent immutable hash recorded in Sovereign Audit Ledger.'
    },
    { 
      step: '04', 
      title: 'OCR & AI Engine', 
      badge: 'Entity Extraction',
      color: 'from-purple-500 to-indigo-400',
      glow: 'shadow-purple-500/20 border-purple-500/40 text-purple-400',
      desc: 'High-speed OCR parses scanned documents in under 1.4s, extracting GSTIN, PAN, FY turnover, and client work credentials.',
      inputs: ['Scanned Document OCR', 'Vision LLM Table Parser', 'Bounding Box Coordinate Mapping'],
      output: 'Normalized JSON schema with exact page & bounding box citations.'
    },
    { 
      step: '05', 
      title: 'Deterministic Rules', 
      badge: 'GFR Compliance',
      color: 'from-indigo-500 to-blue-400',
      glow: 'shadow-indigo-500/20 border-indigo-500/40 text-indigo-400',
      desc: 'Algorithmic checks evaluate mathematical criteria: 3-year turnover thresholds, MSME exemption rules, and GST validity.',
      inputs: ['Turnover Math Check', 'Entity Active Status', 'Class-1 Local Content Verification'],
      output: 'Rule compliance matrix (PASS / FAIL / REVIEW_REQUIRED).'
    },
    { 
      step: '06', 
      title: 'Anomaly Scrutiny', 
      badge: 'Risk Detection',
      color: 'from-amber-500 to-orange-400',
      glow: 'shadow-amber-500/20 border-amber-500/40 text-amber-400',
      desc: 'Cross-document intelligence identifies suspicious YoY revenue surges (+130%), conflicting PAN entity types, or fake UDINs.',
      inputs: ['YoY Variance Model', 'Cross-Doc Entity Consistency', 'ICAI UDIN Registry Ping'],
      output: 'Explainable anomaly flags with exact mathematical rationales.'
    },
    { 
      step: '07', 
      title: 'Officer Review', 
      badge: 'Human Authority',
      color: 'from-sky-500 to-blue-500',
      glow: 'shadow-sky-500/20 border-sky-500/40 text-sky-400',
      desc: 'CPCL Procurement Officers inspect highlighted document citations side-by-side with full authority to accept or flag.',
      inputs: ['Side-by-Side PDF Viewer', 'One-Click Citation Jumps', 'Officer Review Notes'],
      output: 'Official technical qualification recommendation by authorized officer.'
    },
    { 
      step: '08', 
      title: 'Sovereign Award', 
      badge: 'Audit Ready',
      color: 'from-emerald-500 to-green-400',
      glow: 'shadow-emerald-500/20 border-emerald-500/40 text-emerald-400',
      desc: 'Legally defensible procurement determination logged with time, officer signature, and complete CVC/CAG exportable audit trail.',
      inputs: ['Officer Digital Clearance', 'CVC Integrity Certificate'],
      output: 'Immutable contract award readiness with zero vigilance vulnerability.'
    }
  ];

  // Document Intelligence Interactive Data
  const documentIntelligenceData = {
    gst: {
      name: 'GST Certificate (Form REG-06)',
      issuer: 'Goods and Services Tax Network (GSTN)',
      docSnippet: `GOVERNMENT OF INDIA · FORM GST REG-06
REGISTRATION CERTIFICATE

Registration Number: 33AAACS1429B1Z8
Legal Name: SHAKTI ENGINEERING & INFRASTRUCTURE LTD
Trade Name: SHAKTI ENGINEERING
Constitution of Business: Public Limited Company
Date of Liability: 01/07/2017
Period of Validity: From 14/06/2017 to Continuing
Type of Registration: Regular / Active Taxpayer
Jurisdiction: Chennai Large Taxpayer Unit (LTU-02)`,
      boundingHighlight: 'Registration Number: 33AAACS1429B1Z8',
      confidence: '99.4%',
      extracted: [
        { label: 'Company Name', value: 'Shakti Engineering & Infrastructure Ltd' },
        { label: 'GSTIN', value: '33AAACS1429B1Z8', status: 'verified' },
        { label: 'State Code', value: '33 (Tamil Nadu)', status: 'verified' },
        { label: 'Embedded PAN', value: 'AAACS1429B', status: 'verified' },
        { label: 'Taxpayer Status', value: 'Regular / Active', status: 'verified' }
      ],
      compliance: [
        { label: 'GSTIN Checksum & Format Validation', pass: true, rule: 'RULE-GST-01' },
        { label: 'Embedded PAN Matches Form 49A PAN Card', pass: true, rule: 'RULE-PAN-02' },
        { label: 'Active Return Filing Status (GSTR-3B Current)', pass: true, rule: 'RULE-GST-03' }
      ]
    },
    pan: {
      name: 'Permanent Account Number (PAN Card)',
      issuer: 'Income Tax Department, Government of India',
      docSnippet: `INCOME TAX DEPARTMENT · GOVT OF INDIA
PERMANENT ACCOUNT NUMBER CARD

Number: AAACS1429B
Name: SHAKTI ENGINEERING & INFRASTRUCTURE LTD
Entity Category: Domestic Company (Public Ltd)
Date of Incorporation: 11/04/2012
Status: Active and In-Good-Standing with NSDL`,
      boundingHighlight: 'Number: AAACS1429B',
      confidence: '99.8%',
      extracted: [
        { label: 'Entity Name', value: 'SHAKTI ENGINEERING & INFRASTRUCTURE LTD' },
        { label: 'PAN Number', value: 'AAACS1429B', status: 'verified' },
        { label: 'Entity 4th Character', value: "'C' (Company - Verified)", status: 'verified' },
        { label: 'NSDL Central Registry Match', value: '100% Exact Match', status: 'verified' }
      ],
      compliance: [
        { label: 'NSDL Central Database Authentication', pass: true, rule: 'RULE-PAN-01' },
        { label: 'Corporate Legal Identity Status Valid', pass: true, rule: 'RULE-PAN-03' },
        { label: 'No Active Disqualification Flags in MCA-21', pass: true, rule: 'RULE-MCA-05' }
      ]
    },
    turnover: {
      name: 'Audited Financials & CA Certificate',
      issuer: 'Institute of Chartered Accountants of India (ICAI)',
      docSnippet: `INDEPENDENT AUDITOR’S CERTIFICATE ON ANNUAL TURNOVER
Client: Shakti Engineering & Infrastructure Ltd
CA UDIN: 24089123AAAAAA1029

Financial Year 2023–24: ₹18.40 Cr
Financial Year 2024–25: ₹21.10 Cr
Financial Year 2025–26: ₹48.60 Cr [PROVISIONAL AUDITED]
3-Year Average Turnover: ₹29.36 Cr
Operating Profit Margin: 14.8%`,
      boundingHighlight: 'Financial Year 2025–26: ₹48.60 Cr',
      confidence: '94.6%',
      extracted: [
        { label: 'FY 2025–26 Reported', value: '₹48.60 Cr (+130.3% YoY)' },
        { label: 'FY 2024–25 Baseline', value: '₹21.10 Cr' },
        { label: '3-Year Average', value: '₹29.36 Cr (Req: ₹25.0 Cr)', status: 'verified' },
        { label: 'CA UDIN Number', value: '24089123AAAAAA1029', status: 'verified' }
      ],
      compliance: [
        { label: 'Mandatory Minimum Turnover Met (>₹25 Cr)', pass: true, rule: 'RULE-FIN-001' },
        { label: 'CA UDIN Authenticated with ICAI Portal', pass: true, rule: 'RULE-FIN-002' },
        { label: 'YoY Variance Under 50% Threshold', pass: false, rule: 'RULE-FIN-004', alert: 'Review Required (+130.3% surge)' }
      ]
    },
    experience: {
      name: 'Past Work Experience Certificate',
      issuer: 'Bharat Petroleum Corporation Limited (BPCL)',
      docSnippet: `CLIENT WORK COMPLETION & PERFORMANCE CERTIFICATE
Client: Bharat Petroleum Corporation Limited (BPCL Kochi Refinery)
Contractor: Shakti Engineering & Infrastructure Ltd
Contract Reference: BPCL/KR/MECH/2023/882
Work Scope: Overhaul & Hydrostatic Certification of High-Pressure Crude Valves
Contract Value: ₹14.20 Cr
Completion Date: 15/01/2025 · Execution Rating: Satisfactory`,
      boundingHighlight: 'Contract Value: ₹14.20 Cr',
      confidence: '98.2%',
      extracted: [
        { label: 'Client Organization', value: 'BPCL (Kochi Refinery)' },
        { label: 'Contract Value', value: '₹14.20 Cr' },
        { label: 'Scope Similarity', value: 'API 6D Valve Overhaul (>85% Match)', status: 'verified' },
        { label: 'Completion Date', value: '15 January 2025', status: 'verified' }
      ],
      compliance: [
        { label: 'Qualifying PSU / Refinery Execution Scope', pass: true, rule: 'RULE-EXP-01' },
        { label: 'Single Order Value > 50% of Tender Est', pass: true, rule: 'RULE-EXP-02' },
        { label: 'Satisfactory Performance Rating from PSU Client', pass: true, rule: 'RULE-EXP-03' }
      ]
    }
  };

  const currentDoc = documentIntelligenceData[selectedDocTab];

  // FAQ items
  const faqs = [
    {
      q: 'Does BidVerify AI replace the Procurement Officer’s legal authority?',
      a: 'Absolutely not. BidVerify AI is strictly an assistive intelligence copilot. Under GFR 2017 and CVC guidelines, all qualifying determinations, rejections, and contract awards require the explicit sign-off of authorized CPCL Procurement Officers. The platform accelerates document review from hours to seconds and surfaces flagged anomalies, but the human officer maintains 100% decisive authority.'
    },
    {
      q: 'How does the platform prevent document fraud and tampering?',
      a: 'Every document uploaded by a vendor is instantly digested into a cryptographic SHA-256 hash at the exact second of submission. This cryptographic fingerprint is stored in an immutable audit ledger. If even a single byte or pixel of a submitted PDF is altered post-submission, the checksum fails instantly.'
    },
    {
      q: 'What is CA UDIN verification and how does it work?',
      a: 'The Institute of Chartered Accountants of India (ICAI) mandates a Unique Document Identification Number (UDIN) on all audited turnover certificates. BidVerify AI automatically extracts the 18-digit UDIN, verifies its mathematical checksum, and validates it against ICAI public records to eliminate fake balance sheets.'
    },
    {
      q: 'Is bidder proprietary data kept secure and confidential?',
      a: 'Yes. BidVerify AI operates within an on-premise, air-gapped sovereign deployment topology. Bidder financial data, client references, and proprietary technical designs are never sent to public commercial LLM APIs and never used for external model training.'
    },
    {
      q: 'Can MSME vendors claim exemptions through the portal?',
      a: 'Yes. The system automatically reads Udyam Registration certificates and cross-checks MSME classifications (Micro, Small, Medium) to apply statutory exemptions such as EMD waivers and turnover relaxations in accordance with Government of India public procurement policies.'
    }
  ];

  return (
    <div 
      style={{ 
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        backgroundColor: '#030712',
        color: '#F8FAFC'
      }}
      className="min-h-screen flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 antialiased relative overflow-x-hidden"
    >
      
      {/* ─── CYBER GRID BACKGROUND PATTERN ──────────────────────────────── */}
      <div 
        style={{
          backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.08) 1px, transparent 1px), radial-gradient(rgba(168, 85, 247, 0.05) 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
          backgroundPosition: '0 0, 18px 18px'
        }}
        className="fixed inset-0 pointer-events-none z-0 opacity-80"
      />

      {/* ─── LUMINOUS MULTI-COLOR AMBIENT AURORA GLOWS ─────────────────── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[580px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.28)_0%,rgba(56,189,248,0.18)_35%,rgba(168,85,247,0.12)_60%,transparent_75%)] pointer-events-none blur-3xl -z-10" />
      <div className="absolute top-[750px] right-[-100px] w-[650px] h-[650px] bg-[radial-gradient(circle,rgba(6,182,212,0.15)_0%,transparent_70%)] pointer-events-none blur-3xl -z-10" />
      <div className="absolute top-[1600px] left-[-100px] w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(168,85,247,0.14)_0%,transparent_70%)] pointer-events-none blur-3xl -z-10" />
      <div className="absolute top-[2600px] right-[10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(16,185,129,0.12)_0%,transparent_70%)] pointer-events-none blur-3xl -z-10" />

      {/* ─── LEVEL 1: OFFICIAL GOVERNMENT AUTHORITY BAR (FUTURISTIC DARK) ─ */}
      <div className="bg-[#02050E]/90 border-b border-white/[0.07] px-4 sm:px-8 py-2 text-xs relative z-30 backdrop-blur-md">
        <div className="max-w-[1360px] mx-auto flex flex-wrap items-center justify-between gap-3 text-slate-400">
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-orange-500 via-white to-green-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span>
              </span>
              Government of India
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-medium">
              Ministry of Petroleum & Natural Gas
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-slate-300 font-semibold text-xs">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Chennai Petroleum Corporation Limited (CPCL)</span>
          </div>

          <div className="flex items-center gap-2 text-xs ml-auto md:ml-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.9)]"></span>
            <span className="font-mono text-[11px] text-emerald-400 font-bold tracking-wider uppercase">
              Air-Gapped Sovereign Node Active
            </span>
          </div>
        </div>
      </div>

      {/* ─── LEVEL 2: REFINED MAIN NAVIGATION (FLOATING CYBER GLASS) ───── */}
      <header className="sticky top-3 z-40 px-4 sm:px-8 transition-all">
        <div className="max-w-[1360px] mx-auto bg-slate-950/80 backdrop-blur-2xl border border-white/[0.12] rounded-2xl px-5 py-3 flex items-center justify-between gap-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
          
          {/* CPCL Branding matching AuthPage logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center font-black text-white text-lg shadow-[0_0_20px_rgba(56,189,248,0.5)] group-hover:scale-105 transition-all">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-white tracking-tight leading-tight">
                  BidVerify
                </span>
                <span className="text-[10px] font-black text-cyan-300 bg-cyan-950/80 border border-cyan-400/40 px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                  AI SOVEREIGN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                CPCL · Ministry of Petroleum & Natural Gas
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav 
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            className="hidden lg:flex bg-slate-900/80 p-1.5 rounded-xl border border-white/[0.08] text-xs font-semibold text-slate-300"
          >
            {[
              { id: 'hero', label: 'Overview' },
              { id: 'problem', label: 'Why AI' },
              { id: 'how-it-works', label: '8-Stage Workflow' },
              { id: 'document-intelligence', label: 'Document Intelligence' },
              { id: 'tenders', label: 'Live Tenders' },
              { id: 'faq', label: 'FAQ' },
            ].map(link => (
              <button 
                key={link.id}
                onClick={() => scrollToSection(link.id)} 
                style={{ padding: '7px 14px', borderRadius: '8px', cursor: 'pointer' }}
                className="hover:text-cyan-300 hover:bg-white/[0.08] transition-all"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => handleAuthNavigate('bidder-login')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer' }}
              className="hidden sm:inline-flex text-xs font-bold text-slate-300 bg-slate-900/90 hover:bg-slate-800 border border-white/[0.12] hover:border-cyan-400/40 shadow-sm transition-all"
            >
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
              Bidder Portal
            </button>

            <button
              onClick={() => handleAuthNavigate('officer-login')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 20px', borderRadius: '10px', cursor: 'pointer' }}
              className="text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-blue-100" />
              Officer Console
            </button>

            {/* Mobile hamburger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-800 border border-white/[0.1]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-4 bg-slate-950/95 border border-white/[0.12] rounded-2xl flex flex-col gap-2 shadow-2xl">
            <button onClick={() => scrollToSection('problem')} className="text-left px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/[0.06] rounded-lg">Why AI</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-left px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/[0.06] rounded-lg">8-Stage Workflow</button>
            <button onClick={() => scrollToSection('document-intelligence')} className="text-left px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/[0.06] rounded-lg">Document Intelligence</button>
            <button onClick={() => scrollToSection('tenders')} className="text-left px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/[0.06] rounded-lg">Live Tenders</button>
            <button onClick={() => scrollToSection('faq')} className="text-left px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/[0.06] rounded-lg">FAQ</button>
            <div className="flex gap-2 pt-2 border-t border-white/[0.1]">
              <button onClick={() => handleAuthNavigate('bidder-login')} className="flex-1 py-2 text-center text-xs font-bold text-slate-300 bg-slate-900 rounded-lg">Bidder Portal</button>
              <button onClick={() => handleAuthNavigate('officer-login')} className="flex-1 py-2 text-center text-xs font-bold text-white bg-blue-600 rounded-lg">Officer Console</button>
            </div>
          </div>
        )}
      </header>

      {/* ─── SECTION 1: HERO SECTION (FUTURISTIC ADVANCED AI COMMAND) ───── */}
      <section id="hero" className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 px-4 sm:px-8">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Top Glowing Badge */}
            <div 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '9999px', marginBottom: '24px' }}
              className="bg-slate-900/90 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.25)]"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span className="text-xs font-bold text-cyan-200 tracking-wide flex items-center gap-1.5 uppercase font-mono">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                CPCL Sovereign Defense Grade
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-[11px] font-bold text-purple-300 font-mono">
                Manali Refinery Unit-3
              </span>
            </div>

            {/* Headline with Glowing Holographic Gradient */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] mb-6">
              Autonomous Scrutiny. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 drop-shadow-[0_0_35px_rgba(56,189,248,0.4)]">
                Zero Fraud Tolerance.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-[640px]">
              Next-generation procurement intelligence purpose-engineered for <strong className="text-white font-semibold">Chennai Petroleum Corporation Limited (MoPNG)</strong>. 
              Accelerates multi-crore tender scrutiny from 14 days to under 30 minutes with sub-second OCR, 
              statutory GSTIN cross-checks, and ICAI UDIN tamper seals — with <strong className="text-cyan-300 font-bold">100% human officer final say</strong>.
            </p>

            {/* CTA Group */}
            <div 
              style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px', marginBottom: '28px' }}
              className="w-full sm:w-auto"
            >
              <button
                onClick={() => scrollToSection('tenders')}
                style={{ padding: '15px 28px', borderRadius: '14px', cursor: 'pointer' }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-[0_0_35px_rgba(37,99,235,0.5)] transition-all active:scale-95"
              >
                <Search className="w-4 h-4" />
                Explore Live CPCL Tenders
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToSection('document-intelligence')}
                style={{ padding: '15px 26px', borderRadius: '14px', cursor: 'pointer' }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 text-sm font-bold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-white/[0.15] hover:border-cyan-400/40 shadow-lg shadow-black/40 transition-all"
              >
                <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                Live AI Scanner Demo
              </button>
            </div>

            {/* Trust Assurance Glowing Pills */}
            <div 
              style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '36px' }}
              className="w-full"
            >
              <span 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '10px' }}
                className="bg-cyan-950/60 border border-cyan-500/30 text-xs font-semibold text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> 1.4s OCR Extraction
              </span>
              <span 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '10px' }}
                className="bg-purple-950/60 border border-purple-500/30 text-xs font-semibold text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.15)]"
              >
                <Lock className="w-3.5 h-3.5 text-purple-400" /> SHA-256 Cryptographic Seal
              </span>
              <span 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '10px' }}
                className="bg-emerald-950/60 border border-emerald-500/30 text-xs font-semibold text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Officer Final Say
              </span>
            </div>

            {/* Quick KPI Stat Counter Row as Elevated Neon Dark Cards */}
            <div 
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}
              className="w-full"
            >
              <div 
                style={{ padding: '20px 22px', borderRadius: '18px' }}
                className="bg-slate-900/80 border border-cyan-500/25 shadow-[0_0_25px_rgba(6,182,212,0.1)] text-left"
              >
                <div className="text-3xl sm:text-4xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)] font-mono">1.4s</div>
                <div className="text-xs text-slate-400 font-medium mt-1">Multi-page OCR Speed</div>
              </div>
              <div 
                style={{ padding: '20px 22px', borderRadius: '18px' }}
                className="bg-slate-900/80 border border-purple-500/25 shadow-[0_0_25px_rgba(168,85,247,0.1)] text-left"
              >
                <div className="text-3xl sm:text-4xl font-black text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)] font-mono">99.8%</div>
                <div className="text-xs text-slate-400 font-medium mt-1">Clause Verification</div>
              </div>
              <div 
                style={{ padding: '20px 22px', borderRadius: '18px' }}
                className="bg-slate-900/80 border border-emerald-500/25 shadow-[0_0_25px_rgba(16,185,129,0.1)] text-left"
              >
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)] font-mono">₹450 Cr+</div>
                <div className="text-xs text-slate-400 font-medium mt-1">Tenders Protected</div>
              </div>
            </div>

          </div>

          {/* Right Hero Visual: 3D HOLOGRAPHIC SCATTER CONSOLE WITH SCANNING LASER */}
          <div className="lg:col-span-5 relative">
            
            {/* Ambient Multi-Color Halo Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 rounded-3xl blur-2xl opacity-40 animate-pulse -z-10" />

            <div className="relative rounded-3xl overflow-hidden bg-slate-950 border-2 border-cyan-500/40 shadow-[0_0_60px_-10px_rgba(6,182,212,0.35)]">
              
              {/* Background 3D Artwork from AuthPage */}
              <div className="relative h-[250px] sm:h-[280px] overflow-hidden">
                <img
                  src="/auth-hero.jpg"
                  alt="3D Crystal AI Intelligence"
                  className="w-full h-full object-cover opacity-85 mix-blend-screen scale-105 hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Animated Green / Cyan Laser Scanning Line */}
                <div 
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, #38BDF8, #A855F7, #34D399, transparent)',
                    boxShadow: '0 0 15px #38BDF8, 0 0 30px #A855F7',
                    animation: 'laserScan 3s ease-in-out infinite alternate'
                  }}
                />
                <style>{`
                  @keyframes laserScan {
                    0% { top: 15%; opacity: 0.8; }
                    50% { top: 55%; opacity: 1; }
                    100% { top: 88%; opacity: 0.8; }
                  }
                `}</style>

                {/* Top Floating Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-xl border border-cyan-400/30 text-[11px] font-bold text-cyan-300 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    ACTIVE OCR NODE: MANALI-01
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-300 bg-emerald-950/90 border border-emerald-500/40 px-3 py-0.5 rounded-full backdrop-blur-xl shadow-md">
                    LATENCY [0.8s]
                  </span>
                </div>

                {/* Refinery context label */}
                <div className="absolute bottom-3 left-4 right-4 z-10">
                  <p className="text-[11px] font-mono text-cyan-400 font-bold flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    CPCL Refinery Unit-3 Hydrocracker Scrutiny
                  </p>
                  <h3 className="text-xl font-black text-white tracking-tight drop-shadow-md">
                    Shakti Engineering Bid Package #128
                  </h3>
                </div>
              </div>

              {/* Lower Inspection Telemetry Panel */}
              <div className="p-5 bg-slate-900/95 border-t border-white/[0.1]">
                
                {/* Real-time Document Check Items */}
                <div className="space-y-2.5 mb-4 font-mono">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-xs shadow-inner">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span className="font-semibold text-slate-200">GST Registration (REG-06)</span>
                    </div>
                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      <Check className="w-3 h-3" /> VERIFIED [PASS]
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-purple-500/30 text-xs shadow-inner">
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-purple-400" />
                      <span className="font-semibold text-slate-200">PAN Card (Domestic Public Ltd)</span>
                    </div>
                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      <Check className="w-3 h-3" /> NSDL MATCHED
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs shadow-inner">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="font-semibold text-amber-200 block">CA Turnover Certificate</span>
                        <span className="text-[10px] text-amber-400/90 font-mono">Surge detected: +130.3% YoY</span>
                      </div>
                    </div>
                    <span className="text-amber-300 font-bold bg-amber-900/60 px-2 py-1 rounded text-[11px] border border-amber-400/40 animate-pulse">
                      FLAGGED FOR OFFICER
                    </span>
                  </div>
                </div>

                {/* Micro Metric Telemetry Bar with Glowing Confidence Meter */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950 border border-white/[0.08] text-center mb-4">
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase font-mono">Compliance</div>
                    <div className="text-lg font-black text-white font-mono">94%</div>
                  </div>
                  <div className="border-x border-white/[0.08]">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase font-mono">Risk Level</div>
                    <div className="text-lg font-black text-emerald-400 font-mono">LOW</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase font-mono">AI Confidence</div>
                    <div className="text-lg font-black text-cyan-400 font-mono">98.4%</div>
                  </div>
                </div>

                {/* Interactive Action: Open Evidence Modal */}
                <button
                  onClick={() => setEvidenceModalOpen(true)}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Eye className="w-4 h-4 text-cyan-200" />
                  Inspect Cryptographic Proof &amp; UDIN Citations
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Audit Seal Footer */}
                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono pt-2 border-t border-white/[0.08]">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Lock className="w-3.5 h-3.5" />
                    AUDIT TRAIL SEALED
                  </span>
                  <span className="text-slate-500">SHA-256: 7f8a9...b4e2</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── SECTION 2: THE PROCUREMENT BOTTLENECK (CYBER GLASS CARDS) ──── */}
      <section id="problem" className="py-20 bg-slate-950/60 border-y border-white/[0.08] px-4 sm:px-8 relative">
        <div className="max-w-[1360px] mx-auto">
          
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-950/70 border border-rose-500/40 text-xs font-bold text-rose-400 uppercase tracking-widest mb-4 font-mono shadow-[0_0_15px_rgba(244,63,94,0.2)]">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              The Public Procurement Vulnerability
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Why Traditional Manual Scrutiny Breaks Down
            </h2>
            <p className="text-slate-400 text-base sm:text-lg mt-4 leading-relaxed">
              Chennai Petroleum Corporation Limited executes mission-critical refinery tenders. 
              Manual human reading of hundreds of 500-page scanned filings introduces massive commercial delays and audit vulnerabilities.
            </p>
          </div>

          {/* 4 Glowing Cyber Problem Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            
            {/* Card 1: Document Overload */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.1)] hover:border-rose-500/60 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center font-extrabold text-base mb-5 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Massive Document Volumes</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  A single turnaround tender receives 40+ vendor submissions, each containing 200–500 pages of unsearchable PDFs, audited ledgers, and credentials.
                </p>
              </div>
              <div className="text-[11px] font-mono font-bold text-rose-300 bg-rose-950/60 border border-rose-500/30 px-3 py-1.5 rounded-lg inline-block text-center">
                8,000+ pages per tender
              </div>
            </div>

            {/* Card 2: Manual Bottleneck */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.1)] hover:border-amber-500/60 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-extrabold text-base mb-5 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">14-Day Scrutiny Delays</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Procurement officers spend weeks manually cross-typing turnover numbers into offline spreadsheets, delaying refinery maintenance shutdown schedules.
                </p>
              </div>
              <div className="text-[11px] font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-3 py-1.5 rounded-lg inline-block text-center">
                Avg 14 days manual review
              </div>
            </div>

            {/* Card 3: Discrepancy Risk */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.1)] hover:border-purple-500/60 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center font-extrabold text-base mb-5 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Hidden Cross-Doc Flaws</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Mismatches between PAN entity types, invalid CA UDIN numbers, and abnormal YoY turnover surges slip past human visual inspection unnoticed.
                </p>
              </div>
              <div className="text-[11px] font-mono font-bold text-purple-300 bg-purple-950/60 border border-purple-500/30 px-3 py-1.5 rounded-lg inline-block text-center">
                High risk of human oversight
              </div>
            </div>

            {/* Card 4: Audit Exposure */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:border-cyan-500/60 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-extrabold text-base mb-5 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Scale className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Audit & Vigilance Exposure</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Without cryptographic timestamps and immutable audit records, decisions face intense scrutiny and legal challenges under CVC and CAG audits.
                </p>
              </div>
              <div className="text-[11px] font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1.5 rounded-lg inline-block text-center">
                Zero tamper-proofing
              </div>
            </div>

          </div>

          {/* Side-by-Side High Impact Transformation Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-white/[0.12] shadow-2xl">
            
            {/* The Old Way */}
            <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">Before: The Manual Struggle</span>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Manual page-by-page inspection of dense, unindexed scanned PDF filings</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Manual calculator arithmetic for 3-year turnover thresholds and MSME relaxations</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>No automated CA UDIN verification to catch fraudulent balance sheets</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Fragmented offline spreadsheet notes with zero tamper-proof cryptographic audit trail</span>
                </li>
              </ul>
            </div>

            {/* The BidVerify AI Way */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-950/50 via-slate-900 to-cyan-950/40 border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">With CPCL Sovereign Procurement</span>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Sub-second OCR extraction</strong> with direct bounding box citations onto the source document</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Automated rule engine</strong> calculating compliance against GFR 2017 & CPCL Manual specifications</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Direct ICAI CA UDIN integrity ping</strong> catching fake or revoked certificates instantly</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Cryptographic SHA-256 sealed audit trail</strong> defending every decision before CVO and CAG audits</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* ─── SECTION 3: INTERACTIVE 8-STAGE WORKFLOW PIPELINE ───────────── */}
      <section id="how-it-works" className="py-24 px-4 sm:px-8 relative">
        <div className="max-w-[1360px] mx-auto">
          
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-950/70 border border-blue-500/40 text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 font-mono shadow-[0_0_15px_rgba(37,99,235,0.2)]">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              End-to-End Operational Pipeline
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              From Tender Release to Sovereign Contract Award
            </h2>
            <p className="text-slate-400 text-base sm:text-lg mt-4">
              Click through the 8 stages below to inspect the computational intelligence and official controls executing at each step.
            </p>
          </div>

          {/* Interactive Stepper Navigation Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
            {workflowStages.map((stage, idx) => {
              const isActive = activeWorkflowStage === idx;
              return (
                <button
                  key={stage.step}
                  onClick={() => setActiveWorkflowStage(idx)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-b from-blue-600 to-indigo-700 text-white border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-105' 
                      : 'bg-slate-900/80 text-slate-300 border-white/[0.1] hover:border-cyan-500/50 hover:bg-slate-800'
                  }`}
                >
                  <div className={`text-[10px] font-mono font-bold mb-1 ${isActive ? 'text-cyan-200' : 'text-slate-500'}`}>
                    STAGE {stage.step}
                  </div>
                  <div className="text-xs font-bold truncate">
                    {stage.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Detailed Inspection Card */}
          {(() => {
            const currentStage = workflowStages[activeWorkflowStage];
            return (
              <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-white/[0.12] shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center font-mono font-black text-lg shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                      {currentStage.step}
                    </span>
                    <div>
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                        {currentStage.badge}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-white">
                        {currentStage.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-slate-300 text-base leading-relaxed mb-6">
                    {currentStage.desc}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">Input Artifacts:</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentStage.inputs.map((inp, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 text-slate-300 text-xs font-medium border border-white/[0.1]">
                            <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
                            {inp}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Sovereign Output:</h4>
                      <p className="text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3.5 py-2.5 rounded-xl font-mono">
                        ✓ {currentStage.output}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Visual Console Preview */}
                <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-950 text-slate-200 border border-cyan-500/30 shadow-inner font-mono text-xs">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.1] text-slate-400">
                    <span className="flex items-center gap-2 text-cyan-300">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      <span>STAGE_{currentStage.step}_EXEC.sh</span>
                    </span>
                    <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">STATUS: 200 OK</span>
                  </div>
                  
                  <div className="space-y-2 text-[11px] leading-relaxed">
                    <p className="text-slate-500"># CPCL Sovereign Processing Pipeline</p>
                    <p className="text-cyan-300">
                      &gt; execute_module --stage="{currentStage.step}" --proc="CPCL/PROC/2026/128"
                    </p>
                    <p className="text-slate-300">
                      [INFO] Running algorithmic validation against GFR 2017 & CPCL Manual.
                    </p>
                    <p className="text-emerald-400">
                      [AUTH] Cryptographic check: SHA-256 verification PASS.
                    </p>
                    <p className="text-purple-300">
                      [AI] Confidence metric: 99.4% (No hallucinations detected).
                    </p>
                    <p className="text-amber-300">
                      [LOG] Audit entry committed to immutable CPCL ledger.
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-white/[0.1] flex justify-between items-center text-[11px] text-slate-400">
                    <span>Officer Sign-off: REQUIRED</span>
                    <button 
                      onClick={() => handleAuthNavigate('officer-login')} 
                      className="text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
                    >
                      Login to Inspect &rarr;
                    </button>
                  </div>
                </div>

              </div>
            );
          })()}

        </div>
      </section>

      {/* ─── SECTION 4: INTERACTIVE DOCUMENT INTELLIGENCE SHOWCASE ─────── */}
      <section id="document-intelligence" className="py-24 bg-slate-950/70 border-y border-white/[0.08] px-4 sm:px-8 relative">
        <div className="max-w-[1360px] mx-auto">
          
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-950/70 border border-purple-500/40 text-xs font-bold text-purple-400 uppercase tracking-widest mb-4 font-mono shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              Document Intelligence Console
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Interactive Bounding Box &amp; Rule Verification
            </h2>
            <p className="text-slate-400 text-base sm:text-lg mt-4">
              Select any document type below to see how BidVerify AI extracts structured entities from raw PDFs and tests them against statutory CPCL rules.
            </p>
          </div>

          {/* Document Tab Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {[
              { id: 'gst', label: 'GST Certificate (REG-06)', icon: FileText, color: 'text-cyan-400' },
              { id: 'pan', label: 'PAN Card (Corporate)', icon: FileCheck2, color: 'text-purple-400' },
              { id: 'turnover', label: 'Turnover & CA UDIN', icon: FileSpreadsheet, color: 'text-amber-400' },
              { id: 'experience', label: 'Work Experience', icon: Award, color: 'text-emerald-400' },
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = selectedDocTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedDocTab(tab.id);
                    setShowWhyAnomaly(true);
                  }}
                  className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-105' 
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-white/[0.1]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* 3-Column Interactive Console */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/90 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-cyan-500/30">
            
            {/* Column 1: Document OCR Preview with Bounding Highlight (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-slate-950 border border-white/[0.08]">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-bold text-slate-200 truncate max-w-[220px]">
                      {currentDoc.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2.5 py-0.5 rounded shadow-xs">
                    CONFIDENCE: {currentDoc.confidence}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-400 mb-3">
                  Issuer: <span className="text-slate-200 font-semibold">{currentDoc.issuer}</span>
                </div>

                {/* Simulated Document OCR Page */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-white/[0.08] text-[11px] font-mono text-slate-300 leading-relaxed whitespace-pre-wrap relative overflow-hidden">
                  {currentDoc.docSnippet}

                  {/* Bounding Box Highlight Overlay */}
                  <div className="mt-3 p-2.5 rounded-lg bg-cyan-500/15 border-2 border-cyan-400 text-cyan-200 font-bold text-xs flex items-center justify-between shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    <span>Bounding Box: {currentDoc.boundingHighlight}</span>
                    <span className="text-[10px] bg-cyan-600 text-white px-2 py-0.5 rounded font-mono">PAGE 1</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>OCR Latency: 0.84s</span>
                <span className="text-emerald-400">SHA-256 Checksum PASS</span>
              </div>
            </div>

            {/* Column 2: Extracted Structured Entities (3 cols) */}
            <div className="lg:col-span-3 p-5 rounded-2xl bg-slate-950 border border-white/[0.08] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08]">
                  <span className="text-xs font-mono font-bold text-slate-200 uppercase">
                    Extracted Entities
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>

                <div className="space-y-3">
                  {currentDoc.extracted.map((item, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-900 border border-white/[0.08] text-xs">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 font-mono">
                        {item.label}
                      </div>
                      <div className="font-mono font-bold text-white flex items-center justify-between">
                        <span className="truncate mr-2">{item.value}</span>
                        {item.status === 'verified' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.08] text-[10px] text-slate-400 font-mono">
                JSON schema mapped to GFR fields
              </div>
            </div>

            {/* Column 3: Statutory Rule Engine & Explainable AI (4 cols) */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-950 border border-white/[0.08] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08]">
                  <span className="text-xs font-mono font-bold text-slate-200 uppercase">
                    Rule Engine Evaluation
                  </span>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 border border-purple-500/40 px-2 py-0.5 rounded">
                    DETERMINISTIC
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  {currentDoc.compliance.map((rule, i) => (
                    <div 
                      key={i} 
                      className={`p-3.5 rounded-xl border text-xs ${
                        rule.pass 
                          ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' 
                          : 'bg-amber-950/50 border-amber-500/50 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[10px] font-bold text-slate-400">{rule.rule}</span>
                        <span className="font-mono font-bold text-[10px]">
                          {rule.pass ? '✓ PASS' : '⚠️ REVIEW REQUIRED'}
                        </span>
                      </div>
                      <div className="font-semibold text-[11px] leading-snug">
                        {rule.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Explainable AI Toggle for Turnover Anomaly */}
                {selectedDocTab === 'turnover' && (
                  <div className="mt-3">
                    <button
                      onClick={() => setShowWhyAnomaly(!showWhyAnomaly)}
                      className="w-full py-2.5 px-3.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-950/70 border border-amber-500/50 hover:bg-amber-900/60 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-amber-400" />
                        Why was this flagged? (Explainable AI)
                      </span>
                      {showWhyAnomaly ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {showWhyAnomaly && (
                      <div className="mt-2.5 p-3.5 rounded-xl bg-slate-900 border border-amber-500/40 text-[11px] text-slate-300 font-mono space-y-2 shadow-inner">
                        <p className="text-amber-300 font-bold">ANOMALY EXPLANATION REPORT:</p>
                        <p>1. FY 2024-25 Turnover: ₹21.10 Cr</p>
                        <p>2. FY 2025-26 Turnover: ₹48.60 Cr</p>
                        <p className="text-rose-400 font-bold">
                          3. YoY Surge: +130.33% (Surpasses normal PSU industrial tolerance of 50%).
                        </p>
                        <p className="text-slate-400">
                          Recommendation: Procurement Officer should request GST Return (GSTR-9C) reconciliation statement before commercial opening.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">Zero AI Hallucinations</span>
                <button
                  onClick={() => setEvidenceModalOpen(true)}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  Full Audit Log &rarr;
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── SECTION 5: BENTO GRID OF PLATFORM SUPERPOWERS ─────────────── */}
      <section className="py-24 px-4 sm:px-8 relative">
        <div className="max-w-[1360px] mx-auto">
          
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4 font-mono shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              Sovereign Platform Superpowers
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Engineered for High-Stakes Public Procurement
            </h2>
            <p className="text-slate-400 text-base sm:text-lg mt-4">
              Cryptographic precision, institutional security, and strict statutory alignment.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            
            {/* Bento 1: Rapid Ingestion (2 cols) */}
            <div className="md:col-span-2 p-8 rounded-3xl bg-slate-900/80 border border-white/[0.1] shadow-2xl flex flex-col justify-between hover:border-cyan-500/40 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center font-extrabold mb-6 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Sub-Second Processing</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 mb-3">
                  1.4-Second Multi-Modal Ingestion
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Extracts complex financial tables, balance sheets, and scanned official seals across 500+ page bid filings without manual copy-pasting.
                </p>
              </div>

              {/* Benchmark comparison bar */}
              <div className="space-y-3.5 p-5 rounded-2xl bg-slate-950 border border-white/[0.08] text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 font-semibold mb-1.5 font-mono">
                    <span>Traditional Manual Human Review</span>
                    <span className="text-rose-400 font-bold">14 Days (336 hrs)</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 w-full shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-cyan-300 font-bold mb-1.5 font-mono">
                    <span>BidVerify AI Sovereign Pipeline</span>
                    <span className="text-cyan-400 font-bold">18 Minutes</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 w-[7%] shadow-[0_0_15px_rgba(6,182,212,0.7)]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento 2: SHA-256 Tamper Sealing (1 col) */}
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.1)] flex flex-col justify-between hover:border-purple-500/60 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center font-extrabold mb-6 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  <Lock className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-purple-400 uppercase">Cryptographic Integrity</span>
                <h3 className="text-xl font-bold text-white mt-1 mb-3">
                  Immutable SHA-256 Hashes
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Every document receives a cryptographic seal immediately upon upload. Zero possibility of post-bid manipulation.
                </p>
              </div>

              <div className="mt-6 p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 font-mono text-[11px] text-purple-300 break-all shadow-inner">
                SHA-256: 7f8a9e21...b4e2
              </div>
            </div>

            {/* Bento 3: Dual Persona Architecture (1 col) */}
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)] flex flex-col justify-between hover:border-emerald-500/60 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-extrabold mb-6 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Zero Conflict of Interest</span>
                <h3 className="text-xl font-bold text-white mt-1 mb-3">
                  Dual Persona Separation
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Strict cryptographic isolation between CPCL Procurement Officers and external enterprise Bidders.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs font-bold text-emerald-300 bg-emerald-950/60 p-3.5 rounded-xl border border-emerald-500/40">
                <span>Officer Console</span>
                <span className="text-cyan-400">⚡</span>
                <span>Bidder Portal</span>
              </div>
            </div>

            {/* Bento 4: Statutory Alignment (2 cols) */}
            <div className="md:col-span-2 p-8 rounded-3xl bg-slate-900/80 border border-white/[0.1] shadow-2xl flex flex-col justify-between hover:border-indigo-500/40 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-extrabold mb-6 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                  <Scale className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase">Statutory Governance</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 mb-3">
                  Strict GFR 2017 & CVC Compliance
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Pre-configured compliance modules for General Financial Rules 2017, Public Procurement (Preference to Make in India) Order, and CPCL Works Manual.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/30 text-center">
                  <span className="text-xs font-bold text-indigo-300 block">GFR 2017</span>
                  <span className="text-[10px] text-slate-400">Rule 144 Compliant</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-blue-500/30 text-center">
                  <span className="text-xs font-bold text-blue-300 block">CVC Guidelines</span>
                  <span className="text-[10px] text-slate-400">Transparent Records</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 text-center">
                  <span className="text-xs font-bold text-emerald-300 block">MSME Order</span>
                  <span className="text-[10px] text-slate-400">Automated Relief</span>
                </div>
              </div>
            </div>

            {/* Bento 5: Live Activity Telemetry (2 cols) */}
            <div className="md:col-span-2 p-8 rounded-3xl bg-slate-950 border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col justify-between">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-cyan-300">REALTIME SOVEREIGN TELEMETRY</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>

              <div className="space-y-2.5 font-mono text-[11px]">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/90 border border-white/[0.06]">
                  <span className="text-cyan-300">● [11:28:04] GST REG-06 verified for Shakti Engineering</span>
                  <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded">200 OK</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/90 border border-white/[0.06]">
                  <span className="text-purple-300">● [11:28:05] ICAI UDIN checksum validated: 24089123AAAA</span>
                  <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded">AUTHENTIC</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/90 border border-white/[0.06]">
                  <span className="text-amber-300">● [11:28:06] Turnover surge alert surfaced to CPCL Officer</span>
                  <span className="text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded">FLAGGED</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.08] text-[10px] text-slate-400 font-mono flex justify-between">
                <span>System Health: 100% Operational</span>
                <span className="text-cyan-400">Air-Gapped CPCL Cluster</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── SECTION 6: TWO DEDICATED PORTAL ENTRY POINTS ──────────────── */}
      <section className="py-24 bg-slate-950/70 border-y border-white/[0.08] px-4 sm:px-8 relative">
        <div className="max-w-[1360px] mx-auto">
          
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-950/70 border border-blue-500/40 text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 font-mono shadow-[0_0_15px_rgba(37,99,235,0.2)]">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              Dual-Persona Access Gateway
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Select Your Authorized Workspace
            </h2>
            <p className="text-slate-400 text-base sm:text-lg mt-4">
              Access the dedicated portal designed for your operational role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1100px] mx-auto">
            
            {/* Officer Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border-2 border-blue-500/40 shadow-[0_0_35px_rgba(37,99,235,0.2)] flex flex-col justify-between hover:border-cyan-400 transition-all">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/30 border border-blue-400/50 text-blue-300 text-xs font-bold mb-6 shadow-sm font-mono">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  CPCL PROCUREMENT OFFICERS
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
                  Officer Scrutiny Console
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  For authorized CPCL Tender Committees, Chief Vigilance Officers, and Procurement Engineers to review bids, inspect citations, and record decisions.
                </p>

                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Side-by-side original PDF citation inspector</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Automated GFR 2017 & CPCL rule engine scorecard</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Exportable CVC & CAG defensible audit trails</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>One-click technical qualification or rejection</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleAuthNavigate('officer-login')}
                  className="w-full py-4 px-6 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Lock className="w-4 h-4" />
                  Enter Officer Console
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-center">
                  <button
                    onClick={() => handleAuthNavigate('officer-register')}
                    className="text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    Need official officer credentials? Request Registration &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Bidder Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/40 shadow-[0_0_35px_rgba(16,185,129,0.2)] flex flex-col justify-between hover:border-emerald-400 transition-all">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-600/30 border border-emerald-400/50 text-emerald-300 text-xs font-bold mb-6 shadow-sm font-mono">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  REGISTERED ENTERPRISE BIDDERS
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
                  Vendor Submission Portal
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  For industrial manufacturers, engineering contractors, and MSME vendors submitting bids for CPCL refinery tenders.
                </p>

                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Instant pre-submission compliance self-check</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Immediate SHA-256 cryptographic upload receipt</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Automated MSME turnover exemption claims</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Transparent real-time evaluation status tracking</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleAuthNavigate('bidder-login')}
                  className="w-full py-4 px-6 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Briefcase className="w-4 h-4" />
                  Enter Bidder Portal
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-center">
                  <button
                    onClick={() => handleAuthNavigate('bidder-register')}
                    className="text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    New supplier to CPCL? Register Vendor Account &rarr;
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── SECTION 7: LIVE PUBLIC TENDERS EXPLORER ───────────────────── */}
      <section id="tenders" className="py-24 px-4 sm:px-8 relative">
        <div className="max-w-[1360px] mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-950/70 border border-blue-500/40 text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 font-mono shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                <Search className="w-3.5 h-3.5 text-blue-400" />
                Public Procurement Repository
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Active CPCL Tenders
              </h2>
              <p className="text-slate-400 text-base mt-2">
                Explore currently open tenders across Chennai Petroleum Corporation Limited divisions.
              </p>
            </div>

            {/* Live Counter Badge */}
            <div className="flex items-center gap-3">
              <div className="px-5 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-xs font-bold text-slate-200">
                <span className="text-cyan-400 font-extrabold text-base mr-1.5 font-mono">{filteredTenders.length}</span>
                Active Tenders
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/[0.1] shadow-xl mb-8 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-cyan-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by tender title, ref #, division..."
                className="w-full pl-11 pr-4 py-2.5 text-xs font-medium bg-slate-950 border border-white/[0.12] rounded-xl focus:outline-none focus:border-cyan-500 text-white placeholder-slate-500 transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {['ALL', 'Mechanical Equipment', 'Services & Maintenance', 'Safety & Environmental', 'IT & Automation'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-white/[0.08]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tenders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTenders.map(t => (
              <div 
                key={t.id}
                className="p-7 rounded-2xl bg-slate-900/80 border border-white/[0.1] shadow-xl hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2.5 py-1 rounded">
                      {t.reference_number}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      {t.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                    {t.title}
                  </h3>

                  <p className="text-xs text-slate-400 font-medium mb-5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    {t.department}
                  </p>

                  <div className="p-4 rounded-xl bg-slate-950 border border-white/[0.08] mb-5 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Estimated Budget:</span>
                      <span className="font-mono font-black text-cyan-400 text-sm">
                        ₹{(t.estimated_value / 10000000).toFixed(2)} Cr
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Submission Due:</span>
                      <span className="font-mono font-semibold text-rose-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {t.submission_deadline}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-white/[0.08]">
                  <button
                    onClick={() => setSelectedTenderModal(t)}
                    className="w-full py-2.5 px-3.5 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    View Requirements &amp; Criteria
                  </button>

                  <button
                    onClick={() => handleAuthNavigate('bidder-login')}
                    className="w-full py-2.5 px-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Direct Apply as Bidder &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── SECTION 8: SOVEREIGNTY, TRUST & SECURITY GUARANTEE ────────── */}
      <section className="py-24 bg-slate-950/70 border-y border-white/[0.08] px-4 sm:px-8 relative">
        <div className="max-w-[1360px] mx-auto">
          
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4 font-mono shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Institutional Trust Guarantee
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              5 Pillars of Sovereign Procurement Security
            </h2>
            <p className="text-slate-400 text-base sm:text-lg mt-4">
              How CPCL ensures absolute confidentiality, data sovereignty, and unyielding defense against audit queries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-blue-500/30 text-left hover:border-blue-400 transition-all">
              <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold mb-4 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">On-Premise Deployment</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deployed strictly on CPCL private infrastructure or sovereign MeitY-empaneled Indian government cloud.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-purple-500/30 text-left hover:border-purple-400 transition-all">
              <div className="w-11 h-11 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center font-bold mb-4 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">Zero Data Leakage</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bidder proprietary filings are never sent to external commercial APIs or used to train third-party models.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-left hover:border-cyan-400 transition-all">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold mb-4 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">Explainable AI</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No black-box predictions. Every flag provides exact page coordinates and mathematical calculations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/30 text-left hover:border-emerald-400 transition-all">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold mb-4 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">CVC & CAG Defensible</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                One-click complete procurement dossiers ready for Chief Vigilance Officer scrutiny.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-amber-500/30 text-left hover:border-amber-400 transition-all">
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold mb-4 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">Officer Final Say</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                AI advises; authorized CPCL procurement officers decide. Zero automated disqualifications.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ─── SECTION 9: FREQUENTLY ASKED QUESTIONS (ACCORDION) ─────────── */}
      <section id="faq" className="py-24 px-4 sm:px-8 relative">
        <div className="max-w-[900px] mx-auto">
          
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-950/70 border border-blue-500/40 text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 font-mono shadow-[0_0_15px_rgba(37,99,235,0.2)]">
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              Clarity & Compliance
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl bg-slate-900/80 border border-white/[0.1] overflow-hidden shadow-xl"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-cyan-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.08]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── SECTION 10: OFFICIAL FOOTER ───────────────────────────────── */}
      <footer className="bg-[#02050E] text-slate-400 border-t border-white/[0.08] text-xs pt-20 pb-12 px-4 sm:px-8 relative z-20">
        <div className="max-w-[1360px] mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
            
            {/* Col 1 & 2: Platform Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-black text-white text-lg shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  ⚡
                </div>
                <div>
                  <span className="text-lg font-black text-white">BidVerify AI</span>
                  <p className="text-[11px] text-slate-400 font-mono">CPCL Sovereign Procurement Platform</p>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-[400px] mb-6">
                Assisting Chennai Petroleum Corporation Limited (CPCL) under the Ministry of Petroleum & Natural Gas, 
                Government of India, in achieving rapid, transparent, and legally defensible public procurement.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>System Status: Fully Operational (100.0% Uptime)</span>
              </div>
            </div>

            {/* Col 3: Portal Links */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono">Portals</h4>
              <ul className="space-y-3">
                <li><button onClick={() => handleAuthNavigate('officer-login')} className="hover:text-cyan-300 transition-colors">Officer Console</button></li>
                <li><button onClick={() => handleAuthNavigate('officer-register')} className="hover:text-cyan-300 transition-colors">Officer Registration</button></li>
                <li><button onClick={() => handleAuthNavigate('bidder-login')} className="hover:text-cyan-300 transition-colors">Bidder Submission Portal</button></li>
                <li><button onClick={() => handleAuthNavigate('bidder-register')} className="hover:text-cyan-300 transition-colors">Vendor Onboarding</button></li>
                <li><button onClick={() => scrollToSection('tenders')} className="hover:text-cyan-300 transition-colors">Public Tender Repository</button></li>
              </ul>
            </div>

            {/* Col 4: Statutory & Compliance */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono">Governance</h4>
              <ul className="space-y-3">
                <li><span className="hover:text-slate-300">General Financial Rules (GFR) 2017</span></li>
                <li><span className="hover:text-slate-300">Central Vigilance Commission (CVC)</span></li>
                <li><span className="hover:text-slate-300">Make in India Policy Order</span></li>
                <li><span className="hover:text-slate-300">ICAI CA UDIN Verification</span></li>
                <li><span className="hover:text-slate-300">MSME Udyam Exemption Framework</span></li>
              </ul>
            </div>

            {/* Col 5: Security Desk */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono">Integrity Desk</h4>
              <p className="text-slate-400 text-xs mb-3">
                Chief Vigilance Directorate<br />
                CPCL Manali Refinery, Chennai - 600068
              </p>
              <p className="text-slate-400 text-xs font-mono mb-4">
                Helpline: +91 44 2594 4000<br />
                Email: vigilance@cpcl.gov.in
              </p>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-500/40 px-3 py-1 rounded-full shadow-xs">
                SHA-256 Audit Trail Active
              </span>
            </div>

          </div>

          <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© 2026 Chennai Petroleum Corporation Limited. All rights reserved. Government of India.</p>
            <p className="font-mono text-slate-400">CPCL-SOVEREIGN-ENGINE · v2.4.0</p>
          </div>

        </div>
      </footer>

      {/* ─── MODAL 1: TENDER DETAILS MODAL ─────────────────────────────── */}
      {selectedTenderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-white/[0.12] text-white relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedTenderModal(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2.5 py-1 rounded-md">
                {selectedTenderModal.reference_number}
              </span>
              <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-full font-mono">
                {selectedTenderModal.status}
              </span>
            </div>

            <h3 className="text-2xl font-black text-white mb-2">
              {selectedTenderModal.title}
            </h3>

            <p className="text-xs text-slate-400 font-medium mb-6 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-cyan-400" />
              {selectedTenderModal.department}
            </p>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950 border border-white/[0.08] mb-6 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Estimated Budget:</span>
                <span className="text-base font-black text-cyan-400 font-mono">
                  ₹{(selectedTenderModal.estimated_value / 10000000).toFixed(2)} Cr
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Submission Deadline:</span>
                <span className="text-base font-bold text-rose-400 font-mono">
                  {selectedTenderModal.submission_deadline}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                Scope & Description
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-white/[0.08]">
                {selectedTenderModal.description}
              </p>
            </div>

            {selectedTenderModal.eligibility && (
              <div className="mb-8">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 font-mono">
                  Mandatory Eligibility & Compliance Criteria
                </h4>
                <div className="space-y-2">
                  {selectedTenderModal.eligibility.map((crit, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200 bg-cyan-950/40 border border-cyan-500/30 p-3 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{crit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div 
              style={{ display: 'flex', gap: '12px', paddingTop: '16px', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}
            >
              <button
                onClick={() => {
                  setSelectedTenderModal(null);
                  handleAuthNavigate('bidder-login');
                }}
                style={{ flex: 1, padding: '12px 20px', borderRadius: '10px', cursor: 'pointer' }}
                className="text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                Login to Submit Bid Proposal
              </button>

              <button
                onClick={() => setSelectedTenderModal(null)}
                style={{ padding: '12px 20px', borderRadius: '10px', cursor: 'pointer' }}
                className="text-xs font-bold text-slate-400 hover:text-white bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─── MODAL 2: CRYPTOGRAPHIC EVIDENCE & AUDIT TRAIL MODAL ───────── */}
      {evidenceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-cyan-500/40 text-white relative max-h-[90vh] overflow-y-auto font-mono">
            
            <button
              onClick={() => setEvidenceModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-3 py-1 rounded-md">
                EVIDENCE CITATION INSPECTOR
              </span>
              <span className="text-xs text-slate-400 font-mono">REF: CPCL/PROC/2026/128</span>
            </div>

            <h3 className="text-xl font-black text-white font-sans mb-1">
              Shakti Engineering &amp; Infrastructure Ltd
            </h3>
            <p className="text-xs text-slate-400 font-sans mb-6">
              Full cryptographic evidence payload generated by Sovereign OCR and Rule Engine.
            </p>

            <div className="space-y-4 mb-6">
              
              {/* Check 1 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs shadow-inner">
                <div className="flex justify-between text-cyan-300 font-bold mb-1.5">
                  <span>1. GST REG-06 CERTIFICATE</span>
                  <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">✓ VERIFIED</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Extracted GSTIN: 33AAACS1429B1Z8 (State: Tamil Nadu)<br />
                  Checksum: Valid Modulo 36 check passed.<br />
                  Source Citation: Page 1, Coordinates [x: 142, y: 310, w: 220, h: 42]
                </p>
              </div>

              {/* Check 2 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 text-xs shadow-inner">
                <div className="flex justify-between text-purple-300 font-bold mb-1.5">
                  <span>2. CA UDIN TURNOVER STATEMENT</span>
                  <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">✓ ICAI AUTHENTICATED</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  CA UDIN: 24089123AAAAAA1029<br />
                  Turnover FY 2025-26: ₹48.60 Cr (3-Yr Avg: ₹29.36 Cr &gt; Threshold ₹25 Cr)<br />
                  ICAI Status: Valid Active UDIN issued by Chartered Accountant M. Karthik
                </p>
              </div>

              {/* Check 3 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 text-xs shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <div className="flex justify-between text-amber-300 font-bold mb-1.5">
                  <span>3. REVENUE SURGE ANOMALY</span>
                  <span className="text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-400/40 animate-pulse">⚠️ FLAGGED FOR OFFICER</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Variance: +130.3% surge from FY25 baseline (₹21.10 Cr to ₹48.60 Cr).<br />
                  Rule: RULE-FIN-004 (Tolerance threshold 50%).<br />
                  Recommendation: Procurement Officer discretion required before opening price bid.
                </p>
              </div>

              {/* Audit Block */}
              <div className="p-4 rounded-xl bg-slate-950 border border-white/[0.08] text-[11px] text-slate-400 font-mono">
                <div className="text-emerald-400 font-bold mb-1">IMMUTABLE RECORD DIGEST</div>
                <div>Payload SHA-256: 7f8a9e210b3d819c9e821fa7b2a95c478a2e19b0d1e8432a</div>
                <div>Timestamp: 2026-09-14T11:28:06.429Z</div>
                <div>Signing Key: CPCL_SOVEREIGN_NODE_01 (Air-Gapped)</div>
              </div>

            </div>

            <div 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}
            >
              <button
                onClick={() => {
                  setEvidenceModalOpen(false);
                  handleAuthNavigate('officer-login');
                }}
                style={{ padding: '11px 22px', borderRadius: '10px', cursor: 'pointer' }}
                className="text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
              >
                Login as Officer to Take Action &rarr;
              </button>

              <button
                onClick={() => setEvidenceModalOpen(false)}
                style={{ padding: '11px 20px', borderRadius: '10px', cursor: 'pointer' }}
                className="text-xs font-bold text-slate-400 hover:text-white bg-slate-800 transition-colors"
              >
                Dismiss
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
