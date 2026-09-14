"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  Eye,
  Calendar,
  Users,
  FileText,
  ShieldCheck,
  Clock,
  CheckCircle,
  X,
  Download,
  Shield,
  Check,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Filter,
  ArrowUpDown,
  ArrowLeft,
  AlertTriangle,
  ExternalLink,
  Edit3,
  Layers,
  FileCheck
} from "lucide-react";
import { TENDERS, BIDDERS, AUDIT_TRAIL } from "@/lib/data";
import { useToast } from "@/components/common/ToastProvider";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { useProcurement } from "../../context/ProcurementContext";
import CreateTenderModal from "./CreateTenderModal";

export default function TenderList({ onNavigate, initialTenderId }) {
  const { showToast } = useToast();
  const { tenders: contextTenders } = useProcurement();

  // Normalize tender items so both data schemas are supported seamlessly
  const tenders = useMemo(() => {
    const list = contextTenders && contextTenders.length > 0 ? contextTenders : TENDERS;
    return list.map((t) => ({
      ...t,
      name: t.name || t.title || "Untitled Tender",
      bidders: t.bidders !== undefined ? t.bidders : (t.biddersCount || 0),
      progress: t.progress !== undefined ? t.progress : (t.verificationProgress || 0),
      compliance: t.compliance !== undefined ? t.compliance : (t.complianceRate || 92),
      department: t.department || "Refinery Engineering",
      status: t.status || "Published"
    }));
  }, [contextTenders]);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [sortField, setSortField] = useState("deadline");
  const [sortDir, setSortDir] = useState("asc");
  const [selectedTender, setSelectedTender] = useState(
    initialTenderId ? tenders.find((t) => t.id === initialTenderId) || null : null
  );
  const [detailTab, setDetailTab] = useState("Overview");

  // Create Tender Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Engineering Equipment");
  const [newDeadline, setNewDeadline] = useState("2025-10-25");
  const [newValue, setNewValue] = useState("₹ 12.50 Crore");
  const [newDocs, setNewDocs] = useState([
    "GST Registration Certificate",
    "PAN Card Verification",
    "Audited Annual Turnover (Last 3 FY)",
    "OEM Manufacturer Authorization"
  ]);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Row action menu dropdown
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

  // Update selected tender if initialTenderId prop changes
  useEffect(() => {
    if (initialTenderId) {
      const match = tenders.find((t) => t.id === initialTenderId);
      if (match) setSelectedTender(match);
    }
  }, [initialTenderId, tenders]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      All: tenders.length,
      Published: tenders.filter((t) => t.status === "Published").length,
      Evaluation: tenders.filter((t) => t.status === "Evaluation").length,
      Completed: tenders.filter((t) => t.status === "Completed").length,
      Draft: tenders.filter((t) => t.status === "Draft").length
    };
  }, [tenders]);

  // Filtered and Sorted Tenders
  const filteredTenders = useMemo(() => {
    return tenders
      .filter((t) => {
        const matchesSearch =
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.id.toLowerCase().includes(search.toLowerCase()) ||
          t.category.toLowerCase().includes(search.toLowerCase());
        const matchesTab = activeTab === "All" || t.status.toLowerCase() === activeTab.toLowerCase();
        return matchesSearch && matchesTab;
      })
      .sort((a, b) => {
        let modifier = sortDir === "asc" ? 1 : -1;
        if (sortField === "name") return a.name.localeCompare(b.name) * modifier;
        if (sortField === "bidders") return (a.bidders - b.bidders) * modifier;
        if (sortField === "verification") return (a.verificationProgress - b.verificationProgress) * modifier;
        if (sortField === "compliance") return (a.complianceRate - b.complianceRate) * modifier;
        if (sortField === "deadline") return a.deadline.localeCompare(b.deadline) * modifier;
        return 0;
      });
  }, [tenders, search, activeTab, sortField, sortDir]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const handleExportDossier = (tender) => {
    showToast({
      type: "info",
      title: "Generating Tender Dossier",
      message: `Compiling evaluation metrics & bidder proofs for ${tender.id}...`
    });
    setTimeout(() => {
      showToast({
        type: "success",
        title: "Dossier Export Complete",
        message: "PDF package saved to officer downloads."
      });
    }, 650);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!newTitle.trim()) errors.title = "Tender title is mandatory.";
    if (!newDeadline) errors.deadline = "Deadline date is required.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newId = `CPCL/PROC/2025/0${tenders.length + 11}`;
      const newTender = {
        id: newId,
        name: newTitle.trim(),
        category: newCategory,
        createdDate: new Date().toISOString().split("T")[0],
        deadline: newDeadline,
        bidders: 0,
        verificationProgress: 0,
        complianceRate: 100,
        status: "Published",
        statusColor: "blue"
      };

      setTenders([newTender, ...tenders]);
      setIsSubmitting(false);
      setShowCreateModal(false);
      setNewTitle("");
      setFormErrors({});

      showToast({
        type: "success",
        title: "Tender Published",
        message: `Tender ${newId} published successfully on GeM procurement portal.`
      });
    }, 450);
  };

  // ─── TENDER DETAIL VIEW (Section 13) ───────────────────────────────────────
  if (selectedTender) {
    const tenderBidders = BIDDERS.filter((b) => b.tender === selectedTender.id);
    const tenderAuditEvents = AUDIT_TRAIL.filter(
      (a) => a.tender === selectedTender.id || a.detail.includes(selectedTender.id)
    );

    const detailTabs = ["Overview", "Requirements", "Bidders", "Documents", "Compliance", "Risk", "Activity"];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Top Header with Breadcrumbs and Back Action */}
        <PageHeader
          breadcrumbs={[
            { label: "Tenders", onClick: () => setSelectedTender(null) },
            { label: selectedTender.id }
          ]}
          title={selectedTender.name}
          subtitle={`Procurement Category: ${selectedTender.category} · Created on ${selectedTender.createdDate}`}
        >
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              onClick={() => setSelectedTender(null)}
              className="btn btn-secondary btn-sm"
            >
              <ArrowLeft size={13} /> Back to Tenders
            </button>
            <button
              onClick={() => {
                showToast({
                  type: "info",
                  title: "Edit Tender Mode",
                  message: `Editing parameters for ${selectedTender.id}...`
                });
              }}
              className="btn btn-secondary btn-sm"
            >
              <Edit3 size={13} /> Edit
            </button>
            <button
              onClick={() => onNavigate("document-verification")}
              className="btn btn-primary btn-sm"
            >
              <ShieldCheck size={13} /> Review Bids
            </button>
            <button
              onClick={() => handleExportDossier(selectedTender)}
              className="btn btn-secondary btn-sm"
            >
              <Download size={13} /> Export
            </button>
          </div>
        </PageHeader>

        {/* Tender Top Metric Badges */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: "12px"
          }}
        >
          <div className="saas-card" style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: "11.5px", color: "#64748b" }}>Tender Status</div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
              <span
                className={`badge ${
                  selectedTender.status === "Completed"
                    ? "badge-green"
                    : selectedTender.status === "Published"
                    ? "badge-blue"
                    : "badge-amber"
                }`}
              >
                {selectedTender.status}
              </span>
            </div>
          </div>

          <div className="saas-card" style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: "11.5px", color: "#64748b" }}>Submission Deadline</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", marginTop: "4px" }}>
              {selectedTender.deadline}
            </div>
          </div>

          <div className="saas-card" style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: "11.5px", color: "#64748b" }}>Enrolled Bidders</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>
              {selectedTender.bidders}{" "}
              <span style={{ fontSize: "11.5px", fontWeight: 400, color: "#64748b" }}>parties</span>
            </div>
          </div>

          <div className="saas-card" style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: "11.5px", color: "#64748b" }}>Verification Progress</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
              <div style={{ flex: 1, height: "6px", background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ width: `${selectedTender.verificationProgress}%`, height: "100%", background: "#1d4ed8" }} />
              </div>
              <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#1d4ed8" }}>
                {selectedTender.verificationProgress}%
              </span>
            </div>
          </div>

          <div className="saas-card" style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: "11.5px", color: "#64748b" }}>Compliance Rate</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
              <div style={{ flex: 1, height: "6px", background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ width: `${selectedTender.complianceRate}%`, height: "100%", background: "#16a34a" }} />
              </div>
              <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#16a34a" }}>
                {selectedTender.complianceRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Detail Tabs Navigation */}
        <div className="saas-tabs">
          {detailTabs.map((t) => (
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
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px" }}>
            <div className="saas-card" style={{ padding: "20px" }}>
              <h4 className="card-title" style={{ marginBottom: "12px" }}>Procurement Scope & Objective</h4>
              <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.6, marginBottom: "16px" }}>
                Supply, testing, and commissioning of high-pressure industrial valves conforming to API 6D and ASME B16.34 standards for CPCL Manali Refinery Phase-III expansion. Tender governed by MoPNG sovereign procurement directives and GeM statutory guidelines.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginTop: "16px" }}>
                <div style={{ padding: "12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: "11.5px", color: "#64748b" }}>Estimated Contract Value</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>₹ 14.80 Crore</div>
                </div>
                <div style={{ padding: "12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: "11.5px", color: "#64748b" }}>Tender Fee / EMD</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>Exempt for MSME / ₹ 5,00,000</div>
                </div>
                <div style={{ padding: "12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: "11.5px", color: "#64748b" }}>Technical Opening Date</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>{selectedTender.deadline} 15:00 IST</div>
                </div>
                <div style={{ padding: "12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: "11.5px", color: "#64748b" }}>Delivery Location</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>CPCL Manali Refinery, Chennai</div>
                </div>
              </div>
            </div>

            <div className="saas-card" style={{ padding: "20px" }}>
              <h4 className="card-title" style={{ marginBottom: "12px" }}>Tender Milestones</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { label: "NIT Published on GeM", date: selectedTender.createdDate, status: "Completed", color: "#16a34a" },
                  { label: "Pre-Bid Queries Closed", date: "2025-08-20", status: "Completed", color: "#16a34a" },
                  { label: "Bid Submission Deadline", date: selectedTender.deadline, status: "Active Stage", color: "#1d4ed8" },
                  { label: "AI Statutory Document Verification", date: "Ongoing", status: "In Progress", color: "#d97706" },
                  { label: "Commercial Price Bid Opening", date: "2025-09-30", status: "Scheduled", color: "#94a3b8" }
                ].map((step, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: step.color, marginTop: "5px" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#0f172a" }}>{step.label}</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>{step.date}</div>
                    </div>
                    <span className="badge badge-gray">{step.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Requirements */}
        {detailTab === "Requirements" && (
          <div className="saas-card" style={{ padding: "20px" }}>
            <h4 className="card-title" style={{ marginBottom: "14px" }}>Mandatory Evaluation Criteria & Document Checklist</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { name: "Active GST Registration", rule: "GST status active in state of supply with zero defaulter flag", type: "Statutory", mandatory: true },
                { name: "Income Tax PAN Verification", rule: "PAN name 100% matching legal corporate certificate", type: "Statutory", mandatory: true },
                { name: "Minimum Annual Turnover", rule: "3-year average audited turnover ≥ ₹ 5.0 Crore verified by CA", type: "Financial", mandatory: true },
                { name: "OEM Authorization Letter", rule: "Manufacturer authorization directly naming CPCL tender", type: "Technical", mandatory: true },
                { name: "Prior Petroleum PSU Experience", rule: "Minimum 3 years supplying refinery valves to IOCL/BPCL/HPCL/CPCL", type: "Technical", mandatory: true },
                { name: "Make in India Declaration", rule: "Class-I (≥50%) or Class-II (≥20%) local content certification", type: "Policy", mandatory: false },
                { name: "Debarment Clearance", rule: "Zero strike-off or debarment on CERSAI and GeM incident tracker", type: "Statutory", mandatory: true }
              ].map((req, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "12px 14px",
                    background: "#f8fafc",
                    border: "1px solid #f1f5f9",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>{req.name}</span>
                      {req.mandatory && <span className="badge badge-red">Mandatory</span>}
                      <span className="badge badge-gray">{req.type}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "3px" }}>{req.rule}</div>
                  </div>
                  <CheckCircle size={16} style={{ color: "#16a34a" }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Bidders */}
        {detailTab === "Bidders" && (
          <div className="saas-card" style={{ padding: "0" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 className="card-title">Enrolled Bidders for {selectedTender.id}</h4>
              <span className="badge badge-blue">{tenderBidders.length} Enrolled</span>
            </div>
            {tenderBidders.length === 0 ? (
              <EmptyState
                title="No Bidders Enrolled for Specific Filter"
                description="Bidders are participating across the platform. View all platform bidders."
                actionLabel="View All Enrolled Bidders"
                onAction={() => onNavigate("bidders")}
              />
            ) : (
              <table className="saas-table">
                <thead>
                  <tr>
                    <th>Bidder Entity</th>
                    <th>GSTIN</th>
                    <th>Turnover</th>
                    <th>Compliance</th>
                    <th>Risk Rating</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tenderBidders.map((b) => (
                    <tr key={b.id} className="interactive-row" onClick={() => onNavigate("bidders")}>
                      <td style={{ fontWeight: 600, color: "#0f172a" }}>{b.name}</td>
                      <td style={{ fontFamily: "monospace", fontSize: "12px" }}>{b.gstin}</td>
                      <td>{b.turnover}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: b.complianceScore >= 80 ? "#16a34a" : "#dc2626" }}>
                          {b.complianceScore}%
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            b.riskLevel === "Low"
                              ? "badge-green"
                              : b.riskLevel === "Medium"
                              ? "badge-amber"
                              : "badge-red"
                          }`}
                        >
                          {b.riskLevel} Risk
                        </span>
                      </td>
                      <td><span className="badge badge-blue">{b.status}</span></td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate("bidders");
                          }}
                          className="btn btn-secondary btn-sm"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 4: Documents */}
        {detailTab === "Documents" && (
          <div className="saas-card" style={{ padding: "20px" }}>
            <h4 className="card-title" style={{ marginBottom: "14px" }}>Submitted Document Dossiers</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px" }}>
              {[
                { title: "GST Certificates (42)", verified: "40 Verified", pending: "2 Review", status: "green" },
                { title: "PAN Cards (42)", verified: "42 Verified", pending: "0 Review", status: "green" },
                { title: "Turnover Balance Sheets (42)", verified: "36 Verified", pending: "6 Review", status: "amber" },
                { title: "OEM Authorizations (28)", verified: "21 Verified", pending: "7 Review", status: "amber" },
                { title: "Udyam MSME Certificates (18)", verified: "17 Verified", pending: "1 Review", status: "green" },
                { title: "EPFO Compliance Proofs (38)", verified: "35 Verified", pending: "3 Review", status: "green" }
              ].map((doc, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "14px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                  onClick={() => onNavigate("document-verification")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <FileText size={16} style={{ color: "#1d4ed8" }} />
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>{doc.title}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px" }}>
                    <span style={{ color: "#16a34a", fontWeight: 600 }}>{doc.verified}</span>
                    <span style={{ color: doc.status === "amber" ? "#d97706" : "#64748b" }}>{doc.pending}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Compliance */}
        {detailTab === "Compliance" && (
          <div className="saas-card" style={{ padding: "20px" }}>
            <h4 className="card-title" style={{ marginBottom: "10px" }}>Tender Compliance Matrix</h4>
            <p style={{ fontSize: "12.5px", color: "#64748b", marginBottom: "16px" }}>
              Automated scoring based on statutory rule engines and sovereign verification APIs.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ padding: "12px", background: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#15803d" }}>Full Statutory Compliance (Score ≥ 80%)</div>
                  <div style={{ fontSize: "11.5px", color: "#16a34a" }}>34 out of 42 bidders satisfy all tender conditions</div>
                </div>
                <span className="badge badge-green">81% Pass</span>
              </div>
              <div style={{ padding: "12px", background: "#fffbeb", borderRadius: "8px", border: "1px solid #fde68a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#b45309" }}>Minor Clarification Inquiries (60–79%)</div>
                  <div style={{ fontSize: "11.5px", color: "#d97706" }}>5 bidders flagged for name variations or turnover notes</div>
                </div>
                <span className="badge badge-amber">Clarifications Open</span>
              </div>
              <div style={{ padding: "12px", background: "#fef2f2", borderRadius: "8px", border: "1px solid #fecaca", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#b91c1c" }}>Non-Compliant / Rejected (Score &lt; 60%)</div>
                  <div style={{ fontSize: "11.5px", color: "#dc2626" }}>3 bidders disqualified due to missing mandatory OEM documents</div>
                </div>
                <span className="badge badge-red">3 Disqualified</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Risk */}
        {detailTab === "Risk" && (
          <div className="saas-card" style={{ padding: "20px" }}>
            <h4 className="card-title" style={{ marginBottom: "12px" }}>Risk & Anomaly Overview</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ padding: "12px", background: "#fffbfb", border: "1px solid #fecaca", borderRadius: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <AlertTriangle size={15} style={{ color: "#dc2626" }} />
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#991b1b" }}>
                    Potential Collusive Bidding Anomaly
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.45 }}>
                  AI correlation detector flagged near-identical financial statement formatting submitted by 2 competing valve suppliers in this tender.
                </p>
                <button
                  onClick={() => onNavigate("ai-insights")}
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: "8px" }}
                >
                  View AI Finding AI005 →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Activity */}
        {detailTab === "Activity" && (
          <div className="saas-card" style={{ padding: "20px" }}>
            <h4 className="card-title" style={{ marginBottom: "14px" }}>Audit Trail for {selectedTender.id}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {tenderAuditEvents.length > 0 ? (
                tenderAuditEvents.map((a, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "10px 12px",
                      background: "#f8fafc",
                      border: "1px solid #f1f5f9",
                      borderRadius: "6px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#0f172a" }}>{a.event}</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>{a.detail}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span className="badge badge-gray">{a.role}</span>
                      <div style={{ fontSize: "10.5px", color: "#94a3b8", marginTop: "2px" }}>{a.time}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: "12.5px", color: "#64748b" }}>
                  Official tender creation and publication logged under SHA-256 seal #84f29a01.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── TENDERS LIST VIEW (Section 12) ─────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Header with Primary Actions */}
      <PageHeader
        title="Tenders"
        subtitle="Manage and monitor procurement lifecycle, compliance evaluation, and bid verification."
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => handleExportDossier({ id: "ALL_ACTIVE" })}
            className="btn btn-secondary"
          >
            <Download size={14} /> Export Directory
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <Plus size={14} /> Create Tender
          </button>
        </div>
      </PageHeader>

      {/* Tabs & Controls */}
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
          {["All", "Published", "Evaluation", "Completed", "Draft"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pill-filter ${activeTab === tab ? "active" : ""}`}
            >
              {tab} ({tabCounts[tab] || 0})
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ position: "relative", width: "240px" }}>
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
              placeholder="Search tenders by name, ID..."
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
      </div>

      {/* SaaS Table (Section 12) */}
      <div className="saas-table-container">
        {filteredTenders.length === 0 ? (
          <EmptyState
            title="No Tenders Found"
            description="No tenders match the selected filters or search query."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearch("");
              setActiveTab("All");
            }}
          />
        ) : (
          <table className="saas-table">
            <thead>
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>Tender</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th>Status</th>
                <th
                  onClick={() => handleSort("bidders")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>Bidders</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("verification")}
                  style={{ cursor: "pointer", userSelect: "none", width: "160px" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>Verification</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
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
                  onClick={() => handleSort("deadline")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>Deadline</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenders.map((tender) => (
                <tr
                  key={tender.id}
                  className="interactive-row"
                  onClick={() => setSelectedTender(tender)}
                >
                  <td>
                    <div>
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>{tender.name}</div>
                      <div style={{ fontSize: "11.5px", color: "#64748b", fontFamily: "monospace" }}>
                        {tender.id} · <span style={{ color: "#94a3b8" }}>{tender.category}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        tender.status === "Completed"
                          ? "badge-green"
                          : tender.status === "Published"
                          ? "badge-blue"
                          : "badge-amber"
                      }`}
                    >
                      {tender.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Users size={14} style={{ color: "#64748b" }} />
                      <span style={{ fontWeight: 600, color: "#0f172a" }}>{tender.bidders}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ flex: 1, height: "6px", background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                        <div
                          style={{
                            width: `${tender.verificationProgress}%`,
                            height: "100%",
                            background: tender.verificationProgress === 100 ? "#16a34a" : "#1d4ed8"
                          }}
                        />
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#334155" }}>
                        {tender.verificationProgress}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontWeight: 700,
                        color: tender.complianceRate >= 80 ? "#16a34a" : "#d97706"
                      }}
                    >
                      {tender.complianceRate}%
                    </span>
                  </td>
                  <td style={{ fontSize: "12.5px", color: "#475569" }}>{tender.deadline}</td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === tender.id ? null : tender.id);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#94a3b8",
                          cursor: "pointer",
                          padding: "4px"
                        }}
                        aria-label="Tender actions"
                      >
                        <MoreVertical size={15} />
                      </button>

                      {activeMenuId === tender.id && (
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
                              setSelectedTender(tender);
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
                            Open Details
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onNavigate("document-verification");
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
                            Review Enrolled Bids
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              handleExportDossier(tender);
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
                            Export Dossier
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination Footer */}
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
          <span>Showing 1–{filteredTenders.length} of {tenders.length} tenders</span>
          <div style={{ display: "flex", gap: "6px" }}>
            <button className="btn btn-secondary btn-sm" disabled>Previous</button>
            <button className="btn btn-secondary btn-sm" disabled>Next</button>
          </div>
        </div>
      </div>

      {/* ─── 5-STEP CREATE TENDER WORKFLOW MODAL (Section 18) ─────────────────── */}
      <CreateTenderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={(newTender) => {
          setSelectedTender(newTender);
          setDetailTab("Overview");
        }}
      />
    </div>
  );
}
