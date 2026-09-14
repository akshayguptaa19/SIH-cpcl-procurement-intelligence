
import sys
from pathlib import Path

# Portable path: works from any machine/CI as long as src/ sits two levels
# above this file (SIH_GeM_AI/tests/test_compliance_engine.py -> SIH_GeM_AI/src)
PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT / "src"))

from ai_engine.compliance_engine import assess_compliance  # noqa: E402

TENDER_TEXT = """
Bidder must submit valid GSTIN, PAN, Udyam/MSME registration,
Make in India local-content declaration, OEM authorization,
and a declaration confirming no blacklisting or debarment.
"""

# Realistic-format identifiers: GSTIN's characters 3-12 embed the PAN.
MATCHING_DOC = """
ABC Enterprises
GSTIN: 27AAACG1234M1Z5
PAN: AAACG1234M
UDYAM-MH-12-1234567
We declare 65% local content.
"""

MISMATCHED_DOC = """
ABC Enterprises
GSTIN: 27AAACG1234M1Z5
PAN: AAATX9876B
UDYAM-MH-12-1234567
"""

PORTAL_RESULTS_ALL_VERIFIED = {
    "gst": {"status": "verified", "source": "GSTN"},
    "pan": {"status": "verified", "source": "Income Tax"},
    "udyam_msme": {"status": "verified", "source": "Udyam"},
    "make_in_india": {"status": "verified", "source": "Make in India portal"},
    "oem_authorization": {"status": "verified", "source": "OEM letter check"},
    "blacklisting": {"status": "clear", "source": "Debarment List"},
}


def test_detects_all_requirements_mentioned_in_tender_text():
    result = assess_compliance(TENDER_TEXT, MATCHING_DOC, PORTAL_RESULTS_ALL_VERIFIED)
    detected = set(result["detected_requirements"])
    assert {"gst", "pan", "udyam_msme", "make_in_india", "oem_authorization", "blacklisting"} <= detected


def test_extracts_gstin_pan_udyam_from_document_text():
    result = assess_compliance(TENDER_TEXT, MATCHING_DOC, PORTAL_RESULTS_ALL_VERIFIED)
    fields = result["extracted_fields"]
    assert fields["gstin"] == ["27AAACG1234M1Z5"]
    assert fields["pan"] == ["AAACG1234M"]
    assert fields["udyam"] == ["UDYAM-MH-12-1234567"]
    assert fields["local_content_percent"] == [65.0]


def test_all_checks_pass_when_portal_results_verified_and_identifiers_present():
    result = assess_compliance(TENDER_TEXT, MATCHING_DOC, PORTAL_RESULTS_ALL_VERIFIED)
    assert result["risk_level"] == "low"
    assert result["compliance_score"] == 100.0
    assert all(check["status"] == "pass" for check in result["checks"])


def test_missing_required_identifier_is_flagged_and_raises_risk():
    doc_without_pan = "ABC Enterprises\nGSTIN: 27AAACG1234M1Z5\nUDYAM-MH-12-1234567"
    result = assess_compliance(TENDER_TEXT, doc_without_pan, PORTAL_RESULTS_ALL_VERIFIED)
    pan_check = next(c for c in result["checks"] if c["requirement"] == "pan")
    assert pan_check["status"] == "missing"
    assert result["risk_level"] == "high"


def test_gstin_pan_mismatch_is_flagged_as_failed_consistency_check():
    result = assess_compliance(TENDER_TEXT, MISMATCHED_DOC, PORTAL_RESULTS_ALL_VERIFIED)
    consistency_check = next(c for c in result["checks"] if c["requirement"] == "gstin_pan_consistency")
    assert consistency_check["status"] == "fail"
    assert result["risk_level"] == "high"


def test_failed_portal_result_marks_that_check_failed_and_raises_risk():
    portal_results = dict(PORTAL_RESULTS_ALL_VERIFIED)
    portal_results["blacklisting"] = {"status": "blacklisted", "source": "Debarment List"}
    result = assess_compliance(TENDER_TEXT, MATCHING_DOC, portal_results)
    blacklist_check = next(c for c in result["checks"] if c["requirement"] == "blacklisting")
    assert blacklist_check["status"] == "fail"
    assert result["risk_level"] == "high"


def test_unavailable_portal_result_falls_back_to_review_not_a_silent_pass():
    result = assess_compliance(TENDER_TEXT, MATCHING_DOC, portal_results={})
    assert any(check["status"] == "review" for check in result["checks"])
    assert not any(check["status"] == "pass" for check in result["checks"] if check["requirement"] != "gstin_pan_consistency")


def test_audit_note_always_defers_final_decision_to_procurement_officer():
    result = assess_compliance(TENDER_TEXT, MATCHING_DOC, PORTAL_RESULTS_ALL_VERIFIED)
    assert "Procurement Officer" in result["audit_note"]
