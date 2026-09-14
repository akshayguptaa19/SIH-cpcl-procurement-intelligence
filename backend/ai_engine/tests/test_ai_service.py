
import sys
from pathlib import Path
from unittest.mock import patch

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT / "src"))

from ai_engine.ai_service import analyze_bid  # noqa: E402

PAYLOAD = {
    "tender_title": "Construction of government school building",
    "tender_description": (
        "Bidder shall submit GSTIN, PAN and Udyam registration. "
        "A declaration of no blacklisting is mandatory."
    ),
    "bidder_document_text": (
        "ABC Enterprises GSTIN 27AAACG1234M1Z5 "
        "PAN AAACG1234M UDYAM-MH-12-1234567"
    ),
    "portal_results": {
        "gst": {"status": "verified", "source": "GSTN"},
        "pan": {"status": "verified", "source": "Income Tax"},
        "udyam_msme": {"status": "verified", "source": "Udyam"},
        "blacklisting": {"status": "clear", "source": "Debarment List"},
    },
}


def _fake_classify_tender(title, description=""):
    # analyze_bid doesn't need real model weights loaded to be tested -
    # this mock avoids requiring a trained classifier file in CI.
    return {"tender_type": "works", "model": "TF-IDF + Linear SVM"}


@patch("ai_engine.ai_service.classify_tender", side_effect=_fake_classify_tender)
def test_analyze_bid_returns_both_classification_and_compliance_sections(mock_classify):
    result = analyze_bid(PAYLOAD)
    assert "tender_classification" in result
    assert "compliance_assessment" in result
    assert result["tender_classification"]["tender_type"] == "works"


@patch("ai_engine.ai_service.classify_tender", side_effect=_fake_classify_tender)
def test_analyze_bid_passes_portal_results_through_to_compliance_engine(mock_classify):
    result = analyze_bid(PAYLOAD)
    checks = result["compliance_assessment"]["checks"]
    assert any(c["requirement"] == "gst" and c["status"] == "pass" for c in checks)


@patch("ai_engine.ai_service.classify_tender", side_effect=_fake_classify_tender)
def test_analyze_bid_handles_missing_portal_results_without_crashing(mock_classify):
    payload = dict(PAYLOAD)
    payload["portal_results"] = {}
    result = analyze_bid(payload)
    assert result["compliance_assessment"]["risk_level"] in {"low", "medium", "high"}


@patch("ai_engine.ai_service.classify_tender", side_effect=_fake_classify_tender)
def test_analyze_bid_handles_missing_optional_fields_gracefully(mock_classify):
    result = analyze_bid({"tender_title": "Supply of laptops"})
    assert result["tender_classification"]["tender_type"] == "works"
    assert result["compliance_assessment"]["compliance_score"] is not None
