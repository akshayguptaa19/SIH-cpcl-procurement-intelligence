"use client";
import { useState } from "react";
import { Shield, Eye, EyeOff, ArrowRight, Lock, User } from "lucide-react";
const DEMO_ROLES = [
  {
    id: "procurement",
    label: "Procurement Officer",
    icon: "\u2696\uFE0F",
    desc: "Manage tenders, review bids, make final decisions",
    color: "#1e40af",
    bg: "#dbeafe",
    border: "#93c5fd",
    email: "akshay.gupta@cpcl.gov.in"
  },
  {
    id: "verification",
    label: "Verification Officer",
    icon: "\u{1F50D}",
    desc: "Verify documents, resolve mismatches, process cases",
    color: "#15803d",
    bg: "#dcfce7",
    border: "#86efac",
    email: "ravi.kumar@cpcl.gov.in"
  },
  {
    id: "analyst",
    label: "AI / Compliance Analyst",
    icon: "\u{1F916}",
    desc: "Monitor AI accuracy, review anomalies, validate findings",
    color: "#6d28d9",
    bg: "#ede9fe",
    border: "#c4b5fd",
    email: "priya.sharma@cpcl.gov.in"
  },
  {
    id: "admin",
    label: "Administrator",
    icon: "\u{1F6E1}\uFE0F",
    desc: "Manage users, configure system, monitor infrastructure",
    color: "#b91c1c",
    bg: "#fee2e2",
    border: "#fca5a5",
    email: "admin@cpcl.gov.in"
  },
  {
    id: "auditor",
    label: "Auditor",
    icon: "\u{1F4CB}",
    desc: "Read-only access to audit trails and decision evidence",
    color: "#b45309",
    bg: "#fef3c7",
    border: "#fcd34d",
    email: "auditor@cpcl.gov.in"
  },
  {
    id: "bidder",
    label: "Bidder / Vendor",
    icon: "\u{1F3E2}",
    desc: "Submit bids, upload documents, track verification status",
    color: "#0369a1",
    bg: "#e0f2fe",
    border: "#7dd3fc",
    email: "abc@abcengineering.com"
  }
];
export default function LoginPage({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("demo@1234");
  const handleLogin = async () => {
    if (!selectedRole) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    onLogin(selectedRole.id);
  };
  return <div style={{
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0d1b3e 0%, #1e3a6e 50%, #0d1b3e 100%)",
    display: "flex",
    alignItems: "stretch"
  }}>
      {
    /* Left panel */
  }
      <div style={{
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "60px 64px",
    background: "rgba(255,255,255,0.02)",
    borderRight: "1px solid rgba(255,255,255,0.06)"
  }}>
        {
    /* Logo */
  }
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#94a3b8" }}>
                Ministry of Petroleum
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
    width: 48,
    height: 48,
    borderRadius: 12,
    background: "linear-gradient(135deg, #1d4ed8, #7c3aed)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    fontWeight: 900,
    color: "white"
  }}>G</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "white", lineHeight: 1.1 }}>GeM BidVerify</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>AI Compliance Platform · v2.0</div>
            </div>
          </div>
        </div>

        {
    /* Hero text */
  }
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 38, fontWeight: 900, color: "white", lineHeight: 1.15, marginBottom: 16 }}>
            Smarter Compliance<br />for a Stronger India
          </h1>
          <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.7, maxWidth: 440 }}>
            AI-powered bid verification for GeM procurement. Transparent decisions. Evidence-backed compliance. Human accountability.
          </p>
        </div>

        {
    /* Features */
  }
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
    { icon: "\u{1F916}", text: "AI document understanding & extraction" },
    { icon: "\u2696\uFE0F", text: "Deterministic compliance rules engine" },
    { icon: "\u{1F3DB}\uFE0F", text: "Government source verification (GST, PAN, MCA)" },
    { icon: "\u{1F512}", text: "Immutable audit trail & evidence chain" }
  ].map((f, i) => <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{f.icon}</span>
              <span style={{ fontSize: 14, color: "#94a3b8" }}>{f.text}</span>
            </div>)}
        </div>

        {
    /* India badge */
  }
        <div style={{
    marginTop: 64,
    padding: "10px 16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    display: "inline-flex",
    alignItems: "center",
    gap: 10
  }}>
          <span style={{ fontSize: 20 }}>🇮🇳</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "white" }}>Smart India Hackathon 2025</div>
            <div style={{ fontSize: 10, color: "#64748b" }}>Problem Statement 26100 — CPCL / MoPNG</div>
          </div>
        </div>
      </div>

      {
    /* Right panel — Login form */
  }
      <div style={{
    width: 520,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "60px 48px",
    background: "rgba(255,255,255,0.03)"
  }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "white", marginBottom: 6 }}>Sign In</h2>
          <p style={{ fontSize: 13, color: "#64748b" }}>Select your role to access the platform</p>
        </div>

        {
    /* Role selector */
  }
        <div style={{ marginBottom: 24 }}>
          <div className="label-xs" style={{ marginBottom: 10, color: "#64748b" }}>Select Role (Demo)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {DEMO_ROLES.map((role) => <button
    key={role.id}
    onClick={() => setSelectedRole(role)}
    style={{
      padding: "10px 12px",
      borderRadius: 10,
      cursor: "pointer",
      border: `1.5px solid ${selectedRole?.id === role.id ? role.border : "rgba(255,255,255,0.08)"}`,
      background: selectedRole?.id === role.id ? role.bg + "22" : "rgba(255,255,255,0.04)",
      textAlign: "left",
      transition: "all 0.15s"
    }}
  >
                <div style={{ fontSize: 18, marginBottom: 4 }}>{role.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: selectedRole?.id === role.id ? role.color : "#e2e8f0", lineHeight: 1.3 }}>
                  {role.label}
                </div>
                <div style={{ fontSize: 10, color: "#64748b", marginTop: 2, lineHeight: 1.4 }}>{role.desc}</div>
              </button>)}
          </div>
        </div>

        {
    /* Email */
  }
        <div style={{ marginBottom: 14 }}>
          <label className="label-xs" style={{ display: "block", marginBottom: 6, color: "#64748b" }}>Email</label>
          <div style={{ position: "relative" }}>
            <User size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
            <input
    value={selectedRole?.email || ""}
    readOnly
    placeholder="Select a role to fill"
    style={{
      width: "100%",
      padding: "10px 12px 10px 34px",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 8,
      fontSize: 13,
      color: "#e2e8f0",
      outline: "none"
    }}
  />
          </div>
        </div>

        {
    /* Password */
  }
        <div style={{ marginBottom: 24 }}>
          <label className="label-xs" style={{ display: "block", marginBottom: 6, color: "#64748b" }}>Password</label>
          <div style={{ position: "relative" }}>
            <Lock size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
            <input
    type={showPwd ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    style={{
      width: "100%",
      padding: "10px 40px 10px 34px",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 8,
      fontSize: 13,
      color: "#e2e8f0",
      outline: "none"
    }}
  />
            <button
    onClick={() => setShowPwd(!showPwd)}
    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
  >
              {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {
    /* Login button */
  }
        <button
    onClick={handleLogin}
    disabled={!selectedRole || loading}
    style={{
      width: "100%",
      padding: "12px",
      borderRadius: 10,
      border: "none",
      background: selectedRole ? `linear-gradient(135deg, ${selectedRole.color}, #7c3aed)` : "#334155",
      color: "white",
      fontSize: 14,
      fontWeight: 700,
      cursor: selectedRole ? "pointer" : "not-allowed",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      transition: "all 0.2s",
      boxShadow: selectedRole ? "0 4px 20px rgba(29,78,216,0.3)" : "none"
    }}
  >
          {loading ? <>
              <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%" }} className="anim-spin" />
              Signing in...
            </> : <>
              Sign In <ArrowRight size={16} />
            </>}
        </button>

        {
    /* Security notice */
  }
        <div style={{ marginTop: 24, padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, display: "flex", gap: 8, alignItems: "center" }}>
          <Shield size={13} style={{ color: "#64748b", flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>
            Secured with JWT authentication. All actions are logged to the immutable audit trail.
          </span>
        </div>

        <div style={{ marginTop: 32, textAlign: "center", fontSize: 11, color: "#475569" }}>
          GeM BidVerify Platform · Government of India · MoPNG
        </div>
      </div>
    </div>;
}
