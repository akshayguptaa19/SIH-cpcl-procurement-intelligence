"use client";
import React, { useState } from "react";
import {
  CheckCheck,
  Filter,
  Eye,
  Bell,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Brain,
  MessageSquare,
  Check,
  ArrowRight
} from "lucide-react";
import { NOTIFICATIONS } from "@/lib/data";
import { useToast } from "@/components/common/ToastProvider";
import PageHeader from "@/components/common/PageHeader";

const CATEGORY_MAP = {
  "Risk Alert": ["ai002", "n1", "n4"],
  Verification: ["v001", "v002", "n2"],
  "Tender Deadline": ["t001", "n3"],
  "Compliance Query": ["cq001", "n5"],
  "AI Insight": ["ai001", "ai003", "n6"]
};

export default function NotificationsView({ onNavigate }) {
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState("All");
  const [notifList, setNotifList] = useState(
    NOTIFICATIONS.map((n, i) => ({
      ...n,
      category:
        i === 0
          ? "Risk Alert"
          : i === 1
          ? "Verification"
          : i === 2
          ? "Tender Deadline"
          : i === 3
          ? "Compliance Query"
          : "AI Insight",
      description:
        n.detail ||
        "Statutory document check requires officer verification or sign-off before bid opening."
    }))
  );

  const unreadCount = notifList.filter((n) => !n.read).length;

  const filteredNotifs = notifList.filter((n) => {
    if (activeCategory === "All") return true;
    return n.category === activeCategory;
  });

  const handleMarkAllRead = () => {
    setNotifList((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast({
      type: "success",
      title: "All Marked as Read",
      message: "Notification center marked all active alerts as read."
    });
  };

  const handleToggleRead = (id, e) => {
    e.stopPropagation();
    setNotifList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleOpenItem = (item) => {
    // Mark as read
    setNotifList((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );

    if (item.category === "Risk Alert") onNavigate("risk-analysis");
    else if (item.category === "Verification") onNavigate("document-verification");
    else if (item.category === "Tender Deadline") onNavigate("tenders");
    else if (item.category === "Compliance Query") onNavigate("compliance-checks");
    else if (item.category === "AI Insight") onNavigate("ai-insights");
    else onNavigate("dashboard");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Header */}
      <PageHeader
        title="Notification Center"
        subtitle="Operational alerts, statutory mismatch detections, and procurement deadlines."
        badge={unreadCount > 0 ? `${unreadCount} Unread` : undefined}
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handleMarkAllRead}
            className="btn btn-secondary btn-sm"
          >
            <CheckCheck size={14} /> Mark All Read
          </button>
        </div>
      </PageHeader>

      {/* Category Tabs (Section 21) */}
      <div style={{ display: "flex", gap: "4px", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px", overflowX: "auto" }}>
        {["All", "Risk Alert", "Verification", "Tender Deadline", "Compliance Query", "AI Insight"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`pill-filter ${activeCategory === cat ? "active" : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filteredNotifs.length === 0 ? (
          <div className="saas-card" style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
            <Bell size={24} style={{ margin: "0 auto 8px", color: "#94a3b8" }} />
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>No Notifications in Category</div>
            <div style={{ fontSize: "12px", marginTop: "2px" }}>All alerts have been cleared.</div>
          </div>
        ) : (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => handleOpenItem(n)}
              className="saas-card"
              style={{
                padding: "16px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                cursor: "pointer",
                background: n.read ? "#ffffff" : "#f8fbff",
                borderLeft: !n.read ? "4px solid #1d4ed8" : "1px solid #e2e8f0",
                transition: "all 0.12s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
              onMouseLeave={(e) => (e.currentTarget.style.background = n.read ? "#ffffff" : "#f8fbff")}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "8px",
                  background: !n.read ? "#eff6ff" : "#f8fafc",
                  color: !n.read ? "#1d4ed8" : "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  flexShrink: 0
                }}
              >
                {n.icon || <Bell size={18} />}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "13.5px", fontWeight: n.read ? 600 : 700, color: "#0f172a" }}>
                    {n.title}
                  </span>
                  <span
                    className={`badge ${
                      n.category === "Risk Alert"
                        ? "badge-red"
                        : n.category === "AI Insight"
                        ? "badge-purple"
                        : n.category === "Verification"
                        ? "badge-green"
                        : "badge-blue"
                    }`}
                  >
                    {n.category}
                  </span>
                  {!n.read && (
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1d4ed8" }} />
                  )}
                </div>

                <p style={{ fontSize: "12.5px", color: "#475569", lineHeight: 1.45 }}>
                  {n.description}
                </p>

                <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "6px" }}>
                  {n.time || "10 mins ago"} · Sovereign Gateway
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                <button
                  onClick={(e) => handleToggleRead(n.id, e)}
                  style={{
                    fontSize: "11.5px",
                    color: "#64748b",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px 8px",
                    borderRadius: "4px"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#e2e8f0")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  {n.read ? "Mark Unread" : "Mark Read"}
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ padding: "4px 8px" }}
                >
                  Open <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notification Preferences Box */}
      <div className="saas-card" style={{ padding: "20px" }}>
        <h4 className="card-title" style={{ marginBottom: "12px" }}>Notification Delivery Preferences</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px" }}>
          {[
            "Critical Debarment Flags",
            "Statutory Mismatch Alarms",
            "Document Verification Queue",
            "Tender Submission Deadlines",
            "Clarification Query Responses",
            "Sovereign API Gateway Uptime"
          ].map((pref, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 12px",
                background: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #f1f5f9"
              }}
            >
              <span style={{ fontSize: "12.5px", color: "#334155", fontWeight: 500 }}>{pref}</span>
              <span className="badge badge-green">Enabled</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
