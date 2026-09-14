"use client";
import React, { useState, useMemo } from "react";
import {
  AlertTriangle,
  Eye,
  Download,
  ShieldAlert,
  X,
  CheckCircle,
  Filter,
  ArrowRight,
  RefreshCw,
  Building2
} from "lucide-react";
import { BIDDERS } from "@/lib/data";
import { useToast } from "@/components/common/ToastProvider";
import PageHeader from "@/components/common/PageHeader";

const RISK_MATRIX = [
  {
    tier: "Low",
    label: "Low Risk",
    count: 158,
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    desc: "All statutory criteria verified against sovereign APIs with zero discrepancy flags."
  },
  {
    tier: "Medium",
    label: "Medium Risk",
    count: 86,
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    desc: "Minor corporate name variations or low OCR quality; manual review recommended."
  },
  {
    tier: "High",
    label: "High Risk",
    count: 52,
    color: "#ea580c",
    bg: "#fff7ed",
    border: "#fed7aa",
    desc: "Missing mandatory OEM authorizations or turnover below required threshold."
  },
  {
    tier: "Critical",
    label: "Critical Risk",
    count: 30,
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    desc: "CERSAI historical debarment records or PAN-GSTIN statutory identity mismatch."
  }
];

const RISK_FACTORS = [
  { factor: "Missing Mandatory Documents", count: 28, severity: "High", color: "#ea580c" },
  { factor: "GST/PAN Name Mismatch", count: 14, severity: "Critical", color: "#dc2626" },
  { factor: "Turnover Below Required Threshold", count: 12, severity: "High", color: "#ea580c" },
  { factor: "Expired Statutory Certificates", count: 9, severity: "Medium", color: "#d97706" },
  { factor: "OEM Authorization Not Submitted", count: 8, severity: "High", color: "#ea580c" },
  { factor: "Debarment/Blacklisting Record Found", count: 3, severity: "Critical", color: "#dc2626" },
  { factor: "OCR Low Confidence (<70%)", count: 18, severity: "Medium", color: "#d97706" },
  { factor: "Government API Gateway Timeout", count: 6, severity: "High", color: "#ea580c" }
];

export default function RiskAnalysis({ onNavigate, initialTier }) {
  const { showToast } = useToast();
  const [selectedTier, setSelectedTier] = useState(initialTier || "All");
  const [selectedFactor, setSelectedFactor] = useState(null);

  const filteredBidders = useMemo(() => {
    return BIDDERS.filter((b) => {
      const matchesTier = selectedTier === "All" || b.riskLevel.toLowerCase() === selectedTier.toLowerCase();
      const matchesFactor =
        !selectedFactor ||
        (b.issues && b.issues.some((i) => i.toLowerCase().includes(selectedFactor.toLowerCase().split(" ")[0])));
      return matchesTier && matchesFactor;
    });
  }, [selectedTier, selectedFactor]);

  const handleGenerateReport = () => {
    showToast({
      type: "info",
      title: "Generating Institutional Risk Report",
      message: "Aggregating contractor risk scores, debarment flags, and compliance shortfalls..."
    });
    setTimeout(() => {
      showToast({
        type: "success",
        title: "Risk Report Generated",
        message: "Institutional procurement risk dossier exported to downloads."
      });
    }, 600);
  };

  const handleReviewCase = (bidder) => {
    onNavigate("document-verification");
    showToast({
      type: "info",
      title: `Opening Case Review: ${bidder.name}`,
      message: `Navigating to Document Verification workspace for ${bidder.tender}...`
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Header */}
      <PageHeader
        title="Risk Analysis & Fraud Surveillance"
        subtitle="Multi-dimensional risk scoring, fraud surveillance, and statutory debarment indexing."
      >
        <div style={{ display: "flex", gap: "8px" }}>
          {selectedTier !== "All" && (
            <button
              onClick={() => setSelectedTier("All")}
              className="btn btn-secondary btn-sm"
            >
              Reset Tier Filter
            </button>
          )}
          <button
            onClick={handleGenerateReport}
            className="btn btn-primary btn-sm"
          >
            <Download size={13} /> Generate Risk Report
          </button>
        </div>
      </PageHeader>

      {/* ─── TOP: 4 RISK OVERVIEW CARDS (INTERACTIVE FILTER) (Section 19) ───── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "12px"
        }}
      >
        {RISK_MATRIX.map((r) => {
          const isSelected = selectedTier.toLowerCase() === r.tier.toLowerCase();

          return (
            <div
              key={r.tier}
              onClick={() => setSelectedTier(isSelected ? "All" : r.tier)}
              className="saas-card saas-card-hover"
              style={{
                padding: "16px 18px",
                cursor: "pointer",
                border: isSelected ? `2px solid ${r.color}` : "1px solid #e2e8f0",
                background: isSelected ? r.bg : "#ffffff",
                borderTop: `4px solid ${r.color}`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                    {r.label}
                  </span>
                  {isSelected && (
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        background: r.color,
                        color: "#ffffff",
                        padding: "1px 6px",
                        borderRadius: 99
                      }}
                    >
                      Active Filter
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: r.color, lineHeight: 1.1 }}>
                  {r.count}
                </div>
                <p style={{ fontSize: "11.5px", color: "#64748b", marginTop: "6px", lineHeight: 1.4 }}>
                  {r.desc}
                </p>
              </div>

              <div style={{ marginTop: "12px" }}>
                <div style={{ height: "4px", background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${(r.count / 326) * 100}%`,
                      background: r.color
                    }}
                  />
                </div>
                <div style={{ fontSize: "10.5px", color: r.color, fontWeight: 600, marginTop: "4px" }}>
                  {Math.round((r.count / 326) * 100)}% of total bidders (Click to filter)
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── MIDDLE: RISK DISTRIBUTION & RISK FACTORS ──────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px"
        }}
      >
        {/* Risk Distribution Breakdown */}
        <div className="saas-card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h4 className="card-title">Risk Distribution Across Active Bids</h4>
            <span style={{ fontSize: "11.5px", color: "#64748b" }}>326 Contractor Profiles</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {RISK_MATRIX.map((rm) => {
              const pct = Math.round((rm.count / 326) * 100);
              return (
                <div key={rm.tier} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                    <span style={{ fontWeight: 600, color: "#334155" }}>{rm.label}</span>
                    <span style={{ fontWeight: 700, color: rm.color }}>
                      {rm.count} Bidders ({pct}%)
                    </span>
                  </div>
                  <div style={{ height: "8px", background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: rm.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk Factors Breakdown */}
        <div className="saas-card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h4 className="card-title">Identified Risk Factors</h4>
            {selectedFactor && (
              <button
                onClick={() => setSelectedFactor(null)}
                style={{ fontSize: "11px", color: "#1d4ed8", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
              >
                Clear Factor Filter
              </button>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "200px", overflowY: "auto" }}>
            {RISK_FACTORS.map((rf, idx) => {
              const isFactActive = selectedFactor === rf.factor;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedFactor(isFactActive ? null : rf.factor)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    background: isFactActive ? "#f0f7ff" : "#f8fafc",
                    border: isFactActive ? "1px solid #bfdbfe" : "1px solid #f1f5f9",
                    cursor: "pointer",
                    transition: "all 0.12s"
                  }}
                >
                  <span style={{ fontSize: "12px", color: "#334155", fontWeight: isFactActive ? 600 : 400 }}>
                    {rf.factor}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "11.5px", fontWeight: 700, color: rf.color }}>
                      {rf.count} cases
                    </span>
                    <span
                      className={`badge ${
                        rf.severity === "Critical"
                          ? "badge-red"
                          : rf.severity === "High"
                          ? "badge-amber"
                          : "badge-gray"
                      }`}
                      style={{ fontSize: "10px", padding: "1px 5px" }}
                    >
                      {rf.severity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── BOTTOM: HIGH RISK BIDDERS DATA TABLE (Section 19) ──────────────── */}
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
            <h3 className="section-title">
              {selectedTier === "All" ? "High-Risk Bidders Directory" : `${selectedTier}-Risk Bidders`}
            </h3>
            <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
              Contractor entities flagged for manual scrutiny prior to technical bid opening
            </p>
          </div>
          <span className="badge badge-gray">{filteredBidders.length} Entities</span>
        </div>

        <table className="saas-table">
          <thead>
            <tr>
              <th>Bidder Entity</th>
              <th>GSTIN / PAN</th>
              <th>Enrolled Tender</th>
              <th>Compliance Score</th>
              <th>Risk Level</th>
              <th>Identified Issues</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBidders.map((b) => (
              <tr key={b.id} className="interactive-row" onClick={() => onNavigate("bidders")}>
                <td>
                  <div>
                    <div style={{ fontWeight: 600, color: "#0f172a" }}>{b.name}</div>
                    <div style={{ fontSize: "11.5px", color: "#64748b" }}>{b.type} · {b.state}</div>
                  </div>
                </td>
                <td>
                  <div style={{ fontFamily: "monospace", fontSize: "12px", color: "#334155" }}>{b.gstin}</div>
                  <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#94a3b8" }}>PAN: {b.pan}</div>
                </td>
                <td style={{ fontSize: "12px", color: "#475569" }}>{b.tender}</td>
                <td>
                  <span style={{ fontWeight: 700, color: b.complianceScore >= 80 ? "#16a34a" : "#dc2626" }}>
                    {b.complianceScore}%
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      b.riskLevel === "Low"
                        ? "badge-green"
                        : b.riskLevel === "Medium"
                        ? "badge-amber"
                        : "badge-red"
                    }`}
                  >
                    {b.riskLevel} Risk
                  </span>
                </td>
                <td>
                  {b.issues && b.issues.length > 0 ? (
                    <span style={{ fontSize: "12px", color: "#dc2626", fontWeight: 500 }}>
                      {b.issues[0]}
                    </span>
                  ) : (
                    <span style={{ fontSize: "12px", color: "#16a34a" }}>No active issues</span>
                  )}
                </td>
                <td style={{ textAlign: "right" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReviewCase(b);
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    Review Case
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
