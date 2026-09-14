"use client";
import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  MinusCircle,
  ChevronDown,
  ChevronUp,
  Scale,
  ShieldCheck,
  Building2,
  FileText,
  Download,
  Check,
  ExternalLink,
  HelpCircle,
  Sparkles
} from "lucide-react";
import { BIDDERS } from "@/lib/data";
import { useToast } from "@/components/common/ToastProvider";
import PageHeader from "@/components/common/PageHeader";

const REQUIREMENTS = [
  {
    id: "R001",
    name: "Minimum Annual Turnover",
    category: "Financial",
    requirement: "≥ ₹5.0 Crore (average of last 3 FY)",
    detected: "₹7.2 Crore (3-Yr Average)",
    rule: "turnover_avg >= 5.0 && ca_signed === true",
    result: "PASS",
    evidence: "ITR FY2024, Turnover CA Certificate",
    source: "MCA21 & Audited Balance Sheets",
    confidence: 98,
    mandatory: true,
    explanation:
      "Bidder demonstrates a 3-year average turnover of ₹7.2 Cr across FY22, FY23, and FY24, exceeding the minimum ₹5.0 Cr requirement by 44%. Verified against CA UDIN registry."
  },
  {
    id: "R002",
    name: "GST Registration Status",
    category: "Statutory",
    requirement: "Active GSTIN with regular filing history",
    detected: "Active (27AABCA1234A1Z5)",
    rule: "gst_status === 'Active' && return_filing_defaulter === false",
    result: "PASS",
    evidence: "GSTN API Live Query Response",
    source: "GSTN Sovereign Portal Gateway",
    confidence: 100,
    mandatory: true,
    explanation:
      "Entity GSTIN is active in Maharashtra jurisdiction with GSTR-3B filings verified through the last quarter. Zero defaulter record."
  },
  {
    id: "R003",
    name: "PAN Registration & Legal Match",
    category: "Statutory",
    requirement: "Valid PAN matching corporate certificate name",
    detected: "AABCA1234A — 100% Legal Match",
    rule: "pan_verified === true && string_match >= 0.95",
    result: "PASS",
    evidence: "NSDL Income Tax API Payload",
    source: "Income Tax Department PAN API",
    confidence: 100,
    mandatory: true,
    explanation:
      "Corporate entity name on PAN records matches submitted Certificate of Incorporation with 100% exact string similarity."
  },
  {
    id: "R004",
    name: "OEM Manufacturer Authorization",
    category: "Technical",
    requirement: "Valid Manufacturer Authorization from OEM",
    detected: "Distributor Agreement (Missing OEM Letter)",
    rule: "document_present === true && expiry_date >= tender_end + 90",
    result: "FAIL",
    evidence: "Tender document index scan",
    source: "Technical Proposal Submission Pack",
    confidence: 96,
    mandatory: true,
    explanation:
      "Bidder submitted a generic regional distributor agreement instead of the mandatory OEM Authorization letter for valve actuation systems naming CPCL."
  },
  {
    id: "R005",
    name: "Make in India Sovereign Preference",
    category: "Policy",
    requirement: "Class-I (≥50%) or Class-II (≥20%) local content",
    detected: "Class-II Certified (38% Local Content)",
    rule: "local_content_percentage >= 20.0",
    result: "PASS",
    evidence: "Chartered Engineer Local Content Certificate",
    source: "Public Procurement (Make in India) Guidelines",
    confidence: 95,
    mandatory: false,
    explanation:
      "Bidder fulfills Class-II supplier criteria with 38% domestic value addition at their Pune fabrication facility."
  },
  {
    id: "R006",
    name: "Prior Petroleum PSU Experience",
    category: "Technical",
    requirement: "Minimum 3+ years supplying refinery valves",
    detected: "4.5 years documented PSU supply orders",
    rule: "experience_years >= 3.0",
    result: "PASS",
    evidence: "CPCL and IOCL purchase order completion certificates",
    source: "Refinery Purchase Order Archives",
    confidence: 91,
    mandatory: true,
    explanation:
      "Bidder successfully completed 2 high-pressure valve maintenance contracts for Indian Oil Corporation in FY22 and FY23."
  },
  {
    id: "R007",
    name: "MSME Udyam Registration",
    category: "Statutory",
    requirement: "Valid MSME Udyam Certificate",
    detected: "Trade name minor variation ('Pvt' omitted)",
    rule: "udyam_name_match >= 0.90",
    result: "REVIEW",
    evidence: "Udyam Certificate vs PAN record",
    source: "Ministry of MSME Udyam Registry",
    confidence: 74,
    mandatory: false,
    explanation:
      "Udyam certificate spells entity as 'ABC Engineering Ltd' omitting 'Pvt'. Requires officer clarification query."
  },
  {
    id: "R008",
    name: "Debarment & Blacklisting Clearance",
    category: "Statutory",
    requirement: "Not debarred or blacklisted by any PSU/Ministry",
    detected: "Zero debarment flags found across PSUs",
    rule: "blacklisted === false && cersai_flag === false",
    result: "PASS",
    evidence: "CERSAI Central Registry & GeM Incident Reports",
    source: "CERSAI Central Registry API",
    confidence: 99,
    mandatory: true,
    explanation:
      "No strike-off, blacklisting, or vigilance inquiry found against bidder entity or primary directors."
  }
];

const RESULT_CONFIG = {
  PASS: { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0", icon: CheckCircle, label: "PASS" },
  FAIL: { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca", icon: XCircle, label: "FAIL" },
  REVIEW: { bg: "#fffbeb", text: "#b45309", border: "#fde68a", icon: AlertCircle, label: "REVIEW" }
};

export default function ComplianceChecks({ onNavigate, initialBidder }) {
  const { showToast } = useToast();
  const [selectedBidderName, setSelectedBidderName] = useState(
    initialBidder || BIDDERS[0]?.name || "ABC Engineering Pvt Ltd"
  );
  const [expandedRowId, setExpandedRowId] = useState("R004");
  const [officerNotes, setOfficerNotes] = useState({});

  const passCount = REQUIREMENTS.filter((r) => r.result === "PASS").length;
  const failCount = REQUIREMENTS.filter((r) => r.result === "FAIL").length;
  const reviewCount = REQUIREMENTS.filter((r) => r.result === "REVIEW").length;
  const complianceScore = Math.round((passCount / REQUIREMENTS.length) * 100);

  const toggleRow = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const handleSaveNote = (reqId) => {
    showToast({
      type: "success",
      title: "Officer Note Saved",
      message: `Verification rationale recorded for ${reqId} into immutable audit trail.`
    });
  };

  const handleExportComplianceReport = () => {
    showToast({
      type: "info",
      title: "Generating Compliance Dossier",
      message: `Compiling statutory verification proofs for ${selectedBidderName}...`
    });
    setTimeout(() => {
      showToast({
        type: "success",
        title: "Dossier Export Complete",
        message: "Executive compliance report downloaded."
      });
    }, 600);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Header */}
      <PageHeader
        title="Compliance Checks"
        subtitle="Transparent evaluation of bidder documents against deterministic rules and sovereign registries."
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <select
            value={selectedBidderName}
            onChange={(e) => setSelectedBidderName(e.target.value)}
            className="form-input"
            style={{ width: "auto", fontSize: "13px", fontWeight: 600 }}
          >
            {BIDDERS.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name} ({b.complianceScore}% Match)
              </option>
            ))}
          </select>

          <button
            onClick={handleExportComplianceReport}
            className="btn btn-primary btn-sm"
          >
            <Download size={13} /> Export Report
          </button>
        </div>
      </PageHeader>

      {/* Top Metric Cards Bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "12px"
        }}
      >
        <div className="saas-card" style={{ padding: "16px" }}>
          <div style={{ fontSize: "11.5px", color: "#64748b" }}>Overall Adherence</div>
          <div style={{ fontSize: "26px", fontWeight: 800, color: complianceScore >= 80 ? "#16a34a" : "#d97706", marginTop: "2px" }}>
            {complianceScore}%
          </div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
            {passCount} of {REQUIREMENTS.length} requirements passed
          </div>
        </div>

        <div className="saas-card" style={{ padding: "16px" }}>
          <div style={{ fontSize: "11.5px", color: "#64748b" }}>Verified Criteria</div>
          <div style={{ fontSize: "26px", fontWeight: 800, color: "#16a34a", marginTop: "2px" }}>
            {passCount}
          </div>
          <div style={{ fontSize: "11px", color: "#16a34a", marginTop: "4px" }}>
            ✓ Deterministic rules fulfilled
          </div>
        </div>

        <div className="saas-card" style={{ padding: "16px" }}>
          <div style={{ fontSize: "11.5px", color: "#64748b" }}>Failed Conditions</div>
          <div style={{ fontSize: "26px", fontWeight: 800, color: "#dc2626", marginTop: "2px" }}>
            {failCount}
          </div>
          <div style={{ fontSize: "11px", color: "#dc2626", marginTop: "4px" }}>
            Missing mandatory OEM authorization
          </div>
        </div>

        <div className="saas-card" style={{ padding: "16px" }}>
          <div style={{ fontSize: "11.5px", color: "#64748b" }}>Clarifications Pending</div>
          <div style={{ fontSize: "26px", fontWeight: 800, color: "#d97706", marginTop: "2px" }}>
            {reviewCount}
          </div>
          <div style={{ fontSize: "11px", color: "#d97706", marginTop: "4px" }}>
            Trade name minor variation
          </div>
        </div>
      </div>

      {/* ─── EXPANDABLE REQUIREMENT ROWS TABLE (Section 17) ───────────────── */}
      <div className="saas-table-container">
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid #e2e8f0",
            background: "#f8fafc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <h3 className="section-title">Evaluation Breakdown: {selectedBidderName}</h3>
            <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
              Click any row to expand validation rules, evidence sources, and AI detection details
            </p>
          </div>
          <span style={{ fontSize: "11.5px", color: "#64748b" }}>8 Criteria Evaluated</span>
        </div>

        <table className="saas-table">
          <thead>
            <tr>
              <th style={{ width: "220px" }}>Requirement</th>
              <th style={{ width: "110px" }}>Category</th>
              <th>Required Criteria</th>
              <th>Detected Value</th>
              <th style={{ width: "100px" }}>Result</th>
              <th style={{ width: "100px" }}>Confidence</th>
              <th style={{ width: "180px" }}>Evidence Source</th>
              <th style={{ width: "40px", textAlign: "right" }}></th>
            </tr>
          </thead>
          <tbody>
            {REQUIREMENTS.map((req) => {
              const isExpanded = expandedRowId === req.id;
              const cfg = RESULT_CONFIG[req.result] || RESULT_CONFIG.PASS;
              const ResultIcon = cfg.icon;

              return (
                <React.Fragment key={req.id}>
                  <tr
                    className="interactive-row"
                    onClick={() => toggleRow(req.id)}
                    style={{ background: isExpanded ? "#f8fafc" : undefined }}
                  >
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: 600, color: "#0f172a" }}>{req.name}</span>
                        {req.mandatory && (
                          <span
                            className="badge badge-red"
                            style={{ fontSize: "9.5px", padding: "1px 5px" }}
                          >
                            Mandatory
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-gray">{req.category}</span>
                    </td>
                    <td style={{ fontSize: "12.5px", color: "#475569" }}>{req.requirement}</td>
                    <td>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "12.5px",
                          color: req.result === "FAIL" ? "#dc2626" : "#0f172a"
                        }}
                      >
                        {req.detected}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "2px 8px",
                          borderRadius: 99,
                          fontSize: "11px",
                          fontWeight: 700,
                          background: cfg.bg,
                          color: cfg.text,
                          border: `1px solid ${cfg.border}`
                        }}
                      >
                        <ResultIcon size={12} /> {cfg.label}
                      </span>
                    </td>
                    <td>
                      <span
                        className="badge badge-purple"
                        style={{ fontSize: "11px" }}
                      >
                        {req.confidence}% AI
                      </span>
                    </td>
                    <td style={{ fontSize: "12px", color: "#64748b" }}>{req.source}</td>
                    <td style={{ textAlign: "right" }}>
                      {isExpanded ? (
                        <ChevronUp size={16} style={{ color: "#1d4ed8" }} />
                      ) : (
                        <ChevronDown size={16} style={{ color: "#94a3b8" }} />
                      )}
                    </td>
                  </tr>

                  {/* Expanded Detail Row */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={8} style={{ background: "#f8fafc", padding: "16px 20px" }}>
                        <div
                          className="saas-card"
                          style={{
                            padding: "16px 20px",
                            border: "1px solid #e2e8f0",
                            background: "#ffffff"
                          }}
                        >
                          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px" }}>
                            {/* Left: Why it passed/failed & rule */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                              <div>
                                <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                  Why this requirement {req.result.toLowerCase()}ed:
                                </div>
                                <p style={{ fontSize: "13px", color: "#0f172a", marginTop: "4px", lineHeight: 1.5 }}>
                                  {req.explanation}
                                </p>
                              </div>

                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                <div style={{ padding: "10px", background: "#f8fafc", borderRadius: "6px" }}>
                                  <div style={{ fontSize: "11px", color: "#64748b" }}>Applied Verification Rule</div>
                                  <div style={{ fontSize: "12px", fontFamily: "monospace", color: "#1d4ed8", marginTop: "2px" }}>
                                    {req.rule}
                                  </div>
                                </div>
                                <div style={{ padding: "10px", background: "#f8fafc", borderRadius: "6px" }}>
                                  <div style={{ fontSize: "11px", color: "#64748b" }}>Official Sovereign Source</div>
                                  <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#16a34a", marginTop: "2px" }}>
                                    {req.source}
                                  </div>
                                </div>
                              </div>

                              <div style={{ padding: "8px 12px", background: "#eff6ff", borderRadius: "6px", border: "1px solid #bfdbfe", fontSize: "12px", color: "#1e40af" }}>
                                <strong>Evidence Citation:</strong> {req.evidence}
                              </div>
                            </div>

                            {/* Right: Officer Note & Sign-off */}
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: "1px solid #f1f5f9", paddingLeft: "16px" }}>
                              <div>
                                <label className="form-label" style={{ fontSize: "12px" }}>
                                  Officer Evaluation Remarks for {req.id}
                                </label>
                                <textarea
                                  rows={3}
                                  value={officerNotes[req.id] || ""}
                                  onChange={(e) =>
                                    setOfficerNotes({ ...officerNotes, [req.id]: e.target.value })
                                  }
                                  placeholder="Enter official rationale or clarification request to contractor..."
                                  className="form-input"
                                  style={{ fontSize: "12px", resize: "none" }}
                                />
                              </div>

                              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                                <button
                                  onClick={() => handleSaveNote(req.id)}
                                  className="btn btn-primary btn-sm"
                                >
                                  Record Officer Sign-off
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
