# 🛡️ CPCL AI Sovereign Procurement Intelligence Platform
### Smart India Hackathon (SIH) | Ministry of Petroleum & Natural Gas (MoPNG)

[![Platform](https://img.shields.io/badge/Platform-CPCL%20Sovereign%20Network-003366?style=for-the-badge&logo=shield)](https://github.com/)
[![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite%206-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express%205-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite%20WAL-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

An end-to-end, high-security procurement intelligence and tender evaluation system architected for **Chennai Petroleum Corporation Limited (CPCL)** and public sector undertakings under **MoPNG**. The platform leverages automated verification, algorithmic risk scoring, multi-tier officer workflows, and immutable CVC-compliant audit logs to eradicate tender manipulation, accelerate bid scrutiny, and ensure complete transparency.

---

## 🏛️ System Architecture

```
                               ┌────────────────────────────────────────┐
                               │  CPCL Procurement Intelligence Web UI  │
                               │  (React 19 + Tailwind v4 + Recharts)   │
                               └──────────────────┬─────────────────────┘
                                                  │ HTTP / REST & JWT
                                                  ▼
                               ┌────────────────────────────────────────┐
                               │     Express Sovereign API Gateway      │
                               │  (/api/auth, /api/tenders, /api/docs)  │
                               └───────┬────────────────────┬───────────┘
                                       │                    │
                   ┌───────────────────▼──┐             ┌───▼───────────────────┐
                   │  AI Document Engine  │             │   SQLite WAL Storage  │
                   │  - GSTIN / PAN Check │             │  - Acid Transactions  │
                   │  - MSME / ITR Matrix │             │  - Auto-seeded Schema │
                   │  - Risk / Collusion  │             │  - Native node:sqlite │
                   └──────────────────────┘             └───────────────────────┘
```

---

## 🌟 Key Features

- 🏢 **Multi-Role Portals & RBAC**:
  - **Supervisory Procurement Officer**: Tender creation, technical bid scrutiny, anomaly review, and vendor approvals.
  - **Approval Authority / Admin**: Officer registration authorization, system settings, master data, and CVC audit logging.
  - **Registered Bidders**: Bid submission, real-time status tracking, document upload, and clarification responses.

- 🤖 **Automated Document & Risk Verification**:
  - OCR extraction simulation & validation for GST certificates, PAN cards, MSME Udyam, 3-year audited balance sheets, and technical compliance certificates.
  - Synthetic cross-checks against government registries (GSTN, MCA, Income Tax e-filing, CPPP).
  - Algorithmic vendor risk scoring (0–100 scale) with red-flag detection for shell companies, cartel bidding, and blacklisted entities.

- 📜 **CVC & GeM Compliance Audit Trail**:
  - Tamper-evident logging of every officer action, document download, score modification, and decision.
  - One-click generation of CVC-compliant Vigilance Audit Reports and Tender Evaluation Summaries in PDF format.

- 💬 **Dynamic Clarification Engine**:
  - Formal bid clarification requests sent directly to bidders with strict submission deadlines.
  - Encrypted back-and-forth communication logged for procurement dispute prevention.

---

## 📁 Repository Organization

```
SIH/
├── backend/                              # Dedicated Express & SQLite API Server
│   ├── data/                             # SQLite database storage (.gitkeep)
│   ├── db/
│   │   ├── database.js                   # node:sqlite WAL connection & table migrations
│   │   ├── schema.sql                    # Full relational schema (users, tenders, bids, audits)
│   │   └── seed.js                       # Comprehensive demo dataset seeder
│   ├── middleware/
│   │   └── authMiddleware.js             # JWT bearer verification & role authorization
│   ├── routes/                           # Modular API endpoints
│   │   ├── admin.js                      # User approval & officer management
│   │   ├── applications.js               # Bidder tender applications
│   │   ├── audit.js                      # CVC vigilance audit logs
│   │   ├── auth.js                       # Login, registration, token refresh
│   │   ├── bidders.js                    # Vendor profiles and history
│   │   ├── clarifications.js             # Query resolution workflow
│   │   ├── compliance.js                 # GeM & CVC guideline verification
│   │   ├── dashboard.js                  # Officer dashboard metrics & pipeline
│   │   ├── documents.js                  # Document upload and streaming
│   │   ├── insights.js                   # AI-driven market and tender insights
│   │   ├── notifications.js              # Real-time alert feed
│   │   ├── reports.js                    # Vigilance & tender report generation
│   │   ├── risk.js                       # Vendor risk matrix & anomaly detection
│   │   ├── system.js                     # Health check & server telemetry
│   │   └── tenders.js                    # Tender creation, publishing, and evaluation
│   ├── services/
│   │   └── aiVerificationService.js      # Automated document analysis algorithms
│   ├── uploads/                          # Stored PDFs & reports (.gitkeep)
│   ├── .env.example                      # Backend environment template
│   ├── package.json                      # Backend dependencies
│   └── index.js                          # Express application entrypoint
│
├── frontend/                             # Dedicated React 19 + Vite Frontend SPA
│   ├── public/                           # Refinery banners, branding & icons
│   ├── src/
│   │   ├── components/                   # UI components grouped by functional domain
│   │   │   ├── admin/                    # System settings, user approvals, master data
│   │   │   ├── ai/                       # AI document insights and risk heatmaps
│   │   │   ├── audit/                    # Audit logs and CVC compliance viewer
│   │   │   ├── auth/                     # Officer, Bidder & Admin login / register
│   │   │   ├── bidders/                  # Bidder registry and profile scrutiny
│   │   │   ├── clarifications/           # Clarification manager and response forms
│   │   │   ├── dashboard/                # Executive procurement dashboard
│   │   │   ├── documents/                # Document viewer and verification UI
│   │   │   ├── evaluation/               # Technical and commercial bid evaluator
│   │   │   ├── integrations/             # Government portal simulation (GSTN, GeM)
│   │   │   ├── layout/                   # Sidebar, header, navigation, sovereign theme
│   │   │   ├── reports/                  # Report generation & download center
│   │   │   ├── risk/                     # Anomaly flags and cartel detection
│   │   │   ├── roles/                    # Role-specific dashboard views
│   │   │   └── tenders/                  # Tender creation wizard and list
│   │   ├── context/
│   │   │   └── ProcurementContext.jsx    # Central state store & REST synchronization
│   │   ├── lib/
│   │   │   └── api.js                    # Typed fetch wrapper with JWT interceptor
│   │   ├── App.jsx                       # Routing and role guard
│   │   └── main.jsx                      # React 19 root mount
│   ├── index.html                        # Application HTML shell
│   ├── jsconfig.json                     # Path aliases (@/*)
│   ├── vite.config.js                    # Vite 6 config with /api proxy to port 5000
│   ├── .env.example                      # Frontend environment template
│   └── package.json                      # Frontend dependencies
│
├── .gitignore                            # Root gitignore (clean git repository tracking)
├── .env.example                          # Monorepo environment guide
├── package.json                          # Root workspace runner with concurrent scripts
└── README.md                             # Documentation & Setup Guide
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js**: `v20.0.0` or later (Node.js `v22+` recommended for native `node:sqlite`)
- **npm**: `v9+`

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>

# Install all dependencies (root, backend, and frontend) in one step
npm run install:all
```

### 2. Run Both Frontend & Backend (Recommended)
You can launch both the **Express API** (Port `5000`) and the **React Vite Frontend** (Port `3000`) together with a single command from the project root:

```bash
npm run dev
```

- **Frontend Application**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
- **API Health Check**: `http://localhost:5000/api/system/health`

### 3. Or Run Independently

#### Run Backend Only:
```bash
npm run dev:backend
# Or: cd backend && npm run dev
```

#### Run Frontend Only:
```bash
npm run dev:frontend
# Or: cd frontend && npm run dev
```

---

## 🔑 Default Test Accounts & Credentials

The SQLite database automatically initializes and self-seeds on the very first boot with comprehensive demonstration records:

| Role | Name | Email | Password | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| **Supervisory Officer** | Akshay Gupta | `akshay.gupta@cpcl.gov.in` | `Officer@2026` | Full Procurement & Evaluation Access |
| **System Administrator** | CPCL Admin | `admin@cpcl.gov.in` | `CPCL@admin2026` | Officer Approvals & System Settings |
| **Junior Officer (Pending)**| Priya Sharma | `priya.sharma@cpcl.gov.in` | `Officer@2026` | Demo pending authorization state |
| **Registered Bidder 1** | Shakti Enterprises | `contact@shaktienterprises.com` | `Bidder@2026` | Bid Submission & Clarification Portal |
| **Registered Bidder 2** | Precision Tools Ltd | `bids@precisiontools.in` | `Bidder@2026` | Active Bidder Dashboard |

---

## 🔌 API Endpoint Overview

All API endpoints are mounted under `/api` and secured with JWT Bearer tokens where applicable:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user (Officer / Bidder / Admin) |
| `GET` | `/api/system/health` | System telemetry, uptime, and database status |
| `GET` | `/api/dashboard/stats` | High-level procurement pipeline KPI metrics |
| `GET` | `/api/tenders` | List tenders with filter and search |
| `POST` | `/api/tenders` | Create a new sovereign tender |
| `GET` | `/api/bidders` | View registered vendors and qualification status |
| `POST` | `/api/verification/verify/:docId` | Trigger automated AI verification on a document |
| `GET` | `/api/risk/matrix` | Retrieve vendor risk evaluation matrix |
| `POST` | `/api/clarifications` | Issue a formal query/clarification to a bidder |
| `GET` | `/api/audit/logs` | Fetch CVC-compliant immutable vigilance audit entries |
| `POST` | `/api/reports/generate` | Generate official compliance and evaluation reports |

---

## 🚀 Pushing to Your GitHub Repository

Follow these standard commands to push this codebase to your own GitHub profile:

```bash
# 1. Verify that git is initialized and status is clean
git status

# 2. Add all files to staging
git add .

# 3. Create your initial commit
git commit -m "feat: organize project into modular frontend and backend for GitHub"

# 4. Set main branch
git branch -M main

# 5. Link your GitHub repository remote (replace with your repo URL)
git remote add origin https://github.com/<your-github-username>/<your-repo-name>.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 👥 Contributors & Acknowledgements

- **Team**: CPCL AI Smart Procurement Team
- **Competition**: Smart India Hackathon (SIH)
- **Problem Statement**: AI-Driven Procurement & Tender Scrutiny for CPCL (MoPNG)
#   S I H - c p c l - p r o c u r e m e n t - i n t e l l i g e n c e  
 