-- CPCL AI Procurement & Sovereign Bid Compliance Platform
-- Relational Database Schema (SQLite / node:sqlite)

PRAGMA foreign_keys = ON;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL, -- 'ADMIN', 'PROCUREMENT_OFFICER', 'SENIOR_OFFICER', 'COMPLIANCE_REVIEWER', 'BIDDER'
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'PENDING_APPROVAL', 'ACTIVE', 'SUSPENDED', 'REJECTED'
    employee_id TEXT,
    designation TEXT,
    department TEXT,
    organization TEXT DEFAULT 'Chennai Petroleum Corporation Limited',
    phone TEXT,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Roles & Granular Permissions Table
CREATE TABLE IF NOT EXISTS roles_permissions (
    id TEXT PRIMARY KEY,
    role TEXT NOT NULL,
    permission TEXT NOT NULL,
    UNIQUE(role, permission)
);

-- 3. Companies Table (Bidder Corporate Entities)
CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY,
    legal_name TEXT NOT NULL,
    trade_name TEXT,
    gstin TEXT UNIQUE NOT NULL,
    pan TEXT NOT NULL,
    registration_number TEXT,
    msme_classification TEXT, -- 'Micro', 'Small', 'Medium (Class-II)', 'Large'
    udyam_number TEXT,
    turnover_fy22 REAL DEFAULT 0,
    turnover_fy23 REAL DEFAULT 0,
    turnover_fy24 REAL DEFAULT 0,
    average_turnover REAL DEFAULT 0,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'India',
    contact_email TEXT,
    contact_phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Officer Profiles Table
CREATE TABLE IF NOT EXISTS officer_profiles (
    user_id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    designation TEXT NOT NULL,
    department TEXT NOT NULL,
    organization TEXT NOT NULL,
    approval_status TEXT NOT NULL DEFAULT 'PENDING_APPROVAL', -- 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'
    approved_by TEXT,
    approved_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Bidder Profiles Table
CREATE TABLE IF NOT EXISTS bidder_profiles (
    user_id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL,
    authorized_person TEXT NOT NULL,
    designation TEXT,
    verification_status TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION', -- 'PENDING_VERIFICATION', 'VERIFIED', 'FLAGGED', 'SUSPENDED'
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 6. Tenders Table
CREATE TABLE IF NOT EXISTS tenders (
    id TEXT PRIMARY KEY,
    tender_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    department TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'PUBLISHED', 'OPEN', 'UNDER_EVALUATION', 'AWARDED', 'CLOSED', 'CANCELLED'
    budget_amount REAL,
    budget_currency TEXT DEFAULT 'INR',
    publication_date DATETIME,
    submission_start DATETIME,
    submission_deadline DATETIME NOT NULL,
    technical_opening_date DATETIME,
    created_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 7. Tender Eligibility & Criteria Requirements Table
CREATE TABLE IF NOT EXISTS tender_requirements (
    id TEXT PRIMARY KEY,
    tender_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    requirement_type TEXT NOT NULL, -- 'FINANCIAL', 'STATUTORY', 'TECHNICAL', 'POLICY'
    required_value TEXT NOT NULL,
    validation_rule TEXT NOT NULL,
    is_mandatory INTEGER DEFAULT 1,
    priority TEXT DEFAULT 'HIGH', -- 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
    FOREIGN KEY (tender_id) REFERENCES tenders(id) ON DELETE CASCADE
);

-- 8. Tender Document Requirements Checklist Table
CREATE TABLE IF NOT EXISTS tender_document_requirements (
    id TEXT PRIMARY KEY,
    tender_id TEXT NOT NULL,
    document_type TEXT NOT NULL,
    is_mandatory INTEGER DEFAULT 1,
    description TEXT,
    FOREIGN KEY (tender_id) REFERENCES tenders(id) ON DELETE CASCADE
);

-- 9. Bid Applications Table
CREATE TABLE IF NOT EXISTS bid_applications (
    id TEXT PRIMARY KEY,
    tender_id TEXT NOT NULL,
    bidder_id TEXT NOT NULL, -- references users(id)
    company_id TEXT NOT NULL, -- references companies(id)
    status TEXT NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'SUBMITTED', 'DOCUMENT_REVIEW', 'AI_VERIFICATION', 'MANUAL_REVIEW', 'CLARIFICATION_REQUIRED', 'COMPLIANT', 'NON_COMPLIANT', 'REJECTED', 'WITHDRAWN'
    total_quote_value REAL DEFAULT 0,
    technical_compliance_score REAL DEFAULT 0,
    submitted_at DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tender_id) REFERENCES tenders(id) ON DELETE CASCADE,
    FOREIGN KEY (bidder_id) REFERENCES users(id),
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- 10. Documents Table
CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    application_id TEXT NOT NULL,
    bidder_id TEXT NOT NULL,
    document_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    current_version INTEGER DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'UPLOADED', -- 'UPLOADED', 'VALIDATING', 'OCR_PROCESSED', 'VERIFIED', 'FLAGGED', 'REJECTED'
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES bid_applications(id) ON DELETE CASCADE,
    FOREIGN KEY (bidder_id) REFERENCES users(id)
);

-- 11. Document Version History Table
CREATE TABLE IF NOT EXISTS document_versions (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    version_number INTEGER NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    uploaded_by TEXT NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- 12. OCR Extractions Table
CREATE TABLE IF NOT EXISTS ocr_extractions (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    extracted_data_json TEXT NOT NULL, -- JSON object of extracted key-value pairs
    confidence REAL DEFAULT 0.95,
    status TEXT NOT NULL DEFAULT 'COMPLETED', -- 'PENDING', 'COMPLETED', 'FAILED'
    processed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

-- 13. Verification Cases Table
CREATE TABLE IF NOT EXISTS verification_cases (
    id TEXT PRIMARY KEY,
    application_id TEXT UNIQUE NOT NULL,
    tender_id TEXT NOT NULL,
    bidder_id TEXT NOT NULL,
    company_id TEXT NOT NULL,
    overall_status TEXT NOT NULL DEFAULT 'PENDING_REVIEW', -- 'PENDING_REVIEW', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'CLARIFICATION_REQUIRED', 'ESCALATED'
    ai_confidence_score REAL DEFAULT 95.0,
    compliance_score REAL DEFAULT 85.0,
    risk_score REAL DEFAULT 15.0,
    risk_level TEXT DEFAULT 'LOW', -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    assigned_officer_id TEXT,
    rejection_reason TEXT,
    officer_remarks TEXT,
    reviewed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES bid_applications(id) ON DELETE CASCADE,
    FOREIGN KEY (tender_id) REFERENCES tenders(id),
    FOREIGN KEY (bidder_id) REFERENCES users(id),
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (assigned_officer_id) REFERENCES users(id)
);

-- 14. Verification Findings Table (AI Structured Insights)
CREATE TABLE IF NOT EXISTS verification_findings (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL,
    document_id TEXT,
    finding TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'INFO', -- 'INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    confidence REAL DEFAULT 95.0,
    evidence TEXT,
    recommendation TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES verification_cases(id) ON DELETE CASCADE,
    FOREIGN KEY (document_id) REFERENCES documents(id)
);

-- 15. Compliance Checks Table (Deterministic Rules Engine Results)
CREATE TABLE IF NOT EXISTS compliance_checks (
    id TEXT PRIMARY KEY,
    application_id TEXT NOT NULL,
    case_id TEXT NOT NULL,
    requirement_name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'FINANCIAL', 'STATUTORY', 'TECHNICAL', 'POLICY'
    expected_value TEXT NOT NULL,
    detected_value TEXT NOT NULL,
    rule_formula TEXT NOT NULL,
    result TEXT NOT NULL, -- 'PASS', 'FAIL', 'WARNING', 'PENDING'
    confidence REAL DEFAULT 100.0,
    evidence TEXT,
    source TEXT, -- 'GSTN Sovereign Portal', 'MCA21 Registry', 'NSDL PAN Gateway', 'CERSAI Database'
    review_status TEXT DEFAULT 'CONFIRMED',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES bid_applications(id) ON DELETE CASCADE,
    FOREIGN KEY (case_id) REFERENCES verification_cases(id) ON DELETE CASCADE
);

-- 16. Risk Assessments Table
CREATE TABLE IF NOT EXISTS risk_assessments (
    id TEXT PRIMARY KEY,
    application_id TEXT NOT NULL,
    case_id TEXT NOT NULL,
    risk_category TEXT NOT NULL, -- 'FINANCIAL', 'DOCUMENT', 'COMPLIANCE', 'IDENTITY', 'HISTORICAL', 'OPERATIONAL'
    risk_score REAL NOT NULL,
    risk_level TEXT NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    risk_factors_json TEXT, -- array of detected risk factors
    evidence TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES bid_applications(id) ON DELETE CASCADE,
    FOREIGN KEY (case_id) REFERENCES verification_cases(id) ON DELETE CASCADE
);

-- 17. AI Insights Table
CREATE TABLE IF NOT EXISTS ai_insights (
    id TEXT PRIMARY KEY,
    entity_type TEXT NOT NULL, -- 'TENDER', 'BIDDER', 'APPLICATION'
    entity_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'INFO', -- 'INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    confidence REAL DEFAULT 92.0,
    evidence TEXT,
    recommendation TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'DISMISSED', 'ESCALATED'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 18. Clarifications Table (Formal Officer-Bidder Query Loop)
CREATE TABLE IF NOT EXISTS clarifications (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL,
    application_id TEXT NOT NULL,
    tender_id TEXT NOT NULL,
    bidder_id TEXT NOT NULL,
    question TEXT NOT NULL,
    from_user TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'AWAITING_RESPONSE', -- 'AWAITING_RESPONSE', 'RESPONDED', 'RESOLVED'
    response TEXT,
    response_date DATETIME,
    attachment_url TEXT,
    attachment_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES verification_cases(id) ON DELETE CASCADE,
    FOREIGN KEY (application_id) REFERENCES bid_applications(id) ON DELETE CASCADE,
    FOREIGN KEY (tender_id) REFERENCES tenders(id),
    FOREIGN KEY (bidder_id) REFERENCES users(id)
);

-- 19. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL,
    type TEXT NOT NULL, -- 'DEADLINE', 'VERIFICATION', 'CLARIFICATION', 'RISK_ALERT', 'SYSTEM'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    related_entity TEXT,
    related_id TEXT,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 20. Cryptographic Audit Logs Table (SHA-256 Chain Sealed)
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id TEXT,
    user_name TEXT NOT NULL,
    user_role TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    previous_state TEXT DEFAULT '—',
    new_state TEXT DEFAULT '—',
    hash TEXT NOT NULL,
    ip_address TEXT DEFAULT '10.42.18.91 (CPCL-SECURE-NET)',
    source TEXT NOT NULL,
    details TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 21. Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    report_type TEXT NOT NULL, -- 'COMPLIANCE', 'TENDER', 'BIDDER', 'VERIFICATION', 'RISK', 'AUDIT'
    generated_by TEXT NOT NULL,
    format TEXT NOT NULL DEFAULT 'PDF',
    filters_json TEXT,
    file_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (generated_by) REFERENCES users(id)
);

-- 22. Sovereign System Integrations Table
CREATE TABLE IF NOT EXISTS system_integrations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    gateway_type TEXT NOT NULL, -- 'GSTN', 'MCA21', 'UDYAM', 'INCOME_TAX_PAN', 'CERSAI', 'GEM_PORTAL'
    status TEXT NOT NULL DEFAULT 'OPERATIONAL', -- 'OPERATIONAL', 'DEGRADED', 'UNAVAILABLE'
    endpoint TEXT NOT NULL,
    response_time_ms INTEGER DEFAULT 120,
    uptime_percentage REAL DEFAULT 99.98,
    last_sync_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 23. System Events Table (Operational Health Monitor)
CREATE TABLE IF NOT EXISTS system_events (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    source TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'SUCCESS',
    payload_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Essential Indexes for High-Speed Queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_tenders_status ON tenders(status);
CREATE INDEX IF NOT EXISTS idx_bid_applications_tender ON bid_applications(tender_id);
CREATE INDEX IF NOT EXISTS idx_bid_applications_bidder ON bid_applications(bidder_id);
CREATE INDEX IF NOT EXISTS idx_documents_app ON documents(application_id);
CREATE INDEX IF NOT EXISTS idx_verification_cases_app ON verification_cases(application_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
