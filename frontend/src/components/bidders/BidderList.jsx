"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  X,
  Download,
  CheckSquare,
  Square,
  Scale,
  ArrowUpDown,
  ArrowLeft,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Building2,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Briefcase,
  MapPin,
  Check,
  Percent
} from "lucide-react";
import { BIDDERS, AUDIT_TRAIL, TENDERS } from "@/lib/data";
import { useToast } from "@/components/common/ToastProvider";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { useProcurement } from "../../context/ProcurementContext";

export default function BidderList({ onNavigate, initialBidderId }) {
  const { showToast } = useToast();
  const { bidders: contextBidders, clarifications, requestClarification } = useProcurement();
  const bidders = useMemo(() => contextBidders && contextBidders.length > 0 ? contextBidders : BIDDERS, [contextBidders]);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [sortField, setSortField] = useState("compliance");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedBidder, setSelectedBidder] = useState(
    initialBidderId ? bidders.find((b) => b.id === initialBidderId) || null : null
  );
  const [comparisonSelection, setComparisonSelection] = useState([]);
  const [detailTab, setDetailTab] = useState("Overview");

  // Row action menu
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    if (initialBidderId) {
      const match = bidders.find((b) => b.id === initialBidderId);
      if (match) setSelectedBidder(match);
    }
  }, [initialBidderId, bidders]);

  // Risk count stats
  const riskCounts = useMemo(() => {
    return {
      All: bidders.length,
      Low: bidders.filter((b) => b.riskLevel === "Low").length,
      Medium: bidders.filter((b) => b.riskLevel === "Medium").length,
      High: bidders.filter((b) => b.riskLevel === "High").length,
      Critical: bidders.filter((b) => b.riskLevel === "Critical").length
    };
  }, [bidders]);

  // Filtered and sorted bidders
  const filteredBidders = useMemo(() => {
    return bidders
      .filter((b) => {
        const matchesRisk = riskFilter === "All" || b.riskLevel.toLowerCase() === riskFilter.toLowerCase();
        const matchesSearch =
          b.name.toLowerCase().includes(search.toLowerCase()) ||
          b.gstin.toLowerCase().includes(search.toLowerCase()) ||
          b.pan.toLowerCase().includes(search.toLowerCase()) ||
          b.state.toLowerCase().includes(search.toLowerCase());
        return matchesRisk && matchesSearch;
      })
      .sort((a, b) => {
        let modifier = sortDir === "asc" ? 1 : -1;
        if (sortField === "name") return a.name.localeCompare(b.name) * modifier;
        if (sortField === "compliance") return (a.complianceScore - b.complianceScore) * modifier;
        if (sortField === "risk") {
          const rank = { Critical: 4, High: 3, Medium: 2, Low: 1 };
          return ((rank[a.riskLevel] || 0) - (rank[b.riskLevel] || 0)) * modifier;
        }
        return 0;
      });
  }, [bidders, search, riskFilter, sortField, sortDir]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const toggleSelectForCompare = (bidderId, e) => {
    e.stopPropagation();
    if (comparisonSelection.includes(bidderId)) {
      setComparisonSelection(comparisonSelection.filter((id) => id !== bidderId));
    } else {
      if (comparisonSelection.length >= 3) {
        showToast({
          type: "warning",
          title: "Comparison Limit Reached",
          message: "You can compare a maximum of 3 bidders side-by-side."
        });
        return;
      }
      setComparisonSelection([...comparisonSelection, bidderId]);
    }
  };

  const handleExportCSV = () => {
    showToast({
      type: "info",
      title: "Exporting Bidder Directory",
      message: "Formatting verified bidder credentials, GSTIN, and compliance scores into CSV..."
    });
    setTimeout(() => {
      const headers = ["ID,Name,GSTIN,PAN,Type,Turnover,State,ComplianceScore,RiskLevel,Status\n"];
      const rows = bidders.map(
        (b) =>
          `"${b.id}","${b.name}","${b.gstin}","${b.pan}","${b.type}","${b.turnover}","${b.state}",${b.complianceScore},"${b.riskLevel}","${b.status}"\n`
      );
      const blob = new Blob([...headers, ...rows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `CPCL_Bidders_Export_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast({
        type: "success",
        title: "Export Complete",
        message: "Bidder list downloaded successfully."
      });
    }, 550);
  };

  const handleOfficerDecision = (decision) => {
    if (!selectedBidder) return;
    showToast({
      type: decision === "Qualify" ? "success" : decision === "Disqualify" ? "error" : "warning",
      title: `Officer Action: ${decision}`,
      message: `Recorded decision for ${selectedBidder.name}. Logged to immutable audit trail.`
    });
  };

  // ─── BIDDER DETAIL VIEW (Section 15) ───────────────────────────────────────
  if (selectedBidder) {
    const bidderEvents = AUDIT_TRAIL.filter(
      (a) => a.user.includes(selectedBidder.name) || a.detail.includes(selectedBidder.name)
    );

    const tabs = [
      "Overview",
      "Documents",
      "Compliance",
      "Financial",
      "Risk",
      "AI Insights",
      "Communication",
      "Audit"
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Header with Breadcrumb & Actions */}
        <PageHeader
          breadcrumbs={[
            { label: "Bidders", onClick: () => setSelectedBidder(null) },
            { label: selectedBidder.name }
          ]}
          title={selectedBidder.name}
          subtitle={`GSTIN: ${selectedBidder.gstin} · PAN: ${selectedBidder.pan} · Registered in ${selectedBidder.state}`}
        >
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              onClick={() => setSelectedBidder(null)}
              className="btn btn-secondary btn-sm"
            >
              <ArrowLeft size={13} /> Back to Bidders
            </button>
            <button
              onClick={() => handleOfficerDecision("Request Clarification")}
              className="btn btn-secondary btn-sm"
            >
              Request Clarification
            </button>
            <button
              onClick={() => handleOfficerDecision("Disqualify")}
              className="btn btn-danger btn-sm"
            >
              Disqualify
            </button>
            <button
              onClick={() => handleOfficerDecision("Qualify")}
              className="btn btn-primary btn-sm"
            >
              <CheckCircle size={13} /> Qualify Bidder
            </button>
          </div>
        </PageHeader>

        {/* Top KPI Metrics Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: "12px"
          }}
        >
          <div className="saas-card" style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: "11.5px", color: "#64748b" }}>Compliance Score</div>
            <div style={{ fontSize: "24px", fontWeight: 700, color: selectedBidder.complianceScore >= 80 ? "#16a34a" : "#dc2626", marginTop: "2px" }}>
              {selectedBidder.complianceScore}%
            </div>
          </div>

          <div className="saas-card" style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: "11.5px", color: "#64748b" }}>Risk Level</div>
            <div style={{ marginTop: "6px" }}>
              <span
                className={`badge ${
                  selectedBidder.riskLevel === "Low"
                    ? "badge-green"
                    : selectedBidder.riskLevel === "Medium"
                    ? "badge-amber"
                    : "badge-red"
                }`}
              >
                {selectedBidder.riskLevel} Risk
              </span>
            </div>
          </div>

          <div className="saas-card" style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: "11.5px", color: "#64748b" }}>Annual Turnover</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", marginTop: "4px" }}>
              {selectedBidder.turnover}
            </div>
          </div>

          <div className="saas-card" style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: "11.5px", color: "#64748b" }}>Enterprise Category</div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", marginTop: "6px" }}>
              {selectedBidder.type}
            </div>
          </div>

          <div className="saas-card" style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: "11.5px", color: "#64748b" }}>Verification Status</div>
            <div style={{ marginTop: "6px" }}>
              <span className="badge badge-blue">{selectedBidder.status}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="saas-tabs">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setDetailTab(t)}
              className={`saas-tab-btn ${detailTab === t ? "active" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {detailTab === "Overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px" }}>
            <div className="saas-card" style={{ padding: "20px" }}>
              <h4 className="card-title" style={{ marginBottom: "14px" }}>Company Information</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div style={{ padding: "10px 12px", background: "#f8fafc", borderRadius: "8px" }}>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>Legal Name</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a", marginTop: "2px" }}>{selectedBidder.name}</div>
                </div>
                <div style={{ padding: "10px 12px", background: "#f8fafc", borderRadius: "8px" }}>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>GSTIN Registration</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a", fontFamily: "monospace", marginTop: "2px" }}>{selectedBidder.gstin}</div>
                </div>
                <div style={{ padding: "10px 12px", background: "#f8fafc", borderRadius: "8px" }}>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>Permanent Account Number (PAN)</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a", fontFamily: "monospace", marginTop: "2px" }}>{selectedBidder.pan}</div>
                </div>
                <div style={{ padding: "10px 12px", background: "#f8fafc", borderRadius: "8px" }}>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>State Jurisdiction</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a", marginTop: "2px" }}>{selectedBidder.state}</div>
                </div>
                <div style={{ padding: "10px 12px", background: "#f8fafc", borderRadius: "8px" }}>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>MSME Udyam Registration</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a", fontFamily: "monospace", marginTop: "2px" }}>{selectedBidder.udyam || "UDYAM-MH-12-0048291"}</div>
                </div>
                <div style={{ padding: "10px 12px", background: "#f8fafc", borderRadius: "8px" }}>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>MCA Company CIN</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a", fontFamily: "monospace", marginTop: "2px" }}>U28112MH2016PTC284910</div>
                </div>
              </div>
            </div>

            <div className="saas-card" style={{ padding: "20px" }}>
              <h4 className="card-title" style={{ marginBottom: "14px" }}>Verification Summary</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { name: "GSTN Registry Query", status: "Active & Verified", color: "#16a34a" },
                  { name: "Income Tax PAN Match", status: "100% Name Match", color: "#16a34a" },
                  { name: "CERSAI Debarment Search", status: selectedBidder.riskLevel === "Critical" ? "Historical Debarment Flag" : "Clean Record", color: selectedBidder.riskLevel === "Critical" ? "#dc2626" : "#16a34a" },
                  { name: "MSME Classification", status: selectedBidder.type, color: "#1d4ed8" }
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "#f8fafc", borderRadius: "6px" }}>
                    <span style={{ fontSize: "12.5px", color: "#334155" }}>{item.name}</span>
                    <span style={{ fontSize: "11.5px", fontWeight: 600, color: item.color }}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Documents */}
        {detailTab === "Documents" && (
          <div className="saas-card" style={{ padding: "0" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 className="card-title">Submitted Statutory Documents</h4>
              <button
                onClick={() => onNavigate("document-verification")}
                className="btn btn-primary btn-sm"
              >
                Inspect in Workspace →
              </button>
            </div>
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Document Type</th>
                  <th>Identifier</th>
                  <th>OCR Confidence</th>
                  <th>Verification Result</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "GST Registration Certificate", id: selectedBidder.gstin, ocr: "99%", status: "Valid" },
                  { name: "Income Tax PAN Card Copy", id: selectedBidder.pan, ocr: "98%", status: "Valid" },
                  { name: "Audited Financial Balance Sheets", id: "FY2022-2024", ocr: "94%", status: "Valid" },
                  { name: "OEM Authorization Certificate", id: "OEM-AUTH-2025", ocr: "64%", status: selectedBidder.complianceScore < 70 ? "Mismatch" : "Valid" }
                ].map((d, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: "#0f172a" }}>{d.name}</td>
                    <td style={{ fontFamily: "monospace", fontSize: "12px" }}>{d.id}</td>
                    <td><span className="badge badge-purple">{d.ocr}</span></td>
                    <td>
                      <span className={`badge ${d.status === "Valid" ? "badge-green" : "badge-red"}`}>
                        {d.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        onClick={() => onNavigate("document-verification")}
                        className="btn btn-secondary btn-sm"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Compliance */}
        {detailTab === "Compliance" && (
          <div className="saas-card" style={{ padding: "20px" }}>
            <h4 className="card-title" style={{ marginBottom: "14px" }}>Statutory Compliance Score Breakdown</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { category: "Statutory Tax & Regulatory Filings", score: 98, weight: "25%", color: "#16a34a" },
                { category: "Financial Turnover & Net Worth Threshold", score: 90, weight: "25%", color: "#16a34a" },
                { category: "Technical Eligibility & OEM Authorization", score: selectedBidder.complianceScore < 70 ? 45 : 85, weight: "30%", color: selectedBidder.complianceScore < 70 ? "#dc2626" : "#16a34a" },
                { category: "Sovereign Preference (Make in India)", score: 95, weight: "20%", color: "#16a34a" }
              ].map((c, i) => (
                <div key={i} style={{ padding: "12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                    <span style={{ fontWeight: 600, color: "#0f172a" }}>{c.category}</span>
                    <span style={{ fontWeight: 700, color: c.color }}>{c.score}% (Weight: {c.weight})</span>
                  </div>
                  <div style={{ height: "6px", background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${c.score}%`, height: "100%", background: c.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Financial (Section 21) */}
        {detailTab === "Financial" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="saas-card" style={{ padding: "20px" }}>
              <h4 className="card-title" style={{ marginBottom: "14px" }}>Financial Standing & Audited Turnover</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "18px" }}>
                <div style={{ padding: "12px", background: "#f8fafc", borderRadius: "8px" }}>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>3-Yr Average Turnover</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>{selectedBidder.turnover}</div>
                  <div style={{ fontSize: "11px", color: "#16a34a", marginTop: "2px" }}>✓ Meets ₹5.0 Cr Threshold</div>
                </div>
                <div style={{ padding: "12px", background: "#f8fafc", borderRadius: "8px" }}>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>Audited Net Worth</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>₹ 4.80 Crore</div>
                  <div style={{ fontSize: "11px", color: "#16a34a", marginTop: "2px" }}>Positive Net Worth</div>
                </div>
                <div style={{ padding: "12px", background: "#f8fafc", borderRadius: "8px" }}>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>CA Verification UDIN</div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#1d4ed8", fontFamily: "monospace", marginTop: "4px" }}>24089123AAAA8912</div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>Certified & Attested</div>
                </div>
              </div>

              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "14px" }}>
                <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#334155", marginBottom: "8px" }}>
                  Annual Breakdown (Past 3 Financial Years)
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                  <div style={{ padding: "10px", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>FY 2024-25</div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>₹ 14.20 Cr</div>
                  </div>
                  <div style={{ padding: "10px", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>FY 2023-24</div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>₹ 12.10 Cr</div>
                  </div>
                  <div style={{ padding: "10px", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>FY 2022-23</div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>₹ 10.90 Cr</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Risk */}
        {detailTab === "Risk" && (
          <div className="saas-card" style={{ padding: "20px" }}>
            <h4 className="card-title" style={{ marginBottom: "12px" }}>Identified Risk Indicators</h4>
            {selectedBidder.issues && selectedBidder.issues.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {selectedBidder.issues.map((issue, i) => (
                  <div key={i} style={{ padding: "12px", background: "#fffbfb", border: "1px solid #fecaca", borderRadius: "8px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <AlertTriangle size={16} style={{ color: "#dc2626", marginTop: "2px", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#991b1b" }}>{issue}</div>
                      <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                        Flagged by AI verification rule engine during document integrity check.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: "16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", color: "#15803d", fontSize: "13px" }}>
                No active critical risk flags. Bidder verified against sovereign registries.
              </div>
            )}
          </div>
        )}

        {/* Tab 6: AI Insights */}
        {detailTab === "AI Insights" && (
          <div className="saas-card" style={{ padding: "20px" }}>
            <h4 className="card-title" style={{ marginBottom: "12px" }}>Automated Intelligence Findings</h4>
            <div style={{ padding: "14px", background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: "8px" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#6d28d9" }}>
                Pattern Extraction & Financial Consistency Check
              </div>
              <p style={{ fontSize: "12.5px", color: "#475569", marginTop: "4px", lineHeight: 1.45 }}>
                AI model extracted annual turnover matching CA certified balance sheets with 98% field alignment. No anomaly detected in banking credentials.
              </p>
            </div>
          </div>
        )}

        {/* Tab 7: Communication (Section 21) */}
        {detailTab === "Communication" && (
          <div className="saas-card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div>
                <h4 className="card-title">Clarification Query Threads</h4>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0" }}>
                  Official communication between CPCL Procurement Committee and {selectedBidder.name}
                </p>
              </div>
              <button
                onClick={() => handleOfficerDecision("Request Clarification")}
                className="btn btn-primary btn-sm"
              >
                + Issue New Query
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {clarifications
                .filter((c) => c.bidderName?.toLowerCase().includes(selectedBidder.name.toLowerCase().split(" ")[0]))
                .map((clr) => (
                  <div key={clr.id} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "14px", background: "#f8fafc" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                      <div>
                        <span style={{ fontSize: "11px", fontWeight: 700, fontFamily: "monospace", color: "#1d4ed8" }}>{clr.id}</span>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>{clr.question}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>Issued by {clr.from} on {clr.date}</div>
                      </div>
                      <span className={`badge ${clr.status === "Answered" ? "badge-green" : "badge-amber"}`}>
                        {clr.status}
                      </span>
                    </div>

                    {clr.response && (
                      <div style={{ marginTop: "10px", padding: "10px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "6px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "#166534" }}>Bidder Response ({clr.responseDate})</div>
                        <div style={{ fontSize: "12.5px", color: "#14532d", marginTop: "2px" }}>{clr.response}</div>
                        {clr.attachment && (
                          <div style={{ fontSize: "11px", color: "#15803d", marginTop: "6px", fontWeight: 600 }}>
                            Attachment: {clr.attachment}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

              {clarifications.filter((c) => c.bidderName?.toLowerCase().includes(selectedBidder.name.toLowerCase().split(" ")[0])).length === 0 && (
                <div style={{ padding: "20px", textAlign: "center", color: "#64748b", fontSize: "13px" }}>
                  No active clarification queries on record for this bidder.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 8: Audit */}
        {detailTab === "Audit" && (
          <div className="saas-card" style={{ padding: "20px" }}>
            <h4 className="card-title" style={{ marginBottom: "12px" }}>Immutable Audit Log for Bidder</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {bidderEvents.length > 0 ? (
                bidderEvents.map((ev, i) => (
                  <div key={i} style={{ padding: "10px", background: "#f8fafc", borderRadius: "6px", display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "12.5px", fontWeight: 600 }}>{ev.event}</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>{ev.detail}</div>
                    </div>
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>{ev.time}</span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: "12.5px", color: "#64748b" }}>
                  Bidder registration and credential verification recorded under SHA-256 seal #92b83c11.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── BIDDERS LIST VIEW (Section 14) ─────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Header */}
      <PageHeader
        title="Bidders"
        subtitle="Manage bidder profiles, statutory compliance, and risk classifications."
      >
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {comparisonSelection.length >= 2 && (
            <button
              onClick={() => onNavigate("bidder-comparison", { selectedIds: comparisonSelection })}
              className="btn btn-primary"
            >
              <Scale size={14} /> Compare Selected ({comparisonSelection.length})
            </button>
          )}
          <button
            onClick={handleExportCSV}
            className="btn btn-secondary"
          >
            <Download size={14} /> Export Directory
          </button>
        </div>
      </PageHeader>

      {/* Filter Chips & Search Bar */}
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
        {/* Risk Filters */}
        <div style={{ display: "flex", gap: "4px" }}>
          {["All", "Low", "Medium", "High", "Critical"].map((rf) => (
            <button
              key={rf}
              onClick={() => setRiskFilter(rf)}
              className={`pill-filter ${riskFilter === rf ? "active" : ""}`}
            >
              {rf === "All" ? "All Risk" : `${rf} Risk`} ({riskCounts[rf] || 0})
            </button>
          ))}
        </div>

        {/* Search Input */}
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
            placeholder="Search company, GST, PAN, state..."
            className="form-input"
            style={{ paddingLeft: "32px", fontSize: "12.5px" }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#94a3b8"
              }}
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* SaaS Data Table (Section 14) */}
      <div className="saas-table-container">
        {filteredBidders.length === 0 ? (
          <EmptyState
            title="No Bidders Found"
            description="No contractors match the current risk filter or search keywords."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearch("");
              setRiskFilter("All");
            }}
          />
        ) : (
          <table className="saas-table">
            <thead>
              <tr>
                <th style={{ width: "36px" }}>
                  <span style={{ fontSize: "10px" }}>SEL</span>
                </th>
                <th
                  onClick={() => handleSort("name")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>Company</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th>GSTIN & PAN</th>
                <th>Enrolled Tender</th>
                <th
                  onClick={() => handleSort("compliance")}
                  style={{ cursor: "pointer", userSelect: "none", width: "130px" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>Compliance</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("risk")}
                  style={{ cursor: "pointer", userSelect: "none", width: "120px" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>Risk Level</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th>Verification</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBidders.map((bidder) => {
                const isSelected = comparisonSelection.includes(bidder.id);

                return (
                  <tr
                    key={bidder.id}
                    className="interactive-row"
                    onClick={() => setSelectedBidder(bidder)}
                    style={{ background: isSelected ? "#f0f7ff" : undefined }}
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => toggleSelectForCompare(bidder.id, e)}
                        style={{ cursor: "pointer" }}
                        title="Select for comparison"
                      />
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: "#0f172a" }}>{bidder.name}</div>
                        <div style={{ fontSize: "11.5px", color: "#64748b" }}>
                          {bidder.type} · {bidder.state} · Turnover: {bidder.turnover}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontFamily: "monospace", fontSize: "12px", color: "#334155" }}>
                        {bidder.gstin}
                      </div>
                      <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#94a3b8" }}>
                        PAN: {bidder.pan}
                      </div>
                    </td>
                    <td style={{ fontSize: "12px", color: "#475569" }}>
                      {bidder.tender}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span
                          style={{
                            fontWeight: 700,
                            color: bidder.complianceScore >= 80 ? "#16a34a" : "#dc2626"
                          }}
                        >
                          {bidder.complianceScore}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          bidder.riskLevel === "Low"
                            ? "badge-green"
                            : bidder.riskLevel === "Medium"
                            ? "badge-amber"
                            : "badge-red"
                        }`}
                      >
                        {bidder.riskLevel}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-gray">{bidder.verificationStatus || "Verified"}</span>
                    </td>
                    <td>
                      <span className="badge badge-blue">{bidder.status}</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === bidder.id ? null : bidder.id);
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#94a3b8",
                            cursor: "pointer",
                            padding: "4px"
                          }}
                          aria-label="Bidder actions"
                        >
                          <MoreVertical size={15} />
                        </button>

                        {activeMenuId === bidder.id && (
                          <div
                            ref={menuRef}
                            className="anim-modal"
                            style={{
                              position: "absolute",
                              right: 0,
                              top: "calc(100% + 4px)",
                              width: 170,
                              background: "#ffffff",
                              border: "1px solid #e2e8f0",
                              borderRadius: "8px",
                              boxShadow: "var(--shadow-dropdown)",
                              zIndex: 40,
                              padding: "4px",
                              textAlign: "left"
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                setSelectedBidder(bidder);
                              }}
                              style={{
                                width: "100%",
                                padding: "7px 10px",
                                fontSize: "12px",
                                color: "#334155",
                                border: "none",
                                background: "none",
                                textAlign: "left",
                                borderRadius: "4px",
                                cursor: "pointer"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                              onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                            >
                              Open Profile
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                onNavigate("compliance-checks", { bidderName: bidder.name });
                              }}
                              style={{
                                width: "100%",
                                padding: "7px 10px",
                                fontSize: "12px",
                                color: "#334155",
                                border: "none",
                                background: "none",
                                textAlign: "left",
                                borderRadius: "4px",
                                cursor: "pointer"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                              onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                            >
                              Inspect Compliance
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                toggleSelectForCompare(bidder.id, { stopPropagation: () => {} });
                              }}
                              style={{
                                width: "100%",
                                padding: "7px 10px",
                                fontSize: "12px",
                                color: "#334155",
                                border: "none",
                                background: "none",
                                textAlign: "left",
                                borderRadius: "4px",
                                cursor: "pointer"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                              onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                            >
                              {isSelected ? "Deselect Compare" : "Add to Compare"}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Table Footer */}
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
          <span>Showing {filteredBidders.length} of {bidders.length} enrolled contractors</span>
          <div style={{ display: "flex", gap: "6px" }}>
            <button className="btn btn-secondary btn-sm" disabled>Previous</button>
            <button className="btn btn-secondary btn-sm" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
