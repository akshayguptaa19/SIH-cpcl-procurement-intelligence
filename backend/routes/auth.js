import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db/database.js';
import { generateToken, verifyToken } from '../middleware/authMiddleware.js';
import { logAuditAction } from '../services/auditService.js';
import { notifyRole } from '../services/notificationService.js';

const router = Router();

// POST /api/auth/officer/login
router.post('/officer/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Official email and password are required' });
  }

  const user = db.queryOne('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
  const isOfficer = user && (user.role === 'ADMIN' || user.role === 'PROCUREMENT_OFFICER' || user.role === 'SENIOR_OFFICER' || user.role === 'COMPLIANCE_REVIEWER' || user.role === 'OFFICER');

  if (!user || !isOfficer) {
    return res.status(401).json({ error: 'Invalid official credentials or unauthorized role' });
  }

  const isMatch = bcrypt.compareSync(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid official credentials' });
  }

  if (user.status === 'PENDING_APPROVAL') {
    return res.status(403).json({
      error: 'Account Pending Approval',
      status: 'PENDING_APPROVAL',
      message: 'Your official credentials are under review by the CPCL Chief Vigilance Officer (CVO). You will be notified once verified.'
    });
  }

  const token = generateToken(user);
  logAuditAction({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: 'OFFICER_AUTHENTICATION_SUCCESS',
    entityType: 'USER',
    entityId: user.id,
    details: { email: user.email, department: user.department }
  });

  return res.json({
    message: 'Officer authenticated successfully',
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.name,
      name: user.name,
      role: user.role,
      department: user.department || 'Refinery Procurement Division',
      designation: user.designation || 'Verification Officer',
      employeeId: user.employee_id || 'CPCL-EMP',
      status: user.status
    }
  });
});

// POST /api/auth/officer/register
router.post('/officer/register', (req, res) => {
  const { email, password, fullName, department, designation, employeeId, phone } = req.body;
  if (!email || !password || !fullName || !employeeId) {
    return res.status(400).json({ error: 'Full name, official email, password, and CPCL employee ID are mandatory' });
  }

  const existing = db.queryOne('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
  if (existing) {
    return res.status(409).json({ error: 'An official account with this email address already exists' });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);
  const userId = `usr-off-${Date.now()}`;

  db.transaction(() => {
    db.execute(
      `INSERT INTO users (id, name, email, password_hash, role, status, employee_id, designation, department, organization, phone)
       VALUES (?, ?, ?, ?, 'PROCUREMENT_OFFICER', 'PENDING_APPROVAL', ?, ?, ?, 'Chennai Petroleum Corporation Limited', ?)`,
      [userId, fullName, email.toLowerCase().trim(), passwordHash, employeeId, designation || 'Verification Officer', department || 'Refinery Materials Division', phone || null]
    );

    db.execute(
      `INSERT INTO officer_profiles (user_id, employee_id, designation, department, organization, approval_status)
       VALUES (?, ?, ?, ?, 'Chennai Petroleum Corporation Limited', 'PENDING_APPROVAL')`,
      [userId, employeeId, designation || 'Verification Officer', department || 'Refinery Materials Division']
    );
  });

  logAuditAction({
    userId,
    userName: fullName,
    userRole: 'PROCUREMENT_OFFICER',
    action: 'OFFICER_REGISTRATION_SUBMITTED',
    entityType: 'OFFICER_PROFILE',
    entityId: userId,
    details: { email, employeeId, department }
  });

  notifyRole({
    role: 'ADMIN',
    type: 'SYSTEM',
    title: 'New Officer Registration Awaiting Approval',
    message: `${fullName} (${employeeId} - ${department}) has submitted registration. Requires CVO clearance.`,
    relatedEntity: 'USER',
    relatedId: userId
  });

  return res.status(201).json({
    message: 'Officer registration request submitted. Awaiting CVO authorization.',
    status: 'PENDING_APPROVAL',
    userId
  });
});

// POST /api/auth/bidder/login
router.post('/bidder/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Enterprise email and password are required' });
  }

  const user = db.queryOne('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
  if (!user || user.role !== 'BIDDER') {
    return res.status(401).json({ error: 'Invalid enterprise bidder credentials or unauthorized role' });
  }

  const isMatch = bcrypt.compareSync(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid enterprise bidder credentials' });
  }

  const bidderProfile = db.queryOne(
    `SELECT bp.*, c.legal_name, c.trade_name, c.gstin, c.pan, c.msme_classification, c.udyam_number
     FROM bidder_profiles bp
     JOIN companies c ON c.id = bp.company_id
     WHERE bp.user_id = ?`,
    [user.id]
  );

  const token = generateToken(user);
  logAuditAction({
    userId: user.id,
    userName: user.name,
    userRole: 'BIDDER',
    action: 'BIDDER_LOGIN_SUCCESS',
    entityType: 'USER',
    entityId: user.id,
    details: { companyName: bidderProfile?.legal_name, gstin: bidderProfile?.gstin }
  });

  return res.json({
    message: 'Enterprise authenticated successfully',
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.name,
      name: user.name,
      role: 'BIDDER',
      companyId: bidderProfile?.company_id || null,
      companyName: bidderProfile?.legal_name || bidderProfile?.trade_name || 'Enterprise Vendor',
      gstin: bidderProfile?.gstin || null,
      pan: bidderProfile?.pan || null,
      msmeClassification: bidderProfile?.msme_classification || null,
      verificationStatus: bidderProfile?.verification_status || 'VERIFIED'
    }
  });
});

// POST /api/auth/bidder/register
router.post('/bidder/register', (req, res) => {
  const {
    email,
    password,
    fullName,
    phone,
    companyName,
    registrationNumber,
    gstin,
    pan,
    msmeClassification,
    udyamNumber,
    address,
    city,
    state
  } = req.body;

  if (!email || !password || !fullName || !companyName || !gstin || !pan) {
    return res.status(400).json({
      error: 'Contact name, official email, password, company legal name, GSTIN, and PAN are mandatory'
    });
  }

  const existing = db.queryOne('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);
  const userId = `usr-bid-${Date.now()}`;
  const companyId = `comp-${Date.now()}`;

  db.transaction(() => {
    db.execute(
      `INSERT INTO companies (id, legal_name, trade_name, gstin, pan, registration_number, msme_classification, udyam_number, address, city, state, country, contact_email, contact_phone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'India', ?, ?)`,
      [
        companyId,
        companyName,
        companyName,
        gstin.toUpperCase().trim(),
        pan.toUpperCase().trim(),
        registrationNumber || 'U-PENDING',
        msmeClassification || 'Medium (Class-II)',
        udyamNumber || null,
        address || 'Industrial Estate',
        city || 'Chennai',
        state || 'Tamil Nadu',
        email.toLowerCase().trim(),
        phone || '+91 98000 00000'
      ]
    );

    db.execute(
      `INSERT INTO users (id, name, email, password_hash, role, status, phone)
       VALUES (?, ?, ?, ?, 'BIDDER', 'ACTIVE', ?)`,
      [userId, fullName, email.toLowerCase().trim(), passwordHash, phone || null]
    );

    db.execute(
      `INSERT INTO bidder_profiles (user_id, company_id, authorized_person, verification_status)
       VALUES (?, ?, ?, 'VERIFIED')`,
      [userId, companyId, fullName]
    );
  });

  const newUser = db.queryOne('SELECT * FROM users WHERE id = ?', [userId]);
  const token = generateToken(newUser);

  logAuditAction({
    userId,
    userName: fullName,
    userRole: 'BIDDER',
    action: 'BIDDER_ONBOARDING_REGISTERED',
    entityType: 'COMPANY',
    entityId: companyId,
    details: { companyName, gstin, pan }
  });

  return res.status(201).json({
    message: 'Enterprise registered and authenticated successfully',
    token,
    user: {
      id: userId,
      email: newUser.email,
      fullName: newUser.name,
      name: newUser.name,
      role: 'BIDDER',
      companyId,
      companyName,
      gstin: gstin.toUpperCase(),
      pan: pan.toUpperCase(),
      verificationStatus: 'VERIFIED'
    }
  });
});

// GET /api/auth/me
router.get('/me', verifyToken, (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (user.role === 'BIDDER') {
    return res.json({
      id: user.id,
      email: user.email,
      fullName: user.name,
      name: user.name,
      role: 'BIDDER',
      companyId: user.companyId || null,
      companyName: user.company_name || 'Enterprise Vendor',
      gstin: user.bidderProfile?.gstin || null,
      pan: user.bidderProfile?.pan || null,
      verificationStatus: user.bidderProfile?.verification_status || 'VERIFIED'
    });
  }

  return res.json({
    id: user.id,
    email: user.email,
    fullName: user.name,
    name: user.name,
    role: user.role,
    department: user.department || 'Refinery Procurement Division',
    designation: user.designation || 'Verification Officer',
    employeeId: user.employee_id || 'CPCL-EMP',
    status: user.status
  });
});

export default router;
