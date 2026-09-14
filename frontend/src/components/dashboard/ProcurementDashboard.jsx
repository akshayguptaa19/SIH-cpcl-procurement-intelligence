"use client";
import React, { useState, useRef, useEffect } from "react";
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
  FileCheck
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
  Cell
} from "recharts";
import { useToast } from "@/components/common/ToastProvider";
import { useProcurement } from "../../context/ProcurementContext";
import HeroBanner from "./HeroBanner";
import StatCard from "./StatCard";
import AttentionCard from "./AttentionCard";
import ComplianceGauge from "./ComplianceGauge";
import ProjectProblemBanner from "./ProjectProblemBanner";
import { Link } from "react-router-dom";

// Verification activity weekly dataset
const VERIFICATION_ACTIVITY_DATA = [
  { name: "Mon", verified: 38, pending: 12, failed: 4 },
  { name: "Tue", verified: 45, pending: 15, failed: 2 },
  { name: "Wed", verified: 52, pending: 8, failed: 6 },
  { name: "Thu", verified: 40, pending: 18, failed: 3 },
  { name: "Fri", verified: 62, pending: 14, failed: 5 },
  { name: "Sat", verified: 28, pending: 6, failed: 1 },
  { name: "Sun", verified: 14, pending: 2, failed: 0 }
];

// Compliance donut data
const COMPLIANCE_DONUT_DATA = [
  { name: "Compliant", value: 162, color: "#12B76A" },
  { name: "Minor Issues", value: 43, color: "#F79009" },
  { name: "Non-Compliant", value: 24, color: "#F04438" },
  { name: "Under Review", value: 10, color: "#155EEF" }
];

// Recent Tenders sample data
const RECENT_TENDERS_DATA = [
  {
    id: "GEM/2025/B/4891042",
    title: "Industrial Equipment & Turbine Procurement",
    category: "Equipment",
    bidders: 8,
    compliance: "92%",
    complianceVal: 92,
    risk: "Low",
    deadline: "18 Sep 2026",
    status: "Active"
  },
  {
    id: "GEM/2025/B/4891038",
    title: "Specialty Catalyst & Chemical Supply",
    category: "Materials",
    bidders: 5,
    compliance: "36%",
    complianceVal: 36,
    risk: "High",
    deadline: "15 Sep 2026",
    status: "Review"
  },
  {
    id: "GEM/2025/B/4891031",
    title: "Refinery Plant Preventive Maintenance Services",
    category: "Services",
    bidders: 12,
    compliance: "78%",
    complianceVal: 78,
    risk: "Medium",
    deadline: "12 Sep 2026",
    status: "Active"
  },
  {
    id: "GEM/2025/B/4891027",
    title: "High-Pressure Valve & Pipeline Assemblies",
    category: "Equipment",
    bidders: 6,
    compliance: "88%",
    complianceVal: 88,
    risk: "Low",
    deadline: "24 Sep 2026",
    status: "Active"
  },
  {
    id: "GEM/2025/B/4891019",
    title: "Civil Infrastructure & Control Room Overhaul",
    category: "Services",
    bidders: 9,
    compliance: "64%",
    complianceVal: 64,
    risk: "Medium",
    deadline: "30 Sep 2026",
    status: "Active"
  }
];

export default function ProcurementDashboard({ onNavigate }) {
  const { showToast } = useToast();
  const { computedKPIs } = useProcurement();

  const metrics = {
    totalTenders: computedKPIs?.totalTenders?.value ?? (typeof computedKPIs?.totalTenders === "number" ? computedKPIs.totalTenders : 9),
    totalBidders: computedKPIs?.totalBidders?.value ?? (typeof computedKPIs?.totalBidders === "number" ? computedKPIs.totalBidders : 5),
    verifiedDocs: computedKPIs?.completedVerifications?.value ?? (typeof computedKPIs?.verifiedDocs === "number" ? computedKPIs.verifiedDocs : 239),
    pendingDocs: computedKPIs?.pendingReviews?.value ?? (typeof computedKPIs?.pendingDocs === "number" ? computedKPIs.pendingDocs : 1),
    flaggedBids: computedKPIs?.nonCompliantBids?.value ?? (typeof computedKPIs?.flaggedBids === "number" ? computedKPIs.flaggedBids : 39),
    complianceRate: typeof computedKPIs?.complianceRate?.value === "string" 
      ? parseFloat(computedKPIs.complianceRate.value) 
      : (computedKPIs?.complianceRate?.value ?? (typeof computedKPIs?.complianceRate === "number" ? computedKPIs.complianceRate : 78.2))
  };

  const [dateFilter, setDateFilter] = useState("FY 2025–26");
  const [activityTimeFilter, setActivityTimeFilter] = useState("7D");
  const [tenderSearch, setTenderSearch] = useState("");
  const [tenderCategoryFilter, setTenderCategoryFilter] = useState("All");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync / Refresh action
  const handleRefresh = () => {
    setIsRefreshing(true);
    showToast({
      type: "info",
      title: "Synchronizing Data",
      message: "Syncing latest tender OCR and registry compliance checks..."
    });
    setTimeout(() => {
      setIsRefreshing(false);
      showToast({
        type: "success",
        title: "Synchronization Complete",
        message: "Procurement intelligence metrics are up to date."
      });
    }, 600);
  };

  // Export action
  const handleExport = () => {
    showToast({
      type: "success",
      title: "Exporting Report",
      message: "Generating government compliance dossier (PDF/Excel)..."
    });
  };

  // Filtered tenders
  const filteredTenders = RECENT_TENDERS_DATA.filter((t) => {
    const matchesSearch =
      !tenderSearch ||
      t.id.toLowerCase().includes(tenderSearch.toLowerCase()) ||
      t.title.toLowerCase().includes(tenderSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(tenderSearch.toLowerCase());
    const matchesCat = tenderCategoryFilter === "All" || t.category === tenderCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div
      style={{
        padding: "24px 32px 64px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        maxWidth: "1440px",
        margin: "0 auto",
        background: "#F5F7FA",
        minHeight: "100vh"
      }}
    >
      {/* ─── 1. PAGE HEADER WITH BREADCRUMB & CONTROLS ───────────────── */}
      <div>
        {/* Subtle Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12.5px",
            color: "#667085",
            marginBottom: "8px"
          }}
        >
          <Link
            to="/home"
            style={{ color: "#667085", textDecoration: "none", transition: "color 0.15s" }}
            onMouseEnter={(e) => (e.target.style.color = "#155EEF")}
            onMouseLeave={(e) => (e.target.style.color = "#667085")}
          >
            Home
          </Link>
          <span>/</span>
          <span style={{ color: "#101828", fontWeight: 600 }}>Dashboard</span>
        </div>

        {/* Title & Right Controls */}
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
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 800,
                color: "#101828",
                letterSpacing: "-0.02em",
                lineHeight: 1.2
              }}
            >
              Procurement Verification Dashboard
            </h1>
            <p style={{ fontSize: "13.5px", color: "#475467", marginTop: "4px" }}>
              AI-powered bidder document extraction, automated tender clause cross-checking & sovereign compliance scoring.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* FY Filter Dropdown */}
            <div style={{ position: "relative" }}>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{
                  height: "38px",
                  padding: "0 28px 0 12px",
                  borderRadius: "8px",
                  border: "1px solid #E4E7EC",
                  background: "#FFFFFF",
                  color: "#344054",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  outline: "none",
                  boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)"
                }}
              >
                <option value="FY 2025–26">FY 2025–26</option>
                <option value="Q3 FY 2025-26">Q3 FY 2025-26</option>
                <option value="Q2 FY 2025-26">Q2 FY 2025-26</option>
                <option value="All Time">All Financial Years</option>
              </select>
            </div>

            {/* Sync Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              style={{
                height: "38px",
                padding: "0 14px",
                borderRadius: "8px",
                border: "1px solid #E4E7EC",
                background: "#FFFFFF",
                color: "#344054",
                fontSize: "13px",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
                transition: "all 0.15s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F8FAFC";
                e.currentTarget.style.borderColor = "#D0D5DD";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#FFFFFF";
                e.currentTarget.style.borderColor = "#E4E7EC";
              }}
            >
              <RefreshCw
                size={14}
                style={{
                  color: "#155EEF",
                  animation: isRefreshing ? "spin 0.8s linear infinite" : "none"
                }}
              />
              Sync
            </button>

            {/* Export Button */}
            <button
              onClick={handleExport}
              style={{
                height: "38px",
                padding: "0 14px",
                borderRadius: "8px",
                border: "1px solid #E4E7EC",
                background: "#FFFFFF",
                color: "#344054",
                fontSize: "13px",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
                transition: "all 0.15s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F8FAFC";
                e.currentTarget.style.borderColor = "#D0D5DD";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#FFFFFF";
                e.currentTarget.style.borderColor = "#E4E7EC";
              }}
            >
              <Download size={14} style={{ color: "#475467" }} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* ─── 2. HERO BANNER (Full-width Dark Gradient Card) ───────── */}
      <HeroBanner
        onReviewPending={() => onNavigate?.("document-verification")}
        pendingCount={1}
        accuracy="97.6%"
        avgTime="<3 min"
      />

      {/* ─── 3. SMART STATUS STRIP ───────────────────────────────────── */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E4E7EC",
          borderRadius: "12px",
          padding: "10px 20px",
          boxShadow: "0 1px 3px rgba(16, 24, 40, 0.04)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "16px",
          alignItems: "center"
        }}
      >
        {/* System Status */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              background: "#ECFDF3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#12B76A",
                boxShadow: "0 0 6px #12B76A"
              }}
            />
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#667085", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              System Status
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#101828" }}>
              Operational
            </div>
          </div>
        </div>

        {/* AI Engine */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              background: "#F0FDF9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Brain size={15} style={{ color: "#0EA5A4" }} />
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#667085", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              AI Engine
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#101828" }}>
              98.8% Accuracy
            </div>
          </div>
        </div>

        {/* Verification Speed */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              background: "#EFF8FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Clock size={15} style={{ color: "#155EEF" }} />
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#667085", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Verification Speed
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#101828" }}>
              &lt; 4.2 min
            </div>
          </div>
        </div>

        {/* Active Jobs */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              background: "#EFF8FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Cpu size={15} style={{ color: "#155EEF" }} />
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#667085", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Active Jobs
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#101828" }}>
              10
            </div>
          </div>
        </div>

        {/* Risk Alerts */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              background: "#FEF3F2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <AlertTriangle size={15} style={{ color: "#F04438" }} />
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#667085", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Risk Alerts
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#F04438" }}>
              5
            </div>
          </div>
        </div>

        {/* Last Sync */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              background: "#F2F4F7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Activity size={15} style={{ color: "#667085" }} />
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#667085", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Last Sync
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#101828" }}>
              2 min ago
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4. STAT CARDS ROW (6 Key Metrics) ────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "14px",
          marginBottom: "24px"
        }}
      >
        <StatCard
          icon={FileText}
          label="Total Tenders"
          value={metrics.totalTenders}
          trend="+12%"
          trendType="up"
          subtext="vs last month"
          iconColor="#2563EB"
          iconBg="#EFF6FF"
          onClick={() => onNavigate?.("tenders")}
        />
        <StatCard
          icon={Users}
          label="Active Bidders"
          value={metrics.totalBidders}
          trend="+2 new"
          trendType="up"
          subtext="verified suppliers"
          iconColor="#059669"
          iconBg="#ECFDF5"
          onClick={() => onNavigate?.("bidders")}
        />
        <StatCard
          icon={ShieldCheck}
          label="Documents Verified"
          value={metrics.verifiedDocs}
          trend="97.6% accuracy"
          trendType="success"
          subtext="across all NITs"
          iconColor="#7C3AED"
          iconBg="#F5F3FF"
          onClick={() => onNavigate?.("document-verification")}
        />
        <StatCard
          icon={Clock}
          label="Pending Reviews"
          value={metrics.pendingDocs}
          trend="Manual Action"
          trendType="danger"
          subtext="requires officer sign-off"
          iconColor="#D97706"
          iconBg="#FFFBEB"
          onClick={() => onNavigate?.("document-verification")}
        />
        <StatCard
          icon={AlertTriangle}
          label="Flagged Bids"
          value={metrics.flaggedBids}
          trend="Disqualified"
          trendType="danger"
          subtext="high risk anomalies"
          iconColor="#DC2626"
          iconBg="#FEF2F2"
          onClick={() => onNavigate?.("risk-analysis")}
        />
        <StatCard
          icon={CheckCircle2}
          label="Avg Compliance Score"
          value={`${metrics.complianceRate}%`}
          trend="CVC Compliant"
          trendType="success"
          subtext="strict benchmark"
          iconColor="#0EA5A4"
          iconBg="#F0FDF4"
        />
      </div>

      {/* ─── 5. "WHAT NEEDS YOUR ATTENTION" PRIORITY SECTION ─────────── */}
      <AttentionCard onActionClick={(target) => onNavigate?.(target)} />

      {/* ─── 6. PROCUREMENT ANALYTICS (65% / 35%) ────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.8fr 1.2fr",
          gap: "20px"
        }}
      >
        {/* Left 65%: Verification Activity */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E4E7EC",
            borderRadius: "14px",
            padding: "20px 24px",
            boxShadow: "0 1px 3px rgba(16, 24, 40, 0.05)"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px"
            }}
          >
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#101828" }}>
                Verification Activity
              </h3>
              <p style={{ fontSize: "12px", color: "#667085" }}>
                Contractor document verification progression over time
              </p>
            </div>

            {/* Time filters */}
            <div
              style={{
                display: "flex",
                background: "#F2F4F7",
                padding: "3px",
                borderRadius: "8px",
                border: "1px solid #E4E7EC"
              }}
            >
              {["7D", "30D", "90D", "FY"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setActivityTimeFilter(tf)}
                  style={{
                    padding: "4px 10px",
                    border: "none",
                    borderRadius: "6px",
                    background: activityTimeFilter === tf ? "#FFFFFF" : "transparent",
                    color: activityTimeFilter === tf ? "#155EEF" : "#667085",
                    fontSize: "11.5px",
                    fontWeight: activityTimeFilter === tf ? 700 : 500,
                    cursor: "pointer",
                    boxShadow: activityTimeFilter === tf ? "0 1px 2px rgba(16, 24, 40, 0.05)" : "none",
                    transition: "all 0.12s ease"
                  }}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div style={{ height: "230px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VERIFICATION_ACTIVITY_DATA} barGap={4} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F4F7" />
                <XAxis dataKey="name" stroke="#98A2B3" fontSize={11} tickLine={false} axisLine={{ stroke: "#E4E7EC" }} />
                <YAxis stroke="#98A2B3" fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E4E7EC",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(16, 24, 40, 0.08)",
                    fontSize: "12px"
                  }}
                />
                <Bar dataKey="verified" name="Verified" fill="#12B76A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#F79009" radius={[4, 4, 0, 0]} />
                <Bar dataKey="failed" name="Failed" fill="#F04438" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginTop: "12px",
              paddingTop: "12px",
              borderTop: "1px solid #F2F4F7",
              fontSize: "12px",
              color: "#475467"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: "#12B76A" }} />
              <span>Verified (74%)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: "#F79009" }} />
              <span>Pending (19%)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: "#F04438" }} />
              <span>Failed (7%)</span>
            </div>
          </div>
        </div>

        {/* Right 35%: Circular Compliance Gauge & Clause Match Status */}
        <ComplianceGauge
          score={78.2}
          metCount={186}
          partialCount={14}
          missingCount={39}
          totalRequirements={239}
        />
      </div>

      {/* ─── 7. RISK INTELLIGENCE ────────────────────────────────────── */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E4E7EC",
          borderRadius: "14px",
          padding: "20px 24px",
          boxShadow: "0 1px 3px rgba(16, 24, 40, 0.05)"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px"
          }}
        >
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#101828" }}>
              Risk Intelligence
            </h2>
            <p style={{ fontSize: "12px", color: "#667085" }}>
              Multi-source statutory risk classification and autonomous signals
            </p>
          </div>

          <button
            onClick={() => onNavigate?.("risk-analysis")}
            style={{
              background: "none",
              border: "none",
              color: "#155EEF",
              fontSize: "12.5px",
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            Full Risk Matrix <ChevronRight size={14} />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.3fr",
            gap: "28px"
          }}
        >
          {/* Left: Risk Distribution */}
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#344054", marginBottom: "14px" }}>
              Risk Distribution
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Critical */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 600, color: "#B42318" }}>Critical</span>
                  <span style={{ fontWeight: 700, color: "#101828" }}>5</span>
                </div>
                <div style={{ height: "6px", width: "100%", background: "#F2F4F7", borderRadius: "99px", overflow: "hidden" }}>
                  <div style={{ width: "12%", height: "100%", background: "#F04438", borderRadius: "99px" }} />
                </div>
              </div>

              {/* High */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 600, color: "#B54708" }}>High</span>
                  <span style={{ fontWeight: 700, color: "#101828" }}>12</span>
                </div>
                <div style={{ height: "6px", width: "100%", background: "#F2F4F7", borderRadius: "99px", overflow: "hidden" }}>
                  <div style={{ width: "29%", height: "100%", background: "#F79009", borderRadius: "99px" }} />
                </div>
              </div>

              {/* Medium */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 600, color: "#D97706" }}>Medium</span>
                  <span style={{ fontWeight: 700, color: "#101828" }}>23</span>
                </div>
                <div style={{ height: "6px", width: "100%", background: "#F2F4F7", borderRadius: "99px", overflow: "hidden" }}>
                  <div style={{ width: "56%", height: "100%", background: "#FDB022", borderRadius: "99px" }} />
                </div>
              </div>

              {/* Low */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 600, color: "#027A48" }}>Low</span>
                  <span style={{ fontWeight: 700, color: "#101828" }}>41</span>
                </div>
                <div style={{ height: "6px", width: "100%", background: "#F2F4F7", borderRadius: "99px", overflow: "hidden" }}>
                  <div style={{ width: "100%", height: "100%", background: "#12B76A", borderRadius: "99px" }} />
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "16px",
                padding: "10px 12px",
                borderRadius: "8px",
                background: "#FEF3F2",
                border: "1px solid #FECDCA",
                fontSize: "11.5px",
                color: "#B42318",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <AlertTriangle size={14} style={{ flexShrink: 0 }} />
              <span>5 critical risk bidders automatically isolated from final commercial bid opening.</span>
            </div>
          </div>

          {/* Right: AI Risk Signals */}
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#344054", marginBottom: "12px" }}>
              AI Risk Signals
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {/* Signal 1 */}
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #E4E7EC",
                  background: "#F8FAFC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F79009", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#101828" }}>
                      GSTIN mismatch detected
                    </div>
                    <div style={{ fontSize: "11px", color: "#667085" }}>
                      High confidence · 12 min ago
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate?.("risk-analysis")}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "6px",
                    background: "#FFFFFF",
                    border: "1px solid #D0D5DD",
                    color: "#344054",
                    fontSize: "11.5px",
                    fontWeight: 600,
                    cursor: "pointer",
                    flexShrink: 0
                  }}
                >
                  Review
                </button>
              </div>

              {/* Signal 2 */}
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #E4E7EC",
                  background: "#F8FAFC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#FDB022", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#101828" }}>
                      Duplicate document detected
                    </div>
                    <div style={{ fontSize: "11px", color: "#667085" }}>
                      Medium confidence · 34 min ago
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate?.("risk-analysis")}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "6px",
                    background: "#FFFFFF",
                    border: "1px solid #D0D5DD",
                    color: "#344054",
                    fontSize: "11.5px",
                    fontWeight: 600,
                    cursor: "pointer",
                    flexShrink: 0
                  }}
                >
                  Review
                </button>
              </div>

              {/* Signal 3 */}
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #E4E7EC",
                  background: "#F8FAFC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F79009", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#101828" }}>
                      Bidder financial inconsistency
                    </div>
                    <div style={{ fontSize: "11px", color: "#667085" }}>
                      High confidence · 1 hr ago
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate?.("risk-analysis")}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "6px",
                    background: "#FFFFFF",
                    border: "1px solid #D0D5DD",
                    color: "#344054",
                    fontSize: "11.5px",
                    fontWeight: 600,
                    cursor: "pointer",
                    flexShrink: 0
                  }}
                >
                  Review
                </button>
              </div>

              {/* Signal 4 */}
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #E4E7EC",
                  background: "#F8FAFC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F04438", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#101828" }}>
                      Expired certification
                    </div>
                    <div style={{ fontSize: "11px", color: "#667085" }}>
                      Critical · 2 hrs ago
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate?.("risk-analysis")}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "6px",
                    background: "#FFFFFF",
                    border: "1px solid #D0D5DD",
                    color: "#344054",
                    fontSize: "11.5px",
                    fontWeight: 600,
                    cursor: "pointer",
                    flexShrink: 0
                  }}
                >
                  Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 8. RECENT ACTIVITY & AI INSIGHTS WIDGET ──────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "20px"
        }}
      >
        {/* Recent Compliance Activity */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E4E7EC",
            borderRadius: "14px",
            padding: "20px 24px",
            boxShadow: "0 1px 3px rgba(16, 24, 40, 0.05)"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px"
            }}
          >
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#101828" }}>
                Recent Compliance Activity
              </h3>
              <p style={{ fontSize: "12px", color: "#667085" }}>
                Live statutory verification feed
              </p>
            </div>
            <button
              onClick={() => onNavigate?.("audit-trail")}
              style={{
                background: "none",
                border: "none",
                color: "#155EEF",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Full Audit Trail →
            </button>
          </div>

          {/* Timeline Feed */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Event 1 */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#667085", width: "42px", flexShrink: 0, marginTop: "2px" }}>
                09:42
              </span>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#12B76A", marginTop: "6px", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#101828" }}>
                    Tender CPCL/2025/1042
                  </span>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#027A48", background: "#ECFDF3", padding: "1px 6px", borderRadius: "4px" }}>
                    COMPLETED
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "#475467", marginTop: "1px" }}>
                  Bidder verification completed for ArcTech Systems
                </p>
              </div>
            </div>

            {/* Event 2 */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#667085", width: "42px", flexShrink: 0, marginTop: "2px" }}>
                09:35
              </span>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F79009", marginTop: "6px", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#101828" }}>
                    Tender CPCL/2025/1038
                  </span>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#B54708", background: "#FFFAEB", padding: "1px 6px", borderRadius: "4px" }}>
                    REQUIRES REVIEW
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "#475467", marginTop: "1px" }}>
                  Document mismatch detected in OEM authorization
                </p>
              </div>
            </div>

            {/* Event 3 */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#667085", width: "42px", flexShrink: 0, marginTop: "2px" }}>
                09:18
              </span>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#12B76A", marginTop: "6px", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#101828" }}>
                    Tender CPCL/2025/1031
                  </span>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#027A48", background: "#ECFDF3", padding: "1px 6px", borderRadius: "4px" }}>
                    APPROVED
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "#475467", marginTop: "1px" }}>
                  Compliance approved for Global Petro Solutions
                </p>
              </div>
            </div>

            {/* Event 4 */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#667085", width: "42px", flexShrink: 0, marginTop: "2px" }}>
                08:56
              </span>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#155EEF", marginTop: "6px", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#101828" }}>
                    New bidder registered
                  </span>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#175CD3", background: "#EFF8FF", padding: "1px 6px", borderRadius: "4px" }}>
                    CPCL/2025/1027
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "#475467", marginTop: "1px" }}>
                  Shakti Enterprises enrolled for Valve Assemblies tender
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Procurement Insight Widget */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #99F6E4",
            borderRadius: "14px",
            padding: "20px 24px",
            boxShadow: "0 1px 3px rgba(14, 165, 164, 0.08)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "8px",
                    background: "#F0FDF9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Brain size={16} style={{ color: "#0EA5A4" }} />
                </div>
                <h3 style={{ fontSize: "14.5px", fontWeight: 800, color: "#101828" }}>
                  AI Procurement Insight
                </h3>
              </div>

              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#0E7490",
                  background: "#F0FDF9",
                  border: "1px solid #99F6E4",
                  padding: "2px 8px",
                  borderRadius: "6px"
                }}
              >
                Confidence: 94%
              </span>
            </div>

            <p style={{ fontSize: "13px", color: "#344054", lineHeight: 1.55, margin: "14px 0 20px" }}>
              "3 bidders show unusual document patterns compared with historical procurement behavior."
            </p>

            <div style={{ fontSize: "11.5px", color: "#667085", lineHeight: 1.45, marginBottom: "20px" }}>
              Detected identical PDF author metadata and timestamp clustering across separate tender submissions for Catalyst Supply.
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => onNavigate?.("ai-insights")}
              style={{
                flex: 1,
                height: "36px",
                borderRadius: "8px",
                background: "#155EEF",
                color: "#FFFFFF",
                border: "none",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                boxShadow: "0 1px 2px rgba(16, 24, 40, 0.06)"
              }}
            >
              Investigate
            </button>

            <button
              onClick={() => onNavigate?.("document-verification")}
              style={{
                height: "36px",
                padding: "0 14px",
                borderRadius: "8px",
                background: "#FFFFFF",
                color: "#344054",
                border: "1px solid #D0D5DD",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              View Evidence
            </button>
          </div>
        </div>
      </div>

      {/* ─── 9. RECENT TENDERS ENTERPRISE TABLE ───────────────────────── */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E4E7EC",
          borderRadius: "14px",
          padding: "20px 24px",
          boxShadow: "0 1px 3px rgba(16, 24, 40, 0.05)"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "14px",
            marginBottom: "16px"
          }}
        >
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#101828" }}>
              Recent Tenders
            </h2>
            <p style={{ fontSize: "12px", color: "#667085" }}>
              Operational status, compliance benchmarks and risk profiles
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#98A2B3" }} />
              <input
                type="text"
                value={tenderSearch}
                onChange={(e) => setTenderSearch(e.target.value)}
                placeholder="Search tenders..."
                style={{
                  height: "34px",
                  padding: "0 10px 0 30px",
                  borderRadius: "8px",
                  border: "1px solid #E4E7EC",
                  background: "#F8FAFC",
                  color: "#101828",
                  fontSize: "12.5px",
                  outline: "none",
                  width: "200px"
                }}
              />
            </div>

            {/* Category Filter */}
            <select
              value={tenderCategoryFilter}
              onChange={(e) => setTenderCategoryFilter(e.target.value)}
              style={{
                height: "34px",
                padding: "0 10px",
                borderRadius: "8px",
                border: "1px solid #E4E7EC",
                background: "#FFFFFF",
                color: "#344054",
                fontSize: "12px",
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
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12.5px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E4E7EC", background: "#F8FAFC" }}>
                <th style={{ padding: "10px 14px", fontWeight: 700, color: "#475467", fontSize: "11.5px" }}>Tender ID</th>
                <th style={{ padding: "10px 14px", fontWeight: 700, color: "#475467", fontSize: "11.5px" }}>Tender Title</th>
                <th style={{ padding: "10px 14px", fontWeight: 700, color: "#475467", fontSize: "11.5px" }}>Category</th>
                <th style={{ padding: "10px 14px", fontWeight: 700, color: "#475467", fontSize: "11.5px" }}>Bidders</th>
                <th style={{ padding: "10px 14px", fontWeight: 700, color: "#475467", fontSize: "11.5px" }}>Compliance</th>
                <th style={{ padding: "10px 14px", fontWeight: 700, color: "#475467", fontSize: "11.5px" }}>Risk</th>
                <th style={{ padding: "10px 14px", fontWeight: 700, color: "#475467", fontSize: "11.5px" }}>Deadline</th>
                <th style={{ padding: "10px 14px", fontWeight: 700, color: "#475467", fontSize: "11.5px" }}>Status</th>
                <th style={{ padding: "10px 14px", fontWeight: 700, color: "#475467", fontSize: "11.5px", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenders.map((t) => (
                <tr
                  key={t.id}
                  style={{
                    borderBottom: "1px solid #F2F4F7",
                    transition: "background 0.12s"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px 14px", fontWeight: 700, color: "#155EEF", fontFamily: "monospace" }}>
                    {t.id}
                  </td>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "#101828" }}>
                    {t.title}
                  </td>
                  <td style={{ padding: "12px 14px", color: "#475467" }}>
                    <span style={{ background: "#F2F4F7", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600 }}>
                      {t.category}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px", fontWeight: 700, color: "#344054" }}>
                    {t.bidders}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontWeight: 700, color: t.complianceVal >= 70 ? "#027A48" : "#B54708" }}>
                        {t.compliance}
                      </span>
                      <div style={{ width: "40px", height: "4px", background: "#F2F4F7", borderRadius: "2px", overflow: "hidden" }}>
                        <div
                          style={{
                            width: `${t.complianceVal}%`,
                            height: "100%",
                            background: t.complianceVal >= 70 ? "#12B76A" : "#F79009"
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 700,
                        background:
                          t.risk === "Low" ? "#ECFDF3" : t.risk === "High" ? "#FEF3F2" : "#FFFAEB",
                        color:
                          t.risk === "Low" ? "#027A48" : t.risk === "High" ? "#B42318" : "#B54708",
                        border:
                          t.risk === "Low" ? "1px solid #A6F4C5" : t.risk === "High" ? "1px solid #FECDCA" : "1px solid #FEDF89"
                      }}
                    >
                      {t.risk}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px", color: "#667085", fontSize: "12px" }}>
                    {t.deadline}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 700,
                        background: t.status === "Active" ? "#EFF8FF" : "#FFFAEB",
                        color: t.status === "Active" ? "#175CD3" : "#B54708"
                      }}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px", textAlign: "right" }}>
                    <button
                      onClick={() => onNavigate?.("tenders", { tenderId: t.id })}
                      style={{
                        padding: "4px 12px",
                        borderRadius: "6px",
                        background: "#FFFFFF",
                        border: "1px solid #D0D5DD",
                        color: "#344054",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.12s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#155EEF";
                        e.currentTarget.style.color = "#155EEF";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#D0D5DD";
                        e.currentTarget.style.color = "#344054";
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "16px",
            paddingTop: "14px",
            borderTop: "1px solid #F2F4F7",
            fontSize: "12px",
            color: "#667085"
          }}
        >
          <span>Showing 1 to {filteredTenders.length} of 9 tenders</span>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              disabled
              style={{
                padding: "4px 10px",
                borderRadius: "6px",
                border: "1px solid #E4E7EC",
                background: "#F8FAFC",
                color: "#98A2B3",
                fontSize: "11.5px",
                cursor: "not-allowed"
              }}
            >
              Previous
            </button>
            <button
              style={{
                padding: "4px 10px",
                borderRadius: "6px",
                border: "1px solid #E4E7EC",
                background: "#FFFFFF",
                color: "#344054",
                fontSize: "11.5px",
                cursor: "pointer"
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
