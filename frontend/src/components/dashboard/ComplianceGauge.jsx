"use client";
import React from "react";
import { ShieldCheck, CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";

export default function ComplianceGauge({
  score = 91.4,
  metCount = 28,
  partialCount = 4,
  missingCount = 2,
  totalRequirements = 34,
  loading = false,
  distributionData = null
}) {
  if (loading) {
    return (
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 14,
          padding: "20px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: 290
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="skeleton" style={{ width: 140, height: 18 }} />
          <div className="skeleton" style={{ width: 60, height: 18, borderRadius: 99 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
          <div className="skeleton" style={{ width: 130, height: 130, borderRadius: "50%" }} />
        </div>
        <div className="skeleton" style={{ width: "100%", height: 12, borderRadius: 6 }} />
        <div className="skeleton" style={{ width: "100%", height: 36, marginTop: 10, borderRadius: 8 }} />
      </div>
    );
  }

  // SVG circular gauge math
  const size = 146;
  const strokeWidth = 11;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeScore = Math.min(100, Math.max(0, Number(score) || 0));
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  const total = totalRequirements > 0 ? totalRequirements : (metCount + partialCount + missingCount || 1);
  const metPercent = Math.round((metCount / total) * 100);
  const partialPercent = Math.round((partialCount / total) * 100);
  const missingPercent = Math.max(0, 100 - metPercent - partialPercent);

  return (
    <div
      className="card-hover-lift"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 14,
        padding: "20px",
        boxShadow: "0 2px 6px -1px rgba(0, 0, 0, 0.04)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative"
      }}
    >
      {/* Card Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <h3 style={{ fontSize: 14.5, fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>
              Compliance Health
            </h3>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: 999,
                background: "#ECFDF5",
                color: "#059669"
              }}
            >
              <span className="live-pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
              LIVE
            </span>
          </div>
          <p style={{ fontSize: 11.5, color: "#64748B", marginTop: 2 }}>
            Sovereign statutory & tender rule verification
          </p>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 9px",
            borderRadius: 99,
            background: "rgba(0, 163, 224, 0.08)",
            color: "#00A3E0",
            border: "1px solid rgba(0, 163, 224, 0.2)"
          }}
        >
          {total} Bids Audited
        </span>
      </div>

      {/* Circular Progress Gauge */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "6px 0" }}>
        <div style={{ position: "relative", width: size, height: size }}>
          <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
            {/* Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#F1F5F9"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress Stroke */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#complianceGradModern)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
            <defs>
              <linearGradient id="complianceGradModern" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00A3E0" />
                <stop offset="60%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Text inside circular gauge */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <span style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.03em", lineHeight: 1 }}>
              {safeScore}%
            </span>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#64748B", marginTop: 4 }}>
              Mean Score
            </span>
          </div>
        </div>
      </div>

      {/* Requirement Match Status Stacked Bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, fontSize: 11.5 }}>
          <span style={{ fontWeight: 600, color: "#334155" }}>Statutory Verification Status</span>
          <span style={{ fontWeight: 700, color: "#059669" }}>{metPercent}% Certified</span>
        </div>

        {/* Stacked Bar */}
        <div
          style={{
            width: "100%",
            height: 9,
            borderRadius: 6,
            background: "#F1F5F9",
            overflow: "hidden",
            display: "flex",
            marginBottom: 10
          }}
        >
          <div
            title={`Qualified: ${metCount} (${metPercent}%)`}
            style={{ width: `${metPercent}%`, background: "#10B981", height: "100%", transition: "width 0.6s ease" }}
          />
          <div
            title={`Under Review: ${partialCount} (${partialPercent}%)`}
            style={{ width: `${partialPercent}%`, background: "#F59E0B", height: "100%", transition: "width 0.6s ease" }}
          />
          <div
            title={`Disqualified: ${missingCount} (${missingPercent}%)`}
            style={{ width: `${missingPercent}%`, background: "#EF4444", height: "100%", transition: "width 0.6s ease" }}
          />
        </div>

        {/* Legend */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 6,
            padding: "8px 10px",
            background: "#F8FAFC",
            borderRadius: 8,
            border: "1px solid #E2E8F0",
            fontSize: 11
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
            <div>
              <span style={{ color: "#64748B" }}>Passed: </span>
              <strong style={{ color: "#0F172A" }}>{metCount}</strong>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B" }} />
            <div>
              <span style={{ color: "#64748B" }}>Review: </span>
              <strong style={{ color: "#0F172A" }}>{partialCount}</strong>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} />
            <div>
              <span style={{ color: "#64748B" }}>Flagged: </span>
              <strong style={{ color: "#0F172A" }}>{missingCount}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
