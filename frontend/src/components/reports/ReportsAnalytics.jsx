"use client";
import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import {
  TrendingUp,
  FileCheck,
  Clock,
  AlertTriangle,
  Printer,
  Download,
  Calendar,
  Filter,
  Layers,
  FileText
} from "lucide-react";
import { MONTHLY_COMPLIANCE_TREND, BIDDER_DISTRIBUTION } from "@/lib/data";
import { useToast } from "@/components/common/ToastProvider";
import PageHeader from "@/components/common/PageHeader";

const VERIFICATION_THROUGHPUT = [
  { day: "Mon", aiProcessed: 42, officerApproved: 38 },
  { day: "Tue", aiProcessed: 56, officerApproved: 49 },
  { day: "Wed", aiProcessed: 68, officerApproved: 61 },
  { day: "Thu", aiProcessed: 52, officerApproved: 46 },
  { day: "Fri", aiProcessed: 60, officerApproved: 55 },
  { day: "Sat", aiProcessed: 22, officerApproved: 20 },
  { day: "Sun", aiProcessed: 14, officerApproved: 14 }
];

const AI_CONFIDENCE_DIST = [
  { range: "95–100%", count: 142, fill: "#16a34a" },
  { range: "85–95%", count: 98, fill: "#22c55e" },
  { range: "75–85%", count: 54, fill: "#d97706" },
  { range: "65–75%", count: 23, fill: "#f59e0b" },
  { range: "< 65%", count: 9, fill: "#dc2626" }
];

const RISK_PIE_DATA = [
  { name: "Low Risk", value: 158, color: "#16a34a" },
  { name: "Medium Risk", value: 86, color: "#d97706" },
  { name: "High Risk", value: 52, color: "#ea580c" },
  { name: "Critical Risk", value: 30, color: "#dc2626" }
];

const REJECTION_REASONS = [
  { reason: "Missing Mandatory Documents", count: 28, percent: 35, color: "#dc2626" },
  { reason: "PAN/GST Name Mismatch", count: 14, percent: 18, color: "#ea580c" },
  { reason: "Turnover Below Required Threshold", count: 12, percent: 15, color: "#f59e0b" },
  { reason: "Expired Statutory Certificate", count: 9, percent: 11, color: "#7c3aed" },
  { reason: "OEM Authorization Not Submitted", count: 8, percent: 10, color: "#2563eb" },
  { reason: "Debarment/Blacklisting Record Found", count: 3, percent: 4, color: "#991b1b" }
];

const VERIFICATION_TIME = [
  { day: "Mon", hours: 4.2 },
  { day: "Tue", hours: 3.8 },
  { day: "Wed", hours: 5.1 },
  { day: "Thu", hours: 4.6 },
  { day: "Fri", hours: 3.9 },
  { day: "Sat", hours: 2.1 },
  { day: "Sun", hours: 1.8 }
];

const DOC_TYPES = [
  { name: "GST Registration Certificate", submitted: 326, verified: 311, issues: 15, successRate: "95.4%" },
  { name: "Income Tax PAN Card Copy", submitted: 326, verified: 319, issues: 7, successRate: "97.8%" },
  { name: "Audited Financial Balance Sheets", submitted: 326, verified: 298, issues: 28, successRate: "91.4%" },
  { name: "Experience Certificate (Refinery Works)", submitted: 289, verified: 274, issues: 15, successRate: "94.8%" },
  { name: "OEM Manufacturer Authorization", submitted: 145, verified: 128, issues: 17, successRate: "88.2%" },
  { name: "MSME Udyam Certificate", submitted: 218, verified: 201, issues: 17, successRate: "92.2%" },
  { name: "EPFO Statutory Compliance Certificate", submitted: 291, verified: 280, issues: 11, successRate: "96.2%" }
];

export default function ReportsAnalytics({ onNavigate }) {
  const { showToast } = useToast();
  const [dateRange, setDateRange] = useState("This Month");
  const [tenderFilter, setTenderFilter] = useState("All Tenders");
  const [regionFilter, setRegionFilter] = useState("All Regions");

  // Custom Report Generator Modal State (Section 28)
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [reportScope, setReportScope] = useState("All Active CPCL Tenders");
  const [reportFormat, setReportFormat] = useState("PDF Institutional Dossier");
  const [reportTimeframe, setReportTimeframe] = useState("FY 2025-26");
  const [includedSections, setIncludedSections] = useState({
    compliance: true,
    throughput: true,
    risk: true,
    rejections: true,
    sovereignAPIs: true,
    auditTrail: true
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportPDF = () => {
    showToast({
      type: "info",
      title: "Generating Institutional Analytics PDF",
      message: "Rendering analytics report for official executive sign-off..."
    });
    setTimeout(() => {
      window.print();
      showToast({
        type: "success",
        title: "Report Exported",
        message: "Analytics report sent to print / PDF export."
      });
    }, 500);
  };

  const handleExportCSV = () => {
    showToast({
      type: "info",
      title: "Exporting CSV Data",
      message: "Compiling document verification metrics..."
    });
    setTimeout(() => {
      const headers = "Document,Submitted,Verified,Issues,SuccessRate\n";
      const rows = DOC_TYPES.map((d) => `"${d.name}",${d.submitted},${d.verified},${d.issues},"${d.successRate}"\n`).join("");
      const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CPCL_Procurement_Analytics_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast({
        type: "success",
        title: "CSV Export Complete",
        message: "Data successfully exported."
      });
    }, 450);
  };

  const handleGenerateCustomReport = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    showToast({
      type: "info",
      title: "Compiling Custom Report",
      message: `Assembling ${reportScope} dossier (${reportFormat})...`
    });

    setTimeout(() => {
      setIsGenerating(false);
      setShowGenerateModal(false);

      // Create downloadable mock dossier file
      const content = `CPCL PROCUREMENT INTELLIGENCE PLATFORM — INSTITUTIONAL REPORT
Generated on: ${new Date().toLocaleString("en-IN")}
Scope: ${reportScope}
Timeframe: ${reportTimeframe}
Format: ${reportFormat}

==================================================
1. STATUTORY COMPLIANCE SUMMARY
Total Enrolled Bidders: 326
Average Compliance Rate: 87.4%
Clean Sovereign Pass Rate: 74%
Cases Requiring Clarification: 85
Non-Compliant Rejections: 42

2. INCLUDED MODULES
${includedSections.compliance ? "✓ Compliance Progression & Trend Analysis\n" : ""}${includedSections.throughput ? "✓ Verification Pipeline Throughput\n" : ""}${includedSections.risk ? "✓ Contractor Risk Distribution Matrix\n" : ""}${includedSections.rejections ? "✓ Rejection Root Cause Taxonomy\n" : ""}${includedSections.sovereignAPIs ? "✓ Sovereign Gateway Latency & Uptime Logs\n" : ""}${includedSections.auditTrail ? "✓ Cryptographic SHA-256 Audit Log\n" : ""}
==================================================
CONFIDENTIAL — MINISTRY OF PETROLEUM & NATURAL GAS`;

      const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CPCL_Executive_Report_${reportTimeframe.replace(/\s+/g, "_")}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      showToast({
        type: "success",
        title: "Report Generated",
        message: `Dossier downloaded: CPCL_Executive_Report_${reportTimeframe.replace(/\s+/g, "_")}.txt`
      });
    }, 900);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* ─── PAGE HEADER & CONTROLS (Section 28) ───────────────────────────── */}
      <PageHeader
        title="Reports & Analytics"
        subtitle="Track compliance, risk, and verification performance across CPCL tenders."
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="form-input"
            style={{ width: "auto", fontSize: "12.5px" }}
          >
            <option>This Month</option>
            <option>Last 3 Months</option>
            <option>FY 2025-26</option>
          </select>

          <select
            value={tenderFilter}
            onChange={(e) => setTenderFilter(e.target.value)}
            className="form-input"
            style={{ width: "auto", fontSize: "12.5px" }}
          >
            <option>All Tenders</option>
            <option>Supply of Industrial Valves</option>
            <option>ESD Systems & Accessories</option>
            <option>Refinery Maintenance</option>
          </select>

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="form-input"
            style={{ width: "auto", fontSize: "12.5px" }}
          >
            <option>All Regions</option>
            <option>North</option>
            <option>West</option>
            <option>South</option>
            <option>East</option>
          </select>

          <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
            <Download size={13} /> Export CSV
          </button>
          <button onClick={handleExportPDF} className="btn btn-secondary btn-sm">
            <Printer size={13} /> Print PDF
          </button>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="btn btn-primary btn-sm"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <FileText size={13} /> Generate Report
          </button>
        </div>
      </PageHeader>

      {/* ─── ROW 1: COMPLIANCE TREND & VERIFICATION THROUGHPUT ─────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px" }}>
        {/* Chart 1: Compliance Trend */}
        <div className="saas-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div>
              <h4 className="card-title">Compliance Trend (Monthly Progression)</h4>
              <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                Percentage of submissions satisfying statutory requirements
              </p>
            </div>
            <span className="badge badge-green">+6% Improvement</span>
          </div>

          <div style={{ height: "230px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_COMPLIANCE_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="complianceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`${val}% Compliance`, "Adherence"]}
                  contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }}
                />
                <Area type="monotone" dataKey="rate" stroke="#1d4ed8" strokeWidth={2.5} fillOpacity={1} fill="url(#complianceGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Verification Throughput */}
        <div className="saas-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div>
              <h4 className="card-title">Verification Throughput</h4>
              <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                Daily documents processed by AI vs officer sign-offs
              </p>
            </div>
            <span className="badge badge-blue">314 Docs / Week</span>
          </div>

          <div style={{ height: "230px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VERIFICATION_THROUGHPUT} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                <Bar dataKey="aiProcessed" name="AI Extracted" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                <Bar dataKey="officerApproved" name="Officer Signed" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── ROW 2: AI CONFIDENCE, RISK DISTRIBUTION, CYCLE TIME ──────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
        {/* Chart 3: AI Confidence Distribution */}
        <div className="saas-card" style={{ padding: "18px 20px" }}>
          <h4 className="card-title" style={{ marginBottom: "4px" }}>AI Confidence Distribution</h4>
          <p style={{ fontSize: "11.5px", color: "#64748b", marginBottom: "14px" }}>
            Confidence scores across all OCR extractions
          </p>

          <div style={{ height: "180px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={AI_CONFIDENCE_DIST} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="range" tick={{ fontSize: 11, fill: "#334155" }} axisLine={false} tickLine={false} width={65} />
                <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {AI_CONFIDENCE_DIST.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Risk Distribution */}
        <div className="saas-card" style={{ padding: "18px 20px" }}>
          <h4 className="card-title" style={{ marginBottom: "4px" }}>Risk Distribution</h4>
          <p style={{ fontSize: "11.5px", color: "#64748b", marginBottom: "14px" }}>
            Total contractor risk profile categorization
          </p>

          <div style={{ height: "180px", display: "flex", alignItems: "center" }}>
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie data={RISK_PIE_DATA} innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                  {RISK_PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>

            <div style={{ width: "40%", display: "flex", flexDirection: "column", gap: "6px" }}>
              {RISK_PIE_DATA.map((r) => (
                <div key={r.name} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: r.color }} />
                  <span style={{ color: "#334155" }}>{r.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 6: Verification Cycle Time */}
        <div className="saas-card" style={{ padding: "18px 20px" }}>
          <h4 className="card-title" style={{ marginBottom: "4px" }}>Verification Cycle Time</h4>
          <p style={{ fontSize: "11.5px", color: "#64748b", marginBottom: "14px" }}>
            Average hours from upload to officer approval
          </p>

          <div style={{ height: "180px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VERIFICATION_TIME} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(val) => [`${val} Hours`, "Avg Turnaround"]} contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="hours" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── ROW 3: TOP NON-COMPLIANCE REASONS (Section 20) ────────────────── */}
      <div className="saas-card" style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div>
            <h4 className="card-title">Root Causes of Bid Non-Compliance</h4>
            <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
              Categorized reasons for rejection or technical disqualification during technical review
            </p>
          </div>
          <span className="badge badge-red">84 Total Defects</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {REJECTION_REASONS.map((reason, idx) => (
            <div key={idx} style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#0f172a" }}>{reason.reason}</span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: reason.color }}>{reason.count} cases ({reason.percent}%)</span>
              </div>
              <div style={{ height: "6px", background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ width: `${reason.percent * 2.5}%`, height: "100%", background: reason.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── ROW 4: DOCUMENT TYPE SUCCESS RATES TABLE ──────────────────────── */}
      <div className="saas-table-container">
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
          <h4 className="card-title">Document Processing & Sovereign API Success Rates</h4>
        </div>
        <table className="saas-table">
          <thead>
            <tr>
              <th>Statutory Document Type</th>
              <th>Total Submissions</th>
              <th>Verified Clean</th>
              <th>Flagged Issues</th>
              <th style={{ textAlign: "right" }}>Success Rate</th>
            </tr>
          </thead>
          <tbody>
            {DOC_TYPES.map((doc, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600, color: "#0f172a" }}>{doc.name}</td>
                <td>{doc.submitted}</td>
                <td style={{ color: "#16a34a", fontWeight: 600 }}>{doc.verified}</td>
                <td style={{ color: doc.issues > 0 ? "#dc2626" : "#64748b", fontWeight: 600 }}>{doc.issues}</td>
                <td style={{ textAlign: "right" }}>
                  <span className="badge badge-green">{doc.successRate}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── CUSTOM REPORT GENERATION MODAL (Section 28) ──────────────────── */}
      {showGenerateModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 110,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20
          }}
          onClick={() => setShowGenerateModal(false)}
        >
          <div
            className="anim-modal"
            style={{
              width: "100%",
              maxWidth: 580,
              background: "#ffffff",
              borderRadius: 14,
              padding: "24px",
              boxShadow: "var(--shadow-modal)",
              border: "1px solid #e2e8f0"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Generate Custom Institutional Report
                </h3>
                <p style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                  Configure analytical dimensions and export official compliance dossier
                </p>
              </div>
              <button
                onClick={() => setShowGenerateModal(false)}
                style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateCustomReport} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                    Tender Scope
                  </label>
                  <select
                    className="saas-select"
                    value={reportScope}
                    onChange={(e) => setReportScope(e.target.value)}
                    style={{ width: "100%" }}
                  >
                    <option>All Active CPCL Tenders</option>
                    <option>Supply of Industrial Valves (CPCL/VALVE/2025/001)</option>
                    <option>ESD Systems & Accessories (CPCL/ESD/2025/042)</option>
                    <option>Refinery Maintenance (CPCL/MNT/2025/063)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                    Timeframe
                  </label>
                  <select
                    className="saas-select"
                    value={reportTimeframe}
                    onChange={(e) => setReportTimeframe(e.target.value)}
                    style={{ width: "100%" }}
                  >
                    <option>FY 2025-26</option>
                    <option>Last 3 Months (Q2)</option>
                    <option>Current Month</option>
                    <option>Historical All-Time</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Export Document Format
                </label>
                <select
                  className="saas-select"
                  value={reportFormat}
                  onChange={(e) => setReportFormat(e.target.value)}
                  style={{ width: "100%" }}
                >
                  <option>PDF Institutional Dossier (Printable Sign-Off Package)</option>
                  <option>CSV Raw Verification Data (Full Spreadsheet Audit)</option>
                  <option>Cryptographic Sealed Archive (.ZIP with SHA-256 Hashes)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 8 }}>
                  Sections to Include in Export
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12.5, color: "#0f172a" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={includedSections.compliance}
                      onChange={(e) => setIncludedSections({ ...includedSections, compliance: e.target.checked })}
                    />
                    Compliance Progression & Trends
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={includedSections.throughput}
                      onChange={(e) => setIncludedSections({ ...includedSections, throughput: e.target.checked })}
                    />
                    Daily Verification Throughput
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={includedSections.risk}
                      onChange={(e) => setIncludedSections({ ...includedSections, risk: e.target.checked })}
                    />
                    Contractor Risk Matrix
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={includedSections.rejections}
                      onChange={(e) => setIncludedSections({ ...includedSections, rejections: e.target.checked })}
                    />
                    Rejection Root Cause Taxonomy
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={includedSections.sovereignAPIs}
                      onChange={(e) => setIncludedSections({ ...includedSections, sovereignAPIs: e.target.checked })}
                    />
                    Sovereign Gateway Uptime Logs
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={includedSections.auditTrail}
                      onChange={(e) => setIncludedSections({ ...includedSections, auditTrail: e.target.checked })}
                    />
                    Cryptographic Audit Trail
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="btn btn-secondary btn-sm"
                  disabled={isGenerating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={isGenerating}
                >
                  {isGenerating ? "Compiling Dossier..." : "Generate & Download Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
