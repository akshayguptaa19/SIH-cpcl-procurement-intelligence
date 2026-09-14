"use client";
import React from "react";
import { ShieldCheck, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

export default function ComplianceGauge({
  score = 78.2,
  metCount = 186,
  partialCount = 14,
  missingCount = 39,
  totalRequirements = 239
}) {
  // SVG circular gauge math
  const size = 150;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const metPercent = Math.round((metCount / totalRequirements) * 100);
  const partialPercent = Math.round((partialCount / totalRequirements) * 100);
  const missingPercent = Math.round((missingCount / totalRequirements) * 100);

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 12,
        padding: "20px",
        boxShadow: "0 1px 3px 0 rgba(16, 24, 40, 0.05)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      {/* Card Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <h3 style={{ fontSize: 14.5, fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>
            Compliance Health
          </h3>
          <p style={{ fontSize: 11.5, color: "#64748B", marginTop: 2 }}>
            Real-time tender requirement match rate
          </p>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 99,
            background: "#EFF6FF",
            color: "#2563EB",
            border: "1px solid #BFDBFE"
          }}
        >
          {totalRequirements} Total Bids
        </span>
      </div>

      {/* Circular Progress Gauge */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "8px 0" }}>
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
              stroke="url(#complianceGrad)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
            />
            <defs>
              <linearGradient id="complianceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#10B981" />
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
            <span style={{ fontSize: "26px", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em", lineHeight: 1 }}>
              {score}%
            </span>
            <span style={{ fontSize: "10.5px", fontWeight: 600, color: "#64748B", marginTop: 4 }}>
              Overall Score
            </span>
          </div>
        </div>
      </div>

      {/* Requirement Match Status Stacked Bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, fontSize: 11.5 }}>
          <span style={{ fontWeight: 600, color: "#334155" }}>Clause-by-Clause Verification</span>
          <span style={{ fontWeight: 700, color: "#059669" }}>{metPercent}% Met</span>
        </div>

        {/* Stacked Bar */}
        <div
          style={{
            width: "100%",
            height: 8,
            borderRadius: 4,
            background: "#F1F5F9",
            overflow: "hidden",
            display: "flex",
            marginBottom: 10
          }}
        >
          <div
            title={`Met: ${metCount} (${metPercent}%)`}
            style={{ width: `${metPercent}%`, background: "#10B981", height: "100%" }}
          />
          <div
            title={`Partial: ${partialCount} (${partialPercent}%)`}
            style={{ width: `${partialPercent}%`, background: "#F59E0B", height: "100%" }}
          />
          <div
            title={`Missing: ${missingCount} (${missingPercent}%)`}
            style={{ width: `${missingPercent}%`, background: "#EF4444", height: "100%" }}
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
            borderRadius: 6,
            border: "1px solid #E2E8F0",
            fontSize: 11
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
            <div>
              <span style={{ color: "#64748B" }}>Met: </span>
              <strong style={{ color: "#0F172A" }}>{metCount}</strong>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B" }} />
            <div>
              <span style={{ color: "#64748B" }}>Partial: </span>
              <strong style={{ color: "#0F172A" }}>{partialCount}</strong>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} />
            <div>
              <span style={{ color: "#64748B" }}>Missing: </span>
              <strong style={{ color: "#0F172A" }}>{missingCount}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
