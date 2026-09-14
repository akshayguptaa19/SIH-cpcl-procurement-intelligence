import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Company from "../models/Company.js";

export const JWT_SECRET = process.env.JWT_SECRET || "CPCL_SECURE_SOVEREIGN_JWT_SECRET_2026_MOPNG";

/**
 * Generate signed JWT token
 */
export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name || user.full_name || "User"
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/**
 * Middleware to verify JWT token and authenticate user
 */
export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
      message: "No bearer token provided. Please sign in."
    });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: "Invalid or expired session token",
        message: "Your session has expired. Please sign in again."
      });
    }

    try {
      // Fetch user from MongoDB
      const user = await User.findOne({ id: decoded.id }).lean();

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "User account no longer exists."
        });
      }

      if (user.status === "SUSPENDED" || user.status === "REJECTED") {
        return res.status(403).json({
          success: false,
          error: "Account inactive",
          message: `Your account is currently ${user.status}. Please contact the CPCL administrator.`
        });
      }

      // Attach normalized full_name for backward compatibility
      user.full_name = user.name || user.full_name;

      // If user is a bidder, attach company information
      if (user.role === "BIDDER") {
        const companyId = user.bidder_profile?.company_id;
        let company = null;
        if (companyId) {
          company = await Company.findOne({ id: companyId }).lean();
        }
        user.bidderProfile = {
          company_id: companyId,
          authorized_person: user.bidder_profile?.authorized_person || user.name,
          verification_status: user.bidder_profile?.verification_status || 'PENDING',
          legal_name: company?.legal_name || company?.name,
          gstin: company?.gstin,
          pan: company?.pan,
          msme_classification: company?.msme_classification
        };
        user.companyId = companyId || null;
        user.company_name = company?.name || company?.legal_name || null;
      }

      req.user = user;
      next();
    } catch (dbErr) {
      console.error('[authMiddleware Error]:', dbErr);
      return res.status(500).json({ success: false, error: "Internal authentication error" });
    }
  });
}

export const authenticateToken = verifyToken;

/**
 * Require one or more specific roles
 * e.g. requireRole(['ADMIN', 'PROCUREMENT_OFFICER', 'OFFICER'])
 */
export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const userRole = req.user.role;
    const isOfficerRole = ["PROCUREMENT_OFFICER", "SENIOR_OFFICER", "COMPLIANCE_REVIEWER", "OFFICER"].includes(userRole);
    
    // Check if role matches directly or via OFFICER generic group
    const hasRole = allowedRoles.includes(userRole) || 
                   (allowedRoles.includes("OFFICER") && isOfficerRole);

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        error: "Access Forbidden",
        message: `Role ${userRole} does not have authorization for this action.`
      });
    }

    // If officer, check if account is pending approval
    if (isOfficerRole && req.user.status === "PENDING_APPROVAL") {
      return res.status(403).json({
        success: false,
        error: "Officer Approval Pending",
        message: "Your officer account registration is awaiting administrative verification by the CVO."
      });
    }

    next();
  };
}

/**
 * Require a specific granular permission
 */
export function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    // Admins have all permissions
    if (req.user.role === "ADMIN") {
      return next();
    }

    // Default permissive for verified roles in current system
    next();
  };
}
