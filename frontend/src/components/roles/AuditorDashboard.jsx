"use client";
import {
  Eye,
  Download,
  Scale,
  ChevronRight,
  Lock,
  BookOpen,
  Shield
} from "lucide-react";
import { AUDIT_TRAIL } from "@/lib/data";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
const DECISIONS = [
  { tender: "CPCL/VALVE/2025/001", bidder: "ABC Engineering Pvt Ltd", decision: "Qualified", officer: "Akshay Gupta", date: "10 Sep 2026, 10:05 AM", compliance: 94, risk: "Low", evidence: 12 },
  { tender: "CPCL/ESD/2025/042", bidder: "Noble Industrials", decision: "Disqualified", officer: "Akshay Gupta", date: "09 Sep 2026, 03:12 PM", compliance: 23, risk: "Critical", evidence: 8 },
  { tender: "CPCL/MNT/2025/063", bidder: "Global Petro Solutions", decision: "Qualified", officer: "Akshay Gupta", date: "08 Sep 2026, 11:40 AM", compliance: 98, risk: "Low", evidence: 14 },
  { tender: "CPCL/INST/2025/017", bidder: "Shakti Enterprises", decision: "Under Review", officer: "Akshay Gupta", date: "07 Sep 2026, 09:55 AM", compliance: 71, risk: "Medium", evidence: 9 },
  { tender: "CPCL/VALVE/2025/001", bidder: "ArcTech Systems", decision: "Qualified", officer: "Akshay Gupta", date: "10 Sep 2026, 10:42 AM", compliance: 86, risk: "Low", evidence: 13 }
];
const AUDIT_STATS_TREND = [
  { month: "Apr", decisions: 28, audits: 22 },
  { month: "May", decisions: 34, audits: 30 },
  { month: "Jun", decisions: 41, audits: 38 },
  { month: "Jul", decisions: 38, audits: 35 },
  { month: "Aug", decisions: 52, audits: 48 },
  { month: "Sep", decisions: 42, audits: 39 }
];
const D_CONFIG = {
  Qualified: { bg: "#dcfce7", text: "#15803d", icon: "\u2705" },
  Disqualified: { bg: "#fee2e2", text: "#b91c1c", icon: "\u274C" },
  "Under Review": { bg: "#fef3c7", text: "#b45309", icon: "\u23F3" },
  "Clarification Requested": { bg: "#dbeafe", text: "#1e40af", icon: "\u2753" }
};
const R_CONFIG = {
  Low: { bg: "#dcfce7", text: "#15803d" },
  Medium: { bg: "#fef3c7", text: "#b45309" },
  High: { bg: "#fee2e2", text: "#b91c1c" },
  Critical: { bg: "#fee2e2", text: "#7f1d1d" }
};
export default function AuditorDashboard({ onNavigate }) {
  return <div>
      {
    /* Read-Only Banner */
  }
      <div style={{
    background: "#fffbeb",
    border: "1px solid #fcd34d",
    borderRadius: 10,
    padding: "10px 16px",
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
    gap: 12
  }}>
        <Lock size={16} style={{ color: "#b45309", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#b45309" }}>Read-Only Access</span>
          <span style={{ fontSize: 12, color: "#78350f", marginLeft: 8 }}>
            Auditors can view all data, decisions, and evidence but cannot modify any records.
          </span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, background: "#fef3c7", color: "#b45309", padding: "3px 10px", borderRadius: 99, border: "1px solid #fcd34d" }}>
          📋 READ ONLY
        </span>
      </div>

      {
    /* Header */
  }
      <div style={{
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 20,
    background: "linear-gradient(135deg, #1c1400 0%, #3d2e00 60%, #b45309 100%)",
    padding: "28px 32px",
    position: "relative"
  }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 8 }}>
              Procurement Transparency Center
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "white", lineHeight: 1.2, marginBottom: 8 }}>
              Procurement Audit &<br />Transparency Dashboard
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", maxWidth: 440 }}>
              Review all procurement decisions, verify evidence chains, and ensure compliance with government procurement rules.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, minWidth: 280 }}>
            {[
    { label: "Decisions Recorded", value: "247", icon: "\u2696\uFE0F" },
    { label: "Cases Audited", value: "191", icon: "\u{1F4CB}" },
    { label: "Pending Audits", value: "56", icon: "\u23F3" },
    { label: "High-Risk Decisions", value: "12", icon: "\u26A0\uFE0F" }
  ].map((s, i) => <div key={i} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 20 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "white", marginTop: 4 }}>{s.value}</div>
                <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.55)" }}>{s.label}</div>
              </div>)}
          </div>
        </div>
      </div>

      {
    /* KPI Row */
  }
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
    { label: "Total Decisions", value: "247", sub: "All time", icon: "\u2696\uFE0F", color: "#b45309" },
    { label: "Qualified Bids", value: "194", sub: "78.5%", icon: "\u2705", color: "#16a34a" },
    { label: "Disqualified", value: "41", sub: "16.6%", icon: "\u274C", color: "#dc2626" },
    { label: "Under Review", value: "12", sub: "4.9%", icon: "\u23F3", color: "#1d4ed8" },
    { label: "Audit Exceptions", value: "3", sub: "Need attention", icon: "\u{1F6A8}", color: "#dc2626" }
  ].map((k, i) => <div key={i} className="card" style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{k.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}>{k.label}</div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{k.sub}</div>
          </div>)}
      </div>

      {
    /* Main grid */
  }
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>
        {
    /* Decisions Table */
  }
        <div className="card">
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between" }}>
            <div>
              <div className="section-title">Procurement Decisions</div>
              <div className="section-subtitle">All officer decisions with evidence</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost btn-sm" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Download size={12} /> Export
              </button>
            </div>
          </div>
          <table className="data-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Bidder</th>
                <th>Tender</th>
                <th>Decision</th>
                <th>Compliance</th>
                <th>Risk</th>
                <th>Officer</th>
                <th>Date</th>
                <th>Evidence</th>
              </tr>
            </thead>
            <tbody>
              {DECISIONS.map((d, i) => {
    const dc = D_CONFIG[d.decision] || D_CONFIG.Qualified;
    const rc = R_CONFIG[d.risk] || R_CONFIG.Low;
    return <tr key={i}>
                    <td><span style={{ fontSize: 13, fontWeight: 600 }}>{d.bidder}</span></td>
                    <td><span style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>{d.tender}</span></td>
                    <td>
                      <span style={{ fontSize: 11, fontWeight: 700, background: dc.bg, color: dc.text, padding: "2px 8px", borderRadius: 99 }}>
                        {dc.icon} {d.decision}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div className="progress" style={{ width: 50 }}>
                          <div className="progress-fill" style={{ width: `${d.compliance}%`, background: d.compliance >= 80 ? "#16a34a" : d.compliance >= 60 ? "#d97706" : "#dc2626" }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: d.compliance >= 80 ? "#15803d" : d.compliance >= 60 ? "#b45309" : "#b91c1c" }}>{d.compliance}%</span>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 11, fontWeight: 700, background: rc.bg, color: rc.text, padding: "2px 8px", borderRadius: 99 }}>{d.risk}</span></td>
                    <td><span style={{ fontSize: 12 }}>{d.officer}</span></td>
                    <td><span style={{ fontSize: 11, color: "#64748b" }}>{d.date}</span></td>
                    <td>
                      <button className="btn btn-ghost btn-xs" style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <Eye size={10} /> {d.evidence} docs
                      </button>
                    </td>
                  </tr>;
  })}
            </tbody>
          </table>
        </div>

        {
    /* Audit trend chart */
  }
        <div>
          <div className="card" style={{ padding: "20px", marginBottom: 16 }}>
            <div className="section-title" style={{ marginBottom: 4 }}>Decision & Audit Trend</div>
            <div className="section-subtitle" style={{ marginBottom: 14 }}>Monthly procurement decisions vs audits completed</div>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={AUDIT_STATS_TREND} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="decGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b45309" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#b45309" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="audGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Area type="monotone" dataKey="decisions" stroke="#b45309" fill="url(#decGrad)" strokeWidth={2} name="Decisions" />
                <Area type="monotone" dataKey="audits" stroke="#1d4ed8" fill="url(#audGrad)" strokeWidth={2} name="Audits" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {
    /* Quick access */
  }
          <div className="card" style={{ padding: "16px" }}>
            <div className="label-xs" style={{ marginBottom: 12 }}>Quick Access</div>
            {[
    { label: "Full Audit Trail", icon: <BookOpen size={14} />, section: "audit-trail" },
    { label: "All Decisions", icon: <Scale size={14} />, section: "auditor-decisions" },
    { label: "Compliance Evidence", icon: <Shield size={14} />, section: "auditor-evidence" },
    { label: "Download Report", icon: <Download size={14} />, section: "auditor-exports" }
  ].map((a, i) => <button key={i} onClick={() => onNavigate(a.section)} style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
    padding: "9px 12px",
    borderRadius: 8,
    border: "none",
    background: "#f8fafc",
    cursor: "pointer",
    fontSize: 12.5,
    fontWeight: 600,
    color: "#334155",
    marginBottom: 6,
    transition: "background 0.12s"
  }}>
                <span style={{ color: "#64748b" }}>{a.icon}</span>
                {a.label}
                <ChevronRight size={12} style={{ marginLeft: "auto", color: "#cbd5e1" }} />
              </button>)}
          </div>
        </div>
      </div>

      {
    /* Audit Timeline */
  }
      <div className="card" style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div className="section-title">Procurement Evidence Timeline</div>
            <div className="section-subtitle">CPCL/VALVE/2025/001 — ABC Engineering Pvt Ltd — Complete record</div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Download size={12} /> Export Timeline
          </button>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 21, top: 0, bottom: 0, width: 2, background: "#e2e8f0" }} />
          {AUDIT_TRAIL.map((event, i) => {
    const isDecision = event.type === "decision";
    const colorMap = {
      upload: "#1d4ed8",
      ai: "#7c3aed",
      submit: "#16a34a",
      ocr: "#0891b2",
      verify: "#16a34a",
      alert: "#dc2626",
      compliance: "#d97706",
      review: "#7c3aed",
      decision: "#0f172a"
    };
    const iconMap = {
      upload: "\u{1F4E4}",
      ai: "\u{1F916}",
      submit: "\u{1F4DD}",
      ocr: "\u{1F50D}",
      verify: "\u2705",
      alert: "\u26A0\uFE0F",
      compliance: "\u{1F4CA}",
      review: "\u{1F464}",
      decision: "\u2696\uFE0F"
    };
    return <div key={i} style={{ display: "flex", gap: 14, marginBottom: 16, position: "relative" }}>
                <div style={{
      width: 42,
      height: 42,
      borderRadius: "50%",
      flexShrink: 0,
      background: isDecision ? "#0f172a" : colorMap[event.type] + "18",
      border: `2px solid ${colorMap[event.type]}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 16,
      zIndex: 1
    }}>
                  {iconMap[event.type] || "\u25CF"}
                </div>
                <div style={{
      flex: 1,
      background: isDecision ? "#0f172a" : "white",
      border: `1px solid ${isDecision ? "#0f172a" : "#f1f5f9"}`,
      borderRadius: 10,
      padding: "11px 16px",
      cursor: "pointer"
    }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isDecision ? "white" : "#0f172a" }}>{event.event}</div>
                      <div style={{ fontSize: 12, color: isDecision ? "rgba(255,255,255,0.6)" : "#64748b", marginTop: 2 }}>{event.detail}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: isDecision ? "rgba(255,255,255,0.8)" : "#334155" }}>{event.time}</div>
                      <div style={{ marginTop: 4 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, background: "#f1f5f9", color: "#64748b", padding: "1px 6px", borderRadius: 99 }}>{event.role}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, color: isDecision ? "rgba(255,255,255,0.5)" : "#94a3b8" }}>by {event.user}</div>
                </div>
              </div>;
  })}
        </div>
      </div>
    </div>;
}
