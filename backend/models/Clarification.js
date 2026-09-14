import mongoose from 'mongoose';

const clarificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  case_id: String,
  application_id: String,
  tender_id: String,
  bidder_id: String,
  question: String,
  from_user: String,
  status: { type: String, default: 'AWAITING_RESPONSE' },
  response: String,
  response_date: Date,
  attachment_url: String,
  attachment_name: String
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Clarification = mongoose.models.Clarification || mongoose.model('Clarification', clarificationSchema);
export default Clarification;
