
"""Single backend entry point for the AI compliance workflow."""

from typing import Any, Dict

from .compliance_engine import assess_compliance
from .model_adapters import classify_tender, extract_document_structure

def analyze_bid(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Expected payload:
    {
      "tender_title": "...",
      "tender_description": "...",
      "bidder_document_text": "...",
      "portal_results": {"gst": {"status": "verified"}},

      # Optional - only needed if the backend wants LayoutLMv3 document-
      # structure roles (header/question/answer) alongside the compliance
      # check. Backend must run OCR first and supply words + boxes -
      # or just call analyze_bid_from_file() below, which does the OCR
      # step for you.
      "document_image_path": "...",
      "document_ocr_words": ["...", "..."],
      "document_ocr_bboxes": [[x0, y0, x1, y1], ...]
    }

    Use this entry point when the backend already has OCR'd text/words/boxes
    (e.g. from its own OCR pipeline). Use analyze_bid_from_file() instead
    when you just have a raw uploaded document and want OCR handled here.
    """
    tender_title = payload.get("tender_title", "")
    tender_description = payload.get("tender_description", "")
    tender_text = f"{tender_title}\n{tender_description}".strip()

    tender_classification = classify_tender(
        tender_title,
        tender_description
    )

    compliance_assessment = assess_compliance(
        tender_text=tender_text,
        bidder_document_text=payload.get("bidder_document_text", ""),
        portal_results=payload.get("portal_results", {}),
    )

    result: Dict[str, Any] = {
        "tender_classification": tender_classification,
        "compliance_assessment": compliance_assessment,
    }

    document_structure = _maybe_extract_document_structure(payload)
    if document_structure is not None:
        result["document_structure"] = document_structure

    return result

def analyze_bid_from_file(
    tender_title: str,
    tender_description: str,
    bidder_document_path: str,
    portal_results: Dict[str, Any] | None = None,
    run_document_structure: bool = True,
) -> Dict[str, Any]:
    """
    Single entry point covering the whole AI workflow starting from a raw
    uploaded bidder document (PDF or image) - OCR, tender classification,
    document structure extraction, and compliance scoring.

    Backend only needs to:
      1. Save the uploaded file somewhere on disk.
      2. Call this function with that path.
      3. Send back whatever official portal_results it has gathered
         separately (this function does not fetch those).

    run_document_structure=False skips the LayoutLMv3 step (useful if the
    backend only needs the compliance score quickly and doesn't need
    per-word document roles).
    """
    from .ocr import ocr_document

    ocr_result = ocr_document(bidder_document_path)

    payload: Dict[str, Any] = {
        "tender_title": tender_title,
        "tender_description": tender_description,
        "bidder_document_text": ocr_result["full_text"],
        "portal_results": portal_results or {},
    }

    if run_document_structure and ocr_result["pages"]:
        first_page = ocr_result["pages"][0]
        payload["document_image_path"] = first_page["image_path"]
        payload["document_ocr_words"] = first_page["words"]
        payload["document_ocr_bboxes"] = first_page["bboxes"]

    result = analyze_bid(payload)
    result["ocr"] = {
        "page_count": len(ocr_result["pages"]),
        "full_text": ocr_result["full_text"],
    }
    return result

def _maybe_extract_document_structure(payload: Dict[str, Any]) -> Dict[str, Any] | None:
    """
    Runs the LayoutLMv3 document-structure model only when the backend has
    supplied OCR output for it. Kept optional and isolated in its own
    try/except so a document-extraction failure (e.g. missing model files,
    a bad image path) never breaks tender classification or compliance
    scoring, which are the two checks a Procurement Officer actually needs.
    """
    image_path = payload.get("document_image_path")
    words = payload.get("document_ocr_words")
    bboxes = payload.get("document_ocr_bboxes")

    if not image_path or not words or not bboxes:
        return None

    try:
        return extract_document_structure(image_path, words, bboxes)
    except Exception as exc:  # noqa: BLE001 - surface as a soft failure, not a crash
        return {
            "model": "LayoutLMv3-base fine-tuned on FUNSD+",
            "error": f"Document structure extraction failed: {exc}",
            "document_roles": [],
        }
