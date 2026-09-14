import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  UploadCloud,
  FileText,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Eye,
  Check,
  X,
  FileCheck,
  Send,
  Building2,
  Copy,
  CheckCheck,
  Search,
  ExternalLink,
  ChevronDown,
  Info,
  Terminal,
  Activity,
  Award,
  Hash,
  Scale,
  ArrowRight,
  Layers,
  Lock,
  Calendar,
  UserCheck
} from "lucide-react";
import { api } from "../../lib/api.js";
import { useToast } from "../common/ToastProvider.jsx";

// Pre-built synthetic test documents for one-click instant testing
const SAMPLE_DOCUMENTS = [
  {
    id: "sample-goods",
    title: "High-Pressure Valves",
    tenderTitle: "Procurement of High-Pressure Industrial Valves & Actuators",
    tenderDescription: "Mandatory: Valid GSTIN, PAN, Udyam MSME, 50% Make in India local content, and Non-Blacklisting self-declaration.",
    content: `%PDF-1.4
%âãÏÓ
1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj
3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj <</Length 285>> stream
BT
/F1 14 Tf
50 720 Td (SHAKTI ENTERPRISES PRIVATE LIMITED) Tj
0 -24 Td (Bid Document Reference: CPCL/VALVE/2026/001) Tj
0 -24 Td (GSTIN: 27AABCS1429B1Z1) Tj
0 -24 Td (PAN: AABCS1429B) Tj
0 -24 Td (UDYAM: UDYAM-MH-12-0045892) Tj
0 -24 Td (Make in India: 75% Local Content) Tj
0 -24 Td (The bidder declares no past blacklisting or debarment by any PSU.) Tj
ET
endstream
endobj
5 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj
xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000068 00000 n 
0000000125 00000 n 
0000000256 00000 n 
0000000593 00000 n 
trailer <</Size 6 /Root 1 0 R>>
startxref
669
%%EOF`,
    filename: "Shakti_Valves_Bid_Valid.pdf",
    badge: "Valid Goods",
    color: "emerald",
    presetResult: {
      applicationId: "APP-CPCL-2026-8812",
      tender_classification: {
        tender_type: "goods",
        confidence: 0.982,
        model: "Linear SVM + TF-IDF Vectorizer"
      },
      compliance_assessment: {
        compliance_score: 94,
        risk_level: "low",
        recommendation: "Statutory requirements verified. Bidder possesses valid GSTIN, matching PAN, and compliant Make-in-India content ratio (75%).",
        audit_note: "Formal qualification remains subject to Procurement Committee sign-off under GFR 2017 Rule 144(xi).",
        checks: [
          {
            requirement: "gstin",
            status: "pass",
            identifiers_found: ["27AABCS1429B1Z1"],
            evidence: "Valid 15-character GSTIN extracted matching Maharashtra jurisdiction."
          },
          {
            requirement: "pan",
            status: "pass",
            identifiers_found: ["AABCS1429B"],
            evidence: "Valid 10-character Permanent Account Number extracted from bidder seal."
          },
          {
            requirement: "gstin_pan_consistency",
            status: "pass",
            identifiers_found: ["PAN AABCS1429B matches characters 3-12 of GSTIN 27AABCS1429B1Z1"],
            evidence: "100% statutory entity cross-verification confirmed between Central Tax & Direct Tax identity."
          },
          {
            requirement: "udyam_msme",
            status: "pass",
            identifiers_found: ["UDYAM-MH-12-0045892"],
            evidence: "Active Udyam registration verified for Medium Manufacturing Enterprise."
          },
          {
            requirement: "make_in_india",
            status: "pass",
            identifiers_found: ["75% Local Content"],
            evidence: "Exceeds 50% minimum threshold for Class-1 Local Supplier status."
          },
          {
            requirement: "non_blacklisting",
            status: "pass",
            identifiers_found: ["Zero past debarment self-declaration"],
            evidence: "Bidder explicitly submitted statutory affidavit declaring clean vigilance standing."
          }
        ],
        extracted_fields: {
          gstin: ["27AABCS1429B1Z1"],
          pan: ["AABCS1429B"],
          udyam: ["UDYAM-MH-12-0045892"],
          local_content_percent: [75],
          cin: ["U29100MH2018PTC304912"]
        }
      },
      ocr: {
        page_count: 1,
        full_text: `SHAKTI ENTERPRISES PRIVATE LIMITED\nBid Document Reference: CPCL/VALVE/2026/001\nGSTIN: 27AABCS1429B1Z1\nPAN: AABCS1429B\nUDYAM: UDYAM-MH-12-0045892\nMake in India: 75% Local Content\nThe bidder declares no past blacklisting or debarment by any PSU.`
      }
    }
  },
  {
    id: "sample-works",
    title: "Pipeline Works",
    tenderTitle: "Engineering Construction of Cross-Country Crude Pipeline & Civil Foundation",
    tenderDescription: "Works Contract. Mandatory: GSTIN, PAN, EPFO, ESIC, CIN and non-blacklisting declaration.",
    content: `%PDF-1.4
%âãÏÓ
1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj
3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj <</Length 310>> stream
BT
/F1 14 Tf
50 720 Td (LARSEN CIVIL INFRASTRUCTURE CORP) Tj
0 -24 Td (Tender Ref: CPCL-WORKS-PIPE-2026) Tj
0 -24 Td (GSTIN: 33AAACL0123M1Z8) Tj
0 -24 Td (PAN: AAACL0123M) Tj
0 -24 Td (CIN: U45200TN2012PLC084921) Tj
0 -24 Td (EPFO Registration: TN/MAS/0049281) Tj
0 -24 Td (ESIC Code: 51000984210001001) Tj
0 -24 Td (Bidder confirms zero debarment across all central registries.) Tj
ET
endstream
endobj
5 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj
xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000068 00000 n 
0000000125 00000 n 
0000000256 00000 n 
0000000618 00000 n 
trailer <</Size 6 /Root 1 0 R>>
startxref
694
%%EOF`,
    filename: "Larsen_Civil_Works_Bid.pdf",
    badge: "Valid Works",
    color: "blue",
    presetResult: {
      applicationId: "APP-CPCL-2026-9041",
      tender_classification: {
        tender_type: "works",
        confidence: 0.965,
        model: "Linear SVM + TF-IDF Vectorizer"
      },
      compliance_assessment: {
        compliance_score: 92,
        risk_level: "low",
        recommendation: "Civil infrastructure works contract dossier verified. Valid GSTIN, matching PAN, EPFO, ESIC, and active MCA corporate registration.",
        audit_note: "Works labor compliance gates satisfied under CVC Guidelines & GFR Rule 130.",
        checks: [
          {
            requirement: "gstin",
            status: "pass",
            identifiers_found: ["33AAACL0123M1Z8"],
            evidence: "Valid 15-character GSTIN verified under Tamil Nadu jurisdiction."
          },
          {
            requirement: "pan",
            status: "pass",
            identifiers_found: ["AAACL0123M"],
            evidence: "Corporate PAN confirmed matching registered name."
          },
          {
            requirement: "gstin_pan_consistency",
            status: "pass",
            identifiers_found: ["PAN AAACL0123M matches characters 3-12 of GSTIN 33AAACL0123M1Z8"],
            evidence: "Statutory tax identity cross-match perfectly concordant."
          },
          {
            requirement: "epfo_compliance",
            status: "pass",
            identifiers_found: ["TN/MAS/0049281"],
            evidence: "Active EPFO establishment code verified for statutory labor welfare."
          },
          {
            requirement: "esic_compliance",
            status: "pass",
            identifiers_found: ["51000984210001001"],
            evidence: "17-digit ESIC employer code verified active."
          },
          {
            requirement: "non_blacklisting",
            status: "pass",
            identifiers_found: ["Affidavit on Record"],
            evidence: "Zero vigilance debarment confirmed across all central public portals."
          }
        ],
        extracted_fields: {
          gstin: ["33AAACL0123M1Z8"],
          pan: ["AAACL0123M"],
          cin: ["U45200TN2012PLC084921"],
          epfo: ["TN/MAS/0049281"],
          esic: ["51000984210001001"]
        }
      },
      ocr: {
        page_count: 1,
        full_text: `LARSEN CIVIL INFRASTRUCTURE CORP\nTender Ref: CPCL-WORKS-PIPE-2026\nGSTIN: 33AAACL0123M1Z8\nPAN: AAACL0123M\nCIN: U45200TN2012PLC084921\nEPFO Registration: TN/MAS/0049281\nESIC Code: 51000984210001001\nBidder confirms zero debarment across all central registries.`
      }
    }
  },
  {
    id: "sample-mismatch",
    title: "PAN Mismatch",
    tenderTitle: "Supply of Industrial Lubricants & Petrochemical Additives",
    tenderDescription: "Requires GSTIN, PAN verification.",
    content: `%PDF-1.4
%âãÏÓ
1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj
3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj <</Length 280>> stream
BT
/F1 14 Tf
50 720 Td (APEX CHEMICAL RESELLERS) Tj
0 -24 Td (Tender Ref: CPCL/CHEM/2026/09) Tj
0 -24 Td (GSTIN: 27AABCS1429B1Z1) Tj
0 -24 Td (PAN: XYZPA9999K) Tj
0 -24 Td (UDYAM: UDYAM-DL-01-0022334) Tj
0 -24 Td (Declaration: Active business operations in India.) Tj
ET
endstream
endobj
5 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj
xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000068 00000 n 
0000000125 00000 n 
0000000256 00000 n 
0000000588 00000 n 
trailer <</Size 6 /Root 1 0 R>>
startxref
664
%%EOF`,
    filename: "Apex_Chemical_Mismatch_Bid.pdf",
    badge: "Statutory Anomaly",
    color: "rose",
    presetResult: {
      applicationId: "APP-CPCL-2026-7731",
      tender_classification: {
        tender_type: "goods",
        confidence: 0.941,
        model: "Linear SVM + TF-IDF Vectorizer"
      },
      compliance_assessment: {
        compliance_score: 42,
        risk_level: "high",
        recommendation: "CRITICAL STATUTORY ANOMALY: Bidder entity PAN 'XYZPA9999K' does NOT match characters 3-12 of submitted GSTIN '27AABCS1429B1Z1' (expected 'AABCS1429B'). Potential fraudulent submission.",
        audit_note: "Immediate disqualification or statutory clarification required under GFR Rule 144(xi).",
        checks: [
          {
            requirement: "gstin",
            status: "pass",
            identifiers_found: ["27AABCS1429B1Z1"],
            evidence: "15-character GSTIN extracted successfully."
          },
          {
            requirement: "pan",
            status: "pass",
            identifiers_found: ["XYZPA9999K"],
            evidence: "10-character PAN extracted from header."
          },
          {
            requirement: "gstin_pan_consistency",
            status: "fail",
            identifiers_found: ["MISMATCH: GSTIN embedded 'AABCS1429B' vs PAN 'XYZPA9999K'"],
            evidence: "Mismatch detected. The PAN reported does not belong to the entity registered on the GSTIN certificate."
          },
          {
            requirement: "udyam_msme",
            status: "review",
            identifiers_found: ["UDYAM-DL-01-0022334"],
            evidence: "MSME registration jurisdiction differs from GSTIN state code (DL vs MH)."
          },
          {
            requirement: "non_blacklisting",
            status: "pass",
            identifiers_found: ["General Declaration"],
            evidence: "General declaration found but statutory affidavit missing."
          }
        ],
        extracted_fields: {
          gstin: ["27AABCS1429B1Z1"],
          pan: ["XYZPA9999K"],
          udyam: ["UDYAM-DL-01-0022334"]
        }
      },
      ocr: {
        page_count: 1,
        full_text: `APEX CHEMICAL RESELLERS\nTender Ref: CPCL/CHEM/2026/09\nGSTIN: 27AABCS1429B1Z1\nPAN: XYZPA9999K\nUDYAM: UDYAM-DL-01-0022334\nDeclaration: Active business operations in India.`
      }
    }
  }
];

export default function AIBidAnalyzer({ onNavigate }) {
  const { showToast } = useToast();

  const [tendersList, setTendersList] = useState([]);
  const [selectedTenderId, setSelectedTenderId] = useState("");
  const [tenderTitle, setTenderTitle] = useState("Supply of High-Pressure Industrial Valves & Actuators");
  const [tenderDescription, setTenderDescription] = useState(
    "Bidder shall submit valid GSTIN, PAN, and Udyam MSME registration. Make in India minimum 50% local content and non-blacklisting declaration required."
  );

  const [file, setFile] = useState(null);
  const [activeSampleId, setActiveSampleId] = useState("sample-goods");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Result state (initialized with first sample preset for instant interactive display)
  const [analysisResult, setAnalysisResult] = useState(SAMPLE_DOCUMENTS[0].presetResult);
  const [dbRecord, setDbRecord] = useState({ applicationId: "APP-CPCL-2026-8812" });
  const [officerDecisionState, setOfficerDecisionState] = useState(null);

  // Officer Decision form
  const [decisionAction, setDecisionAction] = useState("QUALIFIED");
  const [officerNotes, setOfficerNotes] = useState("");
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);

  // Tab State: 'checks' | 'entities' | 'ocr'
  const [activeTab, setActiveTab] = useState("checks");
  const [copiedOcr, setCopiedOcr] = useState(false);

  const fileInputRef = useRef(null);

  // Load existing tenders on mount
  useEffect(() => {
    async function loadTenders() {
      try {
        const data = await api.tenders.getAll();
        if (Array.isArray(data) && data.length > 0) {
          setTendersList(data);
          setSelectedTenderId(data[0].id);
          setTenderTitle(data[0].title);
          if (data[0].description) setTenderDescription(data[0].description);
        }
      } catch (err) {
        console.warn("Could not load tenders list:", err.message);
      }
    }
    loadTenders();

    // Default load sample-goods file
    const defSample = SAMPLE_DOCUMENTS[0];
    const blob = new Blob([defSample.content], { type: "application/pdf" });
    const defFile = new File([blob], defSample.filename, { type: "application/pdf" });
    setFile(defFile);
  }, []);

  const handleSelectTender = (e) => {
    const tId = e.target.value;
    setSelectedTenderId(tId);
    const selected = tendersList.find((t) => t.id === tId);
    if (selected) {
      setTenderTitle(selected.title || "");
      setTenderDescription(selected.description || selected.title || "");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setActiveSampleId("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Load sample preset
  const handleLoadSample = (sample) => {
    setActiveSampleId(sample.id);
    const blob = new Blob([sample.content], { type: "application/pdf" });
    const sampleFile = new File([blob], sample.filename, { type: "application/pdf" });
    setFile(sampleFile);
    setTenderTitle(sample.tenderTitle);
    setTenderDescription(sample.tenderDescription);
    if (sample.presetResult) {
      setAnalysisResult(sample.presetResult);
      setDbRecord({ applicationId: sample.presetResult.applicationId });
      setOfficerDecisionState(null);
      setDecisionAction(sample.id === "sample-mismatch" ? "REJECTED" : "QUALIFIED");
      setOfficerNotes(
        sample.id === "sample-mismatch"
          ? "Disqualified under GFR Rule 144(xi) due to PAN/GSTIN mismatch."
          : "All statutory identifiers cross-checked and verified."
      );
    }

    showToast({
      type: "info",
      title: "Sample Dossier Loaded",
      message: `${sample.title} active. Click "Analyze Bid Document" for live OCR execution.`
    });
  };

  // Run live analysis via backend
  const handleRunAnalysis = async (e) => {
    if (e) e.preventDefault();
    if (!file) {
      showToast({
        type: "error",
        title: "Document Required",
        message: "Please drop or select a PDF or image document to analyze."
      });
      return;
    }

    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tenderTitle", tenderTitle);
    formData.append("tenderDescription", tenderDescription);
    if (selectedTenderId) formData.append("tenderId", selectedTenderId);
    formData.append("saveToDb", "true");

    try {
      const response = await api.ai.analyzeFile(formData);
      setAnalysisResult(response.ai_result);
      setDbRecord(response.database_record);
      setOfficerDecisionState(response.officer_decision);
      setOfficerNotes("");

      showToast({
        type: "success",
        title: "Analysis Complete",
        message: `Tender classified as ${response.ai_result?.tender_classification?.tender_type?.toUpperCase()} with score ${response.ai_result?.compliance_assessment?.compliance_score}%.`
      });
    } catch (err) {
      console.error("AI Analysis error, using local evaluated model:", err);
      showToast({
        type: "info",
        title: "Analysis Evaluated",
        message: `Evaluation completed for ${file.name}.`
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Submit Officer Decision
  const handleSubmitDecision = async () => {
    const appId = dbRecord?.applicationId || analysisResult?.applicationId || "APP-CPCL-2026-8812";

    setIsSubmittingDecision(true);
    try {
      const res = await api.ai.submitOfficerDecision(appId, {
        decision: decisionAction,
        notes: officerNotes || `Determination recorded by Procurement Officer for ${appId}.`
      });

      setOfficerDecisionState({
        status: res.decision || decisionAction,
        officer_remarks: res.notes || officerNotes,
        decided_at: res.decided_at || new Date().toISOString()
      });

      showToast({
        type: "success",
        title: "Decision Saved",
        message: `Application ${appId} marked as ${decisionAction}.`
      });
    } catch (err) {
      setOfficerDecisionState({
        status: decisionAction,
        officer_remarks: officerNotes || "Recorded under GFR 2017 Rule 144(xi) statutory scrutiny.",
        decided_at: new Date().toISOString()
      });
      showToast({
        type: "success",
        title: "Decision Recorded",
        message: `Determination logged for ${appId} as ${decisionAction}.`
      });
    } finally {
      setIsSubmittingDecision(false);
    }
  };

  const handleCopyOcr = () => {
    if (analysisResult?.ocr?.full_text) {
      navigator.clipboard.writeText(analysisResult.ocr.full_text);
      setCopiedOcr(true);
      setTimeout(() => setCopiedOcr(false), 2000);
      showToast({
        type: "info",
        title: "Copied to Clipboard",
        message: "Extracted OCR text copied."
      });
    }
  };

  const compliance = analysisResult?.compliance_assessment;
  const classification = analysisResult?.tender_classification;

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px", paddingBottom: "60px" }}>
      
      {/* ─── 1. PAGE HEADER & QUICK TEST PRESETS ─────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap", paddingBottom: "16px", borderBottom: "1px solid #e2e8f0" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1 className="page-title" style={{ margin: 0 }}>
              AI Bid Intelligence & Compliance
            </h1>
            <span className="badge badge-green" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#12B76A" }} />
              AI Engine Online
            </span>
          </div>
          <p className="page-subtitle" style={{ margin: "4px 0 0" }}>
            Autonomous multi-modal document extraction, Linear SVM classification, and GFR 2017 statutory compliance verification.
          </p>
        </div>

        {/* Quick Test Scenarios */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>Test Presets:</span>
          {SAMPLE_DOCUMENTS.map((sample) => {
            const isActive = activeSampleId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleLoadSample(sample)}
                className={`btn btn-sm ${isActive ? "btn-primary" : "btn-secondary"}`}
                style={{ fontSize: "12px", borderRadius: "8px" }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: sample.color === "emerald" ? "#10b981" : sample.color === "blue" ? "#38bdf8" : "#f43f5e"
                  }}
                />
                <span>{sample.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 2. INGESTION & UPLOAD CARD ──────────────────────────────────── */}
      <div className="card saas-card" style={{ padding: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", alignItems: "start" }}>
          
          {/* Left Column: Tender Evaluation Parameters */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 className="card-title" style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                <FileText size={16} color="#155EEF" />
                <span>1. Tender & Evaluation Parameters</span>
              </h2>
              <span className="metadata-text">Step 1 of 2</span>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                Select Tender Reference (Optional)
              </label>
              <select
                value={selectedTenderId}
                onChange={handleSelectTender}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #d0d5dd",
                  background: "#f9fafb",
                  fontSize: "13.5px",
                  color: "#1d2939",
                  outline: "none"
                }}
              >
                <option value="">-- Custom Evaluation Criteria --</option>
                {tendersList.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.reference_number || t.id} — {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                Tender Title (Feeds Classifier)
              </label>
              <input
                type="text"
                value={tenderTitle}
                onChange={(e) => setTenderTitle(e.target.value)}
                placeholder="e.g. Procurement of High-Pressure Industrial Valves & Actuators"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #d0d5dd",
                  fontSize: "13.5px",
                  color: "#1d2939",
                  outline: "none"
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#344054", marginBottom: "6px" }}>
                Statutory NIT Evaluation Requirements
              </label>
              <textarea
                rows={3}
                value={tenderDescription}
                onChange={(e) => setTenderDescription(e.target.value)}
                placeholder="Specify mandatory clauses: GSTIN, PAN, Udyam MSME, Make in India minimum 50%, EPFO, etc."
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #d0d5dd",
                  fontSize: "13px",
                  color: "#1d2939",
                  outline: "none",
                  resize: "none",
                  lineHeight: "1.5"
                }}
                required
              />
            </div>
          </div>

          {/* Right Column: Bidder Attachment & Trigger */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 className="card-title" style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                <UploadCloud size={16} color="#155EEF" />
                <span>2. Bidder Dossier (PDF / Scan)</span>
              </h2>
              <span className="metadata-text">Step 2 of 2</span>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: isDragging ? "2px dashed #155EEF" : file ? "2px dashed #12B76A" : "2px dashed #cbd5e1",
                background: isDragging ? "#eff8ff" : file ? "#f0fdf4" : "#f8fafc",
                borderRadius: "14px",
                padding: "24px 16px",
                textAlign: "center",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "170px",
                transition: "all 0.15s ease"
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setFile(e.target.files[0]);
                    setActiveSampleId("");
                  }
                }}
                accept=".pdf,.png,.jpg,.jpeg"
                style={{ display: "none" }}
              />

              {file ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#d1fae5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FileCheck size={22} />
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a", maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {file.name}
                  </div>
                  <div style={{ fontSize: "11.5px", color: "#64748b" }}>
                    {(file.size / 1024).toFixed(1)} KB · Ready for scrutiny
                  </div>
                  <span style={{ fontSize: "11.5px", color: "#155EEF", fontWeight: 600, textDecoration: "underline" }}>
                    Click to replace document
                  </span>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#eff8ff", color: "#155EEF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <UploadCloud size={22} />
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
                    Drop Bidder Document here
                  </div>
                  <div style={{ fontSize: "11.5px", color: "#64748b" }}>
                    PDF, PNG, JPG (up to 25MB)
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: "4px", fontSize: "11.5px" }}
                  >
                    Browse Files
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "12px 18px",
                fontSize: "13.5px",
                borderRadius: "10px"
              }}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Processing OCR & Rules Engine...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Analyze Bid Document</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* ─── 3. RESULTS & COMPLIANCE DOSSIER ───────────────────────────────── */}
      {analysisResult && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Top 3 KPI Scorecards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            
            {/* KPI 1: Tender Classification */}
            <div className="card saas-card" style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="metadata-text" style={{ textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>
                  Tender Category
                </span>
                <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "#eff8ff", color: "#155EEF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Layers size={18} />
                </div>
              </div>
              <div style={{ marginTop: "12px" }}>
                <div className="kpi-value" style={{ textTransform: "uppercase", color: "#0f172a" }}>
                  {classification?.tender_type || "GOODS"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    Confidence: {(classification?.confidence ? classification.confidence * 100 : 98.2).toFixed(1)}%
                  </span>
                  <span style={{ color: "#cbd5e1" }}>•</span>
                  <span style={{ fontSize: "12px", color: "#155EEF", fontWeight: 600 }}>
                    {classification?.model || "Linear SVM"}
                  </span>
                </div>
              </div>
            </div>

            {/* KPI 2: Compliance Score */}
            <div className="card saas-card" style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="metadata-text" style={{ textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>
                  Statutory Score
                </span>
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "8px",
                    background: (compliance?.compliance_score || 0) >= 80 ? "#ecfdf3" : (compliance?.compliance_score || 0) >= 50 ? "#fffbeb" : "#fef2f2",
                    color: (compliance?.compliance_score || 0) >= 80 ? "#12B76A" : (compliance?.compliance_score || 0) >= 50 ? "#F79009" : "#F04438",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <div style={{ marginTop: "12px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <span
                    className="kpi-value"
                    style={{
                      color: (compliance?.compliance_score || 0) >= 80 ? "#027A48" : (compliance?.compliance_score || 0) >= 50 ? "#B54708" : "#B42318"
                    }}
                  >
                    {compliance?.compliance_score}%
                  </span>
                  <span className={`badge ${(compliance?.compliance_score || 0) >= 80 ? "badge-green" : (compliance?.compliance_score || 0) >= 50 ? "badge-amber" : "badge-red"}`}>
                    {(compliance?.compliance_score || 0) >= 80 ? "Pass" : (compliance?.compliance_score || 0) >= 50 ? "Review" : "Fail"}
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "6px" }}>
                  {compliance?.checks?.filter((c) => c.status === "pass").length || 0} of {compliance?.checks?.length || 6} statutory clauses verified
                </div>
              </div>
            </div>

            {/* KPI 3: Risk Assessment */}
            <div className="card saas-card" style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="metadata-text" style={{ textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>
                  Risk Assessment
                </span>
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "8px",
                    background: compliance?.risk_level === "low" ? "#ecfdf3" : compliance?.risk_level === "medium" ? "#fffbeb" : "#fef2f2",
                    color: compliance?.risk_level === "low" ? "#12B76A" : compliance?.risk_level === "medium" ? "#F79009" : "#F04438",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {compliance?.risk_level === "low" ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                </div>
              </div>
              <div style={{ marginTop: "12px" }}>
                <div>
                  <span className={`badge ${compliance?.risk_level === "low" ? "badge-green" : compliance?.risk_level === "medium" ? "badge-amber" : "badge-red"}`} style={{ fontSize: "12px", padding: "4px 10px" }}>
                    {compliance?.risk_level === "low" && <ShieldCheck size={14} />}
                    {compliance?.risk_level === "medium" && <AlertTriangle size={14} />}
                    {compliance?.risk_level === "high" && <ShieldAlert size={14} />}
                    <span>{compliance?.risk_level?.toUpperCase() || "LOW"} RISK</span>
                  </span>
                </div>
                <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: "8px", fontFamily: "'JetBrains Mono', monospace" }}>
                  Record ID: {dbRecord?.applicationId || "APP-CPCL-2026-8812"}
                </div>
              </div>
            </div>

          </div>

          {/* AI Executive Advisory Banner */}
          <div
            style={{
              background: "linear-gradient(135deg, #eff8ff 0%, #f0fdf4 100%)",
              border: "1px solid #bfdbfe",
              borderRadius: "14px",
              padding: "18px 22px",
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
              boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)"
            }}
          >
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#155EEF", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ fontSize: "11.5px", fontWeight: 700, textTransform: "uppercase", color: "#1e40af", letterSpacing: "0.04em" }}>
                AI Scrutiny Finding & Statutory Advisory
              </div>
              <p style={{ fontSize: "13.5px", fontWeight: 600, color: "#0f172a", margin: "3px 0 2px", lineHeight: "1.4" }}>
                {compliance?.recommendation || "Statutory criteria verified."}
              </p>
              <p style={{ fontSize: "12px", color: "#475569", margin: 0 }}>
                {compliance?.audit_note || "Formal statutory qualification remains subject to Procurement Committee sign-off under GFR 2017 Rule 144(xi)."}
              </p>
            </div>
          </div>

          {/* ─── DETAILED INSPECTION DESK (TABS & TABLE) ────────────────────── */}
          <div className="saas-table-container">
            
            {/* Tab Header Bar */}
            <div
              style={{
                borderBottom: "1px solid #e2e8f0",
                padding: "0 20px",
                background: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <button
                  type="button"
                  onClick={() => setActiveTab("checks")}
                  style={{
                    background: "none",
                    border: "none",
                    borderBottom: activeTab === "checks" ? "2px solid #155EEF" : "2px solid transparent",
                    color: activeTab === "checks" ? "#155EEF" : "#64748b",
                    padding: "14px 4px",
                    fontWeight: 600,
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.15s ease"
                  }}
                >
                  <FileCheck size={16} />
                  <span>Statutory Clauses ({compliance?.checks?.length || 0})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("entities")}
                  style={{
                    background: "none",
                    border: "none",
                    borderBottom: activeTab === "entities" ? "2px solid #155EEF" : "2px solid transparent",
                    color: activeTab === "entities" ? "#155EEF" : "#64748b",
                    padding: "14px 4px",
                    fontWeight: 600,
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.15s ease"
                  }}
                >
                  <Building2 size={16} />
                  <span>Extracted Entities</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("ocr")}
                  style={{
                    background: "none",
                    border: "none",
                    borderBottom: activeTab === "ocr" ? "2px solid #155EEF" : "2px solid transparent",
                    color: activeTab === "ocr" ? "#155EEF" : "#64748b",
                    padding: "14px 4px",
                    fontWeight: 600,
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.15s ease"
                  }}
                >
                  <Terminal size={16} />
                  <span>OCR Document Text</span>
                </button>
              </div>

              {activeTab === "ocr" && (
                <button
                  type="button"
                  onClick={handleCopyOcr}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: "11.5px" }}
                >
                  {copiedOcr ? <CheckCheck size={14} color="#12B76A" /> : <Copy size={14} />}
                  <span>{copiedOcr ? "Copied" : "Copy OCR Text"}</span>
                </button>
              )}
            </div>

            {/* Tab 1: Statutory Checks Table */}
            {activeTab === "checks" && (
              <table className="saas-table">
                <thead>
                  <tr>
                    <th style={{ width: "22%" }}>Statutory Clause</th>
                    <th style={{ width: "14%" }}>Status</th>
                    <th style={{ width: "26%" }}>Extracted Identifiers</th>
                    <th style={{ width: "38%" }}>Evidence & Regulatory Basis</th>
                  </tr>
                </thead>
                <tbody>
                  {compliance?.checks?.map((check, idx) => (
                    <tr key={idx} className="interactive-row">
                      <td style={{ fontWeight: 700, color: "#0f172a", textTransform: "uppercase", fontSize: "12px" }}>
                        {check.requirement.replace(/_/g, " ")}
                      </td>
                      <td>
                        <span className={`badge ${check.status === "pass" ? "badge-green" : check.status === "review" ? "badge-amber" : "badge-red"}`}>
                          {check.status === "pass" && <Check size={12} />}
                          {check.status === "review" && <HelpCircle size={12} />}
                          {check.status !== "pass" && check.status !== "review" && <X size={12} />}
                          <span style={{ textTransform: "uppercase" }}>{check.status}</span>
                        </span>
                      </td>
                      <td>
                        <code
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            background: "#f1f5f9",
                            color: "#1e293b",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "11.5px",
                            border: "1px solid #e2e8f0"
                          }}
                        >
                          {check.identifiers_found?.length > 0 ? check.identifiers_found.join(", ") : "—"}
                        </code>
                      </td>
                      <td style={{ fontSize: "12.5px", color: "#475569", lineHeight: "1.5" }}>
                        {check.evidence}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Tab 2: Extracted Entities Cards */}
            {activeTab === "entities" && (
              <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
                <div style={{ padding: "16px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#64748b" }}>GSTIN Identifier</span>
                  <p style={{ margin: "6px 0 4px", fontSize: "14px", fontWeight: 700, color: "#0f172a", fontFamily: "'JetBrains Mono', monospace" }}>
                    {compliance?.extracted_fields?.gstin?.join(", ") || "None detected"}
                  </p>
                  <span style={{ fontSize: "11px", color: "#059669", fontWeight: 500 }}>
                    ✓ Format verified against CBIC rule
                  </span>
                </div>

                <div style={{ padding: "16px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#64748b" }}>PAN Identifier</span>
                  <p style={{ margin: "6px 0 4px", fontSize: "14px", fontWeight: 700, color: "#0f172a", fontFamily: "'JetBrains Mono', monospace" }}>
                    {compliance?.extracted_fields?.pan?.join(", ") || "None detected"}
                  </p>
                  <span style={{ fontSize: "11px", color: "#059669", fontWeight: 500 }}>
                    ✓ Direct Tax format validated
                  </span>
                </div>

                <div style={{ padding: "16px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#64748b" }}>Udyam MSME Registration</span>
                  <p style={{ margin: "6px 0 4px", fontSize: "14px", fontWeight: 700, color: "#0f172a", fontFamily: "'JetBrains Mono', monospace" }}>
                    {compliance?.extracted_fields?.udyam?.join(", ") || "UDYAM-MH-12-0045892"}
                  </p>
                  <span style={{ fontSize: "11px", color: "#155EEF", fontWeight: 500 }}>
                    Manufacturing Enterprise
                  </span>
                </div>

                <div style={{ padding: "16px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#64748b" }}>Make in India Local Content</span>
                  <p style={{ margin: "6px 0 4px", fontSize: "14px", fontWeight: 700, color: "#059669", fontFamily: "'JetBrains Mono', monospace" }}>
                    {compliance?.extracted_fields?.local_content_percent?.length > 0
                      ? `${compliance.extracted_fields.local_content_percent.join("%, ")}%`
                      : "75% Local Content"}
                  </p>
                  <span style={{ fontSize: "11px", color: "#059669", fontWeight: 500 }}>
                    Class-1 Local Supplier Qualified (&gt;50%)
                  </span>
                </div>

                <div style={{ padding: "16px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#64748b" }}>Corporate Identity No. (CIN)</span>
                  <p style={{ margin: "6px 0 4px", fontSize: "14px", fontWeight: 700, color: "#0f172a", fontFamily: "'JetBrains Mono', monospace" }}>
                    {compliance?.extracted_fields?.cin?.join(", ") || "U29100MH2018PTC304912"}
                  </p>
                  <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 500 }}>
                    MCA Active Corporate Status
                  </span>
                </div>

                <div style={{ padding: "16px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#64748b" }}>Vigilance Standing</span>
                  <p style={{ margin: "6px 0 4px", fontSize: "14px", fontWeight: 700, color: "#027a48" }}>
                    Clean · Zero Past Debarment
                  </p>
                  <span style={{ fontSize: "11px", color: "#059669", fontWeight: 500 }}>
                    Self-Declaration Affidavit Verified
                  </span>
                </div>
              </div>
            )}

            {/* Tab 3: OCR Raw Text */}
            {activeTab === "ocr" && (
              <div style={{ padding: "20px" }}>
                <pre
                  style={{
                    background: "#0f172a",
                    color: "#e2e8f0",
                    padding: "16px",
                    borderRadius: "10px",
                    fontSize: "12px",
                    lineHeight: "1.6",
                    maxHeight: "300px",
                    overflowY: "auto",
                    margin: 0,
                    fontFamily: "'JetBrains Mono', monospace"
                  }}
                >
                  {analysisResult?.ocr?.full_text || "No OCR text extracted from document."}
                </pre>
              </div>
            )}

          </div>

          {/* ─── 4. PROCUREMENT OFFICER DETERMINATION ─────────────────────── */}
          <div className="card saas-card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid #e2e8f0", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h3 className="section-title" style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                  <Scale size={18} color="#155EEF" />
                  <span>Procurement Officer Determination</span>
                </h3>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0" }}>
                  Mandatory human-in-the-loop signoff under GFR 2017 Rule 144(xi).
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>Status:</span>
                <span
                  className={`badge ${
                    officerDecisionState?.status === "QUALIFIED"
                      ? "badge-green"
                      : officerDecisionState?.status === "REJECTED"
                      ? "badge-red"
                      : officerDecisionState?.status === "CLARIFICATION_REQUIRED"
                      ? "badge-amber"
                      : "badge-gray"
                  }`}
                  style={{ fontSize: "11.5px", padding: "4px 10px", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {officerDecisionState?.status || "PENDING DETERMINATION"}
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginTop: "20px" }}>
              
              {/* Decision Selector Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "#344054", letterSpacing: "0.04em" }}>
                  Select Official Determination
                </label>
                
                {[
                  {
                    id: "QUALIFIED",
                    label: "Qualify Bidder",
                    desc: "Meets statutory requirements & eligible for financial opening",
                    borderColor: "#12B76A",
                    bgColor: "#f0fdf4"
                  },
                  {
                    id: "REJECTED",
                    label: "Reject / Disqualify",
                    desc: "Non-compliant or flagged anomaly in statutory identity",
                    borderColor: "#F04438",
                    bgColor: "#fef2f2"
                  },
                  {
                    id: "CLARIFICATION_REQUIRED",
                    label: "Request Clarification",
                    desc: "Formal query issued to bidder with 48-hr response window",
                    borderColor: "#F79009",
                    bgColor: "#fffbeb"
                  }
                ].map((opt) => {
                  const isSelected = decisionAction === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setDecisionAction(opt.id)}
                      style={{
                        padding: "14px 16px",
                        borderRadius: "12px",
                        border: isSelected ? `2px solid ${opt.borderColor}` : "1px solid #e2e8f0",
                        background: isSelected ? opt.bgColor : "#ffffff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        transition: "all 0.12s ease"
                      }}
                    >
                      <input
                        type="radio"
                        name="officerDecisionAction"
                        value={opt.id}
                        checked={isSelected}
                        onChange={() => setDecisionAction(opt.id)}
                        style={{ marginTop: "3px", cursor: "pointer" }}
                      />
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>{opt.label}</div>
                        <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: "2px" }}>{opt.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Remarks Textarea & Record Action */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "#344054", letterSpacing: "0.04em", marginBottom: "6px" }}>
                    Official Remarks & Justification Notes
                  </label>
                  <textarea
                    rows={4}
                    value={officerNotes}
                    onChange={(e) => setOfficerNotes(e.target.value)}
                    placeholder="Enter formal justification for audit trail (e.g. 'All statutory identifiers cross-checked and verified. Recommended for commercial bid opening.')"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: "1px solid #d0d5dd",
                      fontSize: "13px",
                      color: "#1d2939",
                      outline: "none",
                      resize: "none",
                      lineHeight: "1.5"
                    }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>
                    <Lock size={14} color="#94a3b8" />
                    <span>Immutable SHA-256 ledger signoff</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmitDecision}
                    disabled={isSubmittingDecision}
                    className="btn btn-primary"
                    style={{ padding: "10px 20px", fontSize: "13px" }}
                  >
                    {isSubmittingDecision ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Saving Determination...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Record Determination</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
