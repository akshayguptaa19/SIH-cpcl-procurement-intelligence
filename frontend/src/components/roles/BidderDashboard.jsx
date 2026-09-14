"use client";
import { useState } from "react";
import {
  Search,
  Upload,
  AlertTriangle
} from "lucide-react";
const AVAILABLE_TENDERS = [
  { id: "CPCL/VALVE/2025/001", name: "Supply of Industrial Valves", deadline: "15 Sep 2026", days: 5, category: "Engineering Equipment", bidders: 41, status: "Published", my: true },
  { id: "CPCL/ESD/2025/042", name: "ESD Systems & Accessories", deadline: "18 Sep 2026", days: 8, category: "Safety Systems", bidders: 27, status: "Published", my: false },
  { id: "CPCL/INST/2025/017", name: "Instrumentation & Control Equipment", deadline: "22 Sep 2026", days: 12, category: "Instruments", bidders: 35, status: "Published", my: false },
  { id: "CPCL/MNT/2025/063", name: "Refinery Maintenance Services", deadline: "25 Sep 2026", days: 15, category: "Services", bidders: 55, status: "Published", my: true }
];
const MY_DOCS = [
  { name: "GST Certificate", status: "Verified", icon: "\u{1F4C4}", color: "#16a34a", bg: "#dcfce7", note: "Valid \u2014 Matches GSTN records" },
  { name: "PAN Card", status: "Verified", icon: "\u{1F4C4}", color: "#16a34a", bg: "#dcfce7", note: "Valid \u2014 Income Tax verified" },
  { name: "Udyam Registration", status: "Verified", icon: "\u{1F4C4}", color: "#16a34a", bg: "#dcfce7", note: "Valid \u2014 MSME portal verified" },
  { name: "ITR FY 2024-25", status: "Verified", icon: "\u{1F4C4}", color: "#16a34a", bg: "#dcfce7", note: "Turnover \u20B912.4 Cr \u2014 Passes threshold" },
  { name: "Experience Certificate", status: "Verified", icon: "\u{1F4C4}", color: "#16a34a", bg: "#dcfce7", note: "4.5 years petroleum sector experience" },
  { name: "Turnover Certificate", status: "Needs Correction", icon: "\u26A0\uFE0F", color: "#b45309", bg: "#fef3c7", note: "Please resubmit \u2014 Document blurred (Page 2)" },
  { name: "OEM Authorization", status: "Missing", icon: "\u274C", color: "#b91c1c", bg: "#fee2e2", note: "Required \u2014 Not yet submitted" },
  { name: "EPFO Compliance", status: "Verified", icon: "\u{1F4C4}", color: "#16a34a", bg: "#dcfce7", note: "Active compliance verified" }
];
const CLARIFICATIONS = [
  { id: "CLR001", tender: "CPCL/VALVE/2025/001", question: "Please confirm OEM authorization is from the original manufacturer, not a sub-dealer.", from: "Procurement Officer", date: "09 Sep 2026", urgent: true, answered: false },
  { id: "CLR002", tender: "CPCL/VALVE/2025/001", question: "Please resubmit Turnover Certificate (Page 2 appears blurred/illegible).", from: "Verification Officer", date: "08 Sep 2026", urgent: true, answered: false },
  { id: "CLR003", tender: "CPCL/MNT/2025/063", question: "Confirm that experience certificate covers maintenance work in petroleum refineries.", from: "Procurement Officer", date: "06 Sep 2026", urgent: false, answered: true }
];
const DOC_STATUS_CONFIG = {
  Verified: { bg: "#dcfce7", text: "#15803d", icon: "\u2705", desc: "Government-verified" },
  "Needs Correction": { bg: "#fef3c7", text: "#b45309", icon: "\u26A0\uFE0F", desc: "Action required" },
  Missing: { bg: "#fee2e2", text: "#b91c1c", icon: "\u274C", desc: "Not submitted" },
  Processing: { bg: "#dbeafe", text: "#1e40af", icon: "\u{1F504}", desc: "Under verification" },
  "Under Review": { bg: "#ede9fe", text: "#6d28d9", icon: "\u{1F441}\uFE0F", desc: "Manual review" },
  Rejected: { bg: "#fee2e2", text: "#7f1d1d", icon: "\u{1F6AB}", desc: "Rejected" }
};
export default function BidderDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("overview");
  const verified = MY_DOCS.filter((d) => d.status === "Verified").length;
  const missing = MY_DOCS.filter((d) => d.status === "Missing").length;
  const correction = MY_DOCS.filter((d) => d.status === "Needs Correction").length;
  const progress = Math.round(verified / MY_DOCS.length * 100);
  const unanswered = CLARIFICATIONS.filter((c) => !c.answered).length;
  return <div>
      {
    /* Header — Bidder Workspace */
  }
      <div style={{
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 20,
    background: "linear-gradient(135deg, #0d1f2a 0%, #0369a1 100%)",
    padding: "28px 32px",
    position: "relative"
  }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 8 }}>
              My Procurement Workspace
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "white", lineHeight: 1.2, marginBottom: 8 }}>
              ABC Engineering Pvt Ltd
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>
              GSTIN: 27AABCA1234A1Z5 · PAN: AABCA1234A · MSME Class II
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ background: "white", color: "#0369a1", border: "none", padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Search size={14} /> Find New Tenders
              </button>
              <button style={{ background: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.2)", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Upload Document
              </button>
            </div>
          </div>

          {
    /* My bid status */
  }
          <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "18px 20px", minWidth: 240 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 10 }}>📊 MY BID STATUS</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Completion</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: "white" }}>{progress}%</span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 3, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "#34d399", borderRadius: 3 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "#34d399" }}>✓ {verified} Verified</span>
              <span style={{ fontSize: 11, color: "#fbbf24" }}>⚠ {correction} Action</span>
              <span style={{ fontSize: 11, color: "#f87171" }}>✕ {missing} Missing</span>
            </div>
          </div>
        </div>
      </div>

      {
    /* Action Required Banner */
  }
      {(missing > 0 || correction > 0 || unanswered > 0) && <div style={{
    background: "#fff8f8",
    border: "1px solid #fca5a5",
    borderRadius: 10,
    padding: "14px 18px",
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 14
  }}>
          <AlertTriangle size={20} style={{ color: "#dc2626", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#b91c1c", marginBottom: 2 }}>⚡ Action Required</div>
            <div style={{ fontSize: 12, color: "#7f1d1d" }}>
              {missing > 0 && <span style={{ marginRight: 12 }}>• {missing} document(s) not yet submitted</span>}
              {correction > 0 && <span style={{ marginRight: 12 }}>• {correction} document(s) need correction</span>}
              {unanswered > 0 && <span>• {unanswered} clarification(s) awaiting your response</span>}
            </div>
          </div>
          <button style={{ background: "#dc2626", color: "white", border: "none", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            Complete Now
          </button>
        </div>}

      {
    /* Main Grid */
  }
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, marginBottom: 20 }}>
        {
    /* Document Status — Main Panel */
  }
        <div className="card">
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div className="section-title">Document Status — CPCL/VALVE/2025/001</div>
              <div className="section-subtitle">Industrial Valve Supply · Deadline: 15 Sep 2026 (5 days)</div>
            </div>
            <button className="btn btn-primary btn-sm" style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Upload size={12} /> Upload
            </button>
          </div>

          <div style={{ padding: "16px 20px" }}>
            {MY_DOCS.map((doc, i) => {
    const sc = DOC_STATUS_CONFIG[doc.status] || DOC_STATUS_CONFIG.Verified;
    return <div key={i} style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 14px",
      background: sc.bg + "33",
      border: `1px solid ${sc.bg}`,
      borderRadius: 10,
      marginBottom: 8,
      cursor: "pointer",
      transition: "opacity 0.15s"
    }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{sc.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{doc.name}</div>
                    <div style={{ fontSize: 11.5, color: sc.text, marginTop: 2 }}>{doc.note}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, background: sc.bg, color: sc.text, padding: "2px 8px", borderRadius: 99, border: `1px solid ${sc.text}44`, flexShrink: 0 }}>
                    {doc.status}
                  </span>
                  {doc.status !== "Verified" && <button style={{ fontSize: 11, background: doc.status === "Missing" ? "#dc2626" : "#d97706", color: "white", border: "none", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontWeight: 700, flexShrink: 0 }}>
                      {doc.status === "Missing" ? "Upload" : "Resubmit"}
                    </button>}
                </div>;
  })}
          </div>
        </div>

        {
    /* Right sidebar */
  }
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {
    /* Clarifications */
  }
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="section-title">Clarifications</div>
                {unanswered > 0 && <span style={{ background: "#dc2626", color: "white", fontSize: 10, fontWeight: 800, padding: "1px 6px", borderRadius: 99 }}>{unanswered}</span>}
              </div>
            </div>
            {CLARIFICATIONS.map((c, i) => <div key={i} style={{
    padding: "12px 16px",
    borderBottom: "1px solid #f8fafc",
    background: !c.answered ? "#fffbeb" : "transparent"
  }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontFamily: "monospace", color: "#94a3b8" }}>{c.tender}</span>
                  {c.urgent && !c.answered && <span style={{ fontSize: 10, fontWeight: 700, background: "#fee2e2", color: "#b91c1c", padding: "1px 5px", borderRadius: 99 }}>URGENT</span>}
                  {c.answered && <span style={{ fontSize: 10, fontWeight: 700, background: "#dcfce7", color: "#15803d", padding: "1px 5px", borderRadius: 99 }}>ANSWERED</span>}
                </div>
                <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.5, marginBottom: 6 }}>{c.question}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: c.answered ? 0 : 6 }}>From: {c.from} · {c.date}</div>
                {!c.answered && <button style={{ fontSize: 11, background: "#1d4ed8", color: "white", border: "none", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
                    Respond Now
                  </button>}
              </div>)}
          </div>

          {
    /* My Active Tenders */
  }
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
              <div className="section-title">My Active Tenders</div>
            </div>
            {AVAILABLE_TENDERS.filter((t) => t.my).map((t, i) => <div key={i} style={{
    padding: "12px 16px",
    borderBottom: "1px solid #f8fafc",
    cursor: "pointer"
  }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>{t.name}</div>
                <div style={{ fontSize: 10, fontFamily: "monospace", color: "#94a3b8", marginBottom: 6 }}>{t.id}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#64748b" }}>Deadline: {t.deadline}</span>
                  <span style={{
    fontSize: 10.5,
    fontWeight: 700,
    color: t.days <= 5 ? "#b91c1c" : t.days <= 10 ? "#b45309" : "#15803d",
    background: t.days <= 5 ? "#fee2e2" : t.days <= 10 ? "#fef3c7" : "#dcfce7",
    padding: "2px 7px",
    borderRadius: 99
  }}>{t.days}d left</span>
                </div>
              </div>)}
          </div>
        </div>
      </div>

      {
    /* Available Tenders */
  }
      <div className="card">
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between" }}>
          <div>
            <div className="section-title">Available Tenders</div>
            <div className="section-subtitle">Open tenders matching your profile — CPCL / MoPNG</div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Search size={12} /> Find More
          </button>
        </div>
        <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {AVAILABLE_TENDERS.map((t, i) => <div key={i} className="card card-hover" style={{ padding: "16px 18px", borderColor: t.my ? "#93c5fd" : "#e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>{t.name}</div>
                  <div style={{ fontSize: 10, fontFamily: "monospace", color: "#94a3b8" }}>{t.id}</div>
                </div>
                {t.my && <span style={{ fontSize: 10, fontWeight: 700, background: "#dbeafe", color: "#1e40af", padding: "2px 7px", borderRadius: 99, flexShrink: 0 }}>Applied</span>}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: "#64748b" }}>📁 {t.category}</span>
                <span style={{ fontSize: 11, color: "#64748b" }}>👥 {t.bidders} bidders</span>
                <span style={{ fontSize: 11, color: "#64748b" }}>📅 {t.deadline}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {t.my ? <button style={{ fontSize: 12, background: "#1d4ed8", color: "white", border: "none", padding: "6px 14px", borderRadius: 7, cursor: "pointer", fontWeight: 600 }}>
                    View My Bid
                  </button> : <button style={{ fontSize: 12, background: "#f1f5f9", color: "#334155", border: "none", padding: "6px 14px", borderRadius: 7, cursor: "pointer", fontWeight: 600 }}>
                    Apply Now
                  </button>}
                <button style={{ fontSize: 12, background: "transparent", color: "#64748b", border: "1px solid #e2e8f0", padding: "6px 10px", borderRadius: 7, cursor: "pointer" }}>
                  View Details
                </button>
              </div>
            </div>)}
        </div>
      </div>

      {
    /* Bidder Notice */
  }
      <div style={{
    marginTop: 16,
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: 10,
    padding: "12px 16px",
    display: "flex",
    gap: 10,
    alignItems: "center"
  }}>
        <span style={{ fontSize: 16 }}>ℹ️</span>
        <span style={{ fontSize: 12, color: "#1e40af" }}>
          Your documents are verified by AI and cross-checked against government sources (GST, PAN, Udyam, etc.). The Procurement Officer makes the final qualification decision. You will be notified of any status changes.
        </span>
      </div>
    </div>;
}
