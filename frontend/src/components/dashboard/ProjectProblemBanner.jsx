import React, { useState } from "react";
import {
  ShieldCheck,
  Brain,
  ArrowRight,
  ExternalLink,
  Cpu,
  Database,
  Lock,
  X,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { useToast } from "../common/ToastProvider";

export default function ProjectProblemBanner({ onNavigate }) {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className="project-hero-section"
        style={{
          position: "relative",
          borderRadius: "14px",
          background: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
          border: "1px solid #E4E7EC",
          boxShadow: "0 1px 3px 0 rgba(16, 24, 40, 0.06), 0 1px 2px -1px rgba(16, 24, 40, 0.04)",
          overflow: "hidden",
          padding: "24px 28px",
          minHeight: "310px",
          display: "flex",
          alignItems: "center"
        }}
      >
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: "28px",
            alignItems: "center"
          }}
        >
          {/* ─── LEFT 55%: INTELLIGENCE OVERVIEW & ACTIONS ─── */}
          <div>
            {/* Status indicator badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 11px",
                  borderRadius: "99px",
                  background: "#F0FDF9",
                  border: "1px solid #99F6E4",
                  fontSize: "11.5px",
                  fontWeight: 700,
                  color: "#0E7490"
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#0EA5A4",
                    boxShadow: "0 0 6px #0EA5A4"
                  }}
                />
                AI Verification Engine Operational
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "4px 10px",
                  borderRadius: "99px",
                  background: "#F2F4F7",
                  border: "1px solid #E4E7EC",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#475467"
                }}
              >
                <Cpu size={12} style={{ color: "#155EEF" }} />
                10 Sovereign Gateways Active
              </div>
            </div>

            {/* Main Heading */}
            <h1
              style={{
                fontSize: "25px",
                fontWeight: 800,
                color: "#101828",
                letterSpacing: "-0.02em",
                lineHeight: 1.25,
                marginBottom: "10px"
              }}
            >
              AI-Powered Procurement Intelligence
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: "13.5px",
                color: "#475467",
                lineHeight: 1.55,
                maxWidth: "520px",
                marginBottom: "20px"
              }}
            >
              Accelerate bid verification, identify compliance risks and make transparent procurement decisions with AI-assisted analysis.
            </p>

            {/* Action Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={() => onNavigate?.("document-verification")}
                style={{
                  height: "40px",
                  padding: "0 18px",
                  borderRadius: "8px",
                  background: "#155EEF",
                  color: "#FFFFFF",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(16, 24, 40, 0.08)",
                  transition: "all 0.15s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#124BBA";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#155EEF";
                }}
              >
                Open Verification Queue
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => onNavigate?.("ai-insights")}
                style={{
                  height: "40px",
                  padding: "0 16px",
                  borderRadius: "8px",
                  background: "#FFFFFF",
                  color: "#344054",
                  border: "1px solid #D0D5DD",
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
                  e.currentTarget.style.borderColor = "#98A2B3";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FFFFFF";
                  e.currentTarget.style.borderColor = "#D0D5DD";
                }}
              >
                <Brain size={15} style={{ color: "#155EEF" }} />
                View AI Insights
              </button>

              <button
                onClick={() => setModalOpen(true)}
                style={{
                  height: "40px",
                  padding: "0 12px",
                  background: "transparent",
                  color: "#667085",
                  border: "none",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                Architecture & Specs
              </button>
            </div>
          </div>

          {/* ─── RIGHT 45%: REFINED PETROLEUM REFINERY AI VISUAL PANEL ─── */}
          <div
            style={{
              position: "relative",
              height: "260px",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid #E4E7EC",
              boxShadow: "0 4px 12px -2px rgba(16, 24, 40, 0.08), 0 2px 4px -2px rgba(16, 24, 40, 0.04)"
            }}
          >
            {/* Photorealistic Refinery Image with AI Overlay */}
            <img
              src="/cpcl-refinery-hero.jpg"
              alt="CPCL Petroleum Refinery AI Intelligence Infrastructure"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block"
              }}
            />

            {/* Top Badges Overlay */}
            <div
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                right: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pointerEvents: "none"
              }}
            >
              <div
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  background: "rgba(15, 27, 51, 0.78)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  fontSize: "10.5px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  letterSpacing: "0.02em"
                }}
              >
                CPCL Manali Refinery
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "4px 9px",
                  borderRadius: "6px",
                  background: "rgba(15, 27, 51, 0.78)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(14, 165, 164, 0.3)",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#5EEAD4"
                }}
              >
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "#0EA5A4"
                  }}
                />
                LIVE SCRUTINY
              </div>
            </div>

            {/* Bottom Telemetry Overlay */}
            <div
              style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
                padding: "10px 14px",
                background: "linear-gradient(180deg, rgba(15, 27, 51, 0) 0%, rgba(15, 27, 51, 0.88) 100%)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end"
              }}
            >
              <div>
                <div style={{ fontSize: "9.5px", fontWeight: 700, color: "#98A2B3", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Verification Cycle
                </div>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "#FFFFFF" }}>
                  &lt; 4.2 min <span style={{ fontSize: "10.5px", fontWeight: 600, color: "#34D399" }}>(↓ 98.4%)</span>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "9.5px", fontWeight: 700, color: "#98A2B3", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Registry Sync
                </div>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "#5EEAD4" }}>
                  99.8% Match
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SYSTEM ARCHITECTURE MODAL ────────────────────────────────────── */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background: "rgba(15, 27, 51, 0.6)",
            backdropFilter: "blur(4px)"
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "680px",
              background: "#FFFFFF",
              borderRadius: "14px",
              border: "1px solid #E4E7EC",
              boxShadow: "0 20px 25px -5px rgba(16, 24, 40, 0.15), 0 8px 10px -6px rgba(16, 24, 40, 0.05)",
              overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #E4E7EC",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#F8FAFC"
              }}
            >
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#101828" }}>
                  CPCL Autonomous Sovereign Verification Architecture
                </h3>
                <p style={{ fontSize: "11.5px", color: "#667085" }}>
                  MoPNG Sovereign Procurement Defense Engine
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  border: "1px solid #E4E7EC",
                  background: "#FFFFFF",
                  color: "#667085",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: "20px", maxHeight: "70vh", overflowY: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                <div style={{ padding: "12px", borderRadius: "8px", background: "#F8FAFC", border: "1px solid #E4E7EC" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#155EEF", marginBottom: "4px" }}>LAYER 1: PARALLEL INGESTION</div>
                  <div style={{ fontSize: "12.5px", color: "#344054", lineHeight: 1.4 }}>
                    Multi-threaded PDF/image OCR with deep structure extraction and table parsing in &lt; 1.4s.
                  </div>
                </div>
                <div style={{ padding: "12px", borderRadius: "8px", background: "#F8FAFC", border: "1px solid #E4E7EC" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#0EA5A4", marginBottom: "4px" }}>LAYER 2: SOVEREIGN CROSS-CHECK</div>
                  <div style={{ fontSize: "12.5px", color: "#344054", lineHeight: 1.4 }}>
                    Live verification against GSTN, MCA21, Udyam MSME, Income Tax PAN, and ICAI UDIN registers.
                  </div>
                </div>
                <div style={{ padding: "12px", borderRadius: "8px", background: "#F8FAFC", border: "1px solid #E4E7EC" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#B54708", marginBottom: "4px" }}>LAYER 3: FRAUD & COLLUSION DETECTOR</div>
                  <div style={{ fontSize: "12.5px", color: "#344054", lineHeight: 1.4 }}>
                    Bidder clustering analysis, shell entity identification, and metadata cross-bid comparison.
                  </div>
                </div>
                <div style={{ padding: "12px", borderRadius: "8px", background: "#F8FAFC", border: "1px solid #E4E7EC" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#027A48", marginBottom: "4px" }}>LAYER 4: IMMUTABLE AUDIT TRAIL</div>
                  <div style={{ fontSize: "12.5px", color: "#344054", lineHeight: 1.4 }}>
                    Every verification step, OCR token, and officer concurrence is cryptographically SHA-256 hashed.
                  </div>
                </div>
              </div>

              <div style={{ padding: "12px 14px", borderRadius: "8px", background: "#EFF8FF", border: "1px solid #D1E9FF", display: "flex", alignItems: "center", gap: "10px" }}>
                <CheckCircle2 size={18} style={{ color: "#155EEF", flexShrink: 0 }} />
                <div style={{ fontSize: "12px", color: "#1E40AF" }}>
                  CPCL BidVerify operates on sovereign Indian cloud instances under Ministry of Petroleum & Natural Gas compliance guidelines.
                </div>
              </div>
            </div>

            <div style={{ padding: "12px 20px", borderTop: "1px solid #E4E7EC", background: "#F8FAFC", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  background: "#155EEF",
                  color: "#FFFFFF",
                  border: "none",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Close Specifications
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
