
"""
OCR module: turns an uploaded bidder/tender document (image or PDF) into
the two shapes the rest of the AI engine expects:

- plain text, for compliance_engine.assess_compliance()'s bidder_document_text
- per-word text + pixel bounding boxes, for model_adapters.extract_document_structure()

Heavy dependencies (pytesseract, PyMuPDF/fitz, PIL) are imported lazily
inside functions, following the same pattern as model_adapters.py, so
importing this module doesn't force every caller to have them installed.

Requires the Tesseract OCR binary to be installed on the host system
(not a pip package) - e.g. `apt-get install tesseract-ocr` on Debian/Ubuntu,
or `brew install tesseract` on macOS. pytesseract is just a Python wrapper
around that binary and will raise TesseractNotFoundError if it's missing.
"""

from __future__ import annotations

import tempfile
from pathlib import Path
from typing import Any, Dict, List

IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".tiff", ".tif", ".bmp"}


def ocr_image(image_path: str) -> Dict[str, Any]:
    """
    Run OCR on a single image file.

    Returns:
    {
      "text": "full concatenated text",
      "words": ["word1", "word2", ...],
      "bboxes": [[x0, y0, x1, y1], ...],  # pixel coordinates, same image
    }
    Empty-confidence / whitespace-only OCR tokens are dropped.
    """
    import pytesseract
    from PIL import Image

    image = Image.open(image_path).convert("RGB")
    data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)

    words: List[str] = []
    bboxes: List[List[int]] = []

    for i, raw_word in enumerate(data["text"]):
        word = raw_word.strip()
        if not word:
            continue
        x, y, w, h = data["left"][i], data["top"][i], data["width"][i], data["height"][i]
        words.append(word)
        bboxes.append([x, y, x + w, y + h])

    return {
        "text": " ".join(words),
        "words": words,
        "bboxes": bboxes,
    }


def ocr_pdf(pdf_path: str, dpi: int = 200) -> List[Dict[str, Any]]:
    """
    Render each page of a PDF to a PNG and OCR it.

    Returns one dict per page:
    {
      "page_number": 1,
      "image_path": "/tmp/.../page_1.png",  # kept on disk so it can be
                                              # passed straight to
                                              # extract_document_structure()
      "text": "...", "words": [...], "bboxes": [...],
    }
    """
    import fitz  # PyMuPDF

    pages: List[Dict[str, Any]] = []
    render_dir = Path(tempfile.mkdtemp(prefix="ocr_pdf_pages_"))
    zoom = dpi / 72  # PDF default is 72 DPI

    with fitz.open(pdf_path) as doc:
        for page_number, page in enumerate(doc, start=1):
            pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom))
            image_path = render_dir / f"page_{page_number}.png"
            pix.save(str(image_path))

            page_result = ocr_image(str(image_path))
            page_result["page_number"] = page_number
            page_result["image_path"] = str(image_path)
            pages.append(page_result)

    return pages


def ocr_document(file_path: str, dpi: int = 200) -> Dict[str, Any]:
    """
    High-level entry point. Detects image vs PDF by extension and returns:
    {
      "full_text": "text from all pages concatenated - feed this straight
                    into compliance_engine.assess_compliance()'s
                    bidder_document_text",
      "pages": [ {page_number, image_path, text, words, bboxes}, ... ]
              - feed pages[i]["image_path"], ["words"], ["bboxes"] straight
                into model_adapters.extract_document_structure() for
                per-page document structure roles.
    }
    """
    suffix = Path(file_path).suffix.lower()

    if suffix == ".pdf":
        pages = ocr_pdf(file_path, dpi=dpi)
    elif suffix in IMAGE_EXTENSIONS:
        single_page = ocr_image(file_path)
        single_page["page_number"] = 1
        single_page["image_path"] = file_path
        pages = [single_page]
    else:
        raise ValueError(
            f"Unsupported file type '{suffix}'. Expected a PDF or an image "
            f"({', '.join(sorted(IMAGE_EXTENSIONS))})."
        )

    full_text = "\n".join(page["text"] for page in pages)
    return {"full_text": full_text, "pages": pages}
