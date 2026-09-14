export const CURRENT_USER = {
  id: "u-001",
  name: "Akshay Gupta",
  role: "Procurement Officer",
  department: "Ministry of Petroleum & Natural Gas",
  organization: "CPCL",
  avatar: "AG",
  email: "akshay.gupta@cpcl.gov.in"
};
export const KPI_DATA = {
  totalTenders: { value: 48, trend: "+12%", delta: 5, context: "+5 this month" },
  totalBidders: { value: 326, trend: "+18%", delta: 50, context: "+50 this month" },
  completedVerifications: { value: 241, trend: "+22%", delta: 43, context: "74% of total" },
  pendingReviews: { value: 85, trend: "-8%", delta: -7, context: "28% of total", negative: true },
  nonCompliantBids: { value: 42, trend: "-5%", delta: -2, context: "13% of total", negative: true },
  complianceRate: { value: "87%", trend: "+6%", delta: 6, context: "Across all tenders" },
  highRiskBidders: { value: 30, trend: "-3%", delta: -1, context: "Critical cases" },
  verificationSuccess: { value: "94%", trend: "+2%", delta: 2, context: "This week" }
};
export const PIPELINE_STAGES = [
  { id: "registered", label: "Bidders Registered", count: 326, status: "done" },
  { id: "uploaded", label: "Documents Uploaded", count: 298, status: "done" },
  { id: "verified", label: "AI Verification Completed", count: 241, status: "active" },
  { id: "review", label: "Under Review", count: 85, status: "pending" },
  { id: "non-compliant", label: "Non-Compliant", count: 42, status: "pending" }
];
export const COMPLIANCE_DISTRIBUTION = [
  { name: "Compliant", value: 221, percent: 68, color: "#16a34a" },
  { name: "Minor Issues", value: 59, percent: 18, color: "#d97706" },
  { name: "Non-Compliant", value: 33, percent: 10, color: "#dc2626" },
  { name: "Under Review", value: 13, percent: 4, color: "#2563eb" }
];
export const RISK_DISTRIBUTION = [
  { label: "Low", value: 158, color: "#16a34a", bg: "#dcfce7" },
  { label: "Medium", value: 86, color: "#d97706", bg: "#fef3c7" },
  { label: "High", value: 52, color: "#dc2626", bg: "#fee2e2" },
  { label: "Critical", value: 30, color: "#991b1b", bg: "#fee2e2" }
];
export const RECENT_VERIFICATIONS = [
  {
    id: "v001",
    bidder: "ABC Engineering Pvt Ltd",
    avatar: "AE",
    avatarBg: "#dbeafe",
    avatarColor: "#1d4ed8",
    tender: "CPCL/VALVE/2025/001",
    document: "GST Certificate",
    aiResult: "Valid",
    status: "Verified",
    statusColor: "green",
    time: "2 hours ago",
    confidence: 97
  },
  {
    id: "v002",
    bidder: "Shakti Enterprises",
    avatar: "SE",
    avatarBg: "#fef3c7",
    avatarColor: "#b45309",
    tender: "CPCL/INST/2025/017",
    document: "Udyam Certificate",
    aiResult: "Mismatch",
    status: "Under Review",
    statusColor: "amber",
    time: "4 hours ago",
    confidence: 91
  },
  {
    id: "v003",
    bidder: "Global Petro Solutions",
    avatar: "GP",
    avatarBg: "#ede9fe",
    avatarColor: "#6d28d9",
    tender: "CPCL/MNT/2025/063",
    document: "Turnover Document",
    aiResult: "Valid",
    status: "Verified",
    statusColor: "green",
    time: "5 hours ago",
    confidence: 99
  },
  {
    id: "v004",
    bidder: "Noble Industrials",
    avatar: "NI",
    avatarBg: "#fee2e2",
    avatarColor: "#b91c1c",
    tender: "CPCL/ESD/2025/042",
    document: "OEM Authorization",
    aiResult: "Not Found",
    status: "Query Raised",
    statusColor: "red",
    time: "6 hours ago",
    confidence: 64
  },
  {
    id: "v005",
    bidder: "ArcTech Systems",
    avatar: "AS",
    avatarBg: "#dcfce7",
    avatarColor: "#15803d",
    tender: "CPCL/VALVE/2025/001",
    document: "PAN Card",
    aiResult: "Valid",
    status: "Verified",
    statusColor: "green",
    time: "8 hours ago",
    confidence: 98
  }
];
export const AI_INSIGHTS = [
  {
    id: "ai001",
    type: "mismatch",
    severity: "critical",
    title: "Unusual Turnover Pattern Detected",
    detail: "3 bidders show similar financial patterns across different tenders",
    time: "2 hours ago",
    confidence: 94,
    icon: "\u26A0\uFE0F",
    color: "#d97706",
    bg: "#fef3c7"
  },
  {
    id: "ai002",
    type: "risk",
    severity: "critical",
    title: "High-Risk Bidder Identified",
    detail: "Noble Industrials has past debarment records in another ministry",
    time: "5 hours ago",
    confidence: 99,
    icon: "\u{1F6A9}",
    color: "#dc2626",
    bg: "#fee2e2"
  },
  {
    id: "ai003",
    type: "anomaly",
    severity: "medium",
    title: "Document Anomaly Detected",
    detail: "GST certificate format mismatch detected in 5 submissions",
    time: "6 hours ago",
    confidence: 88,
    icon: "\u{1F4CB}",
    color: "#7c3aed",
    bg: "#ede9fe"
  },
  {
    id: "ai004",
    type: "positive",
    severity: "info",
    title: "Compliance Rate Improving",
    detail: "Overall compliance rate increased by 6% compared to last month",
    time: "1 day ago",
    confidence: 100,
    icon: "\u{1F4C8}",
    color: "#16a34a",
    bg: "#dcfce7"
  }
];
export const LIVE_INTEGRATIONS = [
  { name: "GST Verification", status: "Online", color: "#16a34a" },
  { name: "MCA (Company Data)", status: "Online", color: "#16a34a" },
  { name: "Udyam Registration", status: "Online", color: "#16a34a" },
  { name: "Income Tax PAN", status: "Online", color: "#16a34a" },
  { name: "CERSAI (Blacklisting)", status: "Online", color: "#16a34a" },
  { name: "GeM Portal API", status: "Online", color: "#16a34a" }
];
export const UPCOMING_DEADLINES = [
  { id: "t001", name: "Supply of Industrial Valves", tenderId: "CPCL/VALVE/2025/001", daysLeft: 3, date: "15 Sep", urgent: true },
  { id: "t002", name: "ESD Systems & Accessories", tenderId: "CPCL/ESD/2025/042", daysLeft: 6, date: "18 Sep", urgent: false },
  { id: "t003", name: "Instrumentation & Control Equip.", tenderId: "CPCL/INST/2025/017", daysLeft: 10, date: "22 Sep", urgent: false },
  { id: "t004", name: "Refinery Maintenance Services", tenderId: "CPCL/MNT/2025/063", daysLeft: 13, date: "25 Sep", urgent: false }
];
export const TENDER_PROGRESS = [
  { name: "Supply of Industrial Valves", id: "CPCL/VALVE/2025/001", progress: 68, bidders: 42, total: 62 },
  { name: "ESD Systems & Accessories", id: "CPCL/ESD/2025/042", progress: 45, bidders: 28, total: 62 },
  { name: "Instrumentation & Control Equipment", id: "CPCL/INST/2025/017", progress: 72, bidders: 36, total: 50 }
];
export const BIDDER_DISTRIBUTION = [
  { region: "North", percent: 28, color: "#1d4ed8" },
  { region: "West", percent: 24, color: "#7c3aed" },
  { region: "South", percent: 22, color: "#16a34a" },
  { region: "East", percent: 16, color: "#d97706" },
  { region: "Central", percent: 10, color: "#dc2626" }
];
export const TENDERS = [
  {
    id: "CPCL/VALVE/2025/001",
    name: "Supply of Industrial Valves",
    category: "Engineering Equipment",
    createdDate: "2025-08-01",
    deadline: "2025-09-15",
    bidders: 42,
    verificationProgress: 68,
    complianceRate: 81,
    status: "Evaluation",
    statusColor: "amber"
  },
  {
    id: "CPCL/ESD/2025/042",
    name: "ESD Systems & Accessories",
    category: "Safety Systems",
    createdDate: "2025-08-10",
    deadline: "2025-09-18",
    bidders: 28,
    verificationProgress: 45,
    complianceRate: 71,
    status: "Published",
    statusColor: "blue"
  },
  {
    id: "CPCL/INST/2025/017",
    name: "Instrumentation & Control Equipment",
    category: "Instruments",
    createdDate: "2025-08-15",
    deadline: "2025-09-22",
    bidders: 36,
    verificationProgress: 72,
    complianceRate: 89,
    status: "Evaluation",
    statusColor: "amber"
  },
  {
    id: "CPCL/MNT/2025/063",
    name: "Refinery Maintenance Services",
    category: "Services",
    createdDate: "2025-08-20",
    deadline: "2025-09-25",
    bidders: 56,
    verificationProgress: 55,
    complianceRate: 77,
    status: "Published",
    statusColor: "blue"
  },
  {
    id: "CPCL/PIPE/2025/009",
    name: "Pipeline Inspection Services",
    category: "Services",
    createdDate: "2025-07-01",
    deadline: "2025-08-30",
    bidders: 18,
    verificationProgress: 100,
    complianceRate: 94,
    status: "Completed",
    statusColor: "green"
  }
];
export const BIDDERS = [
  {
    id: "B001",
    name: "ABC Engineering Pvt Ltd",
    gstin: "27AABCA1234A1Z5",
    pan: "AABCA1234A",
    type: "MSME",
    turnover: "\u20B912.4 Cr",
    complianceScore: 94,
    riskLevel: "Low",
    riskColor: "green",
    status: "Verified",
    documents: { total: 12, verified: 12, pending: 0, issues: 0 },
    tender: "CPCL/VALVE/2025/001",
    state: "Maharashtra",
    issues: []
  },
  {
    id: "B002",
    name: "Shakti Enterprises",
    gstin: "24AABCS5678B2Z3",
    pan: "AABCS5678B",
    type: "MSME",
    turnover: "\u20B98.7 Cr",
    complianceScore: 71,
    riskLevel: "Medium",
    riskColor: "amber",
    status: "Under Review",
    documents: { total: 12, verified: 9, pending: 2, issues: 1 },
    tender: "CPCL/INST/2025/017",
    state: "Gujarat",
    issues: ["Udyam Certificate Mismatch"]
  },
  {
    id: "B003",
    name: "Global Petro Solutions",
    gstin: "07AABCG9012C3Z1",
    pan: "AABCG9012C",
    type: "Large",
    turnover: "\u20B945.2 Cr",
    complianceScore: 98,
    riskLevel: "Low",
    riskColor: "green",
    status: "Verified",
    documents: { total: 14, verified: 14, pending: 0, issues: 0 },
    tender: "CPCL/MNT/2025/063",
    state: "Delhi",
    issues: []
  },
  {
    id: "B004",
    name: "Noble Industrials",
    gstin: "33AABCN3456D4Z8",
    pan: "AABCN3456D",
    type: "Large",
    turnover: "\u20B928.9 Cr",
    complianceScore: 23,
    riskLevel: "Critical",
    riskColor: "red",
    status: "High Risk",
    documents: { total: 12, verified: 6, pending: 2, issues: 4 },
    tender: "CPCL/ESD/2025/042",
    state: "Tamil Nadu",
    issues: ["Debarment Record Found", "OEM Authorization Missing", "PAN-GST Mismatch", "Blacklisting Alert"]
  },
  {
    id: "B005",
    name: "ArcTech Systems",
    gstin: "29AABCA7890E5Z6",
    pan: "AABCA7890E",
    type: "Startup",
    turnover: "\u20B96.1 Cr",
    complianceScore: 86,
    riskLevel: "Low",
    riskColor: "green",
    status: "Verified",
    documents: { total: 13, verified: 12, pending: 1, issues: 0 },
    tender: "CPCL/VALVE/2025/001",
    state: "Karnataka",
    issues: []
  }
];
export const VERIFICATION_QUEUE = [
  {
    id: "VQ001",
    bidder: "Shakti Enterprises",
    tender: "CPCL/INST/2025/017",
    issue: "Udyam Certificate - Company name mismatch with PAN",
    confidence: 91,
    priority: "High",
    assignedTo: "Ravi Kumar",
    status: "In Progress",
    age: "4h",
    type: "mismatch"
  },
  {
    id: "VQ002",
    bidder: "Noble Industrials",
    tender: "CPCL/ESD/2025/042",
    issue: "OEM Authorization document not found",
    confidence: 64,
    priority: "High",
    assignedTo: "Priya Sharma",
    status: "Query Raised",
    age: "6h",
    type: "missing"
  },
  {
    id: "VQ003",
    bidder: "Precision Tools Ltd",
    tender: "CPCL/VALVE/2025/001",
    issue: "ITR certificate - OCR confidence low (64%)",
    confidence: 64,
    priority: "Medium",
    assignedTo: "Unassigned",
    status: "Pending",
    age: "1d",
    type: "ocr"
  },
  {
    id: "VQ004",
    bidder: "Metaflow Engineering",
    tender: "CPCL/MNT/2025/063",
    issue: "GST inactive status detected",
    confidence: 99,
    priority: "High",
    assignedTo: "Ravi Kumar",
    status: "Escalated",
    age: "2d",
    type: "govt"
  }
];
export const COMPLIANCE_SCORE_BREAKDOWN = {
  total: 86,
  categories: [
    { name: "Statutory Compliance", score: 25, max: 25, icon: "\u{1F3DB}\uFE0F" },
    { name: "Financial Compliance", score: 18, max: 25, icon: "\u{1F4B0}" },
    { name: "Experience", score: 20, max: 20, icon: "\u{1F4CA}" },
    { name: "Document Verification", score: 14, max: 15, icon: "\u{1F4C4}" },
    { name: "OEM Compliance", score: 9, max: 15, icon: "\u{1F3ED}" }
  ]
};
export const AUDIT_TRAIL = [
  { time: "10:12 AM", event: "Tender Uploaded", user: "Akshay Gupta", role: "Procurement Officer", detail: "CPCL/VALVE/2025/001 uploaded", type: "upload" },
  { time: "10:14 AM", event: "AI Requirement Extraction Completed", user: "AI System", role: "System", detail: "12 requirements extracted with 97% confidence", type: "ai" },
  { time: "10:19 AM", event: "Bidder Submitted Documents", user: "ABC Engineering", role: "Bidder", detail: "12 documents uploaded", type: "submit" },
  { time: "10:21 AM", event: "OCR Processing Completed", user: "AI System", role: "System", detail: "All 12 documents OCR processed", type: "ocr" },
  { time: "10:23 AM", event: "GST Verification Performed", user: "AI System", role: "System", detail: "GST status: Active, Name: Matched", type: "verify" },
  { time: "10:24 AM", event: "PAN-GST Mismatch Detected", user: "AI System", role: "System", detail: "Name discrepancy across PAN and GST documents", type: "alert" },
  { time: "10:27 AM", event: "Compliance Score Calculated", user: "Rules Engine", role: "System", detail: "Score: 94/100", type: "compliance" },
  { time: "10:35 AM", event: "Verification Officer Review", user: "Ravi Kumar", role: "Verification Officer", detail: "Reviewed and resolved PAN-GST discrepancy", type: "review" },
  { time: "10:42 AM", event: "Procurement Officer Decision", user: "Akshay Gupta", role: "Procurement Officer", detail: "Bidder qualified \u2014 ABC Engineering Pvt Ltd", type: "decision" }
];
export const MONTHLY_COMPLIANCE_TREND = [
  { month: "Apr", rate: 74, verifications: 180 },
  { month: "May", rate: 76, verifications: 210 },
  { month: "Jun", rate: 79, verifications: 245 },
  { month: "Jul", rate: 81, verifications: 290 },
  { month: "Aug", rate: 84, verifications: 310 },
  { month: "Sep", rate: 87, verifications: 241 }
];
export const NOTIFICATIONS = [
  { id: "n1", type: "critical", icon: "\u{1F534}", title: "PAN-GST mismatch detected for Noble Industrials", time: "2h ago", read: false },
  { id: "n2", type: "action", icon: "\u{1F7E0}", title: "5 documents require manual verification", time: "4h ago", read: false },
  { id: "n3", type: "info", icon: "\u{1F535}", title: "GST verification completed for ABC Engineering", time: "5h ago", read: true },
  { id: "n4", type: "success", icon: "\u{1F7E2}", title: "Tender compliance report generated for CPCL/MNT/2025/063", time: "1d ago", read: true },
  { id: "n5", type: "critical", icon: "\u{1F534}", title: "Debarment record found for Noble Industrials", time: "6h ago", read: false }
];
