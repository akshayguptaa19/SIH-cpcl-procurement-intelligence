"use client";
import React, { useState } from "react";
import {
  Brain,
  AlertTriangle,
  FileText,
  ArrowRight,
  X,
  ShieldAlert,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Download,
  Filter
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";
import PageHeader from "@/components/common/PageHeader";

const AI_FINDINGS = [
  {
    id: "AI001",
    type: "mismatch",
    severity: "critical",
    title: "PAN / GSTIN Corporate Entity Name Discrepancy",
    bidder: "Noble Industrials",
    affected: ["Noble Industrials Ltd", "XYZ Industrial Solutions Pvt Ltd"],
    tender: "CPCL/ESD/2025/042",
    confidence: 98,
    timestamp: "2 hours ago",
    explanation:
      "Statutory identity mismatch detected between PAN and GSTIN records. PAN is registered to 'Noble Industrials Ltd' while GST certificate names 'XYZ Industrial Solutions Pvt Ltd'. This indicates possible subletting of GST credentials.",
    evidence: {
      pan_record: "Noble Industrials Ltd (AABCN3456D)",
      gst_record: "XYZ Industrial Solutions Pvt Ltd (33AABCN3456D4Z8)",
      udyam_record: "Noble Industrials Ltd",
      source_files: ["PAN_Card_Copy.pdf (Page 1)", "GST_Registration_Certificate.pdf (Page 1)"]
    },
    recommendation:
      "Critically review bidder statutory identity. Issue mandatory clarification requiring formal corporate amalgamation gazette before proceeding to commercial evaluation.",
    rule: "pan_name !== gst_name → CRITICAL STATUTORY DISCREPANCY"
  },
  {
    id: "AI002",
    type: "blacklist",
    severity: "critical",
    title: "Historical PSU Debarment Record Detected",
    bidder: "Noble Industrials",
    affected: ["Noble Industrials Ltd"],
    tender: "CPCL/ESD/2025/042",
    confidence: 99,
    timestamp: "5 hours ago",
    explanation:
      "Sovereign registry scan matched bidder corporate CIN against CERSAI and Ministry of Defence central debarment archives. Order ref MOD/VIG/2022/DEB-84 shows past 2-year debarment.",
    evidence: {
      source: "CERSAI Central Debarment Registry API",
      record: "Debarred by Ministry of Defence (2022–2024)",
      status: "Debarment term completed; ongoing vigilance surveillance watch flag active",
      source_files: ["CERSAI Live Sovereign Query Response Payload #8491"]
    },
    recommendation:
      "Escalate to CPCL Legal Cell and Vigilance Directorate for formal security clearance review under MoPNG procurement integrity pact.",
    rule: "blacklist_record_exists === true → HIGH RISK SURVEILLANCE"
  },
  {
    id: "AI003",
    type: "turnover",
    severity: "high",
    title: "Unusual Financial Turnover Ratio Similarity Pattern",
    bidder: "Multi-Bidder Cluster",
    affected: ["ABC Engineering Pvt Ltd", "Precision Tools Ltd", "Shakti Enterprises"],
    tender: "CPCL/MNT/2025/063 & CPCL/VALVE/2025/001",
    confidence: 94,
    timestamp: "1 day ago",
    explanation:
      "Cross-bidder pattern analysis detected that 3 competing bidders submitted audited turnover balance sheets with a 98.2% statistical correlation in expense breakdowns and identical Chartered Accountant formatting stamps.",
    evidence: {
      correlation_metric: "98.2% mathematical correlation on revenue line items",
      flagged_entities: "ABC Engineering, Precision Tools, Shakti Enterprises",
      source_files: ["ITR FY2024 Submissions (3 Bidders)", "Audited Balance Sheet Schedules"]
    },
    recommendation:
      "Verify CA UDIN numbers on ICAI portal to rule out collusive bidding or syndicated proposal drafting across competing vendors.",
    rule: "revenue_correlation > 0.95 across competing bids → ANOMALY SURVEILLANCE"
  },
  {
    id: "AI004",
    type: "expired",
    severity: "medium",
    title: "Expired Statutory EPFO Compliance Certificate",
    bidder: "Shakti Enterprises",
    affected: ["Shakti Enterprises"],
    tender: "CPCL/INST/2025/017",
    confidence: 95,
    timestamp: "6 hours ago",
    explanation:
      "EPFO statutory labor compliance certificate expired on 31 March 2025 (163 days prior to tender closing). Current valid electronic challan return receipt missing from technical pack.",
    evidence: {
      document: "EPFO Compliance Certificate FY2024",
      expiry_date: "31 March 2025",
      evaluation_date: "10 September 2025",
      source_files: ["EPFO_Certificate_FY24.pdf (Page 1)"]
    },
    recommendation:
      "Request updated EPFO electronic challan receipt (ECR) for the latest completed calendar month.",
    rule: "certificate_expiry < tender_submission_date → STATUTORY EXPIRED"
  },
  {
    id: "AI005",
    type: "ocr",
    severity: "medium",
    title: "Low OCR Extraction Confidence (<70%) on Tax Acknowledgment",
    bidder: "Precision Tools Ltd",
    affected: ["Precision Tools Ltd"],
    tender: "CPCL/VALVE/2025/001",
    confidence: 64,
    timestamp: "1 day ago",
    explanation:
      "The uploaded ITR-V acknowledgment copy has low resolution (120 DPI) with blurred digits on the 15-digit e-filing acknowledgment number. Automated OCR extraction confidence dropped to 64%.",
    evidence: {
      document: "ITR Acknowledgement FY2024",
      defect: "Blurring on acknowledgment number field; barcode unreadable",
      source_files: ["ITR_Acknowledgement_FY24.pdf (Page 2)"]
    },
    recommendation:
      "Route document to Verification Officer for manual inspection or request authenticated DigiLocker direct document pull.",
    rule: "ocr_confidence < 0.75 → ROUTE TO HUMAN VERIFICATION"
  }
];

export default function AIInsights({ onNavigate, initialFindingId }) {
  const { showToast } = useToast();
  const [severityFilter, setSeverityFilter] = useState("All");
  const [evidenceModalFinding, setEvidenceModalFinding] = useState(
    initialFindingId ? AI_FINDINGS.find((f) => f.id === initialFindingId) || null : null
  );

  const filteredFindings = AI_FINDINGS.filter((f) => {
    return severityFilter === "All" || f.severity.toLowerCase() === severityFilter.toLowerCase();
  });

  const handleEscalate = (finding) => {
    showToast({
      type: "warning",
      title: "Case Escalated to Directorate",
      message: `AI Finding ${finding.id} (${finding.bidder}) escalated to Chief Vigilance Officer.`
    });
  };

  const handleReviewCase = (finding) => {
    onNavigate("document-verification");
    showToast({
      type: "info",
      title: "Opening Review Queue",
      message: `Navigating to Document Verification for ${finding.bidder}...`
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Header */}
      <PageHeader
        title="AI Insights & Anomaly Detection"
        subtitle="Operational intelligence, collusive bidding detection, and statutory registry discrepancies."
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => {
              showToast({
                type: "info",
                title: "Exporting AI Findings",
                message: "Downloading forensic compliance summary for CPCL vigilance..."
              });
            }}
            className="btn btn-secondary btn-sm"
          >
            <Download size={13} /> Export Findings
          </button>
        </div>
      </PageHeader>

      {/* Filter Chips */}
      <div style={{ display: "flex", gap: "4px", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
        {["All", "Critical", "High", "Medium"].map((sev) => (
          <button
            key={sev}
            onClick={() => setSeverityFilter(sev)}
            className={`pill-filter ${severityFilter === sev ? "active" : ""}`}
          >
            {sev === "All" ? "All Severities" : `${sev} Severity`}
          </button>
        ))}
      </div>

      {/* ─── OPERATIONAL INSIGHTS CARDS (Section 18) ───────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {filteredFindings.map((finding) => {
          const isCritical = finding.severity === "critical";
          const isHigh = finding.severity === "high";

          return (
            <div
              key={finding.id}
              className="saas-card"
              style={{
                padding: "20px",
                borderLeft: isCritical
                  ? "4px solid #dc2626"
                  : isHigh
                  ? "4px solid #ea580c"
                  : "4px solid #d97706"
              }}
            >
              {/* Header row: Severity, Title, Confidence, Time */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      className={`badge ${
                        isCritical ? "badge-red" : isHigh ? "badge-amber" : "badge-purple"
                      }`}
                    >
                      {finding.severity.toUpperCase()} RISK
                    </span>
                    <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
                      {finding.title}
                    </h3>
                  </div>
                  <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: "4px" }}>
                    Tender: <span style={{ fontFamily: "monospace", color: "#0f172a" }}>{finding.tender}</span> · {finding.timestamp}
                  </div>
                </div>

                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#7c3aed",
                    background: "#f5f3ff",
                    border: "1px solid #ddd6fe",
                    padding: "3px 10px",
                    borderRadius: 99
                  }}
                >
                  {finding.confidence}% AI Confidence
                </span>
              </div>

              {/* Explanation */}
              <p style={{ fontSize: "13px", color: "#334155", lineHeight: 1.55, margin: "10px 0" }}>
                {finding.explanation}
              </p>

              {/* Affected Entities Box */}
              <div
                style={{
                  padding: "10px 14px",
                  background: "#f8fafc",
                  borderRadius: "8px",
                  border: "1px solid #f1f5f9",
                  marginBottom: "12px"
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>
                  Affected Entities:
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {finding.affected.map((entity, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#0f172a",
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        padding: "2px 8px",
                        borderRadius: "4px"
                      }}
                    >
                      {entity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Officer Action */}
              <div
                style={{
                  padding: "10px 14px",
                  background: "#eff6ff",
                  borderRadius: "8px",
                  border: "1px solid #bfdbfe",
                  fontSize: "12.5px",
                  color: "#1e40af",
                  marginBottom: "14px"
                }}
              >
                <strong>Recommended Officer Action:</strong> {finding.recommendation}
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button
                  onClick={() => setEvidenceModalFinding(finding)}
                  className="btn btn-secondary btn-sm"
                >
                  <FileText size={13} /> View Forensic Evidence
                </button>
                <button
                  onClick={() => handleReviewCase(finding)}
                  className="btn btn-secondary btn-sm"
                >
                  Review Case in Workspace
                </button>
                <button
                  onClick={() => handleEscalate(finding)}
                  className="btn btn-primary btn-sm"
                  style={{ background: isCritical ? "#dc2626" : undefined }}
                >
                  Escalate Case
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── FORENSIC EVIDENCE MODAL ───────────────────────────────────────── */}
      {evidenceModalFinding && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.48)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px"
          }}
          onClick={() => setEvidenceModalFinding(null)}
        >
          <div
            className="anim-modal"
            style={{
              width: 580,
              maxWidth: "100%",
              background: "#ffffff",
              borderRadius: "14px",
              boxShadow: "var(--shadow-modal)",
              border: "1px solid #e2e8f0",
              overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#f8fafc"
              }}
            >
              <div>
                <h3 className="section-title">Forensic Evidence: {evidenceModalFinding.id}</h3>
                <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                  Extracted data payload & registry verification hash
                </p>
              </div>
              <button
                onClick={() => setEvidenceModalFinding(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "20px", maxHeight: "420px", overflowY: "auto" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>
                {evidenceModalFinding.title}
              </div>

              <div style={{ background: "#0f172a", color: "#e2e8f0", padding: "14px", borderRadius: "8px", fontFamily: "monospace", fontSize: "11.5px", lineHeight: 1.5, marginBottom: "14px" }}>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(evidenceModalFinding.evidence, null, 2)}
                </pre>
              </div>

              <div style={{ fontSize: "12px", color: "#475569" }}>
                <strong>Deterministic Rule Applied:</strong>
                <div style={{ fontFamily: "monospace", color: "#1d4ed8", marginTop: "2px" }}>
                  {evidenceModalFinding.rule}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "12px 20px",
                borderTop: "1px solid #f1f5f9",
                background: "#f8fafc",
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px"
              }}
            >
              <button
                onClick={() => setEvidenceModalFinding(null)}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setEvidenceModalFinding(null);
                  handleReviewCase(evidenceModalFinding);
                }}
                className="btn btn-primary btn-sm"
              >
                Open Review Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
