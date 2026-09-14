import mongoose from 'mongoose';

const documentVersionSchema = new mongoose.Schema({
  id: String,
  version_number: { type: Number, default: 1 },
  file_name: String,
  file_url: String,
  file_size: Number,
  uploaded_by: String,
  uploaded_at: { type: Date, default: Date.now }
}, { _id: false });

const ocrExtractionSchema = new mongoose.Schema({
  id: String,
  extracted_data: mongoose.Schema.Types.Mixed,
  confidence: Number,
  status: { type: String, default: 'COMPLETED' },
  processed_at: { type: Date, default: Date.now }
}, { _id: false });

const documentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  application_id: { type: String, required: true },
  bidder_id: String,
  document_type: String,
  document_name: String,
  file_name: String,
  file_url: String,
  file_size: Number,
  mime_type: String,
  current_version: { type: Number, default: 1 },
  status: { type: String, default: 'OCR_PROCESSED' },
  ocr_full_text: String,
  // Embedded sub-documents (replaces join tables)
  versions: [documentVersionSchema],
  extracted_data: mongoose.Schema.Types.Mixed,  // from ocr_extractions
  ocr: ocrExtractionSchema,
  uploaded_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Document = mongoose.models.Document || mongoose.model('Document', documentSchema);
export default Document;
