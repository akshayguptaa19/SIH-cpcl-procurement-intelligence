"use client";
import React from "react";
import {
  AlertCircle,
  AlertTriangle,
  FileCheck,
  Clock,
  ArrowRight,
  HelpCircle,
  ShieldAlert
} from "lucide-react";

export default function AttentionCard({ onActionClick }) {
  const ATTENTION_ITEMS = [
    {
      id: "critical-flag",
      priority: "Critical",
      borderColor: "#EF4444",
      badgeBg: "#FEF2F2",
      badgeColor: "#DC2626",
      badgeBorder: "#FCA5A5",
      icon: ShieldAlert,
      title: "Major Bidder Red Flag Detected",
      description: "Apex Industrial Corp — GSTIN & PAN mismatch detected across MCA master records for NIT-2024-008.",
      meta: "Flagged 18m ago · Auto Scrutiny Engine",
      actionText: "Review Red Flag",
      target: "risk-analysis"
    },
    {
      id: "high-docs",
      priority: "High",
      borderColor: "#F59E0B",
      badgeBg: "#FFFBEB",
      badgeColor: "#D97706",
      badgeBorder: "#FDE68A",
      icon: FileCheck,
      title: "Documents Awaiting Officer Sign-Off",
      description: "Global Petro EPC — Turnover balance sheet ₹42.8 Cr requires manual officer sign-off under rule 144(xi).",
      meta: "Submitted 1h ago · Tender GEM/2024/B/3091",
      actionText: "Verify Document",
      target: "document-verification"
    },
    {
      id: "medium-query",
      priority: "Medium",
      borderColor: "#2563EB",
      badgeBg: "#EFF6FF",
      badgeColor: "#2563EB",
      badgeBorder: "#BFDBFE",
      icon: HelpCircle,
      title: "Bidder Compliance Query",
      description: "Bharat Heavy Equipments — Submitted formal query regarding EMD exemption under MSME rule 170.",
      meta: "Received 3h ago · Awaiting Officer Reply",
      actionText: "Respond Query",
      target: "compliance-checks"
    },
    {
      id: "urgent-deadline",
      priority: "Urgent",
      borderColor: "#7C3AED",
      badgeBg: "#F5F3FF",
      badgeColor: "#7C3AED",
      badgeBorder: "#DDD6FE",
      icon: Clock,
      title: "Upcoming Evaluation Deadline",
      description: "GEM/2024/B/489102 closing in 18 hours — 3 submitted technical bids pending final qualification score.",
      meta: "18h remaining · Strict Procurement Schedule",
      actionText: "Evaluate Bids",
      target: "tenders"
    }
  ];

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 12,
        padding: "20px 22px",
        boxShadow: "0 1px 3px 0 rgba(16, 24, 40, 0.05)",
        marginBottom: 24
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.01em" }}>
            What Needs Your Attention
          </h2>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 99,
              background: "#FEF2F2",
              color: "#DC2626",
              border: "1px solid #FECACA"
            }}
          >
            4 Pending Actions
          </span>
        </div>
        <span style={{ fontSize: 12, color: "#64748B" }}>
          Ranked by operational urgency & compliance risk
        </span>
      </div>

      {/* Grid of 4 Priority Items */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 14
        }}
      >
        {ATTENTION_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onActionClick?.(item.target)}
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderLeft: `4px solid ${item.borderColor}`,
                borderRadius: 8,
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#FFFFFF";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(15, 23, 42, 0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#F8FAFC";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div>
                {/* Top Row: Priority Badge & Meta */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      padding: "2px 7px",
                      borderRadius: 4,
                      background: item.badgeBg,
                      color: item.badgeColor,
                      border: `1px solid ${item.badgeBorder}`
                    }}
                  >
                    {item.priority}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#64748B", fontSize: 11 }}>
                    <Icon size={13} style={{ color: item.borderColor }} />
                  </div>
                </div>

                {/* Title */}
                <h4 style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 4, lineHeight: 1.3 }}>
                  {item.title}
                </h4>

                {/* Description */}
                <p style={{ fontSize: 12, color: "#475467", lineHeight: 1.45, marginBottom: 10 }}>
                  {item.description}
                </p>
              </div>

              {/* Bottom: Meta and Link */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 8,
                  borderTop: "1px solid #E2E8F0",
                  fontSize: 11
                }}
              >
                <span style={{ color: "#94A3B8" }}>{item.meta.split("·")[0]}</span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3,
                    color: "#2563EB",
                    fontWeight: 700,
                    fontSize: 11.5
                  }}
                >
                  <span>{item.actionText}</span>
                  <ArrowRight size={12} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
