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
import './LandingPage.css';

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
  const [activeWorkflowStage, setActiveWorkflowStage] = useState(2); // Default to OCR Ingestion
  const [openFaq, setOpenFaq] = useState(0);
  const [cockpitView, setCockpitView] = useState('ocr'); // 'ocr' | 'scorecard'

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

  // 8-Stage Workflow Data
  const workflowStages = [
    { 
      step: '01', 
      title: 'Tender Spec', 
      badge: 'Specification',
      desc: 'CPCL Procurement Officers define technical eligibility criteria, statutory mandatory filings, and average turnover thresholds.',
      inputs: ['GFR 2017 Tender Notice', 'Mandatory Document Matrix', 'Financial Turnover Thresholds'],
      output: 'Cryptographically sealed tender specification published on Sovereign CPCL Portal.'
    },
    { 
      step: '02', 
      title: 'Bid Submission', 
      badge: 'Vendor Proposal',
      desc: 'Registered vendors submit encrypted technical bids, GST Form REG-06, CA audited statements, and past PSU experience letters.',
      inputs: ['Form REG-06 (GST)', 'CA UDIN Certificate', 'Completion Certificates'],
      output: 'Tamper-evident submission container with immutable digital timestamp.'
    },
    { 
      step: '03', 
      title: 'OCR Ingestion', 
      badge: 'Multi-Modal OCR',
      desc: 'High-speed OCR engine extracts printed text, tabular financials, and government stamps from 500+ page scanned filings in seconds.',
      inputs: ['Scanned PDF Bids', 'Audited Financial Exhibits', 'PESO / Factory Approvals'],
      output: 'Normalized UTF-8 text layer with precise bounding box coordinates.'
    },
    { 
      step: '04', 
      title: 'Entity Extraction', 
      badge: 'Semantic Mapping',
      desc: 'Named Entity Recognition (NER) extracts key statutory fields: GSTIN, PAN, CA UDIN, 3-year turnover totals, and completion values.',
      inputs: ['Normalized OCR Stream', 'Statutory Entity Lexicon'],
      output: 'Structured, typed JSON payload cross-referenced to GFR schema.'
    },
    { 
      step: '05', 
      title: 'Rule Engine', 
      badge: 'Compliance Scoring',
      desc: 'Deterministic rule engine evaluates submissions against GFR 2017, Make-in-India guidelines, and CPCL tender requirements.',
      inputs: ['Extracted JSON Data', 'CPCL Manual Rules', 'GFR 2017 Rules'],
      output: 'Item-by-item compliance matrix with direct source citations.'
    },
    { 
      step: '06', 
      title: 'Anomaly Detection', 
      badge: 'Fraud Shield',
      desc: 'Statistical engine detects YoY financial spikes, checks UDIN checksum integrity, and flags discrepancies across vendor documents.',
      inputs: ['ICAI UDIN Registry', 'GST Status API', 'Historical Baseline Turnovers'],
      output: 'Red-flag alerts with explainable mathematical justifications.'
    },
    { 
      step: '07', 
      title: 'Officer Scrutiny', 
      badge: 'Human Oversight',
      desc: 'Authorized CPCL Procurement Officers review AI findings, inspect bounding-box citations side-by-side, and record official notes.',
      inputs: ['AI Evaluation Dossier', 'Source Document Viewer', 'Officer Notes'],
      output: 'Signed officer recommendation with 100% human accountability.'
    },
    { 
      step: '08', 
      title: 'Sovereign Award', 
      badge: 'Audit Seal',
      desc: 'Technical qualification decision is cryptographically sealed with SHA-256 hashes, producing a CVC/CAG defensible audit record.',
      inputs: ['Committee Minutes', 'Evaluation Records', 'Signed Sign-Off'],
      output: 'Immutable audit archive and technical opening clearance.'
    }
  ];

  // Document Intelligence Data
  const documentIntelligenceData = {
    gst: {
      name: 'GST Registration Certificate (Form REG-06)',
      issuer: 'Government of India · Goods and Services Tax Network',
      docSnippet: `GOVERNMENT OF INDIA · FORM GST REG-06
Registration Certificate
Registration Number: 33AAACS1429B1Z8
Legal Name: SHAKTI ENGINEERING & INFRASTRUCTURE LTD
Trade Name: SHAKTI ENGINEERING
Principal Place of Business: Plot 42, SIDCO Industrial Estate, Ambattur, Chennai - 600058
Date of Liability: 01/07/2017 · Period of Validity: Regular`,
      boundingHighlight: 'Registration Number: 33AAACS1429B1Z8',
      confidence: '99.4%',
      extracted: [
        { label: 'Entity Name', value: 'SHAKTI ENGINEERING & INFRASTRUCTURE LTD' },
        { label: 'GSTIN Number', value: '33AAACS1429B1Z8', status: 'verified' },
        { label: 'State Code', value: '33 (Tamil Nadu)', status: 'verified' },
        { label: 'Registration Status', value: 'Active Regular Taxpayer', status: 'verified' }
      ],
      compliance: [
        { label: 'Active Status on GST Portal via CBIC Registry', pass: true, rule: 'RULE-GST-01' },
        { label: 'Entity Name Matches Tender Bidder Exactly', pass: true, rule: 'RULE-GST-02' },
        { label: 'Valid State Jurisdiction (Tamil Nadu)', pass: true, rule: 'RULE-GST-03' }
      ]
    },
    pan: {
      name: 'Corporate Permanent Account Number (PAN)',
      issuer: 'Income Tax Department · National Securities Depository Limited',
      docSnippet: `INCOME TAX DEPARTMENT · GOVT OF INDIA
Permanent Account Number Card
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
      a: 'No. BidVerify AI is strictly an assistive intelligence copilot. Under GFR 2017 and Central Vigilance Commission (CVC) directives, all technical qualifying determinations, rejections, and contract awards require the explicit review and sign-off of authorized CPCL Procurement Officers. The platform accelerates document review from hours to seconds and surfaces flagged anomalies, but the human officer maintains 100% decisive authority.'
    },
    {
      q: 'How does the platform prevent document fraud and tampering?',
      a: 'Every document uploaded by a vendor is instantly digested into a cryptographic SHA-256 hash at the exact second of submission. This cryptographic fingerprint is stored in an immutable audit ledger. If even a single byte or pixel of a submitted PDF is altered post-submission, the checksum fails instantly.'
    },
    {
      q: 'What is CA UDIN verification and how does it work?',
      a: 'The Institute of Chartered Accountants of India (ICAI) mandates a Unique Document Identification Number (UDIN) on all audited turnover certificates. BidVerify AI automatically extracts the 18-digit UDIN, verifies its mathematical checksum, and validates it against ICAI records to eliminate fake balance sheets.'
    },
    {
      q: 'Is bidder proprietary data kept secure and confidential?',
      a: 'Yes. BidVerify AI operates within an on-premise, air-gapped sovereign deployment topology. Bidder financial data, client references, and proprietary technical designs are never sent to public commercial LLM APIs and never used for external model training.'
    },
    {
      q: 'Can MSME vendors claim statutory exemptions through the portal?',
      a: 'Yes. The system automatically reads Udyam Registration certificates and cross-checks MSME classifications (Micro, Small, Medium) to apply statutory exemptions such as EMD waivers and turnover relaxations in accordance with Government of India public procurement policies.'
    }
  ];

  return (
    <div className="landing-container">
      
      {/* ─── AMBIENT GLOW EFFECTS ───────────────────────────────────────── */}
      <div className="ambient-glow-top" />
      <div className="ambient-glow-mid" />

      {/* ─── LEVEL 1: OFFICIAL GOVERNMENT AUTHORITY BAR ────────────────── */}
      <div className="top-gov-bar">
        <div className="top-gov-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#E2E8F0' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }}></span>
              Government of India
            </span>
            <span style={{ color: '#475569' }}>|</span>
            <span style={{ color: '#94A3B8' }}>Ministry of Petroleum &amp; Natural Gas</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 style={{ width: '14px', height: '14px', color: '#60A5FA' }} />
            <span>Chennai Petroleum Corporation Limited (A Group Company of Indian Oil)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }}></span>
            <span style={{ fontFamily: 'monospace', color: '#34D399', fontWeight: 600, fontSize: '11px' }}>
              Sovereign Node: Active
            </span>
          </div>
        </div>
      </div>

      {/* ─── LEVEL 2: REFINED GLASS NAVIGATION BAR ────────────────────── */}
      <header className="landing-header">
        <div className="landing-header-inner">
          
          {/* CPCL Branding */}
          <div 
            className="brand-group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="brand-icon-box">
              <ShieldCheck style={{ width: '22px', height: '22px' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="brand-title">
                  BidVerify <span style={{ color: '#60A5FA' }}>AI</span>
                </span>
                <span className="brand-badge">
                  CPCL SOVEREIGN
                </span>
              </div>
              <p className="brand-subtitle">
                Chennai Petroleum Corporation Limited
              </p>
            </div>
          </div>

          {/* Navigation Links with explicit gaps */}
          <nav className="nav-links-bar" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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
                className="nav-link-item"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Portal Buttons with explicit gap */}
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => handleAuthNavigate('bidder-login')}
              className="btn-bidder-ghost"
            >
              <Briefcase style={{ width: '14px', height: '14px', color: '#94A3B8' }} />
              Bidder Portal
            </button>

            <button
              onClick={() => handleAuthNavigate('officer-login')}
              className="btn-officer-primary"
            >
              <ShieldCheck style={{ width: '15px', height: '15px' }} />
              Officer Console
            </button>

            {/* Mobile Hamburger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', cursor: 'pointer' }}
              className="lg:hidden"
            >
              {mobileMenuOpen ? <X style={{ width: '20px', height: '20px' }} /> : <Menu style={{ width: '20px', height: '20px' }} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div style={{ marginTop: '12px', padding: '16px', background: '#0D1426', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={() => scrollToSection('problem')} style={{ padding: '8px 12px', textAlign: 'left', background: 'transparent', border: 'none', color: '#CBD5E1', fontSize: '13px', cursor: 'pointer' }}>Why AI</button>
            <button onClick={() => scrollToSection('how-it-works')} style={{ padding: '8px 12px', textAlign: 'left', background: 'transparent', border: 'none', color: '#CBD5E1', fontSize: '13px', cursor: 'pointer' }}>8-Stage Workflow</button>
            <button onClick={() => scrollToSection('document-intelligence')} style={{ padding: '8px 12px', textAlign: 'left', background: 'transparent', border: 'none', color: '#CBD5E1', fontSize: '13px', cursor: 'pointer' }}>Document Intelligence</button>
            <button onClick={() => scrollToSection('tenders')} style={{ padding: '8px 12px', textAlign: 'left', background: 'transparent', border: 'none', color: '#CBD5E1', fontSize: '13px', cursor: 'pointer' }}>Live Tenders</button>
            <button onClick={() => scrollToSection('faq')} style={{ padding: '8px 12px', textAlign: 'left', background: 'transparent', border: 'none', color: '#CBD5E1', fontSize: '13px', cursor: 'pointer' }}>FAQ</button>
            <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <button onClick={() => handleAuthNavigate('bidder-login')} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#1E293B', border: 'none', color: '#CBD5E1', fontWeight: 600, fontSize: '12px' }}>Bidder Portal</button>
              <button onClick={() => handleAuthNavigate('officer-login')} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#2563EB', border: 'none', color: '#FFFFFF', fontWeight: 600, fontSize: '12px' }}>Officer Console</button>
            </div>
          </div>
        )}
      </header>

      {/* ─── SECTION 1: HERO SECTION ───────────────────────────────────── */}
      <section id="hero" className="hero-section">
        <div className="hero-grid">
          
          {/* Left Column: Value Proposition */}
          <div>
            
            {/* Top Pill */}
            <div className="hero-badge-pill">
              <Sparkles style={{ width: '14px', height: '14px', color: '#60A5FA' }} />
              <span>CPCL Sovereign Defense Grade</span>
              <span style={{ color: '#475569' }}>·</span>
              <span style={{ color: '#94A3B8' }}>Manali Refinery Unit-3</span>
            </div>

            {/* Headline */}
            <h1 className="hero-heading">
              Autonomous Scrutiny. <br />
              <span className="gradient-text-blue">
                Defensible Compliance.
              </span> <br />
              Zero Fraud Tolerance.
            </h1>

            {/* Subheading */}
            <p className="hero-description">
              Advanced AI procurement intelligence engineered for <strong style={{ color: '#FFFFFF' }}>Chennai Petroleum Corporation Limited (CPCL)</strong>. 
              Accelerates multi-crore tender scrutiny from 14 days to under 30 minutes with sub-second OCR, statutory GSTIN/PAN verification, and ICAI UDIN integrity seals — with <strong style={{ color: '#38BDF8' }}>100% human officer final decision control</strong>.
            </p>

            {/* CTA Action Buttons with explicit gap */}
            <div className="hero-actions-row">
              <button
                onClick={() => scrollToSection('tenders')}
                className="btn-hero-primary"
              >
                <Search style={{ width: '16px', height: '16px' }} />
                Explore Live CPCL Tenders
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>

              <button
                onClick={() => scrollToSection('document-intelligence')}
                className="btn-hero-secondary"
              >
                <Play style={{ width: '15px', height: '15px', color: '#60A5FA', fill: '#60A5FA' }} />
                Test AI Document Scanner
              </button>
            </div>

            {/* Trust Assurance Pills with explicit gap */}
            <div className="trust-badges-row">
              <span className="trust-badge-item">
                <Zap style={{ width: '14px', height: '14px', color: '#60A5FA' }} /> 1.4s OCR Extraction
              </span>
              <span className="trust-badge-item">
                <Lock style={{ width: '14px', height: '14px', color: '#818CF8' }} /> SHA-256 Tamper Sealed
              </span>
              <span className="trust-badge-item">
                <UserCheck style={{ width: '14px', height: '14px', color: '#34D399' }} /> 100% Officer Final Say
              </span>
            </div>

            {/* Metric Counters */}
            <div className="stat-cards-row">
              <div className="stat-card">
                <div className="stat-num">1.4s</div>
                <div className="stat-label">Multi-page OCR Speed</div>
              </div>
              <div className="stat-card">
                <div className="stat-num" style={{ color: '#60A5FA' }}>99.8%</div>
                <div className="stat-label">Clause Verification</div>
              </div>
              <div className="stat-card">
                <div className="stat-num" style={{ color: '#34D399' }}>₹450 Cr+</div>
                <div className="stat-label">Tenders Protected</div>
              </div>
            </div>

          </div>

          {/* Right Column: Live Interactive Scrutiny Cockpit */}
          <div>
            <div className="cockpit-box">
              
              {/* Cockpit Header */}
              <div className="cockpit-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60A5FA' }}>
                    <Activity style={{ width: '18px', height: '18px' }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>Shakti Engineering Bid Package #128</span>
                      <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#34D399', background: 'rgba(6,78,59,0.5)', border: '1px solid rgba(16,185,129,0.3)', padding: '2px 6px', borderRadius: '4px' }}>
                        0.8s
                      </span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                      Tender: CPCL/PROC/2026/128 · Cauvery Basin High-Pressure API 6D Valves
                    </p>
                  </div>
                </div>

                {/* View switcher */}
                <div style={{ display: 'flex', background: '#090D1C', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', gap: '4px' }}>
                  <button
                    onClick={() => setCockpitView('ocr')}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: 'none',
                      background: cockpitView === 'ocr' ? '#2563EB' : 'transparent',
                      color: cockpitView === 'ocr' ? '#FFFFFF' : '#94A3B8'
                    }}
                  >
                    OCR Scan
                  </button>
                  <button
                    onClick={() => setCockpitView('scorecard')}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: 'none',
                      background: cockpitView === 'scorecard' ? '#2563EB' : 'transparent',
                      color: cockpitView === 'scorecard' ? '#FFFFFF' : '#94A3B8'
                    }}
                  >
                    Scorecard
                  </button>
                </div>
              </div>

              {/* View 1: OCR Inspection View */}
              {cockpitView === 'ocr' ? (
                <div className="cockpit-content">
                  
                  {/* Document Preview Snippet with Bounding Box */}
                  <div className="doc-snippet-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#64748B', fontSize: '10px' }}>
                      <span>Source PDF: Shakti_Turnover_Cert_ICAI.pdf</span>
                      <span style={{ color: '#60A5FA', fontWeight: 700 }}>PAGE 1 OF 3</span>
                    </div>
                    <div>
                      <p style={{ color: '#94A3B8' }}>INDEPENDENT AUDITOR’S CERTIFICATE ON ANNUAL TURNOVER</p>
                      <p style={{ color: '#94A3B8' }}>Client: Shakti Engineering &amp; Infrastructure Ltd</p>
                      <p style={{ color: '#94A3B8' }}>CA UDIN: 24089123AAAAAA1029</p>
                      
                      <div className="bounding-pill">
                        <span>3-Year Average Turnover: ₹29.36 Cr</span>
                        <span style={{ fontSize: '10px', background: '#2563EB', color: '#FFFFFF', padding: '2px 6px', borderRadius: '4px' }}>
                          REQ MET: &gt;₹25 Cr
                        </span>
                      </div>
                      
                      <div className="bounding-pill" style={{ background: 'rgba(120,53,15,0.4)', borderColor: 'rgba(245,158,11,0.5)', color: '#FDE68A' }}>
                        <span>FY26 Surge: ₹48.60 Cr (+130.3% YoY)</span>
                        <span style={{ fontSize: '10px', background: '#D97706', color: '#FFFFFF', padding: '2px 6px', borderRadius: '4px' }}>
                          SURFACED TO OFFICER
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Verification Status Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="check-row-item">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10B981' }} />
                        <div>
                          <span style={{ fontWeight: 600, color: '#F1F5F9', display: 'block' }}>GST Form REG-06 Certificate</span>
                          <span style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>GSTIN 33AAACS1429B1Z8 · Active Regular on CBIC</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'monospace', color: '#34D399', background: 'rgba(6,78,59,0.6)', border: '1px solid rgba(16,185,129,0.3)', padding: '2px 8px', borderRadius: '4px' }}>
                        100% MATCH
                      </span>
                    </div>

                    <div className="check-row-item">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10B981' }} />
                        <div>
                          <span style={{ fontWeight: 600, color: '#F1F5F9', display: 'block' }}>ICAI CA UDIN Checksum</span>
                          <span style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>UDIN 24089123AAAAAA1029 · Verified with ICAI</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'monospace', color: '#34D399', background: 'rgba(6,78,59,0.6)', border: '1px solid rgba(16,185,129,0.3)', padding: '2px 8px', borderRadius: '4px' }}>
                        AUTHENTIC
                      </span>
                    </div>

                    <div className="check-row-item" style={{ background: 'rgba(120,53,15,0.2)', borderColor: 'rgba(245,158,11,0.25)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <AlertTriangle style={{ width: '16px', height: '16px', color: '#F59E0B' }} />
                        <div>
                          <span style={{ fontWeight: 600, color: '#FDE68A', display: 'block' }}>Revenue Surge Anomaly</span>
                          <span style={{ fontSize: '11px', color: '#FCD34D', fontFamily: 'monospace' }}>+130.3% YoY surge requires officer reconciliation</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'monospace', color: '#F59E0B', background: 'rgba(120,53,15,0.6)', border: '1px solid rgba(245,158,11,0.4)', padding: '2px 8px', borderRadius: '4px' }}>
                        FLAGGED
                      </span>
                    </div>
                  </div>

                </div>
              ) : (
                /* View 2: Scorecard View */
                <div className="cockpit-content">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                    <div style={{ padding: '14px', borderRadius: '12px', background: '#060A16', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Compliance</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'monospace', marginTop: '4px' }}>94%</div>
                    </div>
                    <div style={{ padding: '14px', borderRadius: '12px', background: '#060A16', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Risk Score</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#10B981', fontFamily: 'monospace', marginTop: '4px' }}>LOW</div>
                    </div>
                    <div style={{ padding: '14px', borderRadius: '12px', background: '#060A16', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>AI Confidence</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#60A5FA', fontFamily: 'monospace', marginTop: '4px' }}>98.4%</div>
                    </div>
                  </div>

                  <div style={{ padding: '14px', borderRadius: '12px', background: '#060A16', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E2E8F0' }}>
                      <span>GFR Rule 144(xi) Security Clearance:</span>
                      <span style={{ color: '#10B981', fontWeight: 700, fontFamily: 'monospace' }}>PASSED</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E2E8F0' }}>
                      <span>Make in India Class-1 Local Supplier:</span>
                      <span style={{ color: '#10B981', fontWeight: 700, fontFamily: 'monospace' }}>QUALIFIED</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E2E8F0' }}>
                      <span>Mandatory Financial Turnover (&gt;₹25 Cr):</span>
                      <span style={{ color: '#10B981', fontWeight: 700, fontFamily: 'monospace' }}>₹29.36 Cr [MET]</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E2E8F0' }}>
                      <span>Prior PSU Refinery Experience:</span>
                      <span style={{ color: '#10B981', fontWeight: 700, fontFamily: 'monospace' }}>BPCL Kochi [VERIFIED]</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Cockpit Footer Action */}
              <div style={{ padding: '14px 20px', background: 'rgba(6,10,22,0.85)', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  onClick={() => setEvidenceModalOpen(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#60A5FA', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  <Eye style={{ width: '15px', height: '15px' }} />
                  Inspect Cryptographic Proof &amp; UDIN Citations &rarr;
                </button>

                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748B' }}>
                  SHA-256: 7f8a9...b4e2
                </span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─── SECTION 2: THE PROCUREMENT VULNERABILITY ──────────────────── */}
      <section id="problem" className="landing-section-alt">
        <div className="section-container">
          
          <div className="section-header-center">
            <span className="section-pill" style={{ background: 'rgba(159,18,57,0.4)', border: '1px solid rgba(244,63,94,0.3)', color: '#FB7185' }}>
              <AlertTriangle style={{ width: '13px', height: '13px' }} />
              The Public Procurement Vulnerability
            </span>
            <h2 className="section-title">
              Why Traditional Manual Scrutiny Breaks Down
            </h2>
            <p className="section-desc">
              Chennai Petroleum Corporation Limited executes mission-critical refinery tenders. 
              Manual human review of hundreds of 500-page scanned filings introduces massive commercial delays and audit vulnerabilities.
            </p>
          </div>

          {/* 4 Problem Cards */}
          <div className="problems-grid">
            
            {/* Card 1 */}
            <div className="problem-card">
              <div>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', color: '#FB7185', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <FileText style={{ width: '20px', height: '20px' }} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>Massive Document Overload</h3>
                <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '16px' }}>
                  A single turnaround tender receives 40+ vendor submissions, each containing 200–500 pages of unsearchable PDFs and audited ledgers.
                </p>
              </div>
              <div style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 600, color: '#FDA4AF', background: 'rgba(159,18,57,0.3)', border: '1px solid rgba(244,63,94,0.2)', padding: '4px 10px', borderRadius: '6px', textAlign: 'center' }}>
                8,000+ pages per tender
              </div>
            </div>

            {/* Card 2 */}
            <div className="problem-card">
              <div>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#FBBF24', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Clock style={{ width: '20px', height: '20px' }} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>14-Day Scrutiny Delays</h3>
                <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '16px' }}>
                  Procurement officers spend weeks manually retyping turnover numbers into spreadsheets, delaying refinery shutdown schedules.
                </p>
              </div>
              <div style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 600, color: '#FDE68A', background: 'rgba(120,53,15,0.3)', border: '1px solid rgba(245,158,11,0.2)', padding: '4px 10px', borderRadius: '6px', textAlign: 'center' }}>
                Avg 14 days manual review
              </div>
            </div>

            {/* Card 3 */}
            <div className="problem-card">
              <div>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: '#A5B4FC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Search style={{ width: '20px', height: '20px' }} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>Hidden Cross-Doc Flaws</h3>
                <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '16px' }}>
                  Mismatches between PAN entity types, invalid CA UDINs, and abnormal YoY turnover surges easily slip past human eye.
                </p>
              </div>
              <div style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 600, color: '#C7D2FE', background: 'rgba(49,46,129,0.3)', border: '1px solid rgba(99,102,241,0.2)', padding: '4px 10px', borderRadius: '6px', textAlign: 'center' }}>
                High risk of human oversight
              </div>
            </div>

            {/* Card 4 */}
            <div className="problem-card">
              <div>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.3)', color: '#60A5FA', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Scale style={{ width: '20px', height: '20px' }} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>Audit &amp; Vigilance Exposure</h3>
                <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '16px' }}>
                  Without immutable digital audit records, manual decisions face intense scrutiny and legal disputes under CVC and CAG audits.
                </p>
              </div>
              <div style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 600, color: '#BAE6FD', background: 'rgba(30,58,138,0.3)', border: '1px solid rgba(37,99,235,0.2)', padding: '4px 10px', borderRadius: '6px', textAlign: 'center' }}>
                Zero tamper-proof audit
              </div>
            </div>

          </div>

          {/* Transformation Comparison Box */}
          <div className="comparison-box">
            
            {/* The Old Way */}
            <div style={{ padding: '20px', borderRadius: '14px', background: 'rgba(10,14,28,0.7)', border: '1px solid rgba(244,63,94,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F43F5E' }}></span>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: '#FB7185', textTransform: 'uppercase' }}>Before: Manual Scrutiny</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px', color: '#CBD5E1' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <X style={{ width: '16px', height: '16px', color: '#F43F5E', flexShrink: 0, marginTop: '2px' }} />
                  <span>Manual page-by-page inspection of dense, unindexed scanned PDF filings</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <X style={{ width: '16px', height: '16px', color: '#F43F5E', flexShrink: 0, marginTop: '2px' }} />
                  <span>Calculator arithmetic for 3-year turnover thresholds and MSME relaxations</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <X style={{ width: '16px', height: '16px', color: '#F43F5E', flexShrink: 0, marginTop: '2px' }} />
                  <span>No automated CA UDIN verification to catch fraudulent balance sheets</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <X style={{ width: '16px', height: '16px', color: '#F43F5E', flexShrink: 0, marginTop: '2px' }} />
                  <span>Fragmented spreadsheet notes with zero tamper-proof cryptographic audit trail</span>
                </li>
              </ul>
            </div>

            {/* The BidVerify AI Way */}
            <div style={{ padding: '20px', borderRadius: '14px', background: 'rgba(10,14,28,0.7)', border: '1px solid rgba(59,130,246,0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#60A5FA' }}></span>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: '#60A5FA', textTransform: 'uppercase' }}>With CPCL BidVerify AI</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px', color: '#E2E8F0' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px', color: '#60A5FA', flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Sub-second OCR extraction</strong> with direct bounding box citations on source documents</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px', color: '#60A5FA', flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Automated rule engine</strong> calculating compliance against GFR 2017 &amp; CPCL Works Manual</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px', color: '#60A5FA', flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Direct ICAI CA UDIN integrity check</strong> catching fake or revoked certificates instantly</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px', color: '#60A5FA', flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Cryptographic SHA-256 sealed audit trail</strong> defending every decision before CVO and CAG audits</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* ─── SECTION 3: 8-STAGE WORKFLOW PIPELINE ──────────────────────── */}
      <section id="how-it-works" className="landing-section">
        <div className="section-container">
          
          <div className="section-header-center">
            <span className="section-pill" style={{ background: 'rgba(30,58,138,0.4)', border: '1px solid rgba(59,130,246,0.3)', color: '#93C5FD' }}>
              <Activity style={{ width: '13px', height: '13px' }} />
              End-to-End Operational Pipeline
            </span>
            <h2 className="section-title">
              From Tender Spec to Sovereign Award
            </h2>
            <p className="section-desc">
              Click through the 8 stages below to inspect the computational intelligence executing at each milestone.
            </p>
          </div>

          {/* Stepper Buttons with explicit gap */}
          <div className="workflow-stepper">
            {workflowStages.map((stage, idx) => {
              const isActive = activeWorkflowStage === idx;
              return (
                <button
                  key={stage.step}
                  onClick={() => setActiveWorkflowStage(idx)}
                  className={`stage-step-btn ${isActive ? 'active' : ''}`}
                >
                  <div style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 700, marginBottom: '4px', color: isActive ? '#BFDBFE' : '#64748B' }}>
                    STAGE {stage.step}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: isActive ? '#FFFFFF' : '#CBD5E1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {stage.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Detail Pane */}
          {(() => {
            const currentStage = workflowStages[activeWorkflowStage];
            return (
              <div style={{ padding: '32px', borderRadius: '20px', background: 'rgba(13,20,38,0.9)', border: '1px solid rgba(255,255,255,0.08)', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', alignItems: 'center' }}>
                
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                    <span style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#2563EB', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontWeight: 800, fontSize: '18px' }}>
                      {currentStage.step}
                    </span>
                    <div>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 600, color: '#60A5FA', textTransform: 'uppercase' }}>
                        {currentStage.badge}
                      </span>
                      <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF' }}>
                        {currentStage.title}
                      </h3>
                    </div>
                  </div>

                  <p style={{ fontSize: '14px', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '20px' }}>
                    {currentStage.desc}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: '8px' }}>
                        Input Artifacts:
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {currentStage.inputs.map((inp, i) => (
                          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: '#060A16', color: '#CBD5E1', fontSize: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <FileCheck2 style={{ width: '14px', height: '14px', color: '#60A5FA' }} />
                            {inp}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: '6px' }}>
                        Sovereign Output:
                      </h4>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: '#34D399', background: 'rgba(6,78,59,0.4)', border: '1px solid rgba(16,185,129,0.25)', padding: '10px 14px', borderRadius: '10px', fontFamily: 'monospace' }}>
                        ✓ {currentStage.output}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Pipeline Terminal Preview */}
                <div style={{ padding: '20px', borderRadius: '14px', background: '#060A16', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'monospace', fontSize: '11px', color: '#E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60A5FA' }}>
                      <Terminal style={{ width: '14px', height: '14px' }} />
                      <span>STAGE_{currentStage.step}_EXEC.sh</span>
                    </span>
                    <span style={{ fontSize: '10px', color: '#34D399', fontWeight: 700, background: 'rgba(6,78,59,0.6)', padding: '2px 6px', borderRadius: '4px' }}>STATUS: 200 OK</span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.6 }}>
                    <p style={{ color: '#64748B' }}># CPCL Sovereign Processing Pipeline</p>
                    <p style={{ color: '#93C5FD' }}>
                      &gt; execute_module --stage="{currentStage.step}" --proc="CPCL/PROC/2026/128"
                    </p>
                    <p style={{ color: '#CBD5E1' }}>
                      [INFO] Running algorithmic validation against GFR 2017 &amp; CPCL Manual.
                    </p>
                    <p style={{ color: '#34D399' }}>
                      [AUTH] Cryptographic check: SHA-256 verification PASS.
                    </p>
                    <p style={{ color: '#C7D2FE' }}>
                      [AI] Confidence metric: 99.4% (Deterministic logic, no hallucinations).
                    </p>
                    <p style={{ color: '#FDE68A' }}>
                      [LOG] Audit entry committed to immutable CPCL ledger.
                    </p>
                  </div>

                  <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#94A3B8' }}>
                    <span>Officer Sign-off: REQUIRED</span>
                    <button 
                      onClick={() => handleAuthNavigate('officer-login')} 
                      style={{ color: '#60A5FA', fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer' }}
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

      {/* ─── SECTION 4: INTERACTIVE DOCUMENT INTELLIGENCE ──────────────── */}
      <section id="document-intelligence" className="landing-section-alt">
        <div className="section-container">
          
          <div className="section-header-center">
            <span className="section-pill" style={{ background: 'rgba(30,58,138,0.4)', border: '1px solid rgba(59,130,246,0.3)', color: '#93C5FD' }}>
              <Cpu style={{ width: '13px', height: '13px' }} />
              Document Intelligence Console
            </span>
            <h2 className="section-title">
              Interactive Bounding Box &amp; Rule Verification
            </h2>
            <p className="section-desc">
              Select any document type below to see how BidVerify AI extracts structured entities and tests them against statutory rules.
            </p>
          </div>

          {/* Document Tab Switcher with explicit gap */}
          <div className="doc-tabs-row">
            {[
              { id: 'gst', label: 'GST Certificate (REG-06)', icon: FileText },
              { id: 'pan', label: 'Corporate PAN Card', icon: FileCheck2 },
              { id: 'turnover', label: 'Turnover & CA UDIN', icon: FileSpreadsheet },
              { id: 'experience', label: 'Work Experience', icon: Award },
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
                  className={`doc-tab-btn ${isSelected ? 'active' : ''}`}
                >
                  <Icon style={{ width: '16px', height: '16px' }} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* 3-Column Interactive Console */}
          <div className="doc-inspector-grid">
            
            {/* Column 1: Document OCR Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '18px', borderRadius: '14px', background: '#060A16', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText style={{ width: '16px', height: '16px', color: '#60A5FA' }} />
                    <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 600, color: '#FFFFFF' }}>
                      {currentDoc.name}
                    </span>
                  </div>
                  <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#93C5FD', background: 'rgba(30,58,138,0.5)', border: '1px solid rgba(59,130,246,0.3)', padding: '2px 6px', borderRadius: '4px' }}>
                    {currentDoc.confidence}
                  </span>
                </div>

                <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#94A3B8', marginBottom: '12px' }}>
                  Issuer: <span style={{ color: '#E2E8F0', fontWeight: 600 }}>{currentDoc.issuer}</span>
                </div>

                {/* Simulated Document OCR Page */}
                <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '11px', fontFamily: 'monospace', color: '#CBD5E1', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {currentDoc.docSnippet}

                  {/* Bounding Box Highlight Overlay */}
                  <div style={{ marginTop: '12px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(30,58,138,0.5)', border: '1px solid rgba(59,130,246,0.5)', color: '#BFDBFE', fontWeight: 600, fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Bounding Box: {currentDoc.boundingHighlight}</span>
                    <span style={{ fontSize: '10px', background: '#2563EB', color: '#FFFFFF', padding: '2px 6px', borderRadius: '4px' }}>PAGE 1</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: '#94A3B8', fontFamily: 'monospace' }}>
                <span>OCR Latency: 0.84s</span>
                <span style={{ color: '#10B981' }}>SHA-256 PASS</span>
              </div>
            </div>

            {/* Column 2: Extracted Structured Entities */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '18px', borderRadius: '14px', background: '#060A16', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase' }}>
                    Extracted Entities
                  </span>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {currentDoc.extracted.map((item, i) => (
                    <div key={i} style={{ padding: '10px', borderRadius: '10px', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '12px' }}>
                      <div style={{ fontSize: '10px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px', fontFamily: 'monospace' }}>
                        {item.label}
                      </div>
                      <div style={{ fontFamily: 'monospace', fontWeight: 600, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '8px' }}>{item.value}</span>
                        {item.status === 'verified' && (
                          <CheckCircle2 style={{ width: '14px', height: '14px', color: '#10B981', flexShrink: 0 }} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '10px', color: '#94A3B8', fontFamily: 'monospace' }}>
                JSON schema mapped to GFR fields
              </div>
            </div>

            {/* Column 3: Statutory Rule Engine & Explainable AI */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '18px', borderRadius: '14px', background: '#060A16', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase' }}>
                    Rule Engine Evaluation
                  </span>
                  <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#C7D2FE', background: 'rgba(49,46,129,0.5)', border: '1px solid rgba(99,102,241,0.3)', padding: '2px 6px', borderRadius: '4px' }}>
                    DETERMINISTIC
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                  {currentDoc.compliance.map((rule, i) => (
                    <div 
                      key={i} 
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor: rule.pass ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.3)',
                        background: rule.pass ? 'rgba(6,78,59,0.2)' : 'rgba(120,53,15,0.25)',
                        fontSize: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#94A3B8' }}>{rule.rule}</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '10px', color: rule.pass ? '#34D399' : '#FBBF24' }}>
                          {rule.pass ? '✓ PASS' : '⚠️ REVIEW REQUIRED'}
                        </span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '11px', color: rule.pass ? '#A7F3D0' : '#FDE68A' }}>
                        {rule.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Explainable AI Toggle for Turnover Anomaly */}
                {selectedDocTab === 'turnover' && (
                  <div style={{ marginTop: '10px' }}>
                    <button
                      onClick={() => setShowWhyAnomaly(!showWhyAnomaly)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#FDE68A',
                        background: 'rgba(120,53,15,0.4)',
                        border: '1px solid rgba(245,158,11,0.3)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <HelpCircle style={{ width: '14px', height: '14px', color: '#F59E0B' }} />
                        Why was this flagged? (Explainable AI)
                      </span>
                      {showWhyAnomaly ? <ChevronUp style={{ width: '14px', height: '14px' }} /> : <ChevronDown style={{ width: '14px', height: '14px' }} />}
                    </button>

                    {showWhyAnomaly && (
                      <div style={{ marginTop: '8px', padding: '12px', borderRadius: '8px', background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(245,158,11,0.3)', fontSize: '11px', color: '#CBD5E1', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <p style={{ color: '#FDE68A', fontWeight: 700 }}>ANOMALY EXPLANATION REPORT:</p>
                        <p>1. FY 2024-25 Turnover: ₹21.10 Cr</p>
                        <p>2. FY 2025-26 Turnover: ₹48.60 Cr</p>
                        <p style={{ color: '#F87171', fontWeight: 600 }}>
                          3. YoY Surge: +130.33% (Exceeds PSU tolerance threshold 50%).
                        </p>
                        <p style={{ color: '#94A3B8' }}>
                          Recommendation: Procurement Officer should request GSTR-9C reconciliation prior to commercial opening.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10px', color: '#94A3B8', fontFamily: 'monospace' }}>Zero AI Hallucinations</span>
                <button
                  onClick={() => setEvidenceModalOpen(true)}
                  style={{ fontSize: '12px', fontWeight: 600, color: '#60A5FA', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  Full Audit Log &rarr;
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── SECTION 5: BENTO GRID OF PLATFORM SUPERPOWERS ─────────────── */}
      <section className="landing-section">
        <div className="section-container">
          
          <div className="section-header-center">
            <span className="section-pill" style={{ background: 'rgba(6,78,59,0.4)', border: '1px solid rgba(16,185,129,0.3)', color: '#6EE7B7' }}>
              <Zap style={{ width: '13px', height: '13px' }} />
              Sovereign Platform Superpowers
            </span>
            <h2 className="section-title">
              Engineered for High-Stakes Public Procurement
            </h2>
            <p className="section-desc">
              Cryptographic precision, institutional security, and strict statutory alignment.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="bento-grid">
            
            {/* Bento 1: Rapid Ingestion (2 cols) */}
            <div className="bento-card bento-col-2">
              <div>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60A5FA', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Zap style={{ width: '20px', height: '20px' }} />
                </div>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: '#60A5FA', textTransform: 'uppercase' }}>Sub-Second Processing</span>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', marginTop: '4px', marginBottom: '8px' }}>
                  1.4-Second Multi-Modal Ingestion
                </h3>
                <p style={{ color: '#CBD5E1', fontSize: '13px', lineHeight: 1.6, marginBottom: '20px' }}>
                  Extracts complex financial tables, balance sheets, and scanned official seals across 500+ page bid filings without manual copy-pasting.
                </p>
              </div>

              {/* Benchmark comparison bar */}
              <div style={{ padding: '16px', borderRadius: '12px', background: '#060A16', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', fontWeight: 600, marginBottom: '6px', fontFamily: 'monospace' }}>
                    <span>Traditional Manual Review</span>
                    <span style={{ color: '#F43F5E', fontWeight: 700 }}>14 Days (336 hrs)</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', background: '#1E293B', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#F43F5E', width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#93C5FD', fontWeight: 600, marginBottom: '6px', fontFamily: 'monospace' }}>
                    <span>BidVerify AI Pipeline</span>
                    <span style={{ color: '#60A5FA', fontWeight: 700 }}>18 Minutes</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', background: '#1E293B', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#2563EB', width: '7%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento 2: SHA-256 Tamper Sealing */}
            <div className="bento-card">
              <div>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#A5B4FC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Lock style={{ width: '20px', height: '20px' }} />
                </div>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: '#A5B4FC', textTransform: 'uppercase' }}>Cryptographic Integrity</span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginTop: '4px', marginBottom: '8px' }}>
                  Immutable SHA-256 Hashes
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '12px', lineHeight: 1.6 }}>
                  Every document receives a cryptographic seal immediately upon upload. Zero possibility of post-bid tampering.
                </p>
              </div>

              <div style={{ marginTop: '20px', padding: '10px', borderRadius: '10px', background: '#060A16', border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'monospace', fontSize: '11px', color: '#C7D2FE', wordBreak: 'break-all' }}>
                SHA-256: 7f8a9e21...b4e2
              </div>
            </div>

            {/* Bento 3: Dual Persona Architecture */}
            <div className="bento-card">
              <div>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Users style={{ width: '20px', height: '20px' }} />
                </div>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: '#34D399', textTransform: 'uppercase' }}>Conflict Separation</span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginTop: '4px', marginBottom: '8px' }}>
                  Dual Persona Access
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '12px', lineHeight: 1.6 }}>
                  Strict cryptographic isolation between CPCL Procurement Officers and external enterprise Bidders.
                </p>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: '#6EE7B7', background: 'rgba(6,78,59,0.3)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)' }}>
                <span>Officer Console</span>
                <span style={{ color: '#64748B' }}>|</span>
                <span>Bidder Portal</span>
              </div>
            </div>

            {/* Bento 4: Statutory Alignment (2 cols) */}
            <div className="bento-card bento-col-2">
              <div>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.3)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Scale style={{ width: '20px', height: '20px' }} />
                </div>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: '#38BDF8', textTransform: 'uppercase' }}>Statutory Governance</span>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', marginTop: '4px', marginBottom: '8px' }}>
                  Strict GFR 2017 &amp; CVC Compliance
                </h3>
                <p style={{ color: '#CBD5E1', fontSize: '13px', lineHeight: 1.6, marginBottom: '20px' }}>
                  Pre-configured compliance modules for General Financial Rules 2017, Public Procurement (Preference to Make in India) Order, and CPCL Works Manual.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div style={{ padding: '12px', borderRadius: '10px', background: '#060A16', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', display: 'block' }}>GFR 2017</span>
                  <span style={{ fontSize: '10px', color: '#94A3B8' }}>Rule 144 Compliant</span>
                </div>
                <div style={{ padding: '12px', borderRadius: '10px', background: '#060A16', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', display: 'block' }}>CVC Guidelines</span>
                  <span style={{ fontSize: '10px', color: '#94A3B8' }}>Transparent Records</span>
                </div>
                <div style={{ padding: '12px', borderRadius: '10px', background: '#060A16', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', display: 'block' }}>MSME Order</span>
                  <span style={{ fontSize: '10px', color: '#94A3B8' }}>Automated Relief</span>
                </div>
              </div>
            </div>

            {/* Bento 5: Realtime Telemetry Log (2 cols) */}
            <div className="bento-card bento-col-2" style={{ background: '#060A16' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity style={{ width: '16px', height: '16px', color: '#60A5FA' }} />
                  <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 700, color: '#FFFFFF' }}>REALTIME SOVEREIGN TELEMETRY</span>
                </div>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'monospace', fontSize: '11px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '8px', background: '#0D1426', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: '#93C5FD' }}>● [11:28:04] GST REG-06 verified for Shakti Engineering</span>
                  <span style={{ color: '#34D399', fontWeight: 700, background: 'rgba(6,78,59,0.6)', padding: '2px 6px', borderRadius: '4px' }}>200 OK</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '8px', background: '#0D1426', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: '#C7D2FE' }}>● [11:28:05] ICAI UDIN checksum validated: 24089123AAAA</span>
                  <span style={{ color: '#34D399', fontWeight: 700, background: 'rgba(6,78,59,0.6)', padding: '2px 6px', borderRadius: '4px' }}>AUTHENTIC</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '8px', background: '#0D1426', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: '#FDE68A' }}>● [11:28:06] Turnover surge alert surfaced to CPCL Officer</span>
                  <span style={{ color: '#F59E0B', fontWeight: 700, background: 'rgba(120,53,15,0.6)', padding: '2px 6px', borderRadius: '4px' }}>FLAGGED</span>
                </div>
              </div>

              <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '10px', color: '#94A3B8', fontFamily: 'monospace', display: 'flex', justifyContent: 'space-between' }}>
                <span>System Health: 100% Operational</span>
                <span style={{ color: '#60A5FA' }}>Air-Gapped CPCL Cluster</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── SECTION 6: TWO DEDICATED PORTAL ENTRY POINTS ──────────────── */}
      <section className="landing-section-alt">
        <div className="section-container">
          
          <div className="section-header-center">
            <span className="section-pill" style={{ background: 'rgba(30,58,138,0.4)', border: '1px solid rgba(59,130,246,0.3)', color: '#93C5FD' }}>
              <Users style={{ width: '13px', height: '13px' }} />
              Dual-Persona Access Gateway
            </span>
            <h2 className="section-title">
              Select Your Authorized Workspace
            </h2>
            <p className="section-desc">
              Access the dedicated portal designed for your operational role.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', maxWidth: '1040px', margin: '0 auto' }}>
            
            {/* Officer Card */}
            <div style={{ padding: '32px', borderRadius: '20px', background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '9999px', background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(59,130,246,0.4)', color: '#93C5FD', fontSize: '11px', fontWeight: 700, marginBottom: '20px', fontFamily: 'monospace' }}>
                  <ShieldCheck style={{ width: '14px', height: '14px', color: '#60A5FA' }} />
                  CPCL PROCUREMENT OFFICERS
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
                  Officer Scrutiny Console
                </h3>
                <p style={{ color: '#CBD5E1', fontSize: '13px', lineHeight: 1.6, marginBottom: '24px' }}>
                  For authorized CPCL Tender Committees, Chief Vigilance Officers, and Procurement Engineers to review bids, inspect citations, and record decisions.
                </p>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#CBD5E1', marginBottom: '32px' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Check style={{ width: '15px', height: '15px', color: '#60A5FA', flexShrink: 0 }} />
                    <span>Side-by-side original PDF citation inspector</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Check style={{ width: '15px', height: '15px', color: '#60A5FA', flexShrink: 0 }} />
                    <span>Automated GFR 2017 &amp; CPCL rule engine scorecard</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Check style={{ width: '15px', height: '15px', color: '#60A5FA', flexShrink: 0 }} />
                    <span>Exportable CVC &amp; CAG defensible audit trails</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Check style={{ width: '15px', height: '15px', color: '#60A5FA', flexShrink: 0 }} />
                    <span>One-click technical qualification or rejection</span>
                  </li>
                </ul>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={() => handleAuthNavigate('officer-login')}
                  style={{ width: '100%', padding: '14px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, color: '#FFFFFF', background: '#2563EB', border: '1px solid #3B82F6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}
                >
                  <Lock style={{ width: '16px', height: '16px' }} />
                  Enter Officer Console
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => handleAuthNavigate('officer-register')}
                    style={{ fontSize: '11px', color: '#94A3B8', background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >
                    Need official credentials? Request Officer Registration &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Bidder Card */}
            <div style={{ padding: '32px', borderRadius: '20px', background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '9999px', background: 'rgba(6,78,59,0.2)', border: '1px solid rgba(16,185,129,0.4)', color: '#6EE7B7', fontSize: '11px', fontWeight: 700, marginBottom: '20px', fontFamily: 'monospace' }}>
                  <Briefcase style={{ width: '14px', height: '14px', color: '#10B981' }} />
                  REGISTERED ENTERPRISE BIDDERS
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
                  Vendor Submission Portal
                </h3>
                <p style={{ color: '#CBD5E1', fontSize: '13px', lineHeight: 1.6, marginBottom: '24px' }}>
                  For industrial manufacturers, engineering contractors, and MSME vendors submitting bids for CPCL refinery tenders.
                </p>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#CBD5E1', marginBottom: '32px' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Check style={{ width: '15px', height: '15px', color: '#10B981', flexShrink: 0 }} />
                    <span>Instant pre-submission compliance self-check</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Check style={{ width: '15px', height: '15px', color: '#10B981', flexShrink: 0 }} />
                    <span>Immediate SHA-256 cryptographic upload receipt</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Check style={{ width: '15px', height: '15px', color: '#10B981', flexShrink: 0 }} />
                    <span>Automated MSME turnover exemption claims</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Check style={{ width: '15px', height: '15px', color: '#10B981', flexShrink: 0 }} />
                    <span>Transparent real-time evaluation status tracking</span>
                  </li>
                </ul>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={() => handleAuthNavigate('bidder-login')}
                  style={{ width: '100%', padding: '14px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, color: '#FFFFFF', background: '#059669', border: '1px solid #10B981', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(16,185,129,0.4)' }}
                >
                  <Briefcase style={{ width: '16px', height: '16px' }} />
                  Enter Bidder Portal
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => handleAuthNavigate('bidder-register')}
                    style={{ fontSize: '11px', color: '#94A3B8', background: 'transparent', border: 'none', cursor: 'pointer' }}
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
      <section id="tenders" className="landing-section">
        <div className="section-container">
          
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
            <div>
              <span className="section-pill" style={{ background: 'rgba(30,58,138,0.4)', border: '1px solid rgba(59,130,246,0.3)', color: '#93C5FD' }}>
                <Search style={{ width: '13px', height: '13px' }} />
                Public Procurement Repository
              </span>
              <h2 className="section-title">
                Active CPCL Tenders
              </h2>
              <p className="section-desc">
                Explore currently open tenders across Chennai Petroleum Corporation Limited divisions.
              </p>
            </div>

            <div>
              <div style={{ padding: '8px 16px', borderRadius: '12px', background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', fontWeight: 600, color: '#E2E8F0' }}>
                <span style={{ color: '#60A5FA', fontWeight: 800, fontSize: '14px', fontFamily: 'monospace', marginRight: '6px' }}>{filteredTenders.length}</span>
                Active Tenders
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="tenders-search-bar">
            <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
              <Search style={{ width: '15px', height: '15px', color: '#64748B', position: 'absolute', left: '12px', top: '10px' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tender title, ref #, division..."
                style={{ width: '100%', padding: '8px 12px 8px 36px', fontSize: '12px', background: '#060A16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['ALL', 'Mechanical Equipment', 'Services & Maintenance', 'Safety & Environmental', 'IT & Automation'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: selectedCategory === cat ? '#3B82F6' : 'rgba(255,255,255,0.08)',
                    background: selectedCategory === cat ? '#2563EB' : '#060A16',
                    color: selectedCategory === cat ? '#FFFFFF' : '#94A3B8',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tenders Grid with explicit 20px gap */}
          <div className="tenders-cards-grid">
            {filteredTenders.map(t => (
              <div key={t.id} className="tender-card">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: '#93C5FD', background: 'rgba(30,58,138,0.5)', border: '1px solid rgba(59,130,246,0.3)', padding: '2px 8px', borderRadius: '4px' }}>
                      {t.reference_number}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: '#6EE7B7', background: 'rgba(6,78,59,0.5)', border: '1px solid rgba(16,185,129,0.3)', padding: '2px 8px', borderRadius: '9999px', fontFamily: 'monospace' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }}></span>
                      {t.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px', lineHeight: 1.4 }}>
                    {t.title}
                  </h3>

                  <p style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building2 style={{ width: '14px', height: '14px', color: '#60A5FA' }} />
                    {t.department}
                  </p>

                  <div style={{ padding: '14px', borderRadius: '12px', background: '#060A16', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#94A3B8' }}>Estimated Budget:</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#FFFFFF' }}>
                        ₹{(t.estimated_value / 10000000).toFixed(2)} Cr
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#94A3B8' }}>Submission Due:</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#F87171', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar style={{ width: '13px', height: '13px' }} />
                        {t.submission_deadline}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <button
                    onClick={() => setSelectedTenderModal(t)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#93C5FD', background: 'rgba(30,58,138,0.4)', border: '1px solid rgba(59,130,246,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Info style={{ width: '14px', height: '14px' }} />
                    View Requirements &amp; Criteria
                  </button>

                  <button
                    onClick={() => handleAuthNavigate('bidder-login')}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#FFFFFF', background: '#2563EB', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    Direct Apply as Bidder &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── SECTION 8: 5 PILLARS OF TRUST ─────────────────────────────── */}
      <section className="landing-section-alt">
        <div className="section-container">
          
          <div className="section-header-center">
            <span className="section-pill" style={{ background: 'rgba(6,78,59,0.4)', border: '1px solid rgba(16,185,129,0.3)', color: '#6EE7B7' }}>
              <ShieldCheck style={{ width: '13px', height: '13px' }} />
              Institutional Trust Guarantee
            </span>
            <h2 className="section-title">
              5 Pillars of Sovereign Procurement Security
            </h2>
            <p className="section-desc">
              How CPCL ensures confidentiality, data sovereignty, and unyielding defense against audit queries.
            </p>
          </div>

          <div className="pillars-grid">
            
            <div className="pillar-card">
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60A5FA', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Database style={{ width: '18px', height: '18px' }} />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>On-Premise Deployment</h3>
              <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.6 }}>
                Deployed strictly on CPCL private infrastructure or sovereign MeitY-empaneled Indian government cloud.
              </p>
            </div>

            <div className="pillar-card">
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#A5B4FC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Lock style={{ width: '18px', height: '18px' }} />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>Zero Data Leakage</h3>
              <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.6 }}>
                Bidder proprietary filings are never sent to external commercial APIs or used for third-party model training.
              </p>
            </div>

            <div className="pillar-card">
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.3)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Search style={{ width: '18px', height: '18px' }} />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>Explainable AI</h3>
              <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.6 }}>
                No black-box predictions. Every flag provides exact page coordinates and mathematical calculations.
              </p>
            </div>

            <div className="pillar-card">
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Scale style={{ width: '18px', height: '18px' }} />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>CVC &amp; CAG Defensible</h3>
              <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.6 }}>
                One-click complete procurement dossiers ready for Chief Vigilance Officer and external audit review.
              </p>
            </div>

            <div className="pillar-card">
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#FBBF24', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <UserCheck style={{ width: '18px', height: '18px' }} />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>Officer Final Say</h3>
              <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.6 }}>
                AI advises; authorized CPCL procurement officers decide. Zero automated disqualifications.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ─── SECTION 9: FREQUENTLY ASKED QUESTIONS ─────────────────────── */}
      <section id="faq" className="landing-section">
        <div className="section-container" style={{ maxWidth: '840px' }}>
          
          <div className="section-header-center">
            <span className="section-pill" style={{ background: 'rgba(30,58,138,0.4)', border: '1px solid rgba(59,130,246,0.3)', color: '#93C5FD' }}>
              <HelpCircle style={{ width: '13px', height: '13px' }} />
              Clarity &amp; Compliance
            </span>
            <h2 className="section-title">
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="faq-box">
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="faq-btn"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp style={{ width: '18px', height: '18px', color: '#60A5FA', flexShrink: 0 }} />
                    ) : (
                      <ChevronDown style={{ width: '18px', height: '18px', color: '#94A3B8', flexShrink: 0 }} />
                    )}
                  </button>

                  {isOpen && (
                    <div className="faq-body">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── SECTION 10: OFFICIAL EXECUTIVE FOOTER ─────────────────────── */}
      <footer style={{ background: '#040714', color: '#94A3B8', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', padding: '60px 32px 40px 32px' }}>
        <div className="section-container">
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '48px' }}>
            
            {/* Col 1 & 2: Platform Info */}
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #1D4ED8, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                  <ShieldCheck style={{ width: '20px', height: '20px' }} />
                </div>
                <div>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>BidVerify AI</span>
                  <p style={{ fontSize: '11px', color: '#94A3B8' }}>CPCL Sovereign Procurement Platform</p>
                </div>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '12px', lineHeight: 1.6, maxWidth: '400px', marginBottom: '16px' }}>
                Assisting Chennai Petroleum Corporation Limited (CPCL) under the Ministry of Petroleum &amp; Natural Gas, 
                Government of India, in achieving rapid, transparent, and legally defensible public procurement.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#34D399', fontFamily: 'monospace' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></span>
                <span>System Status: 100.0% Uptime (All Sovereign Services Active)</span>
              </div>
            </div>

            {/* Col 3: Portal Links */}
            <div>
              <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px', fontFamily: 'monospace' }}>Portals</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><button onClick={() => handleAuthNavigate('officer-login')} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '12px' }}>Officer Scrutiny Console</button></li>
                <li><button onClick={() => handleAuthNavigate('officer-register')} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '12px' }}>Officer Registration</button></li>
                <li><button onClick={() => handleAuthNavigate('bidder-login')} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '12px' }}>Bidder Submission Portal</button></li>
                <li><button onClick={() => handleAuthNavigate('bidder-register')} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '12px' }}>Vendor Onboarding</button></li>
                <li><button onClick={() => scrollToSection('tenders')} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '12px' }}>Public Tender Repository</button></li>
              </ul>
            </div>

            {/* Col 4: Statutory & Compliance */}
            <div>
              <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px', fontFamily: 'monospace' }}>Governance</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', color: '#94A3B8' }}>
                <li><span>General Financial Rules (GFR) 2017</span></li>
                <li><span>Central Vigilance Commission (CVC)</span></li>
                <li><span>Make in India Policy Order</span></li>
                <li><span>ICAI CA UDIN Verification</span></li>
                <li><span>MSME Udyam Exemption Framework</span></li>
              </ul>
            </div>

            {/* Col 5: Security Desk */}
            <div>
              <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px', fontFamily: 'monospace' }}>Integrity Desk</h4>
              <p style={{ color: '#94A3B8', fontSize: '12px', marginBottom: '8px', lineHeight: 1.5 }}>
                Chief Vigilance Directorate<br />
                CPCL Manali Refinery, Chennai - 600068
              </p>
              <p style={{ color: '#94A3B8', fontSize: '12px', fontFamily: 'monospace', marginBottom: '12px' }}>
                Helpline: +91 44 2594 4000<br />
                Email: vigilance@cpcl.gov.in
              </p>
              <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#60A5FA', background: 'rgba(30,58,138,0.5)', border: '1px solid rgba(59,130,246,0.3)', padding: '4px 10px', borderRadius: '9999px' }}>
                SHA-256 Audit Trail Sealed
              </span>
            </div>

          </div>

          <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', fontSize: '11px', color: '#64748B' }}>
            <p>© 2026 Chennai Petroleum Corporation Limited. All rights reserved. Government of India.</p>
            <p style={{ fontFamily: 'monospace', color: '#94A3B8' }}>CPCL-SOVEREIGN-ENGINE · v2.4.0</p>
          </div>

        </div>
      </footer>

      {/* ─── MODAL 1: TENDER DETAILS MODAL ─────────────────────────────── */}
      {selectedTenderModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(4,7,20,0.85)', backdropFilter: 'blur(12px)' }}>
          <div style={{ background: '#0D1426', borderRadius: '20px', maxWidth: '640px', width: '100%', padding: '28px', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <button
              onClick={() => setSelectedTenderModal(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', padding: '8px', borderRadius: '10px', color: '#94A3B8', background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: '#93C5FD', background: 'rgba(30,58,138,0.5)', border: '1px solid rgba(59,130,246,0.3)', padding: '2px 8px', borderRadius: '4px' }}>
                {selectedTenderModal.reference_number}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#6EE7B7', background: 'rgba(6,78,59,0.5)', border: '1px solid rgba(16,185,129,0.3)', padding: '2px 8px', borderRadius: '9999px', fontFamily: 'monospace' }}>
                {selectedTenderModal.status}
              </span>
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
              {selectedTenderModal.title}
            </h3>

            <p style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 style={{ width: '14px', height: '14px', color: '#60A5FA' }} />
              {selectedTenderModal.department}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '16px', borderRadius: '12px', background: '#060A16', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '20px', fontSize: '12px' }}>
              <div>
                <span style={{ color: '#94A3B8', display: 'block', marginBottom: '2px' }}>Estimated Budget:</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', fontFamily: 'monospace' }}>
                  ₹{(selectedTenderModal.estimated_value / 10000000).toFixed(2)} Cr
                </span>
              </div>
              <div>
                <span style={{ color: '#94A3B8', display: 'block', marginBottom: '2px' }}>Submission Deadline:</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#F87171', fontFamily: 'monospace' }}>
                  {selectedTenderModal.submission_deadline}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px', fontFamily: 'monospace' }}>
                Scope &amp; Description
              </h4>
              <p style={{ fontSize: '12px', color: '#CBD5E1', lineHeight: 1.6, background: '#060A16', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                {selectedTenderModal.description}
              </p>
            </div>

            {selectedTenderModal.eligibility && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px', fontFamily: 'monospace' }}>
                  Mandatory Eligibility &amp; Compliance Criteria
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedTenderModal.eligibility.map((crit, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#E2E8F0', background: '#060A16', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <CheckCircle2 style={{ width: '15px', height: '15px', color: '#60A5FA', flexShrink: 0 }} />
                      <span>{crit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={() => {
                  setSelectedTenderModal(null);
                  handleAuthNavigate('bidder-login');
                }}
                style={{ flex: 1, padding: '12px 18px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, color: '#FFFFFF', background: '#2563EB', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Briefcase style={{ width: '15px', height: '15px' }} />
                Login to Submit Bid Proposal
              </button>

              <button
                onClick={() => setSelectedTenderModal(null)}
                style={{ padding: '12px 18px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#94A3B8', background: '#1E293B', border: 'none', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─── MODAL 2: EVIDENCE CITATION INSPECTOR MODAL ────────────────── */}
      {evidenceModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(4,7,20,0.85)', backdropFilter: 'blur(12px)' }}>
          <div style={{ background: '#0D1426', borderRadius: '20px', maxWidth: '640px', width: '100%', padding: '28px', border: '1px solid rgba(59,130,246,0.3)', color: '#FFFFFF', position: 'relative', maxHeight: '90vh', overflowY: 'auto', fontFamily: 'monospace' }}>
            
            <button
              onClick={() => setEvidenceModalOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', padding: '8px', borderRadius: '10px', color: '#94A3B8', background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#93C5FD', background: 'rgba(30,58,138,0.5)', border: '1px solid rgba(59,130,246,0.3)', padding: '2px 8px', borderRadius: '4px' }}>
                EVIDENCE CITATION INSPECTOR
              </span>
              <span style={{ fontSize: '11px', color: '#64748B' }}>REF: CPCL/PROC/2026/128</span>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', fontFamily: 'sans-serif', marginBottom: '4px' }}>
              Shakti Engineering &amp; Infrastructure Ltd
            </h3>
            <p style={{ fontSize: '12px', color: '#94A3B8', fontFamily: 'sans-serif', marginBottom: '20px' }}>
              Full cryptographic evidence payload generated by Sovereign OCR and Rule Engine.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              
              {/* Check 1 */}
              <div style={{ padding: '14px', borderRadius: '12px', background: '#060A16', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#60A5FA', fontWeight: 700, marginBottom: '6px' }}>
                  <span>1. GST REG-06 CERTIFICATE</span>
                  <span style={{ color: '#34D399', background: 'rgba(6,78,59,0.5)', padding: '2px 6px', borderRadius: '4px' }}>✓ VERIFIED</span>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '11px', lineHeight: 1.5 }}>
                  Extracted GSTIN: 33AAACS1429B1Z8 (State: Tamil Nadu)<br />
                  Checksum: Valid Modulo 36 check passed.<br />
                  Source Citation: Page 1, Coordinates [x: 142, y: 310, w: 220, h: 42]
                </p>
              </div>

              {/* Check 2 */}
              <div style={{ padding: '14px', borderRadius: '12px', background: '#060A16', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A5B4FC', fontWeight: 700, marginBottom: '6px' }}>
                  <span>2. CA UDIN TURNOVER STATEMENT</span>
                  <span style={{ color: '#34D399', background: 'rgba(6,78,59,0.5)', padding: '2px 6px', borderRadius: '4px' }}>✓ ICAI AUTHENTICATED</span>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '11px', lineHeight: 1.5 }}>
                  CA UDIN: 24089123AAAAAA1029<br />
                  Turnover FY 2025-26: ₹48.60 Cr (3-Yr Avg: ₹29.36 Cr &gt; Threshold ₹25 Cr)<br />
                  ICAI Status: Valid Active UDIN issued by Chartered Accountant M. Karthik
                </p>
              </div>

              {/* Check 3 */}
              <div style={{ padding: '14px', borderRadius: '12px', background: '#060A16', border: '1px solid rgba(245,158,11,0.3)', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#FBBF24', fontWeight: 700, marginBottom: '6px' }}>
                  <span>3. REVENUE SURGE ANOMALY</span>
                  <span style={{ color: '#F59E0B', background: 'rgba(120,53,15,0.5)', padding: '2px 6px', borderRadius: '4px' }}>⚠️ FLAGGED FOR OFFICER</span>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '11px', lineHeight: 1.5 }}>
                  Variance: +130.3% surge from FY25 baseline (₹21.10 Cr to ₹48.60 Cr).<br />
                  Rule: RULE-FIN-004 (Tolerance threshold 50%).<br />
                  Recommendation: Procurement Officer discretion required before opening price bid.
                </p>
              </div>

              {/* Audit Block */}
              <div style={{ padding: '14px', borderRadius: '12px', background: '#060A16', border: '1px solid rgba(255,255,255,0.08)', fontSize: '11px', color: '#94A3B8' }}>
                <div style={{ color: '#34D399', fontWeight: 700, marginBottom: '4px' }}>IMMUTABLE RECORD DIGEST</div>
                <div>Payload SHA-256: 7f8a9e210b3d819c9e821fa7b2a95c478a2e19b0d1e8432a</div>
                <div>Timestamp: 2026-09-14T11:28:06.429Z</div>
                <div>Signing Key: CPCL_SOVEREIGN_NODE_01 (Air-Gapped)</div>
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={() => {
                  setEvidenceModalOpen(false);
                  handleAuthNavigate('officer-login');
                }}
                style={{ padding: '11px 20px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, color: '#FFFFFF', background: '#2563EB', border: 'none', cursor: 'pointer' }}
              >
                Login as Officer to Take Action &rarr;
              </button>

              <button
                onClick={() => setEvidenceModalOpen(false)}
                style={{ padding: '11px 18px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#94A3B8', background: '#1E293B', border: 'none', cursor: 'pointer' }}
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
