"use client";
import React, { useState } from "react";
import { Plus, X, FileText, Check, Sliders, Database, Layers } from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";
import PageHeader from "@/components/common/PageHeader";

const INITIAL_DOCS = [
  { id: "DOC-01", name: "Goods & Services Tax (GST) Certificate", code: "GST_CERT", category: "Statutory", mandatory: true, verifyingApi: "GSTN API", ocrConfidenceThreshold: 85 },
  { id: "DOC-02", name: "Permanent Account Number (PAN) Card", code: "PAN_CARD", category: "Statutory", mandatory: true, verifyingApi: "Income Tax NSDL API", ocrConfidenceThreshold: 90 },
  { id: "DOC-03", name: "Udyam Registration Certificate (MSME)", code: "UDYAM_MSME", category: "Statutory", mandatory: false, verifyingApi: "Udyam Portal API", ocrConfidenceThreshold: 80 },
  { id: "DOC-04", name: "Audited Annual Turnover Statement (3 FY)", code: "FIN_TURNOVER", category: "Financial", mandatory: true, verifyingApi: "MCA21 / IT Returns", ocrConfidenceThreshold: 85 },
  { id: "DOC-05", name: "Original Equipment Manufacturer (OEM) Authorization", code: "OEM_AUTH", category: "Technical", mandatory: true, verifyingApi: "OEM Registry / Manual", ocrConfidenceThreshold: 75 },
  { id: "DOC-06", name: "Make in India (Class-I / Class-II) Self-Declaration", code: "MII_DECLARATION", category: "Policy", mandatory: true, verifyingApi: "DPIIT Guideline Checker", ocrConfidenceThreshold: 80 },
  { id: "DOC-07", name: "Employees' Provident Fund (EPFO) Clearance", code: "EPFO_COMPLIANCE", category: "Statutory", mandatory: false, verifyingApi: "EPFO Portal", ocrConfidenceThreshold: 80 }
];

export default function MasterData({ onNavigate }) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("docs");
  const [docs, setDocs] = useState(INITIAL_DOCS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [newDocCategory, setNewDocCategory] = useState("Statutory");
  const [newDocMandatory, setNewDocMandatory] = useState(true);

  const handleAddDoc = (e) => {
    e.preventDefault();
    if (!newDocName.trim()) return;
    const newDoc = {
      id: `DOC-0${docs.length + 1}`,
      name: newDocName,
      code: newDocName.toUpperCase().replace(/\s+/g, "_").slice(0, 12),
      category: newDocCategory,
      mandatory: newDocMandatory,
      verifyingApi: "Internal Deterministic OCR",
      ocrConfidenceThreshold: 80
    };
    setDocs([...docs, newDoc]);
    setShowAddModal(false);
    setNewDocName("");
    showToast({
      type: "success",
      title: "Master Data Updated",
      message: `Registered document type "${newDocName}" into compliance catalog.`
    });
  };

  const handleToggleMandatory = (id) => {
    setDocs(docs.map((d) => (d.id === id ? { ...d, mandatory: !d.mandatory } : d)));
    showToast({
      type: "info",
      title: "Requirement Rule Updated",
      message: "Mandatory compliance flag toggled for this document."
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Header */}
      <PageHeader
        title="Master Data Catalog"
        subtitle="Manage standard procurement document taxonomies, statutory requirements, and threshold parameters."
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm">
            <Plus size={14} /> Add Document Type
          </button>
        </div>
      </PageHeader>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
        {[
          { id: "docs", label: "Document Types Catalog" },
          { id: "categories", label: "Requirement Categories" },
          { id: "thresholds", label: "Procurement Thresholds" }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`pill-filter ${activeTab === t.id ? "active" : ""}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Document Types */}
      {activeTab === "docs" && (
        <div className="saas-table-container">
          <table className="saas-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Document Name</th>
                <th>Category</th>
                <th>Mandatory</th>
                <th>Verifying Sovereign Gateway</th>
                <th>Min OCR Threshold</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontFamily: "monospace", fontSize: "12px", color: "#1d4ed8" }}>{d.code}</td>
                  <td style={{ fontWeight: 600, color: "#0f172a" }}>{d.name}</td>
                  <td><span className="badge badge-gray">{d.category}</span></td>
                  <td>
                    <span className={`badge ${d.mandatory ? "badge-red" : "badge-green"}`}>
                      {d.mandatory ? "Mandatory" : "Optional"}
                    </span>
                  </td>
                  <td style={{ fontSize: "12px", color: "#475569" }}>{d.verifyingApi}</td>
                  <td><span className="badge badge-purple">{d.ocrConfidenceThreshold}%</span></td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      onClick={() => handleToggleMandatory(d.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: "11px" }}
                    >
                      Toggle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Categories */}
      {activeTab === "categories" && (
        <div className="saas-card" style={{ padding: "20px" }}>
          <h4 className="card-title" style={{ marginBottom: "12px" }}>Requirement Taxonomy & Policy Weights</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px" }}>
            {[
              { name: "Statutory Criteria", desc: "Taxation, corporate identity, and anti-fraud regulations", weight: "30%" },
              { name: "Financial Standing", desc: "Balance sheet thresholds, turnover, and liquidity ratios", weight: "25%" },
              { name: "Technical Eligibility", desc: "OEM authorization, plant capacity, prior completions", weight: "30%" },
              { name: "Sovereign Preference", desc: "Make in India local content and MSME reservations", weight: "15%" }
            ].map((cat, i) => (
              <div key={i} style={{ padding: "14px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>{cat.name}</div>
                <div style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 8px" }}>{cat.desc}</div>
                <span className="badge badge-blue">Evaluation Weight: {cat.weight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Thresholds */}
      {activeTab === "thresholds" && (
        <div className="saas-card" style={{ padding: "20px" }}>
          <h4 className="card-title" style={{ marginBottom: "12px" }}>Platform Threshold Parameters</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              { label: "Minimum OCR Confidence for Auto-Approval", value: "85%" },
              { label: "High Risk Bidder Severity Score Trigger", value: "Score < 60%" },
              { label: "Name Similarity Threshold (Levenshtein)", value: "≥ 95% Match" },
              { label: "Default Evaluation Period for Refinery Bids", value: "21 Calendar Days" }
            ].map((th, i) => (
              <div key={i} style={{ padding: "12px 14px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12.5px", color: "#334155" }}>{th.label}</span>
                <span className="badge badge-purple">{th.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {showAddModal && (
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
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="anim-modal"
            style={{
              width: 480,
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
              <h3 className="section-title">Add Document Requirement</h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddDoc} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label className="form-label">Document Display Name</label>
                <input
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g. Insolvency Resolution Clearance Certificate"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Taxonomy Category</label>
                <select
                  value={newDocCategory}
                  onChange={(e) => setNewDocCategory(e.target.value)}
                  className="form-input"
                >
                  <option>Statutory</option>
                  <option>Financial</option>
                  <option>Technical</option>
                  <option>Policy</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  id="mandCheck"
                  checked={newDocMandatory}
                  onChange={(e) => setNewDocMandatory(e.target.checked)}
                  style={{ cursor: "pointer" }}
                />
                <label htmlFor="mandCheck" style={{ fontSize: "12.5px", color: "#334155", cursor: "pointer" }}>
                  Mandatory for all CPCL procurement packages
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "10px" }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Document Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
