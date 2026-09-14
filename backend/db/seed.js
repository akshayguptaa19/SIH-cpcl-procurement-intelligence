import bcrypt from "bcryptjs";
import db, { queryOne, execute, transaction } from "./database.js";

export async function seedDatabase() {
  console.log("[DB Seed] Checking existing records...");
  const userCount = queryOne("SELECT COUNT(*) as count FROM users;");
  if (userCount && userCount.count > 0) {
    console.log("[DB Seed] Database already seeded. Skipping initial seeding.");
    return;
  }

  console.log("[DB Seed] Starting fresh database seeding...");

  const officerPasswordHash = await bcrypt.hash("Officer@2026", 10);
  const adminPasswordHash = await bcrypt.hash("CPCL@admin2026", 10);
  const bidderPasswordHash = await bcrypt.hash("Bidder@2026", 10);

  transaction(() => {
    // 1. Seed Roles and Permissions
    const rolesPermissions = [
      ["r-001", "ADMIN", "MANAGE_USERS"],
      ["r-002", "ADMIN", "APPROVE_OFFICERS"],
      ["r-003", "ADMIN", "VIEW_AUDIT"],
      ["r-004", "ADMIN", "MANAGE_INTEGRATIONS"],
      ["r-005", "PROCUREMENT_OFFICER", "VIEW_TENDERS"],
      ["r-006", "PROCUREMENT_OFFICER", "CREATE_TENDER"],
      ["r-007", "PROCUREMENT_OFFICER", "PUBLISH_TENDER"],
      ["r-008", "PROCUREMENT_OFFICER", "VIEW_BIDDERS"],
      ["r-009", "PROCUREMENT_OFFICER", "VERIFY_DOCUMENT"],
      ["r-010", "PROCUREMENT_OFFICER", "APPROVE_DOCUMENT"],
      ["r-011", "PROCUREMENT_OFFICER", "REJECT_DOCUMENT"],
      ["r-012", "PROCUREMENT_OFFICER", "REQUEST_CLARIFICATION"],
      ["r-013", "PROCUREMENT_OFFICER", "VIEW_RISK"],
      ["r-014", "PROCUREMENT_OFFICER", "VIEW_AI_INSIGHTS"],
      ["r-015", "PROCUREMENT_OFFICER", "GENERATE_REPORT"],
      ["r-016", "PROCUREMENT_OFFICER", "VIEW_AUDIT"],
      ["r-017", "BIDDER", "VIEW_OWN_APPLICATIONS"],
      ["r-018", "BIDDER", "SUBMIT_APPLICATION"],
      ["r-019", "BIDDER", "UPLOAD_DOCUMENTS"],
      ["r-020", "BIDDER", "RESPOND_CLARIFICATION"],
      ["r-021", "BIDDER", "VIEW_OWN_NOTIFICATIONS"]
    ];

    for (const [id, role, perm] of rolesPermissions) {
      execute(
        "INSERT OR IGNORE INTO roles_permissions (id, role, permission) VALUES (?, ?, ?);",
        [id, role, perm]
      );
    }

    // 2. Seed Users
    // Admin
    execute(
      `INSERT INTO users (id, name, email, password_hash, role, status, employee_id, designation, department, organization, phone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        "usr-admin-01",
        "System Administrator",
        "admin@cpcl.gov.in",
        adminPasswordHash,
        "ADMIN",
        "ACTIVE",
        "CPCL-ADM-01",
        "Chief Security & IT Administrator",
        "IT & Cyber Governance",
        "Chennai Petroleum Corporation Limited",
        "+91 44 2594 4000"
      ]
    );

    // Active Procurement Officer
    execute(
      `INSERT INTO users (id, name, email, password_hash, role, status, employee_id, designation, department, organization, phone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        "usr-off-01",
        "Akshay Gupta",
        "akshay.gupta@cpcl.gov.in",
        officerPasswordHash,
        "PROCUREMENT_OFFICER",
        "ACTIVE",
        "CPCL-7821",
        "Supervisory Procurement Officer",
        "Refinery Engineering & Maintenance",
        "Chennai Petroleum Corporation Limited",
        "+91 44 2594 4112"
      ]
    );

    execute(
      `INSERT INTO officer_profiles (user_id, employee_id, designation, department, organization, approval_status, approved_by, approved_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'));`,
      [
        "usr-off-01",
        "CPCL-7821",
        "Supervisory Procurement Officer",
        "Refinery Engineering & Maintenance",
        "Chennai Petroleum Corporation Limited",
        "APPROVED",
        "usr-admin-01"
      ]
    );

    // Pending Approval Officer
    execute(
      `INSERT INTO users (id, name, email, password_hash, role, status, employee_id, designation, department, organization, phone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        "usr-off-02",
        "Priya Sharma",
        "priya.sharma@cpcl.gov.in",
        officerPasswordHash,
        "PROCUREMENT_OFFICER",
        "PENDING_APPROVAL",
        "CPCL-9104",
        "Junior Procurement Officer",
        "Technical Evaluation Committee",
        "Chennai Petroleum Corporation Limited",
        "+91 44 2594 4188"
      ]
    );

    execute(
      `INSERT INTO officer_profiles (user_id, employee_id, designation, department, organization, approval_status)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [
        "usr-off-02",
        "CPCL-9104",
        "Junior Procurement Officer",
        "Technical Evaluation Committee",
        "Chennai Petroleum Corporation Limited",
        "PENDING_APPROVAL"
      ]
    );

    // Bidder 1 User
    execute(
      `INSERT INTO users (id, name, email, password_hash, role, status, phone)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        "usr-bid-01",
        "Vikram Malhotra",
        "contact@shaktienterprises.com",
        bidderPasswordHash,
        "BIDDER",
        "ACTIVE",
        "+91 98201 44521"
      ]
    );

    // Bidder 2 User
    execute(
      `INSERT INTO users (id, name, email, password_hash, role, status, phone)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        "usr-bid-02",
        "Rajesh Ramanathan",
        "bids@precisiontools.in",
        bidderPasswordHash,
        "BIDDER",
        "ACTIVE",
        "+91 94440 18239"
      ]
    );

    // 3. Seed Companies
    execute(
      `INSERT INTO companies (id, legal_name, trade_name, gstin, pan, registration_number, msme_classification, udyam_number, turnover_fy22, turnover_fy23, turnover_fy24, average_turnover, address, city, state, country, contact_email, contact_phone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        "comp-001",
        "Shakti Enterprises Pvt Ltd",
        "Shakti Valve & Flow Systems",
        "27AABCS1429B1Z1",
        "AABCS1429B",
        "U28112MH2012PTC234190",
        "Medium (Class-II)",
        "UDYAM-MH-12-0048123",
        18.40,
        22.10,
        24.60,
        21.70,
        "Plot 42, MIDC Industrial Area, Taloja",
        "Navi Mumbai",
        "Maharashtra",
        "India",
        "contact@shaktienterprises.com",
        "+91 98201 44521"
      ]
    );

    execute(
      `INSERT INTO companies (id, legal_name, trade_name, gstin, pan, registration_number, msme_classification, udyam_number, turnover_fy22, turnover_fy23, turnover_fy24, average_turnover, address, city, state, country, contact_email, contact_phone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        "comp-002",
        "Precision Tools Ltd",
        "Precision Hydrocarbon Equipments",
        "33AABCP9921D1ZO",
        "AABCP9921D",
        "U29299TN2008PLC067182",
        "Large Enterprise",
        "UDYAM-TN-02-0019283",
        42.50,
        48.20,
        51.80,
        47.50,
        "Guindy Industrial Estate, Phase II",
        "Chennai",
        "Tamil Nadu",
        "India",
        "bids@precisiontools.in",
        "+91 94440 18239"
      ]
    );

    // 4. Seed Bidder Profiles
    execute(
      `INSERT INTO bidder_profiles (user_id, company_id, authorized_person, designation, verification_status)
       VALUES (?, ?, ?, ?, ?);`,
      [
        "usr-bid-01",
        "comp-001",
        "Vikram Malhotra",
        "Managing Director",
        "VERIFIED"
      ]
    );

    execute(
      `INSERT INTO bidder_profiles (user_id, company_id, authorized_person, designation, verification_status)
       VALUES (?, ?, ?, ?, ?);`,
      [
        "usr-bid-02",
        "comp-002",
        "Rajesh Ramanathan",
        "Director (Operations)",
        "VERIFIED"
      ]
    );

    // 5. Seed Tenders
    const tenders = [
      [
        "tnd-001",
        "CPCL/VALVE/2025/001",
        "Supply of High-Pressure Industrial Valves & Actuation Systems",
        "Procurement of API 6D and API 600 compliant ball and gate valves for Manali Refinery Unit 3 expansion. All units require explosive atmosphere certification and OEM authorization.",
        "Refinery Engineering & Maintenance",
        "Mechanical Equipment",
        "OPEN",
        185000000.0, // ₹18.5 Cr
        "2026-08-15 10:00:00",
        "2026-08-18 09:00:00",
        "2026-10-15 17:00:00",
        "2026-10-18 11:00:00",
        "usr-off-01"
      ],
      [
        "tnd-002",
        "CPCL/ESD/2025/042",
        "Emergency Shutdown Systems & SIL-3 Automation Instrumentation",
        "Comprehensive overhaul and supply of programmable electronic safety systems conforming to IEC 61508 SIL-3 for crude distillation units.",
        "Electrical & Instrumentation",
        "Control Systems",
        "UNDER_EVALUATION",
        420000000.0, // ₹42.0 Cr
        "2026-07-10 10:00:00",
        "2026-07-15 09:00:00",
        "2026-09-20 17:00:00",
        "2026-09-22 11:00:00",
        "usr-off-01"
      ],
      [
        "tnd-003",
        "CPCL/CAT/2025/019",
        "Supply of Hydroprocessing Catalysts & Adsorbent Media",
        "Procurement of specialized cobalt-molybdenum and nickel-molybdenum catalysts for sulfur reduction in ultra-low sulfur diesel (BS-VI) hydrotreater units.",
        "Process Engineering & Quality Control",
        "Chemicals & Catalysts",
        "PUBLISHED",
        280000000.0, // ₹28.0 Cr
        "2026-08-28 10:00:00",
        "2026-09-01 09:00:00",
        "2026-11-05 17:00:00",
        "2026-11-08 11:00:00",
        "usr-off-01"
      ],
      [
        "tnd-004",
        "CPCL/MNT/2025/063",
        "Annual Maintenance Contract for Hydrocarbon Storage Tanks",
        "Turnkey non-destructive testing (NDT), tank floor acoustic emission testing, and protective polyurea coating across 14 crude storage tanks.",
        "Refinery Engineering & Maintenance",
        "Services & Maintenance",
        "OPEN",
        95000000.0, // ₹9.5 Cr
        "2026-08-20 10:00:00",
        "2026-08-25 09:00:00",
        "2026-10-30 17:00:00",
        "2026-11-02 11:00:00",
        "usr-off-01"
      ],
      [
        "tnd-005",
        "CPCL/PUMP/2025/112",
        "Centrifugal Cryogenic Slurry Pumps & Mechanical Seals",
        "Supply of API 610 compliant heavy-duty process pumps for fluidized catalytic cracking unit (FCCU) bottom slurry handling.",
        "Refinery Engineering & Maintenance",
        "Rotating Equipment",
        "DRAFT",
        140000000.0, // ₹14.0 Cr
        null,
        null,
        "2026-11-20 17:00:00",
        null,
        "usr-off-01"
      ]
    ];

    for (const t of tenders) {
      execute(
        `INSERT INTO tenders (id, tender_number, title, description, department, category, status, budget_amount, publication_date, submission_start, submission_deadline, technical_opening_date, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        t
      );
    }

    // 6. Seed Tender Requirements for tnd-001
    const tnd1Reqs = [
      ["req-001", "tnd-001", "Minimum Annual Turnover", "Average turnover of last 3 financial years must be at least ₹10.00 Crore.", "FINANCIAL", "100000000", "turnover_avg >= 100000000", 1, "CRITICAL"],
      ["req-002", "tnd-001", "Valid GST Registration", "Active regular GSTIN in jurisdiction with regular filing record.", "STATUTORY", "Active Regular", "gst_status === 'Active' && return_filing_defaulter === false", 1, "CRITICAL"],
      ["req-003", "tnd-001", "Permanent Account Number (PAN)", "Valid corporate PAN matching legal certificate of incorporation.", "STATUTORY", "Valid Match", "pan_verified === true && string_match >= 0.95", 1, "CRITICAL"],
      ["req-004", "tnd-001", "OEM Authorization Certificate", "Direct manufacturer authorization naming CPCL tender reference.", "TECHNICAL", "Direct OEM Letter", "document_present === true && expiry_date >= tender_end + 90", 1, "HIGH"],
      ["req-005", "tnd-001", "Make in India Sovereign Preference", "Class-I (≥50%) or Class-II (≥20%) domestic local content.", "POLICY", "Class-II (≥20%)", "local_content_percentage >= 20.0", 0, "MEDIUM"]
    ];

    for (const r of tnd1Reqs) {
      execute(
        `INSERT INTO tender_requirements (id, tender_id, name, description, requirement_type, required_value, validation_rule, is_mandatory, priority)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        r
      );
    }

    // 7. Seed Tender Document Requirements Checklist for tnd-001
    const tnd1DocReqs = [
      ["dreq-001", "tnd-001", "GST Registration Certificate (Form GST REG-06)", 1, "Active GST registration certificate with principal place of business."],
      ["dreq-002", "tnd-001", "Permanent Account Number (PAN) Card", 1, "Copy of entity PAN card."],
      ["dreq-003", "tnd-001", "Audited Financial Statements (FY22, FY23, FY24)", 1, "Chartered accountant signed balance sheets with valid UDIN."],
      ["dreq-004", "tnd-001", "OEM Manufacturer Authorization Certificate", 1, "Signed by original equipment manufacturer on letterhead."],
      ["dreq-005", "tnd-001", "Make in India Local Content Declaration", 0, "Self-certification or Chartered Engineer certificate."]
    ];

    for (const dr of tnd1DocReqs) {
      execute(
        `INSERT INTO tender_document_requirements (id, tender_id, document_type, is_mandatory, description)
         VALUES (?, ?, ?, ?, ?);`,
        dr
      );
    }

    // 8. Seed Bid Applications
    // Shakti Enterprises applied to tnd-001
    execute(
      `INSERT INTO bid_applications (id, tender_id, bidder_id, company_id, status, total_quote_value, technical_compliance_score, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        "app-001",
        "tnd-001",
        "usr-bid-01",
        "comp-001",
        "AI_VERIFICATION",
        178500000.0, // ₹17.85 Cr
        94.0,
        "2026-09-08 14:22:10"
      ]
    );

    // Precision Tools applied to tnd-001
    execute(
      `INSERT INTO bid_applications (id, tender_id, bidder_id, company_id, status, total_quote_value, technical_compliance_score, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        "app-002",
        "tnd-001",
        "usr-bid-02",
        "comp-002",
        "DOCUMENT_REVIEW",
        181000000.0, // ₹18.10 Cr
        98.0,
        "2026-09-09 11:15:30"
      ]
    );

    // 9. Seed Documents for app-001 (Shakti Enterprises)
    const docsApp1 = [
      [
        "doc-001",
        "app-001",
        "usr-bid-01",
        "GST Registration Certificate",
        "GST_REG06_Shakti_Enterprises.pdf",
        "/uploads/GST_REG06_Shakti_Enterprises.pdf",
        1248000,
        "application/pdf",
        1,
        "VERIFIED"
      ],
      [
        "doc-002",
        "app-001",
        "usr-bid-01",
        "PAN Certificate",
        "PAN_AABCS1429B_Shakti.pdf",
        "/uploads/PAN_AABCS1429B_Shakti.pdf",
        512000,
        "application/pdf",
        1,
        "VERIFIED"
      ],
      [
        "doc-003",
        "app-001",
        "usr-bid-01",
        "Audited Financial Statements",
        "Audited_Turnover_FY22-24_CA_Signed.pdf",
        "/uploads/Audited_Turnover_FY22-24_CA_Signed.pdf",
        3450000,
        "application/pdf",
        1,
        "VERIFIED"
      ],
      [
        "doc-004",
        "app-001",
        "usr-bid-01",
        "OEM Authorization Certificate",
        "OEM_Authorization_Valves_2026.pdf",
        "/uploads/OEM_Authorization_Valves_2026.pdf",
        890000,
        "application/pdf",
        1,
        "FLAGGED"
      ]
    ];

    for (const d of docsApp1) {
      execute(
        `INSERT INTO documents (id, application_id, bidder_id, document_type, file_name, file_url, file_size, mime_type, current_version, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        d
      );

      // Version 1
      execute(
        `INSERT INTO document_versions (id, document_id, version_number, file_name, file_url, file_size, uploaded_by)
         VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [`ver-${d[0]}-1`, d[0], 1, d[4], d[5], d[6], d[2]]
      );
    }

    // 10. Seed OCR Extraction for doc-001 (GST Certificate)
    const gstOcrData = {
      registrationNumber: "27AABCS1429B1Z1",
      legalName: "Shakti Enterprises Private Limited",
      tradeName: "Shakti Valve & Flow Systems",
      constitutionOfBusiness: "Private Limited Company",
      principalPlaceOfBusiness: "Plot 42, MIDC Industrial Area, Taloja, Navi Mumbai, Maharashtra - 410208",
      dateOfLiability: "01/07/2017",
      dateOfValidityFrom: "01/07/2017",
      typeOfRegistration: "Regular Taxpayer",
      jurisdictionState: "Maharashtra",
      jurisdictionCenter: "Range-IV, Division-II, Raigad Commissionerate",
      approvingAuthority: "Assistant Commissioner, Central Goods and Services Tax",
      dateOfIssueCertificate: "14/07/2017"
    };

    execute(
      `INSERT INTO ocr_extractions (id, document_id, extracted_data_json, confidence, status)
       VALUES (?, ?, ?, ?, ?);`,
      [
        "ocr-001",
        "doc-001",
        JSON.stringify(gstOcrData),
        0.985,
        "COMPLETED"
      ]
    );

    // 11. Seed Verification Cases
    // Case 1: Shakti Enterprises
    execute(
      `INSERT INTO verification_cases (id, application_id, tender_id, bidder_id, company_id, overall_status, ai_confidence_score, compliance_score, risk_score, risk_level, assigned_officer_id, officer_remarks)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        "case-001",
        "app-001",
        "tnd-001",
        "usr-bid-01",
        "comp-001",
        "IN_REVIEW",
        96.5,
        91.0,
        14.2,
        "LOW",
        "usr-off-01",
        "Statutory filings verified against GSTN portal. Clarification issued regarding third-party sub-dealer authorization."
      ]
    );

    // Case 2: Precision Tools
    execute(
      `INSERT INTO verification_cases (id, application_id, tender_id, bidder_id, company_id, overall_status, ai_confidence_score, compliance_score, risk_score, risk_level, assigned_officer_id, officer_remarks)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        "case-002",
        "app-002",
        "tnd-001",
        "usr-bid-02",
        "comp-002",
        "PENDING_REVIEW",
        99.2,
        98.0,
        6.5,
        "LOW",
        "usr-off-01",
        "Large entity with audited balance sheets verified via MCA21 API. All OEM direct letters attached."
      ]
    );

    // 12. Seed Verification Findings
    execute(
      `INSERT INTO verification_findings (id, case_id, document_id, finding, severity, confidence, evidence, recommendation)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        "find-001",
        "case-001",
        "doc-004",
        "OEM authorization is co-signed by regional authorized dealer rather than original manufacturer corporate signatory.",
        "MEDIUM",
        94.0,
        "Section 3.1 signature mismatch with global OEM directory register.",
        "Procurement officer to issue clarification query requesting direct manufacturer endorsement."
      ]
    );

    execute(
      `INSERT INTO verification_findings (id, case_id, document_id, finding, severity, confidence, evidence, recommendation)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        "find-002",
        "case-001",
        "doc-001",
        "GSTIN matches MCA corporate DIN register with 100% exact match across PAN and registered address.",
        "INFO",
        100.0,
        "GSTN Gateway Response Code 200 (Active, Return Filed).",
        "Statutory eligibility verified."
      ]
    );

    // 13. Seed Compliance Checks for case-001
    const complianceChecks = [
      ["chk-001", "app-001", "case-001", "Minimum Annual Turnover", "FINANCIAL", "≥ ₹10.00 Cr (3-Yr Avg)", "₹21.70 Cr (3-Yr Avg)", "turnover_avg >= 10.0", "PASS", 100.0, "Audited Balance Sheets with UDIN 24089123AAAA", "MCA21 & ITD Gateway", "CONFIRMED"],
      ["chk-002", "app-001", "case-001", "GST Registration Status", "STATUTORY", "Active Regular Taxpayer", "Active (27AABCS1429B1Z1)", "gst_status === 'Active'", "PASS", 100.0, "GSTN Sovereign Portal Response", "GSTN Sovereign Portal", "CONFIRMED"],
      ["chk-003", "app-001", "case-001", "Permanent Account Number (PAN)", "STATUTORY", "Corporate PAN AABCS1429B", "AABCS1429B (100% Legal Match)", "pan_verified === true", "PASS", 100.0, "Income Tax Department NSDL API", "NSDL PAN Gateway", "CONFIRMED"],
      ["chk-004", "app-001", "case-001", "OEM Manufacturer Authorization", "TECHNICAL", "Direct OEM Letter for CPCL Tender", "Distributor Endorsement Attached", "direct_oem_signed === true", "WARNING", 88.0, "Tender Document Index Scan", "Technical Proposal Pack", "PENDING"],
      ["chk-005", "app-001", "case-001", "Make in India Local Content", "POLICY", "Class-II (≥20% Local Content)", "Class-II Certified (38% Local Content)", "local_content_percentage >= 20.0", "PASS", 96.0, "Chartered Engineer Local Content Certificate", "DPIIT Guidelines Portal", "CONFIRMED"]
    ];

    for (const c of complianceChecks) {
      execute(
        `INSERT INTO compliance_checks (id, application_id, case_id, requirement_name, category, expected_value, detected_value, rule_formula, result, confidence, evidence, source, review_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        c
      );
    }

    // 14. Seed Risk Assessment for case-001
    execute(
      `INSERT INTO risk_assessments (id, application_id, case_id, risk_category, risk_score, risk_level, risk_factors_json, evidence)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        "risk-001",
        "app-001",
        "case-001",
        "DOCUMENT",
        18.5,
        "LOW",
        JSON.stringify([
          "Distributor authorization letter requires direct manufacturer verification",
          "GST filing regular across last 12 consecutive months",
          "Zero CERSAI debarment records found"
        ]),
        "Sovereign API multi-gateway scan completed with 1 minor technical caveat."
      ]
    );

    // 15. Seed Clarifications
    execute(
      `INSERT INTO clarifications (id, case_id, application_id, tender_id, bidder_id, question, from_user, status, response, response_date, attachment_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        "clr-001",
        "case-001",
        "app-001",
        "tnd-001",
        "usr-bid-01",
        "Please confirm OEM authorization is from original equipment manufacturer, not an unauthorized third-party sub-dealer.",
        "Akshay Gupta (Procurement Officer)",
        "AWAITING_RESPONSE",
        null,
        null,
        null
      ]
    );

    execute(
      `INSERT INTO clarifications (id, case_id, application_id, tender_id, bidder_id, question, from_user, status, response, response_date, attachment_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        "clr-002",
        "case-002",
        "app-002",
        "tnd-001",
        "usr-bid-02",
        "ITR FY 2024-25 computation statement page 2 is missing CA seal. Please upload verified copy.",
        "Akshay Gupta (Procurement Officer)",
        "RESOLVED",
        "CA signed and sealed copy uploaded. Verification reference: UDIN-24089123AAAA.",
        "2026-09-09 16:45:00",
        "CA_Attested_ITR_FY24-25.pdf"
      ]
    );

    // 16. Seed Notifications
    const notifications = [
      ["notif-001", "usr-off-01", "PROCUREMENT_OFFICER", "VERIFICATION", "New Bid Submission for Evaluation", "Shakti Enterprises Pvt Ltd submitted proposal pack for CPCL/VALVE/2025/001.", "TENDER", "tnd-001", 0],
      ["notif-002", "usr-off-01", "PROCUREMENT_OFFICER", "RISK_ALERT", "Technical Clarification Issued", "Clarification query CLR-001 dispatched to Shakti Enterprises.", "CLARIFICATION", "clr-001", 0],
      ["notif-003", "usr-off-01", "PROCUREMENT_OFFICER", "DEADLINE", "Pre-Bid Meeting Milestone", "Pre-bid queries window closing in 48 hours for CPCL/ESD/2025/042.", "TENDER", "tnd-002", 1],
      ["notif-004", "usr-bid-01", "BIDDER", "CLARIFICATION", "Action Required: Clarification Requested", "CPCL Officer requested OEM manufacturer authorization confirmation.", "CLARIFICATION", "clr-001", 0]
    ];

    for (const n of notifications) {
      execute(
        `INSERT INTO notifications (id, user_id, role, type, title, message, related_entity, related_id, is_read)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        n
      );
    }

    // 17. Seed Sovereign Integrations
    const integrations = [
      ["int-001", "GSTN Sovereign Portal", "GSTN", "OPERATIONAL", "https://api.gstn.gov.in/v2/taxpayer", 118, 99.98],
      ["int-002", "MCA21 Corporate Registry", "MCA21", "OPERATIONAL", "https://api.mca.gov.in/v3/company", 142, 99.95],
      ["int-003", "Udyam MSME Gateway", "UDYAM", "OPERATIONAL", "https://api.udyam.gov.in/v1/verify", 95, 99.99],
      ["int-004", "Income Tax NSDL PAN Gateway", "INCOME_TAX_PAN", "OPERATIONAL", "https://api.incometax.gov.in/pan/v2", 84, 99.99],
      ["int-005", "CERSAI Central Debarment Radar", "CERSAI", "OPERATIONAL", "https://api.cersai.org.in/v1/blacklist", 165, 99.92],
      ["int-006", "Government e-Marketplace (GeM)", "GEM_PORTAL", "OPERATIONAL", "https://api.gem.gov.in/v3/procurement", 130, 99.96]
    ];

    for (const i of integrations) {
      execute(
        `INSERT INTO system_integrations (id, name, gateway_type, status, endpoint, response_time_ms, uptime_percentage)
         VALUES (?, ?, ?, ?, ?, ?, ?);`,
        i
      );
    }

    // 18. Seed Audit Logs
    const auditLogs = [
      [
        "aud-001",
        "2026-09-08 14:22:15",
        "usr-bid-01",
        "Vikram Malhotra",
        "Bidder Representative",
        "SUBMIT_APPLICATION",
        "BID_APPLICATION",
        "app-001",
        "DRAFT",
        "SUBMITTED",
        "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
        "10.42.18.91 (CPCL-SECURE-NET)",
        "Sovereign Vendor Portal",
        "Bidder submitted complete technical & commercial proposal for CPCL/VALVE/2025/001."
      ],
      [
        "aud-002",
        "2026-09-08 14:22:30",
        null,
        "System Automated Pipeline",
        "SYSTEM",
        "OCR_EXTRACTION_COMPLETED",
        "DOCUMENT",
        "doc-001",
        "UPLOADED",
        "OCR_PROCESSED",
        "0x15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225",
        "127.0.0.1",
        "AI OCR Engine Worker",
        "Form GST REG-06 optical entity extraction completed with 98.5% confidence rating."
      ],
      [
        "aud-003",
        "2026-09-09 10:14:00",
        "usr-off-01",
        "Akshay Gupta",
        "Procurement Officer",
        "REQUEST_CLARIFICATION",
        "VERIFICATION_CASE",
        "case-001",
        "IN_REVIEW",
        "CLARIFICATION_REQUIRED",
        "0xa8f2b3e4c5d61789b0f1ef234567890123456789abcdef0123456789abcdef01",
        "10.42.18.91 (CPCL-SECURE-NET)",
        "Internal Officer Console",
        "Issued formal query CLR-001 to Shakti Enterprises requesting direct OEM manufacturer endorsement."
      ]
    ];

    for (const a of auditLogs) {
      execute(
        `INSERT INTO audit_logs (id, timestamp, user_id, user_name, user_role, action, entity_type, entity_id, previous_state, new_state, hash, ip_address, source, details)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        a
      );
    }
  });

  console.log("[DB Seed] Successfully seeded all 23 relational database entities!");
}

// Allow running directly via `node server/db/seed.js`
if (process.argv[1]?.includes("seed.js")) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("[DB Seed Fatal Error]:", err);
      process.exit(1);
    });
}
