"use client";
import React, { useState } from "react";
import { Scale, Play, CheckCircle, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";
import PageHeader from "@/components/common/PageHeader";

const DEFAULT_RULES = [
  { id: "RULE-GST-01", name: "GST Status & Name Consistency", expression: 'gst_status == "Active" && similarity(gst_name, pan_name) >= 0.90', category: "Statutory", source: "GSTN Verification API", failureAction: "Disqualify", active: true, tolerance: "90% string match" },
  { id: "RULE-PAN-01", name: "PAN Verification & Active Legal Entity", expression: 'pan_status == "VALID" && pan_holder_status == "INCORPORATED"', category: "Statutory", source: "Income Tax API", failureAction: "Disqualify", active: true, tolerance: "Exact match" },
  { id: "RULE-TURN-01", name: "Turnover Exceeds Minimum Bid Value", expression: "average(turnover_fy22, turnover_fy23, turnover_fy24) >= tender_min_turnover", category: "Financial", source: "Audited ITR Statements", failureAction: "Disqualify", active: true, tolerance: "0% shortfall" },
  { id: "RULE-OEM-01", name: "OEM Authorization Validity Period", expression: "oem_auth_present == true && oem_auth_expiry >= tender_end_date + 90", category: "Technical", source: "OEM Authorization Letter", failureAction: "Query", active: true, tolerance: "+90 days buffer" },
  { id: "RULE-BLK-01", name: "CERSAI Blacklisting & Debarment Check", expression: "cersai_blacklisted == false && mca_strike_off == false", category: "Integrity", source: "CERSAI Central Registry", failureAction: "Disqualify", active: true, tolerance: "Zero tolerance" },
  { id: "RULE-MII-01", name: "Make in India Local Content Tier", expression: "local_content_percentage >= tender_local_content_requirement", category: "Policy", source: "MII Chartered Declaration", failureAction: "Manual Review", active: true, tolerance: "Class-I (≥50%)" }
];

export default function ComplianceRulesEngine({ onNavigate }) {
  const { showToast } = useToast();
  const [rules, setRules] = useState(DEFAULT_RULES);
  const [testResult, setTestResult] = useState(null);

  const handleToggleRule = (id) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
    showToast({
      type: "info",
      title: "Rule Configuration Updated",
      message: "Deterministic compliance rule state updated."
    });
  };

  const handleRunTest = () => {
    setTestResult("Evaluating sample payload against 6 deterministic rules...");
    setTimeout(() => {
      setTestResult("Test complete: 5 rules PASSED, 1 rule triggered REVIEW (Udyam fuzzy threshold at 88%).");
      showToast({
        type: "success",
        title: "Rules Simulator Complete",
        message: "Evaluated 6 rules in 32ms with deterministic guarantees."
      });
    }, 550);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Header */}
      <PageHeader
        title="Deterministic Compliance Rules Engine"
        subtitle="Deterministic, zero-hallucination verification logic evaluated on extracted bidder credentials."
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={handleRunTest} className="btn btn-primary btn-sm">
            <Play size={13} /> Simulate Rules Engine
          </button>
        </div>
      </PageHeader>

      {/* Philosophy Banner */}
      <div
        style={{
          background: "#f0f7ff",
          border: "1px solid #bfdbfe",
          borderRadius: "10px",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}
      >
        <Scale size={20} color="#1d4ed8" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: "12.5px", color: "#1e3a8a", lineHeight: 1.5 }}>
          <strong>Deterministic Guarantee:</strong> In sovereign procurement, compliance is binary and auditable.
          AI is strictly restricted to OCR and field extraction. The <strong>Deterministic Rules Engine</strong> executes strict mathematical
          and boolean logic against statutory thresholds. Final legal authority remains with the Procurement Officer.
        </div>
      </div>

      {testResult && (
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #86efac",
            borderRadius: "8px",
            padding: "10px 14px",
            fontSize: "12px",
            color: "#166534",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <span>{testResult}</span>
          <button onClick={() => setTestResult(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#166534", fontSize: "11px", fontWeight: 700 }}>
            Dismiss
          </button>
        </div>
      )}

      {/* Rules Table */}
      <div className="saas-table-container">
        <table className="saas-table">
          <thead>
            <tr>
              <th style={{ width: "130px" }}>Rule ID</th>
              <th>Rule Name & Boolean Logic</th>
              <th>Data Source</th>
              <th>Tolerance</th>
              <th>Failure Action</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id}>
                <td style={{ fontFamily: "monospace", fontWeight: 700, color: "#1d4ed8", fontSize: "12px" }}>
                  {rule.id}
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: "#0f172a" }}>{rule.name}</div>
                  <code style={{ fontSize: "11px", color: "#6d28d9", background: "#f8fafc", padding: "2px 6px", borderRadius: 4, display: "inline-block", marginTop: 3 }}>
                    {rule.expression}
                  </code>
                </td>
                <td style={{ fontSize: "12px", color: "#475569" }}>{rule.source}</td>
                <td style={{ fontSize: "12px", color: "#64748b" }}>{rule.tolerance}</td>
                <td>
                  <span
                    className={`badge ${
                      rule.failureAction === "Disqualify"
                        ? "badge-red"
                        : rule.failureAction === "Query"
                        ? "badge-blue"
                        : "badge-amber"
                    }`}
                  >
                    {rule.failureAction}
                  </span>
                </td>
                <td>
                  <span className={`badge ${rule.active ? "badge-green" : "badge-gray"}`}>
                    {rule.active ? "Enforced" : "Paused"}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <button
                    onClick={() => handleToggleRule(rule.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: "11.5px" }}
                  >
                    {rule.active ? "Pause" : "Enforce"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
