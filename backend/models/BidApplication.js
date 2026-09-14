import mongoose from 'mongoose';

const bidApplicationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  tender_id: { type: String, required: true },
  bidder_id: { type: String, required: true },
  company_id: { type: String, required: true },
  application_number: String,
  status: { type: String, default: 'SUBMITTED' },
  technical_remarks: String,
  // AI Analysis fields (written by AI route)
  ai_recommendation: String,
  ai_risk_level: String,
  ai_compliance_score: Number,
  tender_classification: String,
  submitted_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const BidApplication = mongoose.models.BidApplication || mongoose.model('BidApplication', bidApplicationSchema);
export default BidApplication;
