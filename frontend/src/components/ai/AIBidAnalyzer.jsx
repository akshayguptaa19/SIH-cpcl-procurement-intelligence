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
  Layers,
  Cpu,
  Database,
  Search,
  ExternalLink,
  ChevronDown,
  Info
} from "lucide-react";
import { api } from "../../lib/api.js";
import { useToast } from "../common/ToastProvider.jsx";
import PageHeader from "../common/PageHeader.jsx";

// Pre-built synthetic test documents for one-click instant testing
const SAMPLE_DOCUMENTS = [
  {
    id: "sample-goods",
    title: "High-Pressure Valves Bid (Valid Goods)",
    tenderTitle: "Procurement of High-Pressure Industrial Valves",
    tenderDescription: "Mandatory: Valid GSTIN, PAN, Udyam MSME, and Non-Blacklisting self-declaration.",
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
    filename: "Shakti_Valves_Bid_Valid.pdf"
  },
  {
    id: "sample-works",
    title: "Refinery Pipeline Construction (Valid Works)",
    tenderTitle: "Engineering Construction of Cross-Country Crude Pipeline & Civil Foundation",
    tenderDescription: "Works Contract. Mandatory: GSTIN, PAN, EPFO, ESIC, and non-blacklisting declaration.",
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
    filename: "Larsen_Civil_Works_Bid.pdf"
  },
  {
    id: "sample-mismatch",
    title: "PAN ↔ GST Mismatch Anomaly",
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
    filename: "Apex_Mismatch_Anomaly_Bid.pdf"
  }
];

export default function AIBidAnalyzer({ onNavigate }) {
  const { showToast } = useToast();

  const [tendersList, setTendersList] = useState([]);
  const [selectedTenderId, setSelectedTenderId] = useState("");
  const [tenderTitle, setTenderTitle] = useState("Supply of High-Pressure Industrial Valves & Actuators");
  const [tenderDescription, setTenderDescription] = useState(
    "Bidder shall submit valid GSTIN, PAN, and Udyam MSME registration. A declaration of no blacklisting is mandatory."
  );

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  // Result state
  const [analysisResult, setAnalysisResult] = useState(null);
  const [portalResultsState, setPortalResultsState] = useState(null);
  const [dbRecord, setDbRecord] = useState(null);
  const [officerDecisionState, setOfficerDecisionState] = useState(null);

  // Officer Decision form
  const [decisionAction, setDecisionAction] = useState("QUALIFIED");
  const [officerNotes, setOfficerNotes] = useState("");
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);

  // OCR Copy
  const [copiedOcr, setCopiedOcr] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'checks' | 'ocr' | 'portal'

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
  }, []);

  const handleSelectTender = (e) => {
    const tId = e.target.value;
    setSelectedTenderId(tId);
    const selected = tendersList.find(t => t.id === tId);
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
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // One-click sample test loader
  const handleLoadSample = (sample) => {
    const blob = new Blob([sample.content], { type: "application/pdf" });
    const sampleFile = new File([blob], sample.filename, { type: "application/pdf" });
    setFile(sampleFile);
    setTenderTitle(sample.tenderTitle);
    setTenderDescription(sample.tenderDescription);
    showToast({
      type: "info",
      title: "Sample Bid Loaded",
      message: `Loaded ${sample.title} for instant AI testing.`
    });
  };

  // Primary AI Analysis Execution
  const handleRunAnalysis = async (e) => {
    if (e) e.preventDefault();
    if (!file) {
      showToast({
        type: "error",
        title: "Document Required",
        message: "Please select or drag a PDF or image document to analyze."
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep(1);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tenderTitle", tenderTitle);
    formData.append("tenderDescription", tenderDescription);
    if (selectedTenderId) formData.append("tenderId", selectedTenderId);
    formData.append("saveToDb", "true");

    try {
      // Animated step progress for UX
      setTimeout(() => setAnalysisStep(2), 700);
      setTimeout(() => setAnalysisStep(3), 1600);

      const response = await api.ai.analyzeFile(formData);

      setAnalysisStep(4);
      setAnalysisResult(response.ai_result);
      setPortalResultsState(response.portal_results);
      setDbRecord(response.database_record);
      setOfficerDecisionState(response.officer_decision);
      setOfficerNotes("");

      showToast({
        type: "success",
        title: "AI Analysis Complete",
        message: `Tender classified as ${response.ai_result?.tender_classification?.tender_type?.toUpperCase()} with score ${response.ai_result?.compliance_assessment?.compliance_score}%.`
      });
    } catch (err) {
      console.error("AI Analysis Failed:", err);
      showToast({
        type: "error",
        title: "AI Processing Error",
        message: err.message || "Failed to analyze document."
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep(0);
    }
  };

  // Submit Procurement Officer Decision
  const handleSubmitDecision = async () => {
    const appId = dbRecord?.applicationId || analysisResult?.applicationId;
    if (!appId) {
      showToast({
        type: "error",
        title: "Application ID Missing",
        message: "Cannot submit officer decision without a registered application record."
      });
      return;
    }

    setIsSubmittingDecision(true);
    try {
      const res = await api.ai.submitOfficerDecision(appId, {
        decision: decisionAction,
        notes: officerNotes
      });

      setOfficerDecisionState({
        status: res.decision,
        officer_remarks: res.notes,
        decided_at: res.decided_at
      });

      showToast({
        type: "success",
        title: "Officer Decision Saved",
        message: `Bid Application ${appId} marked as ${res.decision} independently of AI score.`
      });
    } catch (err) {
      showToast({
        type: "error",
        title: "Submission Error",
        message: err.message || "Failed to record officer determination."
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
        title: "OCR Text Copied",
        message: "Full extracted OCR text copied to clipboard."
      });
    }
  };

  const compliance = analysisResult?.compliance_assessment;
  const classification = analysisResult?.tender_classification;
  const consistencyCheck = compliance?.checks?.find(c => c.requirement === "gstin_pan_consistency");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="AI Bid Intelligence & Compliance Engine"
        subtitle="Connects multi-modal OCR, TF-IDF+Linear SVM tender classification, regex identifier extraction, and hybrid statutory compliance evaluation."
        badge="AI ENGINE ONLINE"
      />

      {/* Input & Upload Panel */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Analyze Bid Document with Sovereign AI
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload bidder PDF or image documents. The AI module runs OCR, classification, and compliance rules.
            </p>
          </div>

          {/* Quick-sample buttons for instant testing */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500 mr-1">Quick Test Samples:</span>
            {SAMPLE_DOCUMENTS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleLoadSample(sample)}
                className="px-3 py-1.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-xs font-medium text-slate-700 hover:text-indigo-600 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <FileCheck className="w-3.5 h-3.5 text-indigo-500" />
                {sample.title.split(" ")[0]} ({sample.id.replace("sample-", "")})
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleRunAnalysis} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tender Configuration */}
            <div className="space-y-4">
              {tendersList.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Tender Reference (Optional)
                  </label>
                  <select
                    value={selectedTenderId}
                    onChange={handleSelectTender}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="">-- Custom Tender Title & NIT Text --</option>
                    {tendersList.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.reference_number || t.id} — {t.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tender Title (Feeds Linear SVM Classifier)
                </label>
                <input
                  type="text"
                  value={tenderTitle}
                  onChange={(e) => setTenderTitle(e.target.value)}
                  placeholder="e.g. Procurement of High-Pressure Industrial Valves"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tender Description & Statutory Requirements (NIT)
                </label>
                <textarea
                  rows={3}
                  value={tenderDescription}
                  onChange={(e) => setTenderDescription(e.target.value)}
                  placeholder="e.g. Bidder shall submit GSTIN, PAN, Udyam MSME, and a non-blacklisting declaration."
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Mention requirements like GST, PAN, Udyam, Make in India, EPFO, ESIC, or Blacklisting to trigger AI compliance checks.
                </p>
              </div>
            </div>

            {/* Document Upload Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Bidder Document / Attachment
              </label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[195px] ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-50/50"
                    : file
                    ? "border-emerald-300 bg-emerald-50/20"
                    : "border-slate-200 hover:border-slate-300 bg-slate-50/40 hover:bg-slate-50"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFile(e.target.files[0]);
                    }
                  }}
                  accept=".pdf,.png,.jpg,.jpeg,.bmp,.tiff"
                  className="hidden"
                />

                {file ? (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800 max-w-xs truncate">
                      {file.name}
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5">
                      {(file.size / 1024).toFixed(1)} KB · Ready for AI OCR & Scoring
                    </span>
                    <span className="text-[11px] text-indigo-600 font-medium mt-2 hover:underline">
                      Click to choose a different file
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      Drop bidder PDF or scan image here
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      Supports PDF, PNG, JPG, JPEG (up to 15MB)
                    </span>
                    <span className="mt-3 px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-md shadow-sm">
                      Browse Computer
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Cpu className="w-4 h-4 text-slate-400" />
              <span>Pipeline: PyMuPDF + Tesseract OCR → Linear SVM Classifier → Compliance Engine</span>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing || !file}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all shadow-sm flex items-center gap-2 ${
                isAnalyzing || !file
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-indigo-600/20"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {analysisStep === 1 && "Uploading Document..."}
                  {analysisStep === 2 && "Running Tesseract OCR..."}
                  {analysisStep === 3 && "Executing Hybrid AI Engine..."}
                  {analysisStep >= 4 && "Finalizing Results..."}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Run AI Bid Analysis
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* AI Analysis Results Dashboard */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Top Score Cards Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Tender Classification */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tender Category
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold uppercase tracking-tight text-indigo-700">
                  {classification?.tender_type || "N/A"}
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                  {classification?.model || "TF-IDF + SVM"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Classified from tender title & NIT description.
              </p>
            </div>

            {/* Compliance Score */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Compliance Score
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span
                  className={`text-3xl font-black ${
                    (compliance?.compliance_score || 0) >= 80
                      ? "text-emerald-600"
                      : (compliance?.compliance_score || 0) >= 50
                      ? "text-amber-600"
                      : "text-rose-600"
                  }`}
                >
                  {compliance?.compliance_score}%
                </span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    (compliance?.compliance_score || 0) >= 80
                      ? "bg-emerald-500"
                      : (compliance?.compliance_score || 0) >= 50
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }`}
                  style={{ width: `${compliance?.compliance_score || 0}%` }}
                />
              </div>
            </div>

            {/* Risk Level */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Risk Assessment
              </span>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    compliance?.risk_level === "low"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : compliance?.risk_level === "medium"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  {compliance?.risk_level === "low" && <ShieldCheck className="w-4 h-4" />}
                  {compliance?.risk_level === "medium" && <AlertTriangle className="w-4 h-4" />}
                  {compliance?.risk_level === "high" && <ShieldAlert className="w-4 h-4" />}
                  {compliance?.risk_level || "MEDIUM"} RISK
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-3 truncate">
                {compliance?.checks?.filter(c => c.status === "pass").length} passed ·{" "}
                {compliance?.checks?.filter(c => c.status === "review").length} review ·{" "}
                {compliance?.checks?.filter(c => c.status === "fail" || c.status === "missing").length} flags
              </p>
            </div>

            {/* Application ID / Database record */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Registry Application ID
              </span>
              <div className="mt-2">
                <span className="text-sm font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                  {dbRecord?.applicationId || "APP-SAVED"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Persisted in SQLite database</span>
              </p>
            </div>
          </div>

          {/* AI Recommendation Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-indigo-800/40 shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                      AI Recommendation (Decision Support Only)
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white mt-1">
                    {compliance?.recommendation || "Evaluation completed."}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {compliance?.audit_note || "Official statutory qualification remains with the Procurement Officer."}
                    </span>
                  </p>
                </div>
              </div>

              {/* GSTIN ↔ PAN Consistency Pill */}
              {consistencyCheck && (
                <div
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 shrink-0 ${
                    consistencyCheck.status === "pass"
                      ? "bg-emerald-950/60 border-emerald-700/60 text-emerald-300"
                      : "bg-rose-950/60 border-rose-700/60 text-rose-300"
                  }`}
                >
                  {consistencyCheck.status === "pass" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                  <span>GSTIN ↔ PAN Check: {consistencyCheck.status.toUpperCase()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Main Inspection Tabs */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Tabs Header */}
            <div className="border-b border-slate-200 px-6 flex items-center justify-between bg-slate-50/50">
              <div className="flex space-x-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className={`py-3.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === "overview"
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Extracted Identifiers & Summary
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("checks")}
                  className={`py-3.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === "checks"
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  Statutory Requirements Checklist ({compliance?.checks?.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("portal")}
                  className={`py-3.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === "portal"
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Government Portal Gateway (Demo/Mock)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("ocr")}
                  className={`py-3.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === "ocr"
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  OCR Text ({analysisResult?.ocr?.page_count || 1} Page)
                </button>
              </div>

              {activeTab === "ocr" && (
                <button
                  type="button"
                  onClick={handleCopyOcr}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md bg-white hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
                >
                  {copiedOcr ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedOcr ? "Copied" : "Copy OCR Text"}
                </button>
              )}
            </div>

            {/* Tab 1: Extracted Identifiers Overview */}
            {activeTab === "overview" && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">
                    Regex & Entity Extraction (from Uploaded Bid Document)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-xs font-medium text-slate-500">GSTIN Candidate(s)</span>
                      <p className="text-sm font-mono font-bold text-slate-900 mt-1">
                        {compliance?.extracted_fields?.gstin?.length > 0
                          ? compliance.extracted_fields.gstin.join(", ")
                          : "None detected"}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-xs font-medium text-slate-500">Permanent Account Number (PAN)</span>
                      <p className="text-sm font-mono font-bold text-slate-900 mt-1">
                        {compliance?.extracted_fields?.pan?.length > 0
                          ? compliance.extracted_fields.pan.join(", ")
                          : "None detected"}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-xs font-medium text-slate-500">Udyam / MSME Registration</span>
                      <p className="text-sm font-mono font-bold text-slate-900 mt-1">
                        {compliance?.extracted_fields?.udyam?.length > 0
                          ? compliance.extracted_fields.udyam.join(", ")
                          : "None detected"}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-xs font-medium text-slate-500">Corporate Identity No. (CIN)</span>
                      <p className="text-sm font-mono font-bold text-slate-900 mt-1">
                        {compliance?.extracted_fields?.cin?.length > 0
                          ? compliance.extracted_fields.cin.join(", ")
                          : "None detected"}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-xs font-medium text-slate-500">Make in India Local Content %</span>
                      <p className="text-sm font-mono font-bold text-slate-900 mt-1">
                        {compliance?.extracted_fields?.local_content_percent?.length > 0
                          ? `${compliance.extracted_fields.local_content_percent.join("%, ")}%`
                          : "Not explicitly declared in %"}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-xs font-medium text-slate-500">Detected Requirements in NIT</span>
                      <p className="text-xs font-semibold text-indigo-700 mt-1 uppercase">
                        {compliance?.detected_requirements?.join(", ") || "None"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Consistency Notice */}
                {consistencyCheck && (
                  <div
                    className={`p-4 rounded-xl border flex items-start gap-3 ${
                      consistencyCheck.status === "pass"
                        ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                        : "bg-rose-50/60 border-rose-200 text-rose-900"
                    }`}
                  >
                    {consistencyCheck.status === "pass" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="text-sm font-bold">
                        GSTIN ↔ PAN Cross-Verification Check: {consistencyCheck.status.toUpperCase()}
                      </h4>
                      <p className="text-xs mt-0.5 opacity-90">{consistencyCheck.evidence}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Statutory Checklist */}
            {activeTab === "checks" && (
              <div className="p-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="pb-3">Statutory Requirement</th>
                      <th className="pb-3">Evaluation Status</th>
                      <th className="pb-3">Identifiers Extracted</th>
                      <th className="pb-3">Evidence & Regulatory Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {compliance?.checks?.map((check, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 font-semibold text-slate-800 uppercase tracking-wide text-xs">
                          {check.requirement.replace(/_/g, " ")}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                              check.status === "pass"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : check.status === "review"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : check.status === "missing"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-rose-100 text-rose-800 border border-rose-300"
                            }`}
                          >
                            {check.status === "pass" && <Check className="w-3 h-3" />}
                            {check.status === "review" && <HelpCircle className="w-3 h-3" />}
                            {(check.status === "missing" || check.status === "fail") && <X className="w-3 h-3" />}
                            {check.status}
                          </span>
                        </td>
                        <td className="py-3.5 font-mono text-xs text-slate-700">
                          {check.identifiers_found?.length > 0 ? check.identifiers_found.join(", ") : "—"}
                        </td>
                        <td className="py-3.5 text-xs text-slate-600 max-w-md">{check.evidence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab 3: Government Portal Gateway */}
            {activeTab === "portal" && (
              <div className="p-6 space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Mandatory Statutory Transparency Notice:</strong> All portal responses below are clearly marked as{" "}
                    <code>Demo/Mock Verification</code>. The platform never displays simulated verification as live production government data.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portalResultsState &&
                    Object.entries(portalResultsState).map(([key, val]) => (
                      <div key={key} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            {key.replace(/_/g, " ")} Gateway
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Demo / Mock Verification
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 space-y-1">
                          <p>
                            <strong>Status:</strong>{" "}
                            <span className="font-semibold text-emerald-700 uppercase">
                              {val.status || "VERIFIED"}
                            </span>
                          </p>
                          <p>
                            <strong>Source:</strong> {val.source}
                          </p>
                          {val.note && (
                            <p className="text-slate-500 italic">
                              <strong>Note:</strong> {val.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Tab 4: OCR Extracted Text */}
            {activeTab === "ocr" && (
              <div className="p-6">
                <div className="bg-slate-900 rounded-xl p-4 text-slate-200 font-mono text-xs leading-relaxed max-h-96 overflow-y-auto whitespace-pre-wrap border border-slate-800 selection:bg-indigo-500/30">
                  {analysisResult?.ocr?.full_text || "No OCR text extracted."}
                </div>
              </div>
            )}
          </div>

          {/* Separate Procurement Officer Determination Action Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  Procurement Officer Final Determination
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Stored separately in the database from the AI recommendation. The Procurement Officer holds final legal authority.
                </p>
              </div>

              {/* Current Decision Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Current Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    officerDecisionState?.status === "QUALIFIED"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : officerDecisionState?.status === "REJECTED"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : officerDecisionState?.status === "CLARIFICATION_REQUIRED"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                >
                  {officerDecisionState?.status || "PENDING REVIEW"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Officer Determination
                </label>
                <div className="space-y-2">
                  {[
                    { id: "QUALIFIED", label: "Qualify Bidder", desc: "Statutory & Technical requirements verified" },
                    { id: "REJECTED", label: "Reject / Disqualify", desc: "Mandatory non-compliance or identity anomaly" },
                    { id: "CLARIFICATION_REQUIRED", label: "Request Clarification", desc: "Issue statutory query to bidder" }
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        decisionAction === opt.id
                          ? "bg-indigo-50/60 border-indigo-300 ring-1 ring-indigo-500"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="officerDecision"
                        value={opt.id}
                        checked={decisionAction === opt.id}
                        onChange={(e) => setDecisionAction(e.target.value)}
                        className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{opt.label}</div>
                        <div className="text-[11px] text-slate-500">{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Formal Officer Remarks & Justification Notes
                  </label>
                  <textarea
                    rows={4}
                    value={officerNotes}
                    onChange={(e) => setOfficerNotes(e.target.value)}
                    placeholder="Enter formal justification for audit trail (e.g. 'All statutory identifiers cross-checked and verified with GSTN & Udyam portals. Recommended for commercial bid opening.')"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleSubmitDecision}
                    disabled={isSubmittingDecision}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isSubmittingDecision ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Recording Decision...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Record Official Decision Separately
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
