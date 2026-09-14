
"""
Hybrid bid-compliance engine.

The backend supplies portal_results from GSTN/PAN/Udyam/MCA/etc. connectors.
This module detects requirements, extracts document identifiers, checks
available evidence, and returns an auditable compliance assessment.
"""

from __future__ import annotations

import re
from datetime import datetime, timezone
from typing import Any, Dict, List

PATTERNS = {
    "gstin": r"\b\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[A-Z0-9]\b",
    # PAN 4th char is a constrained entity-type code (P/C/H/F/A/T/B/L/J/G),
    # not any letter. Tightened to cut false positives on random 10-char runs.
    "pan": r"\b[A-Z]{3}[PCHFATBLJG][A-Z]\d{4}[A-Z]\b",
    "udyam": r"\bUDYAM-[A-Z]{2}-\d{2}-\d{6,7}\b",
    "cin": r"\b[A-Z]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}\b",
    "local_content_percent": r"\b(\d{1,3}(?:\.\d+)?)\s*%\s*(?:local\s+content|indigenous\s+content)\b",
}

REQUIREMENT_RULES = {
    "gst": [r"\bgstin?\b", r"\bgoods\s+and\s+services\s+tax\b"],
    "pan": [r"\bpan\b", r"\bpermanent\s+account\s+number\b"],
    "udyam_msme": [r"\budyam\b", r"\bmsme\b", r"\bmicro\s+and\s+small\b"],
    "make_in_india": [r"\bmake\s+in\s+india\b", r"\blocal\s+content\b", r"\bindigenous\s+content\b"],
    "epfo": [r"\bepfo\b", r"\bpf\s+registration\b", r"\bprovident\s+fund\b"],
    "esic": [r"\besic\b", r"\bemployee.?s\s+state\s+insurance\b"],
    "startup_india": [r"\bstartup\s+india\b", r"\bdpiit\b"],
    "nsic": [r"\bnsic\b"],
    "oem_authorization": [r"\boem\b", r"\boriginal\s+equipment\s+manufacturer\b", r"\bauthori[sz]ation\b"],
    "digilocker": [r"\bdigilocker\b"],
    "blacklisting": [r"\bblacklist", r"\bdebar", r"\bnot\s+been\s+blacklisted\b"],
    "mca": [r"\bmca21?\b", r"\bcertificate\s+of\s+incorporation\b", r"\bcin\b"],
}

IDENTIFIER_FOR_REQUIREMENT = {
    "gst": "gstin",
    "pan": "pan",
    "udyam_msme": "udyam",
    "mca": "cin",
}

def _clean(text: str) -> str:
    return re.sub(r"\s+", " ", str(text or "")).strip()

def _find_all(pattern: str, text: str) -> List[str]:
    return sorted(set(re.findall(pattern, text, flags=re.IGNORECASE)))

def extract_bidder_fields(document_text: str) -> Dict[str, Any]:
    """Extract identifier candidates from OCR/document text."""
    text = _clean(document_text).upper()
    fields = {
        key: _find_all(pattern, text)
        for key, pattern in PATTERNS.items()
        if key != "local_content_percent"
    }
    local_content = re.findall(
        PATTERNS["local_content_percent"], text, flags=re.IGNORECASE
    )
    fields["local_content_percent"] = [
        float(value) for value in local_content
    ]
    return fields

def check_gstin_pan_consistency(extracted_fields: Dict[str, Any]) -> Dict[str, Any] | None:
    """
    GSTIN characters 3-12 encode the entity's PAN. If both a GSTIN and a PAN
    were extracted from the same document, flag it when they disagree - this
    catches copy-paste errors or mismatched attachments that pure format
    regexes (the old PATTERNS-only check) would silently pass.
    Returns None when there isn't enough data to compare.
    """
    gstins = extracted_fields.get("gstin", [])
    pans = extracted_fields.get("pan", [])
    if not gstins or not pans:
        return None

    mismatches = [
        (gstin, pan)
        for gstin in gstins
        for pan in pans
        if gstin[2:12] != pan
    ]
    if not mismatches:
        return {"status": "pass", "evidence": "Extracted GSTIN embeds a matching PAN."}
    return {
        "status": "fail",
        "evidence": f"GSTIN does not embed the extracted PAN in {len(mismatches)} pairing(s); possible mismatched or fraudulent document.",
    }

def detect_tender_requirements(tender_text: str) -> List[str]:
    """Detect requirements explicitly mentioned in tender text."""
    text = _clean(tender_text).lower()
    return [
        requirement
        for requirement, patterns in REQUIREMENT_RULES.items()
        if any(re.search(pattern, text, flags=re.IGNORECASE) for pattern in patterns)
    ]

def _portal_status(portal_results: Dict[str, Any], requirement: str) -> str:
    """Normalize backend connector status into verified/failed/review/unavailable."""
    raw = portal_results.get(requirement)
    if raw is None:
        return "unavailable"
    if isinstance(raw, bool):
        return "verified" if raw else "failed"
    if isinstance(raw, dict):
        value = str(raw.get("status", "review")).lower()
    else:
        value = str(raw).lower()

    if value in {"verified", "valid", "active", "pass", "passed", "clear"}:
        return "verified"
    if value in {"failed", "invalid", "inactive", "blacklisted", "debarred", "fail"}:
        return "failed"
    return "review"

def assess_compliance(
    tender_text: str,
    bidder_document_text: str,
    portal_results: Dict[str, Any] | None = None,
) -> Dict[str, Any]:
    """
    Produce a transparent compliance assessment.

    portal_results example:
    {
      "gst": {"status": "verified", "source": "GSTN"},
      "pan": {"status": "verified", "source": "Income Tax"},
      "blacklisting": {"status": "clear", "source": "Debarment list"}
    }
    """
    portal_results = portal_results or {}
    tender_text = _clean(tender_text)
    bidder_document_text = _clean(bidder_document_text)

    requirements = detect_tender_requirements(tender_text)
    extracted_fields = extract_bidder_fields(bidder_document_text)
    checks = []

    for requirement in requirements:
        identifier_key = IDENTIFIER_FOR_REQUIREMENT.get(requirement)
        identifiers = extracted_fields.get(identifier_key, []) if identifier_key else []

        if identifier_key and not identifiers:
            status = "missing"
            evidence = f"No {identifier_key.upper()} found in submitted document text."
        else:
            portal_status = _portal_status(portal_results, requirement)
            if portal_status == "verified":
                status = "pass"
                evidence = f"Verified through supplied {requirement} portal result."
            elif portal_status == "failed":
                status = "fail"
                evidence = f"Supplied {requirement} portal result indicates failure."
            else:
                status = "review"
                evidence = (
                    "Requirement detected, but live verification is unavailable "
                    "or needs procurement-officer review."
                )

        checks.append({
            "requirement": requirement,
            "status": status,
            "identifiers_found": identifiers,
            "evidence": evidence,
        })

    if not requirements:
        checks.append({
            "requirement": "tender_requirements",
            "status": "review",
            "identifiers_found": [],
            "evidence": "No configured statutory requirement was detected in tender text.",
        })

    consistency = check_gstin_pan_consistency(extracted_fields)
    if consistency is not None:
        checks.append({
            "requirement": "gstin_pan_consistency",
            "status": "pass" if consistency["status"] == "pass" else "fail",
            "identifiers_found": extracted_fields.get("gstin", []) + extracted_fields.get("pan", []),
            "evidence": consistency["evidence"],
        })

    score_map = {"pass": 100, "review": 50, "missing": 20, "fail": 0}
    compliance_score = round(
        sum(score_map[check["status"]] for check in checks) / len(checks), 2
    )

    if any(check["status"] == "fail" for check in checks):
        risk_level = "high"
        recommendation = "Do not auto-qualify; review failed compliance checks."
    elif any(check["status"] == "missing" for check in checks):
        risk_level = "high"
        recommendation = "Request missing documents or identifiers before evaluation."
    elif any(check["status"] == "review" for check in checks):
        risk_level = "medium"
        recommendation = "Send unresolved checks to the Procurement Officer."
    else:
        risk_level = "low"
        recommendation = "All detected checks passed; Procurement Officer may proceed."

    return {
        "assessment_timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "detected_requirements": requirements,
        "extracted_fields": extracted_fields,
        "checks": checks,
        "compliance_score": compliance_score,
        "risk_level": risk_level,
        "recommendation": recommendation,
        "audit_note": (
            "This is decision support only. Final qualification/disqualification "
            "remains with the Procurement Officer."
        ),
    }
