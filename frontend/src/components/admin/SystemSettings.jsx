"use client";
import React, { useState } from "react";
import { Sliders, Shield, Save, Check } from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";
import PageHeader from "@/components/common/PageHeader";

export default function SystemSettings({ onNavigate }) {
  const { showToast } = useToast();
  const [ocrThreshold, setOcrThreshold] = useState(75);
  const [apiTimeout, setApiTimeout] = useState(5000);
  const [autoFlagging, setAutoFlagging] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [sandboxMode, setSandboxMode] = useState(false);
  const [auditRetentionYears, setAuditRetentionYears] = useState(7);
  const [digestEmail, setDigestEmail] = useState("akshay.gupta@cpcl.gov.in");

  const handleSave = (e) => {
    e.preventDefault();
    showToast({
      type: "success",
      title: "System Configuration Saved",
      message: "Security and platform thresholds successfully updated in CPCL configuration registry."
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Header */}
      <PageHeader
        title="System Settings & Governance"
        subtitle="Manage algorithmic verification thresholds, statutory audit policies, and integration safeguards."
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={handleSave} className="btn btn-primary btn-sm">
            <Save size={13} /> Save Configuration
          </button>
        </div>
      </PageHeader>

      <form onSubmit={handleSave} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Card 1: AI & OCR Parameters */}
        <div className="saas-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Sliders size={18} color="#1d4ed8" />
            <h3 className="section-title">AI Document Verification Settings</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <label className="form-label" style={{ margin: 0 }}>Minimum OCR Confidence Threshold</label>
                <span style={{ fontSize: "12.5px", fontWeight: 800, color: "#1d4ed8" }}>{ocrThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={ocrThreshold}
                onChange={(e) => setOcrThreshold(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#1d4ed8" }}
              />
              <span style={{ fontSize: "11.5px", color: "#64748b", marginTop: "4px", display: "block" }}>
                Submissions extracted with confidence below this threshold route to human review.
              </span>
            </div>

            <div>
              <label className="form-label">Sovereign Gateway Timeout (ms)</label>
              <input
                type="number"
                value={apiTimeout}
                onChange={(e) => setApiTimeout(Number(e.target.value))}
                className="form-input"
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid #f1f5f9" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>Automated Anomaly Detection</div>
                <div style={{ fontSize: "11.5px", color: "#64748b" }}>Flag correlated turnover patterns and historical debarment records</div>
              </div>
              <input
                type="checkbox"
                checked={autoFlagging}
                onChange={(e) => setAutoFlagging(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "#1d4ed8", cursor: "pointer" }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Security & Statutory Compliance */}
        <div className="saas-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Shield size={18} color="#16a34a" />
            <h3 className="section-title">Statutory Audit & Security Policies</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label className="form-label">Audit Log Cryptographic Retention Period</label>
              <select
                value={auditRetentionYears}
                onChange={(e) => setAuditRetentionYears(Number(e.target.value))}
                className="form-input"
              >
                <option value={5}>5 Years (Standard Central Procurement)</option>
                <option value={7}>7 Years (CAG / Ministry Statutory Rule)</option>
                <option value={10}>10 Years (Strategic Petroleum & Defense Works)</option>
                <option value={99}>Permanent / Immutable Ledger Archive</option>
              </select>
            </div>

            <div>
              <label className="form-label">Procurement Officer Digest Recipient</label>
              <input
                type="email"
                value={digestEmail}
                onChange={(e) => setDigestEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid #f1f5f9" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>Mandatory 2FA (Aadhaar OTP / PKI)</div>
                <div style={{ fontSize: "11.5px", color: "#64748b" }}>Require multi-factor authorization for binding tender approvals</div>
              </div>
              <input
                type="checkbox"
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "#16a34a", cursor: "pointer" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid #f1f5f9" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>Integration Sandbox Mode</div>
                <div style={{ fontSize: "11.5px", color: "#64748b" }}>Simulate live sovereign gateways for officer training</div>
              </div>
              <input
                type="checkbox"
                checked={sandboxMode}
                onChange={(e) => setSandboxMode(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "#d97706", cursor: "pointer" }}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
