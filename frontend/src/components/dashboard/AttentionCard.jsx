"use client";
import React from "react";
import {
  AlertCircle,
  AlertTriangle,
  FileCheck,
  Clock,
  ArrowRight,
  HelpCircle,
  ShieldAlert,
  Flame
} from "lucide-react";

export default function AttentionCard({ onActionClick, items = null, loading = false }) {
  const defaultItems = [
    {
      id: "critical-flag",
      priority: "Critical",
      borderColor: "#EF4444",
      badgeBg: "#FEF2F2",
      badgeColor: "#DC2626",
      badgeBorder: "#FCA5A5",
      icon: ShieldAlert,
      title: "Statutory Mismatch in Bid",
      description: "PetroElectro Solutions — GSTIN 3B turnover variance of 18.4% against balance sheet submission.",
      meta: "Flagged 12m ago · Sovereign AI Engine",
      actionText: "Examine Flag",
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
      title: "Document Verification Queue",
      description: "Bharat Valve & Piping Corp — Factory safety and ISO certifications require officer authentication.",
      meta: "Submitted 45m ago · NIT-2025-089",
      actionText: "Verify Docs",
      target: "document-verification"
    },
    {
      id: "medium-query",
      priority: "Clarification",
      borderColor: "#00A3E0",
      badgeBg: "rgba(0, 163, 224, 0.08)",
      badgeColor: "#00A3E0",
      badgeBorder: "rgba(0, 163, 224, 0.2)",
      icon: HelpCircle,
      title: "Pending Clarification Reply",
      description: "Southern Refinery Logistics — Response received for EMD exemption under MSME rule 170.",
      meta: "Received 2h ago · Awaiting Review",
      actionText: "Respond",
      target: "compliance-checks"
    },
    {
      id: "urgent-deadline",
      priority: "Timeline",
      borderColor: "#8B5CF6",
      badgeBg: "#F5F3FF",
      badgeColor: "#8B5CF6",
      badgeBorder: "#DDD6FE",
      icon: Clock,
      title: "Technical Bid Opening Cutoff",
      description: "CPCL/REF/2025/CRU-082 closes technical evaluation stage in under 24 hours.",
      meta: "Closing Soon · Strict CPPP Rules",
      actionText: "Open Tenders",
      target: "tenders"
    }
  ];

  const displayItems = items && items.length > 0 ? items : defaultItems;

  if (loading) {
    return (
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 14,
          padding: "20px 22px",
          marginBottom: 24
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <div className="skeleton" style={{ width: 180, height: 22 }} />
          <div className="skeleton" style={{ width: 120, height: 16 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: 140, borderRadius: 10 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 14,
        padding: "20px 22px",
        boxShadow: "0 2px 6px -1px rgba(0, 0, 0, 0.04)",
        marginBottom: 24
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 8
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: 8 }}>
            <span>Action Required by Procurement Officer</span>
          </h2>
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              padding: "2px 8px",
              borderRadius: 999,
              background: "#FEF2F2",
              color: "#DC2626",
              border: "1px solid #FECACA",
              display: "flex",
              alignItems: "center",
              gap: 4
            }}
          >
            <span className="pulse-red" style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF4444" }} />
            {displayItems.length} Urgent Items
          </span>
        </div>
        <span style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>
          Ranked in real-time by compliance severity and tender milestones
        </span>
      </div>

      {/* Grid of Priority Items */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 14
        }}
      >
        {displayItems.map((item) => {
          const Icon = item.icon || AlertCircle;
          const isCritical = item.priority === "Critical" || item.riskLevel === "CRITICAL";

          return (
            <div
              key={item.id}
              onClick={() => onActionClick?.(item.target || "risk-analysis")}
              className="card-hover-lift"
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderLeft: `4px solid ${item.borderColor || "#EF4444"}`,
                borderRadius: 10,
                padding: "15px 16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer"
              }}
            >
              <div>
                {/* Top Row: Priority Badge & Meta */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        padding: "2px 7px",
                        borderRadius: 5,
                        background: item.badgeBg || "#FEF2F2",
                        color: item.badgeColor || "#DC2626",
                        border: `1px solid ${item.badgeBorder || "#FECACA"}`
                      }}
                    >
                      {item.priority}
                    </span>
                    {isCritical && (
                      <span className="pulse-red" style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF4444" }} />
                    )}
                  </div>
                  <Icon size={15} style={{ color: item.borderColor || "#00A3E0" }} />
                </div>

                {/* Title */}
                <h4 style={{ fontSize: 13.5, fontWeight: 700, color: "#0F172A", marginBottom: 5, lineHeight: 1.3 }}>
                  {item.title}
                </h4>

                {/* Description */}
                <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.45, marginBottom: 10 }}>
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
                <span style={{ color: "#94A3B8" }}>{item.meta ? item.meta.split("·")[0] : "Real-time AI"}</span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3,
                    color: "#00A3E0",
                    fontWeight: 700,
                    fontSize: 11.5
                  }}
                >
                  <span>{item.actionText || "Investigate"}</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
