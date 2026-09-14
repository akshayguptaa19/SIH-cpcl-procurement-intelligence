import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  report_type: String,
  generated_by: String,
  format: { type: String, default: 'PDF' },
  filters: mongoose.Schema.Types.Mixed,
  file_url: String
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);
export default Report;
