import bcrypt from 'bcryptjs';
import { User, Company, Tender, BidApplication, VerificationCase, SystemIntegration, AiInsight } from '../models/index.js';

export async function seedDatabase() {
  console.log('[MongoDB Seed] Checking existing records...');
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    console.log('[MongoDB Seed] Database already seeded. Skipping.');
    return;
  }

  console.log('[MongoDB Seed] Starting fresh MongoDB seeding...');

  const officerPasswordHash = await bcrypt.hash('Officer@2026', 10);
  const adminPasswordHash = await bcrypt.hash('CPCL@admin2026', 10);
  const bidderPasswordHash = await bcrypt.hash('Bidder@2026', 10);

  // ─── 1. USERS ────────────────────────────────────────────────────────────────
  await User.insertMany([
    {
      id: 'usr-admin-01',
      name: 'System Administrator',
      full_name: 'System Administrator',
      email: 'admin@cpcl.gov.in',
      password_hash: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      employee_id: 'CPCL-ADM-01',
      designation: 'Chief Security & IT Administrator',
      department: 'IT & Cyber Governance',
      organization: 'Chennai Petroleum Corporation Limited',
      phone: '+91 44 2594 4000',
      is_active: 1,
      officer_profile: {
        employee_id: 'CPCL-ADM-01',
        designation: 'Chief Security & IT Administrator',
        department: 'IT & Cyber Governance',
        organization: 'Chennai Petroleum Corporation Limited',
        approval_status: 'APPROVED'
      }
    },
    {
      id: 'usr-off-01',
      name: 'Akshay Gupta',
      full_name: 'Akshay Gupta',
      email: 'akshay.gupta@cpcl.gov.in',
      password_hash: officerPasswordHash,
      role: 'PROCUREMENT_OFFICER',
      status: 'ACTIVE',
      employee_id: 'CPCL-7821',
      designation: 'Supervisory Procurement Officer',
      department: 'Refinery Engineering & Maintenance',
      organization: 'Chennai Petroleum Corporation Limited',
      phone: '+91 44 2594 4112',
      is_active: 1,
      officer_profile: {
        employee_id: 'CPCL-7821',
        designation: 'Supervisory Procurement Officer',
        department: 'Refinery Engineering & Maintenance',
        organization: 'Chennai Petroleum Corporation Limited',
        approval_status: 'APPROVED',
        approved_by: 'usr-admin-01',
        approved_at: new Date()
      }
    },
    {
      id: 'usr-off-02',
      name: 'Priya Sharma',
      full_name: 'Priya Sharma',
      email: 'priya.sharma@cpcl.gov.in',
      password_hash: officerPasswordHash,
      role: 'PROCUREMENT_OFFICER',
      status: 'PENDING_APPROVAL',
      employee_id: 'CPCL-9104',
      designation: 'Junior Procurement Officer',
      department: 'Technical Evaluation Committee',
      organization: 'Chennai Petroleum Corporation Limited',
      phone: '+91 44 2594 4188',
      is_active: 0,
      officer_profile: {
        employee_id: 'CPCL-9104',
        designation: 'Junior Procurement Officer',
        department: 'Technical Evaluation Committee',
        organization: 'Chennai Petroleum Corporation Limited',
        approval_status: 'PENDING_APPROVAL'
      }
    },
    {
      id: 'usr-bid-01',
      name: 'Rajesh Kumar',
      full_name: 'Rajesh Kumar',
      email: 'rajesh@shaktieng.co.in',
      password_hash: bidderPasswordHash,
      role: 'BIDDER',
      status: 'ACTIVE',
      phone: '+91 98765 43210',
      is_active: 1,
      bidder_profile: {
        company_id: 'comp-001',
        authorized_person: 'Rajesh Kumar',
        verification_status: 'VERIFIED',
        blacklisted: false
      }
    }
  ]);

  // ─── 2. COMPANIES ─────────────────────────────────────────────────────────────
  await Company.insertMany([
    {
      id: 'comp-001',
      legal_name: 'Shakti Engineering Works',
      name: 'Shakti Engineering Works',
      trade_name: 'Shakti Enterprises',
      gstin: '33AABCS1429B1Z6',
      pan: 'AABCS1429B',
      registration_number: 'U29199TN2010PTC076584',
      msme_classification: 'Medium (Class-II)',
      is_msme: 1,
      udyam_number: 'UDYAM-TN-05-0067412',
      address: 'Industrial Estate, Ambattur',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      contact_email: 'rajesh@shaktieng.co.in',
      contact_phone: '+91 44 2836 0000'
    }
  ]);

  // ─── 3. TENDERS ──────────────────────────────────────────────────────────────
  const tender1Id = 'TND-CPCL-2026-001';
  const tender2Id = 'TND-CPCL-2026-002';

  await Tender.insertMany([
    {
      id: tender1Id,
      tender_number: 'CPCL/PROC/2026/HEU-0041',
      reference_number: 'CPCL/PROC/2026/HEU-0041',
      title: 'Supply of High-Efficiency Heat Exchangers (TEMA-Class-R) for Crude Distillation Unit',
      description: 'Procurement of shell-and-tube heat exchangers conforming to TEMA-R standards for installation in the CDU-2 refinery section. MSME vendors preferred. Bidder shall submit GSTIN, PAN, Udyam, ISO 9001 certificate, and 5-year track record.',
      department: 'Refinery Engineering & Maintenance',
      category: 'EQUIPMENT',
      status: 'ACTIVE',
      budget_amount: 75000000,
      estimated_value: 75000000,
      emd_amount: 750000,
      publication_date: new Date('2026-08-01'),
      submission_start: new Date('2026-08-01'),
      submission_deadline: new Date('2026-10-15T17:00:00'),
      opening_date: new Date('2026-10-16T10:00:00'),
      created_by: 'usr-off-01',
      requirements: [
        { id: 'TREQ-001-1', name: 'Minimum Annual Turnover', requirement_name: 'Minimum Annual Turnover', requirement_key: 'MIN_ANNUAL_TURNOVER', rule_category: 'FINANCIAL', requirement_type: 'FINANCIAL', operator: 'GREATER_THAN_EQUAL', expected_value: '50000000', required_value: '50000000', unit: 'INR', is_mandatory: 1 },
        { id: 'TREQ-001-2', name: 'Minimum Years Experience', requirement_name: 'Minimum Years Experience', requirement_key: 'MIN_YEARS_EXPERIENCE', rule_category: 'TECHNICAL', requirement_type: 'TECHNICAL', operator: 'GREATER_THAN_EQUAL', expected_value: '5', required_value: '5', unit: 'YEARS', is_mandatory: 1 },
        { id: 'TREQ-001-3', name: 'GSTIN Sovereign Active Status', requirement_name: 'GSTIN Sovereign Active Status', requirement_key: 'GST_ACTIVE_STATUS', rule_category: 'STATUTORY', requirement_type: 'STATUTORY', operator: 'EQUALS', expected_value: 'ACTIVE', required_value: 'ACTIVE', unit: 'STATUS', is_mandatory: 1 },
        { id: 'TREQ-001-4', name: 'PAN Sovereign Linkage', requirement_name: 'PAN Sovereign Linkage', requirement_key: 'PAN_LINKAGE_VERIFIED', rule_category: 'STATUTORY', requirement_type: 'STATUTORY', operator: 'EQUALS', expected_value: 'VALID', required_value: 'VALID', unit: 'STATUS', is_mandatory: 1 },
        { id: 'TREQ-001-5', name: 'ISO 9001 Quality Certification', requirement_name: 'ISO 9001 Quality Certification', requirement_key: 'ISO_9001_CERTIFIED', rule_category: 'POLICY', requirement_type: 'POLICY', operator: 'EQUALS', expected_value: 'VALID', required_value: 'VALID', unit: 'CERTIFICATE', is_mandatory: 0 }
      ],
      document_requirements: [
        { id: 'TDREQ-001-1', document_type: 'GST_CERTIFICATE', document_name: 'GST Registration Certificate (Form REG-06)', is_mandatory: 1, max_file_size_mb: 15, description: 'Valid GSTN registration certificate' },
        { id: 'TDREQ-001-2', document_type: 'PAN_CARD', document_name: 'Permanent Account Number (PAN Card)', is_mandatory: 1, max_file_size_mb: 5, description: 'Scanned copy of PAN card' },
        { id: 'TDREQ-001-3', document_type: 'AUDITED_BALANCE_SHEET', document_name: 'Audited Financial Statements (Last 3 FY)', is_mandatory: 1, max_file_size_mb: 20, description: 'Last 3 years audited financials' },
        { id: 'TDREQ-001-4', document_type: 'OEM_AUTHORIZATION', document_name: 'OEM Authorization Letter', is_mandatory: 1, max_file_size_mb: 10, description: 'Original Equipment Manufacturer authorization' },
        { id: 'TDREQ-001-5', document_type: 'EXPERIENCE_CERTIFICATE', document_name: 'Past Performance & Completion Certificates', is_mandatory: 1, max_file_size_mb: 15, description: '5+ year project completion certificates' }
      ]
    },
    {
      id: tender2Id,
      tender_number: 'CPCL/PROC/2026/IT-SVC-0018',
      reference_number: 'CPCL/PROC/2026/IT-SVC-0018',
      title: 'Annual Maintenance Contract for Refinery SCADA & Industrial Control Systems',
      description: 'AMC for SCADA, DCS, PLC and Emergency Shutdown (ESD) systems across all refinery units. Vendor must be ISA-certified and have Cyber Security Policy compliant with CERT-In guidelines.',
      department: 'Information Technology & Process Automation',
      category: 'SERVICES',
      status: 'ACTIVE',
      budget_amount: 18500000,
      estimated_value: 18500000,
      emd_amount: 185000,
      publication_date: new Date('2026-09-01'),
      submission_start: new Date('2026-09-01'),
      submission_deadline: new Date('2026-11-30T17:00:00'),
      opening_date: new Date('2026-12-01T10:00:00'),
      created_by: 'usr-off-01',
      requirements: [
        { id: 'TREQ-002-1', name: 'GSTIN Active Status', requirement_name: 'GSTIN Active Status', requirement_key: 'GST_ACTIVE_STATUS', rule_category: 'STATUTORY', requirement_type: 'STATUTORY', operator: 'EQUALS', expected_value: 'ACTIVE', required_value: 'ACTIVE', unit: 'STATUS', is_mandatory: 1 },
        { id: 'TREQ-002-2', name: 'PAN Linkage Verified', requirement_name: 'PAN Linkage Verified', requirement_key: 'PAN_LINKAGE_VERIFIED', rule_category: 'STATUTORY', requirement_type: 'STATUTORY', operator: 'EQUALS', expected_value: 'VALID', required_value: 'VALID', unit: 'STATUS', is_mandatory: 1 }
      ],
      document_requirements: [
        { id: 'TDREQ-002-1', document_type: 'GST_CERTIFICATE', document_name: 'GST Registration Certificate', is_mandatory: 1, max_file_size_mb: 15, description: 'Valid GST certificate' },
        { id: 'TDREQ-002-2', document_type: 'PAN_CARD', document_name: 'PAN Card', is_mandatory: 1, max_file_size_mb: 5, description: 'PAN card copy' }
      ]
    }
  ]);

  // ─── 4. BID APPLICATION + VERIFICATION CASE ───────────────────────────────────
  const appId = 'APP-1720000001000';
  const caseId = 'CASE-1720000001001';

  await BidApplication.create({
    id: appId,
    tender_id: tender1Id,
    bidder_id: 'usr-bid-01',
    company_id: 'comp-001',
    application_number: 'CPCL-BID-2026-7001',
    status: 'UNDER_REVIEW',
    technical_remarks: 'All statutory documents attached. Awaiting verification.',
    submitted_at: new Date('2026-09-01T10:00:00')
  });

  await VerificationCase.create({
    id: caseId,
    application_id: appId,
    tender_id: tender1Id,
    bidder_id: 'usr-bid-01',
    company_id: 'comp-001',
    overall_status: 'PENDING_REVIEW',
    compliance_score: 78.0,
    risk_score: 22.0,
    risk_level: 'LOW',
    officer_decision_status: 'PENDING'
  });

  // ─── 5. SYSTEM INTEGRATIONS ───────────────────────────────────────────────────
  await SystemIntegration.insertMany([
    {
      id: 'int-gstn-01',
      name: 'GSTN Sovereign Gateway (API v2.4)',
      gateway_type: 'GSTN',
      status: 'OPERATIONAL',
      endpoint: 'https://api.gstn.gov.in/taxpayer/v2.4',
      response_time_ms: 115,
      uptime_percentage: 99.98,
      last_sync_at: new Date()
    },
    {
      id: 'int-mca-01',
      name: 'Ministry of Corporate Affairs MCA21 Master Registry',
      gateway_type: 'MCA21',
      status: 'OPERATIONAL',
      endpoint: 'https://mca.gov.in/v3/company/verify',
      response_time_ms: 142,
      uptime_percentage: 99.95,
      last_sync_at: new Date()
    },
    {
      id: 'int-pan-01',
      name: 'Income Tax Department NSDL Sovereign PAN Linkage',
      gateway_type: 'INCOME_TAX_PAN',
      status: 'OPERATIONAL',
      endpoint: 'https://tin-nsdl.com/api/pan/v2',
      response_time_ms: 98,
      uptime_percentage: 99.99,
      last_sync_at: new Date()
    },
    {
      id: 'int-gem-01',
      name: 'GeM Sovereign E-Marketplace API Bridge',
      gateway_type: 'GEM_PORTAL',
      status: 'OPERATIONAL',
      endpoint: 'https://gem.gov.in/api/v4/tenders',
      response_time_ms: 165,
      uptime_percentage: 99.91,
      last_sync_at: new Date()
    }
  ]);

  // ─── 6. AI INSIGHTS ───────────────────────────────────────────────────────────
  await AiInsight.insertMany([
    {
      id: 'ins-001',
      entity_type: 'APPLICATION',
      entity_id: appId,
      title: 'Valid MSME Class-II Domestic Status Confirmed',
      description: 'Bidder is verified under Udyam Registration as a Medium enterprise with 38% local value addition conforming to Make-in-India guidelines.',
      severity: 'INFO',
      confidence: 96.5,
      evidence: 'UDYAM-TN-05-0067412 matches Ministry of MSME database.',
      recommendation: 'Eligible for MSME tender purchase preference benefits.',
      status: 'ACTIVE'
    },
    {
      id: 'ins-002',
      entity_type: 'APPLICATION',
      entity_id: appId,
      title: 'Strong 3-Year Audited Balance Sheet Trend',
      description: 'Average annual turnover of ₹21.7 Cr exceeds the minimum mandatory requirement of ₹5.0 Cr by 334%.',
      severity: 'LOW',
      confidence: 98.0,
      evidence: 'Audited financials for FY22, FY23, FY24 cross-verified with ICAI UDIN.',
      recommendation: 'Financial pre-qualification criteria satisfied.',
      status: 'ACTIVE'
    }
  ]);

  console.log('[MongoDB Seed] ✅ Seeding complete!');
  console.log('[MongoDB Seed]   - 4 Users (admin, 2 officers, 1 bidder)');
  console.log('[MongoDB Seed]   - 1 Company (Shakti Engineering Works)');
  console.log('[MongoDB Seed]   - 2 Tenders with requirements');
  console.log('[MongoDB Seed]   - 1 Bid Application + Verification Case');
  console.log('[MongoDB Seed]   - 4 System Integrations');
  console.log('[MongoDB Seed]   - 2 AI Insights');
}
