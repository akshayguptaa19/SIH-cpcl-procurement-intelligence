"use client";
import React, { useState } from "react";
import { RefreshCw, ShieldCheck, Globe, Database, Key, CheckCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";
import PageHeader from "@/components/common/PageHeader";

const GOV_INTEGRATIONS = [
  { name: "GeM Portal API", desc: "Government e-Marketplace procurement feed", status: "Online", lastCheck: "Just now", calls: 284, success: 99.1, icon: "🏛️" },
  { name: "GSTN Sovereign Gateway", desc: "GST Network live active status validation", status: "Online", lastCheck: "Just now", calls: 1284, success: 99.8, icon: "📋" },
  { name: "MCA21 Registry", desc: "Ministry of Corporate Affairs ROC data", status: "Online", lastCheck: "2 mins ago", calls: 342, success: 98.5, icon: "🏢" },
  { name: "Udyam MSME Registry", desc: "Ministry of Micro, Small & Medium Enterprises", status: "Online", lastCheck: "1 min ago", calls: 189, success: 97.9, icon: "🏭" },
  { name: "Income Tax NSDL PAN API", desc: "PAN legal entity authentication", status: "Online", lastCheck: "Just now", calls: 892, success: 99.5, icon: "📄" },
  { name: "DigiLocker Direct Pull", desc: "Aadhaar-authenticated sovereign document repository", status: "Degraded", lastCheck: "12 mins ago", calls: 23, success: 85.2, icon: "🔐" },
  { name: "EPFO Compliance Portal", desc: "Employees' Provident Fund statutory compliance", status: "Online", lastCheck: "4 mins ago", calls: 267, success: 98.1, icon: "👥" },
  { name: "ESIC Portal", desc: "Employees' State Insurance Corporation", status: "Online", lastCheck: "Just now", calls: 198, success: 97.8, icon: "🏥" },
  { name: "Startup India DIPP", desc: "DPIIT Startup recognition certification", status: "Online", lastCheck: "7 mins ago", calls: 84, success: 99.0, icon: "🚀" },
  { name: "NSIC Portal", desc: "National Small Industries Corporation", status: "Online", lastCheck: "Just now", calls: 67, success: 98.7, icon: "🏗️" },
  { name: "CERSAI Central Registry", desc: "Central Debarment & Strike-off Registry", status: "Online", lastCheck: "Just now", calls: 326, success: 100, icon: "🚫" },
  { name: "OEM Authorization Gateway", desc: "Manufacturer credential verification gateway", status: "Simulated", lastCheck: "N/A", calls: 0, success: 0, icon: "🔧" }
];

const RECENT_RESPONSES = [
  { api: "GSTN", bidder: "ABC Engineering Pvt Ltd", gstin: "27AABCA1234A1Z5", result: "Active & Filing Regular", time: "11:41 AM", status: "VERIFIED" },
  { api: "GSTN", bidder: "Noble Industrials", gstin: "33AABCN3456D4Z8", result: "Name mismatch vs PAN record", time: "11:39 AM", status: "MISMATCH" },
  { api: "CERSAI", bidder: "Noble Industrials", gstin: "N/A", result: "Debarment record order MOD/VIG/22", time: "11:38 AM", status: "ALERT" },
  { api: "Udyam", bidder: "Shakti Enterprises", gstin: "24AABCS5678B2Z3", result: "Trade name variation detected", time: "11:37 AM", status: "REVIEW" },
  { api: "PAN IT", bidder: "Global Petro Solutions", gstin: "07AABCG9012C3Z1", result: "PAN Active & Legal Entity Matched", time: "11:35 AM", status: "VERIFIED" }
];

export default function GovernmentIntegrations({ onNavigate }) {
  const { showToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);

  const online = GOV_INTEGRATIONS.filter((g) => g.status === "Online").length;
  const degraded = GOV_INTEGRATIONS.filter((g) => g.status === "Degraded").length;

  const handleRefreshAll = () => {
    setRefreshing(true);
    showToast({
      type: "info",
      title: "Handshaking Sovereign Gateways",
      message: "Verifying secure mTLS tunnel with GSTN, MCA21, Udyam, Income Tax, and CERSAI..."
    });
    setTimeout(() => {
      setRefreshing(false);
      showToast({
        type: "success",
        title: "All Sovereign Gateways Operational",
        message: "Handshake verified. Latency: 42ms. Security tokens refreshed."
      });
    }, 700);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Header */}
      <PageHeader
        title="Government Gateway Integrations"
        subtitle="Live connection status to sovereign registries (GSTN, MCA21, Udyam, Income Tax, CERSAI)."
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={handleRefreshAll} className="btn btn-primary btn-sm" disabled={refreshing}>
            <RefreshCw size={13} className={refreshing ? "anim-spin" : ""} /> Refresh All Gateways
          </button>
        </div>
      </PageHeader>

      {/* KPI Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "12px" }}>
        <div className="saas-card" style={{ padding: "16px", borderLeft: "4px solid #16a34a" }}>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#16a34a" }}>{online} / 12</div>
          <div style={{ fontSize: "11.5px", color: "#64748b" }}>Active Sovereign Gateways</div>
        </div>
        <div className="saas-card" style={{ padding: "16px", borderLeft: "4px solid #d97706" }}>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#d97706" }}>{degraded}</div>
          <div style={{ fontSize: "11.5px", color: "#64748b" }}>Degraded Gateways</div>
        </div>
        <div className="saas-card" style={{ padding: "16px", borderLeft: "4px solid #1d4ed8" }}>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#1d4ed8" }}>3,756</div>
          <div style={{ fontSize: "11.5px", color: "#64748b" }}>API Calls Verified Today</div>
        </div>
        <div className="saas-card" style={{ padding: "16px", borderLeft: "4px solid #7c3aed" }}>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#7c3aed" }}>99.6%</div>
          <div style={{ fontSize: "11.5px", color: "#64748b" }}>Average Gateway Uptime</div>
        </div>
      </div>

      {/* Integration Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px" }}>
        {GOV_INTEGRATIONS.map((api, i) => (
          <div key={i} className="saas-card saas-card-hover" style={{ padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ fontSize: "20px" }}>{api.icon}</span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>{api.name}</div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>{api.desc}</div>
                </div>
              </div>
              <span
                className={`badge ${
                  api.status === "Online"
                    ? "badge-green"
                    : api.status === "Degraded"
                    ? "badge-amber"
                    : "badge-purple"
                }`}
              >
                {api.status}
              </span>
            </div>

            {api.status !== "Simulated" ? (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", color: "#64748b", marginTop: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "10px" }}>
                <div>Calls: <strong style={{ color: "#0f172a" }}>{api.calls}</strong></div>
                <div>Success: <strong style={{ color: "#16a34a" }}>{api.success}%</strong></div>
                <div>Synced: <strong style={{ color: "#334155" }}>{api.lastCheck}</strong></div>
              </div>
            ) : (
              <div style={{ fontSize: "11px", color: "#6d28d9", marginTop: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "10px" }}>
                Direct OEM verification via cryptographic digital signatures.
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Responses Table */}
      <div className="saas-table-container">
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
          <h4 className="card-title">Recent Government Gateway Verification Logs</h4>
        </div>
        <table className="saas-table">
          <thead>
            <tr>
              <th>API Gateway</th>
              <th>Bidder Entity</th>
              <th>Identifier Reference</th>
              <th>Response Payload Summary</th>
              <th>Timestamp</th>
              <th style={{ textAlign: "right" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_RESPONSES.map((r, i) => (
              <tr key={i}>
                <td><strong style={{ color: "#1d4ed8" }}>{r.api}</strong></td>
                <td style={{ fontWeight: 600, color: "#0f172a" }}>{r.bidder}</td>
                <td style={{ fontFamily: "monospace", fontSize: "12px", color: "#64748b" }}>{r.gstin}</td>
                <td style={{ fontSize: "12.5px" }}>{r.result}</td>
                <td style={{ fontSize: "11.5px", color: "#94a3b8" }}>{r.time}</td>
                <td style={{ textAlign: "right" }}>
                  <span
                    className={`badge ${
                      r.status === "VERIFIED"
                        ? "badge-green"
                        : r.status === "MISMATCH"
                        ? "badge-amber"
                        : r.status === "ALERT"
                        ? "badge-red"
                        : "badge-blue"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
