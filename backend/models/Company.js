import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  legal_name: { type: String, required: true },
  name: String,           // synonym for legal_name
  trade_name: String,
  gstin: { type: String, uppercase: true },
  pan: { type: String, uppercase: true },
  registration_number: String,
  msme_classification: { type: String, default: 'Medium (Class-II)' },
  is_msme: { type: Number, default: 0 },
  udyam_number: String,
  turnovers: mongoose.Schema.Types.Mixed,  // flexible JSON for annual turnovers
  address: String,
  city: { type: String, default: 'Chennai' },
  state: { type: String, default: 'Tamil Nadu' },
  country: { type: String, default: 'India' },
  contact_email: String,
  contact_phone: String
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Company = mongoose.models.Company || mongoose.model('Company', companySchema);
export default Company;
