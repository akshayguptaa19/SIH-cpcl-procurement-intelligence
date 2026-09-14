import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.resolve(__dirname, "../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure uploads directories exist
const uploadsDir = path.resolve(__dirname, "../uploads");
const reportsDir = path.join(uploadsDir, "reports");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

const dbPath = path.join(dataDir, "cpcl_procurement.db");
const db = new DatabaseSync(dbPath);

// Enable WAL Mode and Foreign Keys for ACID transactions & concurrent readers
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

// Initialize Schema
const schemaPath = path.join(__dirname, "schema.sql");
if (fs.existsSync(schemaPath)) {
  const schemaSql = fs.readFileSync(schemaPath, "utf-8");
  db.exec(schemaSql);
}

/**
 * Run safe column migrations to ensure total compatibility across all route queries
 */
function applySchemaUpgrades() {
  const columnsToAdd = [
    { table: 'users', column: 'full_name', def: 'TEXT' },
    { table: 'users', column: 'is_active', def: 'INTEGER DEFAULT 1' },
    { table: 'users', column: 'last_login_at', def: 'DATETIME' },
    { table: 'companies', column: 'name', def: 'TEXT' },
    { table: 'companies', column: 'is_msme', def: 'INTEGER DEFAULT 0' },
    { table: 'officer_profiles', column: 'id', def: 'TEXT' },
    { table: 'officer_profiles', column: 'security_clearance_level', def: "TEXT DEFAULT 'LEVEL_3_CONFIDENTIAL'" },
    { table: 'bidder_profiles', column: 'id', def: 'TEXT' },
    { table: 'bidder_profiles', column: 'blacklisted', def: 'INTEGER DEFAULT 0' },
    { table: 'bidder_profiles', column: 'blacklisted_reason', def: 'TEXT' },
    { table: 'tenders', column: 'reference_number', def: 'TEXT' },
    { table: 'tenders', column: 'estimated_value', def: 'REAL' },
    { table: 'tenders', column: 'emd_amount', def: 'REAL DEFAULT 0' },
    { table: 'tenders', column: 'opening_date', def: 'DATETIME' },
    { table: 'tender_requirements', column: 'requirement_name', def: 'TEXT' },
    { table: 'tender_requirements', column: 'requirement_key', def: 'TEXT' },
    { table: 'tender_requirements', column: 'rule_category', def: 'TEXT' },
    { table: 'tender_requirements', column: 'operator', def: 'TEXT' },
    { table: 'tender_requirements', column: 'expected_value', def: 'TEXT' },
    { table: 'tender_requirements', column: 'unit', def: 'TEXT' },
    { table: 'tender_document_requirements', column: 'document_name', def: 'TEXT' },
    { table: 'tender_document_requirements', column: 'max_file_size_mb', def: 'INTEGER DEFAULT 15' },
    { table: 'bid_applications', column: 'application_number', def: 'TEXT' },
    { table: 'bid_applications', column: 'technical_remarks', def: 'TEXT' },
    { table: 'documents', column: 'document_name', def: 'TEXT' }
  ];

  for (const { table, column, def } of columnsToAdd) {
    try {
      const info = db.prepare(`PRAGMA table_info(${table})`).all();
      const exists = info.some(col => col.name === column);
      if (!exists) {
        db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${def};`);
      }
    } catch (err) {
      // Table might not exist yet or column already present
    }
  }

  // Populate any missing synonym fields
  try {
    db.exec(`UPDATE users SET full_name = name WHERE full_name IS NULL OR full_name = '';`);
    db.exec(`UPDATE companies SET name = legal_name WHERE name IS NULL OR name = '';`);
    db.exec(`UPDATE tenders SET reference_number = tender_number WHERE reference_number IS NULL OR reference_number = '';`);
    db.exec(`UPDATE tenders SET estimated_value = budget_amount WHERE estimated_value IS NULL OR estimated_value = 0;`);
    db.exec(`UPDATE tender_requirements SET requirement_name = name WHERE requirement_name IS NULL OR requirement_name = '';`);
    db.exec(`UPDATE tender_requirements SET expected_value = required_value WHERE expected_value IS NULL OR expected_value = '';`);
    db.exec(`UPDATE tender_requirements SET rule_category = requirement_type WHERE rule_category IS NULL OR rule_category = '';`);
    db.exec(`UPDATE tender_document_requirements SET document_name = document_type WHERE document_name IS NULL OR document_name = '';`);
    db.exec(`UPDATE bid_applications SET application_number = 'CPCL-BID-' || id WHERE application_number IS NULL OR application_number = '';`);
    db.exec(`UPDATE documents SET document_name = document_type WHERE document_name IS NULL OR document_name = '';`);
  } catch (err) {
    // Ignore if initial seeding will populate
  }
}

applySchemaUpgrades();

/**
 * Helper to run a SELECT query and return all matching rows
 */
export function query(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    return stmt.all(...params);
  } catch (err) {
    console.error(`[DB Query Error] ${sql}:`, err.message);
    throw err;
  }
}

/**
 * Helper to run a SELECT query and return a single row
 */
export function queryOne(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    return stmt.get(...params) || null;
  } catch (err) {
    console.error(`[DB QueryOne Error] ${sql}:`, err.message);
    throw err;
  }
}

/**
 * Helper to run an INSERT, UPDATE, or DELETE statement
 */
export function execute(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    return stmt.run(...params);
  } catch (err) {
    console.error(`[DB Execute Error] ${sql}:`, err.message);
    throw err;
  }
}

/**
 * Execute multiple statements in a transaction
 */
export function transaction(fn) {
  db.exec("BEGIN TRANSACTION;");
  try {
    const result = fn();
    db.exec("COMMIT;");
    return result;
  } catch (err) {
    db.exec("ROLLBACK;");
    throw err;
  }
}

db.query = query;
db.queryOne = queryOne;
db.execute = execute;
db.transaction = transaction;

export default db;
