"use client";
import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendType = "up",
  iconColor = "#00A3E0",
  iconBg = "rgba(0, 163, 224, 0.08)",
  accentColor,
  onClick,
  subtext,
  loading = false,
  badge
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const isPositive = trendType === "up" || trendType === "success";
  const isNegative = trendType === "down" || trendType === "danger";

  // Quick smooth number animation when value updates if numeric
  useEffect(() => {
    if (loading || value === undefined || value === null) return;
    
    // If it's a pure number or percentage, let's keep it snappy
    setDisplayValue(value);
  }, [value, loading]);

  if (loading) {
    return (
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 14,
          padding: "20px 22px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: 140
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="skeleton" style={{ width: 90, height: 14 }} />
          <div className="skeleton" style={{ width: 38, height: 38, borderRadius: 10 }} />
        </div>
        <div className="skeleton" style={{ width: 120, height: 32, margin: "14px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="skeleton" style={{ width: 60, height: 16 }} />
          <div className="skeleton" style={{ width: 80, height: 14 }} />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="card-hover-lift"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 14,
        padding: "20px 22px",
        boxShadow: "0 2px 6px -1px rgba(0, 0, 0, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.02)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: onClick ? "pointer" : "default",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {accentColor && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: accentColor
          }}
        />
      )}

      {/* Top row: Label & Icon */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#64748B",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}
          >
            {label}
          </span>
          {badge && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: 999,
                background: "#F1F5F9",
                color: "#475569"
              }}
            >
              {badge}
            </span>
          )}
        </div>
        {Icon && (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: iconBg,
              color: iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "transform 0.2s ease"
            }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      {/* Center: Large Value */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
        <span
          style={{
            fontSize: "30px",
            fontWeight: 800,
            color: "#0F172A",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"'
          }}
        >
          {displayValue}
        </span>
      </div>

      {/* Bottom row: Trend indicator & subtext */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
        {trend && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "3px 8px",
              borderRadius: 6,
              fontWeight: 700,
              fontSize: 11.5,
              background: isPositive
                ? "rgba(16, 185, 129, 0.12)"
                : isNegative
                ? "rgba(239, 68, 68, 0.12)"
                : "rgba(100, 116, 139, 0.12)",
              color: isPositive
                ? "#059669"
                : isNegative
                ? "#DC2626"
                : "#475569"
            }}
          >
            {isPositive && <TrendingUp size={13} />}
            {isNegative && <TrendingDown size={13} />}
            {!isPositive && !isNegative && <Minus size={13} />}
            <span>{trend}</span>
          </div>
        )}
        {subtext && (
          <span style={{ color: "#94A3B8", fontSize: 11.5, fontWeight: 500 }}>
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}
