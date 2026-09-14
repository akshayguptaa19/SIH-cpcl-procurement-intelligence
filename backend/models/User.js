import mongoose from 'mongoose';

const officerProfileSchema = new mongoose.Schema({
  employee_id: String,
  designation: String,
  department: String,
  organization: { type: String, default: 'Chennai Petroleum Corporation Limited' },
  approval_status: { type: String, default: 'PENDING_APPROVAL' },
  security_clearance_level: { type: String, default: 'LEVEL_3_CONFIDENTIAL' },
  approved_by: String,
  approved_at: Date
}, { _id: false });

const bidderProfileSchema = new mongoose.Schema({
  company_id: String,
  authorized_person: String,
  verification_status: { type: String, default: 'VERIFIED' },
  blacklisted: { type: Boolean, default: false },
  blacklisted_reason: String
}, { _id: false });

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  full_name: String,
  email: { type: String, required: true, unique: true, lowercase: true },
  password_hash: { type: String, required: true },
  role: {
    type: String,
    enum: ['ADMIN', 'PROCUREMENT_OFFICER', 'SENIOR_OFFICER', 'COMPLIANCE_REVIEWER', 'OFFICER', 'BIDDER'],
    required: true
  },
  status: { type: String, default: 'ACTIVE' },
  employee_id: String,
  designation: String,
  department: String,
  organization: String,
  phone: String,
  is_active: { type: Number, default: 1 },
  last_login_at: Date,
  officer_profile: officerProfileSchema,
  bidder_profile: bidderProfileSchema
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Virtual so existing code using user.full_name works
userSchema.virtual('fullName').get(function () {
  return this.full_name || this.name;
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
