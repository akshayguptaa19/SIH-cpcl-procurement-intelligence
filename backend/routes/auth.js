import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Company from '../models/Company.js';
import { generateToken, verifyToken } from '../middleware/authMiddleware.js';
import { logAuditAction } from '../services/auditService.js';
import { notifyRole } from '../services/notificationService.js';

const router = Router();

// POST /api/auth/officer/login
router.post('/officer/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Official email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).lean();
    const isOfficer = user && (user.role === 'ADMIN' || user.role === 'PROCUREMENT_OFFICER' || user.role === 'SENIOR_OFFICER' || user.role === 'COMPLIANCE_REVIEWER' || user.role === 'OFFICER');

    if (!user || !isOfficer) {
      return res.status(401).json({ error: 'Invalid official credentials or unauthorized role' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
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
    await logAuditAction({
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
        fullName: user.full_name || user.name,
        name: user.name,
        role: user.role,
        department: user.department || 'Refinery Procurement Division',
        designation: user.designation || 'Verification Officer',
        employeeId: user.employee_id || 'CPCL-EMP',
        status: user.status
      }
    });
  } catch (err) {
    console.error('[Auth Officer Login]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/officer/register
router.post('/officer/register', async (req, res) => {
  try {
    const { email, password, fullName, department, designation, employeeId, phone } = req.body;
    if (!email || !password || !fullName || !employeeId) {
      return res.status(400).json({ error: 'Full name, official email, password, and CPCL employee ID are mandatory' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: 'An official account with this email address already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `usr-off-${Date.now()}`;

    await User.create({
      id: userId,
      name: fullName,
      full_name: fullName,
      email: email.toLowerCase().trim(),
      password_hash: passwordHash,
      role: 'PROCUREMENT_OFFICER',
      status: 'PENDING_APPROVAL',
      employee_id: employeeId,
      designation: designation || 'Verification Officer',
      department: department || 'Refinery Materials Division',
      organization: 'Chennai Petroleum Corporation Limited',
      phone: phone || null,
      is_active: 0,
      officer_profile: {
        employee_id: employeeId,
        designation: designation || 'Verification Officer',
        department: department || 'Refinery Materials Division',
        organization: 'Chennai Petroleum Corporation Limited',
        approval_status: 'PENDING_APPROVAL'
      }
    });

    await logAuditAction({
      userId,
      userName: fullName,
      userRole: 'PROCUREMENT_OFFICER',
      action: 'OFFICER_REGISTRATION_SUBMITTED',
      entityType: 'OFFICER_PROFILE',
      entityId: userId,
      details: { email, employeeId, department }
    });

    await notifyRole({
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
  } catch (err) {
    console.error('[Auth Officer Register]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/bidder/login
router.post('/bidder/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Enterprise email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).lean();
    if (!user || user.role !== 'BIDDER') {
      return res.status(401).json({ error: 'Invalid enterprise bidder credentials or unauthorized role' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid enterprise bidder credentials' });
    }

    let company = null;
    if (user.bidder_profile?.company_id) {
      company = await Company.findOne({ id: user.bidder_profile.company_id }).lean();
    }

    const token = generateToken(user);
    await logAuditAction({
      userId: user.id,
      userName: user.name,
      userRole: 'BIDDER',
      action: 'BIDDER_LOGIN_SUCCESS',
      entityType: 'USER',
      entityId: user.id,
      details: { companyName: company?.legal_name, gstin: company?.gstin }
    });

    return res.json({
      message: 'Enterprise authenticated successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name || user.name,
        name: user.name,
        role: 'BIDDER',
        companyId: user.bidder_profile?.company_id || null,
        companyName: company?.legal_name || company?.trade_name || 'Enterprise Vendor',
        gstin: company?.gstin || null,
        pan: company?.pan || null,
        msmeClassification: company?.msme_classification || null,
        verificationStatus: user.bidder_profile?.verification_status || 'VERIFIED'
      }
    });
  } catch (err) {
    console.error('[Auth Bidder Login]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/bidder/register
router.post('/bidder/register', async (req, res) => {
  try {
    const { email, password, fullName, phone, companyName, registrationNumber, gstin, pan, msmeClassification, udyamNumber, address, city, state } = req.body;

    if (!email || !password || !fullName || !companyName || !gstin || !pan) {
      return res.status(400).json({ error: 'Contact name, official email, password, company legal name, GSTIN, and PAN are mandatory' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `usr-bid-${Date.now()}`;
    const companyId = `comp-${Date.now()}`;

    await Company.create({
      id: companyId,
      legal_name: companyName,
      name: companyName,
      trade_name: companyName,
      gstin: gstin.toUpperCase().trim(),
      pan: pan.toUpperCase().trim(),
      registration_number: registrationNumber || 'U-PENDING',
      msme_classification: msmeClassification || 'Medium (Class-II)',
      udyam_number: udyamNumber || null,
      address: address || 'Industrial Estate',
      city: city || 'Chennai',
      state: state || 'Tamil Nadu',
      country: 'India',
      contact_email: email.toLowerCase().trim(),
      contact_phone: phone || '+91 98000 00000'
    });

    await User.create({
      id: userId,
      name: fullName,
      full_name: fullName,
      email: email.toLowerCase().trim(),
      password_hash: passwordHash,
      role: 'BIDDER',
      status: 'ACTIVE',
      phone: phone || null,
      is_active: 1,
      bidder_profile: {
        company_id: companyId,
        authorized_person: fullName,
        verification_status: 'VERIFIED',
        blacklisted: false
      }
    });

    const newUser = await User.findOne({ id: userId }).lean();
    const token = generateToken(newUser);

    await logAuditAction({
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
        fullName: newUser.full_name || newUser.name,
        name: newUser.name,
        role: 'BIDDER',
        companyId,
        companyName,
        gstin: gstin.toUpperCase(),
        pan: pan.toUpperCase(),
        verificationStatus: 'VERIFIED'
      }
    });
  } catch (err) {
    console.error('[Auth Bidder Register]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', verifyToken, (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (user.role === 'BIDDER') {
    return res.json({
      id: user.id,
      email: user.email,
      fullName: user.full_name || user.name,
      name: user.name,
      role: 'BIDDER',
      companyId: user.bidder_profile?.company_id || null,
      companyName: user.company_name || 'Enterprise Vendor',
      gstin: user.bidder_profile?.gstin || null,
      pan: user.bidder_profile?.pan || null,
      verificationStatus: user.bidder_profile?.verification_status || 'VERIFIED'
    });
  }

  return res.json({
    id: user.id,
    email: user.email,
    fullName: user.full_name || user.name,
    name: user.name,
    role: user.role,
    department: user.department || 'Refinery Procurement Division',
    designation: user.designation || 'Verification Officer',
    employeeId: user.employee_id || 'CPCL-EMP',
    status: user.status
  });
});

export default router;
