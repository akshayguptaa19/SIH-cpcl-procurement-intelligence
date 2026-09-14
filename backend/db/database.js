import mongoose from 'mongoose';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directories exist (kept for file uploads compatibility)
const uploadsDir = path.resolve(__dirname, '../uploads');
const reportsDir = path.join(uploadsDir, 'reports');
const bidsDir = path.join(uploadsDir, 'bids');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
if (!fs.existsSync(bidsDir)) fs.mkdirSync(bidsDir, { recursive: true });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cpcl_procurement';

/**
 * Connect to MongoDB via Mongoose.
 * Call this once at application startup before mounting routes.
 */
export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }
  console.log('[MongoDB] Connecting to', MONGODB_URI);
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  });
  console.log('[MongoDB] ✅ Connected successfully');
  return mongoose.connection;
}

export default mongoose;
