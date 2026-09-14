import mongoose from 'mongoose';

const requirementSchema = new mongoose.Schema({
  id: String,
  name: String,
  requirement_name: String,
  requirement_key: String,
  rule_category: String,
  requirement_type: String,
  operator: String,
  expected_value: String,
  required_value: String,
  unit: String,
  is_mandatory: { type: Number, default: 1 }
}, { _id: false });

const documentRequirementSchema = new mongoose.Schema({
  id: String,
  document_type: String,
  document_name: String,
  is_mandatory: { type: Number, default: 1 },
  max_file_size_mb: { type: Number, default: 15 },
  description: String
}, { _id: false });

const tenderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  tender_number: String,
  reference_number: String,
  title: { type: String, required: true },
  description: String,
  department: { type: String, default: 'Refinery Procurement Division' },
  category: { type: String, default: 'EQUIPMENT' },
  status: { type: String, default: 'ACTIVE' },
  budget_amount: { type: Number, default: 0 },
  estimated_value: { type: Number, default: 0 },
  emd_amount: { type: Number, default: 0 },
  publication_date: Date,
  submission_start: Date,
  submission_deadline: Date,
  technical_opening_date: Date,
  opening_date: Date,
  created_by: String,
  // Embedded sub-documents (replaces join tables)
  requirements: [requirementSchema],
  document_requirements: [documentRequirementSchema]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Ensure tender_number defaults to reference_number
tenderSchema.pre('save', function (next) {
  if (!this.tender_number && this.reference_number) this.tender_number = this.reference_number;
  if (!this.reference_number && this.tender_number) this.reference_number = this.tender_number;
  if (!this.estimated_value && this.budget_amount) this.estimated_value = this.budget_amount;
  if (!this.budget_amount && this.estimated_value) this.budget_amount = this.estimated_value;
  next();
});

const Tender = mongoose.models.Tender || mongoose.model('Tender', tenderSchema);
export default Tender;
