"use client";
import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendType = "up",
  iconColor = "#2563EB",
  iconBg = "#EFF6FF",
  onClick,
  subtext
}) {
  const isPositive = trendType === "up" || trendType === "success";
  const isNegative = trendType === "down" || trendType === "danger";

  return (
    <div
      onClick={onClick}
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 12,
        padding: "18px 20px",
        boxShadow: "0 1px 3px 0 rgba(16, 24, 40, 0.05)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.18s ease"
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = "0 6px 16px -2px rgba(16, 24, 40, 0.08)";
          e.currentTarget.style.borderColor = "#CBD5E1";
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = "0 1px 3px 0 rgba(16, 24, 40, 0.05)";
          e.currentTarget.style.borderColor = "#E2E8F0";
        }
      }}
    >
      {/* Top row: Label & Icon */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            color: "#64748B",
            textTransform: "uppercase",
            letterSpacing: "0.04em"
          }}
        >
          {label}
        </span>
        {Icon && (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: iconBg,
              color: iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      {/* Center: Large Value */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
        <span
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "#0F172A",
            lineHeight: 1.1,
            letterSpacing: "-0.02em"
          }}
        >
          {value}
        </span>
      </div>

      {/* Bottom row: Trend indicator & subtext */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11.5 }}>
        {trend && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "2px 7px",
              borderRadius: 4,
              fontWeight: 700,
              background: isPositive
                ? "#ECFDF5"
                : isNegative
                ? "#FEF2F2"
                : "#F1F5F9",
              color: isPositive
                ? "#059669"
                : isNegative
                ? "#DC2626"
                : "#475467"
            }}
          >
            {isPositive && <TrendingUp size={12} />}
            {isNegative && <TrendingDown size={12} />}
            {!isPositive && !isNegative && <Minus size={12} />}
            <span>{trend}</span>
          </div>
        )}
        {subtext && (
          <span style={{ color: "#94A3B8", fontSize: 11 }}>
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}
