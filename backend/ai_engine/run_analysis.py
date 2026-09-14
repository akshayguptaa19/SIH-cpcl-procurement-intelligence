#!/usr/bin/env python3
"""
CLI bridge for invoking analyze_bid_from_file() from Node.js Express backend.
Accepts JSON payload via stdin or file argument and prints JSON result to stdout.
"""

from __future__ import annotations

import json
import os
import sys
import traceback
import warnings
from pathlib import Path

# Suppress warnings completely for clean stdout
warnings.filterwarnings("ignore")
os.environ["PYTHONWARNINGS"] = "ignore"

# Ensure 'backend' directory is on sys.path
SCRIPT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = SCRIPT_DIR.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))


def main():
    try:
        # Read payload from argument or stdin
        if len(sys.argv) > 1 and sys.argv[1] != "-":
            with open(sys.argv[1], "r", encoding="utf-8") as f:
                payload = json.load(f)
        else:
            payload = json.load(sys.stdin)

        tender_title = payload.get("tender_title", "")
        tender_description = payload.get("tender_description", "")
        bidder_document_path = payload.get("bidder_document_path", "")
        portal_results = payload.get("portal_results", {})
        run_document_structure = payload.get("run_document_structure", False)

        if not bidder_document_path:
            raise ValueError("bidder_document_path is required")

        if not os.path.exists(bidder_document_path):
            raise FileNotFoundError(f"Document file not found at: {bidder_document_path}")

        from ai_engine.ai_service import analyze_bid_from_file

        result = analyze_bid_from_file(
            tender_title=tender_title,
            tender_description=tender_description,
            bidder_document_path=bidder_document_path,
            portal_results=portal_results,
            run_document_structure=run_document_structure,
        )

        output = {
            "success": True,
            "data": result,
        }
        print(json.dumps(output, ensure_ascii=False))
        sys.exit(0)

    except Exception as exc:
        err_output = {
            "success": False,
            "error": str(exc),
            "details": traceback.format_exc(),
        }
        print(json.dumps(err_output, ensure_ascii=False))
        sys.exit(1)


if __name__ == "__main__":
    main()
