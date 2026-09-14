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
  ShieldAlert
} from "lucide-react";

export default function HeroBanner({
  onReviewPending,
  pendingCount = 1,
  accuracy = "97.6%",
  avgTime = "<3 min"
}) {
  const [archModalOpen, setArchModalOpen] = useState(false);

  return (
    <>
      <div
        style={{
          width: "100%",
          borderRadius: 14,
          background: "linear-gradient(135deg, #070F1E 0%, #0B192E 50%, #020617 100%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 10px 30px -5px rgba(2, 6, 23, 0.4), 0 4px 12px -2px rgba(2, 6, 23, 0.2)",
          padding: "26px 28px",
          color: "#FFFFFF",
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
            right: 120,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, rgba(14, 165, 164, 0.05) 50%, transparent 70%)",
            pointerEvents: "none",
            filter: "blur(40px)"
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
                className="glass-pill"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 11px",
                  borderRadius: 99,
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: "#93C5FD"
                }}
              >
                <Sparkles size={13} style={{ color: "#60A5FA" }} />
                <span>AI-Powered Verification</span>
              </div>

              <div
                className="glass-pill"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 11px",
                  borderRadius: 99,
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: "#6EE7B7"
                }}
              >
                <span className="live-pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
                <span>Live Sync with GeM</span>
              </div>

              <div
                className="glass-pill"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 11px",
                  borderRadius: 99,
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: "#E2E8F0"
                }}
              >
                <Cpu size={13} style={{ color: "#0EA5A4" }} />
                <span>Neural Document Engine</span>
              </div>
            </div>

            {/* Bold Headline */}
            <h1
              style={{
                fontSize: "24px",
                fontWeight: 800,
                lineHeight: 1.25,
                letterSpacing: "-0.02em",
                color: "#FFFFFF",
                marginBottom: 10
              }}
            >
              Automated Bidder Document Verification & Compliance Scoring
            </h1>

            {/* 2-line Description */}
            <p
              style={{
                fontSize: "13.5px",
                lineHeight: 1.55,
                color: "#94A3B8",
                marginBottom: 18,
                maxWidth: 660
              }}
            >
              Instantly extract unstructured contractor documents, cross-validate against GeM tender requirements in real time, and automatically pinpoint red flags before contract awards.
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
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#F1F5F9"
                }}
              >
                <Zap size={14} style={{ color: "#FBBF24" }} />
                <span>Instant Extraction</span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#F1F5F9"
                }}
              >
                <ShieldCheck size={14} style={{ color: "#34D399" }} />
                <span>Auto Compliance Score</span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#F1F5F9"
                }}
              >
                <AlertTriangle size={14} style={{ color: "#F87171" }} />
                <span>Red Flag Detection</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={onReviewPending}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#2563EB",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 8,
                  padding: "9px 18px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(37, 99, 235, 0.35)",
                  transition: "all 0.15s ease"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#1D4ED8")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#2563EB")}
              >
                <span>Review Pending Bids</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => setArchModalOpen(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  background: "rgba(255, 255, 255, 0.06)",
                  color: "#E2E8F0",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  borderRadius: 8,
                  padding: "9px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)";
                }}
              >
                <Layers size={14} />
                <span>View Architecture</span>
              </button>
            </div>
          </div>

          {/* Right Column: Embedded Illustration & Metrics */}
          <div
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
                background: "rgba(15, 23, 42, 0.75)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: 12,
                padding: "16px",
                backdropFilter: "blur(10px)",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)"
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
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
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
                      color: "#34D399"
                    }}
                  >
                    LIVE VERIFICATION
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 10.5,
                    color: "#94A3B8",
                    fontFamily: "monospace"
                  }}
                >
                  GeM-BOT #402
                </span>
              </div>

              {/* Active Scrutiny Feed Item */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  background: "rgba(255, 255, 255, 0.03)",
                  padding: "10px",
                  borderRadius: 8,
                  border: "1px solid rgba(255, 255, 255, 0.06)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "#F1F5F9" }}>
                    NIT-2024-009 (Heavy Crane)
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: "rgba(16, 185, 129, 0.15)",
                      color: "#6EE7B7",
                      border: "1px solid rgba(16, 185, 129, 0.3)"
                    }}
                  >
                    PASS 96%
                  </span>
                </div>

                <div style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.3 }}>
                  Parsed GSTIN-33AAACP8891 & Turnover certificate ₹45.2 Cr verified against MCA21.
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    width: "100%",
                    height: 4,
                    borderRadius: 2,
                    background: "rgba(255, 255, 255, 0.1)",
                    overflow: "hidden",
                    marginTop: 2
                  }}
                >
                  <div
                    style={{
                      width: "88%",
                      height: "100%",
                      background: "linear-gradient(90deg, #2563EB, #0EA5A4)",
                      borderRadius: 2
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
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 8,
                  padding: "8px 10px",
                  textAlign: "center"
                }}
              >
                <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.02em" }}>
                  Avg Verification Time
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#FFFFFF", marginTop: 2 }}>
                  {avgTime}
                </div>
              </div>

              <div
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 8,
                  padding: "8px 10px",
                  textAlign: "center"
                }}
              >
                <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.02em" }}>
                  Extraction Accuracy
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#34D399", marginTop: 2 }}>
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
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
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
              maxWidth: 680,
              background: "#FFFFFF",
              borderRadius: 14,
              border: "1px solid #E2E8F0",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              padding: 24,
              color: "#0F172A"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: "#EFF6FF",
                    color: "#2563EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Cpu size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
                    GeM BidVerify AI — System Architecture
                  </h3>
                  <p style={{ fontSize: 11.5, color: "#64748B" }}>
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
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 12.5, color: "#334155", lineHeight: 1.5 }}>
              <div style={{ padding: "12px", background: "#F8FAFC", borderRadius: 8, border: "1px solid #E2E8F0" }}>
                <div style={{ fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>
                  1. Multi-Modal Document Extraction (OCR + LayoutLM)
                </div>
                <div>
                  Extracts tables, unformatted balance sheets, GST certificates, and experience records from PDF/scanned images with 97.6% accuracy.
                </div>
              </div>

              <div style={{ padding: "12px", background: "#F8FAFC", borderRadius: 8, border: "1px solid #E2E8F0" }}>
                <div style={{ fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>
                  2. Clause-by-Clause Semantic Cross-Matching
                </div>
                <div>
                  Cross-checks extracted bidder attributes (turnover, similar work credentials, EMD, blacklisting affidavits) against tender NIT criteria.
                </div>
              </div>

              <div style={{ padding: "12px", background: "#F8FAFC", borderRadius: 8, border: "1px solid #E2E8F0" }}>
                <div style={{ fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>
                  3. Sovereign Registry Validation & Red-Flag Scanner
                </div>
                <div>
                  Integrates simulated sovereign APIs (GSTN, MCA21, Udyam, Income Tax) to detect mismatches, duplicate documents, and collusion patterns.
                </div>
              </div>

              <div style={{ padding: "12px", background: "#F8FAFC", borderRadius: 8, border: "1px solid #E2E8F0" }}>
                <div style={{ fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>
                  4. Cryptographic SHA-256 Audit Trail
                </div>
                <div>
                  Every decision, AI confidence metric, and officer sign-off is logged into an immutable hash chain compliant with CVC procurement guidelines.
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setArchModalOpen(false)}
                className="btn btn-primary btn-sm"
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
