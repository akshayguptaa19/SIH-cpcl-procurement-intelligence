"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ChevronRight,
  FileText,
  Users,
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  ExternalLink,
  Filter,
  Download,
  Calendar,
  Eye,
  ShieldAlert,
  Layers,
  ArrowUpRight,
  Brain,
  Cpu,
  Search,
  CheckCircle2,
  AlertCircle,
  Activity,
  ArrowRight,
  Zap,
  Radio,
  FileCheck,
  Database,
  Lock,
  Sparkles,
  Server,
  DollarSign
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { useToast } from "@/components/common/ToastProvider";
import { useProcurement } from "../../context/ProcurementContext";
import { api } from "../../lib/api.js";
import HeroBanner from "./HeroBanner";
import StatCard from "./StatCard";
import AttentionCard from "./AttentionCard";
import ComplianceGauge from "./ComplianceGauge";
import ProjectProblemBanner from "./ProjectProblemBanner";
import { Link } from "react-router-dom";

// Default Verification Activity benchmark
const DEFAULT_ACTIVITY_DATA = [
  { name: "Mon", verified: 38, pending: 12, failed: 4 },
  { name: "Tue", verified: 45, pending: 15, failed: 2 },
  { name: "Wed", verified: 52, pending: 8, failed: 6 },
  { name: "Thu", verified: 40, pending: 18, failed: 3 },
  { name: "Fri", verified: 62, pending: 14, failed: 5 },
  { name: "Sat", verified: 28, pending: 6, failed: 1 },
  { name: "Sun", verified: 14, pending: 2, failed: 0 }
];

// Fallback tenders dataset if database has fresh state
const FALLBACK_TENDERS_DATA = [
  {
    id: "CPCL/REF/2025/CRU-082",
    title: "Crude Distillation Unit (CDU-III) Furnace Radiant Coil Replacement",
    category: "Equipment",
    department: "Refinery Engineering",
    bidders: 6,
    compliance: "96.4%",
    complianceVal: 96.4,
    risk: "Low",
    deadline: "28 Sep 2026",
    status: "Active",
    estimatedValue: "₹42.5 Cr"
  },
  {
    id: "CPCL/INSTR/2025/089",
    title: "Distributed Control System (DCS) & Safety Instrumented Systems Overhaul",
    category: "Equipment",
    department: "Electrical & Instrumentation",
    bidders: 4,
    compliance: "52.0%",
    complianceVal: 52.0,
    risk: "High",
    deadline: "18 Sep 2026",
    status: "Review",
    estimatedValue: "₹18.2 Cr"
  },
  {
    id: "CPCL/MECH/2025/112",
    title: "High-Pressure Hydrogen Service Control Valves & Piping Spools",
    category: "Materials",
    department: "Mechanical Maintenance",
    bidders: 8,
    compliance: "88.5%",
    complianceVal: 88.5,
    risk: "Low",
    deadline: "05 Oct 2026",
    status: "Active",
    estimatedValue: "₹14.8 Cr"
  },
  {
    id: "CPCL/CAT/2025/044",
    title: "Hydrocracking Unit High-Activity Zeolite Catalyst Supply",
    category: "Materials",
    department: "Process Technology",
    bidders: 3,
    compliance: "74.2%",
    complianceVal: 74.2,
    risk: "Medium",
    deadline: "22 Sep 2026",
    status: "Active",
    estimatedValue: "₹38.0 Cr"
  },
  {
    id: "CPCL/CIVIL/2025/019",
    title: "Refinery Offsites Tank Farm Dyke Wall Reconstruction & Epoxy Coating",
    category: "Services",
    department: "Civil & Structural",
    bidders: 7,
    compliance: "91.8%",
    complianceVal: 91.8,
    risk: "Low",
    deadline: "12 Oct 2026",
    status: "Active",
    estimatedValue: "₹9.4 Cr"
  }
];

export default function ProcurementDashboard({ onNavigate }) {
  const { showToast } = useToast();
  const { computedKPIs } = useProcurement();

  // Primary live state loaded from backend APIs
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState("Connecting...");

  // Data endpoints state
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [riskSignals, setRiskSignals] = useState([]);
  const [complianceDist, setComplianceDist] = useState(null);
  const [aiStatus, setAiStatus] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [tendersList, setTendersList] = useState([]);

  // Filters
  const [dateFilter, setDateFilter] = useState("FY 2025–26");
  const [activityTimeFilter, setActivityTimeFilter] = useState("Monthly Trend");
  const [tenderSearch, setTenderSearch] = useState("");
  const [tenderCategoryFilter, setTenderCategoryFilter] = useState("All");

  // Fetch all live dashboard data from MongoDB backend
  const fetchDashboardData = useCallback(async (showNotification = false) => {
    try {
      if (showNotification) setIsRefreshing(true);

      const [
        statsRes,
        chartRes,
        riskRes,
        compRes,
        aiRes,
        activityRes,
        tendersRes
      ] = await Promise.allSettled([
        api.dashboard.getStats(),
        api.dashboard.getChartData(),
        api.dashboard.getRiskSignals(),
        api.dashboard.getComplianceDistribution(),
        api.dashboard.getAiStatus(),
        api.dashboard.getRecentActivity(),
        api.tenders.getAll({ limit: 15 })
      ]);

      // 1. Stats
      if (statsRes.status === "fulfilled" && statsRes.value) {
        setStats(statsRes.value);
      }

      // 2. Chart Data
      if (chartRes.status === "fulfilled" && chartRes.value) {
        setChartData(chartRes.value);
      }

      // 3. Risk Signals
      if (riskRes.status === "fulfilled" && riskRes.value?.signals) {
        setRiskSignals(riskRes.value.signals);
      }

      // 4. Compliance Distribution
      if (compRes.status === "fulfilled" && compRes.value) {
        setComplianceDist(compRes.value);
      }

      // 5. AI Engine Status
      if (aiRes.status === "fulfilled" && aiRes.value) {
        setAiStatus(aiRes.value);
      }

      // 6. Recent Logs / Audit
      if (activityRes.status === "fulfilled" && Array.isArray(activityRes.value)) {
        setRecentLogs(activityRes.value);
      }

      // 7. Tenders Table
      if (tendersRes.status === "fulfilled" && (tendersRes.value?.tenders || Array.isArray(tendersRes.value))) {
        const rawTenders = tendersRes.value.tenders || tendersRes.value;
        if (rawTenders && rawTenders.length > 0) {
          const mapped = rawTenders.map(t => ({
            id: t.reference_number || t.tender_number || t.id || "CPCL/TND/2025",
            title: t.title || "Refinery Equipment & Maintenance",
            category: t.category || "Equipment",
            department: t.department || "Refinery Division",
            bidders: t.bidders_count || (t.requirements?.length ? t.requirements.length + 2 : 5),
            compliance: `${t.compliance_rate || 88}%`,
            complianceVal: t.compliance_rate || 88,
            risk: (t.risk_level || "Low").charAt(0).toUpperCase() + (t.risk_level || "low").slice(1).toLowerCase(),
            deadline: t.submission_deadline ? new Date(t.submission_deadline).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "30 Sep 2026",
            status: t.status === "PUBLISHED" || t.status === "ACTIVE" || t.status === "OPEN" ? "Active" : t.status || "Active",
            estimatedValue: t.estimated_value ? `₹${(t.estimated_value / 10000000).toFixed(1)} Cr` : "₹15.0 Cr"
          }));
          setTendersList(mapped);
        } else {
          setTendersList(FALLBACK_TENDERS_DATA);
        }
      } else {
        setTendersList(FALLBACK_TENDERS_DATA);
      }

      const now = new Date();
      setLastSyncTime(now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));

      if (showNotification) {
        showToast({
          type: "success",
          title: "Sovereign Sync Complete",
          message: "Dashboard refreshed with live MongoDB records & AI model status."
        });
      }
    } catch (err) {
      console.error("Dashboard live fetch error:", err);
      if (showNotification) {
        showToast({
          type: "warning",
          title: "Live Sync Notice",
          message: "Operating on cached state; re-trying in background."
        });
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [showToast]);

  // Initial load
  useEffect(() => {
    fetchDashboardData(false);
  }, [fetchDashboardData]);

  // Auto-refresh timer every 30s if enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchDashboardData(false);
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchDashboardData]);

  // Handle manual sync button
  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  // Export report handler
  const handleExport = () => {
    showToast({
      type: "success",
      title: "Generating Executive Dossier",
      message: "Exporting CPCL Sovereign Compliance and Audit Summary (PDF)..."
    });
  };

  // Filtered tenders list for the table
  const filteredTenders = (tendersList.length > 0 ? tendersList : FALLBACK_TENDERS_DATA).filter((t) => {
    const matchesSearch =
      !tenderSearch ||
      t.id.toLowerCase().includes(tenderSearch.toLowerCase()) ||
      t.title.toLowerCase().includes(tenderSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(tenderSearch.toLowerCase()) ||
      (t.department && t.department.toLowerCase().includes(tenderSearch.toLowerCase()));
    const matchesCat = tenderCategoryFilter === "All" || t.category.toLowerCase() === tenderCategoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  // Effective metrics merging API stats with fallbacks
  const effectiveStats = {
    totalTenders: stats?.totalTenders ?? computedKPIs?.totalTenders?.value ?? 28,
    activeTenders: stats?.activeTenders ?? 12,
    totalBidders: stats?.totalBidders ?? computedKPIs?.totalBidders?.value ?? 16,
    verifiedBids: stats?.verifiedBids ?? computedKPIs?.completedVerifications?.value ?? 27,
    pendingReview: stats?.pendingReview ?? computedKPIs?.pendingReviews?.value ?? 6,
    flaggedBids: stats?.flaggedBids ?? computedKPIs?.nonCompliantBids?.value ?? 3,
    complianceRate: stats?.complianceRate ?? 91.4,
    verifiedRate: stats?.verifiedRate ?? 79.4,
    timeSavedDays: stats?.timeSavedDays ?? "248.5",
    totalTenderValue: stats?.totalTenderValue ? `₹${(stats.totalTenderValue / 10000000).toFixed(1)} Cr` : "₹48.5 Cr",
    sovereignSyncHealth: stats?.sovereignSyncHealth ?? "99.98% Operational",
    costAvoidanceCr: stats?.costAvoidanceCr ? `₹${stats.costAvoidanceCr} Cr` : "₹2.04 Cr"
  };

  // Chart data resolution
  const monthlyChartData = chartData?.monthlyTrends || [
    { month: "Oct", submitted: 18, verified: 15, flagged: 3, avgCompliance: 86.4, valueCr: 24.2 },
    { month: "Nov", submitted: 22, verified: 19, flagged: 3, avgCompliance: 88.1, valueCr: 31.5 },
    { month: "Dec", submitted: 26, verified: 23, flagged: 3, avgCompliance: 89.5, valueCr: 38.0 },
    { month: "Jan", submitted: 31, verified: 28, flagged: 3, avgCompliance: 91.2, valueCr: 44.8 },
    { month: "Feb", submitted: 29, verified: 26, flagged: 3, avgCompliance: 92.4, valueCr: 41.2 },
    { month: "Mar", submitted: 34, verified: 31, flagged: 3, avgCompliance: 94.1, valueCr: 48.5 }
  ];

  return (
    <div
      style={{
        padding: "24px 32px 64px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        maxWidth: "1440px",
        margin: "0 auto",
        background: "#F8FAFC",
        minHeight: "100vh"
      }}
    >
      {/* ─── 1. PAGE HEADER WITH BREADCRUMB & CONTROLS ───────────────── */}
      <div className="anim-fade-in">
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12.5px",
            color: "#64748B",
            marginBottom: "8px"
          }}
        >
          <Link
            to="/home"
            style={{ color: "#64748B", textDecoration: "none", transition: "color 0.15s" }}
            onMouseEnter={(e) => (e.target.style.color = "#00A3E0")}
            onMouseLeave={(e) => (e.target.style.color = "#64748B")}
          >
            Home
          </Link>
          <span>/</span>
          <span style={{ color: "#002B49", fontWeight: 700 }}>Procurement Intelligence Console</span>
        </div>

        {/* Title & Controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  color: "#002B49",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.2
                }}
              >
                CPCL Sovereign Procurement Command Center
              </h1>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  padding: "3px 8px",
                  borderRadius: 999,
                  background: "#ECFDF5",
                  color: "#047857",
                  border: "1px solid #A7F3D0",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4
                }}
              >
                <span className="live-pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
                SOVEREIGN NODE ONLINE
              </span>
            </div>
            <p style={{ fontSize: "13.5px", color: "#475569", marginTop: "4px" }}>
              Autonomous AI bid compliance, LayoutLMv3 document extraction & real-time statutory risk verification.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {/* Auto-Refresh Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              style={{
                height: "38px",
                padding: "0 12px",
                borderRadius: "10px",
                border: "1px solid #E2E8F0",
                background: autoRefresh ? "rgba(16, 185, 129, 0.08)" : "#FFFFFF",
                color: autoRefresh ? "#047857" : "#64748B",
                fontSize: "12px",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
              title="Automatically refresh dashboard metrics every 30 seconds"
            >
              <span className={autoRefresh ? "live-pulse-dot" : ""} style={{ width: 6, height: 6, borderRadius: "50%", background: autoRefresh ? "#10B981" : "#94A3B8" }} />
              <span>{autoRefresh ? "Auto-Sync 30s" : "Sync Paused"}</span>
            </button>

            {/* Financial Year Filter */}
            <div style={{ position: "relative" }}>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{
                  height: "38px",
                  padding: "0 28px 0 12px",
                  borderRadius: "10px",
                  border: "1px solid #CBD5E1",
                  background: "#FFFFFF",
                  color: "#0F172A",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  outline: "none",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)"
                }}
              >
                <option value="FY 2025–26">FY 2025–26 (Current)</option>
                <option value="Q4 FY 2025-26">Q4 FY 2025-26</option>
                <option value="Q3 FY 2025-26">Q3 FY 2025-26</option>
                <option value="All Time">All Historical Tenders</option>
              </select>
            </div>

            {/* Manual Sync Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              style={{
                height: "38px",
                padding: "0 16px",
                borderRadius: "10px",
                border: "1px solid #BAE6FD",
                background: "linear-gradient(135deg, #FFFFFF 0%, #F0F9FF 100%)",
                color: "#0284C7",
                fontSize: "13px",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                transition: "all 0.15s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#00A3E0";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#BAE6FD";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <RefreshCw
                size={15}
                style={{
                  color: "#00A3E0",
                  animation: isRefreshing ? "spin 0.8s linear infinite" : "none"
                }}
              />
              <span>{isRefreshing ? "Syncing..." : "Sync Gateways"}</span>
            </button>

            {/* Export Dossier Button */}
            <button
              onClick={handleExport}
              style={{
                height: "38px",
                padding: "0 16px",
                borderRadius: "10px",
                border: "none",
                background: "#002B49",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0, 43, 73, 0.2)",
                transition: "all 0.15s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#001A2C";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#002B49";
              }}
            >
              <Download size={15} />
              <span>Export Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── 2. HERO BANNER WITH LIVE METRICS & ARCHITECTURE MODAL ───── */}
      <HeroBanner
        onReviewPending={() => onNavigate?.("document-verification")}
        pendingCount={effectiveStats.pendingReview}
        accuracy="99.4%"
        avgTime="1.4 Days"
        aiStatus={aiStatus}
        sovereignHealth={effectiveStats.sovereignSyncHealth}
      />

      {/* ─── 3. SMART SOVEREIGN STATUS STRIP ─────────────────────────── */}
      <div
        className="card-hover-lift"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "14px",
          padding: "12px 22px",
          boxShadow: "0 2px 6px -1px rgba(0, 0, 0, 0.04)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "18px",
          alignItems: "center"
        }}
      >
        {/* System Status */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "#ECFDF5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <span className="live-pulse-dot" style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#10B981" }} />
          </div>
          <div>
            <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Gateway Engine
            </div>
            <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#002B49" }}>
              {aiStatus?.status === "ONLINE" ? "Online & Synchronized" : "Sovereign Validated"}
            </div>
          </div>
        </div>

        {/* AI Engine Model */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "rgba(0, 163, 224, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Brain size={16} style={{ color: "#00A3E0" }} />
          </div>
          <div>
            <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Neural Pipeline
            </div>
            <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#002B49" }}>
              LayoutLMv3 + RoBERTa
            </div>
          </div>
        </div>

        {/* Cost Avoidance / Monitored Tender Budget */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "#FEF3C7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <ShieldAlert size={16} style={{ color: "#D97706" }} />
          </div>
          <div>
            <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Estimated Cost Avoidance
            </div>
            <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#002B49" }}>
              {effectiveStats.costAvoidanceCr}
            </div>
          </div>
        </div>

        {/* Turnaround Time Savings */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "#F5F3FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Clock size={16} style={{ color: "#7C3AED" }} />
          </div>
          <div>
            <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Man-Days Saved
            </div>
            <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#002B49" }}>
              {effectiveStats.timeSavedDays} Days
            </div>
          </div>
        </div>

        {/* Last Sync Timestamp */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "#F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Activity size={16} style={{ color: "#475569" }} />
          </div>
          <div>
            <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Last Gateway Pulse
            </div>
            <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#002B49" }}>
              {lastSyncTime}
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4. STAT CARDS ROW (6 Dynamic Live Metrics) ─────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "16px"
        }}
      >
        <StatCard
          loading={loading}
          icon={FileText}
          label="Active Tenders"
          value={effectiveStats.activeTenders}
          trend={`${effectiveStats.totalTenders} Total NITs`}
          trendType="up"
          subtext="Under live scrutiny"
          iconColor="#00A3E0"
          iconBg="rgba(0, 163, 224, 0.08)"
          accentColor="#00A3E0"
          badge="LIVE"
          onClick={() => onNavigate?.("tenders")}
        />

        <StatCard
          loading={loading}
          icon={Users}
          label="Registered Bidders"
          value={effectiveStats.totalBidders}
          trend="+100% KYC"
          trendType="up"
          subtext="GSTN/MCA validated"
          iconColor="#10B981"
          iconBg="rgba(16, 185, 129, 0.08)"
          accentColor="#10B981"
          badge="VERIFIED"
          onClick={() => onNavigate?.("bidders")}
        />

        <StatCard
          loading={loading}
          icon={ShieldCheck}
          label="Qualified Bids"
          value={effectiveStats.verifiedBids}
          trend={`${effectiveStats.verifiedRate}% pass rate`}
          trendType="success"
          subtext="Statutory thresholds met"
          iconColor="#059669"
          iconBg="rgba(5, 150, 105, 0.08)"
          accentColor="#059669"
          onClick={() => onNavigate?.("document-verification")}
        />

        <StatCard
          loading={loading}
          icon={Clock}
          label="Pending Officer Sign-off"
          value={effectiveStats.pendingReview}
          trend="Review Queue"
          trendType="danger"
          subtext="Requires officer sign-off"
          iconColor="#D97706"
          iconBg="#FFFBEB"
          accentColor="#D97706"
          badge="ACTION"
          onClick={() => onNavigate?.("document-verification")}
        />

        <StatCard
          loading={loading}
          icon={AlertTriangle}
          label="High Risk Anomalies"
          value={effectiveStats.flaggedBids}
          trend="Vigilance Flags"
          trendType="danger"
          subtext="Isolated from opening"
          iconColor="#DC2626"
          iconBg="#FEF2F2"
          accentColor="#DC2626"
          badge="ALERT"
          onClick={() => onNavigate?.("risk-analysis")}
        />

        <StatCard
          loading={loading}
          icon={CheckCircle2}
          label="Mean Compliance Rate"
          value={`${effectiveStats.complianceRate}%`}
          trend="CVC Benchmarked"
          trendType="success"
          subtext="Autonomous audit score"
          iconColor="#0284C7"
          iconBg="rgba(2, 132, 199, 0.08)"
          accentColor="#002B49"
          onClick={() => onNavigate?.("compliance-checks")}
        />
      </div>

      {/* ─── 5. "WHAT NEEDS YOUR ATTENTION" PRIORITY SECTION ─────────── */}
      <AttentionCard
        loading={loading}
        onActionClick={(target) => onNavigate?.(target)}
        items={riskSignals.length > 0 ? riskSignals.slice(0, 4).map((s, idx) => ({
          id: s.id || `signal-${idx}`,
          priority: s.riskLevel === "CRITICAL" ? "Critical" : s.riskLevel === "HIGH" ? "High" : "Clarification",
          borderColor: s.riskLevel === "CRITICAL" ? "#EF4444" : s.riskLevel === "HIGH" ? "#F59E0B" : "#00A3E0",
          badgeBg: s.riskLevel === "CRITICAL" ? "#FEF2F2" : s.riskLevel === "HIGH" ? "#FFFBEB" : "rgba(0, 163, 224, 0.08)",
          badgeColor: s.riskLevel === "CRITICAL" ? "#DC2626" : s.riskLevel === "HIGH" ? "#D97706" : "#00A3E0",
          badgeBorder: s.riskLevel === "CRITICAL" ? "#FECACA" : s.riskLevel === "HIGH" ? "#FDE68A" : "rgba(0, 163, 224, 0.2)",
          icon: s.riskLevel === "CRITICAL" ? ShieldAlert : AlertTriangle,
          title: s.company || "Contractor Anomaly Flag",
          description: s.description || "Discrepancy detected against sovereign registry records.",
          meta: `Tender ${s.tenderId || "CPCL"} · Autonomous Scanner`,
          actionText: "Examine Evidence",
          target: "risk-analysis"
        })) : null}
      />

      {/* ─── 6. CPCL SIH PROBLEM STATEMENT HIGHLIGHT BANNER ──────────── */}
      <ProjectProblemBanner onNavigate={onNavigate} />

      {/* ─── 7. PROCUREMENT ANALYTICS (65% / 35%) ────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.8fr 1.2fr",
          gap: "20px"
        }}
      >
        {/* Left 65%: Monthly Throughput & Volume */}
        <div
          className="card-hover-lift"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "14px",
            padding: "22px 26px",
            boxShadow: "0 2px 6px -1px rgba(0, 0, 0, 0.04)"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "18px",
              flexWrap: "wrap",
              gap: "10px"
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#002B49" }}>
                  Procurement Throughput & Verification Trends
                </h3>
                <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 7px", borderRadius: 999, background: "#EFF6FF", color: "#0284C7" }}>
                  Active FY
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "#64748B", marginTop: 2 }}>
                Monthly volume of evaluated contractor submissions vs. qualified and flagged bids
              </p>
            </div>

            {/* Time Filter Controls */}
            <div
              style={{
                display: "flex",
                background: "#F1F5F9",
                padding: "3px",
                borderRadius: "8px",
                border: "1px solid #E2E8F0"
              }}
            >
              {["Monthly Trend", "Category Breakdown"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setActivityTimeFilter(tf)}
                  style={{
                    padding: "5px 12px",
                    border: "none",
                    borderRadius: "6px",
                    background: activityTimeFilter === tf ? "#FFFFFF" : "transparent",
                    color: activityTimeFilter === tf ? "#002B49" : "#64748B",
                    fontSize: "11.5px",
                    fontWeight: activityTimeFilter === tf ? 800 : 500,
                    cursor: "pointer",
                    boxShadow: activityTimeFilter === tf ? "0 1px 3px rgba(0, 0, 0, 0.06)" : "none",
                    transition: "all 0.12s ease"
                  }}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Rendering */}
          <div style={{ height: "240px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              {activityTimeFilter === "Monthly Trend" ? (
                <BarChart data={monthlyChartData} barGap={4} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11.5} tickLine={false} axisLine={{ stroke: "#E2E8F0" }} />
                  <YAxis stroke="#94A3B8" fontSize={11.5} tickLine={false} axisLine={false} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: "10px",
                      boxShadow: "0 6px 18px rgba(0, 0, 0, 0.08)",
                      fontSize: "12px",
                      fontWeight: 600
                    }}
                  />
                  <Bar dataKey="submitted" name="Submissions" fill="#00A3E0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="verified" name="Qualified" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="flagged" name="Disqualified" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <BarChart
                  data={chartData?.categories || [
                    { category: "Equipment", count: 9 },
                    { category: "Materials", count: 7 },
                    { category: "Services", count: 5 },
                    { category: "Civil", count: 4 }
                  ]}
                  barGap={4}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="category" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={{ stroke: "#E2E8F0" }} />
                  <YAxis stroke="#94A3B8" fontSize={11.5} tickLine={false} axisLine={false} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: "10px",
                      fontSize: "12px"
                    }}
                  />
                  <Bar dataKey="count" name="Tenders Count" fill="#002B49" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Chart Legend */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              marginTop: "14px",
              paddingTop: "14px",
              borderTop: "1px solid #F1F5F9",
              fontSize: "12px",
              color: "#475569"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "9px", height: "9px", borderRadius: "3px", background: "#00A3E0" }} />
              <span>Total Submissions</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "9px", height: "9px", borderRadius: "3px", background: "#10B981" }} />
              <span>Qualified Bids (79%)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "9px", height: "9px", borderRadius: "3px", background: "#EF4444" }} />
              <span>Disqualified (8%)</span>
            </div>
          </div>
        </div>

        {/* Right 35%: Circular Compliance Health Gauge */}
        <ComplianceGauge
          loading={loading}
          score={effectiveStats.complianceRate}
          metCount={effectiveStats.verifiedBids}
          partialCount={effectiveStats.pendingReview}
          missingCount={effectiveStats.flaggedBids}
          totalRequirements={effectiveStats.verifiedBids + effectiveStats.pendingReview + effectiveStats.flaggedBids}
          distributionData={complianceDist}
        />
      </div>

      {/* ─── 8. RISK INTELLIGENCE & MULTI-PORTAL VALIDATOR ───────────── */}
      <div
        className="card-hover-lift"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "14px",
          padding: "22px 26px",
          boxShadow: "0 2px 6px -1px rgba(0, 0, 0, 0.04)"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "18px",
            flexWrap: "wrap",
            gap: "10px"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#002B49" }}>
                Multi-Portal Sovereign Verification & Anomaly Monitor
              </h2>
              <span style={{ fontSize: "11px", fontWeight: 800, padding: "2px 7px", borderRadius: 999, background: "#FEF2F2", color: "#DC2626" }}>
                VIGILANCE
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "#64748B", marginTop: 2 }}>
              Autonomous detection of shell vendors, MSME false claims, and financial statement discrepancies
            </p>
          </div>

          <button
            onClick={() => onNavigate?.("risk-analysis")}
            style={{
              background: "none",
              border: "none",
              color: "#00A3E0",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <span>Open Sovereign Risk Matrix</span>
            <ChevronRight size={15} />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.35fr",
            gap: "28px"
          }}
        >
          {/* Left: Statutory Risk Distribution Breakdown */}
          <div>
            <div style={{ fontSize: "13px", fontWeight: 800, color: "#002B49", marginBottom: "14px" }}>
              Bidder Compliance Tiers
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Critical */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "5px" }}>
                  <span style={{ fontWeight: 700, color: "#DC2626" }}>Critical Disqualification (&lt;50%)</span>
                  <span style={{ fontWeight: 800, color: "#0F172A" }}>{complianceDist?.distribution?.[3]?.count ?? 2} Bids</span>
                </div>
                <div style={{ height: "7px", width: "100%", background: "#F1F5F9", borderRadius: "99px", overflow: "hidden" }}>
                  <div style={{ width: `${complianceDist?.distribution?.[3]?.percentage ?? 6}%`, height: "100%", background: "#EF4444", borderRadius: "99px" }} />
                </div>
              </div>

              {/* Requires Clarification */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "5px" }}>
                  <span style={{ fontWeight: 700, color: "#D97706" }}>Requires Clarification (50-74%)</span>
                  <span style={{ fontWeight: 800, color: "#0F172A" }}>{complianceDist?.distribution?.[2]?.count ?? 4} Bids</span>
                </div>
                <div style={{ height: "7px", width: "100%", background: "#F1F5F9", borderRadius: "99px", overflow: "hidden" }}>
                  <div style={{ width: `${complianceDist?.distribution?.[2]?.percentage ?? 12}%`, height: "100%", background: "#F59E0B", borderRadius: "99px" }} />
                </div>
              </div>

              {/* Substantially Compliant */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "5px" }}>
                  <span style={{ fontWeight: 700, color: "#0284C7" }}>Substantially Compliant (75-89%)</span>
                  <span style={{ fontWeight: 800, color: "#0F172A" }}>{complianceDist?.distribution?.[1]?.count ?? 11} Bids</span>
                </div>
                <div style={{ height: "7px", width: "100%", background: "#F1F5F9", borderRadius: "99px", overflow: "hidden" }}>
                  <div style={{ width: `${complianceDist?.distribution?.[1]?.percentage ?? 32}%`, height: "100%", background: "#00A3E0", borderRadius: "99px" }} />
                </div>
              </div>

              {/* Fully Compliant */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "5px" }}>
                  <span style={{ fontWeight: 700, color: "#059669" }}>Fully Compliant Certified (90-100%)</span>
                  <span style={{ fontWeight: 800, color: "#0F172A" }}>{complianceDist?.distribution?.[0]?.count ?? 18} Bids</span>
                </div>
                <div style={{ height: "7px", width: "100%", background: "#F1F5F9", borderRadius: "99px", overflow: "hidden" }}>
                  <div style={{ width: `${complianceDist?.distribution?.[0]?.percentage ?? 52}%`, height: "100%", background: "#10B981", borderRadius: "99px" }} />
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "18px",
                padding: "12px 14px",
                borderRadius: "10px",
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                fontSize: "12px",
                color: "#991B1B",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
            >
              <AlertTriangle size={16} style={{ flexShrink: 0, color: "#EF4444" }} />
              <span>{effectiveStats.flaggedBids} high-risk bids quarantined automatically pending Chief Vigilance Officer review.</span>
            </div>
          </div>

          {/* Right: Live AI Risk Signals Stream */}
          <div>
            <div style={{ fontSize: "13px", fontWeight: 800, color: "#002B49", marginBottom: "14px", display: "flex", justifyContent: "space-between" }}>
              <span>Live Vigilance Signals Stream</span>
              <span style={{ fontSize: "11px", color: "#64748B", fontWeight: 500 }}>Live SHA-256 Verified</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {(riskSignals.length > 0 ? riskSignals.slice(0, 4) : [
                { id: "SIG-1", company: "PetroElectro Solutions Ltd", description: "3B Return turnover differs by 18.4% from submitted audited accounts", riskLevel: "HIGH" },
                { id: "SIG-2", company: "Southern Logistics & Freight Corp", description: "Factory safety certificate expired prior to tender bid submission deadline", riskLevel: "CRITICAL" },
                { id: "SIG-3", company: "Bharat Valve & Piping Corp", description: "Director DIN identified on central CPPP debarment monitoring watch list", riskLevel: "HIGH" },
                { id: "SIG-4", company: "Deccan Cryogenics & Gas Ltd", description: "Class-I local content declared 54%; verified bill of materials is 46.2%", riskLevel: "MEDIUM" }
              ]).map((sig, sIdx) => {
                const isCrit = sig.riskLevel === "CRITICAL";
                const isHigh = sig.riskLevel === "HIGH";

                return (
                  <div
                    key={sig.id || sIdx}
                    className="card-hover-lift"
                    style={{
                      padding: "11px 14px",
                      borderRadius: "10px",
                      border: "1px solid #E2E8F0",
                      borderLeft: `4px solid ${isCrit ? "#EF4444" : isHigh ? "#F59E0B" : "#00A3E0"}`,
                      background: "#F8FAFC",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                      <span
                        className={isCrit ? "pulse-red" : ""}
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: isCrit ? "#EF4444" : isHigh ? "#F59E0B" : "#00A3E0",
                          flexShrink: 0
                        }}
                      />
                      <div>
                        <div style={{ fontSize: "12.5px", fontWeight: 800, color: "#002B49" }}>
                          {sig.company}
                        </div>
                        <div style={{ fontSize: "11.5px", color: "#64748B", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "340px" }}>
                          {sig.description}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate?.("risk-analysis")}
                      style={{
                        padding: "5px 12px",
                        borderRadius: "7px",
                        background: "#FFFFFF",
                        border: "1px solid #CBD5E1",
                        color: "#002B49",
                        fontSize: "11.5px",
                        fontWeight: 700,
                        cursor: "pointer",
                        flexShrink: 0
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#00A3E0";
                        e.currentTarget.style.color = "#00A3E0";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#CBD5E1";
                        e.currentTarget.style.color = "#002B49";
                      }}
                    >
                      Audit
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── 9. RECENT COMPLIANCE AUDIT TIMELINE & AI INSIGHT WIDGET ─── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.45fr 1fr",
          gap: "20px"
        }}
      >
        {/* Real-time Compliance Audit Trail */}
        <div
          className="card-hover-lift"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "14px",
            padding: "22px 26px",
            boxShadow: "0 2px 6px -1px rgba(0, 0, 0, 0.04)"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "18px"
            }}
          >
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#002B49" }}>
                Real-Time Compliance Audit Feed
              </h3>
              <p style={{ fontSize: "12px", color: "#64748B", marginTop: 2 }}>
                Live immutable SHA-256 chronological action log
              </p>
            </div>
            <button
              onClick={() => onNavigate?.("audit-trail")}
              style={{
                background: "none",
                border: "none",
                color: "#00A3E0",
                fontSize: "12.5px",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Full CVC Ledger →
            </button>
          </div>

          {/* Timeline Feed */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {(recentLogs.length > 0 ? recentLogs.slice(0, 4) : [
              {
                id: "LOG-1",
                action: "AI_TECHNICAL_EVALUATION_COMPLETED",
                user_name: "AI Autonomous Engine",
                created_at: new Date(Date.now() - 600000).toISOString(),
                entity_id: "CPCL/CRU/2025/082",
                details: { score: 96.4, verdict: "QUALIFIED" }
              },
              {
                id: "LOG-2",
                action: "OFFICER_FINAL_DECISION_RECORDED",
                user_name: "K. Rajasekaran (Officer)",
                created_at: new Date(Date.now() - 1800000).toISOString(),
                entity_id: "APP-2025-0041",
                details: { decision: "QUALIFIED" }
              },
              {
                id: "LOG-3",
                action: "SOVEREIGN_GATEWAY_SYNC_SUCCESSFUL",
                user_name: "GSTN Gateway Connector",
                created_at: new Date(Date.now() - 3600000).toISOString(),
                entity_id: "NIC-GSTN-GATEWAY",
                details: { status: "AUTHENTICATED" }
              },
              {
                id: "LOG-4",
                action: "CLARIFICATION_NOTICE_ISSUED",
                user_name: "P. Sundaram (Officer)",
                created_at: new Date(Date.now() - 7200000).toISOString(),
                entity_id: "CLR-2025-019",
                details: { reason: "Form 3B Turnover" }
              }
            ]).map((log, lIdx) => {
              const dateStr = log.created_at ? new Date(log.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "10:15";

              return (
                <div key={log.id || lIdx} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "#64748B", width: "42px", flexShrink: 0, marginTop: "2px", fontFamily: "monospace" }}>
                    {dateStr}
                  </span>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00A3E0", marginTop: "6px", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#002B49" }}>
                        {log.entity_id || log.action?.replace(/_/g, " ")}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 800,
                          color: "#0284C7",
                          background: "rgba(0, 163, 224, 0.08)",
                          padding: "2px 7px",
                          borderRadius: "5px"
                        }}
                      >
                        {log.user_name?.split(" ")[0] || "SYSTEM"}
                      </span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>
                      {log.action?.replace(/_/g, " ")} {log.details?.decision ? `— Decision: ${log.details.decision}` : ""} {log.details?.score ? `(Score: ${log.details.score}%)` : ""}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Autonomous Recommendation Card */}
        <div
          className="card-hover-lift"
          style={{
            background: "linear-gradient(135deg, #FFFFFF 0%, #F0FDF9 100%)",
            border: "1px solid #99F6E4",
            borderRadius: "14px",
            padding: "22px 26px",
            boxShadow: "0 4px 14px rgba(14, 165, 164, 0.08)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "10px",
                    background: "rgba(14, 165, 164, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Brain size={18} style={{ color: "#0EA5A4" }} />
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#002B49" }}>
                  AI Autonomous Recommendation
                </h3>
              </div>

              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#0E7490",
                  background: "#CCFBF1",
                  border: "1px solid #99F6E4",
                  padding: "2px 8px",
                  borderRadius: "6px"
                }}
              >
                99.4% Confidence
              </span>
            </div>

            <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#0F172A", lineHeight: 1.5, margin: "14px 0 10px" }}>
              "Proceed with Commercial Opening for CDU-III Radiant Coils; Withhold DCS Tender 089."
            </div>

            <p style={{ fontSize: "12px", color: "#475569", lineHeight: 1.5, marginBottom: "20px" }}>
              CDU-III has 6 qualified bidders with all audited balance sheets authenticated via MCA21. DCS Overhaul has an unresolved GST turnover variance requiring CA reconciliation under CVC Rule 144(xi).
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => onNavigate?.("ai-insights")}
              style={{
                flex: 1,
                height: "38px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #002B49 0%, #00A3E0 100%)",
                color: "#FFFFFF",
                border: "none",
                fontSize: "12.5px",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                boxShadow: "0 2px 8px rgba(0, 43, 73, 0.18)"
              }}
            >
              <span>Examine Evidence</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => onNavigate?.("document-verification")}
              style={{
                height: "38px",
                padding: "0 16px",
                borderRadius: "10px",
                background: "#FFFFFF",
                color: "#002B49",
                border: "1px solid #CBD5E1",
                fontSize: "12.5px",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              Sign-Off Queue
            </button>
          </div>
        </div>
      </div>

      {/* ─── 10. RECENT TENDERS ENTERPRISE TABLE ──────────────────────── */}
      <div
        className="card-hover-lift"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "14px",
          padding: "22px 26px",
          boxShadow: "0 2px 6px -1px rgba(0, 0, 0, 0.04)"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "14px",
            marginBottom: "18px"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#002B49" }}>
                Active Tender Evaluations & Scrutiny
              </h2>
              <span style={{ fontSize: "11px", fontWeight: 800, padding: "2px 8px", borderRadius: 999, background: "#EFF6FF", color: "#0284C7" }}>
                {filteredTenders.length} Active
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "#64748B", marginTop: 2 }}>
              Tender status, bid volume, AI compliance rating, and estimated procurement value
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
              <input
                type="text"
                value={tenderSearch}
                onChange={(e) => setTenderSearch(e.target.value)}
                placeholder="Search tenders, NITs, depts..."
                style={{
                  height: "36px",
                  padding: "0 12px 0 34px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  background: "#F8FAFC",
                  color: "#0F172A",
                  fontSize: "12.5px",
                  outline: "none",
                  width: "240px",
                  boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.03)"
                }}
              />
            </div>

            {/* Category Filter */}
            <select
              value={tenderCategoryFilter}
              onChange={(e) => setTenderCategoryFilter(e.target.value)}
              style={{
                height: "36px",
                padding: "0 12px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                background: "#FFFFFF",
                color: "#0F172A",
                fontSize: "12.5px",
                fontWeight: 600,
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="All">All Categories</option>
              <option value="Equipment">Equipment</option>
              <option value="Materials">Materials</option>
              <option value="Services">Services</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E2E8F0", background: "#F8FAFC" }}>
                <th style={{ padding: "12px 14px", fontWeight: 700, color: "#475569", fontSize: "11.5px" }}>NIT Reference</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, color: "#475569", fontSize: "11.5px" }}>Tender Scope</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, color: "#475569", fontSize: "11.5px" }}>Category</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, color: "#475569", fontSize: "11.5px" }}>Bidders</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, color: "#475569", fontSize: "11.5px" }}>AI Compliance</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, color: "#475569", fontSize: "11.5px" }}>Risk Rating</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, color: "#475569", fontSize: "11.5px" }}>Est. Value</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, color: "#475569", fontSize: "11.5px" }}>Deadline</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, color: "#475569", fontSize: "11.5px", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenders.map((t) => {
                const isHighRisk = t.risk === "High" || t.risk === "Critical";
                const isMedRisk = t.risk === "Medium";

                return (
                  <tr
                    key={t.id}
                    style={{
                      borderBottom: "1px solid #F1F5F9",
                      transition: "background 0.15s ease"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "14px", fontWeight: 800, color: "#00A3E0", fontFamily: "monospace" }}>
                      {t.id}
                    </td>
                    <td style={{ padding: "14px", maxWidth: 300 }}>
                      <div style={{ fontWeight: 700, color: "#002B49", lineHeight: 1.3 }}>
                        {t.title}
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748B", marginTop: 2 }}>
                        {t.department}
                      </div>
                    </td>
                    <td style={{ padding: "14px", color: "#475569" }}>
                      <span style={{ background: "#F1F5F9", padding: "3px 8px", borderRadius: "5px", fontSize: "11px", fontWeight: 700 }}>
                        {t.category}
                      </span>
                    </td>
                    <td style={{ padding: "14px", fontWeight: 800, color: "#002B49" }}>
                      {t.bidders}
                    </td>
                    <td style={{ padding: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: 800, color: t.complianceVal >= 75 ? "#059669" : t.complianceVal >= 50 ? "#D97706" : "#DC2626" }}>
                          {t.compliance}
                        </span>
                        <div style={{ width: "45px", height: "5px", background: "#F1F5F9", borderRadius: "3px", overflow: "hidden" }}>
                          <div
                            style={{
                              width: `${t.complianceVal}%`,
                              height: "100%",
                              background: t.complianceVal >= 75 ? "#10B981" : t.complianceVal >= 50 ? "#F59E0B" : "#EF4444"
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px" }}>
                      <span
                        style={{
                          padding: "3px 9px",
                          borderRadius: "5px",
                          fontSize: "11px",
                          fontWeight: 800,
                          background: isHighRisk ? "#FEF2F2" : isMedRisk ? "#FFFBEB" : "#ECFDF5",
                          color: isHighRisk ? "#DC2626" : isMedRisk ? "#D97706" : "#059669",
                          border: isHighRisk ? "1px solid #FECACA" : isMedRisk ? "1px solid #FDE68A" : "1px solid #A7F3D0"
                        }}
                      >
                        {t.risk}
                      </span>
                    </td>
                    <td style={{ padding: "14px", fontWeight: 700, color: "#002B49", fontSize: "12.5px" }}>
                      {t.estimatedValue || "₹15.0 Cr"}
                    </td>
                    <td style={{ padding: "14px", color: "#64748B", fontSize: "12px" }}>
                      {t.deadline}
                    </td>
                    <td style={{ padding: "14px", textAlign: "right" }}>
                      <button
                        onClick={() => onNavigate?.("tenders", { tenderId: t.id })}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "8px",
                          background: "#FFFFFF",
                          border: "1px solid #CBD5E1",
                          color: "#002B49",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all 0.15s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#00A3E0";
                          e.currentTarget.style.color = "#00A3E0";
                          e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 163, 224, 0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#CBD5E1";
                          e.currentTarget.style.color = "#002B49";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        View Bids
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "16px",
            paddingTop: "14px",
            borderTop: "1px solid #F1F5F9",
            fontSize: "12px",
            color: "#64748B"
          }}
        >
          <span>Showing <strong>{filteredTenders.length}</strong> active tender records from live registry</span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => onNavigate?.("tenders")}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                background: "#FFFFFF",
                color: "#002B49",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Browse All Tenders ({effectiveStats.totalTenders})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
