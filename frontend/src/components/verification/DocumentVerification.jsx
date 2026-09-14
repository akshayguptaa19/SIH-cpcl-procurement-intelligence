import React, { useState, useMemo } from "react";
import {
  Search,
  FileText,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Clock,
  ExternalLink,
  Check,
  X,
  MessageSquare,
  Sparkles,
  Layers,
  Building2,
  ChevronRight,
  Filter,
  Edit2,
  Flag,
  CheckSquare,
  Send,
  AlertOctagon,
  Eye,
  Maximize2
} from "lucide-react";
import { useProcurement } from "../../context/ProcurementContext";
import { useToast } from "../common/ToastProvider";
import PageHeader from "../common/PageHeader";

const REJECTION_REASONS = [
  "Annual Turnover below mandatory tender threshold",
  "Document illegible or blurred scan (Failed OCR readability)",
  "Mismatch between legal entity name and PAN/GSTN record",
  "Expired statutory registration or license",
  "Unauthorized third-party manufacturer authorization",
  "Missing Chartered Accountant UDIN verification seal",
  "Other statutory non-compliance"
];

export default function DocumentVerification({ onNavigate, initialCaseId }) {
  const { showToast } = useToast();
  const {
    verificationQueue,
    approveDocument,
    rejectDocument,
    requestClarification,
    escalateDocument,
    markManualReview,
    updateExtractedField
  } = useProcurement();

  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");
  const [selectedCaseId, setSelectedCaseId] = useState(
    initialCaseId || verificationQueue[0]?.id || "vq001"
  );
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showHighlights, setShowHighlights] = useState(true);
  const [officerRemarks, setOfficerRemarks] = useState("");

  // Editing Extracted Field State
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Modals
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState(REJECTION_REASONS[0]);
  const [rejectNotes, setRejectNotes] = useState("");

  const [showClarifyModal, setShowClarifyModal] = useState(false);
  const [clarifyQuestion, setClarifyQuestion] = useState("");
  const [clarifyUrgent, setClarifyUrgent] = useState(true);

  const [showFullViewModal, setShowFullViewModal] = useState(false);

  // Selected Case
  const selectedCase = useMemo(() => {
    return verificationQueue.find((q) => q.id === selectedCaseId) || verificationQueue[0];
  }, [verificationQueue, selectedCaseId]);

  // Extracted Fields for selected case (dynamic with fallback)
  const [extractedData, setExtractedData] = useState({
    companyName: { label: "Legal Entity Name", value: "Precision Tools Ltd", status: "verified", confidence: 99 },
    gstin: { label: "GSTIN", value: "27AABCP8742L1Z9", status: "verified", confidence: 98 },
    pan: { label: "Permanent Account Number (PAN)", value: "AABCP8742L", status: "verified", confidence: 99 },
    regNumber: { label: "Registration Certificate No.", value: "27AABCP8742L1Z9/2018", status: "verified", confidence: 94 },
    issueDate: { label: "Date of Registration", value: "01/07/2017", status: "verified", confidence: 97 },
    turnover: { label: "Audited 3-Yr Avg Turnover", value: "₹ 6.40 Crore", status: "flagged", confidence: 64 },
    address: { label: "Principal Place of Business", value: "Plot 42, MIDC Industrial Area, Turbhe, Navi Mumbai 400705", status: "verified", confidence: 96 },
    signatory: { label: "Authorized Signatory", value: "Rajesh V. Sharma (Managing Director)", status: "verified", confidence: 95 }
  });

  // Keep extracted data in sync when switching cases
  React.useEffect(() => {
    if (selectedCase) {
      setExtractedData({
        companyName: { label: "Legal Entity Name", value: selectedCase.bidder || "Shakti Enterprises", status: "verified", confidence: 99 },
        gstin: { label: "GSTIN", value: selectedCase.gstin || "27AABCS1429B1Z1", status: "verified", confidence: 98 },
        pan: { label: "PAN", value: "AABCS1429B", status: "verified", confidence: 99 },
        regNumber: { label: "Certificate Number", value: "REG-2018-09142", status: "verified", confidence: 95 },
        issueDate: { label: "Issue Date", value: "14/08/2018", status: "verified", confidence: 96 },
        turnover: { label: "Turnover Disclosed", value: "₹ 12.40 Crore", status: selectedCase.confidence < 70 ? "flagged" : "verified", confidence: selectedCase.confidence || 85 },
        address: { label: "Principal Address", value: "Plot 18, Industrial Estate, Mahape, Navi Mumbai", status: "verified", confidence: 97 },
        signatory: { label: "Authorized Signatory", value: "Ashok K. Singhania (Director)", status: "verified", confidence: 95 }
      });
      setOfficerRemarks(selectedCase.officerNotes || "");
    }
  }, [selectedCase]);

  // Filter Queue
  const filteredQueue = useMemo(() => {
    return verificationQueue.filter((item) => {
      const qBidder = item.bidder || item.bidderName || "";
      const qTender = item.tender || item.tenderId || "";
      const qIssue = item.issue || item.documentName || "";
      const matchesSearch =
        qBidder.toLowerCase().includes(search.toLowerCase()) ||
        qTender.toLowerCase().includes(search.toLowerCase()) ||
        qIssue.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase());
      const matchesPriority =
        filterPriority === "All" ||
        item.priority === filterPriority ||
        item.status === filterPriority;
      return matchesSearch && matchesPriority;
    });
  }, [verificationQueue, search, filterPriority]);

  // Actions
  const handleApprove = () => {
    if (!selectedCase) return;
    approveDocument(selectedCase.id, officerRemarks);
    showToast({
      type: "success",
      title: "Document Verified & Approved",
      message: `Case ${selectedCase.id} (${selectedCase.bidder || selectedCase.bidderName}) approved by Officer Akshay Gupta.`
    });
    // Auto advance
    advanceQueue();
  };

  const handleOpenRejectModal = () => {
    setRejectReason(REJECTION_REASONS[0]);
    setRejectNotes(officerRemarks || "");
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (!selectedCase) return;
    rejectDocument(selectedCase.id, rejectReason, rejectNotes);
    setShowRejectModal(false);
    showToast({
      type: "error",
      title: "Document Rejected",
      message: `Case ${selectedCase.id} rejected: ${rejectReason}`
    });
    advanceQueue();
  };

  const handleOpenClarifyModal = () => {
    setClarifyQuestion(`Regarding ${selectedCase?.document || "submitted certificate"}: Please clarify `);
    setClarifyUrgent(true);
    setShowClarifyModal(true);
  };

  const handleConfirmClarify = () => {
    if (!selectedCase || !clarifyQuestion.trim()) return;
    requestClarification(selectedCase.id, clarifyQuestion, clarifyUrgent);
    setShowClarifyModal(false);
    showToast({
      type: "warning",
      title: "Clarification Dispatched",
      message: `Official query sent to ${selectedCase.bidder || selectedCase.bidderName}.`
    });
  };

  const handleEscalate = () => {
    if (!selectedCase) return;
    escalateDocument(selectedCase.id, officerRemarks || "Escalated for Tender Committee second-tier evaluation.");
    showToast({
      type: "warning",
      title: "Case Escalated",
      message: `Case ${selectedCase.id} transferred to Senior Procurement Reviewer.`
    });
  };

  const handleManualReview = () => {
    if (!selectedCase) return;
    markManualReview(selectedCase.id, officerRemarks || "Marked for in-depth manual forensic inspection.");
    showToast({
      type: "info",
      title: "Marked for Manual Review",
      message: `Case ${selectedCase.id} locked for detailed verification.`
    });
  };

  const advanceQueue = () => {
    const currentIndex = verificationQueue.findIndex((q) => q.id === selectedCase.id);
    const nextItem = verificationQueue.find((q, idx) => idx > currentIndex && q.status !== "Verified" && q.status !== "Rejected");
    if (nextItem) {
      setSelectedCaseId(nextItem.id);
    }
  };

  const handleEditField = (key, currentVal) => {
    setEditingField(key);
    setEditValue(currentVal);
  };

  const handleSaveFieldEdit = (key) => {
    setExtractedData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: editValue,
        status: "verified",
        confidence: 100,
        isOfficerCorrected: true
      }
    }));
    updateExtractedField(selectedCase.id, key, editValue);
    setEditingField(null);
    showToast({
      type: "info",
      title: "Field Corrected",
      message: `Officer corrected ${extractedData[key].label} to: ${editValue}`
    });
  };

  const handleFlagField = (key) => {
    setExtractedData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        status: prev[key].status === "flagged" ? "verified" : "flagged"
      }
    }));
    showToast({
      type: "warning",
      title: "Field Flag Toggled",
      message: `${extractedData[key].label} marked for scrutiny.`
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PageHeader
        title="Document Verification Workspace"
        description="Inspect OCR extracted evidence, validate against sovereign APIs, and record binding officer sign-offs."
        breadcrumbs={[
          { label: "Overview", href: "#" },
          { label: "Verification Workspace" }
        ]}
        actions={
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={advanceQueue}
              className="btn btn-secondary btn-sm"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <Clock size={14} /> Review Next Priority Case
            </button>
          </div>
        }
      />

      {/* ─── 3-COLUMN WORKSPACE CONTAINER ─────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr 370px",
          gap: 16,
          alignItems: "start",
          minHeight: "calc(100vh - 190px)"
        }}
      >
        {/* ─── COLUMN 1: VERIFICATION QUEUE (LEFT 300px) ────────────────────── */}
        <div
          className="saas-card"
          style={{
            display: "flex",
            flexDirection: "column",
            maxHeight: "calc(100vh - 190px)",
            overflow: "hidden"
          }}
        >
          {/* Queue Header & Filters */}
          <div style={{ padding: "14px", borderBottom: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                Verification Queue
              </span>
              <span className="badge badge-blue" style={{ fontSize: 11 }}>
                {filteredQueue.length} Cases
              </span>
            </div>

            {/* Search Input */}
            <div style={{ position: "relative", marginBottom: 8 }}>
              <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: "#94a3b8" }} />
              <input
                className="saas-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bidder, tender, issue..."
                style={{ paddingLeft: 30, fontSize: 12, height: 34, width: "100%" }}
              />
            </div>

            {/* Priority Filter Pills */}
            <div style={{ display: "flex", gap: 4 }}>
              {["All", "High", "Medium", "Escalated"].map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPriority(p)}
                  style={{
                    flex: 1,
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "4px 0",
                    borderRadius: 6,
                    border: "none",
                    background: filterPriority === p ? "#0f172a" : "#f1f5f9",
                    color: filterPriority === p ? "#ffffff" : "#64748b",
                    cursor: "pointer"
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Queue List Scrollable */}
          <div style={{ overflowY: "auto", flex: 1, padding: "8px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {filteredQueue.map((item) => {
                const isSelected = item.id === selectedCase?.id;
                const isVerified = item.status === "Verified" || item.status === "Approved";
                const isRejected = item.status === "Rejected";
                const isClarify = item.status === "Clarification Requested" || item.status === "Query Raised";

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedCaseId(item.id)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: isSelected ? "1.5px solid #1d4ed8" : "1px solid #e2e8f0",
                      background: isSelected ? "#eff6ff" : "#ffffff",
                      cursor: "pointer",
                      transition: "all 0.12s",
                      position: "relative"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>
                        {item.bidder || item.bidderName}
                      </div>
                      <span
                        className={`badge ${
                          isVerified
                            ? "badge-green"
                            : isRejected
                            ? "badge-red"
                            : item.priority === "High"
                            ? "badge-red"
                            : item.priority === "Medium"
                            ? "badge-amber"
                            : "badge-blue"
                        }`}
                        style={{ fontSize: 10 }}
                      >
                        {item.status || item.priority}
                      </span>
                    </div>

                    <div style={{ fontSize: 11.5, color: "#475569", marginBottom: 6, lineHeight: 1.3 }}>
                      {item.issue || item.documentName || "Statutory submission"}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10.5, color: "#94a3b8" }}>
                      <span style={{ fontFamily: "monospace" }}>{item.tender || item.tenderId}</span>
                      <span style={{ color: (item.confidence || 85) < 70 ? "#b45309" : "#16a34a", fontWeight: 600 }}>
                        {item.confidence || 85}% OCR
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── COLUMN 2: DOCUMENT PREVIEW CANVAS (CENTER FLEX) ──────────────── */}
        <div
          className="saas-card"
          style={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 190px)",
            overflow: "hidden"
          }}
        >
          {/* Canvas Toolbar */}
          <div
            style={{
              padding: "10px 16px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#f8fafc"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                {selectedCase?.document || "Form GST REG-06 Certificate"}
              </span>
              <span className="badge badge-gray" style={{ fontSize: 11 }}>
                Page 1 of 3
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Toggle OCR Highlights */}
              <button
                onClick={() => setShowHighlights(!showHighlights)}
                className={`btn btn-sm ${showHighlights ? "btn-primary" : "btn-secondary"}`}
                style={{ fontSize: 11.5, display: "flex", alignItems: "center", gap: 6 }}
              >
                <Sparkles size={13} /> {showHighlights ? "Highlights ON" : "Highlights OFF"}
              </button>

              {/* Zoom Controls */}
              <div style={{ display: "flex", alignItems: "center", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 6 }}>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(60, z - 15))}
                  style={{ background: "none", border: "none", padding: "5px 8px", cursor: "pointer", color: "#64748b" }}
                  title="Zoom Out"
                >
                  <ZoomOut size={13} />
                </button>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#334155", minWidth: 38, textAlign: "center" }}>
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                  style={{ background: "none", border: "none", padding: "5px 8px", cursor: "pointer", color: "#64748b" }}
                  title="Zoom In"
                >
                  <ZoomIn size={13} />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  style={{ background: "none", borderLeft: "1px solid #e2e8f0", padding: "5px 8px", cursor: "pointer", color: "#64748b" }}
                  title="Reset Zoom"
                >
                  <RotateCcw size={12} />
                </button>
              </div>

              {/* Fullscreen view */}
              <button
                onClick={() => setShowFullViewModal(true)}
                style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "#64748b" }}
                title="Fullscreen Preview"
              >
                <Maximize2 size={13} />
              </button>
            </div>
          </div>

          {/* Canvas Document Body (Simulated Form GST REG-06 with High-Res Layout) */}
          <div
            style={{
              flex: 1,
              overflow: "auto",
              background: "#475569",
              padding: "24px",
              display: "flex",
              justifyContent: "center"
            }}
          >
            <div
              style={{
                width: 680,
                minHeight: 880,
                background: "#ffffff",
                boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                borderRadius: 4,
                padding: "36px 42px",
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "top center",
                transition: "transform 0.15s ease",
                fontFamily: "'Times New Roman', Times, serif",
                color: "#111827",
                position: "relative"
              }}
            >
              {/* Sovereign Watermark & Header */}
              <div style={{ textAlign: "center", borderBottom: "2px double #111827", paddingBottom: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  Government of India · Goods and Services Tax Network
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, marginTop: 4, letterSpacing: "0.05em" }}>
                  FORM GST REG-06
                </div>
                <div style={{ fontSize: 11, fontStyle: "italic", marginTop: 2, color: "#374151" }}>
                  [See Rule 10(1)] · Registration Certificate
                </div>
              </div>

              {/* Certificate Details with OCR Highlight Boxes */}
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, lineHeight: 1.6 }}>
                <tbody>
                  <tr>
                    <td style={{ width: "40%", padding: "6px 0", fontWeight: 700 }}>1. Registration Number (GSTIN)</td>
                    <td style={{ width: "60%", padding: "6px 0", position: "relative" }}>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontWeight: 700,
                          fontSize: 13,
                          background: showHighlights ? "rgba(22, 163, 74, 0.15)" : "transparent",
                          border: showHighlights ? "1px dashed #16a34a" : "none",
                          padding: "2px 6px",
                          borderRadius: 3
                        }}
                      >
                        {extractedData.gstin.value}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td style={{ padding: "6px 0", fontWeight: 700 }}>2. Legal Name of Business</td>
                    <td style={{ padding: "6px 0", position: "relative" }}>
                      <span
                        style={{
                          fontWeight: 700,
                          background: showHighlights ? "rgba(37, 99, 235, 0.15)" : "transparent",
                          border: showHighlights ? "1px dashed #2563eb" : "none",
                          padding: "2px 6px",
                          borderRadius: 3
                        }}
                      >
                        {extractedData.companyName.value}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td style={{ padding: "6px 0", fontWeight: 700 }}>3. Trade Name, if any</td>
                    <td style={{ padding: "6px 0" }}>{extractedData.companyName.value}</td>
                  </tr>

                  <tr>
                    <td style={{ padding: "6px 0", fontWeight: 700 }}>4. Constitution of Business</td>
                    <td style={{ padding: "6px 0" }}>Private Limited Company</td>
                  </tr>

                  <tr>
                    <td style={{ padding: "6px 0", fontWeight: 700 }}>5. Address of Principal Place</td>
                    <td style={{ padding: "6px 0", position: "relative" }}>
                      <span
                        style={{
                          background: showHighlights ? "rgba(124, 58, 237, 0.12)" : "transparent",
                          border: showHighlights ? "1px dashed #7c3aed" : "none",
                          padding: "2px 6px",
                          borderRadius: 3
                        }}
                      >
                        {extractedData.address.value}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td style={{ padding: "6px 0", fontWeight: 700 }}>6. Date of Liability</td>
                    <td style={{ padding: "6px 0" }}>01/07/2017</td>
                  </tr>

                  <tr>
                    <td style={{ padding: "6px 0", fontWeight: 700 }}>7. Period of Validity</td>
                    <td style={{ padding: "6px 0" }}>From 01/07/2017 To Regular (Perpetual)</td>
                  </tr>

                  <tr>
                    <td style={{ padding: "6px 0", fontWeight: 700 }}>8. Type of Registration</td>
                    <td style={{ padding: "6px 0" }}>Regular Taxpayer</td>
                  </tr>
                </tbody>
              </table>

              {/* Annexure A / Turnover Stamp Section */}
              <div
                style={{
                  marginTop: 32,
                  border: "1px solid #9ca3af",
                  borderRadius: 4,
                  padding: "16px",
                  background: "#f9fafb"
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, color: "#374151" }}>
                  Annexure: Statutory Auditor Verification of Turnover
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>3-Year Average Annual Turnover:</div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: extractedData.turnover.status === "flagged" ? "#b91c1c" : "#111827",
                        background: showHighlights ? (extractedData.turnover.status === "flagged" ? "rgba(220, 38, 38, 0.18)" : "rgba(22, 163, 74, 0.15)") : "transparent",
                        border: showHighlights ? (extractedData.turnover.status === "flagged" ? "1px dashed #dc2626" : "1px dashed #16a34a") : "none",
                        padding: "2px 8px",
                        borderRadius: 4,
                        display: "inline-block",
                        marginTop: 4
                      }}
                    >
                      {extractedData.turnover.value}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", fontSize: 11, color: "#4b5563" }}>
                    <div>UDIN: 24089123AAAA8912</div>
                    <div>Statutory Auditor Seal: Certified</div>
                  </div>
                </div>
              </div>

              {/* Authorized Signatory Footnote */}
              <div style={{ marginTop: 48, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div style={{ fontSize: 10.5, color: "#6b7280" }}>
                  Generated on: 10/09/2026 18:24 IST<br />
                  Cryptographic Seal: SHA-256 Validated
                </div>
                <div style={{ textAlign: "center", borderTop: "1px solid #111827", paddingTop: 6, minWidth: 180 }}>
                  <div style={{ fontSize: 11, fontWeight: 700 }}>{extractedData.signatory.value}</div>
                  <div style={{ fontSize: 10, color: "#4b5563" }}>Authorized Representative</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── COLUMN 3: AI VERIFICATION & OFFICER DECISION PANEL (RIGHT 370px) ── */}
        <div
          className="saas-card"
          style={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 190px)",
            overflow: "hidden"
          }}
        >
          {/* Panel Header */}
          <div
            style={{
              padding: "14px",
              borderBottom: "1px solid #e2e8f0",
              background: "#f8fafc",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                AI Verification Panel
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                Evidence & Extraction
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span className="badge badge-green" style={{ fontSize: 11 }}>
                OCR Engine Active
              </span>
            </div>
          </div>

          {/* Panel Scrollable Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Sovereign Registry Match Banner */}
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: 8,
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                gap: 10
              }}
            >
              <ShieldCheck size={18} style={{ color: "#16a34a", flexShrink: 0 }} />
              <div style={{ fontSize: 11.5, color: "#15803d", lineHeight: 1.3 }}>
                <strong>GSTN API Live:</strong> Active Regular Taxpayer. Last GSTR-3B filed 20 days ago.
              </div>
            </div>

            {/* Extracted Fields List (Section 24) with Edit/Confirm/Flag */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                <span>Extracted Key-Values</span>
                <span style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>Editable by Officer</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries(extractedData).map(([key, field]) => {
                  const isEditing = editingField === key;
                  const isFlagged = field.status === "flagged";

                  return (
                    <div
                      key={key}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 6,
                        border: isFlagged ? "1px solid #fecaca" : "1px solid #e2e8f0",
                        background: isFlagged ? "#fff1f2" : "#ffffff",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>
                          {field.label}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 10.5, color: field.confidence < 70 ? "#b45309" : "#16a34a", fontWeight: 600 }}>
                            {field.confidence}%
                          </span>
                          {/* Flag button */}
                          <button
                            onClick={() => handleFlagField(key)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: isFlagged ? "#dc2626" : "#94a3b8",
                              padding: 2
                            }}
                            title={isFlagged ? "Remove Flag" : "Flag for Discrepancy"}
                          >
                            <Flag size={12} />
                          </button>
                          {/* Edit button */}
                          <button
                            onClick={() => (isEditing ? handleSaveFieldEdit(key) : handleEditField(key, field.value))}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: isEditing ? "#16a34a" : "#1d4ed8",
                              padding: 2
                            }}
                            title={isEditing ? "Save Correction" : "Edit Value"}
                          >
                            {isEditing ? <Check size={13} /> : <Edit2 size={12} />}
                          </button>
                        </div>
                      </div>

                      {isEditing ? (
                        <div style={{ display: "flex", gap: 6 }}>
                          <input
                            className="saas-input"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            style={{ fontSize: 12, height: 28, padding: "2px 6px", flex: 1 }}
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveFieldEdit(key)}
                            className="btn btn-primary btn-sm"
                            style={{ height: 28, padding: "0 8px", fontSize: 11 }}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: "#0f172a", wordBreak: "break-word" }}>
                          {field.value}
                          {field.isOfficerCorrected && (
                            <span style={{ fontSize: 9.5, color: "#1d4ed8", marginLeft: 6, fontWeight: 700 }}>
                              [OFFICER CORRECTED]
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Finding Narrative */}
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: "10px 12px"
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                <Sparkles size={12} style={{ color: "#7c3aed" }} /> AI Verification Assessment
              </div>
              <p style={{ fontSize: 11.5, color: "#334155", lineHeight: 1.4, margin: 0 }}>
                {selectedCase?.confidence < 70
                  ? "AI identified a potential compliance concern regarding turnover certificate legibility. Statutory tender rule requires ₹10.00 Cr. Officer review required."
                  : "Document appears valid based on extracted information and cross-check with sovereign GSTN and MCA21 databases. Zero debarment records found."}
              </p>
            </div>

            {/* Officer Remarks Textarea */}
            <div>
              <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                Officer Sign-Off Remarks / Evaluation Rationale
              </label>
              <textarea
                rows={2}
                className="saas-input"
                value={officerRemarks}
                onChange={(e) => setOfficerRemarks(e.target.value)}
                placeholder="Enter justification recorded in the immutable audit log..."
                style={{ width: "100%", fontSize: 12, resize: "none" }}
              />
            </div>
          </div>

          {/* Sticky Officer Decision Bar (Section 23) */}
          <div
            style={{
              padding: "12px 14px",
              borderTop: "1px solid #e2e8f0",
              background: "#ffffff",
              display: "flex",
              flexDirection: "column",
              gap: 8
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button
                onClick={handleApprove}
                className="btn btn-primary"
                style={{ background: "#16a34a", fontSize: 12.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                <CheckCircle size={14} /> Approve & Sign
              </button>

              <button
                onClick={handleOpenRejectModal}
                className="btn btn-primary"
                style={{ background: "#dc2626", fontSize: 12.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                <XCircle size={14} /> Reject
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button
                onClick={handleOpenClarifyModal}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: 11.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
              >
                <MessageSquare size={13} /> Clarification
              </button>

              <button
                onClick={handleEscalate}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: 11.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
              >
                <AlertTriangle size={13} /> Escalate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── REJECTION MODAL (Section 35) ─────────────────────────────────── */}
      {showRejectModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 110,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20
          }}
          onClick={() => setShowRejectModal(false)}
        >
          <div
            className="anim-modal"
            style={{
              width: "100%",
              maxWidth: 480,
              background: "#ffffff",
              borderRadius: 12,
              padding: "20px",
              boxShadow: "var(--shadow-modal)",
              border: "1px solid #e2e8f0"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <AlertOctagon size={22} style={{ color: "#dc2626" }} />
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Reject Document Verification
                </h3>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  Case: {selectedCase?.id} ({selectedCase?.bidder || selectedCase?.bidderName})
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Statutory Reason for Rejection <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <select
                className="saas-select"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                style={{ width: "100%" }}
              >
                {REJECTION_REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Officer Evaluation Notes & Legal Findings
              </label>
              <textarea
                rows={3}
                className="saas-input"
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                placeholder="Specific non-compliance details recorded for Tender Committee review..."
                style={{ width: "100%", resize: "none" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setShowRejectModal(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="btn btn-primary btn-sm"
                style={{ background: "#dc2626" }}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CLARIFICATION QUERY MODAL (Section 35) ───────────────────────── */}
      {showClarifyModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 110,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20
          }}
          onClick={() => setShowClarifyModal(false)}
        >
          <div
            className="anim-modal"
            style={{
              width: "100%",
              maxWidth: 520,
              background: "#ffffff",
              borderRadius: 12,
              padding: "20px",
              boxShadow: "var(--shadow-modal)",
              border: "1px solid #e2e8f0"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <MessageSquare size={22} style={{ color: "#1d4ed8" }} />
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Issue Official Clarification Query
                </h3>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  Dispatched directly to Vendor Portal · Bidder: {selectedCase?.bidder || selectedCase?.bidderName}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Query Specifics & Required Action <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                rows={4}
                className="saas-input"
                value={clarifyQuestion}
                onChange={(e) => setClarifyQuestion(e.target.value)}
                placeholder="Specify the ambiguity, missing seal, or explanation required from the bidder..."
                style={{ width: "100%", resize: "none" }}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#0f172a", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={clarifyUrgent}
                  onChange={(e) => setClarifyUrgent(e.target.checked)}
                />
                Mark as High Priority (Response required within 48 hours)
              </label>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setShowClarifyModal(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button
                onClick={handleConfirmClarify}
                className="btn btn-primary btn-sm"
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <Send size={13} /> Send to Vendor Portal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── FULLSCREEN DOCUMENT PREVIEW MODAL ────────────────────────────── */}
      {showFullViewModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(6px)",
            zIndex: 120,
            display: "flex",
            flexDirection: "column",
            padding: "20px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#ffffff", marginBottom: 10 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>
              {selectedCase?.document || "Form GST REG-06"} — Full Canvas Inspection
            </div>
            <button
              onClick={() => setShowFullViewModal(false)}
              style={{ background: "#334155", border: "none", color: "#ffffff", borderRadius: 6, padding: "6px 12px", cursor: "pointer" }}
            >
              Close Preview [ESC]
            </button>
          </div>
          <div style={{ flex: 1, overflow: "auto", display: "flex", justifyContent: "center", padding: "20px" }}>
            <div style={{ width: 840, background: "#ffffff", borderRadius: 4, padding: "48px 56px", color: "#000" }}>
              <h2 style={{ textAlign: "center", margin: "0 0 20px" }}>GOVERNMENT OF INDIA · GOODS AND SERVICES TAX NETWORK</h2>
              <p style={{ textAlign: "center", fontWeight: "bold" }}>FORM GST REG-06 — REGISTRATION CERTIFICATE</p>
              <hr />
              <div style={{ marginTop: 24, fontSize: 14, lineHeight: 1.8 }}>
                <div><strong>Registration Number (GSTIN):</strong> {extractedData.gstin.value}</div>
                <div><strong>Legal Name:</strong> {extractedData.companyName.value}</div>
                <div><strong>Principal Address:</strong> {extractedData.address.value}</div>
                <div><strong>Date of Registration:</strong> {extractedData.issueDate.value}</div>
                <div><strong>Constitution of Business:</strong> Private Limited Company</div>
                <div><strong>3-Year Average Turnover:</strong> {extractedData.turnover.value}</div>
                <div><strong>Authorized Signatory:</strong> {extractedData.signatory.value}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
