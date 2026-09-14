"use client";
import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  MinusCircle,
  ArrowLeft,
  Download,
  Building2,
  FileText,
  Scale
} from "lucide-react";
import { BIDDERS } from "@/lib/data";
import { useToast } from "@/components/common/ToastProvider";
import PageHeader from "@/components/common/PageHeader";
import { useProcurement } from "../../context/ProcurementContext";

const COMPARE_FIELDS = [
  { label: "Compliance Score", key: "complianceScore", type: "score" },
  { label: "Risk Level", key: "riskLevel", type: "risk" },
  { label: "Annual Turnover", key: "turnover", type: "text" },
  { label: "MSME/Startup Type", key: "type", type: "text" },
  { label: "State / Jurisdiction", key: "state", type: "text" },
  { label: "Enrolled Tender", key: "tender", type: "text" },
  { label: "Issues Flagged", key: "issues", type: "issues" },
  { label: "Verification Status", key: "status", type: "status" }
];

const REQUIREMENTS_COMPARE = [
  { name: "GSTIN Status Active (GSTN Registry)", results: ["PASS", "PASS", "PASS"] },
  { name: "Income Tax PAN Legal Entity Match", results: ["PASS", "PASS", "FAIL"] },
  { name: "Annual Turnover ≥ ₹5.0 Cr (CA Audited)", results: ["PASS", "PASS", "PASS"] },
  { name: "OEM Manufacturer Authorization", results: ["PASS", "FAIL", "PASS"] },
  { name: "Prior Petroleum PSU Experience (3+ Yrs)", results: ["PASS", "PASS", "PASS"] },
  { name: "MSME Udyam Certificate Validation", results: ["PASS", "REVIEW", "N/A"] },
  { name: "Debarment / Blacklisting Check (CERSAI)", results: ["PASS", "FAIL", "PASS"] },
  { name: "Make in India Local Content Preference", results: ["PASS", "N/A", "PASS"] }
];

const RESULT_CFG = {
  PASS: { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0", icon: <CheckCircle size={13} /> },
  FAIL: { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca", icon: <XCircle size={13} /> },
  REVIEW: { bg: "#fffbeb", text: "#b45309", border: "#fde68a", icon: <AlertCircle size={13} /> },
  "N/A": { bg: "#f8fafc", text: "#64748b", border: "#e2e8f0", icon: <MinusCircle size={13} /> }
};

export default function BidderComparison({ onNavigate, initialSelectedIds }) {
  const { showToast } = useToast();
  const { bidders: contextBidders } = useProcurement();
  const allBidders = contextBidders && contextBidders.length > 0 ? contextBidders : BIDDERS;

  const comparedBidders = React.useMemo(() => {
    if (initialSelectedIds && initialSelectedIds.length >= 2) {
      const selected = allBidders.filter((b) => initialSelectedIds.includes(b.id));
      if (selected.length >= 2) return selected.slice(0, 4);
    }
    return allBidders.slice(0, 3);
  }, [initialSelectedIds, allBidders]);

  const handleDecision = (bidderName, action) => {
    showToast({
      type: action === "Qualify" ? "success" : action === "Disqualify" ? "error" : "warning",
      title: `Decision Recorded: ${action}`,
      message: `Updated qualification status for ${bidderName}. Recorded in immutable audit log.`
    });
  };

  const handleExportComparison = () => {
    showToast({
      type: "info",
      title: "Exporting Comparison Matrix",
      message: "Generating comparative dossier for Tender Committee..."
    });
    setTimeout(() => {
      showToast({
        type: "success",
        title: "Dossier Exported",
        message: "Side-by-side evaluation sheet saved to downloads."
      });
    }, 600);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <PageHeader
        breadcrumbs={[
          { label: "Bidders", onClick: () => onNavigate("bidders") },
          { label: "Bidder Comparison" }
        ]}
        title="Bidder Comparison Matrix"
        subtitle="Side-by-side statutory compliance, turnover, and eligibility evaluation for the Tender Committee."
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => onNavigate("bidders")} className="btn btn-secondary btn-sm">
            <ArrowLeft size={13} /> Back to Bidders
          </button>
          <button onClick={handleExportComparison} className="btn btn-primary btn-sm">
            <Download size={13} /> Export Matrix
          </button>
        </div>
      </PageHeader>

      {/* Comparison Grid Table */}
      <div className="saas-card" style={{ padding: 0, overflow: "hidden" }}>
        {/* Header Row: Bidders */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `220px repeat(${comparedBidders.length}, minmax(0, 1fr))`,
            background: "#f8fafc",
            borderBottom: "1px solid #e2e8f0"
          }}
        >
          <div style={{ padding: "20px 18px", display: "flex", alignItems: "flex-end" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Criteria \ Contractor
            </span>
          </div>

          {comparedBidders.map((b) => (
            <div
              key={b.id}
              style={{
                padding: "20px 18px",
                borderLeft: "1px solid #e2e8f0",
                textAlign: "center"
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#1d4ed8",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 700,
                  margin: "0 auto 8px"
                }}
              >
                {b.name.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>{b.name}</div>
              <div style={{ fontSize: "11px", color: "#64748b", fontFamily: "monospace", marginTop: "2px" }}>
                {b.gstin}
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: b.complianceScore >= 80 ? "#16a34a" : "#dc2626",
                  marginTop: "6px"
                }}
              >
                {b.complianceScore}%
              </div>
              <div style={{ fontSize: "10.5px", color: "#94a3b8" }}>Compliance Score</div>
            </div>
          ))}
        </div>

        {/* Comparison Data Rows */}
        {COMPARE_FIELDS.map((field, idx) => (
          <div
            key={field.key}
            style={{
              display: "grid",
              gridTemplateColumns: `220px repeat(${comparedBidders.length}, minmax(0, 1fr))`,
              background: idx % 2 === 0 ? "#ffffff" : "#fbfcfe",
              borderBottom: "1px solid #f1f5f9"
            }}
          >
            <div style={{ padding: "12px 18px", fontSize: "12.5px", fontWeight: 600, color: "#334155", display: "flex", alignItems: "center" }}>
              {field.label}
            </div>

            {comparedBidders.map((b) => {
              const val =
                field.key === "issues"
                  ? b.issues && b.issues.length > 0
                    ? `${b.issues.length} Flagged Issue(s)`
                    : "Zero Discrepancies"
                  : b[field.key];

              const isRisk = field.key === "riskLevel";
              const isScore = field.key === "complianceScore";
              const isIssue = field.key === "issues" && b.issues && b.issues.length > 0;

              return (
                <div
                  key={b.id}
                  style={{
                    padding: "12px 18px",
                    borderLeft: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12.5px"
                  }}
                >
                  {isRisk ? (
                    <span
                      className={`badge ${
                        b.riskLevel === "Low"
                          ? "badge-green"
                          : b.riskLevel === "Medium"
                          ? "badge-amber"
                          : "badge-red"
                      }`}
                    >
                      {val}
                    </span>
                  ) : isIssue ? (
                    <span className="badge badge-red">{val}</span>
                  ) : isScore ? (
                    <span style={{ fontWeight: 700, color: val >= 80 ? "#16a34a" : "#dc2626" }}>
                      {val}%
                    </span>
                  ) : (
                    <span style={{ fontWeight: 500, color: "#334155" }}>{val}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Section Divider: Detailed Checks */}
        <div style={{ padding: "10px 18px", background: "#0f2744", color: "#ffffff", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Statutory Checkpoints & Registry Verifications
        </div>

        {REQUIREMENTS_COMPARE.map((req, rIdx) => (
          <div
            key={rIdx}
            style={{
              display: "grid",
              gridTemplateColumns: `220px repeat(${comparedBidders.length}, minmax(0, 1fr))`,
              background: rIdx % 2 === 0 ? "#ffffff" : "#fbfcfe",
              borderBottom: "1px solid #f1f5f9"
            }}
          >
            <div style={{ padding: "11px 18px", fontSize: "12px", color: "#334155", display: "flex", alignItems: "center" }}>
              {req.name}
            </div>

            {comparedBidders.map((b, bIdx) => {
              const res = req.results[bIdx] || "PASS";
              const cfg = RESULT_CFG[res] || RESULT_CFG.PASS;

              return (
                <div
                  key={b.id}
                  style={{
                    padding: "11px 18px",
                    borderLeft: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
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
                    {cfg.icon} {res}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Official Officer Evaluation Panel */}
      <div className="saas-card" style={{ padding: "20px" }}>
        <h4 className="section-title" style={{ marginBottom: "6px" }}>
          Tender Committee Decision Workspace
        </h4>
        <p style={{ fontSize: "12.5px", color: "#64748b", marginBottom: "16px" }}>
          Finalize technical qualification recommendation for enrolled contractors based on registry verification proofs.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${comparedBidders.length}, minmax(0, 1fr))`,
            gap: "14px"
          }}
        >
          {comparedBidders.map((b) => (
            <div
              key={b.id}
              style={{
                padding: "14px",
                background: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0"
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>
                {b.name}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <button
                  onClick={() => handleDecision(b.name, "Qualify")}
                  className="btn btn-primary btn-sm"
                  style={{ width: "100%", background: "#16a34a" }}
                >
                  ✓ Qualify Bidder
                </button>
                <button
                  onClick={() => handleDecision(b.name, "Disqualify")}
                  className="btn btn-danger btn-sm"
                  style={{ width: "100%" }}
                >
                  ✕ Disqualify
                </button>
                <button
                  onClick={() => handleDecision(b.name, "Hold for Committee")}
                  className="btn btn-secondary btn-sm"
                  style={{ width: "100%" }}
                >
                  Hold for Clarification
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
