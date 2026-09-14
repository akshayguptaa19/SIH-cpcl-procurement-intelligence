# GeM Bid Compliance Platform — AI Team Handoff

## AI Deliverables

### Tender Type Classifier
- Model: TF-IDF + Linear SVM
- Input: tender title and tender description
- Output: works, goods, or services
- Final test accuracy: 94.47% | macro-F1: 0.8468 (verified against 6,242-row held-out test set)
- Known weak spot: `services` class F1 is 0.67 — it's the smallest class (5.6% of test data). Treat low-confidence "services" predictions as needing a human glance.
- Model file: `models/tender_type_classifier/tfidf_linear_svm_baseline.joblib`

### Document Structure Extractor
- Model: LayoutLMv3-base fine-tuned on FUNSD+
- Input: document image, OCR words, and OCR bounding boxes (backend must run OCR first)
- Output: per-word role — other, header, question, answer
- Final test token accuracy: 86.56% | macro-F1: 0.8318
- **Now integrated** into `analyze_bid()` — pass `document_image_path`, `document_ocr_words`, `document_ocr_bboxes` in the request payload to get a `document_structure` section back. If omitted, it's skipped entirely (no error).
- This model identifies document *layout roles*, not statutory field values — it does not itself verify GSTIN/PAN/Udyam numbers. Field-value extraction is handled separately by regex in the compliance engine.
- Model files: `models/document_extractor/layoutlmv3_funsd_plus_v1/`

### OCR Module
- Extracts text and layout from uploaded bidder/tender documents.
- Input: an image (`.png`, `.jpg`, `.jpeg`, `.tiff`, `.bmp`) or PDF file path.
- Output: full document text (feeds `compliance_engine`) plus per-page word text + pixel bounding boxes (feeds `model_adapters.extract_document_structure`).
- Uses Tesseract OCR (via `pytesseract`) for text/word/box extraction, and PyMuPDF (`fitz`) to render PDF pages to images before OCR.
- **Requires the Tesseract OCR binary installed on the host** (not just a pip package) — e.g. `apt-get install tesseract-ocr` on the backend server. `ai_requirements.txt` covers the Python side only; this system dependency must be documented for whoever deploys the backend.
- Tested against synthetic documents with known ground-truth text (see `tests/test_ocr.py`) — real-world OCR accuracy depends on scan quality; low-resolution or skewed scans will introduce character-level errors that can break the compliance engine's exact-format regex matching (e.g. a misread digit in a GSTIN). This is a known limitation of OCR-based extraction, not a bug — flag low-confidence OCR results for Procurement Officer review rather than trusting them blindly.
- Source: `src/ai_engine/ocr.py`

### Hybrid Compliance Engine
- Detects tender requirements: GST, PAN, Udyam/MSME, MCA/CIN, Make in India, EPFO, ESIC, Startup India, NSIC, OEM authorization, DigiLocker, blacklisting.
- Extracts candidate identifiers via regex: GSTIN, PAN, Udyam number, CIN, local-content %.
- Cross-checks that an extracted GSTIN's embedded PAN matches the extracted PAN — flags a `gstin_pan_consistency` failure on mismatch.
- Returns per-check evidence, compliance score, risk level, recommendation, and an audit timestamp.
- **Does not itself perform live government verification.** Every requirement check is only as good as the `portal_results` the backend supplies — if a key is missing, that check is returned as `"review"`, not silently passed.
- Source: `src/ai_engine/compliance_engine.py`

## Backend Entry Point
- Source: `src/ai_engine/ai_service.py`
- **Preferred for new integrations: `analyze_bid_from_file(tender_title, tender_description, bidder_document_path, portal_results)`** — hand it a raw uploaded PDF/image path, it runs OCR, tender classification, document structure extraction, and compliance scoring, and returns everything in one call, including the extracted OCR text for auditing.
- Lower-level: `analyze_bid(payload)` — use this if the backend already has its own OCR text/words/boxes and doesn't need this module's OCR step.
- Suggested endpoint: `POST /api/ai/analyze-bid`

## Required Request Fields
- `tender_title`
- `tender_description`
- `bidder_document_text`
- `portal_results` — dict keyed by requirement name (`gst`, `pan`, `udyam_msme`, `mca`, `blacklisting`, etc.), each value at least `{"status": "verified" | "failed" | "clear" | ...}`

## Optional Request Fields (enables document structure extraction)
- `document_image_path`
- `document_ocr_words`
- `document_ocr_bboxes`

## Team Responsibilities

### AI Team
- Trained models, document structure extraction, requirement detection, identifier extraction + consistency checks, compliance scoring, risk logic, recommendation, and audit-result format are complete and unit-tested (`tests/`).

### Backend Team
- ~~Add OCR for uploaded documents~~ — now handled by the AI module (`src/ai_engine/ocr.py`, called via `analyze_bid_from_file`). Backend just needs to save the uploaded file and pass its path.
- **Install the Tesseract OCR system binary** on the deployment server (e.g. `apt-get install tesseract-ocr`) — a system-level dependency, not something `pip install` covers.
- Integrate official or approved GSTN, PAN, Udyam, MCA, EPFO, ESIC, NSIC, Startup India, DigiLocker, and debarment sources.
- Send verified results to the AI engine as `portal_results`.
- Store audit records and expose API endpoints.

### Frontend Team
- Upload tender and bidder documents.
- Show compliance score, risk level, checks, evidence, missing items, and recommendation.
- Keep Procurement Officer final decision visually and functionally separate from AI output — see `audit_note` in every response.

## Important Limitation
The AI system is decision support only. Official statutory verification comes from backend connectors (`portal_results`), not from the AI models. Final qualification/disqualification remains with the Procurement Officer.
