import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.resolve(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e6);
    cb(null, `${baseName}_${uniqueSuffix}${ext}`);
  }
});

// Strict MIME & Extension filter
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg"
  ];

  const allowedExts = [".pdf", ".png", ".jpg", ".jpeg"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only official PDF, PNG, and JPEG documents are permitted for government bid submission."
      ),
      false
    );
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15 Megabytes max
  },
  fileFilter: fileFilter
});

export default upload;
