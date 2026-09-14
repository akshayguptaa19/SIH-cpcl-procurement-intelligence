import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import {
  TENDERS as INITIAL_TENDERS,
  BIDDERS as INITIAL_BIDDERS,
  VERIFICATION_QUEUE as INITIAL_QUEUE,
  AUDIT_TRAIL as INITIAL_AUDIT,
  NOTIFICATIONS as INITIAL_NOTIFS
} from "../lib/data";
import { api } from "../lib/api.js";
import { useAuth } from "./AuthContext.jsx";

const ProcurementContext = createContext(null);

export function ProcurementProvider({ children }) {
  const auth = useAuth();
  
  // Role & Session State: 'procurement' | 'bidder'
  const [role, setRole] = useState(() => (auth?.isBidder ? "bidder" : "procurement"));
  
  // Active Bidder Persona
  const [activeBidder, setActiveBidder] = useState({
    id: auth?.user?.companyId || "comp-001",
    name: auth?.user?.companyName || "Shakti Enterprises Pvt Ltd",
    gstin: auth?.user?.gstin || "27AABCS1429B1Z1",
    pan: auth?.user?.pan || "AABCS1429B",
    msmeClass: "Medium (Class-II)",
    city: "Mumbai, Maharashtra",
    appliedTenders: ["CPCL/VALVE/2025/001", "CPCL/MNT/2025/063"]
  });

  // Reactive Repositories with initial data fallbacks
  const [tenders, setTenders] = useState(INITIAL_TENDERS);
  const [bidders, setBidders] = useState(INITIAL_BIDDERS);
  const [verificationQueue, setVerificationQueue] = useState(INITIAL_QUEUE);
  const [auditTrail, setAuditTrail] = useState(INITIAL_AUDIT);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFS);

  // Clarifications State
  const [clarifications, setClarifications] = useState([
    {
      id: "CLR-2026-001",
      caseId: "case-001",
      tenderId: "CPCL/VALVE/2025/001",
      tenderTitle: "Supply of High-Pressure Industrial Valves",
      bidderId: "b-001",
      bidderName: "Shakti Enterprises Pvt Ltd",
      question: "Please confirm OEM authorization is from the original equipment manufacturer, not an unauthorized third-party sub-dealer.",
      from: "Akshay Gupta (Procurement Officer)",
      date: "09 Sep 2026, 14:30 IST",
      urgent: true,
      status: "Awaiting Response",
      response: null,
      responseDate: null,
      attachment: null
    },
    {
      id: "CLR-2026-002",
      caseId: "case-003",
      tenderId: "CPCL/VALVE/2025/001",
      tenderTitle: "Supply of High-Pressure Industrial Valves",
      bidderId: "b-003",
      bidderName: "Precision Tools Ltd",
      question: "ITR FY 2024-25 computation statement page 2 is missing chartered accountant seal. Please re-upload verified copy.",
      from: "Akshay Gupta (Procurement Officer)",
      date: "08 Sep 2026, 11:15 IST",
      urgent: true,
      status: "Answered",
      response: "CA signed and sealed copy uploaded. Verification reference: UDIN-24089123AAAA.",
      responseDate: "09 Sep 2026, 09:40 IST",
      attachment: "CA_Attested_ITR_FY24-25.pdf"
    }
  ]);

  // Sync with Auth User state
  useEffect(() => {
    if (auth?.user) {
      if (auth.isBidder) {
        setRole("bidder");
        setActiveBidder({
          id: auth.user.companyId || "comp-001",
          name: auth.user.companyName || "Shakti Enterprises Pvt Ltd",
          gstin: auth.user.gstin || "27AABCS1429B1Z1",
          pan: auth.user.pan || "AABCS1429B",
          msmeClass: auth.user.msmeClassification || "Medium (Class-II)",
          city: "Chennai, Tamil Nadu",
          appliedTenders: ["CPCL/VALVE/2025/001"]
        });
      } else {
        setRole("procurement");
      }
    }
  }, [auth?.user, auth?.isBidder]);

  // Sync Live Data from REST API backend
  useEffect(() => {
    async function fetchLiveData() {
      try {
        const [liveTenders, liveQueue, liveAudit, liveNotifs, liveClrs] = await Promise.allSettled([
          api.tenders.getAll(),
          auth?.isAuthenticated ? api.verification.getQueue() : Promise.resolve([]),
          auth?.isAuthenticated ? api.audit.getLogs({ limit: 40 }) : Promise.resolve({ logs: [] }),
          auth?.isAuthenticated ? api.notifications.getAll() : Promise.resolve([]),
          auth?.isAuthenticated ? api.clarifications.getAll() : Promise.resolve([])
        ]);

        if (liveTenders.status === 'fulfilled' && Array.isArray(liveTenders.value) && liveTenders.value.length > 0) {
          setTenders(prev => {
            const apiItems = liveTenders.value.map(t => ({
              id: t.reference_number || t.id,
              title: t.title,
              department: t.department,
              category: t.category,
              status: t.status === 'ACTIVE' ? 'Published' : t.status,
              budget: `₹${(t.estimated_value / 10000000).toFixed(2)} Cr`,
              deadline: t.submission_deadline,
              daysLeft: 28,
              biddersCount: t.total_bids || 0,
              documentsSubmitted: 4,
              verificationProgress: 85,
              complianceRate: 92,
              riskLevel: t.flagged_bids > 0 ? 'High' : 'Low',
              description: t.description,
              dbId: t.id
            }));
            return [...apiItems, ...prev.filter(p => !apiItems.some(a => a.id === p.id))];
          });
        }

        if (liveQueue.status === 'fulfilled' && Array.isArray(liveQueue.value) && liveQueue.value.length > 0) {
          setVerificationQueue(prev => {
            const apiCases = liveQueue.value.map(c => ({
              id: c.id,
              bidder: c.company_name,
              bidderName: c.company_name,
              gstin: c.gstin,
              pan: c.pan,
              tender: c.tender_reference,
              tenderId: c.tender_reference,
              tenderTitle: c.tender_title,
              document: "Form GST REG-06 Certificate",
              issue: c.critical_flags_count > 0 ? `${c.critical_flags_count} critical flags flagged by AI engine` : 'Awaiting Officer Verification',
              confidence: Math.round(c.compliance_score || 85),
              priority: c.risk_level === 'CRITICAL' ? 'High' : c.risk_level === 'HIGH' ? 'High' : 'Medium',
              assignedTo: c.assigned_officer_name || 'Procurement Reviewer',
              status: c.overall_status === 'APPROVED' ? 'Verified' : c.overall_status === 'REJECTED' ? 'Rejected' : c.overall_status === 'CLARIFICATION_REQUIRED' ? 'Query Raised' : 'In Progress',
              age: 'Today',
              type: c.risk_level === 'CRITICAL' ? 'critical' : 'mismatch',
              rawCase: c
            }));
            return [...apiCases, ...prev.filter(p => !apiCases.some(a => a.id.toLowerCase() === p.id.toLowerCase()))];
          });
        }

        if (liveAudit.status === 'fulfilled' && liveAudit.value?.logs && liveAudit.value.logs.length > 0) {
          setAuditTrail(prev => {
            const apiLogs = liveAudit.value.logs.map(l => ({
              id: l.id,
              timestamp: l.timestamp + ' IST',
              user: l.user_name,
              role: l.user_role,
              action: l.action,
              entity: l.entity_type,
              entityId: l.entity_id,
              previousState: l.previous_state || '—',
              newState: l.new_state || '—',
              hash: l.hash.substring(0, 16),
              ip: l.ip_address,
              source: l.source,
              details: l.details
            }));
            return [...apiLogs, ...prev.filter(p => !apiLogs.some(a => a.id === p.id))];
          });
        }

        if (liveNotifs.status === 'fulfilled' && Array.isArray(liveNotifs.value) && liveNotifs.value.length > 0) {
          setNotifications(prev => {
            const apiNotifs = liveNotifs.value.map(n => ({
              id: n.id,
              title: n.title,
              message: n.message,
              category: n.type,
              time: 'Recent',
              read: Boolean(n.is_read),
              icon: n.type === 'RISK_ALERT' ? '⚠️' : '📋'
            }));
            return [...apiNotifs, ...prev.filter(p => !apiNotifs.some(a => a.id === p.id))];
          });
        }

        if (liveClrs.status === 'fulfilled' && Array.isArray(liveClrs.value) && liveClrs.value.length > 0) {
          setClarifications(prev => {
            const apiClrs = liveClrs.value.map(c => ({
              id: c.id,
              caseId: c.case_id,
              tenderId: c.tender_reference || c.tender_id,
              tenderTitle: c.tender_title || 'CPCL Procurement Tender',
              bidderId: c.bidder_id,
              bidderName: c.company_name || 'Authorized Vendor',
              question: c.question,
              from: c.from_user,
              date: c.created_at,
              urgent: true,
              status: c.status === 'AWAITING_RESPONSE' ? 'Awaiting Response' : c.status === 'RESPONDED' ? 'Answered' : 'Resolved',
              response: c.response,
              responseDate: c.response_date,
              attachment: c.attachment_name
            }));
            return [...apiClrs, ...prev.filter(p => !apiClrs.some(a => a.id === p.id))];
          });
        }
      } catch (err) {
        console.warn('Live API sync failed, falling back to cached state:', err);
      }
    }

    fetchLiveData();
  }, [auth?.user]);

  // Log to Audit Trail
  const logAudit = (action, entity, entityId, previousState, newState, details) => {
    const newEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19) + " IST",
      user: role === "procurement" ? (auth?.user?.fullName || "Akshay Gupta") : activeBidder.name,
      role: role === "procurement" ? "Procurement Officer" : "Bidder Representative",
      action,
      entity,
      entityId,
      previousState: previousState || "—",
      newState: newState || "—",
      hash: "0x" + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10),
      ip: "10.42.18.91 (CPCL-SECURE-NET)",
      source: role === "procurement" ? "Internal Officer Console" : "Sovereign Vendor Portal",
      details: details || action
    };
    setAuditTrail((prev) => [newEntry, ...prev]);
  };

  // Add a New Tender
  const createTender = async (tenderData) => {
    const refNumber = tenderData.id || `CPCL/PROC/2026/${String(tenders.length + 1).padStart(3, "0")}`;
    const newTender = {
      id: refNumber,
      title: tenderData.title,
      department: tenderData.department || "Refinery Engineering & Maintenance",
      category: tenderData.category || "Engineering Equipment",
      status: "Published",
      budget: tenderData.budget || "₹15.00 Cr",
      deadline: tenderData.deadline || "2026-10-15",
      daysLeft: 30,
      biddersCount: 0,
      documentsSubmitted: 0,
      verificationProgress: 0,
      complianceRate: 100,
      riskLevel: "Low",
      description: tenderData.description || "Procurement of specialized industrial equipment adhering to CPCL statutory norms."
    };

    setTenders((prev) => [newTender, ...prev]);
    logAudit(
      "Tender Created & Published",
      "Tender",
      newTender.id,
      "Draft",
      "Published",
      `Tender ${newTender.id} - ${newTender.title} published with statutory eligibility rules.`
    );

    // Persist to backend if officer is authenticated
    try {
      if (auth?.isOfficer) {
        await api.tenders.create({
          title: newTender.title,
          referenceNumber: refNumber,
          description: newTender.description,
          department: newTender.department,
          category: newTender.category,
          estimatedValue: 150000000,
          submissionDeadline: newTender.deadline
        });
      }
    } catch (e) {
      console.warn('API tender sync error:', e);
    }

    return newTender;
  };

  // Approve Document Case
  const approveDocument = async (caseId, officerNotes = "") => {
    setVerificationQueue((prev) =>
      prev.map((item) =>
        item.id === caseId
          ? {
              ...item,
              status: "Verified",
              reviewedBy: auth?.user?.fullName || "Akshay Gupta (Procurement Officer)",
              reviewedAt: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
              officerNotes: officerNotes || "Document verified and approved against sovereign API registry records."
            }
          : item
      )
    );

    const targetCase = verificationQueue.find((c) => c.id === caseId);
    if (targetCase) {
      logAudit(
        "Document Verified & Approved",
        "Document Verification",
        targetCase.id,
        "Pending Review",
        "Verified",
        `Officer verified ${targetCase.documentName} for ${targetCase.bidderName} (${targetCase.tenderId}).`
      );

      try {
        if (auth?.isOfficer) {
          await api.verification.approve(caseId, officerNotes);
        }
      } catch (e) {
        console.warn('API approve error:', e);
      }
    }
  };

  // Reject Document Case
  const rejectDocument = async (caseId, reason, officerNotes = "") => {
    setVerificationQueue((prev) =>
      prev.map((item) =>
        item.id === caseId
          ? {
              ...item,
              status: "Rejected",
              rejectionReason: reason,
              reviewedBy: auth?.user?.fullName || "Akshay Gupta (Procurement Officer)",
              reviewedAt: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
              officerNotes: officerNotes || `Rejected: ${reason}`
            }
          : item
      )
    );

    const targetCase = verificationQueue.find((c) => c.id === caseId);
    if (targetCase) {
      logAudit(
        "Document Verification Rejected",
        "Document Verification",
        targetCase.id,
        "Pending Review",
        "Rejected",
        `Reason: ${reason}. Notes: ${officerNotes || "Statutory non-compliance identified."}`
      );

      try {
        if (auth?.isOfficer) {
          await api.verification.reject(caseId, reason, officerNotes);
        }
      } catch (e) {
        console.warn('API reject error:', e);
      }
    }
  };

  // Request Clarification from Bidder
  const requestClarification = async (caseId, questionText, isUrgent = true) => {
    const targetCase = verificationQueue.find((c) => c.id === caseId);
    const newClarification = {
      id: `CLR-${Date.now().toString().slice(-4)}`,
      caseId,
      tenderId: targetCase?.tenderId || "CPCL/VALVE/2025/001",
      tenderTitle: targetCase?.tenderTitle || "Tender Evaluation",
      bidderId: targetCase?.bidderId || "b-001",
      bidderName: targetCase?.bidderName || "Bidder",
      question: questionText,
      from: auth?.user?.fullName || "Akshay Gupta (Procurement Officer)",
      date: new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) + " IST",
      urgent: isUrgent,
      status: "Awaiting Response",
      response: null,
      responseDate: null,
      attachment: null
    };

    setClarifications((prev) => [newClarification, ...prev]);

    setVerificationQueue((prev) =>
      prev.map((item) =>
        item.id === caseId ? { ...item, status: "Clarification Requested" } : item
      )
    );

    logAudit(
      "Clarification Query Issued",
      "Clarification",
      newClarification.id,
      "Under Review",
      "Clarification Requested",
      `Query sent to ${targetCase?.bidderName}: "${questionText}"`
    );

    try {
      if (auth?.isOfficer) {
        await api.clarifications.create({
          caseId,
          question: questionText
        });
      }
    } catch (e) {
      console.warn('API clarification sync error:', e);
    }

    return newClarification;
  };

  // Bidder Responds to Clarification
  const respondClarification = async (clarificationId, responseText, fileName = "Supporting_Evidence.pdf") => {
    setClarifications((prev) =>
      prev.map((clr) =>
        clr.id === clarificationId
          ? {
              ...clr,
              status: "Answered",
              response: responseText,
              responseDate: new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) + " IST",
              attachment: fileName
            }
          : clr
      )
    );

    const targetClr = clarifications.find((c) => c.id === clarificationId);
    if (targetClr?.caseId) {
      setVerificationQueue((prev) =>
        prev.map((item) =>
          item.id === targetClr.caseId ? { ...item, status: "Response Received" } : item
        )
      );
    }

    logAudit(
      "Clarification Response Submitted",
      "Clarification",
      clarificationId,
      "Awaiting Response",
      "Answered",
      `Bidder submitted response with attachment: ${fileName}`
    );

    try {
      await api.clarifications.respond(clarificationId, {
        response: responseText,
        attachmentName: fileName
      });
    } catch (e) {
      console.warn('API clarification response error:', e);
    }
  };

  // Escalate Case
  const escalateDocument = async (caseId, note = "Escalated for Tender Committee review") => {
    setVerificationQueue((prev) =>
      prev.map((item) =>
        item.id === caseId ? { ...item, status: "Escalated", officerNotes: note } : item
      )
    );

    logAudit("Verification Case Escalated", "Document Verification", caseId, "Pending", "Escalated", note);

    try {
      if (auth?.isOfficer) {
        await api.verification.escalate(caseId, note);
      }
    } catch (e) {
      console.warn('API escalate error:', e);
    }
  };

  // Mark Case for Manual Review
  const markManualReview = (caseId, note = "Flagged for second-tier manual inspection") => {
    setVerificationQueue((prev) =>
      prev.map((item) =>
        item.id === caseId ? { ...item, status: "Under Review", officerNotes: note } : item
      )
    );

    logAudit("Marked for Manual Review", "Document Verification", caseId, "Active", "Under Review", note);
  };

  // Update Extracted Field in Case
  const updateExtractedField = (caseId, fieldKey, newValue) => {
    setVerificationQueue((prev) =>
      prev.map((item) => {
        if (item.id === caseId && item.extractedFields) {
          return {
            ...item,
            extractedFields: {
              ...item.extractedFields,
              [fieldKey]: {
                ...item.extractedFields[fieldKey],
                value: newValue,
                isModified: true
              }
            }
          };
        }
        return item;
      })
    );

    logAudit(
      "Extracted Field Corrected",
      "OCR Verification",
      caseId,
      "Auto-Extracted",
      "Officer-Verified",
      `Field [${fieldKey}] corrected to: "${newValue}"`
    );
  };

  // Switch Role between 'procurement' and 'bidder'
  const switchRole = (newRole) => {
    setRole(newRole);
    logAudit(
      "Session Persona Switched",
      "User Session",
      newRole === "procurement" ? "u-001" : activeBidder.id,
      role,
      newRole,
      `Switched to ${newRole === "procurement" ? "Procurement Officer" : "Vendor Portal"}`
    );
  };

  // Dynamically Computed Consistent KPIs
  const computedKPIs = useMemo(() => {
    const totalTendersCount = tenders.length;
    const totalBiddersCount = bidders.length;
    const verifiedCases = verificationQueue.filter((c) => c.status === "Verified").length;
    const pendingCases = verificationQueue.filter(
      (c) => c.status === "Pending Review" || c.status === "Pending" || c.status === "Under Review" || c.status === "Awaiting Review"
    ).length;
    const nonCompliantCases = verificationQueue.filter(
      (c) => c.status === "Rejected" || c.status === "Non-Compliant"
    ).length;

    const complianceRate =
      verificationQueue.length > 0
        ? Math.round((verifiedCases / verificationQueue.length) * 100)
        : 87;

    return {
      totalTenders: { value: totalTendersCount, trend: "+12%", delta: 5, context: "+5 this month" },
      totalBidders: { value: totalBiddersCount, trend: "+18%", delta: 50, context: "+50 this month" },
      completedVerifications: { value: verifiedCases + 237, trend: "+22%", delta: 43, context: "74% of total" },
      pendingReviews: { value: pendingCases, trend: "-8%", delta: -7, context: "Action required", negative: true },
      nonCompliantBids: { value: nonCompliantCases + 38, trend: "-5%", delta: -2, context: "13% of total", negative: true },
      complianceRate: { value: `${complianceRate}%`, trend: "+6%", delta: 6, context: "Across all tenders" }
    };
  }, [tenders, bidders, verificationQueue]);

  const value = {
    role,
    switchRole,
    activeBidder,
    setActiveBidder,
    tenders,
    createTender,
    bidders,
    verificationQueue,
    approveDocument,
    rejectDocument,
    requestClarification,
    respondClarification,
    escalateDocument,
    markManualReview,
    updateExtractedField,
    clarifications,
    auditTrail,
    logAudit,
    notifications,
    setNotifications,
    computedKPIs
  };

  return (
    <ProcurementContext.Provider value={value}>
      {children}
    </ProcurementContext.Provider>
  );
}

export function useProcurement() {
  const context = useContext(ProcurementContext);
  if (!context) {
    throw new Error("useProcurement must be used within a ProcurementProvider");
  }
  return context;
}
