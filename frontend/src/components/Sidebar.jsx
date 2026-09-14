"use client";
import React from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  Files,
  ShieldCheck,
  ClipboardList,
  AlertTriangle,
  Brain,
  BarChart3,
  ShieldAlert,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Building2,
  ArrowLeftRight
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProcurement } from "@/context/ProcurementContext";

// Official Government e-Marketplace (GeM) Logo
function GeMLogo({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
      aria-label="Government e-Marketplace Logo"
    >
      <rect width="44" height="44" rx="10" fill="#0F172A" />
      <path d="M9 22L19 12L23 16L13 26L9 22Z" fill="#F97316" />
      <path d="M19 12L31 12L35 22L23 22L19 12Z" fill="#2563EB" />
      <path d="M23 22L35 22L31 32L19 32L23 22Z" fill="#10B981" />
      <path d="M13 26L23 26L19 32L9 32L13 26Z" fill="#F59E0B" />
      <circle cx="22" cy="22" r="3.5" fill="#FFFFFF" />
      <circle cx="22" cy="22" r="1.5" fill="#0F172A" />
    </svg>
  );
}

const SAAS_NAV_SECTIONS = [
  {
    title: "OVERVIEW",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard }
    ]
  },
  {
    title: "PROCUREMENT",
    items: [
      { id: "tenders", label: "Tenders", icon: FileText },
      { id: "bidders", label: "Bidders", icon: Users },
      { id: "documents", label: "Documents", icon: Files, linkId: "document-verification" }
    ]
  },
  {
    title: "VERIFICATION",
    items: [
      { id: "document-verification", label: "Document Verification", icon: ShieldCheck, badge: 12 },
      { id: "compliance-checks", label: "Compliance Checks", icon: ClipboardList, badge: 5 },
      { id: "red-flags", label: "Red Flags", icon: AlertTriangle, badge: 3, badgeVariant: "danger", linkId: "risk-analysis" }
    ]
  },
  {
    title: "INTELLIGENCE",
    items: [
      { id: "ai-insights", label: "AI Insights", icon: Brain },
      { id: "risk-analysis", label: "Risk Analysis", icon: ShieldAlert },
      { id: "reports", label: "Reports", icon: BarChart3 }
    ]
  },
  {
    title: "GOVERNANCE",
    items: [
      { id: "audit-trail", label: "Audit Trail", icon: BookOpen }
    ]
  }
];

const BIDDER_NAV_SECTIONS = [
  {
    title: "MY WORKSPACE",
    items: [
      { id: "bidder-portal", label: "My Applications", icon: LayoutDashboard },
      { id: "bidder-portal", label: "Browse Tenders", icon: FileText }
    ]
  }
];

export default function Sidebar({
  role: propRole = "procurement",
  activeSection = "dashboard",
  onNavigate,
  collapsed = false,
  onToggleCollapse
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const contextProc = useProcurement();
  const role = contextProc?.role || propRole;
  const switchRole = contextProc?.switchRole || (() => {});
  const activeBidder = contextProc?.activeBidder || { name: "Shakti Enterprises Pvt Ltd" };

  const pathSection = location?.pathname ? location.pathname.split("/")[1] : "";
  const resolvedSection = pathSection || activeSection;
  const currentSection = resolvedSection.startsWith("tender-")
    ? "tenders"
    : resolvedSection.startsWith("bidder-")
    ? "bidders"
    : resolvedSection;
  const navSections = role === "bidder" ? BIDDER_NAV_SECTIONS : SAAS_NAV_SECTIONS;

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: collapsed ? 64 : 280,
        background: "#FFFFFF",
        borderRight: "1px solid #E4E7EC",
        display: "flex",
        flexDirection: "column",
        zIndex: 40,
        transition: "width 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        userSelect: "none",
        boxShadow: "1px 0 3px rgba(16, 24, 40, 0.04)"
      }}
      aria-label="Sidebar Navigation"
    >
      {/* Top Header / Branding */}
      <div
        style={{
          height: 60,
          display: "flex",
          alignItems: "center",
          padding: collapsed ? "0 14px" : "0 18px",
          borderBottom: "1px solid #E4E7EC",
          gap: 12,
          background: "#FFFFFF"
        }}
      >
        <GeMLogo size={34} />
        {!collapsed && (
          <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#101828",
                letterSpacing: "-0.01em",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <span>GeM BidVerify</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#2563EB",
                  background: "#EFF8FF",
                  padding: "1px 6px",
                  borderRadius: 4,
                  border: "1px solid #D1E9FF"
                }}
              >
                AI
              </span>
            </div>
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 500,
                color: "#667085",
                lineHeight: 1.2
              }}
            >
              Government e-Marketplace
            </div>
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <nav
        style={{
          flex: 1,
          overflowY: "auto",
          padding: collapsed ? "14px 6px" : "14px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}
      >
        {navSections.map((section, idx) => (
          <div key={idx}>
            {!collapsed && (
              <div
                style={{
                  padding: "0 10px",
                  marginBottom: 6,
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "#667085",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase"
                }}
              >
                {section.title}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const targetId = item.linkId || item.id;
                const isActive = currentSection === item.id || (item.linkId && currentSection === item.linkId);

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === "red-flags") {
                        onNavigate?.("risk-analysis");
                        navigate("/risk-analysis");
                      } else if (item.id === "documents") {
                        onNavigate?.("document-verification");
                        navigate("/document-verification");
                      } else {
                        onNavigate?.(targetId);
                        navigate(`/${targetId}`);
                      }
                    }}
                    title={collapsed ? item.label : undefined}
                    style={{
                      position: "relative",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: collapsed ? "center" : "space-between",
                      gap: 10,
                      padding: collapsed ? "10px 0" : "8px 12px",
                      borderRadius: 8,
                      border: "none",
                      borderLeft: isActive && !collapsed ? "3px solid #2563EB" : "3px solid transparent",
                      background: isActive ? "#EFF8FF" : "transparent",
                      color: isActive ? "#155EEF" : "#475467",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      textAlign: "left"
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "#F9FAFB";
                        e.currentTarget.style.color = "#101828";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#475467";
                      }
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        minWidth: 0
                      }}
                    >
                      <Icon
                        size={17}
                        style={{
                          color: isActive ? "#155EEF" : "#667085",
                          flexShrink: 0
                        }}
                      />
                      {!collapsed && (
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: isActive ? 600 : 500,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                        >
                          {item.label}
                        </span>
                      )}
                    </div>

                    {!collapsed && item.badge !== undefined && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "1px 7px",
                          borderRadius: 99,
                          backgroundColor:
                            item.badgeVariant === "danger"
                              ? "#FEF3F2"
                              : isActive
                              ? "#D1E9FF"
                              : "#F2F4F7",
                          color:
                            item.badgeVariant === "danger"
                              ? "#D92D20"
                              : isActive
                              ? "#155EEF"
                              : "#475467",
                          border:
                            item.badgeVariant === "danger"
                              ? "1px solid #FECDCA"
                              : "1px solid transparent"
                        }}
                      >
                        {item.badge}
                      </span>
                    )}

                    {collapsed && item.badge !== undefined && (
                      <span
                        style={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor:
                            item.badgeVariant === "danger" ? "#D92D20" : "#155EEF"
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Role Switcher Drawer Button */}
      <div style={{ padding: "8px 12px", borderTop: "1px solid #F2F4F7" }}>
        {role === "bidder" ? (
          <button
            onClick={() => {
              switchRole("procurement");
              onNavigate?.("dashboard");
              navigate("/dashboard");
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 8,
              background: "#F8FAFC",
              border: "1px solid #E4E7EC",
              borderRadius: 8,
              padding: "8px 12px",
              color: "#344054",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
            title="Return to Officer Console"
          >
            <ArrowLeftRight size={14} />
            {!collapsed && <span>Officer Console</span>}
          </button>
        ) : (
          <button
            onClick={() => {
              switchRole("bidder");
              onNavigate?.("bidder-portal");
              navigate("/bidder-portal");
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 8,
              background: "#F8FAFC",
              border: "1px solid #E4E7EC",
              borderRadius: 8,
              padding: "8px 12px",
              color: "#344054",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#EFF8FF";
              e.currentTarget.style.borderColor = "#D1E9FF";
              e.currentTarget.style.color = "#155EEF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#F8FAFC";
              e.currentTarget.style.borderColor = "#E4E7EC";
              e.currentTarget.style.color = "#344054";
            }}
            title="Open Bidder Portal"
          >
            <Building2 size={15} color="#155EEF" />
            {!collapsed && <span>Bidder Portal</span>}
          </button>
        )}
      </div>

      {/* Bottom: Officer Profile Card */}
      <div
        style={{
          padding: collapsed ? "10px 8px" : "12px 14px",
          borderTop: "1px solid #E4E7EC",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: 10,
          background: "#FFFFFF"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: "#EFF8FF",
              border: "1px solid #D1E9FF",
              color: "#155EEF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 12,
              flexShrink: 0
            }}
          >
            AG
          </div>
          {!collapsed && (
            <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: "#101828",
                  lineHeight: 1.2
                }}
              >
                Akshay Gupta
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#667085"
                }}
              >
                Senior Procurement Officer
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            background: "#F8FAFC",
            border: "1px solid #E4E7EC",
            borderRadius: 6,
            color: "#667085",
            width: 26,
            height: 26,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            transition: "all 0.15s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#101828";
            e.currentTarget.style.background = "#F2F4F7";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#667085";
            e.currentTarget.style.background = "#F8FAFC";
          }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </aside>
  );
}
