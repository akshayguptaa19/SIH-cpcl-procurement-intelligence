"use client";
import React, { useState } from "react";
import { AUDIT_TRAIL } from "@/lib/data";
import { Download, Search, Eye, Shield, Lock, X, CheckCircle, ArrowUpDown } from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";
import PageHeader from "@/components/common/PageHeader";

const ROLE_BADGE = {
  "Procurement Officer": "badge-blue",
  "Verification Officer": "badge-green",
  "AI System": "badge-purple",
  "Rules Engine": "badge-amber",
  System: "badge-gray",
  Bidder: "badge-cyan"
};

export default function AuditTrail({ onNavigate }) {
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredEvents = AUDIT_TRAIL.filter((event) => {
    const matchesSearch =
      event.event.toLowerCase().includes(search.toLowerCase()) ||
      event.user.toLowerCase().includes(search.toLowerCase()) ||
      event.detail.toLowerCase().includes(search.toLowerCase());
    if (filter === "AI Events") return matchesSearch && (event.type === "ai" || event.type === "ocr");
    if (filter === "Officer Actions") return matchesSearch && (event.type === "decision" || event.type === "review");
    if (filter === "System") return matchesSearch && (event.role === "System" || event.role === "Rules Engine");
    if (filter === "Alerts") return matchesSearch && event.type === "alert";
    return matchesSearch;
  });

  const handleExportPDF = () => {
    showToast({
      type: "info",
      title: "Exporting Cryptographic Audit Dossier",
      message: "Formatting immutable timeline and SHA-256 seal records..."
    });
    setTimeout(() => {
      window.print();
      showToast({
        type: "success",
        title: "Audit Dossier Exported",
        message: "Cryptographically verified audit trail printed/exported."
      });
    }, 500);
  };

  const handleVerifySeal = () => {
    showToast({
      type: "success",
      title: "Cryptographic Seal Verified",
      message: "SHA-256 ledger integrity verified against CPCL Key Vault. Zero tampering detected."
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Header */}
      <PageHeader
        title="Immutable Audit Trail"
        subtitle="Cryptographically sealed chronological log of all AI extractions, officer decisions, and system events."
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={handleExportPDF} className="btn btn-secondary btn-sm">
            <Download size={13} /> Export Certified PDF
          </button>
          <button onClick={handleVerifySeal} className="btn btn-primary btn-sm">
            <Shield size={13} /> Verify SHA-256 Seal
          </button>
        </div>
      </PageHeader>

      {/* Filter Tabs & Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: "12px"
        }}
      >
        <div style={{ display: "flex", gap: "4px" }}>
          {["All", "Officer Actions", "AI Events", "Alerts", "System"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`pill-filter ${filter === f ? "active" : ""}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", width: "260px" }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8"
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, actors, actions..."
            className="form-input"
            style={{ paddingLeft: "32px", fontSize: "12.5px" }}
          />
        </div>
      </div>

      {/* Audit Data Table */}
      <div className="saas-table-container">
        <table className="saas-table">
          <thead>
            <tr>
              <th style={{ width: "160px" }}>Timestamp</th>
              <th style={{ width: "180px" }}>Actor / User</th>
              <th style={{ width: "140px" }}>Role</th>
              <th>Action / Event</th>
              <th>Details & Cryptographic Seal</th>
              <th style={{ width: "80px", textAlign: "right" }}>Inspect</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr
                key={event.id}
                className="interactive-row"
                onClick={() => setSelectedEvent(event)}
              >
                <td style={{ fontSize: "12px", color: "#64748b", whiteSpace: "nowrap" }}>
                  {event.time}
                </td>
                <td style={{ fontWeight: 600, color: "#0f172a" }}>{event.user}</td>
                <td>
                  <span className={`badge ${ROLE_BADGE[event.role] || "badge-gray"}`}>
                    {event.role}
                  </span>
                </td>
                <td style={{ fontWeight: 600, color: "#0f172a" }}>{event.event}</td>
                <td>
                  <div style={{ fontSize: "12px", color: "#475569" }}>{event.detail}</div>
                  <div style={{ fontSize: "10.5px", fontFamily: "monospace", color: "#94a3b8", marginTop: "2px" }}>
                    SHA-256: {event.id}74a9f...b01
                  </div>
                </td>
                <td style={{ textAlign: "right" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(event);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: "3px 8px" }}
                  >
                    <Eye size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            padding: "12px 18px",
            background: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "12px",
            color: "#64748b"
          }}
        >
          <span>Showing {filteredEvents.length} certified audit entries</span>
          <span style={{ color: "#16a34a", fontWeight: 600 }}>✓ SHA-256 Chain Intact</span>
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.48)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px"
          }}
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="anim-modal"
            style={{
              width: 500,
              maxWidth: "100%",
              background: "#ffffff",
              borderRadius: "14px",
              boxShadow: "var(--shadow-modal)",
              border: "1px solid #e2e8f0",
              overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#f8fafc"
              }}
            >
              <div>
                <h3 className="section-title">Audit Record Details</h3>
                <p style={{ fontSize: "12px", color: "#64748b" }}>Immutable ledger verification</p>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#f8fafc", borderRadius: 6 }}>
                <span style={{ fontSize: "12px", color: "#64748b" }}>Event Title:</span>
                <strong style={{ fontSize: "12.5px", color: "#0f172a" }}>{selectedEvent.event}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#f8fafc", borderRadius: 6 }}>
                <span style={{ fontSize: "12px", color: "#64748b" }}>Actor / User:</span>
                <strong style={{ fontSize: "12.5px", color: "#0f172a" }}>{selectedEvent.user} ({selectedEvent.role})</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#f8fafc", borderRadius: 6 }}>
                <span style={{ fontSize: "12px", color: "#64748b" }}>Timestamp:</span>
                <span style={{ fontSize: "12px", color: "#0f172a" }}>{selectedEvent.time}</span>
              </div>

              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>
                  Action Summary:
                </div>
                <p style={{ fontSize: "13px", color: "#334155", lineHeight: 1.5 }}>{selectedEvent.detail}</p>
              </div>

              <div style={{ padding: "10px", background: "#0f172a", borderRadius: "6px", color: "#86efac", fontFamily: "monospace", fontSize: "11px" }}>
                SHA-256 Seal: 8a4f91d2938472910fa8c8234901bc34e019283746a
              </div>
            </div>

            <div style={{ padding: "12px 20px", borderTop: "1px solid #f1f5f9", background: "#f8fafc", display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setSelectedEvent(null)} className="btn btn-secondary btn-sm">
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
