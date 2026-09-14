"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  X,
  FileText,
  Users,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCheck,
  Sparkles,
  Command,
  User,
  Settings,
  LifeBuoy,
  LogOut,
  ExternalLink,
  Building2
} from "lucide-react";
import {
  NOTIFICATIONS,
  TENDERS,
  BIDDERS,
  RECENT_VERIFICATIONS,
  VERIFICATION_QUEUE
} from "@/lib/data";
import { useToast } from "@/components/common/ToastProvider";
import { useProcurement } from "@/context/ProcurementContext";

function GeMLogo({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
      aria-label="Government e-Marketplace (GeM) Logo"
    >
      <rect width="44" height="44" rx="10" fill="#0F172A" />
      {/* GeM Stylized Tri-color Geometric Facets */}
      <path d="M9 22L19 12L23 16L13 26L9 22Z" fill="#F97316" />
      <path d="M19 12L31 12L35 22L23 22L19 12Z" fill="#2563EB" />
      <path d="M23 22L35 22L31 32L19 32L23 22Z" fill="#10B981" />
      <path d="M13 26L23 26L19 32L9 32L13 26Z" fill="#F59E0B" />
      {/* Center Core Dot */}
      <circle cx="22" cy="22" r="3.5" fill="#FFFFFF" />
      <circle cx="22" cy="22" r="1.5" fill="#0F172A" />
    </svg>
  );
}

export default function TopBar({ role: propRole = "procurement", sidebarWidth = 220, onNavigate, onLogout }) {
  const { showToast } = useToast();
  const contextProc = useProcurement();
  const role = contextProc?.role || propRole;
  const switchRole = contextProc?.switchRole || (() => {});
  const activeBidder = contextProc?.activeBidder || { name: "Shakti Enterprises Pvt Ltd" };
  const notifs = contextProc?.notifications || NOTIFICATIONS;

  const [searchQuery, setSearchQuery] = useState("");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const paletteInputRef = useRef(null);
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const helpRef = useRef(null);

  const unread = notifs.filter((n) => !n.read).length;

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (e.key === "Escape") {
        setPaletteOpen(false);
        setNotifOpen(false);
        setProfileOpen(false);
        setHelpOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus palette input when modal opens
  useEffect(() => {
    if (paletteOpen) {
      setTimeout(() => paletteInputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [paletteOpen]);

  // Outside clicks
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (helpRef.current && !helpRef.current.contains(e.target)) {
        setHelpOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Categorized command palette search results
  const categorizedResults = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const tendersList = TENDERS.filter(
      (t) => !q || t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
    ).map((t) => ({
      id: `tender_${t.id}`,
      title: t.name,
      subtitle: `${t.id} · ${t.bidders} Bidders · Due ${t.deadline}`,
      category: "Tenders",
      section: "tenders",
      badge: t.status,
      badgeColor: t.status === "Completed" ? "#16a34a" : t.status === "Published" ? "#1d4ed8" : "#d97706"
    }));

    const biddersList = BIDDERS.filter(
      (b) => !q || b.name.toLowerCase().includes(q) || b.gstin.toLowerCase().includes(q) || b.pan.toLowerCase().includes(q)
    ).map((b) => ({
      id: `bidder_${b.id}`,
      title: b.name,
      subtitle: `GSTIN: ${b.gstin} · Turnover: ${b.turnover}`,
      category: "Bidders",
      section: "bidders",
      badge: `${b.riskLevel} Risk`,
      badgeColor: b.riskLevel === "Critical" ? "#dc2626" : b.riskLevel === "High" ? "#ea580c" : b.riskLevel === "Medium" ? "#d97706" : "#16a34a"
    }));

    const documentsList = VERIFICATION_QUEUE.filter(
      (v) => !q || v.bidder.toLowerCase().includes(q) || v.issue.toLowerCase().includes(q) || v.tender.toLowerCase().includes(q)
    ).map((v) => ({
      id: `doc_${v.id}`,
      title: `${v.bidder} — ${v.issue}`,
      subtitle: `${v.tender} · OCR Confidence: ${v.confidence}%`,
      category: "Documents",
      section: "document-verification",
      badge: v.status,
      badgeColor: v.status === "Escalated" ? "#7c3aed" : v.status === "Query Raised" ? "#dc2626" : "#2563eb"
    }));

    const complianceList = [
      {
        id: "comp_1",
        title: "Minimum Annual Turnover Rule (≥ ₹5.0 Cr)",
        subtitle: "Audited financial compliance verification",
        category: "Compliance Cases",
        section: "compliance-checks",
        badge: "86% Pass Rate",
        badgeColor: "#16a34a"
      },
      {
        id: "comp_2",
        title: "Active GSTIN Status & Regular Filings",
        subtitle: "GSTN Registry API deterministic check",
        category: "Compliance Cases",
        section: "compliance-checks",
        badge: "Mandatory",
        badgeColor: "#1d4ed8"
      },
      {
        id: "comp_3",
        title: "OEM Manufacturer Authorization Validation",
        subtitle: "Technical eligibility criteria check",
        category: "Compliance Cases",
        section: "compliance-checks",
        badge: "15 Flagged",
        badgeColor: "#dc2626"
      }
    ].filter((c) => !q || c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q));

    const insightsList = [
      {
        id: "ai_1",
        title: "Unusual Turnover Pattern across 3 Bidders",
        subtitle: "High correlation in revenue breakdowns",
        category: "AI Insights",
        section: "ai-insights",
        badge: "94% Confidence",
        badgeColor: "#7c3aed"
      },
      {
        id: "ai_2",
        title: "Noble Industrials Debarment Surveillance Flag",
        subtitle: "CERSAI Central Registry match",
        category: "AI Insights",
        section: "ai-insights",
        badge: "Critical Alert",
        badgeColor: "#dc2626"
      }
    ].filter((i) => !q || i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q));

    return [
      { category: "Tenders", icon: FileText, items: tendersList.slice(0, 3) },
      { category: "Bidders", icon: Users, items: biddersList.slice(0, 3) },
      { category: "Documents", icon: ShieldCheck, items: documentsList.slice(0, 3) },
      { category: "Compliance Cases", icon: AlertTriangle, items: complianceList.slice(0, 2) },
      { category: "AI Insights", icon: Sparkles, items: insightsList.slice(0, 2) }
    ].filter((group) => group.items.length > 0);
  }, [searchQuery]);

  // Flattened items for keyboard selection
  const flatItems = React.useMemo(() => {
    return categorizedResults.flatMap((group) => group.items);
  }, [categorizedResults]);

  const handleKeyDownPalette = (e) => {
    if (flatItems.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % flatItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatItems.length) % flatItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flatItems[selectedIndex]) {
        handleSelectResult(flatItems[selectedIndex]);
      }
    }
  };

  const handleSelectResult = (item) => {
    setPaletteOpen(false);
    setSearchQuery("");
    if (onNavigate) {
      onNavigate(item.section);
      showToast({
        type: "info",
        title: `Opened ${item.category}`,
        message: `Navigated to ${item.title}`
      });
    }
  };

  const handleMarkAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast({
      type: "success",
      title: "Notifications Updated",
      message: "All alerts marked as read."
    });
  };

  let cumulativeIndex = -1;

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: sidebarWidth,
          right: 0,
          height: 58,
          background: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0",
          boxShadow: "0 1px 2px 0 rgba(15, 23, 42, 0.04)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          zIndex: 30,
          transition: "left 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        {/* Left: GeM BidVerify AI Branding */}
        <div
          onClick={() => onNavigate?.("dashboard")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
            flexShrink: 0
          }}
          title="Return to Dashboard"
        >
          <GeMLogo size={34} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14.5, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.01em" }}>
                GeM BidVerify <span style={{ color: "#2563EB" }}>AI</span>
              </span>
              <span style={{ fontSize: 9.5, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE" }}>
                Govt Tech
              </span>
            </div>
            <div style={{ fontSize: 10.5, color: "#64748B", lineHeight: 1.2 }}>
              Government e-Marketplace • National Procurement Platform
            </div>
          </div>
        </div>

        {/* Center: Global Search Trigger Button */}
        <div style={{ flex: 1, maxWidth: 540, margin: "0 24px", display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setPaletteOpen(true)}
            style={{
              flex: 1,
              height: 38,
              background: "#F5F7FA",
              border: "1px solid #E4E7EC",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 14px",
              color: "#667085",
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#155EEF";
              e.currentTarget.style.background = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E4E7EC";
              e.currentTarget.style.background = "#F5F7FA";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <Search size={15} style={{ color: "#155EEF" }} />
              <span style={{ color: "#667085", fontSize: 12.5 }}>Search tenders, bidders, documents, or compliance records...</span>
            </div>
            <kbd
              style={{
                fontSize: 10.5,
                fontWeight: 600,
                color: "#667085",
                background: "#FFFFFF",
                border: "1px solid #E4E7EC",
                borderRadius: 5,
                padding: "2px 6px"
              }}
            >
              ⌘ K
            </kbd>
          </button>

          {role === "bidder" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 10px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: 8,
                flexShrink: 0
              }}
            >
              <Building2 size={14} style={{ color: "#16a34a" }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "#166534" }}>
                Bidder View: {activeBidder?.name?.split(" ")[0]}
              </span>
              <button
                onClick={() => {
                  switchRole("procurement");
                  onNavigate?.("dashboard");
                  showToast({
                    type: "info",
                    title: "Switched Role",
                    message: "Returned to Procurement Officer Console."
                  });
                }}
                className="btn btn-primary btn-xs"
                style={{ fontSize: 11, padding: "2px 8px" }}
              >
                Exit to Officer
              </button>
            </div>
          )}
        </div>

        {/* Right: Notifications, Help, Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {/* Notifications Dropdown */}
          <div ref={notifRef} style={{ position: "relative" }}>
            <button
              onClick={() => {
                setNotifOpen(!notifOpen);
                setProfileOpen(false);
                setHelpOpen(false);
              }}
              aria-label="View Notifications"
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: "1px solid #E2E8F0",
                background: notifOpen ? "#EFF6FF" : "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
                transition: "all 0.15s ease"
              }}
            >
              <Bell size={16} style={{ color: notifOpen ? "#2563EB" : "#64748B" }} />
              {unread > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    minWidth: 16,
                    height: 16,
                    padding: "0 4px",
                    background: "#DC2626",
                    color: "#ffffff",
                    borderRadius: 99,
                    fontSize: 9.5,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #FFFFFF"
                  }}
                >
                  {unread}
                </span>
              )}
            </button>

            {notifOpen && (
              <div
                className="anim-modal"
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: 360,
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: 12,
                  boxShadow: "var(--shadow-dropdown)",
                  zIndex: 50,
                  overflow: "hidden"
                }}
              >
                <div
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #E2E8F0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#F8FAFC"
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>
                    Notifications <span style={{ color: "#64748B", fontWeight: 500 }}>({unread} unread)</span>
                  </div>
                  <button
                    onClick={handleMarkAllRead}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#2563EB",
                      fontSize: 11.5,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4
                    }}
                  >
                    <CheckCheck size={13} /> Mark all read
                  </button>
                </div>

                <div style={{ maxHeight: 380, overflowY: "auto" }}>
                  {notifs.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setNotifOpen(false);
                        if (n.tenderId) onNavigate?.("tenders", { tenderId: n.tenderId });
                        else if (n.type === "escalation" || n.type === "fraud") onNavigate?.("risk-analysis");
                        else onNavigate?.("notifications");
                      }}
                      style={{
                        padding: "10px 14px",
                        borderBottom: "1px solid #F1F5F9",
                        display: "flex",
                        gap: 10,
                        cursor: "pointer",
                        background: n.read ? "#FFFFFF" : "#EFF6FF",
                        transition: "background 0.12s"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = n.read ? "#FFFFFF" : "#EFF6FF")}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: n.read ? "transparent" : "#2563EB",
                          marginTop: 5,
                          flexShrink: 0
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: n.read ? 500 : 700, color: "#0F172A", marginBottom: 2 }}>
                          {n.title}
                        </div>
                        <div style={{ fontSize: 11.5, color: "#64748B", lineHeight: 1.35, marginBottom: 4 }}>
                          {n.message}
                        </div>
                        <div style={{ fontSize: 10.5, color: "#94A3B8" }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    padding: "10px 16px",
                    background: "#F8FAFC",
                    borderTop: "1px solid #E2E8F0",
                    textAlign: "center"
                  }}
                >
                  <button
                    onClick={() => {
                      setNotifOpen(false);
                      onNavigate?.("notifications");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#2563EB",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    Open Notification Center →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Help Popover */}
          <div ref={helpRef} style={{ position: "relative" }}>
            <button
              onClick={() => {
                setHelpOpen(!helpOpen);
                setNotifOpen(false);
                setProfileOpen(false);
              }}
              aria-label="Platform Help & Shortcuts"
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: "1px solid #E2E8F0",
                background: helpOpen ? "#EFF6FF" : "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <HelpCircle size={16} style={{ color: helpOpen ? "#2563EB" : "#64748B" }} />
            </button>

            {helpOpen && (
              <div
                className="anim-modal"
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: 320,
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: 12,
                  boxShadow: "var(--shadow-dropdown)",
                  zIndex: 50,
                  padding: "16px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0F172A" }}>Officer Quick Guide</div>
                  <button onClick={() => setHelpOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}>
                    <X size={14} />
                  </button>
                </div>
                <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.45, marginBottom: 12 }}>
                  CPCL AI Procurement Intelligence validates contractor submissions against sovereign registries (GSTN, MCA21, Udyam, Income Tax, CERSAI).
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", background: "#F8FAFC", borderRadius: 6, border: "1px solid #E2E8F0" }}>
                    <span style={{ color: "#334155" }}>Global Search</span>
                    <kbd style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#0F172A", padding: "1px 5px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>⌘ K</kbd>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", background: "#F8FAFC", borderRadius: 6, border: "1px solid #E2E8F0" }}>
                    <span style={{ color: "#334155" }}>AI Role</span>
                    <span style={{ color: "#7C3AED", fontWeight: 700 }}>Data Extraction & Flags</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", background: "#F8FAFC", borderRadius: 6, border: "1px solid #E2E8F0" }}>
                    <span style={{ color: "#334155" }}>Officer Role</span>
                    <span style={{ color: "#16A34A", fontWeight: 700 }}>Final Binding Decision</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setHelpOpen(false);
                    onNavigate?.("audit-trail");
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ width: "100%" }}
                >
                  View Cryptographic Audit Trail
                </button>
              </div>
            )}
          </div>

          <div style={{ width: 1, height: 24, background: "#E2E8F0", margin: "0 4px" }} />

          {/* User Avatar & Profile Dropdown */}
          <div ref={profileRef} style={{ position: "relative" }}>
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotifOpen(false);
                setHelpOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                background: profileOpen ? "#EFF6FF" : "#FFFFFF",
                border: "1px solid #E2E8F0",
                cursor: "pointer",
                padding: "4px 10px",
                borderRadius: 20,
                transition: "all 0.15s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F8FAFC";
                e.currentTarget.style.borderColor = "#CBD5E1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = profileOpen ? "#EFF6FF" : "#FFFFFF";
                e.currentTarget.style.borderColor = "#E2E8F0";
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: role === "bidder" ? "#F0FDF4" : "#EFF6FF",
                  color: role === "bidder" ? "#16A34A" : "#2563EB",
                  border: role === "bidder" ? "1px solid #BBF7D0" : "1px solid #BFDBFE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.02em"
                }}
              >
                {role === "bidder" ? "SE" : "AG"}
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>
                  {role === "bidder" ? activeBidder?.name?.split(" ")[0] || "Shakti" : "Akshay Gupta"}
                </div>
                <div style={{ fontSize: 10.5, color: "#64748B", lineHeight: 1.2 }}>
                  {role === "bidder" ? "Vendor Portal" : "Procurement Officer"}
                </div>
              </div>
              <ChevronDown size={14} style={{ color: "#64748B", marginLeft: 2 }} />
            </button>

            {profileOpen && (
              <div
                className="anim-modal"
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: 240,
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: 12,
                  boxShadow: "var(--shadow-dropdown)",
                  zIndex: 50,
                  padding: "6px"
                }}
              >
                {role === "bidder" ? (
                  <>
                    <div style={{ padding: "8px 10px 10px", borderBottom: "1px solid #E2E8F0", marginBottom: 6 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>
                        {activeBidder?.name}
                      </div>
                      <div style={{ fontSize: 11, color: "#64748B" }}>GSTIN: {activeBidder?.gstin}</div>
                      <span className="badge badge-green" style={{ marginTop: 4 }}>
                        Registered Vendor / MSME
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        switchRole("procurement");
                        onNavigate?.("dashboard");
                        showToast({
                          type: "info",
                          title: "Officer Mode Active",
                          message: "Returned to Procurement Officer Console."
                        });
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 10px",
                        background: "#EFF6FF",
                        border: "1px solid #BFDBFE",
                        borderRadius: 8,
                        fontSize: 12.5,
                        color: "#2563EB",
                        fontWeight: 700,
                        cursor: "pointer",
                        textAlign: "left",
                        marginBottom: 6
                      }}
                    >
                      <ShieldCheck size={14} style={{ color: "#2563EB" }} /> Switch to Officer Console
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ padding: "8px 10px 10px", borderBottom: "1px solid #E2E8F0", marginBottom: 6 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Akshay Gupta</div>
                      <div style={{ fontSize: 11, color: "#64748B" }}>akshay.gupta@cpcl.gov.in</div>
                      <span className="badge badge-blue" style={{ marginTop: 4 }}>
                        Supervisory Officer
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        switchRole("bidder");
                        onNavigate?.("bidder-portal");
                        showToast({
                          type: "info",
                          title: "Bidder Portal Active",
                          message: "Viewing vendor portal as Shakti Enterprises Pvt Ltd."
                        });
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 10px",
                        background: "#F0FDF4",
                        border: "1px solid #BBF7D0",
                        borderRadius: 8,
                        fontSize: 12.5,
                        color: "#15803D",
                        fontWeight: 700,
                        cursor: "pointer",
                        textAlign: "left",
                        marginBottom: 6
                      }}
                    >
                      <Building2 size={14} style={{ color: "#16A34A" }} /> Switch to Bidder Portal
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onNavigate?.("users-roles");
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    background: "none",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 12.5,
                    color: "#334155",
                    cursor: "pointer",
                    textAlign: "left"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  <User size={14} style={{ color: "#64748B" }} /> My Profile
                </button>

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onNavigate?.("system-settings");
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    background: "none",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 12.5,
                    color: "#334155",
                    cursor: "pointer",
                    textAlign: "left"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  <Settings size={14} style={{ color: "#64748B" }} /> Preferences
                </button>

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    setHelpOpen(true);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    background: "none",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 12.5,
                    color: "#334155",
                    cursor: "pointer",
                    textAlign: "left"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  <LifeBuoy size={14} style={{ color: "#64748B" }} /> Help & Support
                </button>

                <div style={{ height: 1, background: "#E2E8F0", margin: "4px 0" }} />

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout?.();
                    showToast({
                      type: "info",
                      title: "Session Terminated",
                      message: "Signed out securely."
                    });
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    background: "none",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 12.5,
                    color: "#DC2626",
                    fontWeight: 700,
                    cursor: "pointer",
                    textAlign: "left"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FEF2F2")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── COMMAND PALETTE MODAL (⌘ K) ─────────────────────────────────── */}
      {paletteOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "12vh",
            zIndex: 100
          }}
          onClick={() => setPaletteOpen(false)}
        >
          <div
            className="anim-modal"
            style={{
              width: 600,
              maxWidth: "92vw",
              background: "#FFFFFF",
              borderRadius: 14,
              boxShadow: "0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1)",
              overflow: "hidden",
              border: "1px solid #E2E8F0"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 18px",
                borderBottom: "1px solid #E2E8F0",
                background: "#FFFFFF"
              }}
            >
              <Search size={18} style={{ color: "#2563EB" }} />
              <input
                ref={paletteInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDownPalette}
                placeholder="Type to search tenders, bidders, documents, compliance cases..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: 14,
                  color: "#0F172A",
                  background: "transparent"
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}
                >
                  <X size={14} />
                </button>
              )}
              <kbd
                style={{
                  fontSize: 11,
                  color: "#64748B",
                  background: "#F1F5F9",
                  border: "1px solid #E2E8F0",
                  padding: "2px 6px",
                  borderRadius: 4
                }}
              >
                ESC
              </kbd>
            </div>

            {/* Results Grouped by Category */}
            <div style={{ maxHeight: 380, overflowY: "auto", padding: "10px" }}>
              {categorizedResults.length === 0 ? (
                <div style={{ padding: "36px 16px", textAlign: "center", color: "#64748B" }}>
                  <Search size={28} style={{ margin: "0 auto 8px", color: "#64748B" }} />
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#0F172A" }}>No results found</div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
                    Try searching for &quot;Valve&quot;, &quot;Noble&quot;, &quot;Turnover&quot;, or &quot;GST&quot;
                  </div>
                </div>
              ) : (
                categorizedResults.map((group) => {
                  const Icon = group.icon;
                  return (
                    <div key={group.category} style={{ marginBottom: 12 }}>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#2563EB",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          padding: "4px 10px 6px",
                          display: "flex",
                          alignItems: "center",
                          gap: 6
                        }}
                      >
                        <Icon size={12} /> {group.category}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {group.items.map((item) => {
                          cumulativeIndex += 1;
                          const isCurrent = cumulativeIndex === selectedIndex;

                          return (
                            <div
                              key={item.id}
                              onClick={() => handleSelectResult(item)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyItems: "space-between",
                                justifyContent: "space-between",
                                padding: "8px 12px",
                                borderRadius: 8,
                                cursor: "pointer",
                                background: isCurrent ? "#EFF6FF" : "transparent",
                                transition: "background 0.12s"
                              }}
                              onMouseEnter={() => setSelectedIndex(cumulativeIndex)}
                            >
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {item.title}
                                </div>
                                <div style={{ fontSize: 11.5, color: "#64748B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {item.subtitle}
                                </div>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: 12 }}>
                                {item.badge && (
                                  <span
                                    style={{
                                      fontSize: 10.5,
                                      fontWeight: 600,
                                      color: item.badgeColor,
                                      background: item.badgeColor + "15",
                                      border: `1px solid ${item.badgeColor}33`,
                                      padding: "2px 8px",
                                      borderRadius: 99
                                    }}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                                <ArrowRight size={13} style={{ color: "#2563EB" }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer / Shortcuts */}
            <div
              style={{
                padding: "8px 16px",
                background: "#F8FAFC",
                borderTop: "1px solid #E2E8F0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 11,
                color: "#64748B"
              }}
            >
              <div style={{ display: "flex", gap: 12 }}>
                <span><kbd style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", padding: "1px 4px", borderRadius: 3 }}>↑</kbd> <kbd style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", padding: "1px 4px", borderRadius: 3 }}>↓</kbd> Navigate</span>
                <span><kbd style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", padding: "1px 4px", borderRadius: 3 }}>↵</kbd> Select</span>
                <span><kbd style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", padding: "1px 4px", borderRadius: 3 }}>esc</kbd> Dismiss</span>
              </div>
              <span style={{ color: "#2563EB", fontWeight: 600 }}>CPCL Search</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
