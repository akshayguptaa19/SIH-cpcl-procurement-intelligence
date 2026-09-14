import mongoose from 'mongoose';

const findingSchema = new mongoose.Schema({
  id: String,
  document_id: String,
  finding: String,
  severity: String,
  confidence: Number,
  evidence: String,
  recommendation: String,
  created_at: { type: Date, default: Date.now }
}, { _id: false });

const complianceCheckSchema = new mongoose.Schema({
  id: String,
  requirement_name: String,
  requirement_key: String,
  category: String,
  result: String,
  evidence: String,
  review_status: String,
  created_at: { type: Date, default: Date.now }
}, { _id: false });

const riskAssessmentSchema = new mongoose.Schema({
  id: String,
  risk_category: String,
  risk_level: String,
  risk_score: Number,
  description: String,
  risk_factors: mongoose.Schema.Types.Mixed,
  created_at: { type: Date, default: Date.now }
}, { _id: false });

const verificationCaseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  application_id: { type: String, required: true },
  tender_id: String,
  bidder_id: String,
  company_id: String,
  overall_status: { type: String, default: 'PENDING_REVIEW' },
  compliance_score: { type: Number, default: 75.0 },
  risk_score: { type: Number, default: 20.0 },
  risk_level: { type: String, default: 'LOW' },
  // AI Recommendation
  ai_recommendation: String,
  // Officer Decision (captured from AI officer decision panel)
  officer_decision_status: { type: String, default: 'PENDING' },
  officer_decision_notes: String,
  officer_decision_at: Date,
  assigned_officer_id: String,
  // Legacy fields from SQLite
  officer_remarks: String,
  rejection_reason: String,
  reviewed_at: Date,
  registration_number: String,
  // Embedded arrays (replaces separate join tables)
  findings: [findingSchema],
  checks: [complianceCheckSchema],
  risk_assessments: [riskAssessmentSchema]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const VerificationCase = mongoose.models.VerificationCase || mongoose.model('VerificationCase', verificationCaseSchema);
export default VerificationCase;
