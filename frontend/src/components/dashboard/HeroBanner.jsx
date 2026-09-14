"use client";
import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Layers,
  CheckCircle2,
  Cpu,
  RefreshCw,
  X,
  FileCheck,
  Search,
  ExternalLink,
  ShieldAlert,
  Activity,
  Server
} from "lucide-react";

export default function HeroBanner({
  onReviewPending,
  pendingCount = 6,
  accuracy = "99.4%",
  avgTime = "1.4 Days",
  aiStatus = null,
  sovereignHealth = "99.98% Operational"
}) {
  const [archModalOpen, setArchModalOpen] = useState(false);

  const isAiOnline = aiStatus?.status === "ONLINE" || aiStatus?.pythonAvailable;
  const engineLabel = aiStatus?.engineMode === "NATIVE_HYBRID" ? "Hybrid Python Engine (LayoutLMv3 + RoBERTa)" : "Sovereign Rule Validator Active";

  return (
    <>
      <div
        className="dashboard-hero card-hover-lift"
        style={{
          width: "100%",
          borderRadius: 16,
          background: "linear-gradient(135deg, #FFFFFF 0%, #F0F9FF 50%, #F8FAFC 100%)",
          border: "1px solid #BAE6FD",
          boxShadow: "0 10px 30px -10px rgba(0, 43, 73, 0.08), 0 2px 8px -2px rgba(0, 163, 224, 0.05)",
          padding: "26px 30px",
          color: "#0F172A",
          position: "relative",
          overflow: "hidden",
          marginBottom: 24
        }}
      >
        {/* Subtle decorative background ambient glow */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: 80,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0, 163, 224, 0.12) 0%, rgba(16, 185, 129, 0.05) 50%, transparent 70%)",
            pointerEvents: "none",
            filter: "blur(50px)"
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 28,
            alignItems: "center",
            position: "relative",
            zIndex: 1
          }}
        >
          {/* Left Column: Hero Content */}
          <div style={{ maxWidth: 740 }}>
            {/* Top Glassmorphism Badges */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 8,
                marginBottom: 16
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 12px",
                  borderRadius: 999,
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: "#0284C7",
                  background: "rgba(2, 132, 199, 0.08)",
                  border: "1px solid rgba(2, 132, 199, 0.25)"
                }}
              >
                <Sparkles size={13} style={{ color: "#00A3E0" }} />
                <span>CPCL Sovereign Intelligence</span>
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 12px",
                  borderRadius: 999,
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: isAiOnline ? "#047857" : "#0284C7",
                  background: isAiOnline ? "rgba(16, 185, 129, 0.08)" : "rgba(0, 163, 224, 0.08)",
                  border: isAiOnline ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(0, 163, 224, 0.25)"
                }}
              >
                <span className="live-pulse-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: isAiOnline ? "#10B981" : "#00A3E0" }} />
                <span>{isAiOnline ? "AI Engine Online (PyTorch & RoBERTa)" : "Sovereign Gateways Live"}</span>
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 12px",
                  borderRadius: 999,
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: "#334155",
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0"
                }}
              >
                <Activity size={13} style={{ color: "#00A3E0" }} />
                <span>{sovereignHealth}</span>
              </div>
            </div>

            {/* Bold Headline */}
            <h1
              style={{
                fontSize: "25px",
                fontWeight: 800,
                lineHeight: 1.25,
                letterSpacing: "-0.025em",
                color: "#002B49",
                marginBottom: 10
              }}
            >
              Automated Bidder Document Verification & Statutory Risk Intelligence
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: "13.5px",
                lineHeight: 1.55,
                color: "#475569",
                marginBottom: 18,
                maxWidth: 680
              }}
            >
              Extract and audit complex contractor balance sheets, GST returns, and safety credentials in seconds. Autonomous cross-validation against GeM and CPCL NIT tender specifications with zero subjective bias.
            </p>

            {/* 3 Feature Chips */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginBottom: 22
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#334155",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
                }}
              >
                <Zap size={14} style={{ color: "#F59E0B" }} />
                <span>Sub-Second OCR & Parsing</span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#334155",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
                }}
              >
                <ShieldCheck size={14} style={{ color: "#10B981" }} />
                <span>Multi-Portal Sovereign Cross-Check</span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#334155",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
                }}
              >
                <AlertTriangle size={14} style={{ color: "#EF4444" }} />
                <span>Predictive Collusion & Red-Flags</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={onReviewPending}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "linear-gradient(135deg, #002B49 0%, #00A3E0 100%)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 20px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0, 43, 73, 0.25)",
                  transition: "all 0.18s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 163, 224, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 43, 73, 0.25)";
                }}
              >
                <span>Review Pending Queue ({pendingCount})</span>
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => setArchModalOpen(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  background: "#FFFFFF",
                  color: "#002B49",
                  border: "1px solid #CBD5E1",
                  borderRadius: 10,
                  padding: "10px 18px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#F8FAFC";
                  e.currentTarget.style.borderColor = "#00A3E0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FFFFFF";
                  e.currentTarget.style.borderColor = "#CBD5E1";
                }}
              >
                <Layers size={15} style={{ color: "#00A3E0" }} />
                <span>AI Architecture & Models</span>
              </button>
            </div>
          </div>

          {/* Right Column: Embedded Live Status Card */}
          <div
            className="dashboard-hero-metrics"
            style={{
              width: 320,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              flexShrink: 0
            }}
          >
            {/* Live Verification Visual Card */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #BAE6FD",
                borderRadius: 14,
                padding: "18px",
                boxShadow: "0 6px 20px rgba(0, 43, 73, 0.05)"
              }}
            >
              {/* Card Header with Pulsing Live Status */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  paddingBottom: 10,
                  borderBottom: "1px solid #E2E8F0"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    className="live-pulse-dot"
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#10B981"
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      color: "#047857"
                    }}
                  >
                    AUTONOMOUS SCRUTINY
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 10.5,
                    color: "#0284C7",
                    fontFamily: "monospace",
                    fontWeight: 700
                  }}
                >
                  CPCL-BOT#25
                </span>
              </div>

              {/* Active Scrutiny Feed Item */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  background: "#F8FAFC",
                  padding: "11px",
                  borderRadius: 10,
                  border: "1px solid #E2E8F0"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>
                    NIT-2025-089 (Furnace Tube)
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: "#ECFDF5",
                      color: "#047857",
                      border: "1px solid #A7F3D0"
                    }}
                  >
                    PASS 98.4%
                  </span>
                </div>

                <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.35 }}>
                  Extracted GSTIN-33AAACP8891 & Audited Balance Sheet verified against MCA21.
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    width: "100%",
                    height: 5,
                    borderRadius: 3,
                    background: "#E2E8F0",
                    overflow: "hidden",
                    marginTop: 2
                  }}
                >
                  <div
                    style={{
                      width: "92%",
                      height: "100%",
                      background: "linear-gradient(90deg, #002B49, #00A3E0, #10B981)",
                      borderRadius: 3
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 2 Small Metric Readouts Below */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8
              }}
            >
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: 10,
                  padding: "10px 12px",
                  textAlign: "center"
                }}
              >
                <div style={{ fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Avg Cycle Time
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", marginTop: 3 }}>
                  {avgTime}
                </div>
              </div>

              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: 10,
                  padding: "10px 12px",
                  textAlign: "center"
                }}
              >
                <div style={{ fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Extraction Precision
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#059669", marginTop: 3 }}>
                  {accuracy}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Modal */}
      {archModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 20
          }}
          onClick={() => setArchModalOpen(false)}
        >
          <div
            className="anim-modal"
            style={{
              width: "100%",
              maxWidth: 720,
              background: "#FFFFFF",
              borderRadius: 16,
              border: "1px solid #E2E8F0",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              padding: 26,
              color: "#0F172A"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: "rgba(0, 163, 224, 0.1)",
                    color: "#00A3E0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Cpu size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: "#002B49" }}>
                    CPCL Sovereign AI Bid Compliance Architecture
                  </h3>
                  <p style={{ fontSize: 12, color: "#64748B" }}>
                    SIH Grand Finale End-to-End Autonomous Document Verification Pipeline
                  </p>
                </div>
              </div>
              <button
                onClick={() => setArchModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748B",
                  padding: 4
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13, color: "#334155", lineHeight: 1.5 }}>
              <div style={{ padding: "14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0" }}>
                <div style={{ fontWeight: 800, color: "#002B49", marginBottom: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>1. Multi-Modal Vision & LayoutLMv3 Document Intelligence</span>
                  <span style={{ fontSize: 11, background: "#ECFDF5", color: "#059669", padding: "2px 8px", borderRadius: 99, fontWeight: 700 }}>99.4% Accuracy</span>
                </div>
                <div>
                  Scans unformatted contractor balance sheets, turnover statements, and ISO certifications using computer vision, preserving spatial tabular structures and OCR confidence bounds.
                </div>
              </div>

              <div style={{ padding: "14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0" }}>
                <div style={{ fontWeight: 800, color: "#002B49", marginBottom: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>2. RoBERTa Semantic Specification Clause Cross-Matcher</span>
                  <span style={{ fontSize: 11, background: "#EFF6FF", color: "#0284C7", padding: "2px 8px", borderRadius: 99, fontWeight: 700 }}>Semantic NLP</span>
                </div>
                <div>
                  Cross-references extracted bidder technical specifications against CPCL Notice Inviting Tender (NIT) rules, EMD exemptions, and similar work completion clauses.
                </div>
              </div>

              <div style={{ padding: "14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0" }}>
                <div style={{ fontWeight: 800, color: "#002B49", marginBottom: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>3. Multi-Gateway Sovereign API Cross-Verification</span>
                  <span style={{ fontSize: 11, background: "#FEF3C7", color: "#D97706", padding: "2px 8px", borderRadius: 99, fontWeight: 700 }}>Zero-Trust Validation</span>
                </div>
                <div>
                  Live synchronous checks across simulated GSTN, MCA21, EPFO, ESIC, and CPPP debarment registries to eradicate shell entities and fraudulent MSME claims.
                </div>
              </div>

              <div style={{ padding: "14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0" }}>
                <div style={{ fontWeight: 800, color: "#002B49", marginBottom: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>4. Cryptographic SHA-256 Sovereign Audit Trail</span>
                  <span style={{ fontSize: 11, background: "#F3E8FF", color: "#7E22CE", padding: "2px 8px", borderRadius: 99, fontWeight: 700 }}>Immutable Ledger</span>
                </div>
                <div>
                  Every AI inference, threshold score, and Procurement Officer decision is hashed into an immutable audit chain meeting Central Vigilance Commission (CVC) statutory guidelines.
                </div>
              </div>
            </div>

            <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11.5, color: "#64748B" }}>
                Active Mode: <strong>{engineLabel}</strong>
              </span>
              <button
                onClick={() => setArchModalOpen(false)}
                style={{
                  background: "#002B49",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 18px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Close Architecture View
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
