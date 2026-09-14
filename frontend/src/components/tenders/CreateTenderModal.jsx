import React, { useState } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  FileText,
  Calendar,
  ShieldCheck,
  Plus,
  Trash2,
  Save,
  Send,
  Building2,
  AlertCircle
} from "lucide-react";
import { useProcurement } from "../../context/ProcurementContext";
import { useToast } from "../common/ToastProvider";

const STEPS = [
  { id: 1, label: "Basic Info", icon: Building2 },
  { id: 2, label: "Timeline", icon: Calendar },
  { id: 3, label: "Eligibility", icon: ShieldCheck },
  { id: 4, label: "Documents", icon: FileText },
  { id: 5, label: "Review & Publish", icon: CheckCircle2 }
];

const DEPARTMENTS = [
  "Refinery Engineering & Maintenance",
  "Instrumentation & Control Systems",
  "Pipeline Operations & Safety",
  "Electrical Infrastructure & HV Substation",
  "Information Technology & Cyber Security",
  "Quality Assurance & Inspection"
];

const CATEGORIES = [
  "Engineering Equipment",
  "Safety Systems & ESD",
  "Maintenance Services",
  "Control Instruments",
  "Catalysts & Chemicals",
  "IT & SCADA Systems"
];

const DEFAULT_DOC_CHECKLIST = [
  { id: "doc-1", name: "Valid GST Registration Certificate (Form GST REG-06)", mandatory: true, description: "Active regular filing status verified against GSTN portal" },
  { id: "doc-2", name: "Permanent Account Number (PAN) Card", mandatory: true, description: "Matching Income Tax Department PAN registry" },
  { id: "doc-3", name: "Audited Financial Statements & Balance Sheets (Last 3 FYs)", mandatory: true, description: "Attested by Chartered Accountant with valid UDIN" },
  { id: "doc-4", name: "Turnover Certificate from Statutory Auditor", mandatory: true, description: "Certifying average annual turnover exceeds threshold" },
  { id: "doc-5", name: "OEM Authorization Certificate (Manufacturer Direct)", mandatory: true, description: "Direct authorization letter without sub-distributor layers" },
  { id: "doc-6", name: "Prior Experience & Completion Certificates", mandatory: true, description: "Satisfactory execution in Indian refinery/petrochemical sector" },
  { id: "doc-7", name: "MSME / Udyam Registration Certificate", mandatory: false, description: "For statutory purchase preference / EMD exemption eligibility" }
];

export default function CreateTenderModal({ isOpen, onClose, onCreated }) {
  const { createTender } = useProcurement();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    title: "",
    id: `CPCL/PROC/2026/${Math.floor(100 + Math.random() * 900)}`,
    department: DEPARTMENTS[0],
    category: CATEGORIES[0],
    description: "",
    estimatedBudget: "15.50",

    // Step 2: Timeline
    publicationDate: new Date().toISOString().split("T")[0],
    submissionStartDate: new Date().toISOString().split("T")[0],
    submissionDeadline: "2026-10-15",
    technicalOpeningDate: "2026-10-18",

    // Step 3: Eligibility Requirements
    minTurnover: "10.00",
    minExperienceYears: "3",
    gstMandatory: true,
    panMandatory: true,
    udyamMandatory: false,
    technicalQualification: "ISO 9001:2015 certified manufacturing facility with API 6D stamp certification.",
    otherRequirements: "No past debarment by CVC, GeM, or Ministry of Petroleum & Natural Gas.",

    // Step 4: Documents
    requiredDocuments: DEFAULT_DOC_CHECKLIST,
    customDocName: "",
    customDocDesc: ""
  });

  if (!isOpen) return null;

  // Validation per step
  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = "Tender Title is required.";
      if (!formData.id.trim()) newErrors.id = "Tender ID is required.";
      if (!formData.description.trim()) newErrors.description = "Brief description is required.";
    } else if (step === 2) {
      if (!formData.submissionDeadline) newErrors.submissionDeadline = "Submission deadline is mandatory.";
      if (formData.submissionDeadline <= formData.submissionStartDate) {
        newErrors.submissionDeadline = "Deadline must be after submission start date.";
      }
    } else if (step === 3) {
      if (!formData.minTurnover || Number(formData.minTurnover) <= 0) {
        newErrors.minTurnover = "Valid minimum annual turnover is required.";
      }
      if (!formData.minExperienceYears) {
        newErrors.minExperienceYears = "Minimum experience is required.";
      }
    } else if (step === 4) {
      if (formData.requiredDocuments.length === 0) {
        newErrors.documents = "At least one document requirement must be specified.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleAddCustomDoc = () => {
    if (!formData.customDocName.trim()) return;
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: formData.customDocName.trim(),
      mandatory: true,
      description: formData.customDocDesc.trim() || "Statutory tender requirement"
    };
    setFormData((prev) => ({
      ...prev,
      requiredDocuments: [...prev.requiredDocuments, newDoc],
      customDocName: "",
      customDocDesc: ""
    }));
  };

  const handleRemoveDoc = (id) => {
    setFormData((prev) => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.filter((d) => d.id !== id)
    }));
  };

  const handleToggleMandatory = (id) => {
    setFormData((prev) => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.map((d) =>
        d.id === id ? { ...d, mandatory: !d.mandatory } : d
      )
    }));
  };

  const handlePublish = () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Please complete all required fields before publishing."
      });
      return;
    }

    const newTender = createTender({
      id: formData.id,
      title: formData.title,
      department: formData.department,
      category: formData.category,
      budget: `₹${formData.estimatedBudget} Cr`,
      deadline: formData.submissionDeadline,
      description: formData.description,
      eligibility: {
        turnover: `₹${formData.minTurnover} Cr`,
        experience: `${formData.minExperienceYears} Years`,
        gstMandatory: formData.gstMandatory,
        panMandatory: formData.panMandatory,
        udyamMandatory: formData.udyamMandatory,
        technical: formData.technicalQualification
      },
      requirements: formData.requiredDocuments.map((d) => d.name)
    });

    showToast({
      type: "success",
      title: "Tender Published Successfully",
      message: `${newTender.id} is now live and accepting bids.`
    });

    onCreated?.(newTender);
    onClose();
  };

  const handleSaveDraft = () => {
    showToast({
      type: "info",
      title: "Draft Saved",
      message: `Tender ${formData.id} draft saved to session.`
    });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
      onClick={onClose}
    >
      <div
        className="anim-modal"
        style={{
          width: "100%",
          maxWidth: 820,
          background: "#ffffff",
          borderRadius: 14,
          boxShadow: "var(--shadow-modal)",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "92vh"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#ffffff"
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#1d4ed8", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              CPCL E-Procurement Portal · MoPNG
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "2px 0 0" }}>
              Create New Public Tender
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f1f5f9",
              border: "none",
              borderRadius: 8,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#64748b"
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Progression Ribbon */}
        <div
          style={{
            padding: "12px 24px",
            background: "#f8fafc",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            overflowX: "auto"
          }}
        >
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <React.Fragment key={step.id}>
                <div
                  onClick={() => isCompleted && setCurrentStep(step.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: isCompleted ? "pointer" : "default",
                    opacity: isCurrent || isCompleted ? 1 : 0.5
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      background: isCompleted ? "#16a34a" : isCurrent ? "#1d4ed8" : "#e2e8f0",
                      color: isCompleted || isCurrent ? "#ffffff" : "#64748b"
                    }}
                  >
                    {isCompleted ? "✓" : step.id}
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: isCurrent ? 700 : 500,
                      color: isCurrent ? "#0f172a" : "#64748b",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <ChevronRight size={14} style={{ color: "#cbd5e1", flexShrink: 0 }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
          {/* STEP 1: Basic Information */}
          {currentStep === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Tender Title <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    className="saas-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Supply and Commissioning of Hydrocracker High-Pressure Valves"
                    style={{ width: "100%" }}
                  />
                  {errors.title && <span style={{ fontSize: 11.5, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.title}</span>}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Tender Reference ID <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    className="saas-input"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    style={{ width: "100%", fontFamily: "monospace", fontWeight: 600 }}
                  />
                  {errors.id && <span style={{ fontSize: 11.5, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.id}</span>}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Department
                  </label>
                  <select
                    className="saas-select"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    style={{ width: "100%" }}
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Procurement Category
                  </label>
                  <select
                    className="saas-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: "100%" }}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Estimated Budget (₹ Cr)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="saas-input"
                    value={formData.estimatedBudget}
                    onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Scope of Work & Technical Description <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <textarea
                    rows={3}
                    className="saas-input"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed procurement parameters, design specifications, and statutory compliance framework..."
                    style={{ width: "100%", resize: "vertical" }}
                  />
                  {errors.description && <span style={{ fontSize: 11.5, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.description}</span>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Timeline */}
          {currentStep === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8, padding: "12px 16px", display: "flex", gap: 10 }}>
                <Calendar size={18} style={{ color: "#0284c7", marginTop: 2, flexShrink: 0 }} />
                <div style={{ fontSize: 12.5, color: "#0369a1", lineHeight: 1.4 }}>
                  Ensure timelines comply with Central Vigilance Commission (CVC) statutory bidding window norms (minimum 21 days for national competitive bidding).
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Notice Inviting Tender (NIT) Date
                  </label>
                  <input
                    type="date"
                    className="saas-input"
                    value={formData.publicationDate}
                    onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Bid Submission Start Date
                  </label>
                  <input
                    type="date"
                    className="saas-input"
                    value={formData.submissionStartDate}
                    onChange={(e) => setFormData({ ...formData, submissionStartDate: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Bid Submission Deadline <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="date"
                    className="saas-input"
                    value={formData.submissionDeadline}
                    onChange={(e) => setFormData({ ...formData, submissionDeadline: e.target.value })}
                    style={{ width: "100%" }}
                  />
                  {errors.submissionDeadline && <span style={{ fontSize: 11.5, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.submissionDeadline}</span>}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Technical Bid Opening Date
                  </label>
                  <input
                    type="date"
                    className="saas-input"
                    value={formData.technicalOpeningDate}
                    onChange={(e) => setFormData({ ...formData, technicalOpeningDate: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Eligibility Requirements */}
          {currentStep === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Minimum Average Annual Turnover (₹ Cr) <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    className="saas-input"
                    value={formData.minTurnover}
                    onChange={(e) => setFormData({ ...formData, minTurnover: e.target.value })}
                    style={{ width: "100%" }}
                  />
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                    Average of past 3 audited financial years (verified against MCA21/ITR).
                  </div>
                  {errors.minTurnover && <span style={{ fontSize: 11.5, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.minTurnover}</span>}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Minimum Experience in Petroleum/Process Sector (Years) <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="number"
                    className="saas-input"
                    value={formData.minExperienceYears}
                    onChange={(e) => setFormData({ ...formData, minExperienceYears: e.target.value })}
                    style={{ width: "100%" }}
                  />
                  {errors.minExperienceYears && <span style={{ fontSize: 11.5, color: "#ef4444", marginTop: 4, display: "block" }}>{errors.minExperienceYears}</span>}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 8 }}>
                  Statutory Registrations
                </label>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#0f172a", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={formData.gstMandatory}
                      onChange={(e) => setFormData({ ...formData, gstMandatory: e.target.checked })}
                    />
                    Mandatory Active GSTIN
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#0f172a", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={formData.panMandatory}
                      onChange={(e) => setFormData({ ...formData, panMandatory: e.target.checked })}
                    />
                    Mandatory PAN Card
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#0f172a", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={formData.udyamMandatory}
                      onChange={(e) => setFormData({ ...formData, udyamMandatory: e.target.checked })}
                    />
                    Udyam MSME Preference Eligible
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                  Technical Qualification Criteria
                </label>
                <textarea
                  rows={2}
                  className="saas-input"
                  value={formData.technicalQualification}
                  onChange={(e) => setFormData({ ...formData, technicalQualification: e.target.value })}
                  style={{ width: "100%", resize: "vertical" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                  Integrity & Non-Debarment Stipulations
                </label>
                <textarea
                  rows={2}
                  className="saas-input"
                  value={formData.otherRequirements}
                  onChange={(e) => setFormData({ ...formData, otherRequirements: e.target.value })}
                  style={{ width: "100%", resize: "vertical" }}
                />
              </div>
            </div>
          )}

          {/* STEP 4: Required Documents Checklist */}
          {currentStep === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontSize: 12.5, color: "#64748b" }}>
                Define the mandatory and supplementary document verification criteria evaluated by the automated OCR and Sovereign API gateways.
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {formData.requiredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: 1, minWidth: 0 }}>
                      <FileText size={16} style={{ color: "#1d4ed8", marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
                          {doc.name}
                        </div>
                        <div style={{ fontSize: 11.5, color: "#64748b" }}>
                          {doc.description}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                      <button
                        onClick={() => handleToggleMandatory(doc.id)}
                        className={`badge ${doc.mandatory ? "badge-red" : "badge-gray"}`}
                        style={{ border: "none", cursor: "pointer", fontSize: 11 }}
                      >
                        {doc.mandatory ? "Mandatory" : "Optional"}
                      </button>
                      <button
                        onClick={() => handleRemoveDoc(doc.id)}
                        style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: 4 }}
                        title="Remove requirement"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom Document */}
              <div
                style={{
                  background: "#f1f5f9",
                  borderRadius: 8,
                  padding: "12px 14px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr auto",
                  gap: 10,
                  alignItems: "center"
                }}
              >
                <input
                  className="saas-input"
                  placeholder="Custom Document Name..."
                  value={formData.customDocName}
                  onChange={(e) => setFormData({ ...formData, customDocName: e.target.value })}
                  style={{ background: "#ffffff" }}
                />
                <input
                  className="saas-input"
                  placeholder="Verification Instruction..."
                  value={formData.customDocDesc}
                  onChange={(e) => setFormData({ ...formData, customDocDesc: e.target.value })}
                  style={{ background: "#ffffff" }}
                />
                <button
                  onClick={handleAddCustomDoc}
                  className="btn btn-secondary btn-sm"
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Review & Publish */}
          {currentStep === 5 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                style={{
                  background: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  borderRadius: 10,
                  padding: "14px 18px",
                  display: "flex",
                  gap: 12
                }}
              >
                <CheckCircle2 size={20} style={{ color: "#059669", marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#065f46" }}>
                    Ready for Sovereign E-Procurement Publication
                  </div>
                  <div style={{ fontSize: 12, color: "#047857", marginTop: 2 }}>
                    Publishing will register this tender in the CPCL Central Procurement Repository, enable automated AI OCR parsing on submissions, and broadcast to enrolled vendors.
                  </div>
                </div>
              </div>

              <div className="saas-card" style={{ padding: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>TENDER ID</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", fontFamily: "monospace" }}>{formData.id}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>DEPARTMENT</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{formData.department}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>ESTIMATED BUDGET</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1d4ed8" }}>₹{formData.estimatedBudget} Cr</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>SUBMISSION DEADLINE</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{formData.submissionDeadline}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>MIN TURNOVER</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>₹{formData.minTurnover} Cr</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>MANDATORY DOCUMENTS</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{formData.requiredDocuments.filter((d) => d.mandatory).length} Items</div>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
                  <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>TENDER TITLE</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{formData.title || "Untitled Tender"}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid #e2e8f0",
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <button
            onClick={handleSaveDraft}
            className="btn btn-secondary btn-sm"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <Save size={14} /> Save Draft
          </button>

          <div style={{ display: "flex", gap: 10 }}>
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="btn btn-secondary btn-sm"
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <ChevronLeft size={14} /> Back
              </button>
            )}

            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                className="btn btn-primary btn-sm"
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                Continue <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={handlePublish}
                className="btn btn-primary btn-sm"
                style={{ display: "flex", alignItems: "center", gap: 6, background: "#16a34a" }}
              >
                <Send size={14} /> Publish Tender
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
